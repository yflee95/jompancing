import { getGoogleGeocodingApiKey } from "@/lib/google-maps-config";

const TEXT_SEARCH_URL =
  "https://maps.googleapis.com/maps/api/place/textsearch/json";
const DETAILS_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";
const PHOTO_URL =
  "https://maps.googleapis.com/maps/api/place/photo";

export interface GooglePlaceCandidate {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
}

export interface GooglePlaceDetails extends GooglePlaceCandidate {
  photoReference?: string;
  photoAttribution?: string;
  mapsUrl: string;
}

function getKey(): string {
  const key = getGoogleGeocodingApiKey();
  if (!key) {
    throw new Error("GOOGLE_MAPS_API_KEY is required for Places API");
  }
  return key;
}

export async function searchGooglePlaces(
  query: string,
): Promise<GooglePlaceCandidate[]> {
  const key = getKey();
  const url = new URL(TEXT_SEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("key", key);
  url.searchParams.set("region", "my");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Places text search failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    status: string;
    results?: Array<{
      place_id: string;
      name: string;
      formatted_address?: string;
      geometry?: { location?: { lat?: number; lng?: number } };
      types?: string[];
      rating?: number;
      user_ratings_total?: number;
    }>;
    error_message?: string;
  };

  if (payload.status !== "OK" && payload.status !== "ZERO_RESULTS") {
    throw new Error(
      payload.error_message ?? `Places text search: ${payload.status}`,
    );
  }

  return (payload.results ?? [])
    .filter(
      (row) =>
        row.place_id &&
        row.name &&
        row.geometry?.location?.lat != null &&
        row.geometry?.location?.lng != null,
    )
    .map((row) => ({
      placeId: row.place_id,
      name: row.name,
      address: row.formatted_address ?? row.name,
      lat: row.geometry!.location!.lat!,
      lng: row.geometry!.location!.lng!,
      types: row.types ?? [],
      rating: row.rating,
      userRatingsTotal: row.user_ratings_total,
    }));
}

export async function fetchGooglePlaceDetails(
  placeId: string,
): Promise<GooglePlaceDetails | null> {
  const key = getKey();
  const url = new URL(DETAILS_URL);
  url.searchParams.set("place_id", placeId);
  url.searchParams.set(
    "fields",
    "place_id,name,formatted_address,geometry,types,rating,user_ratings_total,photos,url",
  );
  url.searchParams.set("key", key);

  const response = await fetch(url);
  if (!response.ok) return null;

  const payload = (await response.json()) as {
    status: string;
    result?: {
      place_id: string;
      name: string;
      formatted_address?: string;
      geometry?: { location?: { lat?: number; lng?: number } };
      types?: string[];
      rating?: number;
      user_ratings_total?: number;
      url?: string;
      photos?: Array<{
        photo_reference: string;
        html_attributions?: string[];
      }>;
    };
  };

  if (payload.status !== "OK" || !payload.result) return null;

  const row = payload.result;
  const photo = row.photos?.[0];

  return {
    placeId: row.place_id,
    name: row.name,
    address: row.formatted_address ?? row.name,
    lat: row.geometry?.location?.lat ?? 0,
    lng: row.geometry?.location?.lng ?? 0,
    types: row.types ?? [],
    rating: row.rating,
    userRatingsTotal: row.user_ratings_total,
    photoReference: photo?.photo_reference,
    photoAttribution: photo?.html_attributions?.[0]?.replace(/<[^>]+>/g, ""),
    mapsUrl:
      row.url ??
      `https://www.google.com/maps/search/?api=1&query=${row.geometry?.location?.lat},${row.geometry?.location?.lng}&query_place_id=${row.place_id}`,
  };
}

export function buildGooglePhotoFetchUrl(
  photoReference: string,
  maxWidth = 1200,
): string {
  const key = getKey();
  const url = new URL(PHOTO_URL);
  url.searchParams.set("maxwidth", String(maxWidth));
  url.searchParams.set("photo_reference", photoReference);
  url.searchParams.set("key", key);
  return url.toString();
}

export function buildGoogleMapsPlaceUrl(placeId: string, lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(placeId)}`;
}
