import type { CommentItem } from "@/components/shared/comments-section";
import { COMMENT_ADDED_EVENT } from "@/components/shared/comments-section";
import { getCommentsForSpot } from "@/data/mock-data";
import { isDbThreadId } from "@/lib/supabase/comments";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const STORAGE_PREFIX = "jompancing_comments_";

export function loadStoredSpotComments(spotId: string): CommentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${spotId}`);
    return raw ? (JSON.parse(raw) as CommentItem[]) : [];
  } catch {
    return [];
  }
}

/** Seed + local comments — matches what the comment sheet shows. */
export function getSpotCommentCount(
  spotId: string,
  dbCount?: number,
): number {
  if (isSupabaseConfigured() && isDbThreadId(spotId)) {
    return dbCount ?? 0;
  }

  const seed = getCommentsForSpot(spotId);
  const stored = loadStoredSpotComments(spotId);
  const seen = new Set(seed.map((c) => c.id));
  let extra = 0;
  for (const c of stored) {
    if (!seen.has(c.id)) {
      seen.add(c.id);
      extra++;
    }
  }
  return seed.length + extra;
}

export function getSpotCommentItems(spotId: string): CommentItem[] {
  if (isSupabaseConfigured() && isDbThreadId(spotId)) {
    return [];
  }

  const seed = getCommentsForSpot(spotId).map(
    ({ id, authorName, body, createdAt }) => ({
      id,
      authorName,
      body,
      createdAt,
    }),
  );
  const stored = loadStoredSpotComments(spotId);
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

export { COMMENT_ADDED_EVENT };
