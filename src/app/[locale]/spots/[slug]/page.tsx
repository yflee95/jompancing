import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SpotDetailActions } from "@/components/spots/spot-detail-actions";
import { Badge } from "@/components/ui/badge";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { getSpotBySlug } from "@/data/mock-data";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotDetailPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateMetadata({ params }: SpotDetailPageProps) {
  const { locale, slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) return { title: "Spot Not Found" };
  return {
    title: getLocalizedText(spot.title, locale),
    description: getLocalizedText(spot.description, locale),
  };
}

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("spots");

  const spot = getSpotBySlug(slug);
  if (!spot) notFound();

  const state = getStateById(spot.stateId);
  const district = getDistrictById(spot.stateId, spot.districtId);

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
        <Image
          src={spot.imageUrl}
          alt={getLocalizedText(spot.title, locale)}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap gap-2">
          {spot.featured && <Badge variant="featured">Featured</Badge>}
          <Badge>{t(spot.waterType as "saltwater" | "freshwater" | "pond" | "river")}</Badge>
        </div>

        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
          {getLocalizedText(spot.title, locale)}
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {state && getLocalizedText(state.name, locale)} ·{" "}
          {district && getLocalizedText(district.name, locale)} ·{" "}
          {t("postedBy")} {spot.authorName}
        </p>

        <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          {getLocalizedText(spot.description, locale)}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800/50">
            <p className="text-sm font-medium text-slate-500">{t("species")}</p>
            <p className="mt-1 font-semibold">{spot.species.join(", ")}</p>
          </div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800/50">
            <p className="text-sm font-medium text-slate-500">{t("bestTime")}</p>
            <p className="mt-1 font-semibold">
              {getLocalizedText(spot.bestTime, locale)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800/50">
            <p className="text-sm font-medium text-slate-500">{t("facilities")}</p>
            <p className="mt-1 font-semibold">{spot.facilities.join(", ")}</p>
          </div>
        </div>

        <div className="mt-8">
          <SpotDetailActions
            lat={spot.coordinates.lat}
            lng={spot.coordinates.lng}
            loginMessage={t("loginForDirections")}
            directionsLabel={t("directions")}
            commentsLabel={t("comments")}
            commentCount={spot.commentCount}
          />
        </div>
      </div>
    </article>
  );
}
