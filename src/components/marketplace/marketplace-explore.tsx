"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ListingCard } from "@/components/marketplace/listing-card";
import {
  buildListingShelfSlots,
  ListingAddCard,
  ListingPlaceholderCard,
} from "@/components/marketplace/listing-shelf-cards";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import type { Locale } from "@/i18n/routing";

interface MarketplaceExploreProps {
  locale: Locale;
}

export function MarketplaceExplore({ locale }: MarketplaceExploreProps) {
  const t = useTranslations("marketplace");
  const { listings, isLoaded } = useMarketplace();

  const shelfSlots = useMemo(
    () =>
      buildListingShelfSlots(
        [...listings].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
        12,
      ),
    [listings],
  );

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
        <PageLoader compact label={t("loadingListings")} />
      ) : (
        <div className="grid min-w-0 grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {shelfSlots.map((slot, index) => {
            if (slot.kind === "item") {
              return (
                <div key={slot.value.id} className="min-w-0">
                  <ListingCard listing={slot.value} locale={locale} />
                </div>
              );
            }
            if (slot.kind === "add") {
              return (
                <div key="add" className="min-w-0">
                  <ListingAddCard layout="grid" />
                </div>
              );
            }
            return (
              <div key={`placeholder-${index}`} className="min-w-0">
                <ListingPlaceholderCard layout="grid" />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
