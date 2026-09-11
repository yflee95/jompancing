"use client";

import { memo } from "react";
import { Flame, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppImage } from "@/components/ui/app-image";
import { formatDistance } from "@/lib/geo";
import { getSpotLocationLine } from "@/lib/spot-location";
import { cn } from "@/lib/utils";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

type SpotWithDistance = FishingSpot & { distanceKm: number };

interface HomeSpotDeckCardProps {
  spot: SpotWithDistance;
  locale: Locale;
  offset: number;
  dragPx: number;
  isDragging: boolean;
  eagerImage?: boolean;
}

function getCardStyle(offset: number, dragPx: number) {
  const base = offset * 100 + dragPx * 0.35;
  const abs = Math.abs(offset);

  if (abs > 2) {
    return {
      opacity: 0,
      transform: `translateX(${base}px) scale(0.7) rotateY(0deg)`,
      zIndex: 0,
    };
  }

  const scale = offset === 0 ? 1 : abs === 1 ? 0.88 : 0.76;
  const rotateY = offset === 0 ? 0 : offset > 0 ? -14 : 14;
  const opacity = abs === 2 ? 0.35 : abs === 1 ? 0.72 : 1;
  const zIndex = 30 - abs * 10;

  return {
    opacity,
    transform: `translateX(calc(${base}px + ${offset * 18}%)) scale(${scale}) rotateY(${rotateY}deg)`,
    zIndex,
  };
}

export const HomeSpotDeckCard = memo(function HomeSpotDeckCard({
  spot,
  locale,
  offset,
  dragPx,
  isDragging,
  eagerImage = false,
}: HomeSpotDeckCardProps) {
  const t = useTranslations("home");
  const tSpots = useTranslations("spots");
  const isActive = offset === 0;
  const style = getCardStyle(offset, dragPx);

  return (
    <article
      className={cn(
        "deck-card-layer absolute inset-0 origin-center",
        isActive && "cursor-grab active:cursor-grabbing",
        !isActive && "pointer-events-none",
        isDragging && "will-change-[transform,opacity]",
        !isDragging && "transition-[transform,opacity] duration-300 ease-out",
      )}
      style={{
        transform: style.transform,
        opacity: style.opacity,
        zIndex: style.zIndex,
        pointerEvents: isActive ? "auto" : "none",
      }}
      aria-hidden={!isActive}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white/90 shadow-[0_24px_64px_rgba(26,101,112,0.18)] ring-1 ring-white/90 backdrop-blur-xl">
        <div className="relative block flex-1 overflow-hidden">
          <div className="relative aspect-[4/5] h-full min-h-[280px] w-full touch-pan-y">
            <AppImage
              src={spot.imageUrl}
              alt={getLocalizedText(spot.title, locale)}
              priority={eagerImage}
              sizes="360px"
              placeholderVariant="spot"
              className="absolute inset-0"
              imageClassName="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            {spot.waterType === "pond" ? (
              <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[var(--ocean)] px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                {t("paidPond")}
              </span>
            ) : spot.featured ? (
              <span className="badge-accent absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase">
                <Flame className="h-3 w-3" />
                {t("hotSpot")}
              </span>
            ) : null}
            <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[var(--ink)] shadow-sm">
              {formatDistance(spot.distanceKm)}
            </span>
            <div className="absolute inset-x-0 bottom-0 p-4 pb-[4.25rem]">
              <h2 className="font-serif-display text-xl font-bold leading-snug text-white">
                {getLocalizedText(spot.title, locale)}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
                <MapPin className="h-3 w-3 shrink-0" />
                {getSpotLocationLine(spot, locale)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  {tSpots(spot.waterType)}
                </span>
                {spot.species[0] && (
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] text-white/90">
                    {spot.species[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});
