import type { WaterType } from "@/types";

const WATER_TYPES: readonly WaterType[] = [
  "saltwater",
  "freshwater",
  "pond",
  "river",
];

export function parseWaterTypeParam(
  value: string | null | undefined,
): WaterType | undefined {
  if (!value) return undefined;
  return WATER_TYPES.includes(value as WaterType)
    ? (value as WaterType)
    : undefined;
}
