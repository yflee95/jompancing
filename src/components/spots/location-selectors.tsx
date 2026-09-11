"use client";

import { useMemo } from "react";
import { Navigation } from "lucide-react";
import { useTranslations } from "next-intl";
import { getAreasByDistrict, getGeneralAreaId } from "@/data/malaysia-areas";
import { malaysiaStates } from "@/data/malaysia-states";
import { useUserLocation } from "@/hooks/use-user-location";
import { Label } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
  const tPost = useTranslations("post");
  const userLocation = useUserLocation(locale);

  const selectedState = malaysiaStates.find((s) => s.id === stateId);
  const areas = useMemo(
    () => (stateId && districtId ? getAreasByDistrict(stateId, districtId) : []),
    [stateId, districtId],
  );
  const showCustomArea =
    districtId && areaId === getGeneralAreaId(districtId);

  const selectClass =
    "h-11 w-full rounded-2xl border-0 bg-[var(--sand)] px-4 text-sm ring-1 ring-[var(--sand-dark)]/60 outline-none focus:ring-2 focus:ring-[var(--ocean)]/30";

  function applyGpsRegion() {
    const region = userLocation.region;
    if (!region) return;
    onStateChange(region.stateId);
    onDistrictChange(region.districtId);
  }

  const canUseGps =
    userLocation.status === "granted" && Boolean(userLocation.region);

  return (
    <div className="space-y-4 rounded-2xl bg-[var(--ocean-light)]/40 p-4 ring-1 ring-[var(--ocean)]/10">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ocean-dark)]">
          {t("locationSection")}
        </p>
        <button
          type="button"
          onClick={applyGpsRegion}
          disabled={!canUseGps}
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition",
            canUseGps
              ? "bg-white text-[var(--ocean-dark)] shadow-sm ring-1 ring-[var(--ocean)]/20 hover:bg-[var(--ocean-light)]"
              : "cursor-not-allowed bg-white/50 text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/30",
          )}
        >
          <Navigation
            className={cn(
              "h-3 w-3",
              userLocation.status === "pending" && "animate-pulse",
            )}
          />
          {userLocation.status === "pending"
            ? tPost("gpsDetecting")
            : canUseGps
              ? tPost("useMyLocation")
              : tPost("gpsUnavailable")}
        </button>
      </div>

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
