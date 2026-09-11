import { detectLocaleFromText } from "@/lib/translate/detect-locale";
import type { Locale } from "@/i18n/routing";
import type { LocalizedString } from "@/types";

export function createSourceLocalizedText(
  text: string,
  locale: Locale,
): LocalizedString {
  return {
    ms: locale === "ms" ? text : "",
    en: locale === "en" ? text : "",
    zh: locale === "zh" ? text : "",
  };
}

export function getSourceText(
  text: LocalizedString,
  sourceLocale: Locale,
): string {
  const fromSource = text[sourceLocale]?.trim();
  if (fromSource) return fromSource;

  return (
    text.ms?.trim() ||
    text.en?.trim() ||
    text.zh?.trim() ||
    ""
  );
}

export function getSourceLocale(
  text: LocalizedString,
  sourceLocale?: Locale,
): Locale {
  if (sourceLocale) return sourceLocale;

  if (text.ms?.trim() && !text.en?.trim() && !text.zh?.trim()) return "ms";
  if (text.en?.trim() && !text.ms?.trim() && !text.zh?.trim()) return "en";
  if (text.zh?.trim() && !text.ms?.trim() && !text.en?.trim()) return "zh";

  const combined = [text.ms, text.en, text.zh].find(Boolean) ?? "";
  return detectLocaleFromText(combined);
}

export function hasCachedTranslation(
  text: LocalizedString,
  targetLocale: Locale,
  sourceLocale: Locale,
): boolean {
  const source = getSourceText(text, sourceLocale);
  const target = text[targetLocale]?.trim();
  return Boolean(target && target !== source);
}

export function getLocalizedUgcText(
  text: LocalizedString,
  locale: Locale,
  sourceLocale?: Locale,
): string {
  const resolvedSource = getSourceLocale(text, sourceLocale);
  const direct = text[locale]?.trim();
  if (direct && hasCachedTranslation(text, locale, resolvedSource)) {
    return direct;
  }
  return getSourceText(text, resolvedSource);
}
