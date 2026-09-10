import { getTranslations, setRequestLocale } from "next-intl/server";

import { SpotsExplore } from "@/components/spots/spots-explore";

import { mockSpots } from "@/data/mock-data";

import type { Locale } from "@/i18n/routing";



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

}: {

  params: Promise<{ locale: Locale }>;

  searchParams: Promise<{ state?: string; district?: string; area?: string }>;

}) {

  const { locale } = await params;

  const { state, district, area } = await searchParams;

  setRequestLocale(locale);



  return (

    <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-8">

      <SpotsExplore

        initialSpots={mockSpots}

        locale={locale}

        filterState={state}

        filterDistrict={district}

        filterArea={area}

      />

    </div>

  );

}

