"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Coordinates } from "@/types";
import type { InferredUserRegion } from "@/lib/reverse-geocode";
import type { Locale } from "@/i18n/routing";

export type UserLocationStatus = "idle" | "pending" | "granted" | "denied";

export interface UserLocationState {
  status: UserLocationStatus;
  coords: Coordinates | null;
  region: InferredUserRegion | null;
}

export interface UserLocationContextValue extends UserLocationState {
  requestLocation: (locale?: Locale) => Promise<UserLocationState>;
}

const initialState: UserLocationState = {
  status: "idle",
  coords: null,
  region: null,
};

const UserLocationContext = createContext<UserLocationContextValue | null>(null);

export function UserLocationProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const [state, setState] = useState<UserLocationState>(initialState);
  const requestInFlight = useRef<Promise<UserLocationState> | null>(null);

  const requestLocation = useCallback((requestLocale: Locale = locale) => {
    if (requestInFlight.current) return requestInFlight.current;

    setState({ status: "pending", coords: null, region: null });
    const request = new Promise<UserLocationState>((resolve) => {
      if (!navigator.geolocation) {
        const unavailable = { status: "denied", coords: null, region: null } as const;
        setState(unavailable);
        resolve(unavailable);
        return;
      }

      const deny = () => {
        const denied = { status: "denied", coords: null, region: null } as const;
        setState(denied);
        resolve(denied);
      };

      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setState({ status: "granted", coords, region: null });

            let region: InferredUserRegion | null = null;
            try {
              const response = await fetch(
                `/api/reverse-geocode?lat=${coords.lat}&lng=${coords.lng}&locale=${requestLocale}`,
              );
              if (response.ok) {
                const data = (await response.json()) as {
                  region: InferredUserRegion | null;
                };
                region = data.region ?? null;
              }
            } catch {
              // The coordinates can still sort nearby spots if area lookup fails.
            }

            const located = { status: "granted", coords, region } as const;
            setState(located);
            resolve(located);
          },
          deny,
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
        );
      } catch {
        deny();
      }
    });

    requestInFlight.current = request;
    const clearRequest = () => {
      if (requestInFlight.current === request) requestInFlight.current = null;
    };
    void request.then(clearRequest, clearRequest);
    return request;
  }, [locale]);

  const value = useMemo(
    () => ({ ...state, requestLocation }),
    [state, requestLocation],
  );

  return (
    <UserLocationContext.Provider value={value}>
      {children}
    </UserLocationContext.Provider>
  );
}

export function useUserLocationFromContext(): UserLocationContextValue | null {
  return useContext(UserLocationContext);
}
