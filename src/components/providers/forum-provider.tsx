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
import type { ForumCategory, ForumPost, LocalizedString } from "@/types";

const STORAGE_KEY = "jompancing_forum_posts";

interface NewForumPostInput {
  title: string;
  body: string;
  category: ForumCategory;
  authorName: string;
  locale: "ms" | "en" | "zh";
}

interface ForumContextValue {
  userPosts: ForumPost[];
  isLoaded: boolean;
  addPost: (input: NewForumPostInput) => ForumPost;
  getUserPostBySlug: (slug: string) => ForumPost | undefined;
}

const ForumContext = createContext<ForumContextValue | null>(null);

function toLocalized(text: string, locale: "ms" | "en" | "zh"): LocalizedString {
  return { ms: text, en: text, zh: text, [locale]: text };
}

export function ForumProvider({ children }: { children: React.ReactNode }) {
  const [userPosts, setUserPosts] = useState<ForumPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUserPosts(JSON.parse(stored) as ForumPost[]);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const persist = useCallback((posts: ForumPost[]) => {
    setUserPosts(posts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, []);

  const addPost = useCallback(
    (input: NewForumPostInput): ForumPost => {
      const now = new Date().toISOString();
      const baseSlug = slugify(input.title) || "topic";
      const slug = `${baseSlug}-${Date.now().toString(36)}`;

      const post: ForumPost = {
        id: `user-${Date.now()}`,
        slug,
        title: toLocalized(input.title, input.locale),
        body: toLocalized(input.body, input.locale),
        category: input.category,
        authorName: input.authorName,
        replyCount: 0,
        viewCount: 1,
        hotScore: 10,
        createdAt: now,
        lastReplyAt: now,
      };

      persist([post, ...userPosts]);
      return post;
    },
    [persist, userPosts],
  );

  const getUserPostBySlug = useCallback(
    (slug: string) => userPosts.find((p) => p.slug === slug),
    [userPosts],
  );

  const value = useMemo(
    () => ({ userPosts, isLoaded, addPost, getUserPostBySlug }),
    [userPosts, isLoaded, addPost, getUserPostBySlug],
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
