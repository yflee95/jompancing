"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { getAreasByDistrict, getGeneralAreaId } from "@/data/malaysia-areas";
import { malaysiaStates } from "@/data/malaysia-states";
import { Label } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface LocationSelectorsProps {
  locale: Locale;
  stateId: string;
  districtId: string;
  areaId: string;
  areaName: string;
  onStateChange: (stateId: string) => void;
  onDistrictChange: (districtId: string) => void;
  onAreaChange: (areaId: string) => void;
  onAreaNameChange: (name: string) => void;
}

export function LocationSelectors({
  locale,
  stateId,
  districtId,
  areaId,
  areaName,
  onStateChange,
  onDistrictChange,
  onAreaChange,
  onAreaNameChange,
}: LocationSelectorsProps) {
  const t = useTranslations("spots");

  const selectedState = malaysiaStates.find((s) => s.id === stateId);
  const areas = useMemo(
    () => (stateId && districtId ? getAreasByDistrict(stateId, districtId) : []),
    [stateId, districtId],
  );
  const showCustomArea =
    districtId && areaId === getGeneralAreaId(districtId);

  const selectClass =
    "h-11 w-full rounded-2xl border-0 bg-[var(--sand)] px-4 text-sm ring-1 ring-[var(--sand-dark)]/60 outline-none focus:ring-2 focus:ring-[var(--ocean)]/30";

  return (
    <div className="space-y-4 rounded-2xl bg-[var(--ocean-light)]/40 p-4 ring-1 ring-[var(--ocean)]/10">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ocean-dark)]">
        {t("locationSection")}
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="state">{t("filterState")} *</Label>
        <select
          id="state"
          required
          value={stateId}
          onChange={(e) => onStateChange(e.target.value)}
          className={selectClass}
        >
          <option value="">{t("selectState")}</option>
          {malaysiaStates.map((state) => (
            <option key={state.id} value={state.id}>
              {getLocalizedText(state.name, locale)}
            </option>
          ))}
        </select>
      </div>

      {selectedState && (
        <div className="space-y-1.5">
          <Label htmlFor="district">{t("filterDistrict")} *</Label>
          <select
            id="district"
            required
            value={districtId}
            onChange={(e) => onDistrictChange(e.target.value)}
            className={selectClass}
          >
            <option value="">{t("selectDistrict")}</option>
            {selectedState.districts.map((district) => (
              <option key={district.id} value={district.id}>
                {getLocalizedText(district.name, locale)}
              </option>
            ))}
          </select>
        </div>
      )}

      {stateId && districtId && (
        <div className="space-y-1.5">
          <Label htmlFor="area">{t("filterArea")} *</Label>
          <select
            id="area"
            required
            value={areaId}
            onChange={(e) => onAreaChange(e.target.value)}
            className={selectClass}
          >
            <option value="">{t("selectArea")}</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {getLocalizedText(area.name, locale)}
              </option>
            ))}
          </select>
        </div>
      )}

      {showCustomArea && (
        <div className="space-y-1.5">
          <Label htmlFor="areaName">{t("areaName")} *</Label>
          <Input
            id="areaName"
            value={areaName}
            onChange={(e) => onAreaNameChange(e.target.value)}
            placeholder={t("areaNamePlaceholder")}
            required
          />
        </div>
      )}
    </div>
  );
}
