import { Megaphone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ActivityCard } from "@/components/activities/activity-card";
import { ActivityFilters } from "@/components/activities/activity-filters";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { filterActivities } from "@/data/mock-data";
import type { ActivitySort } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ActivitiesPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ state?: string; district?: string; sort?: ActivitySort }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "activities" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ActivitiesPage({
  params,
  searchParams,
}: ActivitiesPageProps) {
  const { locale } = await params;
  const { state, district, sort = "hot" } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("activities");

  const activities = filterActivities(state, district, sort);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-[var(--ink)]">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{t("subtitle")}</p>
        </div>
        <Button size="sm">
          <Megaphone className="h-4 w-4" />
          {t("promote")}
        </Button>
      </div>

      <div className="mb-6 rounded-2xl bg-[var(--ocean-light)] p-4 ring-1 ring-[var(--ocean)]/15">
        <p className="text-sm font-semibold text-[var(--ocean-dark)]">
          {t("promoteDesc")}
        </p>
      </div>

      <ActivityFilters
        locale={locale}
        currentState={state}
        currentDistrict={district}
        currentSort={sort}
      />

      {activities.length === 0 ? (
        <EmptyState
          className="mt-6"
          title={t("noActivities")}
          description={t("tryDifferentRegion")}
        />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
