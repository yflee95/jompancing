import { setRequestLocale } from "next-intl/server";
import { HomeExplore } from "@/components/home/home-explore";
import {
  mockActivities,
  mockListings,
  mockSpots,
} from "@/data/mock-data";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <HomeExplore
      spots={mockSpots}
      activities={mockActivities}
      listings={mockListings}
    />
  );
}
