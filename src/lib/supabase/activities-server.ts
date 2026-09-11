import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { mapActivityRow } from "@/lib/supabase/activities";
import type { Activity } from "@/types";

const ACTIVITY_SELECT = `
  *,
  profiles ( name )
`;

export async function fetchActivityBySlugFromDb(
  slug: string,
): Promise<Activity | null> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("activities")
    .select(ACTIVITY_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapActivityRow(data);
}

export async function fetchPublicActivitySlugsFromDb(): Promise<
  { slug: string; start_date: string | null }[]
> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("activities")
    .select("slug, start_date");

  if (error) throw error;
  return data ?? [];
}
