"use client";

import { SpotsGoogleMap } from "@/components/map/spots-google-map";
import {
  SpotsLeafletMap,
  type SpotsMapProps,
} from "@/components/map/spots-leaflet-map";
import { getGoogleMapsApiKey } from "@/lib/google-maps-config";

export type { SpotsMapProps } from "@/components/map/spots-leaflet-map";

export function SpotsMap(props: SpotsMapProps) {
  const apiKey = getGoogleMapsApiKey();

  if (apiKey) {
    return <SpotsGoogleMap {...props} apiKey={apiKey} />;
  }

  return <SpotsLeafletMap {...props} />;
}
