import { getTranslations, setRequestLocale } from "next-intl/server";
import { SpotCard } from "@/components/spots/spot-card";
import { SpotFilters } from "@/components/spots/spot-filters";
import { filterSpots } from "@/data/mock-data";
import type { Locale } from "@/i18n/routing";

interface SpotsPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ state?: string; district?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "spots" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function SpotsPage({
  params,
  searchParams,
}: SpotsPageProps) {
  const { locale } = await params;
  const { state, district } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("spots");

  const spots = filterSpots(state, district);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {t("subtitle")}
        </p>
      </div>

      <SpotFilters
        locale={locale}
        currentState={state}
        currentDistrict={district}
      />

      {spots.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
            {t("noSpots")}
          </p>
          <p className="mt-2 text-slate-500">{t("beFirst")}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
