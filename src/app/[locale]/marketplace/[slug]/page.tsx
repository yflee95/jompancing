import { getTranslations, setRequestLocale } from "next-intl/server";
import { ListingDetailView } from "@/components/marketplace/listing-detail-view";
import { getListingBySlug } from "@/data/mock-data";
import { buildPageMetadata } from "@/lib/seo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchListingBySlugFromDb } from "@/lib/supabase/marketplace";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ListingDetailPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

async function resolveListing(slug: string) {
  const mockListing = getListingBySlug(slug);
  if (mockListing) return mockListing;

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
    });
  }

  return buildPageMetadata({
    locale,
    path: `/marketplace/${slug}`,
    title: getLocalizedText(listing.title, locale),
    description: getLocalizedText(listing.description, locale),
    ogImage: listing.imageUrl || undefined,
    ogType: "article",
  });
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return <ListingDetailView slug={slug} locale={locale} />;
}
