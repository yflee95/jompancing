"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { malaysiaStates } from "@/data/malaysia-states";
import { getLocalizedText } from "@/types";
import type { ActivitySort } from "@/types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface ActivityFiltersProps {
  locale: Locale;
  currentState?: string;
  currentDistrict?: string;
  currentSort?: ActivitySort;
}

export function ActivityFilters({
  locale,
  currentState,
  currentDistrict,
  currentSort = "hot",
}: ActivityFiltersProps) {
  const t = useTranslations("activities");
  const router = useRouter();
  const pathname = usePathname();

  const selectedState = malaysiaStates.find((s) => s.id === currentState);

  function updateParams(
    stateId?: string,
    districtId?: string,
    sort?: ActivitySort,
  ) {
    const params = new URLSearchParams();
    if (stateId) params.set("state", stateId);
    if (districtId) params.set("district", districtId);
    if (sort && sort !== "hot") params.set("sort", sort);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const selectClass =
    "h-10 appearance-none rounded-full border-0 bg-white px-4 text-sm text-[var(--ink)] shadow-sm ring-1 ring-[var(--sand-dark)]/60 outline-none focus:ring-2 focus:ring-[var(--ocean)]/30";

  const sortOptions: { id: ActivitySort; label: string }[] = [
    { id: "hot", label: t("sortHot") },
    { id: "upcoming", label: t("sortUpcoming") },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {sortOptions.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => updateParams(currentState, currentDistrict, id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
              currentSort === id
                ? "bg-[var(--ocean)] text-white shadow-md shadow-[var(--ocean-glow)]"
                : "bg-white text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/60 hover:text-[var(--ink)]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={currentState ?? ""}
          onChange={(e) =>
            updateParams(e.target.value || undefined, undefined, currentSort)
          }
          className={selectClass}
          aria-label={t("filterState")}
        >
          <option value="">
            {t("filterAll")} — {t("filterState")}
          </option>
          {malaysiaStates.map((state) => (
            <option key={state.id} value={state.id}>
              {getLocalizedText(state.name, locale)}
            </option>
          ))}
        </select>

        {selectedState && (
          <select
            value={currentDistrict ?? ""}
            onChange={(e) =>
              updateParams(currentState, e.target.value || undefined, currentSort)
            }
            className={selectClass}
            aria-label={t("filterDistrict")}
          >
            <option value="">
              {t("filterAll")} — {t("filterDistrict")}
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
  );
}
