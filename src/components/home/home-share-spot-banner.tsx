"use client";

import { Camera, MapPin, PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface HomeShareSpotBannerProps {
  locale: Locale;
  locating?: boolean;
  stateId?: string;
  districtId?: string;
}

export function HomeShareSpotBanner({
  locale,
  locating = false,
  stateId,
  districtId,
}: HomeShareSpotBannerProps) {
  const t = useTranslations("home");

  const state = stateId ? getStateById(stateId) : undefined;
  const district =
    stateId && districtId ? getDistrictById(stateId, districtId) : undefined;
  const regionLabel = district
    ? getLocalizedText(district.name, locale)
    : state
      ? getLocalizedText(state.name, locale)
      : t("defaultLocation");

  return (
    <section className="animate-fade-up px-4 py-6 md:px-6 md:py-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--ocean)] via-[var(--ocean-dark)] to-[#0d3a40] p-5 shadow-[var(--shadow-travel)] ring-1 ring-[var(--ocean)]/25 md:flex md:items-center md:gap-8 md:p-8">
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/4 h-24 w-24 rounded-full bg-[var(--accent)]/25 blur-xl"
          aria-hidden
        />

        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm md:h-16 md:w-16">
          <MapPin className="h-7 w-7 text-white md:h-8 md:w-8" />
        </div>

        <div className="relative mt-4 min-w-0 flex-1 md:mt-0">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white/90">
            <Camera className="h-3 w-3" />
            {locating ? t("findingLocation") : regionLabel}
          </p>
          <h2 className="font-serif-display mt-2 text-xl font-bold leading-snug text-white md:mt-3 md:text-2xl">
            {t("shareSpotBannerTitle")}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
            {t("shareSpotBannerDesc")}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-white/75 md:text-xs">
            <li className="rounded-full bg-white/10 px-2.5 py-1">
              {t("shareSpotBannerStep1")}
            </li>
            <li className="rounded-full bg-white/10 px-2.5 py-1">
              {t("shareSpotBannerStep2")}
            </li>
            <li className="rounded-full bg-white/10 px-2.5 py-1">
              {t("shareSpotBannerStep3")}
            </li>
          </ul>
          <Link
            href="/post"
            className="tap-card mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[var(--ocean-dark)] shadow-lg transition hover:bg-[var(--ocean-light)]"
          >
            <PlusCircle className="h-4 w-4" />
            {t("shareSpotBannerCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
