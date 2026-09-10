import Image from "next/image";
import { ArrowRight, Fish, MapPin, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ActivityCard } from "@/components/activities/activity-card";
import { ListingCard } from "@/components/marketplace/listing-card";
import { SpotCard } from "@/components/spots/spot-card";
import { Button } from "@/components/ui/button";
import { malaysiaStates } from "@/data/malaysia-states";
import {
  mockActivities,
  mockListings,
  mockSpots,
} from "@/data/mock-data";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const featuredSpots = mockSpots.filter((s) => s.featured).slice(0, 3);
  const upcomingActivities = mockActivities.filter((a) => a.promoted).slice(0, 2);
  const latestListings = mockListings.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1544551763-77ef2d0cfcb6?w=1600&q=80"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/90 via-teal-900/80 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Fish className="h-4 w-4 text-amber-400" />
              Malaysia · 16 States · 3 Languages
            </p>
            <h1
              className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              {t("heroTitle")}
            </h1>
            <p className="mt-4 text-lg text-teal-100/90 md:text-xl">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/spots">
                  {t("ctaExplore")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/post">{t("ctaPost")}</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 md:max-w-lg">
            {[
              { value: "1,200+", label: t("statsSpots"), icon: MapPin },
              { value: "8,500+", label: t("statsAnglers"), icon: Users },
              { value: "16", label: t("statsStates"), icon: Fish },
            ].map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm"
              >
                <Icon className="mb-2 h-5 w-5 text-amber-400" />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-teal-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("browseByState")}
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {malaysiaStates.slice(0, 10).map((state) => (
            <Link
              key={state.id}
              href={`/spots?state=${state.id}`}
              className="rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-800 transition hover:bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-200 dark:hover:bg-teal-900/40"
            >
              {getLocalizedText(state.name, locale)}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Spots */}
      <section className="bg-white py-12 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t("featuredSpots")}
            </h2>
            <Link
              href="/spots"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
          {t("upcomingActivities")}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {upcomingActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} locale={locale} />
          ))}
        </div>
      </section>

      {/* Marketplace */}
      <section className="bg-slate-100 py-12 dark:bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            {t("latestListings")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
