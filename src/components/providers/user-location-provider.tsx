"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Coordinates } from "@/types";
import type { InferredUserRegion } from "@/lib/reverse-geocode";
import type { Locale } from "@/i18n/routing";

export type UserLocationStatus = "pending" | "granted" | "denied";

export interface UserLocationState {
  status: UserLocationStatus;
  coords: Coordinates | null;
  region: InferredUserRegion | null;
}

const initialState: UserLocationState = {
  status: "pending",
  coords: null,
  region: null,
};

const UserLocationContext = createContext<UserLocationState | null>(null);

export function UserLocationProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const [state, setState] = useState<UserLocationState>(initialState);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ status: "denied", coords: null, region: null });
      return;
    }

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setState({ status: "granted", coords, region: null });

        void fetch(
          `/api/reverse-geocode?lat=${coords.lat}&lng=${coords.lng}&locale=${locale}`,
        )
          .then((res) => (res.ok ? res.json() : { region: null }))
          .then((data: { region: InferredUserRegion | null }) => {
            if (cancelled) return;
            setState((prev) =>
              prev.status === "granted"
                ? { ...prev, region: data.region ?? null }
                : prev,
            );
          })
          .catch(() => {
            /* coords still usable */
          });
      },
      () => {
        if (!cancelled) {
          setState({ status: "denied", coords: null, region: null });
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const value = useMemo(() => state, [state]);

  return (
    <UserLocationContext.Provider value={value}>
      {children}
    </UserLocationContext.Provider>
  );
}

export function useUserLocationFromContext(): UserLocationState | null {
  return useContext(UserLocationContext);
}
