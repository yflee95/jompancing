import { malaysiaStates } from "@/data/malaysia-states";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

export interface InferredUserRegion {
  stateId: string;
  districtId: string;
  label: string;
}

/** Google / OSM place names → our state id */
const STATE_ALIASES: Record<string, string> = {
  "pulau pinang": "penang",
  penang: "penang",
  malacca: "melaka",
  melaka: "melaka",
  "federal territory of kuala lumpur": "kl",
  "wilayah persekutuan kuala lumpur": "kl",
  "kuala lumpur": "kl",
  "federal territory of putrajaya": "putrajaya",
  "wilayah persekutuan putrajaya": "putrajaya",
  putrajaya: "putrajaya",
  "federal territory of labuan": "labuan",
  "wilayah persekutuan labuan": "labuan",
  labuan: "labuan",
  "negeri sembilan": "negeri-sembilan",
};

function cleanPlaceName(value: string): string {
  return value
    .replace(
      /\s+(district|daerah|municipality|city council|majlis perbandaran|regency)$/i,
      "",
    )
    .trim();
}

function normalize(value: string): string {
  return cleanPlaceName(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function namesMatch(a: string, b: string): boolean {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return false;
  return x === y || x.includes(y) || y.includes(x);
}

function resolveStateId(name: string): string | null {
  const key = normalize(name);
  if (STATE_ALIASES[key]) return STATE_ALIASES[key];

  for (const state of malaysiaStates) {
    const names = [
      state.id,
      state.slug,
      ...Object.values(state.name),
    ];
    if (names.some((n) => namesMatch(name, n))) {
      return state.id;
    }
  }
  return null;
}

function districtCandidates(name: string): string[] {
  const cleaned = cleanPlaceName(name);
  return [name, cleaned];
}

function findDistrictInState(
  stateId: string,
  candidates: string[],
  locale: Locale,
): InferredUserRegion | null {
  const state = malaysiaStates.find((s) => s.id === stateId);
  if (!state) return null;

  for (const district of state.districts) {
    const districtNames = [
      district.id,
      district.slug,
      ...Object.values(district.name),
    ];
    const hit = candidates.some((c) =>
      districtNames.some((name) =>
        districtCandidates(c).some((variant) => namesMatch(variant, name)),
      ),
    );
    if (hit) {
      return {
        stateId: state.id,
        districtId: district.id,
        label: getLocalizedText(district.name, locale),
      };
    }
  }

  return null;
}

function fallbackDistrictInState(
  stateId: string,
  candidates: string[],
  locale: Locale,
): InferredUserRegion | null {
  const state = malaysiaStates.find((s) => s.id === stateId);
  const fallbackDistrict = state?.districts[0];
  if (!state || !fallbackDistrict) return null;

  const locality =
    candidates.find((c) => !resolveStateId(c)) ?? candidates[0];

  return {
    stateId: state.id,
    districtId: fallbackDistrict.id,
    label: locality ?? getLocalizedText(fallbackDistrict.name, locale),
  };
}

/** Match place-name strings (from Google or OSM) to our state/district IDs. */
export function matchRegionFromPlaceNames(
  rawCandidates: string[],
  locale: Locale,
): InferredUserRegion | null {
  const candidates = rawCandidates
    .map(cleanPlaceName)
    .filter((v): v is string => Boolean(v?.trim()));

  if (candidates.length === 0) return null;

  let matchedStateId: string | null = null;
  for (const candidate of candidates) {
    const stateId = resolveStateId(candidate);
    if (stateId) {
      matchedStateId = stateId;
      break;
    }
  }

  if (matchedStateId) {
    return (
      findDistrictInState(matchedStateId, candidates, locale) ??
      fallbackDistrictInState(matchedStateId, candidates, locale)
    );
  }

  for (const state of malaysiaStates) {
    const region = findDistrictInState(state.id, candidates, locale);
    if (region) return region;
  }

  return null;
}

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

const GOOGLE_REGION_TYPES = new Set([
  "administrative_area_level_1",
  "administrative_area_level_2",
  "administrative_area_level_3",
  "locality",
  "postal_town",
  "sublocality",
  "sublocality_level_1",
  "neighborhood",
]);

export function extractGooglePlaceCandidates(
  components: GoogleAddressComponent[],
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const component of components) {
    if (!component.types.some((t) => GOOGLE_REGION_TYPES.has(t))) continue;
    const name = component.long_name.trim();
    const key = normalize(name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }

  return out;
}

export function matchRegionFromGoogleComponents(
  components: GoogleAddressComponent[],
  locale: Locale,
): InferredUserRegion | null {
  return matchRegionFromPlaceNames(
    extractGooglePlaceCandidates(components),
    locale,
  );
}

type NominatimAddress = Record<string, string>;

function nominatimCandidates(address: NominatimAddress): string[] {
  return [
    address.suburb,
    address.city,
    address.town,
    address.village,
    address.county,
    address.state,
    address["state_district"],
  ].filter((v): v is string => Boolean(v?.trim()));
}

/** Match Nominatim reverse-geocode address parts to our state/district IDs. */
export function matchRegionFromNominatim(
  address: NominatimAddress,
  locale: Locale,
): InferredUserRegion | null {
  return matchRegionFromPlaceNames(nominatimCandidates(address), locale);
}

export function toGoogleGeocodingLanguage(locale: Locale): string {
  if (locale === "zh") return "zh-CN";
  return locale;
}
