import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { SpotsRegionShell } from "@/components/spots/spots-region-shell";
import { getStateById } from "@/data/malaysia-states";
import { buildPageMetadata } from "@/lib/seo";
import { loadPublicSpots } from "@/lib/public-spots";
import { filterSpotsByRegion } from "@/lib/spot-location";
import {
  getSpotsSeoCopy,
  parseSpotsSearchParams,
} from "@/lib/spots-seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    state?: string;
    district?: string;
    area?: string;
    water?: string;
  }>;
}) {
  const { locale } = await params;
  const filters = parseSpotsSearchParams(await searchParams);
  const t = await getTranslations({ locale, namespace: "spots" });

  let spotCount: number | undefined;
  if (filters.stateId) {
    const spots = await loadPublicSpots();
    let list = filterSpotsByRegion(
      spots,
      filters.stateId,
      filters.districtId,
      filters.areaId,
    );
    if (filters.water) {
      list = list.filter((spot) => spot.waterType === filters.water);
    }
    spotCount = list.length;
  }

  const copy = getSpotsSeoCopy({ locale, t, filters, spotCount });

  return buildPageMetadata({
    locale,
    path: copy.path,
    title: copy.title,
    description: copy.description,
  });
}

export default async function SpotsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    state?: string;
    district?: string;
    area?: string;
    water?: string;
  }>;
}) {
  const { locale } = await params;
  const { state, district, area, water } = await searchParams;
  setRequestLocale(locale);

  if (
    state &&
    getStateById(state) &&
    !district &&
    !area &&
    !water
  ) {
    redirect({ href: `/spots/${state}`, locale });
  }

  const filters = parseSpotsSearchParams({ state, district, area, water });

  return <SpotsRegionShell locale={locale} filters={filters} />;
}
