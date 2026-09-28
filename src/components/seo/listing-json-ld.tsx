import { absoluteUrl, localePath } from "@/lib/seo";
import { getLocalizedText, type MarketplaceListing } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ListingJsonLdProps {
  listing: MarketplaceListing;
  locale: Locale;
  description: string;
}

export function ListingJsonLd({
  listing,
  locale,
  description,
}: ListingJsonLdProps) {
  const name = getLocalizedText(listing.title, locale);
  const url = absoluteUrl(localePath(locale, `/marketplace/${listing.slug}`));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    image: listing.imageUrl || undefined,
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "MYR",
      availability: "https://schema.org/InStock",
      url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
