"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { HomeListingRailCard } from "@/components/home/home-listing-rail-card";
import { HomeSpotSection } from "@/components/home/home-spot-section";
import { ListingAddCard } from "@/components/marketplace/listing-shelf-cards";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import type { Locale } from "@/i18n/routing";

interface HomeListingsSectionProps {
  locale: Locale;
}

export function HomeListingsSection({ locale }: HomeListingsSectionProps) {
  const t = useTranslations("home");
  const tMarketplace = useTranslations("marketplace");
  const tCommon = useTranslations("common");
  const { isRegisteredUser } = useAuth();
  const { listings, isLoaded, loadError, refreshListings } = useMarketplace();

  const latestListings = useMemo(
    () =>
      [...listings].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [listings],
  );

  if (!isLoaded) return null;

  return (
    <HomeSpotSection
      title={t("latestListings")}
      subtitle={t("latestListingsHint")}
      href="/marketplace"
      linkLabel={tCommon("viewAll")}
      className="border-t border-[var(--sand-dark)]/20 bg-white/50 py-5 md:py-6"
      mobilePeek
    >
      {loadError ? (
        <div className="flex w-full flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-[var(--sand-dark)] bg-white p-5 sm:flex-row sm:items-center md:p-6">
          <p className="text-sm text-[var(--ink-muted)]">
            {tMarketplace("listingsLoadFailed")}
          </p>
          <button
            type="button"
            onClick={() => void refreshListings()}
            className="tap-card inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[var(--ocean)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--ocean-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ocean)]/40"
          >
            {tMarketplace("retryLoad")}
          </button>
        </div>
      ) : latestListings.length === 0 ? (
        <div className="flex w-full flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-[var(--sand-dark)] bg-white p-5 sm:flex-row sm:items-center md:p-6">
          <div>
            <h3 className="font-serif-display text-base font-semibold text-[var(--ink)]">
              {tMarketplace("noListings")}
            </h3>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              {tMarketplace("beFirstSeller")}
            </p>
          </div>
          <Link
            href={isRegisteredUser ? "/marketplace/new" : "/login"}
            className="tap-card inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[var(--ocean)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--ocean-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ocean)]/40"
          >
            {isRegisteredUser
              ? tMarketplace("postListing")
              : tMarketplace("loginToPost")}
          </Link>
        </div>
      ) : (
        <>
          {latestListings.slice(0, 3).map((listing) => (
            <HomeListingRailCard
              key={listing.id}
              listing={listing}
              locale={locale}
            />
          ))}
          <ListingAddCard layout="rail" />
        </>
      )}
    </HomeSpotSection>
  );
}
