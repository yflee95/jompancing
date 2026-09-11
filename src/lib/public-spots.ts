import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchPublicSpotsFromDb } from "@/lib/supabase/spots-server";
import type { FishingSpot } from "@/types";

/** Public spots for SSR — Supabase only (no mock fallback). */
export async function loadPublicSpots(): Promise<FishingSpot[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    return await fetchPublicSpotsFromDb();
  } catch {
    return [];
  }
}
