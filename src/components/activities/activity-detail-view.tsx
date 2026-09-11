"use client";

import { Calendar, Flame, MapPin, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { ActivityDetailActions } from "@/components/activities/activity-detail-actions";
import { PromotionStatusBanner } from "@/components/activities/promotion-status-banner";
import { useActivities } from "@/components/providers/activities-provider";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { isPromotionActive } from "@/lib/promotion";
import { formatDate, formatPrice } from "@/lib/utils";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ActivityDetailViewProps {
  locale: Locale;
  slug: string;
}

export function ActivityDetailView({ locale, slug }: ActivityDetailViewProps) {
  const t = useTranslations("activities");
  const tCommon = useTranslations("common");
  const { getActivityBySlug, isLoaded } = useActivities();
  const activity = getActivityBySlug(slug);

  if (isLoaded && !activity) notFound();
  if (!activity) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse px-4 py-12">
        <div className="aspect-[16/10] rounded-3xl bg-[var(--sand-dark)]/40" />
      </div>
    );
  }

  const state = getStateById(activity.stateId);
  const district = getDistrictById(activity.stateId, activity.districtId);
  const promoted = isPromotionActive(activity);

  return (
    <article className="mx-auto max-w-4xl px-4 pb-32 sm:pb-8">
      <div className="relative -mx-4 aspect-[16/10] overflow-hidden sm:mx-0 sm:rounded-3xl">
        <AppImage
          src={activity.imageUrl}
          alt={getLocalizedText(activity.title, locale)}
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          placeholderVariant="wide"
          placeholderLabel={tCommon("photoUnavailable")}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-white/90 text-[var(--ink)] backdrop-blur-sm">
              {t(activity.type)}
            </Badge>
            {promoted && (
              <span className="badge-accent inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold">
                <Flame className="h-3 w-3" />
                {t("hot")}
              </span>
            )}
            {activity.verified && (
              <Badge className="bg-[var(--ocean)]/90 text-white backdrop-blur-sm">
                {tCommon("verified")}
              </Badge>
            )}
          </div>
          <h1 className="font-serif-display mt-3 text-3xl font-bold text-white sm:text-4xl">
            {getLocalizedText(activity.title, locale)}
          </h1>
        </div>
      </div>

      <PromotionStatusBanner activity={activity} />

      <div className="mt-6 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--sand-dark)]/40">
            <Calendar className="h-5 w-5 text-[var(--ocean)]" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--ink-muted)]">
                {t("date")}
              </p>
              <p className="text-sm font-semibold text-[var(--ink)]">
                {formatDate(activity.startDate, locale)}
                {activity.endDate !== activity.startDate &&
                  ` – ${formatDate(activity.endDate, locale)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--sand-dark)]/40">
            <MapPin className="h-5 w-5 text-[var(--ocean)]" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--ink-muted)]">
                {t("venue")}
              </p>
              <p className="text-sm font-semibold text-[var(--ink)]">
                {getLocalizedText(activity.venue, locale)}
                {state && ` · ${getLocalizedText(state.name, locale)}`}
                {district && ` · ${getLocalizedText(district.name, locale)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--sand-dark)]/40">
            <User className="h-5 w-5 text-[var(--ocean)]" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--ink-muted)]">
                {t("organizer")}
              </p>
              <p className="text-sm font-semibold text-[var(--ink)]">
                {activity.organizer}
              </p>
            </div>
          </div>
          {activity.fee !== undefined && (
            <div className="rounded-2xl bg-[var(--ocean-light)] p-4 ring-1 ring-[var(--ocean)]/15">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--ocean-dark)]">
                {t("fee")}
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--ocean-dark)]">
                {formatPrice(activity.fee)}
              </p>
              <p className="mt-1 text-xs text-[var(--ocean)]">{t("feeNote")}</p>
            </div>
          )}
        </div>

        <p className="text-base leading-relaxed text-[var(--ink-muted)]">
          {getLocalizedText(activity.description, locale)}
        </p>

        <ActivityDetailActions
          activityTitle={getLocalizedText(activity.title, locale)}
          organizer={activity.organizer}
          contactWhatsApp={activity.contactWhatsApp}
        />
      </div>
    </article>
  );
}
