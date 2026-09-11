"use client";

import { CalendarDays, Megaphone, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface HomeActivityEmptyCardProps {
  locale: Locale;
  hasGps?: boolean;
  stateId?: string;
  districtId?: string;
}

export function HomeActivityEmptyCard({
  locale,
  hasGps = false,
  stateId,
  districtId,
}: HomeActivityEmptyCardProps) {
  const t = useTranslations("home");

  const state = stateId ? getStateById(stateId) : undefined;
  const district =
    stateId && districtId ? getDistrictById(stateId, districtId) : undefined;
  const regionLabel =
    hasGps && district
      ? getLocalizedText(district.name, locale)
      : hasGps && state
        ? getLocalizedText(state.name, locale)
        : hasGps
          ? t("yourLocation")
          : t("locationUnavailable");

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--ocean)] via-[var(--ocean-dark)] to-[#0d3a40] p-6 shadow-[var(--shadow-travel)] ring-1 ring-[var(--ocean)]/20 md:flex md:items-center md:gap-8 md:p-8">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 left-1/3 h-28 w-28 rounded-full bg-[var(--accent)]/20 blur-xl"
        aria-hidden
      />

      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm md:h-20 md:w-20">
        <CalendarDays className="h-8 w-8 text-white md:h-9 md:w-9" />
      </div>

      <div className="relative mt-5 min-w-0 flex-1 md:mt-0">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/90">
          <Sparkles className="h-3 w-3" />
          {regionLabel}
        </p>
        <h3 className="font-serif-display mt-3 text-xl font-bold leading-snug text-white md:text-2xl">
          {t("activityEmptyTitle")}
        </h3>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80 md:text-base">
          {t("activityEmptyDesc")}
        </p>
        <Link
          href="/activities/promote"
          className="tap-card mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[var(--ocean-dark)] shadow-lg transition hover:bg-[var(--ocean-light)]"
        >
          <Megaphone className="h-4 w-4" />
          {t("activityApplyCta")}
        </Link>
      </div>
    </div>
  );
}
