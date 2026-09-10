"use client";

import { Eye, Flame, MessageCircle, Pin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { getLocalizedText, type ForumPost } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ForumThreadCardProps {
  post: ForumPost;
  locale: Locale;
}

export function ForumThreadCard({ post, locale }: ForumThreadCardProps) {
  const t = useTranslations("forum");

  return (
    <Link
      href={`/forum/${post.slug}`}
      className="tap-card block rounded-2xl bg-white p-4 shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/30 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-travel-hover)]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[var(--ocean-light)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--ocean)]">
          {t(`categories.${post.category}`)}
        </span>
        {post.pinned && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-light)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent)]">
            <Pin className="h-3 w-3" />
            {t("pinned")}
          </span>
        )}
        {post.hotScore >= 70 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent)]">
            <Flame className="h-3 w-3" />
            {t("hot")}
          </span>
        )}
      </div>

      <h3 className="font-serif-display mt-2 line-clamp-2 text-base font-semibold text-[var(--ink)]">
        {getLocalizedText(post.title, locale)}
      </h3>

      <p className="mt-1 line-clamp-2 text-sm text-[var(--ink-muted)]">
        {getLocalizedText(post.body, locale)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-[var(--ink-muted)]">
        <span className="font-medium text-[var(--ink)]">{post.authorName}</span>
        <span>·</span>
        <span>{formatDate(post.lastReplyAt, locale)}</span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          {post.replyCount}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {post.viewCount}
        </span>
      </div>
    </Link>
  );
}
