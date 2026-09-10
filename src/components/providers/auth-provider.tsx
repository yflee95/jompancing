"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEMO_USER } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { UserSession } from "@/types";

const DEMO_STORAGE_KEY = "jompancing_auth";

interface AuthContextValue {
  user: UserSession | null;
  isLoading: boolean;
  isSupabase: boolean;
  loginDemo: () => void;
  loginWithEmail: (email: string, password: string) => Promise<string | null>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
  ) => Promise<string | null>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<UserSession>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

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
        const profile = await fetchProfile(data.session.user.id);
        setUser(
          profile ?? {
            id: data.session.user.id,
            name:
              data.session.user.user_metadata?.name ??
              data.session.user.email?.split("@")[0] ??
              "Angler",
            email: data.session.user.email ?? "",
          },
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
        const profile = await fetchProfile(session.user.id);
        setUser(
          profile ?? {
            id: session.user.id,
            name:
              session.user.user_metadata?.name ??
              session.user.email?.split("@")[0] ??
              "Angler",
            email: session.user.email ?? "",
          },
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
    async (email: string, password: string): Promise<string | null> => {
      if (!isSupabase) return "Supabase not configured";
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return error?.message ?? null;
    },
    [isSupabase],
  );

  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string,
      name: string,
    ): Promise<string | null> => {
      if (!isSupabase) return "Supabase not configured";
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      return error?.message ?? null;
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

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isSupabase,
      loginDemo,
      loginWithEmail,
      signUpWithEmail,
      logout,
      updateProfile,
    }),
    [
      user,
      isLoading,
      isSupabase,
      loginDemo,
      loginWithEmail,
      signUpWithEmail,
      logout,
      updateProfile,
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
