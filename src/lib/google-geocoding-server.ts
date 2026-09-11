import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { getGoogleGeocodingApiKey } from "@/lib/google-maps-config";
import {
  matchRegionFromGoogleComponents,
  toGoogleGeocodingLanguage,
} from "@/lib/reverse-geocode";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

const GOOGLE_GEOCODE = "https://maps.googleapis.com/maps/api/geocode/json";

export type GoogleGeocodeResult = {
  place_id?: string;
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry: {
    location: { lat: number; lng: number };
  };
};

type GoogleGeocodeResponse = {
  status: string;
  results?: GoogleGeocodeResult[];
};

export type GoogleAddressHit = {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
  stateId?: string;
  districtId?: string;
};

function buildBiasedQuery(
  query: string,
  locale: Locale,
  stateId?: string,
  districtId?: string,
): string {
  const parts = [query.trim()];
  if (districtId && stateId) {
    const district = getDistrictById(stateId, districtId);
    if (district) {
      parts.push(getLocalizedText(district.name, locale));
    }
  }
  if (stateId) {
    const state = getStateById(stateId);
    if (state) {
      parts.push(getLocalizedText(state.name, locale));
    }
  }
  parts.push("Malaysia");
  return parts.filter(Boolean).join(", ");
}

function mapGoogleResult(
  result: GoogleGeocodeResult,
  index: number,
  locale: Locale,
): GoogleAddressHit {
  const region = matchRegionFromGoogleComponents(
    result.address_components,
    locale,
  );

  return {
    id: `google-${result.place_id ?? index}`,
    label: result.formatted_address.split(",")[0]?.trim() ?? result.formatted_address,
    address: result.formatted_address,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    stateId: region?.stateId,
    districtId: region?.districtId,
  };
}

export async function searchGoogleAddresses(
  query: string,
  locale: Locale,
  options?: {
    stateId?: string;
    districtId?: string;
    limit?: number;
  },
): Promise<GoogleAddressHit[]> {
  const apiKey = getGoogleGeocodingApiKey();
  if (!apiKey || query.trim().length < 2) return [];

  const url = new URL(GOOGLE_GEOCODE);
  url.searchParams.set(
    "address",
    buildBiasedQuery(query, locale, options?.stateId, options?.districtId),
  );
  url.searchParams.set("components", "country:MY");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("language", toGoogleGeocodingLanguage(locale));
  url.searchParams.set("region", "my");

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const data = (await res.json()) as GoogleGeocodeResponse;
  if (data.status !== "OK" || !data.results?.length) return [];

  const limit = options?.limit ?? 8;
  return data.results.slice(0, limit).map((r, i) => mapGoogleResult(r, i, locale));
}

export async function geocodeGoogleAddress(
  query: string,
  locale: Locale,
  stateId?: string,
  districtId?: string,
): Promise<GoogleAddressHit | null> {
  const hits = await searchGoogleAddresses(query, locale, {
    stateId,
    districtId,
    limit: 1,
  });
  return hits[0] ?? null;
}

export async function reverseGoogleRegion(
  lat: number,
  lng: number,
  locale: Locale,
) {
  const apiKey = getGoogleGeocodingApiKey();
  if (!apiKey) return null;

  const url = new URL(GOOGLE_GEOCODE);
  url.searchParams.set("latlng", `${lat},${lng}`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("language", toGoogleGeocodingLanguage(locale));
  url.searchParams.set("region", "my");

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const data = (await res.json()) as GoogleGeocodeResponse;
  if (data.status !== "OK" || !data.results?.[0]) return null;

  return matchRegionFromGoogleComponents(
    data.results[0].address_components,
    locale,
  );
}
