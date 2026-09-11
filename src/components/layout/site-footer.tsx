"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--sand-dark)]/40 bg-white py-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-4">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-[var(--ink-muted)]">
          <Link href="/privacy" className="hover:text-[var(--ocean)]">
            {t("footer.privacy")}
          </Link>
          <Link href="/terms" className="hover:text-[var(--ocean)]">
            {t("footer.terms")}
          </Link>
        </nav>
        <p className="text-center text-xs text-[var(--ink-muted)]">
          {t("footer.copyright", { year })}
        </p>
      </div>
    </footer>
  );
}
