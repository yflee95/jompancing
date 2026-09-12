import type { FishingSpot } from "@/types";

export const NEARBY_RADIUS_KM = 120;
export const DECK_SIZE = 8;
const NEARBY_DECK_QUOTA = 4;
const LATEST_SHARED_QUOTA = 4;

export type SpotWithDistance = FishingSpot & { distanceKm?: number };

function byCreatedAtDesc(a: FishingSpot, b: FishingSpot): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function byDistanceAsc(a: SpotWithDistance, b: SpotWithDistance): number {
  return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
}

/** Home deck: nearest spots + latest angler-shared spots, deduped. */
export function buildHomeDeckSpots(
  spots: SpotWithDistance[],
  options: {
    hasGps: boolean;
    radiusKm?: number;
    deckSize?: number;
  },
): SpotWithDistance[] {
  const radiusKm = options.radiusKm ?? NEARBY_RADIUS_KM;
  const deckSize = options.deckSize ?? DECK_SIZE;

  const nearestPool = options.hasGps
    ? (() => {
        const withinRadius = spots.filter(
          (spot) =>
            spot.distanceKm !== undefined && spot.distanceKm <= radiusKm,
        );
        const pool =
          withinRadius.length >= 2
            ? withinRadius
            : spots.filter((spot) => spot.distanceKm !== undefined);
        return [...pool].sort(byDistanceAsc);
      })()
    : [];

  const latestShared = [...spots]
    .filter((spot) => spot.isUserGenerated)
    .sort(byCreatedAtDesc);

  const nearestPick = nearestPool.slice(0, NEARBY_DECK_QUOTA);
  const latestPick = latestShared.slice(0, LATEST_SHARED_QUOTA);

  const merged: SpotWithDistance[] = [];
  const seen = new Set<string>();

  function pushSpot(spot: SpotWithDistance | undefined) {
    if (!spot || seen.has(spot.id) || merged.length >= deckSize) return;
    seen.add(spot.id);
    merged.push(spot);
  }

  const maxLen = Math.max(nearestPick.length, latestPick.length);
  for (let i = 0; i < maxLen && merged.length < deckSize; i++) {
    pushSpot(nearestPick[i]);
    pushSpot(latestPick[i]);
  }

  if (merged.length < deckSize) {
    for (const spot of [...nearestPool, ...latestShared, ...spots]) {
      pushSpot(spot);
      if (merged.length >= deckSize) break;
    }
  }

  return merged.slice(0, deckSize);
}
