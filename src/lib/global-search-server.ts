import { mockForumPosts } from "@/data/mock-data";
import { shouldUseMockContent } from "@/lib/mock-content";
import { loadPublicSpots } from "@/lib/public-spots";
import {
  searchActivitiesInList,
  searchForumInList,
  searchListingsInList,
  searchSpotsInList,
  type GlobalSearchResults,
} from "@/lib/search";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchActivitiesFromDb } from "@/lib/supabase/activities";
import { fetchForumPostsFromDb } from "@/lib/supabase/forum";
import { fetchListingsFromDb } from "@/lib/supabase/marketplace";
import type { ForumPost } from "@/types";

function dedupeForum(posts: ForumPost[]): ForumPost[] {
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  return posts.filter((post) => {
    if (seenIds.has(post.id) || seenSlugs.has(post.slug)) return false;
    seenIds.add(post.id);
    seenSlugs.add(post.slug);
    return true;
  });
}

export async function loadGlobalSearchResults(
  query: string,
): Promise<GlobalSearchResults> {
  const normalized = query.trim();
  if (!normalized) {
    return { spots: [], forum: [], activities: [], listings: [] };
  }

  const spotsPromise = loadPublicSpots().catch(() => []);
  const activitiesPromise = isSupabaseConfigured()
    ? fetchActivitiesFromDb().catch(() => [])
    : Promise.resolve([]);
  const forumPromise = isSupabaseConfigured()
    ? fetchForumPostsFromDb().catch(() => [])
    : Promise.resolve([]);
  const listingsPromise = isSupabaseConfigured()
    ? fetchListingsFromDb().catch(() => [])
    : Promise.resolve([]);

  const [spots, activities, forumDb, listings] = await Promise.all([
    spotsPromise,
    activitiesPromise,
    forumPromise,
    listingsPromise,
  ]);

  return {
    spots: searchSpotsInList(spots, normalized),
    forum: dedupeForum(
      searchForumInList(
        [...forumDb, ...(shouldUseMockContent() ? mockForumPosts : [])],
        normalized,
      ),
    ),
    activities: searchActivitiesInList(activities, normalized),
    listings: searchListingsInList(listings, normalized),
  };
}
