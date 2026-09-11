"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ListingCard } from "@/components/marketplace/listing-card";
import { ListingAddCard } from "@/components/marketplace/listing-shelf-cards";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/page-loader";
import { malaysiaStates } from "@/data/malaysia-states";
import { searchListingsInList } from "@/lib/search";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface MarketplaceExploreProps {
  locale: Locale;
}

export function MarketplaceExplore({ locale }: MarketplaceExploreProps) {
  const t = useTranslations("marketplace");
  const { listings, isLoaded } = useMarketplace();
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const sortedListings = useMemo(
    () =>
      [...listings].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [listings],
  );

  const filteredListings = useMemo(() => {
    let list = sortedListings;
    if (stateFilter) {
      list = list.filter((listing) => listing.stateId === stateFilter);
    }
    if (query.trim()) {
      list = searchListingsInList(list, query);
    }
    return list;
  }, [sortedListings, stateFilter, query]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif-display text-2xl font-bold text-[var(--ink)]">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{t("subtitle")}</p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 self-start" asChild>
          <Link href="/marketplace/new">{t("postListing")}</Link>
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 w-full rounded-full bg-white pl-10 pr-4 text-sm ring-1 ring-[var(--sand-dark)]/60 outline-none focus:ring-2 focus:ring-[var(--ocean)]/25"
          />
        </div>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          aria-label={t("filterState")}
          className="h-11 shrink-0 rounded-full bg-white px-4 text-sm font-medium text-[var(--ink)] ring-1 ring-[var(--sand-dark)]/60 outline-none focus:ring-2 focus:ring-[var(--ocean)]/25 sm:min-w-[10rem]"
        >
          <option value="">{t("filterAllStates")}</option>
          {malaysiaStates.map((state) => (
            <option key={state.id} value={state.id}>
              {getLocalizedText(state.name, locale)}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-6 rounded-2xl bg-white p-3 text-xs leading-relaxed text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/40">
        {t("codDisclaimer")}
      </p>

      {!isLoaded ? (
        <PageLoader compact label={t("loadingListings")} />
      ) : sortedListings.length === 0 ? (
        <EmptyState
          className="mt-4"
          title={t("noListings")}
          description={t("beFirstSeller")}
          actionLabel={t("postListing")}
          actionHref="/marketplace/new"
        />
      ) : filteredListings.length === 0 ? (
        <div className="mt-4 space-y-4">
          <EmptyState
            title={t("noFilterResults")}
            description={t("tryDifferentFilter")}
          />
          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setQuery("");
                setStateFilter("");
              }}
            >
              {t("clearFilters")}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-3 text-sm text-[var(--ink-muted)]">
            {t("resultCount", { count: filteredListings.length })}
          </p>
          <div className="grid grid-cols-2 items-stretch gap-3 pb-2 md:grid-cols-3 md:gap-4">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} locale={locale} />
            ))}
            <ListingAddCard layout="grid" />
          </div>
        </>
      )}
    </>
  );
}
