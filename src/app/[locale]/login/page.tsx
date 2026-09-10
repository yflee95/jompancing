"use client";

import { useEffect } from "react";
import { Fish } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const { loginDemo, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/profile");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700">
            <Fish className="h-7 w-7 text-white" />
          </div>
          <CardTitle>{t("welcomeBack")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("email")}
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("password")}
            </label>
            <input
              type="password"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <Button className="w-full">{tCommon("login")}</Button>
          <Button variant="outline" className="w-full">
            {t("continueWithGoogle")}
          </Button>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <p className="relative bg-white px-3 text-center text-xs text-slate-500 dark:bg-slate-900">
              MVP
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-full bg-teal-50 text-teal-800 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-200"
            onClick={() => {
              loginDemo();
              router.push("/");
            }}
          >
            {t("demoLogin")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
