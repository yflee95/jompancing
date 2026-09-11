import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GuideArticleContent } from "@/components/guide/guide-article-content";
import { getArticleBySlug } from "@/data/mock-data";
import { buildPageMetadata } from "@/lib/seo";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface GuideArticlePageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateMetadata({ params }: GuideArticlePageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "guide" });
  const article = getArticleBySlug(slug);

  if (!article) {
    return buildPageMetadata({
      locale,
      path: `/guide/${slug}`,
      title: t("notFound"),
      description: t("subtitle"),
    });
  }

  return buildPageMetadata({
    locale,
    path: `/guide/${slug}`,
    title: getLocalizedText(article.title, locale),
    description: getLocalizedText(article.excerpt, locale),
    ogImage: article.imageUrl,
    ogType: "article",
  });
}

export default async function GuideArticlePage({ params }: GuideArticlePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return <GuideArticleContent article={article} locale={locale} />;
}
