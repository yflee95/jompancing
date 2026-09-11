"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ActivityCardClient } from "@/components/activities/activity-card-client";
import { ForumThreadCard } from "@/components/forum/forum-thread-card";
import { ListingCard } from "@/components/marketplace/listing-card";
import { useActivities } from "@/components/providers/activities-provider";
import { useForum } from "@/components/providers/forum-provider";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import {
  getPublicUserSpots,
  useUserSpots,
} from "@/components/providers/spots-provider";
import { SpotCard } from "@/components/spots/spot-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  searchActivitiesInList,
  searchForumInList,
  searchListingsInList,
  searchSpotsInList,
  type GlobalSearchResults,
} from "@/lib/search";
import type { Locale } from "@/i18n/routing";

interface SearchExploreProps {
  query: string;
  locale: Locale;
  initialResults: GlobalSearchResults;
}

export function SearchExplore({
  query,
  locale,
  initialResults,
}: SearchExploreProps) {
  const t = useTranslations("search");
  const { userSpots } = useUserSpots();
  const { userPosts } = useForum();
  const { activities } = useActivities();
  const { listings } = useMarketplace();

  const results = useMemo(() => {
    const publicUserSpots = getPublicUserSpots(userSpots);
    const userSpotMatches = searchSpotsInList(publicUserSpots, query);
    const userForumMatches = searchForumInList(userPosts, query);
    const clientActivityMatches = searchActivitiesInList(activities, query);
    const clientListingMatches = searchListingsInList(listings, query);

    const seenSpotIds = new Set(initialResults.spots.map((s) => s.id));
    const seenForumIds = new Set(initialResults.forum.map((p) => p.id));
    const seenActivityIds = new Set(initialResults.activities.map((a) => a.id));
    const seenListingIds = new Set(initialResults.listings.map((l) => l.id));

    return {
      spots: [
        ...initialResults.spots,
        ...userSpotMatches.filter((s) => !seenSpotIds.has(s.id)),
      ],
      forum: [
        ...initialResults.forum,
        ...userForumMatches.filter((p) => !seenForumIds.has(p.id)),
      ],
      activities: [
        ...initialResults.activities,
        ...clientActivityMatches.filter((a) => !seenActivityIds.has(a.id)),
      ],
      listings: [
        ...initialResults.listings,
        ...clientListingMatches.filter((l) => !seenListingIds.has(l.id)),
      ],
    };
  }, [
    query,
    initialResults,
    userSpots,
    userPosts,
    activities,
    listings,
  ]);

  const total =
    results.spots.length +
    results.forum.length +
    results.activities.length +
    results.listings.length;

  if (!query.trim()) return null;

  if (total === 0) {
    return (
      <EmptyState
        className="mt-8"
        title={t("noResults", { query })}
        description={t("tryDifferent")}
        actionLabel={t("clearSearch")}
        actionHref="/spots"
      />
    );
  }

  return (
    <div className="mt-8 space-y-10">
      {results.spots.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
            {t("spots")} ({results.spots.length})
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {results.spots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {results.listings.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
            {t("listings")} ({results.listings.length})
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {results.listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {results.forum.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
            {t("forum")} ({results.forum.length})
          </h2>
          <div className="space-y-3">
            {results.forum.map((post) => (
              <ForumThreadCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {results.activities.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
            {t("activities")} ({results.activities.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {results.activities.map((activity) => (
              <ActivityCardClient
                key={activity.id}
                activity={activity}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
