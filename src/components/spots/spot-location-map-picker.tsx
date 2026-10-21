"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";
import { Crosshair, Loader2, MapPin, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { getGoogleMapsApiKey, getGoogleMapsMapId } from "@/lib/google-maps-config";
import { buildGoogleMapsCoordsUrl } from "@/lib/google-maps";
import { isValidMalaysiaCoordinate } from "@/lib/address-query";
import { MALAYSIA_MAP_CENTER } from "@/lib/geo";
import { resolvePinLocation } from "@/lib/resolve-pin-location";
import { searchOsmAddresses, type AddressSuggestion } from "@/lib/address-search";
import { cn } from "@/lib/utils";
import type { Coordinates } from "@/types";
import type { Locale } from "@/i18n/routing";
import type {
  CircleMarker as LeafletCircleMarker,
  Map as LeafletMap,
  Marker as LeafletMarker,
} from "leaflet";
import "leaflet/dist/leaflet.css";

export interface SpotLocationMapPickerProps {
  locale: Locale;
  userCoords: Coordinates | null;
  pinCoords: Coordinates | null;
  onPinCoordsChange: (coords: Coordinates) => void;
  onMapsUrlChange: (url: string) => void;
  onAddressChange: (address: string) => void;
  onRegionMatch?: (region: { stateId: string; districtId: string }) => void;
  className?: string;
}

interface PickerRuntimeProps {
  liveCoords: Coordinates | null;
  requestLocation: () => Promise<Coordinates | null>;
  requestingLocation: boolean;
  locationError: boolean;
}

function MapPlaceSearch({
  locale,
  disabled,
  onSelect,
}: {
  locale: Locale;
  disabled: boolean;
  onSelect: (place: AddressSuggestion) => void;
}) {
  const t = useTranslations("post");
  const listId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      controllerRef.current?.abort();
    },
    [],
  );

  function handleQueryChange(value: string) {
    setQuery(value);
    setResults([]);
    setSearched(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    controllerRef.current?.abort();

    const normalized = value.trim();
    if (normalized.length < 2) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    timerRef.current = setTimeout(() => {
      void searchOsmAddresses("", undefined, normalized, locale, 6, controller.signal).then(
        (matches) => {
          if (controller.signal.aborted) return;
          setResults(matches);
          setLoading(false);
          setSearched(true);
        },
      );
    }, 350);
  }

  return (
    <div className="absolute left-3 right-14 top-3 z-[1001]">
      <div className="relative">
        {loading ? (
          <Loader2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[var(--ocean)]" />
        ) : (
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ocean)]" />
        )}
        <input
          value={query}
          disabled={disabled}
          onChange={(event) => handleQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setResults([]);
          }}
          placeholder={t("placeSearchPlaceholder")}
          aria-label={t("placeSearchPlaceholder")}
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-expanded={results.length > 0 || (searched && query.trim().length >= 2)}
          className="h-11 w-full rounded-xl border-0 bg-white/95 py-2 pl-10 pr-3 text-sm text-[var(--ink)] shadow-md ring-1 ring-black/10 outline-none placeholder:text-[var(--ink-muted)] focus:ring-2 focus:ring-[var(--ocean)]/40 disabled:opacity-60"
        />
      </div>

      {(results.length > 0 || (searched && query.trim().length >= 2)) && (
        <ul
          id={listId}
          role="listbox"
          className="mt-1 max-h-48 overflow-y-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/10"
        >
          {results.map((place) => (
            <li key={place.id} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => {
                  onSelect(place);
                  setQuery(place.label);
                  setResults([]);
                  setSearched(false);
                }}
                className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-[var(--ocean-light)]/60"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ocean)]" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-[var(--ink)]">
                    {place.label}
                  </span>
                  <span className="mt-0.5 block line-clamp-2 text-xs text-[var(--ink-muted)]">
                    {place.address}
                  </span>
                </span>
              </button>
            </li>
          ))}
          {searched && results.length === 0 && (
            <li className="px-3 py-2.5 text-sm text-[var(--ink-muted)]">
              {t("placeSearchNoResults")}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

function PinMarker({ active }: { active?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white bg-[var(--accent)] shadow-[0_2px_10px_rgba(42,36,24,0.35)]",
        active && "scale-110",
      )}
    >
      <MapPin className="h-5 w-5 text-white" />
    </div>
  );
}

function UserDot() {
  return (
    <div className="relative flex h-5 w-5 items-center justify-center">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ocean)]/30" />
      <span className="relative h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--ocean)] shadow-md" />
    </div>
  );
}

function GoogleMapCamera({
  pinCoords,
  liveCoords,
}: {
  pinCoords: Coordinates | null;
  liveCoords: Coordinates | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !pinCoords) return;
    map.panTo({ lat: pinCoords.lat, lng: pinCoords.lng });
    map.setZoom(14);
  }, [map, pinCoords]);

  useEffect(() => {
    if (!map || pinCoords || !liveCoords) return;
    map.panTo({ lat: liveCoords.lat, lng: liveCoords.lng });
    map.setZoom(14);
  }, [map, liveCoords, pinCoords]);

  return null;
}

function GooglePickerInner({
  locale,
  userCoords,
  liveCoords,
  pinCoords,
  onPinCoordsChange,
  onMapsUrlChange,
  onAddressChange,
  onRegionMatch,
  className,
  requestLocation,
  requestingLocation,
  locationError,
}: SpotLocationMapPickerProps & PickerRuntimeProps) {
  const t = useTranslations("post");
  const mapId = getGoogleMapsMapId();
  const resolvingRef = useRef(false);
  const [resolving, setResolving] = useState(false);

  const center = useMemo(
    () => pinCoords ?? liveCoords ?? userCoords ?? MALAYSIA_MAP_CENTER,
    [pinCoords, liveCoords, userCoords],
  );
  const initialZoom = pinCoords || liveCoords || userCoords ? 14 : 6;

  const applyPin = useCallback(
    async (coords: Coordinates) => {
      if (!isValidMalaysiaCoordinate(coords.lat, coords.lng)) return;
      if (resolvingRef.current) return;

      resolvingRef.current = true;
      setResolving(true);
      onPinCoordsChange(coords);
      onMapsUrlChange(buildGoogleMapsCoordsUrl(coords.lat, coords.lng));

      try {
        const resolved = await resolvePinLocation(coords, locale);
        onAddressChange(resolved.address);
        if (resolved.region) {
          onRegionMatch?.({
            stateId: resolved.region.stateId,
            districtId: resolved.region.districtId,
          });
        }
      } finally {
        resolvingRef.current = false;
        setResolving(false);
      }
    },
    [
      locale,
      onAddressChange,
      onMapsUrlChange,
      onPinCoordsChange,
      onRegionMatch,
    ],
  );

  const userPosition = liveCoords ?? userCoords;

  const selectPlace = useCallback(
    (place: AddressSuggestion) => void applyPin(place.coordinates),
    [applyPin],
  );

  return (
    <div className={cn("relative overflow-hidden rounded-2xl ring-1 ring-[var(--sand-dark)]/50", className)}>
      <Map
        mapId={mapId}
        defaultCenter={center}
        defaultZoom={initialZoom}
        gestureHandling="greedy"
        disableDefaultUI
        zoomControl
        clickableIcons={false}
        onClick={(event) => {
          const latLng = event.detail.latLng;
          if (!latLng) return;
          void applyPin({ lat: latLng.lat, lng: latLng.lng });
        }}
        className="h-[min(52vh,420px)] min-h-[280px] w-full sm:min-h-[360px]"
        style={{ width: "100%", height: "100%" }}
      >
        <GoogleMapCamera pinCoords={pinCoords} liveCoords={liveCoords} />

        {userPosition &&
          (mapId ? (
            <AdvancedMarker position={userPosition}>
              <UserDot />
            </AdvancedMarker>
          ) : (
            <Marker position={userPosition} />
          ))}

        {pinCoords &&
          (mapId ? (
            <AdvancedMarker
              position={pinCoords}
              draggable
              onDragEnd={(event) => {
                const latLng = event.latLng;
                if (!latLng) return;
                void applyPin({ lat: latLng.lat(), lng: latLng.lng() });
              }}
            >
              <PinMarker active />
            </AdvancedMarker>
          ) : (
            <Marker position={pinCoords} />
          ))}
      </Map>

      <MapPlaceSearch
        locale={locale}
        disabled={requestingLocation || resolving}
        onSelect={selectPlace}
      />

      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] max-w-[52%] rounded-lg bg-white/90 px-2 py-1">
        <p className="text-[11px] font-medium text-white drop-shadow">
          {t("mapPickerHint")}
        </p>
      </div>

      <div className="absolute bottom-3 right-3 z-[1000] flex items-center gap-2">
        {resolving && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[var(--ink-muted)] shadow">
            <Loader2 className="h-3 w-3 animate-spin" />
            {t("mapPickerResolving")}
          </span>
        )}
        {locationError && (
          <p role="alert" className="max-w-[60%] rounded-xl bg-white/95 px-3 py-2 text-[11px] text-red-700 shadow">
            {t("locationRequestError")}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            void requestLocation().then((coords) => {
              if (coords) void applyPin(coords);
            });
          }}
          disabled={requestingLocation || resolving}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[var(--ocean)] shadow-md transition hover:bg-[var(--ocean-light)] disabled:opacity-50"
        >
          {requestingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Crosshair className="h-4 w-4" />
          )}
          {requestingLocation ? t("locatingMe") : t("useMyLocation")}
        </button>
      </div>
    </div>
  );
}

function GooglePicker(
  props: SpotLocationMapPickerProps &
    PickerRuntimeProps & { apiKey: string },
) {
  return (
    <APIProvider
      apiKey={props.apiKey}
      language={props.locale === "zh" ? "zh-CN" : props.locale}
    >
      <GooglePickerInner {...props} />
    </APIProvider>
  );
}

function LeafletPicker({
  locale,
  userCoords,
  liveCoords,
  pinCoords,
  onPinCoordsChange,
  onMapsUrlChange,
  onAddressChange,
  onRegionMatch,
  className,
  requestLocation,
  requestingLocation,
  locationError,
}: SpotLocationMapPickerProps & PickerRuntimeProps) {
  const t = useTranslations("post");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const pinMarkerRef = useRef<LeafletMarker | null>(null);
  const userMarkerRef = useRef<LeafletCircleMarker | null>(null);
  const [resolving, setResolving] = useState(false);
  const resolvingRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const hasCenteredOnLocationRef = useRef(false);
  const userInteractedRef = useRef(false);

  const initialCenterRef = useRef(
    pinCoords ?? liveCoords ?? userCoords ?? MALAYSIA_MAP_CENTER,
  );
  const initialZoomRef = useRef(pinCoords || liveCoords || userCoords ? 14 : 6);

  const applyPin = useCallback(
    async (coords: Coordinates) => {
      if (!isValidMalaysiaCoordinate(coords.lat, coords.lng)) return;
      if (resolvingRef.current) return;

      resolvingRef.current = true;
      setResolving(true);
      onPinCoordsChange(coords);
      onMapsUrlChange(buildGoogleMapsCoordsUrl(coords.lat, coords.lng));

      try {
        const resolved = await resolvePinLocation(coords, locale);
        onAddressChange(resolved.address);
        if (resolved.region) {
          onRegionMatch?.({
            stateId: resolved.region.stateId,
            districtId: resolved.region.districtId,
          });
        }
      } finally {
        resolvingRef.current = false;
        setResolving(false);
      }
    },
    [
      locale,
      onAddressChange,
      onMapsUrlChange,
      onPinCoordsChange,
      onRegionMatch,
    ],
  );

  const applyPinRef = useRef(applyPin);
  useEffect(() => {
    applyPinRef.current = applyPin;
  }, [applyPin]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: true,
      }).setView(
        [initialCenterRef.current.lat, initialCenterRef.current.lng],
        initialZoomRef.current,
      );

      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      map.on("click", (event) => {
        userInteractedRef.current = true;
        void applyPinRef.current({ lat: event.latlng.lat, lng: event.latlng.lng });
      });

      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      pinMarkerRef.current = null;
      userMarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    void import("leaflet").then((L) => {
      const userPosition = liveCoords ?? userCoords;
      if (userPosition) {
        if (!userMarkerRef.current) {
          userMarkerRef.current = L.circleMarker(
            [userPosition.lat, userPosition.lng],
            {
              radius: 8,
              color: "#ffffff",
              weight: 2,
              fillColor: "#1a6570",
              fillOpacity: 1,
            },
          ).addTo(map);
        } else {
          userMarkerRef.current.setLatLng([userPosition.lat, userPosition.lng]);
        }
      }

      if (pinCoords) {
        if (!pinMarkerRef.current) {
          pinMarkerRef.current = L.marker([pinCoords.lat, pinCoords.lng], {
            draggable: true,
            icon: L.divIcon({
              className: "!border-0 !bg-transparent",
              html: '<div style="display:flex;width:40px;height:40px;align-items:center;justify-content:center;border:3px solid #fff;border-radius:9999px;background:#e2764a;box-shadow:0 2px 10px rgba(42,36,24,.35)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></div>',
              iconSize: [40, 40],
              iconAnchor: [20, 40],
            }),
          })
            .addTo(map)
            .on("dragend", (event) => {
              const marker = event.target as LeafletMarker;
              const latLng = marker.getLatLng();
              userInteractedRef.current = true;
              void applyPinRef.current({ lat: latLng.lat, lng: latLng.lng });
            });
        } else {
          pinMarkerRef.current.setLatLng([pinCoords.lat, pinCoords.lng]);
        }
        map.panTo([pinCoords.lat, pinCoords.lng]);
        map.setZoom(14);
        userInteractedRef.current = true;
      } else if (
        userPosition &&
        !hasCenteredOnLocationRef.current &&
        !userInteractedRef.current
      ) {
        map.setView([userPosition.lat, userPosition.lng], 14);
        hasCenteredOnLocationRef.current = true;
      }
    });
  }, [mapReady, liveCoords, pinCoords, userCoords]);

  const selectPlace = useCallback(
    (place: AddressSuggestion) => void applyPin(place.coordinates),
    [applyPin],
  );

  return (
    <div className={cn("relative overflow-hidden rounded-2xl ring-1 ring-[var(--sand-dark)]/50", className)}>
      <div
        ref={containerRef}
        className="h-[min(52vh,420px)] min-h-[280px] w-full sm:min-h-[360px]"
      />
      <MapPlaceSearch
        locale={locale}
        disabled={requestingLocation || resolving}
        onSelect={selectPlace}
      />
      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] max-w-[52%] rounded-lg bg-white/90 px-2 py-1">
        <p className="text-[11px] font-medium text-white drop-shadow">
          {t("mapPickerHint")}
        </p>
      </div>
      <div className="absolute bottom-3 right-3 z-[1000] flex items-center gap-2">
        {resolving && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[var(--ink-muted)] shadow">
            <Loader2 className="h-3 w-3 animate-spin" />
            {t("mapPickerResolving")}
          </span>
        )}
        {locationError && (
          <p role="alert" className="max-w-[60%] rounded-xl bg-white/95 px-3 py-2 text-[11px] text-red-700 shadow">
            {t("locationRequestError")}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            void requestLocation().then((coords) => {
              if (coords) void applyPin(coords);
            });
          }}
          disabled={requestingLocation || resolving}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[var(--ocean)] shadow-md transition hover:bg-[var(--ocean-light)] disabled:opacity-50"
        >
          {requestingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Crosshair className="h-4 w-4" />
          )}
          {requestingLocation ? t("locatingMe") : t("useMyLocation")}
        </button>
      </div>
    </div>
  );
}

export function SpotLocationMapPicker(props: SpotLocationMapPickerProps) {
  const apiKey = getGoogleMapsApiKey();
  const [requestedCoords, setRequestedCoords] = useState<Coordinates | null>(null);
  const liveCoords = requestedCoords ?? props.userCoords;
  const [requestingLocation, setRequestingLocation] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const requestLocation = useCallback(
    () =>
      new Promise<Coordinates | null>((resolve) => {
        setLocationError(false);
        if (!navigator.geolocation) {
          setLocationError(true);
          resolve(null);
          return;
        }

        setRequestingLocation(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setRequestedCoords(coords);
            setRequestingLocation(false);
            resolve(coords);
          },
          () => {
            setRequestingLocation(false);
            setLocationError(true);
            resolve(null);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
        );
      }),
    [],
  );

  const runtimeProps: PickerRuntimeProps = {
    liveCoords,
    requestLocation,
    requestingLocation,
    locationError,
  };

  if (apiKey) {
    return <GooglePicker {...props} {...runtimeProps} apiKey={apiKey} />;
  }

  return <LeafletPicker {...props} {...runtimeProps} />;
}
