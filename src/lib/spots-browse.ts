import type { WaterType } from "@/types";

export function buildSpotsBrowseHref(options: {
  stateId?: string;
  districtId?: string;
  areaId?: string;
  water?: WaterType;
}): string {
  const params = new URLSearchParams();
  if (options.stateId) params.set("state", options.stateId);
  if (options.districtId) params.set("district", options.districtId);
  if (options.areaId) params.set("area", options.areaId);
  if (options.water) params.set("water", options.water);
  const query = params.toString();
  return query ? `/spots?${query}` : "/spots";
}
