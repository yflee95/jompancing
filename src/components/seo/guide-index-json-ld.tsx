import { mockArticles } from "@/data/mock-data";
import { absoluteUrl, localePath } from "@/lib/seo";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface GuideIndexJsonLdProps {
  locale: Locale;
}

export function GuideIndexJsonLd({ locale }: GuideIndexJsonLdProps) {
  const pageUrl = absoluteUrl(localePath(locale, "/guide"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: pageUrl,
    numberOfItems: mockArticles.length,
    itemListElement: mockArticles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(localePath(locale, `/guide/${article.slug}`)),
      name: getLocalizedText(article.title, locale),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
