import { NextRequest, NextResponse } from "next/server";
import {
  buildOsmSearchVariants,
  rankResultsByState,
} from "@/lib/address-query";
import { searchGoogleAddresses } from "@/lib/google-geocoding-server";
import { getGoogleGeocodingApiKey } from "@/lib/google-maps-config";
import type { Locale } from "@/i18n/routing";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "Jompancing/1.0 (address-autocomplete; +https://jompancing.my)";
const VARIANT_GAP_MS = 1100;
const MAX_VARIANTS = 6;

export type AddressSearchApiHit = {
  id: string;
  label: string;
  address: string;
  lat: string;
  lon: string;
  stateId?: string;
  districtId?: string;
  source: "google" | "osm";
};

type NominatimHit = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapOsmHit(item: NominatimHit): AddressSearchApiHit {
  return {
    id: `osm-${item.place_id}`,
    label: item.display_name.split(",")[0]?.trim() ?? item.display_name,
    address: item.display_name,
    lat: item.lat,
    lon: item.lon,
    source: "osm",
  };
}

async function queryNominatim(
  q: string,
  locale: string,
  limit: number,
): Promise<NominatimHit[]> {
  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("q", q);
  url.searchParams.set("countrycodes", "my");
  url.searchParams.set("addressdetails", "1");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
      "User-Agent": USER_AGENT,
    },
    next: { revalidate: 86400 },
  });

  if (!res.ok) return [];
  return (await res.json()) as NominatimHit[];
}

async function searchOsm(
  query: string,
  locale: string,
  stateId?: string,
  districtId?: string,
  limit = 8,
): Promise<AddressSearchApiHit[]> {
  const variants = buildOsmSearchVariants(query, stateId, districtId).slice(
    0,
    MAX_VARIANTS,
  );

  for (const [index, variant] of variants.entries()) {
    if (index > 0) await sleep(VARIANT_GAP_MS);

    const hits = await queryNominatim(variant, locale, limit);
    if (hits.length > 0) {
      const ranked = stateId ? rankResultsByState(hits, stateId) : hits;
      return ranked.map(mapOsmHit);
    }
  }

  return [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim();
  const locale = (searchParams.get("locale") ?? "en") as Locale;
  const stateId = searchParams.get("stateId") ?? undefined;
  const districtId = searchParams.get("districtId") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? "5"), 10);

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    if (getGoogleGeocodingApiKey()) {
      const googleHits = await searchGoogleAddresses(q, locale, {
        stateId,
        districtId,
        limit,
      });
      if (googleHits.length > 0) {
        return NextResponse.json(
          googleHits.map((hit) => ({
            id: hit.id,
            label: hit.label,
            address: hit.address,
            lat: String(hit.lat),
            lon: String(hit.lng),
            stateId: hit.stateId,
            districtId: hit.districtId,
            source: "google" as const,
          })),
        );
      }
    }

    return NextResponse.json(await searchOsm(q, locale, stateId, districtId, limit));
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      query?: string;
      stateId?: string;
      districtId?: string;
      locale?: string;
      limit?: number;
    };

    const query = body.query?.trim() ?? "";
    const locale = (body.locale ?? "en") as Locale;
    const limit = Math.min(Number(body.limit ?? 8), 10);

    if (query.length < 2) {
      return NextResponse.json([]);
    }

    if (getGoogleGeocodingApiKey()) {
      const googleHits = await searchGoogleAddresses(query, locale, {
        stateId: body.stateId,
        districtId: body.districtId,
        limit,
      });
      if (googleHits.length > 0) {
        return NextResponse.json(
          googleHits.map((hit) => ({
            id: hit.id,
            label: hit.label,
            address: hit.address,
            lat: String(hit.lat),
            lon: String(hit.lng),
            stateId: hit.stateId,
            districtId: hit.districtId,
            source: "google" as const,
          })),
        );
      }
    }

    return NextResponse.json(
      await searchOsm(query, locale, body.stateId, body.districtId, limit),
    );
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}
