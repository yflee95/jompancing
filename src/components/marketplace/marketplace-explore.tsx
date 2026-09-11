"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ListingCard } from "@/components/marketplace/listing-card";
import { ListingAddCard } from "@/components/marketplace/listing-shelf-cards";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/page-loader";
import type { Locale } from "@/i18n/routing";

interface MarketplaceExploreProps {
  locale: Locale;
}

export function MarketplaceExplore({ locale }: MarketplaceExploreProps) {
  const t = useTranslations("marketplace");
  const { listings, isLoaded } = useMarketplace();

  const sortedListings = useMemo(
    () =>
      [...listings].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [listings],
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif-display text-2xl font-bold text-[var(--ink)]">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{t("subtitle")}</p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 self-start" asChild>
          <Link href="/marketplace/new">{t("postListing")}</Link>
        </Button>
      </div>

      <p className="mb-6 rounded-2xl bg-white p-3 text-xs leading-relaxed text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/40">
        {t("codDisclaimer")}
      </p>

      {!isLoaded ? (
        <PageLoader compact label={t("loadingListings")} />
      ) : sortedListings.length === 0 ? (
        <EmptyState
          className="mt-4"
          title={t("noListings")}
          description={t("beFirstSeller")}
          actionLabel={t("postListing")}
          actionHref="/marketplace/new"
        />
      ) : (
        <div className="grid grid-cols-2 items-stretch gap-3 pb-2 md:grid-cols-3 md:gap-4">
          {sortedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} locale={locale} />
          ))}
          <ListingAddCard layout="grid" />
        </div>
      )}
    </>
  );
}
