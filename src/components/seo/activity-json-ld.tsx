import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { absoluteUrl, localePath } from "@/lib/seo";
import { getLocalizedText, type Activity } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ActivityJsonLdProps {
  activity: Activity;
  locale: Locale;
}

export function ActivityJsonLd({ activity, locale }: ActivityJsonLdProps) {
  const name = getLocalizedText(activity.title, locale);
  const description = getLocalizedText(activity.description, locale);
  const venue = getLocalizedText(activity.venue, locale);
  const url = absoluteUrl(localePath(locale, `/activities/${activity.slug}`));
  const state = getStateById(activity.stateId);
  const district = getDistrictById(activity.stateId, activity.districtId);

  const locality = [
    venue,
    district ? getLocalizedText(district.name, locale) : "",
    state ? getLocalizedText(state.name, locale) : "",
  ]
    .filter(Boolean)
    .join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    url,
    image: activity.imageUrl || undefined,
    startDate: activity.startDate,
    endDate: activity.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: locality,
        addressCountry: "MY",
      },
    },
    organizer: {
      "@type": "Organization",
      name: activity.organizer,
    },
    ...(activity.fee !== undefined
      ? {
          offers: {
            "@type": "Offer",
            price: activity.fee,
            priceCurrency: "MYR",
            availability: "https://schema.org/InStock",
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
