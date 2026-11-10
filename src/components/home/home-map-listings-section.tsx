"use client";

import { useTranslations } from "next-intl";
import { HomeSpotRailCard } from "@/components/home/home-spot-rail-card";
import { HomeSpotSection } from "@/components/home/home-spot-section";
import type { Locale } from "@/i18n/routing";
import type { FishingSpot } from "@/types";

interface HomeMapListingsSectionProps {
  spots: FishingSpot[];
  locale: Locale;
}

export function HomeMapListingsSection({ spots, locale }: HomeMapListingsSectionProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  if (spots.length === 0) return null;

  return (
    <HomeSpotSection
      title={t("mapListingsTitle")}
      subtitle={t("mapListingsSubtitle")}
      href="/map"
      linkLabel={tCommon("viewAll")}
      className="border-t border-[var(--sand-dark)]/20 bg-white/50 py-5 md:py-6"
      mobilePeek
    >
      {spots.slice(0, 8).map((spot) => (
        <HomeSpotRailCard
          key={spot.id}
          spot={spot}
          locale={locale}
          layout="peek"
        />
      ))}
    </HomeSpotSection>
  );
}
