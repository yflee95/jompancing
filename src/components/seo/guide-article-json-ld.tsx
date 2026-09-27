import { absoluteUrl, localePath } from "@/lib/seo";
import { getLocalizedText, type GuideArticle } from "@/types";
import type { Locale } from "@/i18n/routing";

interface GuideArticleJsonLdProps {
  article: GuideArticle;
  locale: Locale;
}

export function GuideArticleJsonLd({ article, locale }: GuideArticleJsonLdProps) {
  const title = getLocalizedText(article.title, locale);
  const description = getLocalizedText(article.excerpt, locale);
  const url = absoluteUrl(localePath(locale, `/guide/${article.slug}`));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: article.imageUrl,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "Jompancing",
    },
    publisher: {
      "@type": "Organization",
      name: "Jompancing",
    },
    inLanguage: locale,
    timeRequired: `PT${article.readMinutes}M`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
