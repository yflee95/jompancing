import { ExternalLink, Lock, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CommentsSection } from "@/components/shared/comments-section";
import type { CommentItem } from "@/components/shared/comments-section";
import { PhotoAttribution } from "@/components/spots/photo-attribution";
import { SpotDetailActions } from "@/components/spots/spot-detail-actions";
import { AdminSpotDelete } from "@/components/spots/admin-spot-delete";
import { SpotOwnerActions } from "@/components/spots/spot-owner-actions";
import { SpotJsonLd } from "@/components/seo/spot-json-ld";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import {
  getSpotBestTimeLine,
  getSpotFacilitiesLine,
  getSpotSpeciesLine,
} from "@/lib/spot-angler-info";
import { getSpotLocationLine } from "@/lib/spot-location";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotDetailViewProps {
  spot: FishingSpot;
  comments: CommentItem[];
  locale: Locale;
  /** Dev cleanup — visible only when logged-in admin. */
  showAdminDelete?: boolean;
}

export async function SpotDetailView({
  spot,
  comments,
  locale,
  showAdminDelete = false,
}: SpotDetailViewProps) {
  const t = await getTranslations("spots");
  const tCommon = await getTranslations("common");
  const isUserGenerated = spot.isUserGenerated;
  const hasMockHero = !isUserGenerated || !spot.photos.length;

  return (
    <article className="mx-auto max-w-4xl px-4 pb-28 sm:pb-8">
      <SpotJsonLd spot={spot} locale={locale} />

      {hasMockHero ? (
        <div className="relative -mx-4 aspect-[4/5] overflow-hidden sm:mx-0 sm:aspect-[16/10] sm:rounded-3xl">
          <AppImage
            src={spot.imageUrl}
            alt={getLocalizedText(spot.title, locale)}
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            placeholderVariant="hero"
            placeholderLabel={tCommon("photoUnavailable")}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8">
            <div className="flex flex-wrap gap-2">
              {spot.featured && (
                <span className="badge-accent rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
                  ★ {tCommon("featured")}
                </span>
              )}
              {spot.visibility === "private" && (
                <Badge className="bg-[var(--ink)]/90 text-white">
                  <Lock className="mr-1 h-3 w-3" />
                  {t("private")}
                </Badge>
              )}
              <Badge className="bg-white/90 text-[var(--ink)] backdrop-blur-sm">
                {t(spot.waterType as "saltwater" | "freshwater" | "pond" | "river")}
              </Badge>
            </div>
            <h1 className="font-serif-display mt-3 text-3xl font-bold text-white sm:text-4xl">
              {getLocalizedText(spot.title, locale)}
            </h1>
            <p className="mt-1 text-sm text-white/80">
              {getSpotLocationLine(spot, locale)}
            </p>
          </div>
        </div>
      ) : (
        <>
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
          </div>
        </>
      )}

      {!isUserGenerated && <PhotoAttribution spot={spot} label={t("photoCredit")} />}

      <div className={hasMockHero ? "mt-6" : ""}>
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

        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          {t("postedBy")} {spot.authorName}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            {
              label: t("species"),
              value: getSpotSpeciesLine(spot),
            },
            {
              label: t("bestTime"),
              value: getSpotBestTimeLine(spot, locale),
            },
            {
              label: t("facilities"),
              value: getSpotFacilitiesLine(spot),
            },
            {
              label: t("comments"),
              value: String(spot.commentCount),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl bg-white p-3 text-center ring-1 ring-[var(--sand-dark)]/40"
            >
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--ink-muted)]">
                {label}
              </p>
              <p className="mt-1 line-clamp-3 text-xs font-semibold text-[var(--ink)]">
                {value}
              </p>
            </div>
          ))}
        </div>

        <CommentsSection
          threadId={spot.id}
          threadType="spot"
          className="mt-8"
          comments={comments}
          locale={locale}
          title={t("comments")}
        />

        {isUserGenerated && <SpotOwnerActions spot={spot} />}

        {showAdminDelete && !isUserGenerated && (
          <AdminSpotDelete spotId={spot.id} />
        )}

        <div className="mt-8">
          <SpotDetailActions
            lat={spot.coordinates.lat}
            lng={spot.coordinates.lng}
          />
        </div>
      </div>
    </article>
  );
}
