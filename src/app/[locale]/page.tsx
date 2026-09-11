import { setRequestLocale } from "next-intl/server";
import { HomeExplore } from "@/components/home/home-explore";
import { loadPublicSpots } from "@/lib/public-spots";
import type { Locale } from "@/i18n/routing";

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
