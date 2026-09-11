"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useActivities } from "@/components/providers/activities-provider";
import {
  getPublicUserSpots,
  useUserSpots,
} from "@/components/providers/spots-provider";
import { HomeActivitySection } from "@/components/home/home-activity-section";
import { HomeDiscoverGrid } from "@/components/home/home-discover-grid";
import { HomeShareSpotBanner } from "@/components/home/home-share-spot-banner";
import { HomeSpotDeck } from "@/components/home/home-spot-deck";
import { HomeSpotRailCard } from "@/components/home/home-spot-rail-card";
import { HomeSpotSection } from "@/components/home/home-spot-section";
import {
  DEFAULT_LOCATION,
  getDistanceKm,
} from "@/lib/geo";
import { mockArticles, mockForumPosts } from "@/data/mock-data";
import {
  type FishingSpot,
  type MarketplaceListing,
  type WaterType,
} from "@/types";
import type { Locale } from "@/i18n/routing";

type SpotWithDistance = FishingSpot & { distanceKm: number };

interface HomeExploreProps {
  spots: FishingSpot[];
  listings: MarketplaceListing[];
}

const NEARBY_RADIUS_KM = 120;
const DECK_SIZE = 8;

function sortNearbyHot(a: SpotWithDistance, b: SpotWithDistance): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
  return b.commentCount - a.commentCount;
}

function sortNationwideHot(a: FishingSpot, b: FishingSpot): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return b.commentCount - a.commentCount;
}

export function HomeExplore({ spots, listings }: HomeExploreProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const { userSpots } = useUserSpots();
  const { activities } = useActivities();

  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [locating, setLocating] = useState(true);
  const [activeCategory, setActiveCategory] = useState<WaterType | "all">("all");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocating(false);
      setLocationLabel(t("defaultLocation"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationLabel(t("yourLocation"));
        setLocating(false);
      },
      () => {
        setLocationLabel(t("defaultLocation"));
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, [t]);

  const allPublicSpots = useMemo(() => {
    const publicUser = getPublicUserSpots(userSpots);
    const seen = new Set<string>();
    return [...publicUser, ...spots].filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return s.visibility === "public";
    });
  }, [spots, userSpots]);

  const spotsWithDistance = useMemo<SpotWithDistance[]>(
    () =>
      allPublicSpots
        .map((spot) => ({
          ...spot,
          distanceKm: getDistanceKm(userLocation, spot.coordinates),
        }))
        .sort(sortNearbyHot),
    [allPublicSpots, userLocation],
  );

  const filterByCategory = <T extends FishingSpot>(list: T[]): T[] =>
    activeCategory === "all"
      ? list
      : list.filter((s) => s.waterType === activeCategory);

  const nearbyPaidPonds = useMemo(() => {
    return spotsWithDistance
      .filter(
        (s) => s.waterType === "pond" && s.distanceKm <= NEARBY_RADIUS_KM,
      )
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 8);
  }, [spotsWithDistance]);

  const deckSpots = useMemo(() => {
    let filtered = filterByCategory(spotsWithDistance);
    if (activeCategory === "all") {
      filtered = filtered.filter((s) => s.waterType !== "pond");
    }
    const withinRadius = filtered.filter((s) => s.distanceKm <= NEARBY_RADIUS_KM);
    const pool = withinRadius.length >= 4 ? withinRadius : filtered;
    return [...pool].sort(sortNearbyHot).slice(0, DECK_SIZE);
  }, [spotsWithDistance, activeCategory]);

  const nearbyHotSpots = useMemo(() => {
    let filtered = filterByCategory(spotsWithDistance);
    if (activeCategory === "all") {
      filtered = filtered.filter((s) => s.waterType !== "pond");
    }
    const withinRadius = filtered.filter((s) => s.distanceKm <= NEARBY_RADIUS_KM);
    const pool = withinRadius.length >= 4 ? withinRadius : filtered;
    return [...pool].sort(sortNearbyHot).slice(0, 10);
  }, [spotsWithDistance, activeCategory]);

  const nearbyIds = useMemo(
    () => new Set(nearbyHotSpots.map((s) => s.id)),
    [nearbyHotSpots],
  );

  const nationwideHotSpots = useMemo(() => {
    return filterByCategory(allPublicSpots)
      .filter((s) => !nearbyIds.has(s.id))
      .sort(sortNationwideHot)
      .slice(0, 6);
  }, [allPublicSpots, activeCategory, nearbyIds]);

  const showPaidPondSection =
    activeCategory === "all" && nearbyPaidPonds.length > 0;

  const nearbyCount = spotsWithDistance.filter(
    (s) => s.distanceKm <= NEARBY_RADIUS_KM,
  ).length;

  const inferredRegion = useMemo(() => {
    const nearest = spotsWithDistance[0];
    if (!nearest) {
      return { stateId: "johor", districtId: "johor-bahru" };
    }
    return {
      stateId: nearest.stateId,
      districtId: nearest.districtId,
    };
  }, [spotsWithDistance]);

  if (allPublicSpots.length === 0) return null;

  return (
    <div className="bg-[var(--sand)] pb-24 md:pb-12">
      <HomeSpotDeck
        spots={deckSpots}
        locale={locale}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        locationLabel={locationLabel}
        locating={locating}
        nearbyCount={nearbyCount}
      />

      <div id="home-browse" className="scroll-mt-4 border-t border-[var(--sand-dark)]/30">
        <HomeShareSpotBanner
          locale={locale}
          locating={locating}
          stateId={inferredRegion.stateId}
          districtId={inferredRegion.districtId}
        />

        {showPaidPondSection && (
          <HomeSpotSection
            title={t("nearbyPaidPonds")}
            subtitle={t("nearbyPaidPondsHint")}
            href="/spots"
            linkLabel={tCommon("viewAll")}
            className="border-t border-[var(--sand-dark)]/20 bg-white/40 py-5 md:py-6"
            mobilePeek
          >
            {nearbyPaidPonds.map((spot) => (
              <HomeSpotRailCard
                key={spot.id}
                spot={spot}
                locale={locale}
                distanceKm={spot.distanceKm}
                showPaid
                layout="peek"
              />
            ))}
          </HomeSpotSection>
        )}

        <HomeActivitySection
          activities={activities}
          locale={locale}
          defaultStateId={inferredRegion.stateId}
          defaultDistrictId={inferredRegion.districtId}
        />

        {nationwideHotSpots.length > 0 && (
          <HomeSpotSection
            title={t("nationwideHotSpots")}
            href="/spots"
            linkLabel={tCommon("viewAll")}
            className="border-t border-[var(--sand-dark)]/15 bg-[var(--sand)] py-4 md:py-5"
            titleClassName="font-sans text-sm font-medium text-[var(--ink-muted)]"
            linkClassName="text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ocean)]"
            mobilePeek
          >
            {nationwideHotSpots.map((spot) => (
              <HomeSpotRailCard
                key={spot.id}
                spot={spot}
                locale={locale}
                showHot={spot.featured}
                layout="peek"
              />
            ))}
          </HomeSpotSection>
        )}

        <HomeDiscoverGrid
          title={t("discover")}
          labels={{
            forum: t("quickForum"),
            map: t("quickMap"),
            shop: t("quickShop"),
            guide: t("quickGuide"),
          }}
          counts={{
            forum: mockForumPosts.length,
            map: allPublicSpots.length,
            shop: listings.length,
            guide: mockArticles.length,
          }}
        />
      </div>
    </div>
  );
}
