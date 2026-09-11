import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/client";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { ForumCategory, ForumPost, LocalizedString } from "@/types";
import type { Locale } from "@/i18n/routing";

type ForumRow = {
  id: string;
  slug: string;
  author_id: string;
  title_ms: string;
  title_en: string;
  title_zh: string;
  body_ms: string;
  body_en: string;
  body_zh: string;
  category: string;
  reply_count: number;
  view_count: number;
  pinned: boolean;
  created_at: string;
  last_reply_at: string;
  profiles: { name: string } | null;
};

const FORUM_SELECT = `
  *,
  profiles ( name )
`;

function toLocalized(row: ForumRow, field: "title" | "body"): LocalizedString {
  return {
    ms: row[`${field}_ms`],
    en: row[`${field}_en`],
    zh: row[`${field}_zh`],
  };
}

export function computeForumHotScore(post: {
  replyCount: number;
  viewCount: number;
  createdAt: string;
  pinned?: boolean;
}): number {
  const ageHours =
    (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
  const decay = Math.max(1, ageHours / 24 + 1);
  const base =
    post.replyCount * 12 + post.viewCount * 0.4 + (post.pinned ? 60 : 0);
  return Math.round(base / decay);
}

export function mapForumRow(row: ForumRow): ForumPost {
  const replyCount = row.reply_count;
  const viewCount = row.view_count;
  const createdAt = row.created_at;
  return {
    id: row.id,
    slug: row.slug,
    title: toLocalized(row, "title"),
    body: toLocalized(row, "body"),
    category: row.category as ForumCategory,
    authorName: row.profiles?.name ?? "Angler",
    replyCount,
    viewCount,
    hotScore: computeForumHotScore({
      replyCount,
      viewCount,
      createdAt,
      pinned: row.pinned,
    }),
    createdAt,
    lastReplyAt: row.last_reply_at,
    pinned: row.pinned,
  };
}

export async function fetchForumPostsFromDb(
  category?: ForumCategory,
): Promise<ForumPost[]> {
  const supabase = createPublicSupabaseClient();
  let query = supabase
    .from("forum_posts")
    .select(FORUM_SELECT)
    .order("pinned", { ascending: false })
    .order("last_reply_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as ForumRow[]).map(mapForumRow);
}

export async function fetchForumPostBySlugFromDb(
  slug: string,
): Promise<ForumPost | null> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("forum_posts")
    .select(FORUM_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapForumRow(data as ForumRow);
}

export async function fetchForumPostsClient(
  category?: ForumCategory,
): Promise<ForumPost[]> {
  const supabase = createClient();
  let query = supabase
    .from("forum_posts")
    .select(FORUM_SELECT)
    .order("pinned", { ascending: false })
    .order("last_reply_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as ForumRow[]).map(mapForumRow);
}

export async function insertForumPostToDb(input: {
  title: string;
  body: string;
  category: ForumCategory;
  authorId: string;
  authorName: string;
  locale: Locale;
}): Promise<ForumPost> {
  const supabase = createClient();
  const baseSlug = slugify(input.title) || "topic";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const title = input.title.trim();
  const body = input.body.trim();

  const { data, error } = await supabase
    .from("forum_posts")
    .insert({
      slug,
      author_id: input.authorId,
      title_ms: title,
      title_en: title,
      title_zh: title,
      body_ms: body,
      body_en: body,
      body_zh: body,
      category: input.category,
    })
    .select(FORUM_SELECT)
    .single();

  if (error || !data) throw error ?? new Error("Failed to create forum post");
  return mapForumRow(data as ForumRow);
}
