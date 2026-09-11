"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useForum } from "@/components/providers/forum-provider";
import { LoginGate } from "@/components/shared/login-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { ForumCategory } from "@/types";
import type { Locale } from "@/i18n/routing";

const CATEGORIES: ForumCategory[] = [
  "spots",
  "techniques",
  "bait",
  "hooks",
  "fish",
  "ornamental",
  "general",
];

export default function NewForumTopicPage() {
  const t = useTranslations("forum");
  const tCommon = useTranslations("common");
  const { user, isRegisteredUser, isLoading } = useAuth();
  const { addPost } = useForum();
  const router = useRouter();
  const locale = useLocale() as Locale;

  const [category, setCategory] = useState<ForumCategory>("general");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--ocean)] border-t-transparent" />
      </div>
    );
  }

  if (!isRegisteredUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <LoginGate message={t("loginToPost")} />
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const post = await addPost({
        title: title.trim(),
        body: body.trim(),
        category,
        authorId: user!.id,
        authorName: user!.name,
        locale,
      });
      router.push(`/forum/${post.slug}`);
    } catch {
      setSubmitError(t("postFailed"));
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>{t("newTopic")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">{t("category")}</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ForumCategory)}
                className="h-11 w-full rounded-2xl border-0 bg-[var(--sand)] px-4 text-sm ring-1 ring-[var(--sand-dark)]/60 outline-none focus:ring-2 focus:ring-[var(--ocean)]/30"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(`categories.${cat}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title">{t("topicTitle")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("topicTitlePlaceholder")}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="body">{t("topicBody")}</Label>
              <Textarea
                id="body"
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={t("topicBodyPlaceholder")}
                required
              />
            </div>

            {submitError && (
              <p className="text-sm text-red-600">{submitError}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!title.trim() || !body.trim() || submitting}
            >
              {submitting ? tCommon("submitting") : tCommon("submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
