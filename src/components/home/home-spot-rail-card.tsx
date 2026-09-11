"use client";

import { Flame, MapPin, MessageCircle, Sparkles } from "lucide-react";
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
  showHot?: boolean;
  showPaid?: boolean;
  showAuthor?: boolean;
  priority?: boolean;
  /** Horizontal rail — ~2.1 cards on phone, ~3.5 on tablet+ */
  layout?: "default" | "peek";
}

export function HomeSpotRailCard({
  spot,
  locale,
  distanceKm,
  showNew,
  showHot,
  showPaid,
  showAuthor,
  priority = false,
  layout = "default",
}: HomeSpotRailCardProps) {
  const tCommon = useTranslations("common");
  const tSpots = useTranslations("spots");
  const tHome = useTranslations("home");

  return (
    <Link
      href={`/spots/${spot.slug}`}
      className={cn(
        "tap-card group relative shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-travel)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-travel-hover)]",
        layout === "peek"
          ? "w-[calc((100vw-2rem-0.625rem)/2.15)] min-w-[152px] max-w-[260px] md:w-[calc((100vw-3rem-0.625rem*2.5)/3.5)] md:max-w-[220px] md:min-w-[120px] lg:w-full lg:max-w-none lg:min-w-0"
          : "w-[72vw] max-w-[280px] min-w-[148px] sm:w-[44vw] sm:max-w-[300px] md:w-full md:max-w-none md:min-w-0",
        "md:shrink lg:shrink",
      )}
    >
      <div
        className={cn(
          "relative",
          layout === "peek"
            ? "aspect-[4/5] lg:aspect-[3/4]"
            : "aspect-[4/5] md:aspect-[3/4]",
        )}
      >
        <AppImage
          src={spot.imageUrl}
          alt={getLocalizedText(spot.title, locale)}
          sizes={
            layout === "peek"
              ? "(max-width: 768px) 46vw, (max-width: 1024px) 28vw, 20vw"
              : "(max-width: 768px) 72vw, (max-width: 1280px) 25vw, 20vw"
          }
          priority={priority}
          placeholderVariant="spot"
          placeholderLabel={tCommon("photoUnavailable")}
          className="absolute inset-0"
          imageClassName="transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        {(showHot && spot.featured) || showPaid ? (
          <span
            className={cn(
              "absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide md:left-3 md:top-3 md:px-2.5 md:py-1 md:text-[10px]",
              showPaid
                ? "bg-[var(--ocean)] text-white shadow-sm"
                : "badge-accent",
            )}
          >
            {showPaid ? (
              tHome("paidPond")
            ) : (
              <>
                <Flame className="h-3 w-3" />
                {tHome("hotSpot")}
              </>
            )}
          </span>
        ) : null}
        {showNew && !showHot && !showPaid && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--ocean-dark)] backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            {tCommon("new")}
          </span>
        )}
        {distanceKm != null && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[var(--ink)] shadow-sm">
            {formatDistance(distanceKm)}
          </span>
        )}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0",
            layout === "peek" ? "p-3 md:p-3.5 lg:p-4" : "p-3.5 md:p-4",
          )}
        >
          <p
            className={cn(
              "font-serif-display line-clamp-2 font-semibold leading-snug text-white",
              layout === "peek"
                ? "text-sm md:text-[15px] lg:text-base"
                : "text-[15px] md:text-base",
            )}
          >
            {getLocalizedText(spot.title, locale)}
          </p>
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-white/75",
              layout === "peek" ? "text-xs md:text-[11px]" : "text-[11px]",
            )}
          >
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">
              {getSpotLocationLine(spot, locale)}
            </span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
              {tSpots(spot.waterType as "saltwater" | "freshwater" | "pond" | "river")}
            </span>
            {spot.species[0] && (
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                {spot.species[0]}
              </span>
            )}
            {showAuthor && spot.authorName && (
              <span className="hidden text-[10px] text-white/65 sm:inline">
                {spot.authorName}
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
