"use client";

import { Plus, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";
type ShelfLayout = "rail" | "grid";

const railShell =
  "tap-card relative w-[42vw] max-w-[180px] min-w-[140px] shrink-0 snap-start overflow-hidden rounded-3xl md:w-full md:max-w-none md:min-w-0";

const gridShell =
  "relative overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-travel)] ring-1 ring-black/[0.04]";

interface ListingAddCardProps {
  layout?: ShelfLayout;
}

export function ListingAddCard({ layout = "rail" }: ListingAddCardProps) {
  const t = useTranslations("marketplace");
  const { isRegisteredUser } = useAuth();
  const href = isRegisteredUser ? "/marketplace/new" : "/login";

  return (
    <Link
      href={href}
      className={cn(
        layout === "rail" ? railShell : gridShell,
        "group bg-gradient-to-br from-[var(--ocean)] via-[var(--ocean-dark)] to-[#0d3a40] shadow-[var(--shadow-travel)] ring-1 ring-[var(--ocean)]/25 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-travel-hover)]",
      )}
    >
      <div
        className={cn(
          "relative flex flex-col items-center justify-center p-4 text-center",
          layout === "rail" ? "aspect-square" : "aspect-square min-h-[220px]",
        )}
      >
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-4 left-1/4 h-16 w-16 rounded-full bg-[var(--accent)]/25 blur-xl"
          aria-hidden
        />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition group-hover:scale-105">
          <ShoppingBag className="h-7 w-7 text-white" />
        </div>
        <p className="relative mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/90">
          <Plus className="h-3 w-3" />
          {t("addCardBadge")}
        </p>
        <h3 className="relative mt-2 line-clamp-2 text-sm font-bold leading-snug text-white">
          {t("addCardTitle")}
        </h3>
        <p className="relative mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/75">
          {isRegisteredUser ? t("addCardDesc") : t("addCardLoginHint")}
        </p>
      </div>
    </Link>
  );
}

interface ListingPlaceholderCardProps {
  layout?: ShelfLayout;
}

export function ListingPlaceholderCard({ layout = "rail" }: ListingPlaceholderCardProps) {
  const t = useTranslations("marketplace");

  return (
    <div
      aria-hidden
      className={cn(
        layout === "rail" ? railShell : gridShell,
        "pointer-events-none select-none bg-[var(--sand-dark)]/25 ring-1 ring-[var(--sand-dark)]/35",
      )}
    >
      <div
        className={cn(
          "flex aspect-square flex-col items-center justify-center p-4 text-center",
          layout === "grid" && "min-h-[220px]",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/50">
          <ShoppingBag className="h-5 w-5 text-[var(--ink-muted)]/40" />
        </div>
        <p className="mt-3 text-xs font-medium text-[var(--ink-muted)]/55">
          {t("emptyPlaceholder")}
        </p>
      </div>
    </div>
  );
}

export function buildListingShelfSlots<T>(realItems: T[], maxVisible = 4): Array<
  { kind: "item"; value: T } | { kind: "add" } | { kind: "placeholder" }
> {
  const slots: Array<
    { kind: "item"; value: T } | { kind: "add" } | { kind: "placeholder" }
  > = realItems.slice(0, maxVisible).map((value) => ({ kind: "item", value }));

  if (slots.length === 0) {
    slots.push({ kind: "add" });
    slots.push({ kind: "placeholder" });
    slots.push({ kind: "placeholder" });
    return slots;
  }

  const placeholders = Math.min(2, maxVisible - slots.length);
  for (let i = 0; i < placeholders; i++) {
    slots.push({ kind: "placeholder" });
  }

  return slots;
}
