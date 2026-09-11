import { Eye, Flame, MessageCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { UserForumThread } from "@/components/forum/user-forum-thread";
import { CommentsSection } from "@/components/shared/comments-section";
import { Badge } from "@/components/ui/badge";
import {
  getForumPostBySlug,
  getForumRepliesForPost,
} from "@/data/mock-data";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ForumThreadPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateMetadata({ params }: ForumThreadPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "forum" });
  const post = getForumPostBySlug(slug);
  if (!post) {
    return buildPageMetadata({
      locale,
      path: `/forum/${slug}`,
      title: "Thread Not Found",
      description: t("subtitle"),
    });
  }
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
  const t = await getTranslations("forum");

  const post = getForumPostBySlug(slug);
  if (!post) {
    return <UserForumThread slug={slug} locale={locale} />;
  }

  const replies = getForumRepliesForPost(post.id);

  return (
    <article className="mx-auto max-w-3xl px-4 py-6 pb-24 md:pb-8">
      <div className="rounded-3xl bg-white p-5 ring-1 ring-[var(--sand-dark)]/40 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-[var(--ocean-light)] text-[var(--ocean)]">
            {t(`categories.${post.category}`)}
          </Badge>
          {post.hotScore >= 70 && (
            <span className="badge-accent inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold">
              <Flame className="h-3 w-3" />
              {t("hot")}
            </span>
          )}
        </div>

        <h1 className="font-serif-display mt-4 text-2xl font-bold text-[var(--ink)] sm:text-3xl">
          {getLocalizedText(post.title, locale)}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--ink-muted)]">
          <span className="font-semibold text-[var(--ink)]">{post.authorName}</span>
          <span>{formatDate(post.createdAt, locale)}</span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {post.replyCount}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {post.viewCount}
          </span>
        </div>

        <p className="mt-5 text-base leading-relaxed text-[var(--ink-muted)]">
          {getLocalizedText(post.body, locale)}
        </p>
      </div>

      <CommentsSection
        threadId={post.id}
        className="mt-8"
        comments={replies.map((r) => ({
          id: r.id,
          authorName: r.authorName,
          body: r.body,
          createdAt: r.createdAt,
        }))}
        locale={locale}
        title={t("replies")}
      />
    </article>
  );
}
