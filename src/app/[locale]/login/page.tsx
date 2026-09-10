"use client";

import { FormEvent, useEffect, useState } from "react";
import { Fish } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export default function LoginPage() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const {
    loginDemo,
    loginWithEmail,
    signUpWithEmail,
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

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/profile");
    }
  }, [user, isLoading, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const err =
      mode === "login"
        ? await loginWithEmail(email.trim(), password)
        : await signUpWithEmail(email.trim(), password, name.trim() || "Angler");

    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }

    if (mode === "signup") {
      setError(t("checkEmailConfirm"));
    } else {
      router.push("/profile");
    }
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
              <Button className="w-full" size="lg" type="submit" disabled={submitting}>
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
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" type="email" placeholder="you@example.com" disabled />
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
