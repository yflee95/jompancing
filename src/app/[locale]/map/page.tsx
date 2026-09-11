import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapExplore } from "@/components/map/map-explore";
import { buildPageMetadata } from "@/lib/seo";
import { mockSpots } from "@/data/mock-data";
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
  searchParams: Promise<{ state?: string; district?: string; area?: string }>;
}) {
  const { locale } = await params;
  const { state, district, area } = await searchParams;
  setRequestLocale(locale);

  return (
    <MapExplore
      spots={mockSpots}
      filterState={state}
      filterDistrict={district}
      filterArea={area}
    />
  );
}
