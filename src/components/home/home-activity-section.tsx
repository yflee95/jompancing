"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { HomeActivityEmptyCard } from "@/components/home/home-activity-empty-card";
import { HomeActivityRailCard } from "@/components/home/home-activity-rail-card";
import { SectionHeader } from "@/components/ui/section-header";
import { malaysiaStates } from "@/data/malaysia-states";
import { filterActivitiesByRegion } from "@/lib/activities";
import { getLocalizedText, type Activity } from "@/types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface HomeActivitySectionProps {
  activities: Activity[];
  locale: Locale;
  hasGps?: boolean;
  defaultStateId?: string;
  defaultDistrictId?: string;
}

export function HomeActivitySection({
  activities,
  locale,
  hasGps = false,
  defaultStateId,
  defaultDistrictId,
}: HomeActivitySectionProps) {
  const t = useTranslations("home");
  const tActivities = useTranslations("activities");
  const tCommon = useTranslations("common");

  const [stateId, setStateId] = useState<string | undefined>(defaultStateId);
  const [districtId, setDistrictId] = useState<string | undefined>(
    defaultDistrictId,
  );
  const [regionReady, setRegionReady] = useState(false);

  useEffect(() => {
    if (regionReady || !defaultStateId) return;
    setStateId(defaultStateId);
    setDistrictId(defaultDistrictId);
    setRegionReady(true);
  }, [defaultStateId, defaultDistrictId, regionReady]);

  const selectedState = malaysiaStates.find((s) => s.id === stateId);

  const filteredActivities = useMemo(
    () =>
      filterActivitiesByRegion(activities, stateId, districtId, "upcoming").slice(
        0,
        6,
      ),
    [activities, stateId, districtId],
  );

  const selectClass =
    "h-9 shrink-0 cursor-pointer appearance-none rounded-full border-0 bg-white px-3.5 text-xs font-medium text-[var(--ink)] shadow-sm ring-1 ring-[var(--sand-dark)]/60 outline-none focus:ring-2 focus:ring-[var(--ocean)]/30 sm:text-sm";

  return (
    <section className="animate-fade-up border-t border-[var(--sand-dark)]/25 bg-white/60 py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeader
          title={t("nearbyActivities")}
          href="/activities"
          linkLabel={tCommon("viewAll")}
        />
        <p className="mt-1 max-w-2xl text-sm text-[var(--ink-muted)]">
          {t("nearbyActivitiesHint")}
        </p>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <select
            value={stateId ?? ""}
            onChange={(e) => {
              const next = e.target.value || undefined;
              setStateId(next);
              setDistrictId(undefined);
            }}
            className={selectClass}
            aria-label={tActivities("filterState")}
          >
            <option value="">
              {tActivities("filterAll")} — {tActivities("filterState")}
            </option>
            {malaysiaStates.map((state) => (
              <option key={state.id} value={state.id}>
                {getLocalizedText(state.name, locale)}
              </option>
            ))}
          </select>

          {selectedState && (
            <select
              value={districtId ?? ""}
              onChange={(e) =>
                setDistrictId(e.target.value || undefined)
              }
              className={selectClass}
              aria-label={tActivities("filterDistrict")}
            >
              <option value="">
                {tActivities("filterAll")} — {tActivities("filterDistrict")}
              </option>
              {selectedState.districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {getLocalizedText(district.name, locale)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="mx-auto mt-5 max-w-7xl px-4 md:px-6">
          <HomeActivityEmptyCard
            locale={locale}
            hasGps={hasGps}
            stateId={stateId}
            districtId={districtId}
          />
        </div>
      ) : (
        <div
          className={cn(
            "mx-auto mt-5 flex max-w-7xl gap-3",
            "overflow-x-auto overscroll-x-contain scroll-pl-4 pb-2 pl-4 pr-4 scrollbar-none",
            "snap-x snap-mandatory [-webkit-overflow-scrolling:touch]",
            "md:grid md:grid-cols-2 md:overflow-visible md:px-6 md:pb-0 md:pl-6 md:pr-6 md:snap-none lg:grid-cols-3",
          )}
        >
          {filteredActivities.map((activity) => (
            <HomeActivityRailCard
              key={activity.id}
              activity={activity}
              locale={locale}
            />
          ))}
        </div>
      )}
    </section>
  );
}
