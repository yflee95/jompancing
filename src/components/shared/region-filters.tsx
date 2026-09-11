"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, MapPin, Navigation } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { getAreasByDistrict } from "@/data/malaysia-areas";
import { malaysiaStates } from "@/data/malaysia-states";
import { useUserLocation } from "@/hooks/use-user-location";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface RegionFiltersProps {
  locale: Locale;
  currentState?: string;
  currentDistrict?: string;
  currentArea?: string;
  className?: string;
  compact?: boolean;
}

export function RegionFilters({
  locale,
  currentState,
  currentDistrict,
  currentArea,
  className,
  compact,
}: RegionFiltersProps) {
  const t = useTranslations("spots");
  const tPost = useTranslations("post");
  const router = useRouter();
  const pathname = usePathname();
  const userLocation = useUserLocation(locale);
  const [applyingGps, setApplyingGps] = useState(false);

  const selectedState = malaysiaStates.find((s) => s.id === currentState);
  const areas =
    currentState && currentDistrict
      ? getAreasByDistrict(currentState, currentDistrict)
      : [];

  function updateParams(
    stateId?: string,
    districtId?: string,
    areaId?: string,
  ) {
    const params = new URLSearchParams();
    if (stateId) params.set("state", stateId);
    if (districtId) params.set("district", districtId);
    if (areaId) params.set("area", areaId);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  function applyGpsRegion() {
    const region = userLocation.region;
    if (!region) return;
    setApplyingGps(true);
    updateParams(region.stateId, region.districtId);
    setApplyingGps(false);
  }

  const canUseGps =
    userLocation.status === "granted" && Boolean(userLocation.region);

  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto scrollbar-none",
        compact ? "pb-0" : "mt-3 pb-0.5",
        className,
      )}
      aria-label={t("locationSection")}
    >
      {!compact && (
        <MapPin
          className="hidden h-4 w-4 shrink-0 text-[var(--ocean)] sm:block"
          aria-hidden
        />
      )}

      <button
        type="button"
        onClick={applyGpsRegion}
        disabled={!canUseGps || applyingGps}
        title={tPost("useMyLocation")}
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 font-semibold transition ring-1",
          compact ? "h-8 text-[10px]" : "h-9 text-[11px]",
          canUseGps
            ? "bg-[var(--ocean-light)] text-[var(--ocean-dark)] ring-[var(--ocean)]/25 hover:bg-[var(--ocean-light)]/80"
            : "cursor-not-allowed bg-white text-[var(--ink-muted)] ring-[var(--sand-dark)]/40 opacity-60",
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
          : tPost("nearMe")}
      </button>

      <FilterPill
        compact={compact}
        label={t("filterState")}
        value={currentState ?? ""}
        placeholder={`${t("filterAll")} · ${t("filterState")}`}
        active={Boolean(currentState)}
        onChange={(value) => updateParams(value || undefined)}
      >
        {malaysiaStates.map((state) => (
          <option key={state.id} value={state.id}>
            {getLocalizedText(state.name, locale)}
          </option>
        ))}
      </FilterPill>

      <FilterPill
        compact={compact}
        label={t("filterDistrict")}
        value={currentDistrict ?? ""}
        placeholder={`${t("filterAll")} · ${t("filterDistrict")}`}
        active={Boolean(currentDistrict)}
        disabled={!selectedState}
        onChange={(value) => updateParams(currentState, value || undefined)}
      >
        {selectedState?.districts.map((district) => (
          <option key={district.id} value={district.id}>
            {getLocalizedText(district.name, locale)}
          </option>
        ))}
      </FilterPill>

      <FilterPill
        compact={compact}
        label={t("filterArea")}
        value={currentArea ?? ""}
        placeholder={`${t("filterAll")} · ${t("filterArea")}`}
        active={Boolean(currentArea)}
        disabled={!currentState || !currentDistrict}
        onChange={(value) =>
          updateParams(currentState, currentDistrict, value || undefined)
        }
      >
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {getLocalizedText(area.name, locale)}
          </option>
        ))}
      </FilterPill>
    </div>
  );
}

function FilterPill({
  label,
  value,
  placeholder,
  active,
  disabled,
  compact,
  onChange,
  children,
}: {
  label: string;
  value: string;
  placeholder: string;
  active?: boolean;
  disabled?: boolean;
  compact?: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 flex-1",
        compact ? "min-w-[5.5rem] max-w-[9rem]" : "min-w-[6.75rem] sm:min-w-0 sm:max-w-[11rem]",
      )}
    >
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={cn(
          "w-full cursor-pointer appearance-none truncate rounded-full pl-3.5 pr-8 font-medium outline-none transition",
          compact ? "h-8 text-[11px]" : "h-9 text-xs sm:text-sm",
          "ring-1 focus:ring-2 focus:ring-[var(--ocean)]/25",
          active
            ? "bg-[var(--ocean-light)] text-[var(--ocean-dark)] ring-[var(--ocean)]/30"
            : "bg-white text-[var(--ink-muted)] ring-[var(--sand-dark)]/60 hover:text-[var(--ink)]",
          disabled && "cursor-not-allowed opacity-45",
        )}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <ChevronDown
        className={cn(
          "pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2",
          active ? "text-[var(--ocean)]" : "text-[var(--ink-muted)]",
        )}
        aria-hidden
      />
    </div>
  );
}
