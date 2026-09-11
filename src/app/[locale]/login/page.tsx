"use client";

import { FormEvent, useEffect, useState } from "react";
import { Fish } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { type AuthErrorKey } from "@/lib/auth-errors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import type { Locale } from "@/i18n/routing";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function authErrorMessage(
  t: ReturnType<typeof useTranslations>,
  key: AuthErrorKey,
  raw?: string,
): string {
  if (key === "generic" && raw) return raw;
  return t(`errors.${key}`);
}

export default function LoginPage() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const {
    loginDemo,
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    user,
    isLoading,
    isSupabase,
  } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/profile");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "oauth") {
      setError(t("errors.oauthFailed"));
    }
  }, [t]);

  async function handleGoogleLogin() {
    setError(null);
    setGoogleLoading(true);
    const result = await loginWithGoogle(locale);
    setGoogleLoading(false);
    if (result.errorKey) {
      setError(authErrorMessage(t, result.errorKey, result.rawMessage));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result =
      mode === "login"
        ? await loginWithEmail(email.trim(), password)
        : await signUpWithEmail(
            email.trim(),
            password,
            name.trim() || "Angler",
          );

    setSubmitting(false);

    if (result.errorKey) {
      setError(authErrorMessage(t, result.errorKey, result.rawMessage));
      if (result.errorKey === "emailAlreadyRegistered") {
        setMode("login");
      }
      return;
    }

    router.push("/profile");
  }

  if (isLoading || user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--ocean)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ocean)] shadow-lg shadow-[var(--ocean)]/25">
            <Fish className="h-8 w-8 text-white" />
          </div>
          <CardTitle>
            {mode === "login" ? t("welcomeBack") : t("createAccount")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSupabase ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 border-[var(--sand-dark)]/60 bg-white"
                size="lg"
                disabled={googleLoading || submitting}
                onClick={() => void handleGoogleLogin()}
              >
                <GoogleIcon className="h-5 w-5" />
                {googleLoading ? tCommon("loading") : t("continueWithGoogle")}
              </Button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--sand-dark)]/60" />
                </div>
                <p className="relative mx-auto w-fit bg-white px-3 text-xs text-[var(--ink-muted)]">
                  {t("orEmail")}
                </p>
              </div>

              <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">{t("displayName")}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ali"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}
                <Button
                  className="w-full"
                  size="lg"
                  type="submit"
                  disabled={submitting || googleLoading}
                >
                  {submitting
                    ? tCommon("loading")
                    : mode === "login"
                      ? tCommon("login")
                      : t("createAccount")}
                </Button>
                <button
                  type="button"
                  className="w-full text-center text-sm text-[var(--ocean)]"
                  onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setError(null);
                  }}
                >
                  {mode === "login" ? t("noAccount") : t("hasAccount")}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  disabled
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">{t("password")}</Label>
                <Input id="password" type="password" disabled />
              </div>
              <Button className="w-full" size="lg" disabled>
                {tCommon("login")}
              </Button>
            </>
          )}

          {!isSupabase && (
            <>
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--sand-dark)]/60" />
                </div>
                <p className="relative mx-auto w-fit bg-white px-3 text-xs text-[var(--ink-muted)]">
                  demo
                </p>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  loginDemo();
                  router.push("/");
                }}
              >
                {t("demoLogin")}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
