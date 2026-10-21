import { getStateById } from "@/data/malaysia-states";
import type { WaterType } from "@/types";

export function buildSpotsBrowseHref(options: {
  stateId?: string;
  districtId?: string;
  areaId?: string;
  water?: WaterType;
}): string {
  const state = options.stateId ? getStateById(options.stateId) : undefined;
  const pathname = state ? `/spots/${state.slug}` : "/spots";
  const params = new URLSearchParams();

  if (options.districtId) params.set("district", options.districtId);
  if (options.areaId) params.set("area", options.areaId);
  if (options.water) params.set("water", options.water);

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
