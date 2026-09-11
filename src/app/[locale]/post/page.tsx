import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostSpotForm } from "@/components/spots/post-spot-form";
import type { Locale } from "@/i18n/routing";
import type { WaterType } from "@/types";

const VALID_WATER_TYPES = new Set<WaterType>([
  "saltwater",
  "freshwater",
  "pond",
  "river",
]);

interface PostPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function PostPage({ params, searchParams }: PostPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { type: typeParam } = await searchParams;
  const defaultWaterType =
    typeParam && VALID_WATER_TYPES.has(typeParam as WaterType)
      ? (typeParam as WaterType)
      : undefined;

  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="mx-auto max-w-xl px-4 py-6 pb-28">
      <PostSpotForm defaultWaterType={defaultWaterType} />
      <p className="mt-4 text-center text-xs text-[var(--ink-muted)]">
        {tCommon("anonymousPostHint")}
      </p>
    </div>
  );
}
