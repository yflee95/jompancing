"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface LoginGateProps {
  message?: string;
  className?: string;
}

export function LoginGate({ message, className }: LoginGateProps) {
  const t = useTranslations("common");

  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-2xl border border-dashed border-teal-300/60 bg-teal-50/50 p-6 text-center dark:border-teal-700/60 dark:bg-teal-950/20 ${className ?? ""}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50">
        <Lock className="h-5 w-5 text-teal-600 dark:text-teal-300" />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {message ?? t("loginToContinue")}
      </p>
      <Button asChild size="sm">
        <Link href="/login">{t("login")}</Link>
      </Button>
    </div>
  );
}
