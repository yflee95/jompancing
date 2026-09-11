import { getSpotLocationLine } from "@/lib/spot-location";
import { absoluteUrl, localePath } from "@/lib/seo";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotJsonLdProps {
  spot: FishingSpot;
  locale: Locale;
}

export function SpotJsonLd({ spot, locale }: SpotJsonLdProps) {
  const name = getLocalizedText(spot.title, locale);
  const description = getLocalizedText(spot.description, locale);
  const url = absoluteUrl(localePath(locale, `/spots/${spot.slug}`));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name,
    description,
    url,
    image: spot.imageUrl || undefined,
    geo: {
      "@type": "GeoCoordinates",
      latitude: spot.coordinates.lat,
      longitude: spot.coordinates.lng,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: spot.googleAddress,
      addressLocality: getSpotLocationLine(spot, locale),
      addressCountry: "MY",
    },
    ...(spot.authorName
      ? {
          author: {
            "@type": "Person",
            name: spot.authorName,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
