import { mockForumPosts } from "@/data/mock-data";
import { shouldUseMockContent } from "@/lib/mock-content";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchForumPostsFromDb } from "@/lib/supabase/forum";
import type { ForumCategory, ForumPost } from "@/types";

function sortForumPosts(posts: ForumPost[]): ForumPost[] {
  return [...posts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.hotScore - a.hotScore;
  });
}

export async function loadPublicForumPosts(
  category?: ForumCategory,
): Promise<ForumPost[]> {
  let dbPosts: ForumPost[] = [];
  if (isSupabaseConfigured()) {
    try {
      dbPosts = await fetchForumPostsFromDb();
    } catch {
      dbPosts = [];
    }
  }

  const mockPosts = shouldUseMockContent() ? mockForumPosts : [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const merged = [...dbPosts, ...mockPosts].filter((post) => {
    if (seenIds.has(post.id) || seenSlugs.has(post.slug)) return false;
    seenIds.add(post.id);
    seenSlugs.add(post.slug);
    return true;
  });

  const filtered = category
    ? merged.filter((post) => post.category === category)
    : merged;

  return sortForumPosts(filtered);
}
