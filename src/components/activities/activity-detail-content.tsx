import { Calendar, Flame, Mail, MapPin, MessageCircle, Phone, User } from "lucide-react";
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
  const registrationWhatsAppDigits = activity.contactWhatsApp?.replace(/\D/g, "");
  const registrationWhatsAppUrl = registrationWhatsAppDigits
    ? `https://wa.me/${registrationWhatsAppDigits}?text=${encodeURIComponent(
        activity.registrationWhatsAppMessage
          ? getLocalizedText(activity.registrationWhatsAppMessage, locale)
          : title,
      )}`
    : undefined;
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

        {activity.paymentDetails && activity.registrationUrl && (
          <section className="rounded-2xl bg-[var(--ocean-light)] p-4 ring-1 ring-[var(--ocean)]/15" aria-labelledby="online-registration-heading">
            <h2 id="online-registration-heading" className="font-semibold text-[var(--ocean-dark)]">
              {t("onlineRegistration")}
            </h2>
            <ol className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--ink)]">
              <li>{t("completePdfForm")}</li>
              <li>{t("transferRegistrationFee", { fee: formatPrice(activity.fee ?? 0) })}</li>
              <li>{t("sendRegistrationDocuments")}</li>
            </ol>
            <dl className="mt-3 grid gap-2 rounded-xl bg-white/80 p-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-[var(--ink-muted)]">{t("bank")}</dt>
                <dd className="font-semibold text-[var(--ink)]">{activity.paymentDetails.bankName}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--ink-muted)]">{t("accountNumber")}</dt>
                <dd className="font-semibold text-[var(--ink)]">{activity.paymentDetails.accountNumber}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-xs text-[var(--ink-muted)]">{t("accountName")}</dt>
                <dd className="font-semibold text-[var(--ink)]">{activity.paymentDetails.accountName}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <TrackedRegistrationLink
                href={activity.registrationUrl}
                eventSlug={activity.slug}
                placement="activity_detail"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-[var(--ocean-dark)] ring-1 ring-[var(--ocean)]/20 transition hover:bg-[var(--sand)]"
              >
                {activity.registrationLinkLabel
                  ? getLocalizedText(activity.registrationLinkLabel, locale)
                  : t("registerWithOrganizer")} ↗
              </TrackedRegistrationLink>
              {registrationWhatsAppUrl && (
                <TrackedRegistrationLink
                  href={registrationWhatsAppUrl}
                  eventSlug={activity.slug}
                  placement="activity_detail"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--ocean)] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[var(--ocean-dark)]"
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> {t("sendFormAndReceipt")}
                </TrackedRegistrationLink>
              )}
            </div>
          </section>
        )}

        {activity.registrationNote && (
          <aside className="rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
            <p className="mb-1 font-semibold">{t("registrationCheckNote")}</p>
            <p>{getLocalizedText(activity.registrationNote, locale)}</p>
          </aside>
        )}

        {activity.organizerContacts?.length ? (
          <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--sand-dark)]/40" aria-labelledby="organizer-contacts-heading">
            <h2 id="organizer-contacts-heading" className="font-semibold text-[var(--ink)]">
              {t("organizerContacts")}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {activity.organizerContacts.map((contact) => {
                const digits = contact.phone.replace(/\D/g, "");
                return (
                  <div key={contact.phone} className="rounded-xl bg-[var(--sand)]/60 p-3">
                    <p className="font-semibold text-[var(--ink)]">{contact.name}</p>
                    {contact.role && (
                      <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                        {getLocalizedText(contact.role, locale)}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-[var(--ink-muted)]">{contact.phone}</p>
                    <div className="mt-2 flex gap-3 text-sm font-semibold text-[var(--ocean-dark)]">
                      <a className="inline-flex items-center gap-1 underline-offset-4 hover:underline" href={`tel:${contact.phone}`}>
                        <Phone className="h-3.5 w-3.5" /> {t("callOrganizer")}
                      </a>
                      <a className="inline-flex items-center gap-1 underline-offset-4 hover:underline" href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            {activity.contactEmail && (
              <a className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ocean-dark)] underline-offset-4 hover:underline" href={`mailto:${activity.contactEmail}`}>
                <Mail className="h-4 w-4" /> {activity.contactEmail}
              </a>
            )}
          </section>
        ) : null}

        {activity.prizeDetails && (
          <details className="rounded-2xl bg-[var(--sand)] p-4">
            <summary className="cursor-pointer font-semibold text-[var(--ink)]">
              {t("fullPrizeBreakdown")}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
              {getLocalizedText(activity.prizeDetails, locale)}
            </p>
            {activity.prizeDetailsNote && (
              <p className="mt-3 border-t border-[var(--sand-dark)]/50 pt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                {getLocalizedText(activity.prizeDetailsNote, locale)}
              </p>
            )}
          </details>
        )}

        {activity.registrationUrl && !activity.paymentDetails && (
          <TrackedRegistrationLink
            href={activity.registrationUrl}
            eventSlug={activity.slug}
            placement="activity_detail"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--ocean)] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[var(--ocean-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ocean)] focus-visible:ring-offset-2"
          >
            {activity.registrationLinkLabel
              ? getLocalizedText(activity.registrationLinkLabel, locale)
              : t("registerWithOrganizer")} →
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

        {activity.sourceUrl && activity.sourceUrl !== activity.registrationUrl && (
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
