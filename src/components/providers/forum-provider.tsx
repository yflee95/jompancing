"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { slugify } from "@/lib/slug";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  fetchForumPostsClient,
  insertForumPostToDb,
} from "@/lib/supabase/forum";
import { createSourceLocalizedText } from "@/lib/translate/ugc-text";
import type { ForumCategory, ForumPost } from "@/types";

const STORAGE_KEY = "jompancing_forum_posts";

interface NewForumPostInput {
  title: string;
  body: string;
  category: ForumCategory;
  authorId: string;
  authorName: string;
  locale: "ms" | "en" | "zh";
}

interface ForumContextValue {
  userPosts: ForumPost[];
  isLoaded: boolean;
  addPost: (input: NewForumPostInput) => Promise<ForumPost>;
  getUserPostBySlug: (slug: string) => ForumPost | undefined;
  refreshPosts: () => Promise<void>;
}

const ForumContext = createContext<ForumContextValue | null>(null);

export function ForumProvider({ children }: { children: React.ReactNode }) {
  const useDb = isSupabaseConfigured();
  const [userPosts, setUserPosts] = useState<ForumPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshPosts = useCallback(async () => {
    if (useDb) {
      try {
        const posts = await fetchForumPostsClient();
        setUserPosts(posts);
      } catch {
        setUserPosts([]);
      }
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setUserPosts(stored ? (JSON.parse(stored) as ForumPost[]) : []);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setUserPosts([]);
      }
    }
    setIsLoaded(true);
  }, [useDb]);

  useEffect(() => {
    void refreshPosts();
  }, [refreshPosts]);

  const persistLocal = useCallback((posts: ForumPost[]) => {
    setUserPosts(posts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, []);

  const addPost = useCallback(
    async (input: NewForumPostInput): Promise<ForumPost> => {
      if (useDb) {
        const post = await insertForumPostToDb(input);
        setUserPosts((prev) => [post, ...prev]);
        return post;
      }

      const now = new Date().toISOString();
      const baseSlug = slugify(input.title) || "topic";
      const slug = `${baseSlug}-${Date.now().toString(36)}`;

      const post: ForumPost = {
        id: `user-${Date.now()}`,
        slug,
        title: createSourceLocalizedText(input.title, input.locale),
        body: createSourceLocalizedText(input.body, input.locale),
        sourceLocale: input.locale,
        category: input.category,
        authorName: input.authorName,
        replyCount: 0,
        viewCount: 1,
        hotScore: 10,
        createdAt: now,
        lastReplyAt: now,
      };

      persistLocal([post, ...userPosts]);
      return post;
    },
    [persistLocal, useDb, userPosts],
  );

  const getUserPostBySlug = useCallback(
    (slug: string) => userPosts.find((p) => p.slug === slug),
    [userPosts],
  );

  const value = useMemo(
    () => ({ userPosts, isLoaded, addPost, getUserPostBySlug, refreshPosts }),
    [userPosts, isLoaded, addPost, getUserPostBySlug, refreshPosts],
  );

  return (
    <ForumContext.Provider value={value}>{children}</ForumContext.Provider>
  );
}

export function useForum(): ForumContextValue {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error("useForum must be used within ForumProvider");
  return ctx;
}
