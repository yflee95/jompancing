"use client";

import { Calendar, Flame, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AppImage } from "@/components/ui/app-image";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { formatDate } from "@/lib/utils";
import { getLocalizedText, type Activity } from "@/types";
import type { Locale } from "@/i18n/routing";

interface HomeActivityRailCardProps {
  activity: Activity;
  locale: Locale;
  featured?: boolean;
}

export function HomeActivityRailCard({
  activity,
  locale,
  featured = false,
}: HomeActivityRailCardProps) {
  const t = useTranslations("activities");
  const tCommon = useTranslations("common");

  const state = getStateById(activity.stateId);
  const district = getDistrictById(activity.stateId, activity.districtId);
  const locationLabel = district
    ? getLocalizedText(district.name, locale)
    : state
      ? getLocalizedText(state.name, locale)
      : getLocalizedText(activity.venue, locale);

  return (
    <Link
      href={`/activities/${activity.slug}`}
      className="tap-card group relative w-[85vw] max-w-[320px] min-w-[260px] shrink-0 snap-start overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-travel)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-travel-hover)] md:w-full md:max-w-none md:min-w-0"
    >
      <div className="relative aspect-[16/10]">
        <AppImage
          src={activity.imageUrl}
          alt={getLocalizedText(activity.title, locale)}
          sizes="300px"
          placeholderVariant="wide"
          placeholderLabel={tCommon("photoUnavailable")}
          className="absolute inset-0"
          imageClassName="transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[var(--ink)] backdrop-blur-sm">
            {t(activity.type)}
          </span>
          {(featured || activity.promoted) && (
            <span className="badge-accent inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold">
              <Flame className="h-3 w-3" />
              {t("hot")}
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-serif-display line-clamp-2 text-base font-semibold leading-snug text-white">
            {getLocalizedText(activity.title, locale)}
          </h3>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/80">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 shrink-0" />
              {formatDate(activity.startDate, locale)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              {locationLabel}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
