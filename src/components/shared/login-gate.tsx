"use client";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoginGateProps {
  message?: string;
  className?: string;
}

export function LoginGate({ message, className }: LoginGateProps) {
  const t = useTranslations("common");

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-[0_8px_30px_rgba(44,36,22,0.06)] ring-1 ring-[var(--sand-dark)]/40",
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ocean-light)]">
        <Lock className="h-6 w-6 text-[var(--ocean)]" />
      </div>
      <p className="max-w-xs text-sm text-[var(--ink-muted)]">
        {message ?? t("loginToContinue")}
      </p>
      <Button asChild size="lg" className="min-w-[140px]">
        <Link href="/login">{t("login")}</Link>
      </Button>
    </div>
  );
}
