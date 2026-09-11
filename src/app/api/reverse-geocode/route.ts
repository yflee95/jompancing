import { NextRequest, NextResponse } from "next/server";
import { matchRegionFromNominatim } from "@/lib/reverse-geocode";
import type { Locale } from "@/i18n/routing";

const NOMINATIM_REVERSE = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "Jompancing/1.0 (reverse-geocode; +https://jompancing.my)";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const locale = (searchParams.get("locale") ?? "en") as Locale;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ region: null }, { status: 400 });
  }

  try {
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

    if (!res.ok) {
      return NextResponse.json({ region: null });
    }

    const data = (await res.json()) as { address?: Record<string, string> };
    const region = data.address
      ? matchRegionFromNominatim(data.address, locale)
      : null;

    return NextResponse.json({ region });
  } catch {
    return NextResponse.json({ region: null }, { status: 502 });
  }
}
