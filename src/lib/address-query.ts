import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { getLocalizedText } from "@/types";

/** Malaysia bounding box (inclusive buffer for coastal/island spots). */
const MY_LAT_MIN = 0.8;
const MY_LAT_MAX = 7.5;
const MY_LNG_MIN = 98.9;
const MY_LNG_MAX = 119.5;

/** Extra strings OSM uses for federal territories / common state names. */
const STATE_RANK_ALIASES: Record<string, string[]> = {
  kl: ["wilayah persekutuan kuala lumpur", "federal territory of kuala lumpur"],
  putrajaya: ["wilayah persekutuan putrajaya", "federal territory of putrajaya"],
  labuan: ["wilayah persekutuan labuan", "federal territory of labuan"],
  penang: ["pulau pinang"],
  "negeri-sembilan": ["negeri sembilan"],
};

/** Normalize Malaysian address text for geocoding (nationwide). */
export function normalizeAddressQuery(query: string): string {
  return query
    .trim()
    .replace(/\bjln\.?\b/gi, "jalan")
    .replace(/\btmn\.?\b/gi, "taman")
    .replace(/\blrg\.?\b/gi, "lorong")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ");
}

export const UNIT_SEGMENT =
  /^(no\.?\s*\d+[a-z]?|lot\s*\d+[a-z]?|unit\s*\d+[a-z]?|#\s*\d+[a-z]?|blk\.?\s*[a-z0-9]+|block\s*[a-z0-9]+|tingkat\s*\d+)$/i;

/** Tokenize for local fuzzy match — strips punctuation from comma-separated input. */
export function tokenizeAddressTerms(query: string): string[] {
  return normalizeAddressQuery(query)
    .toLowerCase()
    .split(/[\s,]+/)
    .map((t) => t.replace(/^[^\w]+|[^\w]+$/g, ""))
    .filter((t) => t.length >= 2);
}

/** Leading No / Lot / Unit / Block segments the user typed — kept in final address. */
export function extractLeadingUnits(query: string): string[] {
  const normalized = normalizeAddressQuery(query);
  const units: string[] = [];

  const parts = normalized
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (UNIT_SEGMENT.test(part)) units.push(part);
    else break;
  }

  if (units.length > 0) return units;

  const inline = normalized.match(
    /^(no\.?\s*\d+[a-z]?|lot\s*\d+[a-z]?|unit\s*\d+[a-z]?|#\s*\d+[a-z]?)\b/i,
  );
  return inline ? [inline[0]] : [];
}

/** Address detail after leading No/Lot/Unit segments (comma or inline). */
function getUserDetailParts(userInput: string): string[] {
  const normalized = normalizeAddressQuery(userInput);
  const parts = normalized
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  let startIdx = 0;
  for (const part of parts) {
    if (UNIT_SEGMENT.test(part)) startIdx++;
    else break;
  }

  if (startIdx > 0) return parts.slice(startIdx);

  const inline = normalized.match(
    /^(no\.?\s*\d+[a-z]?|lot\s*\d+[a-z]?|unit\s*\d+[a-z]?|#\s*\d+[a-z]?)\s+,?\s*/i,
  );
  if (!inline) return parts;

  const remainder = normalized.slice(inline[0].length).trim();
  if (!remainder) return [];
  return remainder.split(",").map((p) => p.trim()).filter(Boolean);
}

/** Merge user's unit no. + typed detail with OSM result → full address for display/storage. */
export function buildFullAddress(userInput: string, baseAddress: string): string {
  const base = baseAddress.trim();
  const baseLower = base.toLowerCase();
  const units = extractLeadingUnits(userInput);
  const userDetails = getUserDetailParts(userInput);

  const extraDetails = userDetails.filter(
    (part) => !baseLower.includes(part.toLowerCase()),
  );

  const segments: string[] = [];

  if (units.length > 0) {
    const prefix = units.join(", ");
    if (!baseLower.startsWith(prefix.toLowerCase())) {
      segments.push(prefix);
    }
  }

  for (const part of extraDetails) {
    segments.push(part);
  }

  if (segments.length === 0) return base;
  return `${segments.join(", ")}, ${base}`;
}

/** Strip units only for geocoding — OSM has street-level coords, not house numbers. */
export function extractStreetQuery(query: string): string {
  const normalized = normalizeAddressQuery(query);

  const withoutLeadingUnit = normalized.replace(
    /^(no\.?\s*\d+[a-z]?|lot\s*\d+[a-z]?|unit\s*\d+[a-z]?|#\s*\d+[a-z]?)\s*,?\s*/i,
    "",
  );

  const parts = withoutLeadingUnit
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((part) => !UNIT_SEGMENT.test(part));

  return parts.join(", ").trim() || normalized;
}

export function extractPostcode(query: string): string | null {
  return query.match(/\b(\d{5})\b/)?.[1] ?? null;
}

export function isValidMalaysiaCoordinate(lat: number, lng: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat === 0 && lng === 0) return false;
  return (
    lat >= MY_LAT_MIN &&
    lat <= MY_LAT_MAX &&
    lng >= MY_LNG_MIN &&
    lng <= MY_LNG_MAX
  );
}

export function buildOsmSearchQuery(
  query: string,
  districtName: string,
  stateName: string,
): string {
  const normalized = normalizeAddressQuery(query);
  const lower = normalized.toLowerCase();
  const parts = [normalized];

  if (districtName && !lower.includes(districtName.toLowerCase())) {
    parts.push(districtName);
  }
  if (stateName && !lower.includes(stateName.toLowerCase())) {
    parts.push(stateName);
  }
  if (!lower.includes("malaysia")) {
    parts.push("Malaysia");
  }

  return parts.join(", ");
}

/**
 * Build search queries: state-biased first (survives wrong district),
 * then district-specific, then postcode / nationwide.
 */
export function buildOsmSearchVariants(
  query: string,
  stateId?: string,
  districtId?: string,
): string[] {
  const full = normalizeAddressQuery(query);
  const street = extractStreetQuery(full);
  const postcode = extractPostcode(full);

  const state = stateId ? getStateById(stateId) : undefined;
  const district =
    stateId && districtId ? getDistrictById(stateId, districtId) : undefined;

  const stateEn = state ? getLocalizedText(state.name, "en") : "";
  const districtEn = district ? getLocalizedText(district.name, "en") : "";

  const variants: string[] = [];
  const push = (candidate: string) => {
    const trimmed = candidate.trim();
    if (trimmed.length > 3 && !variants.includes(trimmed)) {
      variants.push(trimmed);
    }
  };

  if (stateEn) {
    push(buildOsmSearchQuery(street, "", stateEn));
    if (street !== full) push(buildOsmSearchQuery(full, "", stateEn));
  }

  if (districtEn && stateEn) {
    push(buildOsmSearchQuery(street, districtEn, stateEn));
    if (street !== full) push(buildOsmSearchQuery(full, districtEn, stateEn));
  }

  if (postcode) {
    push(`${street}, ${postcode}, Malaysia`);
  }

  push(`${street}, Malaysia`);
  if (street !== full) push(`${full}, Malaysia`);

  return variants;
}

function getStateRankNeedles(stateId: string): string[] {
  const state = getStateById(stateId);
  if (!state) return [];

  const needles = Object.values(state.name).map((n) => n.toLowerCase());
  const aliases = STATE_RANK_ALIASES[stateId] ?? [];
  return [...needles, ...aliases];
}

/** Prefer results inside the user's selected state, but keep nationwide matches. */
export function rankResultsByState<T extends { display_name: string }>(
  results: T[],
  stateId: string,
): T[] {
  const needles = getStateRankNeedles(stateId);
  if (needles.length === 0) return results;

  const inState: T[] = [];
  const other: T[] = [];

  for (const item of results) {
    const haystack = item.display_name.toLowerCase();
    const matched = needles.some((needle) => haystack.includes(needle));
    if (matched) inState.push(item);
    else other.push(item);
  }

  return [...inState, ...other];
}
