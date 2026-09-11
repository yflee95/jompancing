import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ActivitiesExplore } from "@/components/activities/activities-explore";
import type { ActivitySort } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ActivitiesPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ state?: string; district?: string; sort?: ActivitySort }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "activities" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ActivitiesPage({
  params,
  searchParams,
}: ActivitiesPageProps) {
  const { locale } = await params;
  const { state, district, sort = "hot" } = await searchParams;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-8">
      <ActivitiesExplore
        locale={locale}
        currentState={state}
        currentDistrict={district}
        currentSort={sort}
      />
    </div>
  );
}
