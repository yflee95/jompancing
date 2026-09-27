import { absoluteUrl, localePath } from "@/lib/seo";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotsRegionItemListJsonLdProps {
  locale: Locale;
  stateId: string;
  spots: FishingSpot[];
}

export function SpotsRegionItemListJsonLd({
  locale,
  stateId,
  spots,
}: SpotsRegionItemListJsonLdProps) {
  if (spots.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: spots.map((spot, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(localePath(locale, `/spots/${spot.slug}`)),
      name: getLocalizedText(spot.title, locale),
    })),
    numberOfItems: spots.length,
    about: stateId,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
