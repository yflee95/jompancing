import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeExplore } from "@/components/home/home-explore";
import { HomePageJsonLd } from "@/components/seo/home-page-json-ld";
import { HomeSeoHub } from "@/components/seo/home-seo-hub";
import { buildPageMetadata } from "@/lib/seo";
import { loadPublicSpots } from "@/lib/public-spots";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return buildPageMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("homeDescription"),
    titleAbsolute: true,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const spots = await loadPublicSpots();
  const t = await getTranslations({ locale, namespace: "metadata" });

  return (
    <>
      <HomePageJsonLd
        locale={locale}
        spots={spots}
        description={t("homeDescription")}
      />
      <HomeExplore spots={spots} />
      <HomeSeoHub locale={locale} spots={spots} />
    </>
  );
}
