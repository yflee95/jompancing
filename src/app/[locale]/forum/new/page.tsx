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
  const { user, isLoading } = useAuth();
  const { addPost } = useForum();
  const router = useRouter();
  const locale = useLocale() as Locale;

  const [category, setCategory] = useState<ForumCategory>("general");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--ocean)] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <LoginGate message={t("loginToPost")} />
      </div>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const post = addPost({
      title: title.trim(),
      body: body.trim(),
      category,
      authorName: user!.name,
      locale,
    });
    router.push(`/forum/${post.slug}`);
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

            <Button type="submit" className="w-full" size="lg" disabled={!title.trim() || !body.trim()}>
              {tCommon("submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
