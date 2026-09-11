/** Client-safe Google Maps JS API key (Maps JavaScript API must be enabled). */
export function getGoogleMapsApiKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  return key || undefined;
}

/** Server-side Geocoding API key (falls back to public key). Enable Geocoding API in Google Cloud. */
export function getGoogleGeocodingApiKey(): string | undefined {
  const serverKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  if (serverKey) return serverKey;
  return getGoogleMapsApiKey();
}

export function getGoogleMapsMapId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim();
  return id || undefined;
}
