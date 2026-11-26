import { Calendar, Flame, MapPin, User } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ActivityDetailActions } from "@/components/activities/activity-detail-actions";
import { CampaignFlyer } from "@/components/activities/campaign-flyer";
import { TrackedRegistrationLink } from "@/components/activities/tracked-registration-link";
import { PromotionStatusBanner } from "@/components/activities/promotion-status-banner";
import { ActivityJsonLd } from "@/components/seo/activity-json-ld";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { isPromotionActive } from "@/lib/promotion";
import { formatDate, formatPrice } from "@/lib/utils";
import { getLocalizedText, type Activity } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ActivityDetailContentProps {
  activity: Activity;
  locale: Locale;
}

export async function ActivityDetailContent({
  activity,
  locale,
}: ActivityDetailContentProps) {
  const t = await getTranslations("activities");
  const tHome = await getTranslations("home");
  const tCommon = await getTranslations("common");

  const state = getStateById(activity.stateId);
  const district = getDistrictById(activity.stateId, activity.districtId);
  const promoted = isPromotionActive(activity);
  const title = getLocalizedText(activity.title, locale);
  const flyerAlt = activity.imageAlt
    ? getLocalizedText(activity.imageAlt, locale)
    : title;
  const hasFlyer = Boolean(activity.registrationUrl);
  const sameCalendarDay =
    activity.startDate.slice(0, 10) === activity.endDate.slice(0, 10);
  const venueSearch = [
    getLocalizedText(activity.venue, locale),
    district ? getLocalizedText(district.name, locale) : "",
    state ? getLocalizedText(state.name, locale) : "",
  ]
    .filter(Boolean)
    .join(", ");
  const directionsUrl = new URL("https://www.google.com/maps/dir/");
  directionsUrl.searchParams.set("api", "1");
  directionsUrl.searchParams.set("destination", venueSearch);

  return (
    <article className="mx-auto max-w-4xl px-4 pb-32 sm:pb-8">
      <ActivityJsonLd activity={activity} locale={locale} />

      <div
        className={`relative overflow-hidden ${
          hasFlyer
            ? "mx-auto aspect-[4/5] max-h-[760px] max-w-[430px] bg-[#07548c] sm:aspect-[9/16] sm:rounded-3xl"
            : "-mx-4 aspect-[16/10] sm:mx-0 sm:rounded-3xl"
        }`}
      >
        {hasFlyer ? (
          <CampaignFlyer
            src={activity.imageUrl}
            alt={flyerAlt}
            eventSlug={activity.slug}
          />
        ) : (
          <>
            <AppImage
              src={activity.imageUrl}
              alt={title}
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
                {title}
              </h1>
            </div>
          </>
        )}
      </div>

      {hasFlyer && (
        <h1 className="font-serif-display mt-5 text-3xl font-bold text-[var(--ink)] sm:text-4xl">
          {title}
        </h1>
      )}

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
                {!sameCalendarDay &&
                  ` – ${formatDate(activity.endDate, locale)}`}
                {hasFlyer && ` · ${tHome("eventHours")}`}
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
              <a
                href={directionsUrl.toString()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex text-xs font-semibold text-[var(--ocean)] underline-offset-4 hover:underline"
              >
                {t("openInMaps")} ↗
              </a>
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

        {activity.prizeDetails && (
          <details className="rounded-2xl bg-[var(--sand)] p-4">
            <summary className="cursor-pointer font-semibold text-[var(--ink)]">
              {t("fullPrizeBreakdown")}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
              {getLocalizedText(activity.prizeDetails, locale)}
            </p>
          </details>
        )}

        {activity.registrationUrl && (
          <TrackedRegistrationLink
            href={activity.registrationUrl}
            eventSlug={activity.slug}
            placement="activity_detail"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--ocean)] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[var(--ocean-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ocean)] focus-visible:ring-offset-2"
          >
            {t("registerWithOrganizer")} →
          </TrackedRegistrationLink>
        )}

        {activity.termsUrl && (
          <a
            href={activity.termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex text-sm font-semibold text-[var(--ocean-dark)] underline-offset-4 hover:underline"
          >
            {t("eventTerms")}
          </a>
        )}

        {activity.sourceUrl && (
          <a
            href={activity.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-[var(--ocean-light)] px-4 py-2 text-sm font-semibold text-[var(--ocean-dark)] underline-offset-4 hover:underline"
          >
            {t("officialSource")}
          </a>
        )}

        <ActivityDetailActions
          activityTitle={getLocalizedText(activity.title, locale)}
          organizer={activity.organizer}
          contactWhatsApp={activity.contactWhatsApp}
        />
      </div>
    </article>
  );
}
