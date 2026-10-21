"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSavedSpots } from "@/hooks/use-saved-spots";
import { toggleSavedSpot } from "@/lib/saved-spots";
import { cn } from "@/lib/utils";

interface SavedSpotButtonProps {
  slug: string;
  compact?: boolean;
  className?: string;
}

export function SavedSpotButton({
  slug,
  compact = false,
  className,
}: SavedSpotButtonProps) {
  const t = useTranslations("spots");
  const { slugs } = useSavedSpots();
  const isSaved = slugs.includes(slug);
  const label = isSaved ? t("removeSavedSpot") : t("saveSpotForLater");

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isSaved}
      title={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleSavedSpot(slug);
      }}
      className={cn(
        compact
          ? "inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[var(--ocean)] shadow-md ring-1 ring-black/5 transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ocean)]"
          : "inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--ocean)] shadow-sm ring-1 ring-[var(--sand-dark)]/50 transition hover:bg-[var(--ocean-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ocean)]",
        className,
      )}
    >
      <Heart
        className={cn("h-5 w-5", isSaved && "fill-current")}
        aria-hidden="true"
      />
      {!compact && <span>{isSaved ? t("savedSpot") : t("saveSpotForLater")}</span>}
    </button>
  );
}
