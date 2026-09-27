import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeExplore } from "@/components/home/home-explore";
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

  return <HomeExplore spots={spots} />;
}
