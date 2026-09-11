"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEMO_USER, SITE_URL } from "@/lib/constants";
import { resolveAuthError, type AuthErrorKey } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Locale } from "@/i18n/routing";
import type { UserSession } from "@/types";

const DEMO_STORAGE_KEY = "jompancing_auth";

interface AuthResult {
  errorKey: AuthErrorKey | null;
  rawMessage?: string;
}

interface AuthContextValue {
  user: UserSession | null;
  /** Signed-in with email/Google — not anonymous guest. */
  isRegisteredUser: boolean;
  isLoading: boolean;
  isSupabase: boolean;
  loginDemo: () => void;
  loginWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
  ) => Promise<AuthResult>;
  loginWithGoogle: (locale: Locale) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<UserSession>) => Promise<void>;
  /** Creates an anonymous session when needed so guests can publish spots. */
  ensureAuthForPost: () => Promise<UserSession | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getOAuthRedirectTo(locale: Locale): string {
  const base =
    (typeof window !== "undefined"
      ? window.location.origin
      : SITE_URL.replace(/\/$/, "")) || "https://jompancing.my";
  return `${base}/auth/callback?next=/${locale}/profile`;
}

function sessionUserFallback(
  user: {
    id: string;
    email?: string;
    is_anonymous?: boolean;
    user_metadata?: Record<string, unknown>;
  },
): UserSession {
  const meta = user.user_metadata ?? {};
  const isAnonymous = user.is_anonymous === true;
  const name =
    (typeof meta.name === "string" && meta.name) ||
    (typeof meta.full_name === "string" && meta.full_name) ||
    (isAnonymous ? "Guest Angler" : user.email?.split("@")[0]) ||
    "Angler";
  const avatar =
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    (typeof meta.picture === "string" && meta.picture) ||
    undefined;

  return {
    id: user.id,
    name,
    email: user.email ?? "",
    avatar,
    isAnonymous,
  };
}

async function fetchProfile(userId: string): Promise<UserSession | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, avatar_url, home_state_id")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    avatar: data.avatar_url ?? undefined,
    homeStateId: data.home_state_id ?? undefined,
    isAnonymous: false,
  };
}

function mergeAnonymousFlag(
  profile: UserSession | null,
  authUser: { is_anonymous?: boolean },
): UserSession | null {
  if (!profile) return null;
  return {
    ...profile,
    isAnonymous: authUser.is_anonymous === true,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabase = isSupabaseConfigured();

  useEffect(() => {
    if (!isSupabase) {
      try {
        const stored = localStorage.getItem(DEMO_STORAGE_KEY);
        if (stored) setUser(JSON.parse(stored) as UserSession);
      } catch {
        localStorage.removeItem(DEMO_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const supabase = createClient();

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const authUser = data.session.user;
        const profile = await fetchProfile(authUser.id);
        setUser(
          mergeAnonymousFlag(
            profile ?? sessionUserFallback(authUser),
            authUser,
          ),
        );
      }
      setIsLoading(false);
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        if (!session?.user) {
          setUser(null);
          return;
        }
        const authUser = session.user;
        const profile = await fetchProfile(authUser.id);
        setUser(
          mergeAnonymousFlag(
            profile ?? sessionUserFallback(authUser),
            authUser,
          ),
        );
      })();
    });

    return () => subscription.unsubscribe();
  }, [isSupabase]);

  const loginDemo = useCallback(() => {
    setUser(DEMO_USER);
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(DEMO_USER));
  }, []);

  const loginWithEmail = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!isSupabase) {
        return { errorKey: "generic", rawMessage: "Supabase not configured" };
      }
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error) return { errorKey: null };
      return {
        errorKey: resolveAuthError(error.message),
        rawMessage: error.message,
      };
    },
    [isSupabase],
  );

  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string,
      name: string,
    ): Promise<AuthResult> => {
      if (!isSupabase) {
        return { errorKey: "generic", rawMessage: "Supabase not configured" };
      }
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) {
        return {
          errorKey: resolveAuthError(error.message),
          rawMessage: error.message,
        };
      }

      if (data.user?.identities?.length === 0) {
        return { errorKey: "emailAlreadyRegistered" };
      }

      return { errorKey: null };
    },
    [isSupabase],
  );

  const loginWithGoogle = useCallback(
    async (locale: Locale): Promise<AuthResult> => {
      if (!isSupabase) {
        return { errorKey: "generic", rawMessage: "Supabase not configured" };
      }
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getOAuthRedirectTo(locale) },
      });
      if (!error) return { errorKey: null };
      const key = resolveAuthError(error.message);
      return {
        errorKey: key === "generic" ? "oauthFailed" : key,
        rawMessage: error.message,
      };
    },
    [isSupabase],
  );

  const logout = useCallback(async () => {
    if (isSupabase) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(DEMO_STORAGE_KEY);
  }, [isSupabase]);

  const ensureAuthForPost = useCallback(async (): Promise<UserSession | null> => {
    if (user) return user;

    if (!isSupabase) {
      const guest: UserSession = {
        id: `guest-${Date.now().toString(36)}`,
        name: "Guest Angler",
        email: "",
        isAnonymous: true,
      };
      setUser(guest);
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(guest));
      return guest;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error || !data.user) return null;

    const authUser = data.user;
    const profile = await fetchProfile(authUser.id);
    const sessionUser = mergeAnonymousFlag(
      profile ?? sessionUserFallback(authUser),
      authUser,
    );
    setUser(sessionUser);
    return sessionUser;
  }, [user, isSupabase]);

  const updateProfile = useCallback(
    async (patch: Partial<UserSession>) => {
      if (!isSupabase) {
        setUser((prev) => {
          if (!prev) return prev;
          const next = { ...prev, ...patch };
          localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
        return;
      }

      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return;

      setUser((prev) => (prev ? { ...prev, ...patch } : prev));

      const row: Record<string, string | null> = {
        updated_at: new Date().toISOString(),
      };
      if (patch.name !== undefined) row.name = patch.name;
      if (patch.avatar !== undefined) row.avatar_url = patch.avatar ?? null;
      if (patch.homeStateId !== undefined) {
        row.home_state_id = patch.homeStateId ?? null;
      }

      const { error } = await supabase
        .from("profiles")
        .update(row)
        .eq("id", userId);

      if (!error) {
        const profile = await fetchProfile(userId);
        if (profile) setUser(profile);
      }
    },
    [isSupabase],
  );

  const isRegisteredUser = Boolean(user && !user.isAnonymous);

  const value = useMemo(
    () => ({
      user,
      isRegisteredUser,
      isLoading,
      isSupabase,
      loginDemo,
      loginWithEmail,
      signUpWithEmail,
      loginWithGoogle,
      logout,
      updateProfile,
      ensureAuthForPost,
    }),
    [
      user,
      isRegisteredUser,
      isLoading,
      isSupabase,
      loginDemo,
      loginWithEmail,
      signUpWithEmail,
      loginWithGoogle,
      logout,
      updateProfile,
      ensureAuthForPost,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
