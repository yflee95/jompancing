import { getTranslations, setRequestLocale } from "next-intl/server";
import { ForumThreadView } from "@/components/forum/forum-thread-view";
import { UserForumThread } from "@/components/forum/user-forum-thread";
import {
  getForumPostBySlug,
  getForumRepliesForPost,
} from "@/data/mock-data";
import { shouldUseMockContent } from "@/lib/mock-content";
import { buildPageMetadata } from "@/lib/seo";
import { fetchCommentsForThreadServer } from "@/lib/supabase/comments";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchForumPostBySlugFromDb } from "@/lib/supabase/forum";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ForumThreadPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

async function resolveForumPost(slug: string) {
  if (isSupabaseConfigured()) {
    try {
      const dbPost = await fetchForumPostBySlugFromDb(slug);
      if (dbPost) return { post: dbPost, source: "db" as const };
    } catch {
      /* fall through */
    }
  }

  if (shouldUseMockContent()) {
    const mockPost = getForumPostBySlug(slug);
    if (mockPost) return { post: mockPost, source: "mock" as const };
  }

  return null;
}

export async function generateMetadata({ params }: ForumThreadPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "forum" });
  const resolved = await resolveForumPost(slug);

  if (!resolved) {
    return buildPageMetadata({
      locale,
      path: `/forum/${slug}`,
      title: t("notFound"),
      description: t("subtitle"),
      noIndex: true,
    });
  }

  const { post } = resolved;
  return buildPageMetadata({
    locale,
    path: `/forum/${slug}`,
    title: getLocalizedText(post.title, locale),
    description: getLocalizedText(post.body, locale),
    ogType: "article",
  });
}

export default async function ForumThreadPage({ params }: ForumThreadPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const resolved = await resolveForumPost(slug);
  if (!resolved) {
    return <UserForumThread slug={slug} locale={locale} />;
  }

  const { post, source } = resolved;

  if (source === "mock") {
    const replies = getForumRepliesForPost(post.id).map((r) => ({
      id: r.id,
      authorName: r.authorName,
      body: r.body,
      createdAt: r.createdAt,
    }));
    return <ForumThreadView post={post} replies={replies} locale={locale} />;
  }

  let dbReplies: Awaited<ReturnType<typeof fetchCommentsForThreadServer>> = [];
  try {
    dbReplies = await fetchCommentsForThreadServer("forum", post.id);
  } catch {
    /* empty replies */
  }

  return <ForumThreadView post={post} replies={dbReplies} locale={locale} />;
}
