import { pickSpotsForSeoHub } from "@/lib/content-seo";
import { absoluteUrl, localePath } from "@/lib/seo";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

interface HomePageJsonLdProps {
  locale: Locale;
  spots: FishingSpot[];
  description: string;
}

export function HomePageJsonLd({
  locale,
  spots,
  description,
}: HomePageJsonLdProps) {
  const pageUrl = absoluteUrl(localePath(locale, ""));
  const featured = pickSpotsForSeoHub(spots, 12);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name:
          locale === "ms"
            ? "Jompancing — Jom Pancing | Tempat Memancing Malaysia"
            : "Jompancing — Malaysia fishing spots",
        description,
        inLanguage: locale,
        isPartOf: {
          "@id": `${absoluteUrl(localePath(locale, ""))}#website`,
        },
      },
      ...(featured.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": `${pageUrl}#spotlist`,
              name:
                locale === "ms"
                  ? "Tempat memancing popular di Malaysia"
                  : "Popular fishing spots in Malaysia",
              numberOfItems: featured.length,
              itemListElement: featured.map((spot, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: absoluteUrl(localePath(locale, `/spots/${spot.slug}`)),
                name: getLocalizedText(spot.title, locale),
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
