"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { PostSpotForm } from "@/components/spots/post-spot-form";
import type { WaterType } from "@/types";

const VALID_WATER_TYPES = new Set<WaterType>([
  "saltwater",
  "freshwater",
  "pond",
  "river",
]);

export default function PostPage() {
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const defaultWaterType =
    typeParam && VALID_WATER_TYPES.has(typeParam as WaterType)
      ? (typeParam as WaterType)
      : undefined;

  return (
    <div className="mx-auto max-w-xl px-4 py-6 pb-28">
      <PostSpotForm defaultWaterType={defaultWaterType} />
      <p className="mt-4 text-center text-xs text-[var(--ink-muted)]">
        {tCommon("anonymousPostHint")}
      </p>
    </div>
  );
}
