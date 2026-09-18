import { NextResponse } from "next/server";
import {
  getClientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { z } from "zod";
import { locales, type Locale } from "@/i18n/routing";
import { detectLocaleFromText } from "@/lib/translate/detect-locale";
import { translateUgcText } from "@/lib/translate/nllb-translate";
import {
  getSourceLocale,
  getSourceText,
  hasCachedTranslation,
} from "@/lib/translate/ugc-text";
import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { isDbThreadId } from "@/lib/supabase/comments";
import type { LocalizedString } from "@/types";

const localeSchema = z.enum(locales);

const persistSchema = z.object({
  mode: z.literal("persist").optional(),
  contentType: z.enum(["comment", "forum_post"]),
  id: z.string().uuid(),
  field: z.enum(["body", "title"]),
  targetLocale: localeSchema,
});

const ephemeralSchema = z.object({
  mode: z.literal("ephemeral").optional(),
  text: z.string().min(1).max(4000),
  sourceLocale: localeSchema,
  targetLocale: localeSchema,
});

type CommentRow = {
  source_locale: Locale;
  body_ms: string;
  body_en: string;
  body_zh: string;
};

type ForumRow = {
  source_locale: Locale;
  title_ms: string;
  title_en: string;
  title_zh: string;
  body_ms: string;
  body_en: string;
  body_zh: string;
};

function toLocalizedBody(row: CommentRow): LocalizedString {
  return { ms: row.body_ms, en: row.body_en, zh: row.body_zh };
}

function toLocalizedForumField(
  row: ForumRow,
  field: "body" | "title",
): LocalizedString {
  if (field === "title") {
    return { ms: row.title_ms, en: row.title_en, zh: row.title_zh };
  }
  return { ms: row.body_ms, en: row.body_en, zh: row.body_zh };
}

function columnName(field: "body" | "title", locale: Locale): string {
  return `${field}_${locale}`;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`translate:${ip}`, 40, 60_000);
  if (!limited.ok) {
    return rateLimitResponse(limited.retryAfterSec);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ephemeral = ephemeralSchema.safeParse(payload);
  if (ephemeral.success) {
    const { text, sourceLocale, targetLocale } = ephemeral.data;
    if (sourceLocale === targetLocale) {
      return NextResponse.json({ translation: text.trim(), cached: true });
    }

    try {
      const translation = await translateUgcText(
        text,
        sourceLocale,
        targetLocale,
      );
      return NextResponse.json({ translation, cached: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Translation failed";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  const persist = persistSchema.safeParse(payload);
  if (!persist.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { contentType, id, field, targetLocale } = persist.data;

  if (!isDbThreadId(id)) {
    return NextResponse.json({ error: "Invalid content id" }, { status: 400 });
  }

  try {
    const supabase = createServiceSupabaseClient();

    if (contentType === "comment") {
      const { data, error } = await supabase
        .from("thread_comments")
        .select("source_locale, body_ms, body_en, body_zh")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      }

      const row = data as CommentRow;
      const localized = toLocalizedBody(row);
      const sourceLocale = (row.source_locale ||
        detectLocaleFromText(getSourceText(localized, "ms"))) as Locale;

      if (hasCachedTranslation(localized, targetLocale, sourceLocale)) {
        return NextResponse.json({
          translation: localized[targetLocale].trim(),
          cached: true,
          sourceLocale,
        });
      }

      const sourceText = getSourceText(localized, sourceLocale);
      const translation = await translateUgcText(
        sourceText,
        sourceLocale,
        targetLocale,
      );

      const { error: updateError } = await supabase
        .from("thread_comments")
        .update({ [columnName("body", targetLocale)]: translation })
        .eq("id", id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ translation, cached: false, sourceLocale });
    }

    const { data, error } = await supabase
      .from("forum_posts")
      .select(
        "source_locale, title_ms, title_en, title_zh, body_ms, body_en, body_zh",
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ error: "Forum post not found" }, { status: 404 });
    }

    const row = data as ForumRow;
    const localized = toLocalizedForumField(row, field);
    const sourceLocale = (row.source_locale ||
      getSourceLocale(localized)) as Locale;

    if (hasCachedTranslation(localized, targetLocale, sourceLocale)) {
      return NextResponse.json({
        translation: localized[targetLocale].trim(),
        cached: true,
        sourceLocale,
      });
    }

    const sourceText = getSourceText(localized, sourceLocale);
    const translation = await translateUgcText(
      sourceText,
      sourceLocale,
      targetLocale,
    );

    const { error: updateError } = await supabase
      .from("forum_posts")
      .update({ [columnName(field, targetLocale)]: translation })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ translation, cached: false, sourceLocale });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Translation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
