"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CalendarDays, MapPin, X } from "lucide-react";
import { track } from "@vercel/analytics/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TrackedRegistrationLink } from "@/components/activities/tracked-registration-link";
import { formatDate } from "@/lib/utils";
import { getLocalizedText, type Activity } from "@/types";
import type { Locale } from "@/i18n/routing";

const DISMISS_KEY = "jompancing:joran-fest-dismissed-until";
const DISMISS_DAYS = 7;

interface HomeFeaturedEventProps {
  activity: Activity;
  locale: Locale;
}

export function HomeFeaturedEvent({ activity, locale }: HomeFeaturedEventProps) {
  const t = useTranslations("home");
  const tActivities = useTranslations("activities");
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const posterButtonRef = useRef<HTMLButtonElement>(null);
  const posterCloseButtonRef = useRef<HTMLButtonElement>(null);
  const wasPosterOpenRef = useRef(false);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const showDetails = useCallback(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    track("Activity promotion open", {
      event: activity.slug,
      placement: "home_banner",
    });
  }, [activity.slug]);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(
        DISMISS_KEY,
        String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000),
      );
    } catch {
      // The close action still works without browser storage.
    }
    window.setTimeout(() => {
      const previouslyFocused = previouslyFocusedRef.current;
      if (previouslyFocused?.isConnected && previouslyFocused !== document.body) {
        previouslyFocused.focus();
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (open) return;
    try {
      const dismissUntil = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
      if (dismissUntil > Date.now()) return;
    } catch {
      // Keep the campaign usable if browser storage is unavailable.
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
      track("Activity promotion impression", {
        event: activity.slug,
        placement: "home_popup",
      });
    }, 4500);
    return () => window.clearTimeout(timer);
  }, [activity.slug, open]);

  useEffect(() => {
    if (!open && !imageOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      if (imageOpen) posterCloseButtonRef.current?.focus();
      else if (wasPosterOpenRef.current) posterButtonRef.current?.focus();
      else closeButtonRef.current?.focus();
    }, 0);
    wasPosterOpenRef.current = imageOpen;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (imageOpen) setImageOpen(false);
        else dismiss();
        return;
      }
      if (event.key !== "Tab") return;
      if (imageOpen) {
        event.preventDefault();
        posterCloseButtonRef.current?.focus();
        return;
      }
      const dialog = document.querySelector<HTMLElement>("[data-featured-event-dialog]");
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, imageOpen, dismiss]);

  const posterUrl = activity.imageUrl;
  const title = getLocalizedText(activity.title, locale);
  const description = getLocalizedText(activity.description, locale);
  const prizes = activity.prizeDetails
    ? getLocalizedText(activity.prizeDetails, locale)
    : "";

  return (
    <>
      <section className="animate-fade-up border-b border-[var(--sand-dark)]/25 bg-white/75 py-5 md:py-7">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="font-serif-display text-lg font-bold text-[var(--ink)] md:text-xl">
              {t("nearbyActivities")}
            </h2>
            <Link
              href="/activities"
              className="shrink-0 text-sm font-semibold text-[var(--ocean)] hover:underline"
            >
              {t("activityBrowseCta")} →
            </Link>
          </div>
          <button
            type="button"
            onClick={() => {
              showDetails();
            }}
            className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#07548c] shadow-[var(--shadow-travel)] ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ocean)] md:aspect-[16/6]"
            aria-label={t("openFeaturedEvent", { title })}
          >
            <Image
              src={posterUrl}
              alt=""
              fill
              sizes="100vw"
              aria-hidden="true"
              className="scale-110 object-cover opacity-55 blur-sm"
            />
            <Image
              src={posterUrl}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </button>
        </div>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-6"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) dismiss();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="featured-event-title"
            data-featured-event-dialog
            className="relative grid max-h-[92dvh] w-full max-w-5xl grid-cols-1 overflow-y-auto rounded-3xl bg-white shadow-2xl md:grid-cols-[minmax(240px,0.78fr)_1fr] md:overflow-hidden"
          >
            <button
              type="button"
              ref={closeButtonRef}
              onClick={dismiss}
              aria-label={t("closeFeaturedEvent")}
              className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-[var(--ink)] shadow-md transition hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              ref={posterButtonRef}
              onClick={() => {
                setImageOpen(true);
                track("Activity poster enlarged", { event: activity.slug });
              }}
            className="relative flex min-h-[260px] items-center justify-center bg-[#07548c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white md:min-h-[75dvh]"
              aria-label={t("enlargeEventPoster")}
            >
              <Image
                src={posterUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 440px"
                className="object-contain"
              />
            </button>
            <div className="min-h-0 space-y-4 p-5 sm:p-7 md:max-h-[92dvh] md:self-start md:overflow-y-auto md:overscroll-contain md:p-8">
              <p className="inline-flex rounded-full bg-[var(--ocean-light)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--ocean-dark)]">
                {tActivities("contest")} · {t("featuredEvent")}
              </p>
              <h2
                id="featured-event-title"
                className="font-serif-display pr-10 text-2xl font-bold leading-tight text-[var(--ink)] sm:text-3xl"
              >
                {title}
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl bg-[var(--sand)] p-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                    <CalendarDays className="h-3.5 w-3.5" /> {tActivities("date")}
                  </span>
                  <p className="mt-1 text-sm font-bold text-[var(--ink)]">
                    {formatDate(activity.startDate, locale)} · {t("eventHours")}
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--sand)] p-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                    <MapPin className="h-3.5 w-3.5" /> {tActivities("venue")}
                  </span>
                  <p className="mt-1 text-sm font-bold text-[var(--ink)]">
                    {getLocalizedText(activity.venue, locale)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="font-bold text-[var(--ocean-dark)]">
                  {tActivities("fee")}: RM{activity.fee}
                </span>
                <span className="text-[var(--ink-muted)]">·</span>
                <span className="text-[var(--ink-muted)]">{t("first200Tees")}</span>
              </div>
              <div className="rounded-2xl bg-[#fff3d5] p-3 text-sm font-semibold text-[#70511a]">
                <p>{t("topPrizeCallout")}</p>
                <p className="mt-1 text-xs font-medium">{t("onlineRegistrationDeadline")}</p>
              </div>
              {activity.registrationUrl && (
                <TrackedRegistrationLink
                  href={activity.registrationUrl}
                  eventSlug={activity.slug}
                  placement="home_popup"
                  className="flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--ocean)] px-5 py-3 text-center text-sm font-bold text-white shadow-lg transition hover:bg-[var(--ocean-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ocean)] focus-visible:ring-offset-2"
                >
                  {activity.registrationLinkLabel
                    ? getLocalizedText(activity.registrationLinkLabel, locale)
                    : t("registerWithOrganizer")} →
                </TrackedRegistrationLink>
              )}
              {prizes && (
                <details className="rounded-2xl border border-[var(--sand-dark)]/40 px-4 py-3">
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--ink)]">
                    {tActivities("fullPrizeBreakdown")}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{prizes}</p>
                </details>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/activities/${activity.slug}`}
                  onClick={() => track("Activity details click", { event: activity.slug, placement: "home_popup" })}
                  className="text-sm font-semibold text-[var(--ocean-dark)] underline-offset-4 hover:underline"
                >
                  {t("fullEventDetails")}
                </Link>
                {activity.termsUrl && (
                  <a
                    href={activity.termsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[var(--ink-muted)] underline-offset-4 hover:underline"
                  >
                    {t("eventTerms")}
                  </a>
                )}
              </div>
              <p className="text-center text-xs leading-relaxed text-[var(--ink-muted)]">
                {description}
              </p>
            </div>
          </section>
        </div>
      )}

      {imageOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={t("enlargeEventPoster")}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setImageOpen(false);
          }}
        >
          <button
            type="button"
            ref={posterCloseButtonRef}
            onClick={() => setImageOpen(false)}
            aria-label={t("closeFeaturedEvent")}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-[var(--ink)]"
          >
            <X className="h-5 w-5" />
          </button>
          <Image
            src={posterUrl}
            alt={title}
            width={1125}
            height={2000}
            className="max-h-[92dvh] w-auto max-w-full object-contain"
          />
        </div>
      )}
    </>
  );
}
