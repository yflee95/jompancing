"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("locale");

  return (
    <div className={cn("flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800", className)}>
      {(Object.keys(localeLabels) as Locale[]).map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={cn(
            "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
            locale === loc
              ? "bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-200"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
          )}
          aria-label={t(loc)}
          aria-current={locale === loc ? "true" : undefined}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
