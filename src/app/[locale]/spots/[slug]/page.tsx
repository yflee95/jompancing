import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExternalLink, MapPin } from "lucide-react";
import { CommentsSection } from "@/components/shared/comments-section";
import { PhotoAttribution } from "@/components/spots/photo-attribution";
import { SpotDetailActions } from "@/components/spots/spot-detail-actions";
import { UserSpotDetail } from "@/components/spots/user-spot-detail";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { getSpotLocationLine } from "@/lib/spot-location";
import { getCommentsForSpot, getSpotBySlug } from "@/data/mock-data";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotDetailPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateMetadata({ params }: SpotDetailPageProps) {
  const { locale, slug } = await params;
  const spot = getSpotBySlug(slug);
  const t = await getTranslations({ locale, namespace: "spots" });
  if (!spot) {
    return { title: t("title"), description: t("subtitle") };
  }
  return {
    title: getLocalizedText(spot.title, locale),
    description: getLocalizedText(spot.description, locale),
  };
}

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("spots");
  const tCommon = await getTranslations("common");

  const spot = getSpotBySlug(slug);
  if (!spot) {
    return <UserSpotDetail slug={slug} locale={locale} />;
  }

  const comments = getCommentsForSpot(spot.id);

  return (
    <article className="mx-auto max-w-4xl px-4 pb-28 sm:pb-8">
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

      <PhotoAttribution spot={spot} label={t("photoCredit")} />

      <div className="mt-6">
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

        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            { label: t("species"), value: spot.species.slice(0, 2).join(", ") },
            {
              label: t("bestTime"),
              value: getLocalizedText(spot.bestTime, locale),
            },
            { label: t("facilities"), value: spot.facilities[0] ?? "—" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl bg-white p-3 text-center ring-1 ring-[var(--sand-dark)]/40"
            >
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--ink-muted)]">
                {label}
              </p>
              <p className="mt-1 line-clamp-2 text-xs font-semibold text-[var(--ink)]">
                {value}
              </p>
            </div>
          ))}
        </div>

        <CommentsSection
          threadId={spot.id}
          className="mt-8"
          comments={comments}
          locale={locale}
          title={t("comments")}
        />

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
