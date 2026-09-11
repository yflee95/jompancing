"use client";

import {
  startTransition,
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
  MapPin,
  Navigation,
  Sparkles,
  Waves,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { HomeDeckCommentSheet } from "@/components/home/home-deck-comment-sheet";
import { HomeSpotDeckActions } from "@/components/home/home-spot-deck-actions";
import { HomeSpotDeckCard } from "@/components/home/home-spot-deck-card";
import { AppImage } from "@/components/ui/app-image";
import {
  getSpotCommentCount,
  getSpotCommentItems,
} from "@/lib/spot-comments";
import { cn } from "@/lib/utils";
import type { FishingSpot, WaterType } from "@/types";
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

function getWrappedOffset(i: number, index: number, count: number) {
  let offset = i - index;
  if (offset > count / 2) offset -= count;
  if (offset < -count / 2) offset += count;
  return offset;
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
  const dragPxRef = useRef(0);
  const dragRaf = useRef<number | null>(null);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const didLockAxis = useRef(false);

  const count = spots.length;
  const activeSpot = spots[index];
  const activeSpotId = activeSpot?.id;

  useEffect(() => {
    setIndex(0);
  }, [activeCategory, spots.length]);

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      startTransition(() => {
        setIndex((i) => (i + delta + count) % count);
      });
    },
    [count],
  );

  const resetDrag = useCallback(() => {
    dragging.current = false;
    didLockAxis.current = false;
    dragStartX.current = null;
    dragStartY.current = null;
    dragPxRef.current = 0;
    if (dragRaf.current != null) {
      cancelAnimationFrame(dragRaf.current);
      dragRaf.current = null;
    }
    setIsDragging(false);
    setDragPx(0);
  }, []);

  const scheduleDragUpdate = useCallback((dx: number) => {
    dragPxRef.current = dx;
    if (dragRaf.current != null) return;
    dragRaf.current = requestAnimationFrame(() => {
      dragRaf.current = null;
      setDragPx(dragPxRef.current);
    });
  }, []);

  const onPointerDown = useCallback((e: ReactPointerEvent) => {
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
    dragPxRef.current = 0;
    setDragPx(0);
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
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
      scheduleDragUpdate(dx);
    },
    [resetDrag, scheduleDragUpdate],
  );

  const onPointerUp = useCallback(
    (e: ReactPointerEvent) => {
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
    },
    [go, resetDrag],
  );

  const deckPointerHandlers = useMemo(
    () => ({
      onPointerDownCapture: onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    }),
    [onPointerDown, onPointerMove, onPointerUp],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(
    () => () => {
      if (dragRaf.current != null) cancelAnimationFrame(dragRaf.current);
    },
    [],
  );

  const seedComments = useMemo(() => {
    if (!activeSpot) return [];
    return getSpotCommentItems(activeSpot.id);
  }, [activeSpot, commentCountTick]);

  const activeCommentCount = useMemo(() => {
    if (!activeSpot) return 0;
    return getSpotCommentCount(activeSpot.id);
  }, [activeSpot, commentCountTick]);

  const blockNavigate = useCallback(() => didDrag.current, []);

  const openComments = useCallback(() => setSheetOpen(true), []);

  const closeComments = useCallback(() => {
    setSheetOpen(false);
    setCommentCountTick((n) => n + 1);
  }, []);

  return (
    <section className="relative min-h-[88vh] overflow-hidden md:min-h-0 md:py-8 lg:py-10">
      {/* Ambient backgrounds — keep mounted, crossfade (no reload flash) */}
      {count > 0 && (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          {spots.map((spot) => (
            <div
              key={`deck-bg-${spot.id}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 ease-out",
                spot.id === activeSpotId ? "opacity-100" : "opacity-0",
              )}
            >
              <AppImage
                src={spot.imageUrl}
                alt=""
                sizes="100vw"
                priority
                className="absolute inset-0 scale-110 blur-3xl"
                imageClassName="opacity-50"
                placeholderVariant="spot"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--sand)]/70 via-[var(--ocean-light)]/40 to-[var(--sand)]" />
        </div>
      )}

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-lg flex-col px-4 pb-6 pt-4 md:min-h-0 md:max-w-4xl md:px-8 md:pb-8 md:pt-2 lg:max-w-5xl">
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
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors md:text-sm",
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
                {spots.map((spot, i) => (
                  <HomeSpotDeckCard
                    key={spot.id}
                    spot={spot}
                    locale={locale}
                    offset={getWrappedOffset(i, index, count)}
                    dragPx={dragPx}
                    isDragging={isDragging}
                    eagerImage
                  />
                ))}

                {activeSpot && (
                  <HomeSpotDeckActions
                    spot={activeSpot}
                    commentCount={activeCommentCount}
                    blockNavigate={blockNavigate}
                    onOpenComments={openComments}
                  />
                )}
              </div>

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

        {count > 0 && (
          <div className="mt-4 shrink-0 text-center">
            <div className="flex justify-center gap-1.5">
              {spots.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`${i + 1}`}
                  onClick={() => startTransition(() => setIndex(i))}
                  className={cn(
                    "h-1.5 rounded-full transition-[width,background-color] duration-300",
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
          onClose={closeComments}
        />
      )}
    </section>
  );
}
