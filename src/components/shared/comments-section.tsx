"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { formatDate, cn } from "@/lib/utils";
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
  comments: CommentItem[];
  locale: Locale;
  title?: string;
  id?: string;
  className?: string;
}

const STORAGE_PREFIX = "jompancing_comments_";

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

  useEffect(() => {
    setUserComments(loadStoredComments(threadId));
    setHydrated(true);
  }, [threadId]);

  const displayed = useMemo(
    () => mergeComments(comments, userComments),
    [comments, userComments],
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !isRegisteredUser || !user) return;

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
    setDraft("");
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
          <div className="flex h-20 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--ocean)] border-t-transparent" />
          </div>
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
            <Button type="submit" size="sm" className="mt-3" disabled={!draft.trim()}>
              <Send className="h-4 w-4" />
              {t("post")}
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
