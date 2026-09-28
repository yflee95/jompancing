import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { mapSpotRow } from "@/lib/supabase/spots";
import type { FishingSpot } from "@/types";

const SPOT_SELECT = `
  *,
  profiles ( name, avatar_url ),
  spot_photos ( url, sort_order )
`;

export async function fetchSpotBySlugFromDb(
  slug: string,
): Promise<FishingSpot | null> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("spots")
    .select(SPOT_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapSpotRow(data);
}

export async function fetchPublicSpotsFromDb(): Promise<FishingSpot[]> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("spots")
    .select(SPOT_SELECT)
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as Parameters<typeof mapSpotRow>[0][]).map(mapSpotRow);
}

type PublicSpotSlugRow = {
  slug: string;
  created_at: string | null;
  updated_at?: string | null;
};

export async function fetchPublicSpotSlugsFromDb(): Promise<
  PublicSpotSlugRow[]
> {
  const supabase = createPublicSupabaseClient();
  const withUpdated = await supabase
    .from("spots")
    .select("slug, created_at, updated_at")
    .eq("visibility", "public");

  if (!withUpdated.error) {
    return (withUpdated.data ?? []) as PublicSpotSlugRow[];
  }

  const fallback = await supabase
    .from("spots")
    .select("slug, created_at")
    .eq("visibility", "public");

  if (fallback.error) throw fallback.error;
  return (fallback.data ?? []) as PublicSpotSlugRow[];
}
