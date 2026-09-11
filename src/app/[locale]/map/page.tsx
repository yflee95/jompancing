import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapExplore } from "@/components/map/map-explore";
import { buildPageMetadata } from "@/lib/seo";
import { loadPublicSpots } from "@/lib/public-spots";
import { parseWaterTypeParam } from "@/lib/water-types";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "map" });
  return buildPageMetadata({
    locale,
    path: "/map",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function MapPage({
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
  const spots = await loadPublicSpots();

  return (
    <MapExplore
      spots={spots}
      filterState={state}
      filterDistrict={district}
      filterArea={area}
      filterWater={parseWaterTypeParam(water)}
    />
  );
}
