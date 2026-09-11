"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CommentItem } from "@/components/shared/comments-section";
import {
  getSpotCommentCount,
  loadStoredSpotComments,
} from "@/lib/spot-comments";
import { formatDate, cn } from "@/lib/utils";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

const DRAG_THRESHOLD = 36;

interface HomeDeckCommentSheetProps {
  open: boolean;
  spot: FishingSpot;
  seedComments: CommentItem[];
  locale: Locale;
  onClose: () => void;
}

function mergeComments(
  seed: CommentItem[],
  stored: CommentItem[],
): CommentItem[] {
  const seen = new Set<string>();
  return [...seed, ...stored]
    .filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function HomeDeckCommentSheet({
  open,
  spot,
  seedComments,
  locale,
  onClose,
}: HomeDeckCommentSheetProps) {
  const t = useTranslations("home");
  const tSpots = useTranslations("spots");
  const tComments = useTranslations("comments");

  const [portalReady, setPortalReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [storedComments, setStoredComments] = useState<CommentItem[]>([]);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);

  const dragStartY = useRef<number | null>(null);
  const sheetDragging = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setDragOffset(0);
    const stored = loadStoredSpotComments(spot.id);
    setStoredComments(stored);
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const hasComments = getSpotCommentCount(spot.id) > 0;
    setExpanded(isDesktop || hasComments);
  }, [open, spot.id, seedComments.length]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const comments = useMemo(
    () => mergeComments(seedComments, storedComments),
    [seedComments, storedComments],
  );

  const snapExpanded = useCallback((next: boolean) => {
    setExpanded(next);
    setDragOffset(0);
    if (!next) {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const onHandlePointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    dragStartY.current = e.clientY;
    sheetDragging.current = true;
    setIsDraggingSheet(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onHandlePointerMove = (e: ReactPointerEvent) => {
    if (dragStartY.current == null || !sheetDragging.current) return;
    const dy = e.clientY - dragStartY.current;
    if (expanded) {
      setDragOffset(Math.max(0, dy));
    } else {
      setDragOffset(Math.min(0, dy));
    }
  };

  const onHandlePointerUp = (e: ReactPointerEvent) => {
    if (dragStartY.current == null) return;
    const dy = e.clientY - dragStartY.current;
    dragStartY.current = null;
    sheetDragging.current = false;
    setIsDraggingSheet(false);
    setDragOffset(0);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* not captured */
    }

    if (dy < -DRAG_THRESHOLD) snapExpanded(true);
    else if (dy > DRAG_THRESHOLD) snapExpanded(false);
  };

  if (!portalReady || !open) return null;

  const sheetHeight = expanded
    ? "min(calc(100dvh - 4rem), 820px)"
    : "min(62vh, 560px)";

  return createPortal(
    <div
      className="deck-overlay-enter fixed inset-0 z-[120] flex items-end justify-center bg-black/45 backdrop-blur-sm md:items-center md:p-6"
      role="dialog"
      aria-modal
      aria-labelledby="deck-comment-title"
      onClick={onClose}
    >
      <div
        className={cn(
          "deck-sheet-enter flex w-full max-w-md flex-col overflow-hidden rounded-t-[1.75rem] bg-[var(--sand)] shadow-2xl ring-1 ring-black/5 md:mb-0 md:max-w-xl md:rounded-3xl",
          "mb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] transition-[height,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isDraggingSheet && "duration-0",
          expanded && "md:!h-[min(72vh,680px)]",
        )}
        style={{
          height: sheetHeight,
          transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle + header */}
        <div className="shrink-0 border-b border-[var(--sand-dark)]/35 bg-white px-4 pb-3.5 pt-2.5 md:px-5">
          <div
            className="flex cursor-grab touch-none flex-col items-center py-1.5 active:cursor-grabbing md:hidden"
            onPointerDown={onHandlePointerDown}
            onPointerMove={onHandlePointerMove}
            onPointerUp={onHandlePointerUp}
            onPointerCancel={onHandlePointerUp}
          >
            <div className="h-1 w-12 rounded-full bg-[var(--sand-dark)]/90" />
            {!expanded && (
              <p className="mt-1.5 text-[10px] font-medium text-[var(--ink-muted)]">
                {t("deckCommentsExpand")}
              </p>
            )}
          </div>

          <div className="mt-1 flex items-start gap-3 md:mt-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--ocean-light)] text-[var(--ocean)]">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                id="deck-comment-title"
                className="font-serif-display line-clamp-2 text-base font-bold leading-snug text-[var(--ink)] md:text-lg"
              >
                {getLocalizedText(spot.title, locale)}
              </h3>
              <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                {tSpots("comments")} · {comments.length}
              </p>
            </div>
            <button
              type="button"
              aria-label={tComments("title")}
              onClick={onClose}
              className="tap-card rounded-full bg-[var(--sand)] p-2 text-[var(--ink-muted)] hover:text-[var(--ink)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable comments */}
        <div className="relative min-h-0 flex-1">
          <div
            ref={listRef}
            className="h-full overflow-y-auto overscroll-contain scroll-smooth px-4 py-3.5 md:px-5 md:py-4"
          >
            {comments.length === 0 ? (
              <div className="rounded-2xl bg-white p-6 text-center ring-1 ring-[var(--sand-dark)]/40">
                <MessageCircle className="mx-auto h-8 w-8 text-[var(--ocean)]/50" />
                <p className="mt-3 text-sm text-[var(--ink-muted)]">
                  {t("deckNoComments")}
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {comments.map((comment) => (
                  <li key={comment.id}>
                    <article className="rounded-2xl bg-white p-4 ring-1 ring-[var(--sand-dark)]/35 shadow-[var(--shadow-travel)]">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ocean-light)] text-sm font-bold text-[var(--ocean)]">
                          {comment.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[var(--ink)]">
                            {comment.authorName}
                          </p>
                          <p className="text-[11px] text-[var(--ink-muted)]">
                            {formatDate(comment.createdAt, locale)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-[var(--ink-muted)]">
                        {getLocalizedText(comment.body, locale)}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!expanded && comments.length > 1 && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--sand)] via-[var(--sand)]/80 to-transparent"
              aria-hidden
            />
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--sand-dark)]/35 bg-white px-4 py-3.5 pb-safe md:px-5">
          <button
            type="button"
            onClick={() => snapExpanded(!expanded)}
            className="tap-card mb-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--ocean-light)]/60 py-2 text-xs font-semibold text-[var(--ocean)] md:hidden"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                expanded && "rotate-180",
              )}
            />
            {expanded ? t("deckCommentsCollapse") : t("deckCommentsExpand")}
          </button>
          <Link
            href={`/spots/${spot.slug}#comments`}
            className="block rounded-xl bg-[var(--ocean)] py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-[var(--ocean-glow)] transition hover:bg-[var(--ocean-dark)]"
            onClick={onClose}
          >
            {t("deckViewSpot")} →
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
