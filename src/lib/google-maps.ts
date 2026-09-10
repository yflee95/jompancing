import type { Coordinates } from "@/types";

/** Parse lat/lng from common Google Maps URL formats */
export function parseGoogleMapsUrl(url: string): Coordinates | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const atMatch = trimmed.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch?.[1] && atMatch[2]) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }

  const qMatch = trimmed.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch?.[1] && qMatch[2]) {
    return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  }

  const llMatch = trimmed.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch?.[1] && llMatch[2]) {
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  }

  return null;
}

export function isValidGoogleMapsUrl(url: string): boolean {
  const trimmed = url.trim();
  return (
    trimmed.includes("google.com/maps") ||
    trimmed.includes("maps.google.com") ||
    trimmed.includes("maps.app.goo.gl") ||
    trimmed.includes("goo.gl/maps")
  );
}

export function buildGoogleMapsPlaceUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function buildGoogleMapsCoordsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
