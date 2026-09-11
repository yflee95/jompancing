import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SearchExplore } from "@/components/search/search-explore";
import { globalSearch } from "@/lib/search";
import type { Locale } from "@/i18n/routing";

interface SearchPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("search");

  const query = q?.trim() ?? "";
  const initialResults = globalSearch(query);
  const total =
    initialResults.spots.length +
    initialResults.forum.length +
    initialResults.activities.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-8">
      <h1 className="font-serif-display text-2xl font-bold text-[var(--ink)]">
        {t("title")}
      </h1>
      {query ? (
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          {t("resultsFor", { query })}
          <span className="mx-1.5">·</span>
          {t("totalCount", { count: total })}
        </p>
      ) : (
        <p className="mt-2 text-sm text-[var(--ink-muted)]">{t("hint")}</p>
      )}

      {query ? (
        <Suspense fallback={null}>
          <SearchExplore
            query={query}
            locale={locale}
            initialResults={initialResults}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
