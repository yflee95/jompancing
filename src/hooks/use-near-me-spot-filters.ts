"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useUserLocation } from "@/hooks/use-user-location";
import {
  getSpotsShowAllPreference,
  setSpotsShowAllPreference,
} from "@/lib/near-me-preferences";
import { parseWaterTypeParam } from "@/lib/water-types";
import type { WaterType } from "@/types";
import type { Locale } from "@/i18n/routing";

interface UseNearMeSpotFiltersOptions {
  locale: Locale;
  filterState?: string;
  filterDistrict?: string;
  filterArea?: string;
  filterWater?: WaterType;
}

function appendPreservedParams(
  params: URLSearchParams,
  filterArea?: string,
  filterWater?: WaterType,
) {
  if (filterArea) params.set("area", filterArea);
  if (filterWater) params.set("water", filterWater);
}

export function useNearMeSpotFilters({
  locale,
  filterState,
  filterDistrict,
  filterArea,
  filterWater,
}: UseNearMeSpotFiltersOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userLocation = useUserLocation(locale);
  const [showAll, setShowAll] = useState(false);

  const waterFromUrl =
    parseWaterTypeParam(searchParams.get("water")) ?? filterWater;
  const areaFromUrl = searchParams.get("area") ?? filterArea;

  useEffect(() => {
    setShowAll(getSpotsShowAllPreference());
  }, []);

  const hasUrlFilter = Boolean(filterState || filterDistrict || filterArea);

  const isNearMeMode = useMemo(() => {
    if (hasUrlFilter || showAll) return false;
    return userLocation.status === "granted" && Boolean(userLocation.region);
  }, [hasUrlFilter, showAll, userLocation.status, userLocation.region]);

  const isResolvingLocation = useMemo(() => {
    if (hasUrlFilter || showAll) return false;
    if (userLocation.status === "pending") return true;
    if (userLocation.status === "granted" && !userLocation.region) {
      return true;
    }
    return false;
  }, [hasUrlFilter, showAll, userLocation.status, userLocation.region]);

  const effectiveState =
    filterState ?? (isNearMeMode ? userLocation.region?.stateId : undefined);
  const effectiveDistrict =
    filterDistrict ?? (isNearMeMode ? userLocation.region?.districtId : undefined);
  const effectiveArea = areaFromUrl;
  const effectiveWater = waterFromUrl;

  useEffect(() => {
    if (!isNearMeMode || hasUrlFilter) return;
    const region = userLocation.region;
    if (!region) return;

    const params = new URLSearchParams();
    params.set("state", region.stateId);
    params.set("district", region.districtId);
    appendPreservedParams(params, areaFromUrl, waterFromUrl);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    isNearMeMode,
    hasUrlFilter,
    userLocation.region,
    pathname,
    router,
    areaFromUrl,
    waterFromUrl,
  ]);

  function chooseShowAll() {
    setSpotsShowAllPreference(true);
    setShowAll(true);
    const params = new URLSearchParams();
    appendPreservedParams(params, areaFromUrl, waterFromUrl);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function chooseNearMe() {
    setSpotsShowAllPreference(false);
    setShowAll(false);
    const region = userLocation.region;
    if (!region) return;
    const params = new URLSearchParams();
    params.set("state", region.stateId);
    params.set("district", region.districtId);
    appendPreservedParams(params, areaFromUrl, waterFromUrl);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return {
    effectiveState,
    effectiveDistrict,
    effectiveArea,
    effectiveWater,
    isNearMeMode,
    isResolvingLocation,
    chooseShowAll,
    chooseNearMe,
    userLocation,
  };
}
