"use client";

import { useEffect } from "react";
import { ExternalLink, Lock, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/auth-provider";
import { useUserSpots } from "@/components/providers/spots-provider";
import { CommentsSection } from "@/components/shared/comments-section";
import { SpotDetailActions } from "@/components/spots/spot-detail-actions";
import { SpotOwnerActions } from "@/components/spots/spot-owner-actions";
import { Badge } from "@/components/ui/badge";
import { getSpotLocationLine } from "@/lib/spot-location";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface UserSpotDetailProps {
  slug: string;
  locale: Locale;
}

export function UserSpotDetail({ slug, locale }: UserSpotDetailProps) {
  const t = useTranslations("spots");
  const { user } = useAuth();
  const { getUserSpotBySlug, isLoaded } = useUserSpots();
  const spot = getUserSpotBySlug(slug);

  useEffect(() => {
    if (spot) {
      document.title = `${getLocalizedText(spot.title, locale)} | Jompancing`;
    }
  }, [spot, locale]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--ocean)] border-t-transparent" />
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[var(--ink-muted)]">{t("notFound")}</p>
      </div>
    );
  }

  const isOwner = user?.id === spot.authorId;
  if (spot.visibility === "private" && !isOwner) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Lock className="mx-auto h-10 w-10 text-[var(--ink-muted)]" />
        <p className="mt-4 font-semibold text-[var(--ink)]">{t("privateSpot")}</p>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">{t("privateSpotDesc")}</p>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 pb-28 sm:pb-8">
      <div className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-2 sm:overflow-visible sm:pb-0">
        {spot.photos.map((photo, i) => (
          <div
            key={i}
            className="relative aspect-[4/5] w-[75vw] shrink-0 overflow-hidden rounded-3xl sm:w-auto sm:aspect-[4/5]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={getLocalizedText(spot.title, locale)}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap gap-2">
          {spot.visibility === "private" && (
            <Badge className="bg-[var(--ink)]/90 text-white">
              <Lock className="mr-1 h-3 w-3" />
              {t("private")}
            </Badge>
          )}
          <Badge className="bg-[var(--ocean-light)] text-[var(--ocean)]">
            {t(spot.waterType as "saltwater" | "freshwater" | "pond" | "river")}
          </Badge>
        </div>

        <h1 className="font-serif-display mt-3 text-3xl font-bold text-[var(--ink)]">
          {getLocalizedText(spot.title, locale)}
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          {getSpotLocationLine(spot, locale)}
        </p>
        <p className="mt-0.5 text-sm text-[var(--ink-muted)]">
          {t("postedBy")} {spot.authorName}
        </p>

        <a
          href={spot.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-start gap-2 rounded-2xl bg-white p-4 ring-1 ring-[var(--sand-dark)]/40 transition hover:ring-[var(--ocean)]/30"
        >
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ocean)]" />
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--ink-muted)]">
              {t("googleAddress")}
            </p>
            <p className="text-sm font-semibold text-[var(--ink)]">
              {spot.googleAddress}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--ocean)]">
              Google Maps
              <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        </a>

        {spot.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {spot.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--ocean-light)] px-3 py-1 text-xs font-medium text-[var(--ocean)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <p className="mt-4 text-base leading-relaxed text-[var(--ink-muted)]">
          {getLocalizedText(spot.description, locale)}
        </p>

        <CommentsSection
          threadId={spot.id}
          threadType="spot"
          className="mt-8"
          comments={[]}
          locale={locale}
          title={t("comments")}
        />

        {isOwner && <SpotOwnerActions spot={spot} />}

        <div className="mt-8">
          <SpotDetailActions lat={spot.coordinates.lat} lng={spot.coordinates.lng} />
        </div>
      </div>
    </article>
  );
}
