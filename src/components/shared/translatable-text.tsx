"use client";

import { useCallback, useMemo, useState } from "react";
import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { isDbThreadId } from "@/lib/supabase/comments";
import {
  getSourceLocale,
  getSourceText,
  hasCachedTranslation,
} from "@/lib/translate/ugc-text";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import type { LocalizedString } from "@/types";

type ContentType = "comment" | "forum_post";
type Field = "body" | "title";

interface TranslatableTextProps {
  text: LocalizedString;
  locale: Locale;
  sourceLocale?: Locale;
  contentType?: ContentType;
  contentId?: string;
  field?: Field;
  className?: string;
  as?: "p" | "span" | "h1";
}

export function TranslatableText({
  text,
  locale,
  sourceLocale,
  contentType = "comment",
  contentId,
  field = "body",
  className,
  as: Tag = "p",
}: TranslatableTextProps) {
  const t = useTranslations("translation");
  const [localized, setLocalized] = useState(text);
  const [showOriginal, setShowOriginal] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(false);

  const resolvedSource = useMemo(
    () => getSourceLocale(localized, sourceLocale),
    [localized, sourceLocale],
  );

  const sourceText = useMemo(
    () => getSourceText(localized, resolvedSource),
    [localized, resolvedSource],
  );

  const cachedTranslation = useMemo(() => {
    if (!hasCachedTranslation(localized, locale, resolvedSource)) return null;
    return localized[locale].trim();
  }, [localized, locale, resolvedSource]);

  const needsTranslate =
    locale !== resolvedSource &&
    !cachedTranslation &&
    sourceText.length >= 2;

  const displayText = useMemo(() => {
    if (showOriginal || locale === resolvedSource) {
      return sourceText;
    }
    return cachedTranslation ?? sourceText;
  }, [cachedTranslation, locale, resolvedSource, showOriginal, sourceText]);

  const canToggle = Boolean(cachedTranslation) && locale !== resolvedSource;

  const handleTranslate = useCallback(async () => {
    setTranslating(true);
    setError(false);

    try {
      const canPersist = contentId && isDbThreadId(contentId);
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          canPersist
            ? {
                contentType,
                id: contentId,
                field,
                targetLocale: locale,
              }
            : {
                text: sourceText,
                sourceLocale: resolvedSource,
                targetLocale: locale,
              },
        ),
      });

      const data = (await response.json()) as {
        translation?: string;
        error?: string;
      };

      if (!response.ok || !data.translation) {
        throw new Error(data.error ?? "Translation failed");
      }

      setLocalized((prev) => ({ ...prev, [locale]: data.translation! }));
      setShowOriginal(false);
    } catch {
      setError(true);
    } finally {
      setTranslating(false);
    }
  }, [
    contentId,
    contentType,
    field,
    locale,
    resolvedSource,
    sourceText,
  ]);

  return (
    <div className="min-w-0">
      <Tag className={className}>{displayText}</Tag>

      {(needsTranslate || canToggle || error) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          {needsTranslate && (
            <button
              type="button"
              onClick={() => void handleTranslate()}
              disabled={translating}
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--ocean)] transition hover:text-[var(--ocean-dark)] disabled:opacity-60",
              )}
            >
              <Languages className="h-3 w-3" />
              {translating ? t("translating") : t(`translateTo.${locale}`)}
            </button>
          )}

          {canToggle && (
            <button
              type="button"
              onClick={() => setShowOriginal((value) => !value)}
              className="text-[11px] font-medium text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
            >
              {showOriginal ? t("showTranslation") : t("showOriginal")}
            </button>
          )}

          {cachedTranslation && !showOriginal && (
            <span className="text-[10px] text-[var(--ink-muted)]">
              {t("machineTranslated")}
            </span>
          )}

          {error && (
            <span className="text-[10px] text-red-600">{t("translateFailed")}</span>
          )}
        </div>
      )}
    </div>
  );
}
