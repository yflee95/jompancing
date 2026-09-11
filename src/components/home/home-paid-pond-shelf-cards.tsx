"use client";

import { MapPinned, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";
const peekShell =
  "tap-card group relative w-[calc((100vw-2rem-0.625rem)/2.15)] min-w-[152px] max-w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl shadow-[var(--shadow-travel)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-travel-hover)] md:w-[calc((100vw-3rem-0.625rem*2.5)/3.5)] md:max-w-[220px] md:min-w-[120px] lg:w-full lg:max-w-none lg:min-w-0 md:shrink lg:shrink";

export function HomePaidPondAddCard() {
  const t = useTranslations("home");
  const { isRegisteredUser } = useAuth();
  const href = isRegisteredUser ? "/post?type=pond" : "/login";

  return (
    <Link href={href} className={cn(peekShell, "bg-gradient-to-br from-[#1a6b72] via-[var(--ocean-dark)] to-[#0a3238]")}>
      <div className="relative aspect-[4/5] lg:aspect-[3/4]">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]"
          aria-hidden
        />
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[var(--ocean)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm md:left-3 md:top-3 md:px-2.5 md:py-1 md:text-[10px]">
          {t("paidPond")}
        </span>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition group-hover:scale-105">
            <MapPinned className="h-7 w-7 text-white" />
          </div>
          <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white/90">
            <Plus className="h-3 w-3" />
            {t("paidPondAddBadge")}
          </p>
          <h3 className="font-serif-display mt-2 line-clamp-2 text-sm font-semibold leading-snug text-white md:text-[15px]">
            {t("paidPondAddTitle")}
          </h3>
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/75">
            {isRegisteredUser ? t("paidPondAddDesc") : t("paidPondLoginHint")}
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
      </div>
    </Link>
  );
}

export function HomePaidPondPlaceholderCard() {
  const t = useTranslations("home");

  return (
    <div
      aria-hidden
      className={cn(
        peekShell,
        "pointer-events-none select-none bg-[var(--sand-dark)]/20 ring-[var(--sand-dark)]/40",
      )}
    >
      <div className="relative aspect-[4/5] lg:aspect-[3/4]">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--sand-dark)]/30 via-transparent to-transparent" />
        <span className="absolute left-2 top-2 rounded-full bg-white/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--ink-muted)]/50 md:left-3 md:top-3 md:text-[10px]">
          {t("paidPond")}
        </span>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <MapPinned className="h-8 w-8 text-[var(--ink-muted)]/30" />
          <p className="mt-3 text-xs font-medium text-[var(--ink-muted)]/50">
            {t("paidPondEmptyPlaceholder")}
          </p>
        </div>
      </div>
    </div>
  );
}
