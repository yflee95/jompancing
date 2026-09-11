"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { HomeListingRailCard } from "@/components/home/home-listing-rail-card";
import { HomeSpotSection } from "@/components/home/home-spot-section";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import type { Locale } from "@/i18n/routing";

interface HomeListingsSectionProps {
  locale: Locale;
}

export function HomeListingsSection({ locale }: HomeListingsSectionProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const { listings, isLoaded } = useMarketplace();

  const latestListings = useMemo(
    () =>
      [...listings]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 4),
    [listings],
  );

  if (!isLoaded || latestListings.length === 0) return null;

  return (
    <HomeSpotSection
      title={t("latestListings")}
      subtitle={t("latestListingsHint")}
      href="/marketplace"
      linkLabel={tCommon("viewAll")}
      className="border-t border-[var(--sand-dark)]/20 bg-white/50 py-5 md:py-6"
      mobilePeek
    >
      {latestListings.map((listing) => (
        <HomeListingRailCard key={listing.id} listing={listing} locale={locale} />
      ))}
    </HomeSpotSection>
  );
}
