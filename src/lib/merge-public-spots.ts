import type { FishingSpot } from "@/types";

/** SSR/server list wins on id conflicts so admin deletes are not masked by stale client cache. */
export function mergePublicSpots(
  serverSpots: FishingSpot[],
  clientSpots: FishingSpot[],
): FishingSpot[] {
  const byId = new Map<string, FishingSpot>();

  for (const spot of serverSpots) {
    if (spot.visibility === "public") byId.set(spot.id, spot);
  }

  for (const spot of clientSpots) {
    if (spot.visibility === "public" && !byId.has(spot.id)) {
      byId.set(spot.id, spot);
    }
  }

  return Array.from(byId.values());
}
