"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Compass,
  MapPin,
  Navigation,
  PlusCircle,
  Sparkles,
  Waves,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useActivities } from "@/components/providers/activities-provider";
import {
  getPublicUserSpots,
  useUserSpots,
} from "@/components/providers/spots-provider";
import { HomeActivitySection } from "@/components/home/home-activity-section";
import { HomeDiscoverGrid } from "@/components/home/home-discover-grid";
import { HomeSpotRailCard } from "@/components/home/home-spot-rail-card";
import { HomeSpotSection } from "@/components/home/home-spot-section";
import {
  DEFAULT_LOCATION,
  getDistanceKm,
} from "@/lib/geo";
import { cn } from "@/lib/utils";
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

const CATEGORIES: { id: WaterType | "all"; icon: typeof Waves }[] = [
  { id: "all", icon: Sparkles },
  { id: "saltwater", icon: Waves },
  { id: "pond", icon: MapPin },
  { id: "river", icon: Compass },
];

const NEARBY_RADIUS_KM = 120;

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
  const tSpots = useTranslations("spots");
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
      {/* Compact header — location-first, no hero banner */}
      <section className="border-b border-[var(--sand-dark)]/35 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--ocean-light)] px-3 py-1.5 text-xs font-medium text-[var(--ocean)]">
                <Navigation
                  className={cn("h-3.5 w-3.5", locating && "animate-pulse")}
                />
                {locating
                  ? t("findingLocation")
                  : `${locationLabel ?? tCommon("nearYou")} · ${t("spotsNearby", { count: nearbyCount })}`}
              </div>
              <h1 className="font-serif-display mt-3 text-2xl font-bold text-[var(--ink)] md:text-3xl lg:text-4xl">
                {t("nearbyHotSpots")}
              </h1>
              <p className="mt-1.5 max-w-xl text-sm text-[var(--ink-muted)] md:text-base">
                {t("homeLead")}
              </p>
            </div>
            <div className="flex shrink-0">
              <Link
                href="/post"
                className="tap-card inline-flex items-center gap-2 rounded-full bg-[var(--ocean)] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[var(--ocean-glow)]"
              >
                <PlusCircle className="h-4 w-4" />
                {t("ctaPost")}
              </Link>
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveCategory(id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  activeCategory === id
                    ? "bg-[var(--ocean)] text-white shadow-md shadow-[var(--ocean-glow)]"
                    : "bg-[var(--sand)] text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/50 hover:text-[var(--ink)]",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {id === "all" ? t("allSpots") : tSpots(id)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Primary: nearby hot spots — ~3.5 cards visible on mobile */}
      <HomeSpotSection
        className="bg-[var(--sand)] pt-2 md:pt-4"
        mobilePeek
      >
        {nearbyHotSpots.length === 0 ? (
          <p className="w-full rounded-2xl bg-white p-8 text-center text-sm text-[var(--ink-muted)] lg:col-span-full">
            {tSpots("noSpots")}
          </p>
        ) : (
          nearbyHotSpots.map((spot, index) => (
            <HomeSpotRailCard
              key={spot.id}
              spot={spot}
              locale={locale}
              distanceKm={spot.distanceKm}
              showHot={spot.featured}
              priority={index < 4}
              layout="peek"
            />
          ))
        )}
      </HomeSpotSection>

      {/* Nearby paid fishing ponds */}
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

      {/* Nationwide — subdued, below the fold feel */}
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

      <HomeActivitySection
        activities={activities}
        locale={locale}
        defaultStateId={inferredRegion.stateId}
        defaultDistrictId={inferredRegion.districtId}
      />

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
  );
}
