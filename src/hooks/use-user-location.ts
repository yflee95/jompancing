"use client";

import { useCallback, useMemo } from "react";
import { useUserLocationFromContext } from "@/components/providers/user-location-provider";
import type {
  UserLocationContextValue,
  UserLocationState,
} from "@/components/providers/user-location-provider";
import type { Locale } from "@/i18n/routing";

export type { UserLocationState, UserLocationStatus } from "@/components/providers/user-location-provider";

const fallbackDenied: UserLocationState = {
  status: "idle",
  coords: null,
  region: null,
};

const fallbackLocation: UserLocationContextValue = {
  ...fallbackDenied,
  requestLocation: async () => fallbackDenied,
};

/** Shared, opt-in GPS state from UserLocationProvider. */
export function useUserLocation(locale: Locale): UserLocationContextValue {
  const context = useUserLocationFromContext() ?? fallbackLocation;
  const requestFromContext = context.requestLocation;
  const requestLocation = useCallback(
    () => requestFromContext(locale),
    [requestFromContext, locale],
  );
  return useMemo(
    () => ({ ...context, requestLocation }),
    [context, requestLocation],
  );
}
