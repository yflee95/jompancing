import { mockActivities, mockForumPosts } from "@/data/mock-data";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import type {
  Activity,
  FishingSpot,
  ForumPost,
  MarketplaceListing,
} from "@/types";

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

export function searchActivitiesInList(
  activities: Activity[],
  query: string,
): Activity[] {
  if (!query.trim()) return [];
  return activities.filter((activity) =>
    matchesSearchTerms(activitySearchText(activity), query),
  );
}

function listingSearchText(listing: MarketplaceListing): string {
  const state = getStateById(listing.stateId);
  const district = getDistrictById(listing.stateId, listing.districtId);
  const parts = [
    ...Object.values(listing.title),
    ...Object.values(listing.description),
    listing.sellerName,
    listing.slug.replace(/-/g, " "),
    listing.condition,
    String(listing.price),
  ];
  if (state) parts.push(...Object.values(state.name));
  if (district) parts.push(...Object.values(district.name));
  return parts.join(" ").toLowerCase();
}

export function searchListingsInList(
  listings: MarketplaceListing[],
  query: string,
): MarketplaceListing[] {
  if (!query.trim()) return [];
  return listings.filter((listing) =>
    matchesSearchTerms(listingSearchText(listing), query),
  );
}

export interface GlobalSearchResults {
  spots: FishingSpot[];
  forum: ForumPost[];
  activities: Activity[];
  listings: MarketplaceListing[];
}

/** @deprecated Use loadGlobalSearchResults on the server. */
export function globalSearch(query: string): GlobalSearchResults {
  const normalized = query.trim();
  if (!normalized) {
    return { spots: [], forum: [], activities: [], listings: [] };
  }

  const forum = mockForumPosts.filter((post) =>
    matchesSearchTerms(forumSearchText(post), normalized),
  );

  const activities = mockActivities.filter((activity) =>
    matchesSearchTerms(activitySearchText(activity), normalized),
  );

  return { spots: [], forum, activities, listings: [] };
}
