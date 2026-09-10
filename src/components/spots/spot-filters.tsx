"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { malaysiaStates } from "@/data/malaysia-states";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotFiltersProps {
  locale: Locale;
  currentState?: string;
  currentDistrict?: string;
}

export function SpotFilters({
  locale,
  currentState,
  currentDistrict,
}: SpotFiltersProps) {
  const t = useTranslations("spots");
  const router = useRouter();
  const pathname = usePathname();

  const selectedState = malaysiaStates.find((s) => s.id === currentState);

  function updateParams(stateId?: string, districtId?: string) {
    const params = new URLSearchParams();
    if (stateId) params.set("state", stateId);
    if (districtId) params.set("district", districtId);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={currentState ?? ""}
        onChange={(e) => updateParams(e.target.value || undefined, undefined)}
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
        aria-label={t("filterState")}
      >
        <option value="">{t("filterAll")} — {t("filterState")}</option>
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
            updateParams(currentState, e.target.value || undefined)
          }
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          aria-label={t("filterDistrict")}
        >
          <option value="">{t("filterAll")} — {t("filterDistrict")}</option>
          {selectedState.districts.map((district) => (
            <option key={district.id} value={district.id}>
              {getLocalizedText(district.name, locale)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
