import type { CommentItem } from "@/components/shared/comments-section";
import { createClient } from "@/lib/supabase/client";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { LocalizedString } from "@/types";
import type { Locale } from "@/i18n/routing";

export type ThreadType = "spot" | "forum";

type CommentRow = {
  id: string;
  thread_type: string;
  thread_id: string;
  body_ms: string;
  body_en: string;
  body_zh: string;
  created_at: string;
  profiles: { name: string } | { name: string }[] | null;
};

const COMMENT_SELECT = `
  id,
  thread_type,
  thread_id,
  body_ms,
  body_en,
  body_zh,
  created_at,
  profiles ( name )
`;

export function isDbThreadId(threadId: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    threadId,
  );
}

function profileName(
  profiles: CommentRow["profiles"],
): string {
  if (!profiles) return "Angler";
  if (Array.isArray(profiles)) return profiles[0]?.name ?? "Angler";
  return profiles.name ?? "Angler";
}

function mapCommentRow(row: CommentRow): CommentItem {
  return {
    id: row.id,
    authorName: profileName(row.profiles),
    body: {
      ms: row.body_ms,
      en: row.body_en,
      zh: row.body_zh,
    },
    createdAt: row.created_at,
  };
}

export async function fetchCommentsForThreadServer(
  threadType: ThreadType,
  threadId: string,
): Promise<CommentItem[]> {
  if (!isDbThreadId(threadId)) return [];

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("thread_comments")
    .select(COMMENT_SELECT)
    .eq("thread_type", threadType)
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as CommentRow[]).map(mapCommentRow);
}

export async function fetchCommentsForThread(
  threadType: ThreadType,
  threadId: string,
): Promise<CommentItem[]> {
  if (!isDbThreadId(threadId)) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("thread_comments")
    .select(COMMENT_SELECT)
    .eq("thread_type", threadType)
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as CommentRow[]).map(mapCommentRow);
}

export async function insertCommentToDb(input: {
  threadType: ThreadType;
  threadId: string;
  authorId: string;
  body: string;
  locale: Locale;
}): Promise<CommentItem> {
  const supabase = createClient();
  const text = input.body.trim();
  const localized: LocalizedString = {
    ms: text,
    en: text,
    zh: text,
    [input.locale]: text,
  };

  const { data, error } = await supabase
    .from("thread_comments")
    .insert({
      thread_type: input.threadType,
      thread_id: input.threadId,
      author_id: input.authorId,
      body_ms: localized.ms,
      body_en: localized.en,
      body_zh: localized.zh,
    })
    .select(COMMENT_SELECT)
    .single();

  if (error || !data) throw error ?? new Error("Failed to post comment");
  return mapCommentRow(data as CommentRow);
}
