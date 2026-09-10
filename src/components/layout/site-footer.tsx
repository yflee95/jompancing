"use client";

import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--sand-dark)]/40 bg-white py-6">
      <p className="text-center text-xs text-[var(--ink-muted)]">
        {t("footer.copyright", { year })}
      </p>
    </footer>
  );
}
