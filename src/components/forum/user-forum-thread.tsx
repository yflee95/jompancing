"use client";

import { Eye, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForum } from "@/components/providers/forum-provider";
import { CommentsSection } from "@/components/shared/comments-section";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface UserForumThreadProps {
  slug: string;
  locale: Locale;
}

export function UserForumThread({ slug, locale }: UserForumThreadProps) {
  const t = useTranslations("forum");
  const { getUserPostBySlug, isLoaded } = useForum();
  const post = getUserPostBySlug(slug);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--ocean)] border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[var(--ink-muted)]">{t("notFound")}</p>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-6 pb-24 md:pb-8">
      <div className="rounded-3xl bg-white p-5 ring-1 ring-[var(--sand-dark)]/40 sm:p-8">
        <Badge className="bg-[var(--ocean-light)] text-[var(--ocean)]">
          {t(`categories.${post.category}`)}
        </Badge>
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
        comments={[]}
        locale={locale}
        title={t("replies")}
      />
    </article>
  );
}
