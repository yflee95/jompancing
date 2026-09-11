import type { Coordinates } from "@/types";

const EARTH_RADIUS_KM = 6371;

export function getDistanceKm(from: Coordinates, to: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

/** Map viewport centre when GPS is unavailable (not treated as user location). */
export const MALAYSIA_MAP_CENTER: Coordinates = {
  lat: 4.2105,
  lng: 101.9758,
};

export function getSpotsMapCenter(
  spots: { coordinates: Coordinates }[],
  userCoords: Coordinates | null,
): Coordinates {
  if (userCoords) return userCoords;
  if (spots.length === 0) return MALAYSIA_MAP_CENTER;
  const lat =
    spots.reduce((sum, s) => sum + s.coordinates.lat, 0) / spots.length;
  const lng =
    spots.reduce((sum, s) => sum + s.coordinates.lng, 0) / spots.length;
  return { lat, lng };
}
