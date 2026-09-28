import { getTranslations, setRequestLocale } from "next-intl/server";
import { ListingDetailView } from "@/components/marketplace/listing-detail-view";
import { ListingJsonLd } from "@/components/seo/listing-json-ld";
import { buildMarketplaceListingSeo } from "@/lib/content-seo";
import { buildPageMetadata } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchListingBySlugFromDb } from "@/lib/supabase/marketplace";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ListingDetailPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

async function resolveListing(slug: string) {
  if (!isSupabaseConfigured()) return null;
  try {
    return await fetchListingBySlugFromDb(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ListingDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "marketplace" });
  const listing = await resolveListing(slug);

  if (!listing) {
    return buildPageMetadata({
      locale,
      path: `/marketplace/${slug}`,
      title: t("notFound"),
      description: t("subtitle"),
      noIndex: true,
    });
  }

  const seo = buildMarketplaceListingSeo({
    title: getLocalizedText(listing.title, locale),
    description: getLocalizedText(listing.description, locale),
    priceLabel: formatPrice(listing.price),
    t,
  });

  return buildPageMetadata({
    locale,
    path: `/marketplace/${slug}`,
    title: seo.title,
    description: seo.description,
    ogImage: listing.imageUrl || undefined,
    ogType: "article",
  });
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const listing = await resolveListing(slug);
  const t = await getTranslations({ locale, namespace: "marketplace" });

  const seoDescription = listing
    ? buildMarketplaceListingSeo({
        title: getLocalizedText(listing.title, locale),
        description: getLocalizedText(listing.description, locale),
        priceLabel: formatPrice(listing.price),
        t,
      }).description
    : "";

  return (
    <>
      {listing ? (
        <ListingJsonLd
          listing={listing}
          locale={locale}
          description={seoDescription}
        />
      ) : null}
      <ListingDetailView slug={slug} locale={locale} initialListing={listing} />
    </>
  );
}
