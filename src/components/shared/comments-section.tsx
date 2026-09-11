"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { formatDate, cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  fetchCommentsForThread,
  insertCommentToDb,
  isDbThreadId,
  type ThreadType,
} from "@/lib/supabase/comments";
import { getLocalizedText, type LocalizedString } from "@/types";
import type { Locale } from "@/i18n/routing";

export interface CommentItem {
  id: string;
  authorName: string;
  body: LocalizedString;
  createdAt: string;
}

interface CommentsSectionProps {
  threadId: string;
  threadType?: ThreadType;
  comments: CommentItem[];
  locale: Locale;
  title?: string;
  id?: string;
  className?: string;
}

const STORAGE_PREFIX = "jompancing_comments_";
const COMMENT_ADDED_EVENT = "jompancing-comment-added";

function loadStoredComments(threadId: string): CommentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${threadId}`);
    return raw ? (JSON.parse(raw) as CommentItem[]) : [];
  } catch {
    return [];
  }
}

function saveStoredComments(threadId: string, items: CommentItem[]) {
  localStorage.setItem(`${STORAGE_PREFIX}${threadId}`, JSON.stringify(items));
}

function mergeComments(
  seed: CommentItem[],
  stored: CommentItem[],
): CommentItem[] {
  const seen = new Set<string>();
  return [...seed, ...stored]
    .filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}

export function CommentsSection({
  threadId,
  threadType = "spot",
  comments,
  locale,
  title,
  id = "comments",
  className,
}: CommentsSectionProps) {
  const t = useTranslations("comments");
  const { user, isRegisteredUser } = useAuth();
  const activeLocale = useLocale() as Locale;
  const [draft, setDraft] = useState("");
  const [userComments, setUserComments] = useState<CommentItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const useDb =
    isSupabaseConfigured() && isDbThreadId(threadId);

  const loadComments = useCallback(async () => {
    if (useDb) {
      try {
        const fetched = await fetchCommentsForThread(threadType, threadId);
        setUserComments(fetched);
      } catch {
        setUserComments([]);
      }
    } else {
      setUserComments(loadStoredComments(threadId));
    }
    setHydrated(true);
  }, [threadId, threadType, useDb]);

  useEffect(() => {
    setHydrated(false);
    void loadComments();
  }, [loadComments]);

  const displayed = useMemo(() => {
    if (useDb) {
      return mergeComments(comments, userComments);
    }
    return mergeComments(comments, userComments);
  }, [comments, userComments, useDb]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !isRegisteredUser || !user || posting) return;

    setPosting(true);
    setPostError(null);

    try {
      if (useDb) {
        const created = await insertCommentToDb({
          threadType,
          threadId,
          authorId: user.id,
          body: text,
          locale: activeLocale,
        });
        setUserComments((prev) => [...prev, created]);
        window.dispatchEvent(
          new CustomEvent(COMMENT_ADDED_EVENT, {
            detail: { threadId, threadType },
          }),
        );
      } else {
        const body: LocalizedString = {
          ms: text,
          en: text,
          zh: text,
          [activeLocale]: text,
        };
        const next: CommentItem = {
          id: `local-${Date.now()}`,
          authorName: user.name,
          body,
          createdAt: new Date().toISOString(),
        };
        const updated = [...userComments, next];
        setUserComments(updated);
        saveStoredComments(threadId, updated);
        window.dispatchEvent(
          new CustomEvent(COMMENT_ADDED_EVENT, {
            detail: { threadId, threadType },
          }),
        );
      }
      setDraft("");
    } catch {
      setPostError(t("postFailed"));
    } finally {
      setPosting(false);
    }
  }

  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-[var(--ocean)]" />
        <h2 className="font-serif-display text-xl font-bold text-[var(--ink)]">
          {title ?? t("title")}
        </h2>
        <span className="rounded-full bg-[var(--ocean-light)] px-2.5 py-0.5 text-xs font-semibold text-[var(--ocean)]">
          {hydrated ? displayed.length : comments.length}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {!hydrated ? (
          <PageLoader compact />
        ) : displayed.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/40">
            {t("empty")}
          </p>
        ) : (
          displayed.map((comment) => (
            <article
              key={comment.id}
              className="rounded-2xl bg-white p-4 ring-1 ring-[var(--sand-dark)]/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ocean-light)] text-sm font-bold text-[var(--ocean)]">
                  {comment.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {comment.authorName}
                  </p>
                  <p className="text-[11px] text-[var(--ink-muted)]">
                    {formatDate(comment.createdAt, locale)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                {getLocalizedText(comment.body, locale)}
              </p>
            </article>
          ))
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-[var(--sand-dark)]/40">
        {isRegisteredUser ? (
          <form onSubmit={handleSubmit}>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("placeholder")}
              rows={3}
              className="w-full resize-none rounded-xl border-0 bg-[var(--sand)] p-3 text-sm text-[var(--ink)] outline-none ring-1 ring-[var(--sand-dark)]/60 focus:ring-2 focus:ring-[var(--ocean)]/30"
            />
            {postError && (
              <p className="mt-2 text-xs text-red-600">{postError}</p>
            )}
            <Button
              type="submit"
              size="sm"
              className="mt-3"
              disabled={!draft.trim() || posting}
            >
              <Send className="h-4 w-4" />
              {posting ? t("posting") : t("post")}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-3 py-2 text-center sm:flex-row sm:text-left">
            <p className="flex-1 text-sm text-[var(--ink-muted)]">
              {t("loginToPost")}
            </p>
            <Button asChild size="sm">
              <Link href="/login">{t("login")}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export { COMMENT_ADDED_EVENT };
