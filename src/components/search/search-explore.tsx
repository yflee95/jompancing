"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ActivityCardClient } from "@/components/activities/activity-card-client";
import { ForumThreadCard } from "@/components/forum/forum-thread-card";
import { useForum } from "@/components/providers/forum-provider";
import {
  getPublicUserSpots,
  useUserSpots,
} from "@/components/providers/spots-provider";
import { SpotCard } from "@/components/spots/spot-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  globalSearch,
  searchForumInList,
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

  const results = useMemo(() => {
    if (!query.trim()) return initialResults;

    const publicUserSpots = getPublicUserSpots(userSpots);
    const userSpotMatches = searchSpotsInList(publicUserSpots, query);
    const userForumMatches = searchForumInList(userPosts, query);

    const seenSpotIds = new Set(initialResults.spots.map((s) => s.id));
    const seenForumIds = new Set(initialResults.forum.map((p) => p.id));

    return {
      spots: [
        ...initialResults.spots,
        ...userSpotMatches.filter((s) => !seenSpotIds.has(s.id)),
      ],
      forum: [
        ...initialResults.forum,
        ...userForumMatches.filter((p) => !seenForumIds.has(p.id)),
      ],
      activities: initialResults.activities,
    };
  }, [query, initialResults, userSpots, userPosts]);

  const total =
    results.spots.length + results.forum.length + results.activities.length;

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
