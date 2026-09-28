import { getStateById } from "@/data/malaysia-states";
import { getSpotLocationLine } from "@/lib/spot-location";
import { absoluteUrl, localePath } from "@/lib/seo";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotJsonLdProps {
  spot: FishingSpot;
  locale: Locale;
  /** Meta-optimized description (matches generateMetadata when provided). */
  description?: string;
  breadcrumbSpotsLabel: string;
}

export function SpotJsonLd({
  spot,
  locale,
  description,
  breadcrumbSpotsLabel,
}: SpotJsonLdProps) {
  const name = getLocalizedText(spot.title, locale);
  const bodyDescription =
    description?.trim() || getLocalizedText(spot.description, locale);
  const spotUrl = absoluteUrl(localePath(locale, `/spots/${spot.slug}`));
  const spotsIndexUrl = absoluteUrl(localePath(locale, "/spots"));
  const state = getStateById(spot.stateId);
  const stateUrl = state
    ? absoluteUrl(localePath(locale, `/spots/${state.slug}`))
    : spotsIndexUrl;
  const stateName = state ? getLocalizedText(state.name, locale) : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        name,
        description: bodyDescription,
        url: spotUrl,
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
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Jompancing",
            item: absoluteUrl(localePath(locale, "")),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: breadcrumbSpotsLabel,
            item: spotsIndexUrl,
          },
          ...(stateName
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: stateName,
                  item: stateUrl,
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name,
                  item: spotUrl,
                },
              ]
            : [
                {
                  "@type": "ListItem",
                  position: 3,
                  name,
                  item: spotUrl,
                },
              ]),
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
