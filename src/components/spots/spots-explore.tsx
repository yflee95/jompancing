"use client";



import { useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import { useAuth } from "@/components/providers/auth-provider";

import {

  getPublicUserSpots,

  useUserSpots,

} from "@/components/providers/spots-provider";

import { SpotCard } from "@/components/spots/spot-card";

import { SpotFilters } from "@/components/spots/spot-filters";
import { WaterTypeFilters } from "@/components/shared/water-type-filters";

import { Button } from "@/components/ui/button";

import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/page-loader";

import { useNearMeSpotFilters } from "@/hooks/use-near-me-spot-filters";
import { getDistanceKm } from "@/lib/geo";
import { mergePublicSpots } from "@/lib/merge-public-spots";
import { filterSpotsByRegion } from "@/lib/spot-location";

import type { FishingSpot } from "@/types";

import type { Locale } from "@/i18n/routing";

import { cn } from "@/lib/utils";



type SpotsTab = "community" | "mine";



interface SpotsExploreProps {

  initialSpots: FishingSpot[];

  locale: Locale;

  filterState?: string;

  filterDistrict?: string;

  filterArea?: string;
  filterWater?: import("@/types").WaterType;

}



export function SpotsExplore({

  initialSpots,

  locale,

  filterState,

  filterDistrict,

  filterArea,
  filterWater,

}: SpotsExploreProps) {

  const t = useTranslations("spots");

  const tNav = useTranslations("nav");

  const { user } = useAuth();

  const { userSpots, isLoaded } = useUserSpots();

  const [tab, setTab] = useState<SpotsTab>("community");

  const {
    effectiveState,
    effectiveDistrict,
    effectiveArea,
    effectiveWater,
    isNearMeMode,
    isResolvingLocation,
    userLocation,
  } = useNearMeSpotFilters({
    locale,
    filterState,
    filterDistrict,
    filterArea,
    filterWater,
  });



  const communitySpots = useMemo(
    () => mergePublicSpots(initialSpots, getPublicUserSpots(userSpots)),
    [initialSpots, userSpots],
  );



  const mySpots = useMemo(() => {

    if (!user) return [];

    return userSpots.filter((s) => s.authorId === user.id);

  }, [user, userSpots]);



  const baseList = tab === "mine" && user ? mySpots : communitySpots;



  const displayed = useMemo(() => {
    let list = filterSpotsByRegion(
      baseList,
      effectiveState,
      effectiveDistrict,
      effectiveArea,
    );

    if (effectiveWater) {
      list = list.filter((spot) => spot.waterType === effectiveWater);
    }

    if (isNearMeMode && userLocation.coords) {
      list = [...list]
        .map((spot) => ({
          ...spot,
          distanceKm: getDistanceKm(userLocation.coords!, spot.coordinates),
        }))
        .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    }

    return list;
  }, [
    baseList,
    effectiveState,
    effectiveDistrict,
    effectiveArea,
    effectiveWater,
    isNearMeMode,
    userLocation.coords,
  ]);

  const hasRegionFilter = Boolean(
    effectiveState || effectiveDistrict || effectiveArea,
  );



  return (

    <div>

      <div className="mb-4 flex items-start justify-between gap-3">

        <div>

          <h1 className="font-serif-display text-2xl font-bold text-[var(--ink)]">

            {t("title")}

          </h1>

          <p className="mt-1 text-sm text-[var(--ink-muted)]">{t("subtitle")}</p>

        </div>

        <Button size="sm" asChild>

          <Link href="/post">

            <Plus className="h-4 w-4" />

            {tNav("post")}

          </Link>

        </Button>

      </div>



      <SpotFilters
        locale={locale}
        currentState={filterState}
        currentDistrict={filterDistrict}
        currentArea={filterArea}
      />

      <WaterTypeFilters className="mt-3" compact />

      <div className="mb-4 mt-4 flex gap-2">

        <button

          type="button"

          onClick={() => setTab("community")}

          className={cn(

            "rounded-full px-4 py-2 text-sm font-medium transition",

            tab === "community"

              ? "bg-[var(--ocean)] text-white shadow-md shadow-[var(--ocean-glow)]"

              : "bg-white text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/60",

          )}

        >

          {t("tabCommunity")}

        </button>

        {user && (

          <button

            type="button"

            onClick={() => setTab("mine")}

            className={cn(

              "rounded-full px-4 py-2 text-sm font-medium transition",

              tab === "mine"

                ? "bg-[var(--ocean)] text-white shadow-md shadow-[var(--ocean-glow)]"

                : "bg-white text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/60",

            )}

          >

            {t("tabMine")} ({mySpots.length})

          </button>

        )}

      </div>



      {(hasRegionFilter || effectiveWater) && (
        <p className="mb-3 text-sm text-[var(--ink-muted)]">
          {effectiveWater === "pond"
            ? t("paidPondResultCount", { count: displayed.length })
            : t("resultCount", { count: displayed.length })}
        </p>
      )}



      {!isLoaded || (tab === "community" && isResolvingLocation) ? (
        <PageLoader compact label={t("loadingNearby")} />
      ) : displayed.length === 0 ? (

        <EmptyState

          className="mt-2"

          title={

            hasRegionFilter

              ? t("noSpotsInRegion")

              : tab === "mine"

                ? t("noMySpots")

                : t("noSpots")

          }

          description={

            hasRegionFilter ? t("tryDifferentRegion") : tab === "mine" ? t("shareFirst") : t("beFirst")

          }

          actionLabel={tNav("post")}

          actionHref="/post"

        />

      ) : (

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">

          {displayed.map((spot) => (

            <SpotCard

              key={spot.id}

              spot={spot}

              locale={locale}

              showPrivateBadge={tab === "mine"}

            />

          ))}

        </div>

      )}

    </div>

  );

}

