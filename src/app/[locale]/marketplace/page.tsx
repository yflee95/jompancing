import { getTranslations, setRequestLocale } from "next-intl/server";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Button } from "@/components/ui/button";
import { mockListings } from "@/data/mock-data";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketplace" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function MarketplacePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("marketplace");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-serif-display text-2xl font-bold text-[var(--ink)]">
          {t("title")}
        </h1>
        <Button variant="outline" size="sm">
          {t("postListing")}
        </Button>
      </div>

      <p className="mb-6 rounded-2xl bg-white p-3 text-xs text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/40">
        {t("codDisclaimer")}
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {mockListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} locale={locale} />
        ))}
      </div>
    </div>
  );
}
