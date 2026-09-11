"use client";

import { Mail, MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmailVerifyPendingProps {
  email: string;
  onBackToLogin: () => void;
}

export function EmailVerifyPending({
  email,
  onBackToLogin,
}: EmailVerifyPendingProps) {
  const t = useTranslations("auth");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
      <Card className="w-full overflow-hidden">
        <div className="bg-gradient-to-br from-[var(--ocean-light)] to-white px-6 py-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ocean)] shadow-lg shadow-[var(--ocean-glow)]">
            <MailCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-serif-display mt-5 text-2xl font-bold text-[var(--ink)]">
            {t("verifyEmailTitle")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
            {t("verifyEmailDesc")}
          </p>
          <p className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[var(--ocean-dark)] ring-1 ring-[var(--ocean)]/20">
            {email}
          </p>
        </div>

        <CardContent className="space-y-4 px-6 pb-8 pt-6">
          <ol className="space-y-2.5 text-sm text-[var(--ink-muted)]">
            <li className="flex gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--ocean-light)] text-xs font-bold text-[var(--ocean)]">
                1
              </span>
              <span>{t("verifyEmailStep1")}</span>
            </li>
            <li className="flex gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--ocean-light)] text-xs font-bold text-[var(--ocean)]">
                2
              </span>
              <span>{t("verifyEmailStep2")}</span>
            </li>
            <li className="flex gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--ocean-light)] text-xs font-bold text-[var(--ocean)]">
                3
              </span>
              <span>{t("verifyEmailStep3")}</span>
            </li>
          </ol>

          <p className="flex items-start gap-2 rounded-2xl bg-[var(--sand)] px-4 py-3 text-xs leading-relaxed text-[var(--ink-muted)]">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ocean)]" />
            {t("verifyEmailSpam")}
          </p>

          <Button className="w-full" size="lg" onClick={onBackToLogin}>
            {t("verifyEmailBackToLogin")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
