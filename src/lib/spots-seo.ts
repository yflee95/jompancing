import {
  getDistrictById,
  getStateById,
  getStateBySlug,
  malaysiaStates,
} from "@/data/malaysia-states";
import type { Locale } from "@/i18n/routing";
import { getSpotSpeciesLine } from "@/lib/spot-angler-info";
import { getSpotLocationLine } from "@/lib/spot-location";
import { truncateMetaDescription } from "@/lib/seo";
import { parseWaterTypeParam } from "@/lib/water-types";
import { getLocalizedText, type FishingSpot, type WaterType } from "@/types";

const MIN_SPOT_DESCRIPTION_CHARS = 72;

type SpotsTranslate = (
  key: string,
  values?: Record<string, string | number>,
) => string;

/** SERP-friendly title + description for individual spot pages (long-tail queries). */
export function buildSpotDetailSeo({
  spot,
  locale,
  t,
}: {
  spot: FishingSpot;
  locale: Locale;
  t: SpotsTranslate;
}): { title: string; description: string } {
  const name = getLocalizedText(spot.title, locale).trim();
  const location = getSpotLocationLine(spot, locale).trim();
  const rawDescription = getLocalizedText(spot.description, locale).trim();
  const waterLabel = t(
    spot.waterType as "saltwater" | "freshwater" | "pond" | "river",
  );
  const species = getSpotSpeciesLine(spot);

  const title = location
    ? t("seoSpotTitle", { name, location })
    : t("seoSpotTitleNoLocation", { name });

  let description: string;
  if (rawDescription.length >= MIN_SPOT_DESCRIPTION_CHARS) {
    description = truncateMetaDescription(rawDescription);
  } else {
    const extra = rawDescription || spot.googleAddress.trim();
    description = truncateMetaDescription(
      t("seoSpotDescriptionRich", {
        name,
        location: location || spot.googleAddress.trim(),
        water: waterLabel,
        species,
        extra,
      }),
    );
  }

  return { title, description };
}

export interface SpotsBrowseFilters {
  stateId?: string;
  districtId?: string;
  areaId?: string;
  water?: WaterType;
}

/** Canonical path after locale, e.g. `/spots/johor?water=pond`. */
export function buildSpotsSeoPath(filters: SpotsBrowseFilters): string {
  const { stateId, districtId, areaId, water } = filters;

  if (stateId && getStateById(stateId)) {
    const params = new URLSearchParams();
    if (districtId) params.set("district", districtId);
    if (areaId) params.set("area", areaId);
    if (water) params.set("water", water);
    const query = params.toString();
    return query ? `/spots/${stateId}?${query}` : `/spots/${stateId}`;
  }

  const params = new URLSearchParams();
  if (stateId) params.set("state", stateId);
  if (districtId) params.set("district", districtId);
  if (areaId) params.set("area", areaId);
  if (water) params.set("water", water);
  const query = params.toString();
  return query ? `/spots?${query}` : "/spots";
}

export function parseSpotsSearchParams(searchParams: {
  state?: string;
  district?: string;
  area?: string;
  water?: string;
}): SpotsBrowseFilters {
  return {
    stateId: searchParams.state,
    districtId: searchParams.district,
    areaId: searchParams.area,
    water: parseWaterTypeParam(searchParams.water),
  };
}

export function parseSpotsLocationFromUrl(
  pathname: string,
  searchParams: { get(name: string): string | null },
): SpotsBrowseFilters {
  const parts = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  const spotsIndex = parts.lastIndexOf("spots");
  const segmentAfter = spotsIndex >= 0 ? parts[spotsIndex + 1] : undefined;
  const stateFromPath = segmentAfter ? getStateBySlug(segmentAfter) : undefined;

  return {
    stateId: stateFromPath?.id ?? searchParams.get("state") ?? undefined,
    districtId: searchParams.get("district") ?? undefined,
    areaId: searchParams.get("area") ?? undefined,
    water: parseWaterTypeParam(searchParams.get("water")),
  };
}

export function getSpotStateLandingPaths(): string[] {
  return malaysiaStates.map((state) => `/spots/${state.slug}`);
}

type SpotsSeoCopyInput = {
  locale: Locale;
  t: (key: string, values?: Record<string, string | number>) => string;
  filters: SpotsBrowseFilters;
  spotCount?: number;
};

export function getSpotsSeoCopy({
  locale,
  t,
  filters,
  spotCount,
}: SpotsSeoCopyInput): { title: string; description: string; path: string } {
  const path = buildSpotsSeoPath(filters);
  const state = filters.stateId ? getStateById(filters.stateId) : undefined;
  const district =
    state && filters.districtId
      ? getDistrictById(state.id, filters.districtId)
      : undefined;
  const stateName = state ? getLocalizedText(state.name, locale) : "";
  const districtName = district ? getLocalizedText(district.name, locale) : "";
  const count = spotCount ?? 0;

  if (state && filters.water === "pond") {
    return {
      path,
      title: t("seoStatePondTitle", { state: stateName }),
      description: t("seoStatePondDescription", { state: stateName, count }),
    };
  }

  if (state && district) {
    return {
      path,
      title: t("seoDistrictTitle", { district: districtName, state: stateName }),
      description: t("seoDistrictDescription", {
        district: districtName,
        state: stateName,
        count,
      }),
    };
  }

  if (state) {
    return {
      path,
      title: t("seoStateTitle", { state: stateName }),
      description: t("seoStateDescription", { state: stateName, count }),
    };
  }

  return {
    path: "/spots",
    title: t("title"),
    description: t("seoBrowseDescription"),
  };
}
