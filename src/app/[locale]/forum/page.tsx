import { MessageSquarePlus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ForumCategoryChips } from "@/components/forum/forum-category-chips";
import { ForumPostList } from "@/components/forum/forum-post-list";
import { Button } from "@/components/ui/button";
import { loadPublicForumPosts } from "@/lib/forum-posts-server";
import { buildPageMetadata } from "@/lib/seo";
import type { ForumCategory } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ForumPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: ForumCategory }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "forum" });
  return buildPageMetadata({
    locale,
    path: "/forum",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ForumPage({
  params,
  searchParams,
}: ForumPageProps) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("forum");
  const posts = await loadPublicForumPosts(category);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-24 md:pb-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-[var(--ink)]">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            {t("subtitle")}
            <span className="mx-1.5">·</span>
            {t("topicCount", { count: posts.length })}
          </p>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href="/forum/new">
            <MessageSquarePlus className="h-4 w-4" />
            {t("newTopic")}
          </Link>
        </Button>
      </div>

      <ForumCategoryChips currentCategory={category} />

      <div className="mt-6 space-y-3">
        <ForumPostList
          initialPosts={posts}
          locale={locale}
          category={category}
        />
      </div>
    </div>
  );
}
