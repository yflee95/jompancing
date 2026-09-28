import { malaysiaStates } from "@/data/malaysia-states";

const RESERVED = new Set(
  malaysiaStates.flatMap((state) => [state.id, state.slug]),
);

export function isReservedSpotSlug(slug: string): boolean {
  const normalized = slug.trim().toLowerCase();
  return RESERVED.has(normalized);
}

/** Avoid UGC slugs that collide with state landing pages (/spots/johor). */
export function ensureUniqueSpotSlugBase(baseSlug: string): string {
  const trimmed = baseSlug.trim().toLowerCase();
  if (!trimmed || !isReservedSpotSlug(trimmed)) return trimmed || "spot";
  return `${trimmed}-spot`;
}
