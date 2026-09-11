"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ListingCard } from "@/components/marketplace/listing-card";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { Locale } from "@/i18n/routing";

interface MarketplaceExploreProps {
  locale: Locale;
}

export function MarketplaceExplore({ locale }: MarketplaceExploreProps) {
  const t = useTranslations("marketplace");
  const { listings, isLoaded } = useMarketplace();

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-[var(--ink)]">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{t("subtitle")}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/marketplace/new">{t("postListing")}</Link>
        </Button>
      </div>

      <p className="mb-6 rounded-2xl bg-white p-3 text-xs text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/40">
        {t("codDisclaimer")}
      </p>

      {!isLoaded ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--ocean)] border-t-transparent" />
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          title={t("noListings")}
          description={t("beFirstSeller")}
          actionLabel={t("postListing")}
          actionHref="/marketplace/new"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} locale={locale} />
          ))}
        </div>
      )}
    </>
  );
}
