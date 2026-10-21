"use client";

import { useSyncExternalStore } from "react";
import { getSavedSpotSlugs, subscribeSavedSpots } from "@/lib/saved-spots";

const EMPTY_SNAPSHOT: string[] = [];

export function useSavedSpots() {
  const slugs = useSyncExternalStore(
    subscribeSavedSpots,
    getSavedSpotSlugs,
    () => EMPTY_SNAPSHOT,
  );

  return { slugs };
}
