import {
  mockActivities,
  mockForumPosts,
  mockSpots,
} from "@/data/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const PUBLIC_STATIC_PATHS = [
  "",
  "/spots",
  "/map",
  "/activities",
  "/forum",
  "/guide",
  "/marketplace",
] as const;

export interface SitemapSlugEntry {
  slug: string;
  lastModified: Date;
}

export async function getPublicSpotSlugs(): Promise<SitemapSlugEntry[]> {
  const seen = new Set<string>();
  const entries: SitemapSlugEntry[] = [];

  for (const spot of mockSpots) {
    if (spot.visibility !== "public" || seen.has(spot.slug)) continue;
    seen.add(spot.slug);
    entries.push({
      slug: spot.slug,
      lastModified: new Date(spot.createdAt),
    });
  }

  if (!isSupabaseConfigured()) return entries;

  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("spots")
      .select("slug, created_at")
      .eq("visibility", "public");

    for (const row of data ?? []) {
      if (!row.slug || seen.has(row.slug)) continue;
      seen.add(row.slug);
      entries.push({
        slug: row.slug,
        lastModified: new Date(row.created_at ?? Date.now()),
      });
    }
  } catch {
    /* mock slugs only */
  }

  return entries;
}

export function getForumSlugs(): SitemapSlugEntry[] {
  return mockForumPosts.map((post) => ({
    slug: post.slug,
    lastModified: new Date(post.createdAt),
  }));
}

export function getActivitySlugs(): SitemapSlugEntry[] {
  return mockActivities.map((activity) => ({
    slug: activity.slug,
    lastModified: new Date(activity.startDate),
  }));
}
