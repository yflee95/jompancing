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

export async function fetchPublicSpotSlugsFromDb(): Promise<
  { slug: string; created_at: string | null }[]
> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("spots")
    .select("slug, created_at")
    .eq("visibility", "public");

  if (error) throw error;
  return data ?? [];
}
