/**
 * Curated visuals — Unsplash License (free use, no attribution required).
 * https://unsplash.com/license
 * Photos are thematic stock; not scraped from Google Maps.
 */

export type DiscoverTileId = "forum" | "map" | "shop" | "guide";

export interface DiscoverTileMedia {
  id: DiscoverTileId;
  href: "/forum" | "/map" | "/marketplace" | "/guide";
  /** Tailwind gradient classes for tile background */
  bg: string;
}

export const DISCOVER_TILES: DiscoverTileMedia[] = [
  {
    id: "forum",
    href: "/forum",
    bg: "from-[var(--ocean-light)] via-[#d4eaed] to-[var(--ocean)]/25",
  },
  {
    id: "map",
    href: "/map",
    bg: "from-[#e8f4f5] via-[var(--ocean-light)] to-[var(--ocean)]/20",
  },
  {
    id: "shop",
    href: "/marketplace",
    bg: "from-[var(--accent-light)] via-[#f0ebe6] to-[var(--ocean-light)]",
  },
  {
    id: "guide",
    href: "/guide",
    bg: "from-[var(--sand)] via-[var(--ocean-light)] to-[var(--ocean)]/15",
  },
];

