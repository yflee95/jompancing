"use client";

import { useMemo, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SpotsMap } from "@/components/map/spots-map";
import { RegionFilters } from "@/components/shared/region-filters";
import {
  getPublicUserSpots,
  useUserSpots,
} from "@/components/providers/spots-provider";
import { useNearMeSpotFilters } from "@/hooks/use-near-me-spot-filters";
import {
  formatDistance,
  getDistanceKm,
  getSpotsMapCenter,
} from "@/lib/geo";
import { mergePublicSpots } from "@/lib/merge-public-spots";
import { filterSpotsByRegion, getSpotLocationLine } from "@/lib/spot-location";
import { cn } from "@/lib/utils";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

interface MapExploreProps {
  spots: FishingSpot[];
  filterState?: string;
  filterDistrict?: string;
  filterArea?: string;
}

export function MapExplore({
  spots: initialSpots,
  filterState,
  filterDistrict,
  filterArea,
}: MapExploreProps) {
  const { userSpots } = useUserSpots();
  const t = useTranslations("map");
  const tSpots = useTranslations("spots");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const {
    effectiveState,
    effectiveDistrict,
    effectiveArea,
    isResolvingLocation,
    userLocation,
  } = useNearMeSpotFilters({
    locale,
    filterState,
    filterDistrict,
    filterArea,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const hasGps = userLocation.status === "granted" && userLocation.coords !== null;
  const locating = userLocation.status === "pending";

  const publicSpots = useMemo(
    () => mergePublicSpots(initialSpots, getPublicUserSpots(userSpots)),
    [initialSpots, userSpots],
  );

  const regionSpots = useMemo(
    () =>
      filterSpotsByRegion(
        publicSpots,
        effectiveState,
        effectiveDistrict,
        effectiveArea,
      ),
    [publicSpots, effectiveState, effectiveDistrict, effectiveArea],
  );

  const spotsWithDistance = useMemo(() => {
    const base = regionSpots.map((spot) => {
      if (!hasGps || !userLocation.coords) {
        return { ...spot, distanceKm: undefined as number | undefined };
      }
      return {
        ...spot,
        distanceKm: getDistanceKm(userLocation.coords, spot.coordinates),
      };
    });

    if (hasGps) {
      return base.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    }
    return base;
  }, [regionSpots, hasGps, userLocation.coords]);

  const mapCenter = useMemo(
    () => getSpotsMapCenter(regionSpots, userLocation.coords),
    [regionSpots, userLocation.coords],
  );

  const activeSelectedId =
    selectedId && spotsWithDistance.some((s) => s.id === selectedId)
      ? selectedId
      : (spotsWithDistance[0]?.id ?? null);

  const selectedSpot = spotsWithDistance.find((s) => s.id === activeSelectedId);
  const hasRegionFilter = Boolean(
    effectiveState || effectiveDistrict || effectiveArea,
  );

  return (
    <div className="relative flex h-[calc(100dvh-3.5rem-4.25rem)] flex-col md:h-[calc(100dvh-7rem)]">
      <div className="absolute left-4 right-4 top-4 z-[1000] space-y-2 sm:right-auto sm:max-w-sm">
        <p className="rounded-2xl bg-white/95 px-3.5 py-2 text-[11px] leading-snug text-[var(--ink-muted)] shadow-lg backdrop-blur-md">
          {t("exploreNote")}
        </p>
        <div className="flex w-fit items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-xs font-medium text-[var(--ink)] shadow-lg backdrop-blur-md">
          <Navigation
            className={cn(
              "h-3.5 w-3.5 text-[var(--ocean)]",
              locating && "animate-pulse",
            )}
          />
          {locating
            ? t("findingLocation")
            : hasGps
              ? t("spotsOnMap", { count: spotsWithDistance.length })
              : t("locationOffMap")}
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <SpotsMap
          spots={spotsWithDistance}
          locale={locale}
          center={mapCenter}
          selectedId={activeSelectedId}
          onSelectSpot={setSelectedId}
          className="h-full w-full"
        />
      </div>

      <div className="shrink-0 border-t border-[var(--sand-dark)]/40 bg-white/95 pb-safe backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <RegionFilters
            locale={locale}
            currentState={filterState}
            currentDistrict={filterDistrict}
            currentArea={filterArea}
            compact
          />

          {isResolvingLocation ? (
            <p className="mt-3 rounded-2xl bg-[var(--sand)] px-4 py-6 text-center text-sm text-[var(--ink-muted)]">
              {t("findingLocation")}
            </p>
          ) : spotsWithDistance.length === 0 ? (
            <p className="mt-3 rounded-2xl bg-[var(--sand)] px-4 py-6 text-center text-sm text-[var(--ink-muted)]">
              {hasRegionFilter
                ? tSpots("noSpotsInRegion")
                : tSpots("noSpots")}
            </p>
          ) : (
            <>
              <p className="mb-2 mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                {hasGps ? tCommon("nearYou") : t("spotsList")}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory">
                {spotsWithDistance.map((spot) => (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setSelectedId(spot.id)}
                    className={cn(
                      "tap-card shrink-0 snap-start rounded-2xl p-3 text-left ring-1 transition",
                      "w-[calc((100vw-2rem-0.75rem)/2.5)] max-w-[11rem] sm:w-[calc((100vw-2rem-1.125rem)/3.5)]",
                      activeSelectedId === spot.id
                        ? "bg-[var(--ocean-light)] ring-[var(--ocean)]/40"
                        : "bg-[var(--sand)] ring-[var(--sand-dark)]/40 hover:bg-white",
                    )}
                  >
                    <p className="line-clamp-1 text-sm font-semibold text-[var(--ink)]">
                      {getLocalizedText(spot.title, locale)}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[10px] text-[var(--ink-muted)]">
                      {getSpotLocationLine(spot, locale)}
                    </p>
                    {hasGps && spot.distanceKm !== undefined && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--ocean)]">
                        <MapPin className="h-3 w-3" />
                        {formatDistance(spot.distanceKm)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
              {selectedSpot && (
                <Link
                  href={`/spots/${selectedSpot.slug}`}
                  className="mt-3 flex h-11 items-center justify-center rounded-full bg-[var(--ocean)] text-sm font-semibold text-white shadow-md shadow-[var(--ocean-glow)]"
                >
                  {t("viewSpot")}
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
