import { NextRequest, NextResponse } from "next/server";
import { reverseGoogleLocation } from "@/lib/google-geocoding-server";
import { getGoogleGeocodingApiKey } from "@/lib/google-maps-config";
import { matchRegionFromNominatim } from "@/lib/reverse-geocode";
import type { Locale } from "@/i18n/routing";

const NOMINATIM_REVERSE = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "Jompancing/1.0 (reverse-geocode; +https://jompancing.my)";

async function reverseGeocodeWithNominatim(
  lat: number,
  lng: number,
  locale: Locale,
) {
  const url = new URL(NOMINATIM_REVERSE);
  url.searchParams.set("format", "json");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("zoom", "12");
  url.searchParams.set("addressdetails", "1");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
      "User-Agent": USER_AGENT,
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    address?: Record<string, string>;
    display_name?: string;
  };

  if (!data.address) return null;

  return {
    region: matchRegionFromNominatim(data.address, locale),
    address: data.display_name?.trim() ?? null,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const locale = (searchParams.get("locale") ?? "en") as Locale;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ region: null, address: null }, { status: 400 });
  }

  try {
    if (getGoogleGeocodingApiKey()) {
      const googleHit = await reverseGoogleLocation(lat, lng, locale);
      if (googleHit) {
        return NextResponse.json({
          region: googleHit.region,
          address: googleHit.address,
          source: "google",
        });
      }
    }

    const osmHit = await reverseGeocodeWithNominatim(lat, lng, locale);
    return NextResponse.json({
      region: osmHit?.region ?? null,
      address: osmHit?.address ?? null,
      source: osmHit ? "osm" : null,
    });
  } catch {
    return NextResponse.json({ region: null, address: null }, { status: 502 });
  }
}
