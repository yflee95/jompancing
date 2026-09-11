"use client";

import { Megaphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ActivityCard } from "@/components/activities/activity-card";
import { ActivityFilters } from "@/components/activities/activity-filters";
import { useActivities } from "@/components/providers/activities-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { FREE_PROMOTION_DAYS, PAID_PROMOTION_DAILY_RM } from "@/lib/promotion";
import { filterActivitiesByRegion } from "@/lib/activities";
import type { ActivitySort } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ActivitiesExploreProps {
  locale: Locale;
  currentState?: string;
  currentDistrict?: string;
  currentSort?: ActivitySort;
}

export function ActivitiesExplore({
  locale,
  currentState,
  currentDistrict,
  currentSort = "hot",
}: ActivitiesExploreProps) {
  const t = useTranslations("activities");
  const { activities } = useActivities();

  const filtered = filterActivitiesByRegion(
    activities,
    currentState,
    currentDistrict,
    currentSort,
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-[var(--ink)]">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{t("subtitle")}</p>
        </div>
        <Link
          href="/activities/promote"
          className="tap-card inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[var(--accent-glow)]"
        >
          <Megaphone className="h-4 w-4" />
          {t("promote")}
        </Link>
      </div>

      <div className="mb-6 rounded-2xl bg-[var(--ocean-light)] p-4 ring-1 ring-[var(--ocean)]/15">
        <p className="text-sm font-semibold text-[var(--ocean-dark)]">
          {t("promoteDesc", {
            days: FREE_PROMOTION_DAYS,
            price: PAID_PROMOTION_DAILY_RM,
          })}
        </p>
      </div>

      <ActivityFilters
        locale={locale}
        currentState={currentState}
        currentDistrict={currentDistrict}
        currentSort={currentSort}
      />

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-6"
          title={t("noActivities")}
          description={t("noActivitiesPromoteHint")}
          actionLabel={t("promote")}
          actionHref="/activities/promote"
        />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} locale={locale} />
          ))}
        </div>
      )}
    </>
  );
}
