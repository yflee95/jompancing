"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Flame,
  MapPin,
  Eye,
  MessageCircle,
  Navigation,
  Sparkles,
  Waves,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HomeDeckCommentSheet } from "@/components/home/home-deck-comment-sheet";
import { AppImage } from "@/components/ui/app-image";
import {
  getSpotCommentCount,
  getSpotCommentItems,
} from "@/lib/spot-comments";
import { formatDistance } from "@/lib/geo";
import { getSpotLocationLine } from "@/lib/spot-location";
import { cn } from "@/lib/utils";
import { getLocalizedText, type FishingSpot, type WaterType } from "@/types";
import type { Locale } from "@/i18n/routing";

type SpotWithDistance = FishingSpot & { distanceKm: number };

const CATEGORIES: { id: WaterType | "all"; icon: typeof Waves }[] = [
  { id: "all", icon: Sparkles },
  { id: "saltwater", icon: Waves },
  { id: "pond", icon: MapPin },
  { id: "river", icon: Compass },
];

const SWIPE_THRESHOLD = 48;

interface HomeSpotDeckProps {
  spots: SpotWithDistance[];
  locale: Locale;
  activeCategory: WaterType | "all";
  onCategoryChange: (category: WaterType | "all") => void;
  locationLabel: string | null;
  locating: boolean;
  nearbyCount: number;
}

function getCardStyle(offset: number, dragPx: number) {
  const base = offset * 100 + dragPx * 0.35;
  const abs = Math.abs(offset);

  if (abs > 2) {
    return {
      opacity: 0,
      pointerEvents: "none" as const,
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
    pointerEvents: (abs <= 1 ? "auto" : "none") as "auto" | "none",
    transform: `translateX(calc(${base}px + ${offset * 18}%)) scale(${scale}) rotateY(${rotateY}deg)`,
    zIndex,
  };
}

export function HomeSpotDeck({
  spots,
  locale,
  activeCategory,
  onCategoryChange,
  locationLabel,
  locating,
  nearbyCount,
}: HomeSpotDeckProps) {
  const t = useTranslations("home");
  const tSpots = useTranslations("spots");
  const tCommon = useTranslations("common");

  const [index, setIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [commentCountTick, setCommentCountTick] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const didLockAxis = useRef(false);

  const count = spots.length;
  const activeSpot = spots[index];

  useEffect(() => {
    setIndex(0);
  }, [activeCategory, spots.length]);

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  const resetDrag = useCallback(() => {
    dragging.current = false;
    didLockAxis.current = false;
    dragStartX.current = null;
    dragStartY.current = null;
    setIsDragging(false);
    setDragPx(0);
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    if (
      e.target instanceof HTMLElement &&
      e.target.closest("[data-deck-action]")
    ) {
      return;
    }
    dragging.current = true;
    didDrag.current = false;
    didLockAxis.current = false;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    setDragPx(0);
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current || dragStartX.current == null || dragStartY.current == null) {
      return;
    }
    const dx = e.clientX - dragStartX.current;
    const dy = e.clientY - dragStartY.current;

    if (!didLockAxis.current && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      if (Math.abs(dy) > Math.abs(dx)) {
        resetDrag();
        return;
      }
      didLockAxis.current = true;
    }

    if (!didLockAxis.current) return;

    didDrag.current = true;
    e.preventDefault();
    setDragPx(dx);
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (dragging.current && didLockAxis.current && dragStartX.current != null) {
      const dx = e.clientX - dragStartX.current;
      if (dx < -SWIPE_THRESHOLD) go(1);
      else if (dx > SWIPE_THRESHOLD) go(-1);
    }
    resetDrag();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer was not captured */
    }
    window.setTimeout(() => {
      didDrag.current = false;
    }, 0);
  };

  const deckPointerHandlers = {
    onPointerDownCapture: onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const seedComments = useMemo(() => {
    if (!activeSpot) return [];
    return getSpotCommentItems(activeSpot.id);
  }, [activeSpot, commentCountTick]);

  const activeCommentCount = useMemo(() => {
    if (!activeSpot) return 0;
    return getSpotCommentCount(activeSpot.id);
  }, [activeSpot, commentCountTick]);

  return (
    <section className="relative min-h-[88vh] overflow-hidden md:min-h-0 md:py-8 lg:py-10">
      {/* Ambient blurred background */}
      {activeSpot?.imageUrl && (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <AppImage
            src={activeSpot.imageUrl}
            alt=""
            sizes="100vw"
            className="absolute inset-0 scale-110 blur-3xl"
            imageClassName="opacity-50"
            placeholderVariant="spot"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--sand)]/70 via-[var(--ocean-light)]/40 to-[var(--sand)]" />
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-lg flex-col px-4 pb-6 pt-4 md:min-h-0 md:max-w-4xl md:px-8 md:pb-8 md:pt-2 lg:max-w-5xl">
        {/* Location + filters */}
        <div className="shrink-0 md:mx-auto md:max-w-2xl md:text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-xs font-medium text-[var(--ocean)] shadow-sm ring-1 ring-white/80 backdrop-blur-md md:mx-auto">
            <Navigation
              className={cn("h-3.5 w-3.5", locating && "animate-pulse")}
            />
            {locating
              ? t("findingLocation")
              : `${locationLabel ?? tCommon("nearYou")} · ${t("spotsNearby", { count: nearbyCount })}`}
          </div>

          <h1 className="font-serif-display mt-4 text-2xl font-bold text-[var(--ink)] md:text-3xl">
            {t("deckTitle")}
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{t("deckHint")}</p>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none md:justify-center">
            {CATEGORIES.map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onCategoryChange(id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm transition-all md:text-sm",
                  activeCategory === id
                    ? "bg-[var(--ocean)] text-white shadow-md shadow-[var(--ocean-glow)]"
                    : "bg-white/70 text-[var(--ink-muted)] ring-1 ring-white/80 hover:text-[var(--ink)]",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {id === "all" ? t("allSpots") : tSpots(id)}
              </button>
            ))}
          </div>
        </div>

        {/* 3D deck stage — full-width swipe zone (left/right peek included) */}
        <div
          className="relative mx-auto mt-6 w-full flex-1 touch-pan-y select-none md:mt-8 md:max-w-3xl"
          style={{ perspective: "1400px" }}
          {...deckPointerHandlers}
        >
          {count === 0 ? (
            <div className="flex h-full min-h-[340px] items-center justify-center rounded-3xl bg-white/60 p-8 text-center text-sm text-[var(--ink-muted)] ring-1 ring-white/80 backdrop-blur-md">
              {tSpots("noSpots")}
            </div>
          ) : (
            <>
              <div className="relative mx-auto h-[min(420px,52vh)] w-full max-w-[min(100%,420px)] md:h-[min(500px,56vh)] md:max-w-[440px] lg:max-w-[480px]">
                {spots.map((spot, i) => {
                  let offset = i - index;
                  if (offset > count / 2) offset -= count;
                  if (offset < -count / 2) offset += count;
                  const style = getCardStyle(offset, dragPx);

                  const isActive = offset === 0;

                  return (
                    <article
                      key={spot.id}
                      className={cn(
                        "absolute inset-0 origin-center transition-[transform,opacity] duration-300 ease-out",
                        isActive && "cursor-grab active:cursor-grabbing",
                        !isActive && "pointer-events-none",
                      )}
                      style={{
                        transform: style.transform,
                        opacity: style.opacity,
                        zIndex: style.zIndex,
                        pointerEvents: isActive ? "auto" : "none",
                        transitionDuration: isDragging ? "0ms" : undefined,
                      }}
                      onClick={
                        !isActive
                          ? undefined
                          : (e) => {
                              if (didDrag.current) e.preventDefault();
                            }
                      }
                    >
                      <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white/90 shadow-[0_24px_64px_rgba(26,101,112,0.18)] ring-1 ring-white/90 backdrop-blur-xl">
                        <div className="relative block flex-1 overflow-hidden">
                          <div className="relative aspect-[4/5] h-full min-h-[280px] w-full touch-pan-y">
                            <AppImage
                              src={spot.imageUrl}
                              alt={getLocalizedText(spot.title, locale)}
                              priority={i === index}
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
                            <div className="absolute inset-x-0 bottom-0 p-4">
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

                        {isActive && (
                          <div
                            data-deck-action
                            className="relative z-50 grid grid-cols-2 border-t border-[var(--sand-dark)]/25 bg-white/80 backdrop-blur-md"
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setSheetOpen(true)}
                              className="tap-card flex flex-col items-center gap-1 border-r border-[var(--sand-dark)]/20 px-3 py-3 text-[10px] font-medium text-[var(--ink-muted)] hover:text-[var(--ocean)] md:text-xs"
                            >
                              <MessageCircle className="h-5 w-5 md:h-[22px] md:w-[22px]" />
                              {activeCommentCount > 0
                                ? t("deckComments", { count: activeCommentCount })
                                : t("deckCommentsEmpty")}
                            </button>
                            <Link
                              href={`/spots/${spot.slug}`}
                              onClick={(e) => {
                                if (didDrag.current) e.preventDefault();
                              }}
                              className="tap-card flex flex-col items-center gap-1 px-3 py-3 text-[10px] font-medium text-[var(--ink-muted)] hover:text-[var(--ocean)] md:text-xs"
                            >
                              <Eye className="h-5 w-5 md:h-[22px] md:w-[22px]" />
                              {t("deckView")}
                            </Link>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Prev / next arrows — pointer-events only on icon so sides stay swipeable */}
              <button
                type="button"
                aria-label={t("deckPrev")}
                onClick={() => go(-1)}
                className="pointer-events-none absolute inset-y-0 left-0 z-40 flex w-[22%] max-w-[140px] items-center justify-start pl-1 md:pl-0 lg:max-w-[160px]"
              >
                <span className="pointer-events-auto rounded-full bg-white/90 p-2.5 shadow-md ring-1 ring-white/90 backdrop-blur-md transition hover:bg-white md:p-3">
                  <ChevronLeft className="h-5 w-5 text-[var(--ocean)]" />
                </span>
              </button>
              <button
                type="button"
                aria-label={t("deckNext")}
                onClick={() => go(1)}
                className="pointer-events-none absolute inset-y-0 right-0 z-40 flex w-[22%] max-w-[140px] items-center justify-end pr-1 md:pr-0 lg:max-w-[160px]"
              >
                <span className="pointer-events-auto rounded-full bg-white/90 p-2.5 shadow-md ring-1 ring-white/90 backdrop-blur-md transition hover:bg-white md:p-3">
                  <ChevronRight className="h-5 w-5 text-[var(--ocean)]" />
                </span>
              </button>
            </>
          )}
        </div>

        {/* Dots + scroll hint */}
        {count > 0 && (
          <div className="mt-4 shrink-0 text-center">
            <div className="flex justify-center gap-1.5">
              {spots.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index
                      ? "w-6 bg-[var(--ocean)]"
                      : "w-1.5 bg-[var(--sand-dark)]",
                  )}
                />
              ))}
            </div>
            <p className="mt-1 text-[11px] text-[var(--ink-muted)]">
              {t("deckCounter", { current: index + 1, total: count })}
            </p>
          </div>
        )}

        <a
          href="#home-browse"
          className="deck-scroll-hint mt-5 flex flex-col items-center gap-1 text-xs font-medium text-[var(--ocean)]/80"
        >
          <span>{t("deckScrollMore")}</span>
          <ChevronDown className="h-5 w-5" />
        </a>
      </div>

      {activeSpot && (
        <HomeDeckCommentSheet
          open={sheetOpen}
          spot={activeSpot}
          seedComments={seedComments}
          locale={locale}
          onClose={() => {
            setSheetOpen(false);
            setCommentCountTick((n) => n + 1);
          }}
        />
      )}
    </section>
  );
}
