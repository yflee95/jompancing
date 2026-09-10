"use client";

import { Lock, MapPin, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AppImage } from "@/components/ui/app-image";
import { getSpotLocationLine } from "@/lib/spot-location";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotCardProps {
  spot: FishingSpot;
  locale: Locale;
  showPrivateBadge?: boolean;
}

export function SpotCard({ spot, locale, showPrivateBadge }: SpotCardProps) {
  const t = useTranslations("spots");
  const tCommon = useTranslations("common");
  return (
    <Link href={`/spots/${spot.slug}`} className="group block">
      <article className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(44,36,22,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(44,36,22,0.1)]">
        <div className="relative aspect-[4/5] overflow-hidden">
          <AppImage
            src={spot.imageUrl}
            alt={getLocalizedText(spot.title, locale)}
            sizes="(max-width: 768px) 50vw, 33vw"
            placeholderVariant="spot"
            placeholderLabel={tCommon("photoUnavailable")}
            className="absolute inset-0"
            imageClassName="transition duration-500 group-hover:scale-105"
          />
          {spot.featured && (
            <span className="badge-accent absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
              ★ {tCommon("featured")}
            </span>
          )}
          {(showPrivateBadge || spot.visibility === "private") && (
            <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
              <Lock className="h-3 w-3" />
              {t("private")}
            </span>
          )}
          {spot.photos.length > 1 && (
            <span className="absolute bottom-14 right-3 z-10 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              +{spot.photos.length - 1}
            </span>
          )}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-10 p-4">
            <p className="line-clamp-1 text-[10px] font-medium text-white/70">
              {getSpotLocationLine(spot, locale)}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-white/75">
              {spot.authorName}
            </p>
            <h3 className="font-serif-display mt-0.5 line-clamp-2 text-lg font-semibold leading-tight text-white">
              {getLocalizedText(spot.title, locale)}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-white/70">
                <MapPin className="h-3 w-3" />
                {t(spot.waterType as "saltwater" | "freshwater" | "pond" | "river")}
              </span>
              {spot.tags[0] && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white/90">
                  {spot.tags[0]}
                </span>
              )}
              <span className="flex items-center gap-1 text-[11px] text-white/70">
                <MessageCircle className="h-3 w-3" />
                {spot.commentCount}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
