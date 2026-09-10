import { filterSpots, mockActivities, mockForumPosts } from "@/data/mock-data";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import type { Activity, FishingSpot, ForumPost } from "@/types";

function spotSearchText(spot: FishingSpot): string {
  const parts = [
    ...Object.values(spot.title),
    ...Object.values(spot.description),
    ...spot.species,
    ...spot.tags,
    spot.googleAddress,
    spot.areaName ?? "",
    spot.authorName,
    spot.slug.replace(/-/g, " "),
  ];
  const state = getStateById(spot.stateId);
  const district = getDistrictById(spot.stateId, spot.districtId);
  if (state) parts.push(...Object.values(state.name));
  if (district) parts.push(...Object.values(district.name));
  if (spot.areaId) parts.push(spot.areaId.replace(/-/g, " "));
  return parts.join(" ").toLowerCase();
}

function forumSearchText(post: ForumPost): string {
  return [
    ...Object.values(post.title),
    ...Object.values(post.body),
    post.authorName,
    post.category,
  ]
    .join(" ")
    .toLowerCase();
}

function activitySearchText(activity: Activity): string {
  return [
    ...Object.values(activity.title),
    ...Object.values(activity.description),
    ...Object.values(activity.venue),
    activity.organizer,
    activity.type,
  ]
    .join(" ")
    .toLowerCase();
}

export function matchesSearchTerms(haystack: string, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return false;
  const terms = normalized.split(/\s+/).filter(Boolean);
  return terms.every((term) => haystack.includes(term));
}

export function searchSpotsInList(
  spots: FishingSpot[],
  query: string,
): FishingSpot[] {
  if (!query.trim()) return [];
  return spots.filter((spot) => matchesSearchTerms(spotSearchText(spot), query));
}

export function searchForumInList(
  posts: ForumPost[],
  query: string,
): ForumPost[] {
  if (!query.trim()) return [];
  return posts.filter((post) =>
    matchesSearchTerms(forumSearchText(post), query),
  );
}

export interface GlobalSearchResults {
  spots: FishingSpot[];
  forum: ForumPost[];
  activities: Activity[];
}

export function globalSearch(query: string): GlobalSearchResults {
  const normalized = query.trim();
  if (!normalized) {
    return { spots: [], forum: [], activities: [] };
  }

  const forum = mockForumPosts.filter((post) =>
    matchesSearchTerms(forumSearchText(post), normalized),
  );

  const activities = mockActivities.filter((activity) =>
    matchesSearchTerms(activitySearchText(activity), normalized),
  );

  const spots = filterSpots(undefined, undefined, normalized);

  return { spots, forum, activities };
}
