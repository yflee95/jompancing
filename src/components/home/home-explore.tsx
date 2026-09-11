"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useActivities } from "@/components/providers/activities-provider";
import { useForum } from "@/components/providers/forum-provider";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import { HomeEmptyWelcome } from "@/components/home/home-empty-welcome";
import {
  getPublicUserSpots,
  useUserSpots,
} from "@/components/providers/spots-provider";
import { HomeActivitySection } from "@/components/home/home-activity-section";
import { HomeListingsSection } from "@/components/home/home-listings-section";
import {
  HomePaidPondAddCard,
  HomePaidPondPlaceholderCard,
} from "@/components/home/home-paid-pond-shelf-cards";
import { buildListingShelfSlots } from "@/components/marketplace/listing-shelf-cards";
import { HomeDiscoverGrid } from "@/components/home/home-discover-grid";
import { HomeShareSpotBanner } from "@/components/home/home-share-spot-banner";
import { HomeSpotDeck } from "@/components/home/home-spot-deck";
import { HomeSpotRailCard } from "@/components/home/home-spot-rail-card";
import { HomeSpotSection } from "@/components/home/home-spot-section";
import { useUserLocation } from "@/hooks/use-user-location";
import { getDistanceKm } from "@/lib/geo";
import { mergePublicSpots } from "@/lib/merge-public-spots";
import { buildSpotsBrowseHref } from "@/lib/spots-browse";
import { mockArticles, mockForumPosts } from "@/data/mock-data";
import {
  type FishingSpot,
  type WaterType,
} from "@/types";
import type { Locale } from "@/i18n/routing";

type SpotWithDistance = FishingSpot & { distanceKm?: number };

interface HomeExploreProps {
  spots: FishingSpot[];
}

const NEARBY_RADIUS_KM = 120;
const DECK_SIZE = 8;

function sortNearbyHot(a: SpotWithDistance, b: SpotWithDistance): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  const distA = a.distanceKm ?? Infinity;
  const distB = b.distanceKm ?? Infinity;
  if (distA !== distB) return distA - distB;
  return b.commentCount - a.commentCount;
}

function sortNationwideHot(a: FishingSpot, b: FishingSpot): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  return b.commentCount - a.commentCount;
}

export function HomeExplore({ spots }: HomeExploreProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const { userSpots } = useUserSpots();
  const { activities } = useActivities();
  const { listings } = useMarketplace();
  const { userPosts } = useForum();
  const userLocation = useUserLocation(locale);

  const [activeCategory, setActiveCategory] = useState<WaterType | "all">("all");

  const hasGps = userLocation.status === "granted" && userLocation.coords !== null;
  const locating = userLocation.status === "pending";

  const allPublicSpots = useMemo(
    () => mergePublicSpots(spots, getPublicUserSpots(userSpots)),
    [spots, userSpots],
  );

  const spotsWithDistance = useMemo<SpotWithDistance[]>(() => {
    if (!hasGps || !userLocation.coords) {
      return allPublicSpots.map((spot) => ({ ...spot }));
    }
    return allPublicSpots
      .map((spot) => ({
        ...spot,
        distanceKm: getDistanceKm(userLocation.coords!, spot.coordinates),
      }))
      .sort(sortNearbyHot);
  }, [allPublicSpots, hasGps, userLocation.coords]);

  const filterByCategory = <T extends FishingSpot>(list: T[]): T[] =>
    activeCategory === "all"
      ? list
      : list.filter((s) => s.waterType === activeCategory);

  const nearbyPaidPonds = useMemo(() => {
    if (!hasGps) return [];
    return spotsWithDistance
      .filter(
        (s) =>
          s.waterType === "pond" &&
          s.distanceKm !== undefined &&
          s.distanceKm <= NEARBY_RADIUS_KM,
      )
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
      .slice(0, 8);
  }, [spotsWithDistance, hasGps]);

  const deckSpots = useMemo(() => {
    let filtered = filterByCategory(spotsWithDistance);
    if (activeCategory === "all") {
      filtered = filtered.filter((s) => s.waterType !== "pond");
    }

    if (hasGps) {
      const withinRadius = filtered.filter(
        (s) => s.distanceKm !== undefined && s.distanceKm <= NEARBY_RADIUS_KM,
      );
      const pool = withinRadius.length >= 4 ? withinRadius : filtered;
      return [...pool].sort(sortNearbyHot).slice(0, DECK_SIZE);
    }

    return [...filtered].sort(sortNationwideHot).slice(0, DECK_SIZE);
  }, [spotsWithDistance, activeCategory, hasGps]);

  const nearbyHotSpots = useMemo(() => {
    let filtered = filterByCategory(spotsWithDistance);
    if (activeCategory === "all") {
      filtered = filtered.filter((s) => s.waterType !== "pond");
    }

    if (hasGps) {
      const withinRadius = filtered.filter(
        (s) => s.distanceKm !== undefined && s.distanceKm <= NEARBY_RADIUS_KM,
      );
      const pool = withinRadius.length >= 4 ? withinRadius : filtered;
      return [...pool].sort(sortNearbyHot).slice(0, 10);
    }

    return [...filtered].sort(sortNationwideHot).slice(0, 10);
  }, [spotsWithDistance, activeCategory, hasGps]);

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

  const showPaidPondSection = activeCategory === "all";

  const paidPondShelfSlots = useMemo(
    () => buildListingShelfSlots(nearbyPaidPonds, 4),
    [nearbyPaidPonds],
  );

  const nearbyCount = hasGps
    ? spotsWithDistance.filter(
        (s) => s.distanceKm !== undefined && s.distanceKm <= NEARBY_RADIUS_KM,
      ).length
    : 0;

  const locationLabel = useMemo(() => {
    if (locating) return null;
    if (hasGps) {
      return userLocation.region?.label ?? t("yourLocation");
    }
    if (userLocation.status === "denied") {
      return t("locationUnavailable");
    }
    return null;
  }, [locating, hasGps, userLocation, t]);

  const inferredRegion = useMemo(() => {
    if (userLocation.region) {
      return {
        stateId: userLocation.region.stateId,
        districtId: userLocation.region.districtId,
      };
    }
    return undefined;
  }, [userLocation.region]);

  const nearbyPaidPondsHref = buildSpotsBrowseHref({
    stateId: inferredRegion?.stateId,
    districtId: inferredRegion?.districtId,
    water: "pond",
  });

  const forumCount = useMemo(() => {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const post of [...userPosts, ...mockForumPosts]) {
      if (ids.has(post.id) || slugs.has(post.slug)) continue;
      ids.add(post.id);
      slugs.add(post.slug);
    }
    return ids.size;
  }, [userPosts]);

  if (allPublicSpots.length === 0) {
    return (
      <div className="bg-[var(--sand)] pb-24 md:pb-12">
        <HomeEmptyWelcome />
        <div id="home-browse" className="scroll-mt-4 border-t border-[var(--sand-dark)]/30">
          <HomeShareSpotBanner
            locale={locale}
            locating={locating}
            stateId={inferredRegion?.stateId}
            districtId={inferredRegion?.districtId}
            hasGps={hasGps}
          />
          <HomeActivitySection
            activities={activities}
            locale={locale}
            hasGps={hasGps}
            defaultStateId={inferredRegion?.stateId}
            defaultDistrictId={inferredRegion?.districtId}
          />
          <HomeListingsSection locale={locale} />
          <HomeDiscoverGrid
            title={t("discover")}
            labels={{
              forum: t("quickForum"),
              map: t("quickMap"),
              shop: t("quickShop"),
              guide: t("quickGuide"),
            }}
            counts={{
              forum: forumCount,
              map: 0,
              shop: listings.length,
              guide: mockArticles.length,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--sand)] pb-24 md:pb-12">
      <HomeSpotDeck
        spots={deckSpots}
        locale={locale}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        locationLabel={locationLabel}
        locating={locating}
        hasGps={hasGps}
        nearbyCount={nearbyCount}
      />

      <div id="home-browse" className="scroll-mt-4 border-t border-[var(--sand-dark)]/30">
        <HomeShareSpotBanner
          locale={locale}
          locating={locating}
          stateId={inferredRegion?.stateId}
          districtId={inferredRegion?.districtId}
          hasGps={hasGps}
        />

        {showPaidPondSection && (
          <HomeSpotSection
            title={t("nearbyPaidPonds")}
            subtitle={
              hasGps ? t("nearbyPaidPondsHint") : t("nearbyPaidPondsHintNoGps")
            }
            href={nearbyPaidPondsHref}
            linkLabel={tCommon("viewAll")}
            className="border-t border-[var(--sand-dark)]/20 bg-white/40 py-5 md:py-6"
            mobilePeek
          >
            {paidPondShelfSlots.map((slot, index) => {
              if (slot.kind === "item") {
                return (
                  <HomeSpotRailCard
                    key={slot.value.id}
                    spot={slot.value}
                    locale={locale}
                    distanceKm={slot.value.distanceKm}
                    showPaid
                    layout="peek"
                  />
                );
              }
              if (slot.kind === "add") {
                return <HomePaidPondAddCard key="add" />;
              }
              return <HomePaidPondPlaceholderCard key={`placeholder-${index}`} />;
            })}
          </HomeSpotSection>
        )}

        <HomeActivitySection
          activities={activities}
          locale={locale}
          hasGps={hasGps}
          defaultStateId={inferredRegion?.stateId}
          defaultDistrictId={inferredRegion?.districtId}
        />

        <HomeListingsSection locale={locale} />

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
            forum: forumCount,
            map: allPublicSpots.length,
            shop: listings.length,
            guide: mockArticles.length,
          }}
        />
      </div>
    </div>
  );
}
