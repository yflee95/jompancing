"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useUserLocation } from "@/hooks/use-user-location";
import {
  getSpotsShowAllPreference,
  setSpotsShowAllPreference,
} from "@/lib/near-me-preferences";
import type { Locale } from "@/i18n/routing";

interface UseNearMeSpotFiltersOptions {
  locale: Locale;
  filterState?: string;
  filterDistrict?: string;
  filterArea?: string;
}

export function useNearMeSpotFilters({
  locale,
  filterState,
  filterDistrict,
  filterArea,
}: UseNearMeSpotFiltersOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const userLocation = useUserLocation(locale);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(getSpotsShowAllPreference());
  }, []);

  const hasUrlFilter = Boolean(filterState || filterDistrict || filterArea);

  const isNearMeMode = useMemo(() => {
    if (hasUrlFilter || showAll) return false;
    return (
      userLocation.status === "granted" && Boolean(userLocation.region)
    );
  }, [hasUrlFilter, showAll, userLocation.status, userLocation.region]);

  const isResolvingLocation = useMemo(() => {
    if (hasUrlFilter || showAll) return false;
    if (userLocation.status === "pending") return true;
    if (userLocation.status === "granted" && !userLocation.region) {
      return true;
    }
    return false;
  }, [hasUrlFilter, showAll, userLocation.status, userLocation.region]);

  const effectiveState = filterState ?? (isNearMeMode ? userLocation.region?.stateId : undefined);
  const effectiveDistrict =
    filterDistrict ?? (isNearMeMode ? userLocation.region?.districtId : undefined);
  const effectiveArea = filterArea;

  useEffect(() => {
    if (!isNearMeMode || hasUrlFilter) return;
    const region = userLocation.region;
    if (!region) return;

    const params = new URLSearchParams();
    params.set("state", region.stateId);
    params.set("district", region.districtId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [isNearMeMode, hasUrlFilter, userLocation.region, pathname, router]);

  function chooseShowAll() {
    setSpotsShowAllPreference(true);
    setShowAll(true);
    router.replace(pathname, { scroll: false });
  }

  function chooseNearMe() {
    setSpotsShowAllPreference(false);
    setShowAll(false);
    const region = userLocation.region;
    if (!region) return;
    const params = new URLSearchParams();
    params.set("state", region.stateId);
    params.set("district", region.districtId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return {
    effectiveState,
    effectiveDistrict,
    effectiveArea,
    isNearMeMode,
    isResolvingLocation,
    chooseShowAll,
    chooseNearMe,
    userLocation,
  };
}
