"use client";

import {
  BookOpen,
  CalendarDays,
  MessageSquare,
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Map is on the bottom bar — only secondary routes live here. */
const moreLinks = [
  { href: "/forum", icon: MessageSquare, labelKey: "nav.forum" as const },
  { href: "/marketplace", icon: ShoppingBag, labelKey: "nav.marketplace" as const },
  { href: "/activities", icon: CalendarDays, labelKey: "nav.activities" as const },
  { href: "/guide", icon: BookOpen, labelKey: "nav.guide" as const },
];

export function MobileMoreNavButton() {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isMoreActive = moreLinks.some(({ href }) => pathname.startsWith(href));

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "relative flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-1 text-[10px] font-medium transition-colors",
          isMoreActive ? "text-[var(--ocean)]" : "text-[var(--ink-muted)]",
        )}
        aria-label={t("nav.more")}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Menu className={cn("h-5 w-5 shrink-0", isMoreActive && "stroke-[2.5]")} />
        <span className="max-w-full truncate">{t("nav.more")}</span>
        {isMoreActive && (
          <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[var(--ocean)]" />
        )}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-more-nav-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={t("common.cancel")}
            onClick={close}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5 pb-safe shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="mobile-more-nav-title"
                className="font-serif-display text-lg font-bold text-[var(--ink)]"
              >
                {t("nav.more")}
              </h2>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-2 text-[var(--ink-muted)] hover:bg-[var(--sand)]"
                aria-label={t("common.cancel")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="grid gap-2">
              {moreLinks.map(({ href, icon: Icon, labelKey }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--ink)] ring-1 ring-[var(--sand-dark)]/40 transition hover:bg-[var(--ocean-light)]/40"
                >
                  <Icon className="h-5 w-5 text-[var(--ocean)]" />
                  {t(labelKey)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
