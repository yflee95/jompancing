"use client";

import { useMemo } from "react";
import { useForum } from "@/components/providers/forum-provider";
import { useTranslations } from "next-intl";
import { ForumThreadCard } from "@/components/forum/forum-thread-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { ForumCategory, ForumPost } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ForumPostListProps {
  initialPosts: ForumPost[];
  locale: Locale;
  category?: ForumCategory;
}

function sortPosts(posts: ForumPost[]): ForumPost[] {
  return [...posts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.hotScore - a.hotScore;
  });
}

export function ForumPostList({
  initialPosts,
  locale,
  category,
}: ForumPostListProps) {
  const t = useTranslations("forum");
  const { userPosts } = useForum();

  const posts = useMemo(() => {
    const merged = [...userPosts, ...initialPosts];
    const filtered = category
      ? merged.filter((p) => p.category === category)
      : merged;
    const seen = new Set<string>();
    const unique = filtered.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
    return sortPosts(unique);
  }, [initialPosts, userPosts, category]);

  if (posts.length === 0) {
    return (
      <EmptyState
        title={t("noTopics")}
        description={t("beFirst")}
        actionLabel={t("newTopic")}
        actionHref="/forum/new"
      />
    );
  }

  return (
    <>
      {posts.map((post) => (
        <ForumThreadCard key={post.id} post={post} locale={locale} />
      ))}
    </>
  );
}
