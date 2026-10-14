import { absoluteUrl, localePath } from "@/lib/seo";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotsRegionItemListJsonLdProps {
  locale: Locale;
  stateId: string;
  stateName: string;
  spots: FishingSpot[];
  listPath?: string;
  listName?: string;
}

export function SpotsRegionItemListJsonLd({
  locale,
  stateId,
  stateName,
  spots,
  listPath,
  listName,
}: SpotsRegionItemListJsonLdProps) {
  if (spots.length === 0) return null;

  const listUrl = absoluteUrl(
    localePath(locale, listPath ?? `/spots/${stateId}`),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name:
      listName ??
      (locale === "ms"
        ? `Tempat memancing di ${stateName}`
        : locale === "zh"
          ? `${stateName}钓点`
          : `Fishing spots in ${stateName}`),
    url: listUrl,
    itemListElement: spots.map((spot, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(localePath(locale, `/spots/${spot.slug}`)),
      name: getLocalizedText(spot.title, locale),
    })),
    numberOfItems: spots.length,
    about: {
      "@type": "AdministrativeArea",
      name: stateName,
      identifier: stateId,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
