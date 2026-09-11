"use client";

import { memo } from "react";
import { Eye, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { FishingSpot } from "@/types";

interface HomeSpotDeckActionsProps {
  spot: FishingSpot;
  commentCount: number;
  blockNavigate: () => boolean;
  onOpenComments: () => void;
}

export const HomeSpotDeckActions = memo(function HomeSpotDeckActions({
  spot,
  commentCount,
  blockNavigate,
  onOpenComments,
}: HomeSpotDeckActionsProps) {
  const t = useTranslations("home");

  return (
    <div
      data-deck-action
      className="absolute inset-x-0 bottom-0 z-50 grid grid-cols-2 overflow-hidden rounded-b-3xl border-t border-[var(--sand-dark)]/25 bg-white/90 backdrop-blur-md"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onOpenComments}
        className="tap-card flex flex-col items-center gap-1 border-r border-[var(--sand-dark)]/20 px-3 py-3 text-[10px] font-medium text-[var(--ink-muted)] hover:text-[var(--ocean)] md:text-xs"
      >
        <MessageCircle className="h-5 w-5 md:h-[22px] md:w-[22px]" />
        {commentCount > 0
          ? t("deckComments", { count: commentCount })
          : t("deckCommentsEmpty")}
      </button>
      <Link
        href={`/spots/${spot.slug}`}
        onClick={(e) => {
          if (blockNavigate()) e.preventDefault();
        }}
        className="tap-card flex flex-col items-center gap-1 px-3 py-3 text-[10px] font-medium text-[var(--ink-muted)] hover:text-[var(--ocean)] md:text-xs"
      >
        <Eye className="h-5 w-5 md:h-[22px] md:w-[22px]" />
        {t("deckView")}
      </Link>
    </div>
  );
});
