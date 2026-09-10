import { getAreaById, getGeneralAreaId } from "@/data/malaysia-areas";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import type { Locale } from "@/i18n/routing";
import { getLocalizedText, type FishingSpot } from "@/types";

export function getSpotAreaLabel(
  spot: Pick<FishingSpot, "stateId" | "districtId" | "areaId" | "areaName">,
  locale: Locale,
): string {
  if (spot.areaName?.trim()) return spot.areaName.trim();
  const area = getAreaById(spot.stateId, spot.districtId, spot.areaId);
  if (area) return getLocalizedText(area.name, locale);
  return "";
}

export function getSpotLocationLine(
  spot: Pick<
    FishingSpot,
    "stateId" | "districtId" | "areaId" | "areaName"
  >,
  locale: Locale,
): string {
  const state = getStateById(spot.stateId);
  const district = getDistrictById(spot.stateId, spot.districtId);
  const areaLabel = getSpotAreaLabel(spot, locale);

  const parts = [
    areaLabel,
    district ? getLocalizedText(district.name, locale) : "",
    state ? getLocalizedText(state.name, locale) : "",
  ].filter(Boolean);

  return parts.join(" · ");
}

export function isGeneralArea(areaId: string, districtId: string): boolean {
  return areaId === getGeneralAreaId(districtId);
}

export function filterSpotsByRegion(
  spots: FishingSpot[],
  stateId?: string,
  districtId?: string,
  areaId?: string,
): FishingSpot[] {
  return spots.filter((spot) => {
    if (stateId && spot.stateId !== stateId) return false;
    if (districtId && spot.districtId !== districtId) return false;
    if (areaId && spot.areaId !== areaId) return false;
    return true;
  });
}
