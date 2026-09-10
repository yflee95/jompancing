"use client";

import { MapPin, MessageCircle, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AppImage } from "@/components/ui/app-image";
import { getSpotLocationLine } from "@/lib/spot-location";
import { formatDistance } from "@/lib/geo";
import { cn } from "@/lib/utils";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

interface HomeSpotRailCardProps {
  spot: FishingSpot;
  locale: Locale;
  distanceKm?: number;
  showNew?: boolean;
  showAuthor?: boolean;
}

/** Mobile: 2.5 cards peek · Desktop: 3.5 cards peek */
const PEEK_WIDTH_CLASS =
  "w-[calc((100vw-2rem-1.5rem)/2.5)] sm:w-[calc((100vw-2rem-2.25rem)/3.5)] md:max-w-[calc((min(100vw,72rem)-2rem-2.25rem)/3.5)]";

export function HomeSpotRailCard({
  spot,
  locale,
  distanceKm,
  showNew,
  showAuthor,
}: HomeSpotRailCardProps) {
  const tCommon = useTranslations("common");
  const tSpots = useTranslations("spots");

  return (
    <Link
      href={`/spots/${spot.slug}`}
      className={cn(
        "tap-card group relative shrink-0 snap-start overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-travel)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-travel-hover)]",
        PEEK_WIDTH_CLASS,
      )}
    >
      <div className="relative aspect-[4/5]">
        <AppImage
          src={spot.imageUrl}
          alt={getLocalizedText(spot.title, locale)}
          sizes="(max-width: 640px) 40vw, 28vw"
          placeholderVariant="spot"
          placeholderLabel={tCommon("photoUnavailable")}
          className="absolute inset-0"
          imageClassName="transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {showNew && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--ocean-dark)] backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            {tCommon("new")}
          </span>
        )}
        {distanceKm != null && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[var(--ink)] backdrop-blur-sm">
            {formatDistance(distanceKm)}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-serif-display line-clamp-1 text-base font-semibold text-white">
            {getLocalizedText(spot.title, locale)}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-white/75">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">
              {getSpotLocationLine(spot, locale)}
            </span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {spot.species[0] && (
              <span className="inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                {spot.species[0]}
              </span>
            )}
            {showAuthor && spot.authorName && (
              <span className="text-[10px] text-white/70">
                {tSpots("postedBy")} {spot.authorName}
              </span>
            )}
            <span className="ml-auto flex items-center gap-0.5 text-[10px] text-white/70">
              <MessageCircle className="h-3 w-3" />
              {spot.commentCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
