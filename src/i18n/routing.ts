import { defineRouting } from "next-intl/routing";

export const locales = ["ms", "en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "ms",
  localePrefix: "always",
});

export const localeLabels: Record<Locale, string> = {
  ms: "Bahasa Melayu",
  en: "English",
  zh: "中文",
};
