"use client";

import { useEffect, useMemo, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { SpotsMapProps } from "@/components/map/spots-leaflet-map";
import { getGoogleMapsMapId } from "@/lib/google-maps-config";
import { formatDistance } from "@/lib/geo";
import { cn } from "@/lib/utils";
import { getLocalizedText } from "@/types";
import type { Coordinates, FishingSpot } from "@/types";

type SpotPin = FishingSpot & { distanceKm?: number };

function MapCamera({
  spots,
  selectedId,
  center,
}: {
  spots: SpotPin[];
  selectedId?: string | null;
  center: Coordinates;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === "undefined") return;

    if (spots.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      for (const spot of spots) {
        bounds.extend({
          lat: spot.coordinates.lat,
          lng: spot.coordinates.lng,
        });
      }
      map.fitBounds(bounds, 48);
      return;
    }

    if (spots.length === 1) {
      const only = spots[0];
      if (!only) return;
      map.setCenter({
        lat: only.coordinates.lat,
        lng: only.coordinates.lng,
      });
      map.setZoom(12);
      return;
    }

    map.setCenter(center);
    map.setZoom(11);
  }, [map, spots, center]);

  useEffect(() => {
    if (!map || !selectedId) return;
    const spot = spots.find((s) => s.id === selectedId);
    if (!spot) return;
    map.panTo({
      lat: spot.coordinates.lat,
      lng: spot.coordinates.lng,
    });
  }, [map, selectedId, spots]);

  return null;
}

function DeckPin({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "rounded-full border-[3px] border-white shadow-[0_2px_10px_rgba(42,36,24,0.35)] transition-all",
        active ? "h-[34px] w-[34px] bg-[var(--accent)]" : "h-7 w-7 bg-[var(--ocean)]",
      )}
    />
  );
}

function GoogleMapInner({
  spots,
  locale,
  center,
  selectedId,
  onSelectSpot,
  className,
}: SpotsMapProps) {
  const t = useTranslations("map");
  const mapId = getGoogleMapsMapId();
  const [infoId, setInfoId] = useState<string | null>(selectedId ?? null);

  useEffect(() => {
    setInfoId(selectedId ?? null);
  }, [selectedId]);

  const infoSpot = useMemo(
    () => spots.find((s) => s.id === infoId),
    [spots, infoId],
  );

  const defaultCenter = useMemo(
    () => ({
      lat: spots[0]?.coordinates.lat ?? center.lat,
      lng: spots[0]?.coordinates.lng ?? center.lng,
    }),
    [spots, center],
  );

  return (
    <div className={className ?? "h-full w-full"}>
      <Map
        mapId={mapId}
        defaultCenter={defaultCenter}
        defaultZoom={11}
        gestureHandling="greedy"
        disableDefaultUI
        zoomControl
        clickableIcons={false}
        className="h-full w-full"
        style={{ width: "100%", height: "100%" }}
      >
        <MapCamera spots={spots} selectedId={selectedId} center={center} />

        {spots.map((spot) => {
          const position = {
            lat: spot.coordinates.lat,
            lng: spot.coordinates.lng,
          };
          const handleClick = () => {
            onSelectSpot?.(spot.id);
            setInfoId(spot.id);
          };

          if (mapId) {
            return (
              <AdvancedMarker
                key={spot.id}
                position={position}
                onClick={handleClick}
              >
                <DeckPin active={spot.id === selectedId} />
              </AdvancedMarker>
            );
          }

          return (
            <Marker key={spot.id} position={position} onClick={handleClick} />
          );
        })}

        {infoSpot && (
          <InfoWindow
            position={{
              lat: infoSpot.coordinates.lat,
              lng: infoSpot.coordinates.lng,
            }}
            onCloseClick={() => setInfoId(null)}
            pixelOffset={[0, -36]}
          >
            <div className="min-w-[140px] font-sans">
              <p className="font-bold text-[var(--ink)]">
                {getLocalizedText(infoSpot.title, locale)}
              </p>
              {infoSpot.distanceKm !== undefined && (
                <p className="mt-1 text-xs text-[var(--ink-muted)]">
                  {formatDistance(infoSpot.distanceKm)}
                </p>
              )}
              <Link
                href={`/spots/${infoSpot.slug}`}
                className="mt-2 inline-block text-sm font-semibold text-[var(--ocean)]"
              >
                {t("viewSpot")} →
              </Link>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}

function toGoogleMapsLanguage(locale: string) {
  if (locale === "zh") return "zh-CN";
  return locale;
}

export function SpotsGoogleMap({
  apiKey,
  ...props
}: SpotsMapProps & { apiKey: string }) {
  return (
    <APIProvider apiKey={apiKey} language={toGoogleMapsLanguage(props.locale)}>
      <GoogleMapInner {...props} />
    </APIProvider>
  );
}
