"use client";

import { useEffect, useRef } from "react";
import type { Coordinates, FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";
import { getLocalizedText } from "@/types";
import { formatDistance } from "@/lib/geo";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

type SpotPin = FishingSpot & { distanceKm?: number };

interface SpotsMapProps {
  spots: SpotPin[];
  locale: Locale;
  center: Coordinates;
  selectedId?: string | null;
  onSelectSpot?: (id: string) => void;
  className?: string;
}

export function SpotsMap({
  spots,
  locale,
  center,
  selectedId,
  onSelectSpot,
  className,
}: SpotsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: true,
      }).setView([center.lat, center.lng], 11);

      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      const pinIcon = (active: boolean) =>
        L.divIcon({
          className: "",
          html: `<div style="
            width: ${active ? 34 : 28}px;
            height: ${active ? 34 : 28}px;
            background: ${active ? "#c7674e" : "#1a6570"};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 10px rgba(42,36,24,0.35);
            transition: all 0.2s ease;
          "></div>`,
          iconSize: [active ? 34 : 28, active ? 34 : 28],
          iconAnchor: [active ? 17 : 14, active ? 17 : 14],
        });

      spots.forEach((spot) => {
        const title = getLocalizedText(spot.title, locale);
        const distance =
          spot.distanceKm !== undefined
            ? formatDistance(spot.distanceKm)
            : "";
        const marker = L.marker(
          [spot.coordinates.lat, spot.coordinates.lng],
          { icon: pinIcon(spot.id === selectedId) },
        );

        marker.bindPopup(
          `<div style="font-family: system-ui, sans-serif; min-width: 140px;">
            <p style="font-weight: 700; margin: 0 0 4px; color: #2a2418;">${title}</p>
            ${distance ? `<p style="margin: 0 0 8px; font-size: 12px; color: #73695c;">${distance}</p>` : ""}
            <a href="/${locale}/spots/${spot.slug}" style="color: #1a6570; font-weight: 600; font-size: 13px; text-decoration: none;">→ View spot</a>
          </div>`,
        );

        marker.on("click", () => onSelectSpot?.(spot.id));
        marker.addTo(map);
        markersRef.current.set(spot.id, marker);
      });

      if (spots.length > 1) {
        const bounds = L.latLngBounds(
          spots.map((s) => [s.coordinates.lat, s.coordinates.lng] as [number, number]),
        );
        map.fitBounds(bounds.pad(0.15));
      }

      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    void import("leaflet").then((L) => {
      markersRef.current.forEach((marker, id) => {
        const active = id === selectedId;
        marker.setIcon(
          L.divIcon({
            className: "",
            html: `<div style="
              width: ${active ? 34 : 28}px;
              height: ${active ? 34 : 28}px;
              background: ${active ? "#c7674e" : "#1a6570"};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 10px rgba(42,36,24,0.35);
            "></div>`,
            iconSize: [active ? 34 : 28, active ? 34 : 28],
            iconAnchor: [active ? 17 : 14, active ? 17 : 14],
          }),
        );
      });

      if (selectedId) {
        const spot = spots.find((s) => s.id === selectedId);
        if (spot) {
          mapRef.current?.panTo([spot.coordinates.lat, spot.coordinates.lng], {
            animate: true,
          });
        }
      }
    });
  }, [selectedId, spots]);

  return (
    <div
      ref={containerRef}
      className={className ?? "h-full w-full"}
      aria-label="Fishing spots map"
    />
  );
}
