"use client";

import { useMemo } from "react";
import { Megaphone, TrendingUp, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HomeActivityRailCard } from "@/components/home/home-activity-rail-card";
import { SectionHeader } from "@/components/ui/section-header";
import { filterActivitiesByRegion } from "@/lib/activities";
import type { Activity } from "@/types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface HomePromotionSectionProps {
  activities: Activity[];
  locale: Locale;
  stateId?: string;
  districtId?: string;
}

export function HomePromotionSection({
  activities,
  locale,
  stateId,
  districtId,
}: HomePromotionSectionProps) {
  const t = useTranslations("home");
  const tActivities = useTranslations("activities");

  const promotedActivities = useMemo(
    () =>
      filterActivitiesByRegion(activities, stateId, districtId, "hot")
        .filter((a) => a.promoted)
        .slice(0, 3),
    [activities, stateId, districtId],
  );

  return (
    <section className="animate-fade-up border-t border-[var(--sand-dark)]/25 bg-[var(--sand)] py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeader title={t("promotions")} href="/activities/promote" linkLabel={tActivities("promote")} />
        <p className="mt-1 max-w-2xl text-sm text-[var(--ink-muted)]">
          {t("promotionsHint")}
        </p>
      </div>

      <div className="mx-auto mt-5 max-w-7xl space-y-4 px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--accent-light)] via-white to-[var(--ocean-light)] p-5 ring-1 ring-[var(--accent)]/20 md:flex md:items-center md:gap-6 md:p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-md shadow-[var(--accent-glow)]">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div className="mt-4 min-w-0 flex-1 md:mt-0">
            <h3 className="font-serif-display text-lg font-bold text-[var(--ink)] md:text-xl">
              {t("promotionPitchTitle")}
            </h3>
            <p className="mt-1.5 text-sm text-[var(--ink-muted)] md:text-base">
              {tActivities("promoteDesc")}
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-[var(--ink-muted)]">
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                {t("promotionBenefit1")}
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                {t("promotionBenefit2")}
              </li>
            </ul>
          </div>
          <Link
            href="/activities/promote"
            className="tap-card mt-4 inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[var(--accent-glow)] md:mt-0"
          >
            <Megaphone className="h-4 w-4" />
            {tActivities("promote")}
          </Link>
        </div>

        {promotedActivities.length > 0 && (
          <div
            className={cn(
              "flex gap-3 overflow-x-auto pb-2 scrollbar-none",
              "snap-x snap-mandatory [-webkit-overflow-scrolling:touch]",
              "md:grid md:grid-cols-2 md:overflow-visible md:snap-none lg:grid-cols-3",
            )}
          >
            {promotedActivities.map((activity) => (
              <HomeActivityRailCard
                key={activity.id}
                activity={activity}
                locale={locale}
                featured
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
