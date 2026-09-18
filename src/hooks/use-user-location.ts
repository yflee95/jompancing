"use client";

import { useUserLocationFromContext } from "@/components/providers/user-location-provider";
import type { UserLocationState } from "@/components/providers/user-location-provider";
import type { Locale } from "@/i18n/routing";

export type { UserLocationState, UserLocationStatus } from "@/components/providers/user-location-provider";

const fallbackDenied: UserLocationState = {
  status: "denied",
  coords: null,
  region: null,
};

/** Shared GPS state from UserLocationProvider (single prompt per session). */
export function useUserLocation(_locale: Locale): UserLocationState {
  const context = useUserLocationFromContext();
  return context ?? fallbackDenied;
}
