import { getAreasByDistrict, malaysiaAreas } from "@/data/malaysia-areas";
import { mockSpots } from "@/data/mock-data";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import {
  buildFullAddress,
  buildOsmSearchVariants,
  extractLeadingUnits,
  extractStreetQuery,
  isValidMalaysiaCoordinate,
  normalizeAddressQuery,
  tokenizeAddressTerms,
} from "@/lib/address-query";
import { getLocalizedText, type Coordinates } from "@/types";
import type { Locale } from "@/i18n/routing";

export interface AddressSuggestion {
  id: string;
  label: string;
  address: string;
  coordinates: Coordinates;
  areaId?: string;
  source: "local" | "osm";
}

const MOCK_SUGGESTIONS: AddressSuggestion[] = mockSpots.map((spot) => ({
  id: spot.id,
  label: spot.title.en,
  address: spot.googleAddress,
  coordinates: spot.coordinates,
  areaId: spot.areaId,
  source: "local",
}));

function buildAreaSuggestions(
  stateId: string,
  districtId: string,
  locale: Locale,
): AddressSuggestion[] {
  const state = getStateById(stateId);
  const district = getDistrictById(stateId, districtId);
  if (!state || !district) return [];

  const stateName = getLocalizedText(state.name, locale);
  const districtName = getLocalizedText(district.name, locale);

  return malaysiaAreas
    .filter((a) => a.stateId === stateId && a.districtId === districtId)
    .map((area) => {
      const areaName = getLocalizedText(area.name, locale);
      return {
        id: `area-${area.id}`,
        label: areaName,
        address: `${areaName}, ${districtName}, ${stateName}, Malaysia`,
        coordinates: { lat: 0, lng: 0 },
        areaId: area.id,
        source: "local" as const,
      };
    });
}

function getLocalSuggestionsForDistrict(
  stateId: string,
  districtId: string,
  locale: Locale,
): AddressSuggestion[] {
  const mock = MOCK_SUGGESTIONS.filter((item) => {
    const spot = mockSpots.find((s) => s.id === item.id);
    return spot?.stateId === stateId && spot?.districtId === districtId;
  });
  const areas = buildAreaSuggestions(stateId, districtId, locale);
  return [...mock, ...areas];
}

function suggestionHaystack(
  item: AddressSuggestion,
  stateId: string,
  districtId: string,
  locale: Locale,
): string {
  const state = getStateById(stateId);
  const district = getDistrictById(stateId, districtId);
  const parts = [item.label, item.address];
  if (state) parts.push(...Object.values(state.name));
  if (district) parts.push(...Object.values(district.name));
  if (item.areaId) {
    const area = getAreasByDistrict(stateId, districtId).find(
      (a) => a.id === item.areaId,
    );
    if (area) parts.push(...Object.values(area.name));
  }
  if (locale === "zh") {
    const spot = mockSpots.find((s) => s.id === item.id);
    if (spot) parts.push(...Object.values(spot.title));
  }
  return parts.join(" ").toLowerCase();
}

export function searchLocalAddresses(
  stateId: string,
  districtId: string,
  query: string,
  locale: Locale,
  limit = 6,
): AddressSuggestion[] {
  if (!stateId || !districtId) return [];

  const terms = tokenizeAddressTerms(query);
  if (terms.length === 0) return [];

  return getLocalSuggestionsForDistrict(stateId, districtId, locale)
    .filter((item) => {
      const haystack = suggestionHaystack(item, stateId, districtId, locale);
      return terms.some((term) => haystack.includes(term));
    })
    .slice(0, limit);
}

type OsmHit = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

function mapOsmHits(hits: OsmHit[]): AddressSuggestion[] {
  const mapped: AddressSuggestion[] = [];

  for (const item of hits) {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    if (!isValidMalaysiaCoordinate(lat, lng)) continue;

    mapped.push({
      id: `osm-${item.place_id}`,
      label: item.display_name.split(",")[0] ?? item.display_name,
      address: item.display_name,
      coordinates: { lat, lng },
      source: "osm",
    });
  }

  return mapped;
}

async function fetchNationwideOsm(
  query: string,
  stateId: string | undefined,
  districtId: string | undefined,
  locale: Locale,
  limit: number,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const res = await fetch("/api/address-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      stateId,
      districtId,
      locale,
      limit,
    }),
    signal,
  });

  if (!res.ok) return [];
  const data = (await res.json()) as OsmHit[];
  return mapOsmHits(data);
}

/** Nationwide OSM search — district optional; wrong district still resolves. */
export async function searchOsmAddresses(
  stateId: string,
  districtId: string | undefined,
  query: string,
  locale: Locale,
  limit = 8,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const normalized = normalizeAddressQuery(query);
  if (!stateId || normalized.length < 2) return [];

  try {
    return await fetchNationwideOsm(
      normalized,
      stateId,
      districtId || undefined,
      locale,
      limit,
      signal,
    );
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return [];
    return [];
  }
}

/** Geocode any Malaysian address with the same nationwide fallback chain. */
export async function geocodeAddress(
  address: string,
  locale: Locale,
  stateId?: string,
  districtId?: string,
  signal?: AbortSignal,
): Promise<Coordinates | null> {
  const normalized = normalizeAddressQuery(address);
  if (normalized.length < 2) return null;

  try {
    const hits = await fetchNationwideOsm(
      normalized,
      stateId,
      districtId,
      locale,
      1,
      signal,
    );
    const hit = hits[0];
    if (!hit) return null;
    return hit.coordinates;
  } catch {
    return null;
  }
}

/** Apply user's No/Lot/Unit prefix to OSM suggestions for display & storage. */
export function enrichSuggestionsWithUserInput(
  suggestions: AddressSuggestion[],
  userInput: string,
): AddressSuggestion[] {
  if (!userInput.trim()) return suggestions;

  return suggestions.map((item) => {
    const full = buildFullAddress(userInput, item.address);
    return {
      ...item,
      label: full.split(",")[0]?.trim() ?? item.label,
      address: full,
    };
  });
}

export function mergeAddressSuggestions(
  local: AddressSuggestion[],
  remote: AddressSuggestion[],
): AddressSuggestion[] {
  const seen = new Set<string>();
  return [...local, ...remote].filter((item) => {
    const key = `${item.address.toLowerCase()}|${item.coordinates.lat}|${item.coordinates.lng}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export {
  buildFullAddress,
  buildOsmSearchVariants,
  extractLeadingUnits,
  extractStreetQuery,
  isValidMalaysiaCoordinate,
  normalizeAddressQuery,
  tokenizeAddressTerms,
};
