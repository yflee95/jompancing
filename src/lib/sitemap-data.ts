import {

  mockActivities,

  mockArticles,

  mockForumPosts,

} from "@/data/mock-data";

import { isSupabaseConfigured } from "@/lib/supabase/config";

import { fetchForumPostsFromDb } from "@/lib/supabase/forum";

import { fetchPublicSpotSlugsFromDb } from "@/lib/supabase/spots-server";



export const PUBLIC_STATIC_PATHS = [

  "",

  "/spots",

  "/map",

  "/activities",

  "/forum",

  "/guide",

  "/marketplace",
  "/privacy",
  "/terms",

] as const;



export interface SitemapSlugEntry {

  slug: string;

  lastModified: Date;

}



function safeDate(value: string | null | undefined): Date {

  if (!value) return new Date();

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;

}



export async function getPublicSpotSlugs(): Promise<SitemapSlugEntry[]> {

  const seen = new Set<string>();

  const entries: SitemapSlugEntry[] = [];



  if (!isSupabaseConfigured()) return entries;



  try {

    const rows = await fetchPublicSpotSlugsFromDb();

    for (const row of rows) {

      if (!row.slug || seen.has(row.slug)) continue;

      seen.add(row.slug);

      entries.push({

        slug: row.slug,

        lastModified: safeDate(row.created_at),

      });

    }

  } catch {

    /* mock slugs only */

  }



  return entries;

}



export async function getForumSlugs(): Promise<SitemapSlugEntry[]> {

  const seen = new Set<string>();

  const entries: SitemapSlugEntry[] = [];



  for (const post of mockForumPosts) {

    if (seen.has(post.slug)) continue;

    seen.add(post.slug);

    entries.push({

      slug: post.slug,

      lastModified: safeDate(post.createdAt),

    });

  }



  if (!isSupabaseConfigured()) return entries;



  try {

    const posts = await fetchForumPostsFromDb();

    for (const post of posts) {

      if (seen.has(post.slug)) continue;

      seen.add(post.slug);

      entries.push({

        slug: post.slug,

        lastModified: safeDate(post.lastReplyAt ?? post.createdAt),

      });

    }

  } catch {

    /* mock slugs only */

  }



  return entries;

}



export async function getActivitySlugs(): Promise<SitemapSlugEntry[]> {
  const seen = new Set<string>();
  const entries: SitemapSlugEntry[] = [];

  for (const activity of mockActivities) {
    if (seen.has(activity.slug)) continue;
    seen.add(activity.slug);
    entries.push({
      slug: activity.slug,
      lastModified: safeDate(activity.startDate),
    });
  }

  if (!isSupabaseConfigured()) return entries;

  try {
    const { fetchPublicActivitySlugsFromDb } = await import(
      "@/lib/supabase/activities-server"
    );
    const rows = await fetchPublicActivitySlugsFromDb();
    for (const row of rows) {
      if (!row.slug || seen.has(row.slug)) continue;
      seen.add(row.slug);
      entries.push({
        slug: row.slug,
        lastModified: safeDate(row.start_date),
      });
    }
  } catch {
    /* mock slugs only */
  }

  return entries;
}

export async function getMarketplaceSlugs(): Promise<SitemapSlugEntry[]> {
  const { fetchListingsFromDb } = await import("@/lib/supabase/marketplace");

  const seen = new Set<string>();
  const entries: SitemapSlugEntry[] = [];

  if (!isSupabaseConfigured()) return entries;

  try {
    const listings = await fetchListingsFromDb();
    for (const listing of listings) {
      if (seen.has(listing.slug)) continue;
      seen.add(listing.slug);
      entries.push({
        slug: listing.slug,
        lastModified: safeDate(listing.createdAt),
      });
    }
  } catch {
    /* mock slugs only */
  }

  return entries;
}

export async function getGuideSlugs(): Promise<SitemapSlugEntry[]> {
  const seen = new Set<string>();
  const entries: SitemapSlugEntry[] = [];

  for (const article of mockArticles) {
    if (seen.has(article.slug)) continue;
    seen.add(article.slug);
    entries.push({
      slug: article.slug,
      lastModified: safeDate(article.publishedAt),
    });
  }

  return entries;
}

