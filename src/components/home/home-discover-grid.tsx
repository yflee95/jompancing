"use client";

import { Link } from "@/i18n/navigation";
import { DISCOVER_ILLUSTRATIONS } from "@/components/illustrations/discover-tile-illustrations";
import { DISCOVER_TILES, type DiscoverTileId } from "@/data/curated-media";
import { cn } from "@/lib/utils";

interface HomeDiscoverGridProps {
  title: string;
  labels: Record<DiscoverTileId, string>;
  counts: Record<DiscoverTileId, number>;
}

export function HomeDiscoverGrid({
  title,
  labels,
  counts,
}: HomeDiscoverGridProps) {
  return (
    <section className="animate-fade-up border-t border-[var(--sand-dark)]/30 bg-white px-4 py-8 pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif-display mb-4 text-xl font-bold text-[var(--ink)]">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {DISCOVER_TILES.map((tile) => {
            const Illustration = DISCOVER_ILLUSTRATIONS[tile.id];
            const label = labels[tile.id];
            const count = counts[tile.id];

            return (
              <Link
                key={tile.id}
                href={tile.href}
                className="tap-card group relative aspect-[5/4] overflow-hidden rounded-2xl bg-gradient-to-br shadow-[var(--shadow-travel)] ring-1 ring-[var(--ocean)]/15 transition hover:shadow-[var(--shadow-travel-hover)]"
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br transition duration-300 group-hover:brightness-105",
                    tile.bg,
                  )}
                />
                <div className="absolute inset-x-1 top-1 flex h-[62%] items-center justify-center transition duration-300 group-hover:scale-[1.04]">
                  <Illustration className="max-h-full drop-shadow-sm" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--ocean-dark)]/88 via-[var(--ocean)]/55 to-transparent px-3.5 pb-3.5 pt-10">
                  <p className="text-sm font-bold text-white drop-shadow-sm">
                    {label}
                  </p>
                  <p className="text-xs text-white/80">{count}+</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
