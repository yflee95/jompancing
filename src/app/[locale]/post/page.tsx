"use client";

import { useTranslations } from "next-intl";
import { PostSpotForm } from "@/components/spots/post-spot-form";

export default function PostPage() {
  const tCommon = useTranslations("common");

  return (
    <div className="mx-auto max-w-xl px-4 py-6 pb-28">
      <PostSpotForm />
      <p className="mt-4 text-center text-xs text-[var(--ink-muted)]">
        {tCommon("anonymousPostHint")}
      </p>
    </div>
  );
}
