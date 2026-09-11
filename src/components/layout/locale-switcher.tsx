"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeSwitcherLabels, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LocaleSwitcherProps {
  className?: string;
  variant?: "default" | "light";
}

export function LocaleSwitcher({
  className,
  variant = "default",
}: LocaleSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("locale");
  const isLight = variant === "light";

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full p-0.5",
        isLight
          ? "bg-white/15 backdrop-blur-md ring-1 ring-white/25"
          : "bg-white shadow-sm ring-1 ring-[var(--sand-dark)]/60",
        className,
      )}
      role="group"
      aria-label={t("label")}
    >
      <Globe
        className={cn(
          "ml-1.5 hidden h-3.5 w-3.5 shrink-0 sm:block",
          isLight ? "text-white/80" : "text-[var(--ink-muted)]",
        )}
        aria-hidden
      />
      {(Object.keys(localeSwitcherLabels) as Locale[]).map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wide transition-all sm:px-2.5 sm:py-1 sm:text-[11px]",
            locale === loc
              ? isLight
                ? "bg-white text-[var(--ink)] shadow-sm"
                : "bg-[var(--ocean)] text-white"
              : isLight
                ? "text-white/85 hover:text-white"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
          )}
          aria-label={t(loc)}
          aria-current={locale === loc ? "true" : undefined}
        >
          {localeSwitcherLabels[loc]}
        </button>
      ))}
    </div>
  );
}
