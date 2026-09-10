import { NextRequest, NextResponse } from "next/server";
import {
  buildOsmSearchVariants,
  rankResultsByState,
} from "@/lib/address-query";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "Jompancing/1.0 (address-autocomplete; +https://jompancing.app)";
/** Nominatim usage policy: max 1 req/s — small gap between variant attempts. */
const VARIANT_GAP_MS = 1100;
const MAX_VARIANTS = 6;

type NominatimHit = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim();
  const locale = searchParams.get("locale") ?? "en";
  const limit = Math.min(Number(searchParams.get("limit") ?? "5"), 10);

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const data = await queryNominatim(q, locale, limit);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}

/** Nationwide search — tries state → district → postcode → Malaysia-wide variants. */
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
    const locale = body.locale ?? "en";
    const limit = Math.min(Number(body.limit ?? 8), 10);

    if (query.length < 2) {
      return NextResponse.json([]);
    }

    const variants = buildOsmSearchVariants(
      query,
      body.stateId,
      body.districtId,
    ).slice(0, MAX_VARIANTS);

    for (const [index, variant] of variants.entries()) {
      if (index > 0) await sleep(VARIANT_GAP_MS);

      const hits = await queryNominatim(variant, locale, limit);
      if (hits.length > 0) {
        const ranked = body.stateId
          ? rankResultsByState(hits, body.stateId)
          : hits;
        return NextResponse.json(ranked);
      }
    }

    return NextResponse.json([]);
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}
