import { Eye, Flame, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CommentsSection } from "@/components/shared/comments-section";
import type { CommentItem } from "@/components/shared/comments-section";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { TranslatableText } from "@/components/shared/translatable-text";
import type { ForumPost } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ForumThreadViewProps {
  post: ForumPost;
  replies: CommentItem[];
  locale: Locale;
}

export async function ForumThreadView({
  post,
  replies,
  locale,
}: ForumThreadViewProps) {
  const t = await getTranslations("forum");

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

        <TranslatableText
          as="h1"
          className="font-serif-display mt-4 text-2xl font-bold text-[var(--ink)] sm:text-3xl"
          text={post.title}
          sourceLocale={post.sourceLocale}
          locale={locale}
          contentType="forum_post"
          contentId={post.id}
          field="title"
        />

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

        <TranslatableText
          as="p"
          className="mt-5 text-base leading-relaxed text-[var(--ink-muted)]"
          text={post.body}
          sourceLocale={post.sourceLocale}
          locale={locale}
          contentType="forum_post"
          contentId={post.id}
          field="body"
        />
      </div>

      <CommentsSection
        threadId={post.id}
        threadType="forum"
        className="mt-8"
        comments={replies}
        locale={locale}
        title={t("replies")}
      />
    </article>
  );
}
