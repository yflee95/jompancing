import { buildSpotsSeoPath } from "@/lib/spots-seo";
import type { WaterType } from "@/types";

export function buildSpotsBrowseHref(options: {
  stateId?: string;
  districtId?: string;
  areaId?: string;
  water?: WaterType;
}): string {
  return buildSpotsSeoPath(options);
}
