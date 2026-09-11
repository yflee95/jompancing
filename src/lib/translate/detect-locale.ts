import type { Locale } from "@/i18n/routing";

/** Lightweight locale guess for legacy rows without source_locale. */
export function detectLocaleFromText(text: string): Locale {
  const trimmed = text.trim();
  if (!trimmed) return "ms";

  const hanCount = (trimmed.match(/[\u4e00-\u9fff]/g) ?? []).length;
  if (hanCount / trimmed.length > 0.2) return "zh";

  if (
    /\b(saya|ada|tempat|ikan|kolam|dan|yang|ni|tu|memancing|pancing|lubuk|patin|keli)\b/i.test(
      trimmed,
    )
  ) {
    return "ms";
  }

  return "en";
}
