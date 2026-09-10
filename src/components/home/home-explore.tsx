"use client";



import { useCallback, useEffect, useMemo, useState } from "react";

import {

  ChevronRight,

  Compass,

  Flame,

  MapPin,

  MessageCircle,

  Navigation,

  Sparkles,

  Waves,

} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import {

  getPublicUserSpots,

  useUserSpots,

} from "@/components/providers/spots-provider";

import { HomeDiscoverGrid } from "@/components/home/home-discover-grid";
import { HomeActivityRailCard } from "@/components/home/home-activity-rail-card";

import { HomeRailSection } from "@/components/home/home-rail-section";

import { HomeSpotRailCard } from "@/components/home/home-spot-rail-card";

import { getDistrictById, getStateById } from "@/data/malaysia-states";

import {

  DEFAULT_LOCATION,

  formatDistance,

  getDistanceKm,

} from "@/lib/geo";

import { AppImage } from "@/components/ui/app-image";

import { cn } from "@/lib/utils";

import { mockArticles, mockForumPosts } from "@/data/mock-data";

import {

  getLocalizedText,

  type Activity,

  type FishingSpot,

  type MarketplaceListing,

  type WaterType,

} from "@/types";

import type { Locale } from "@/i18n/routing";



type SpotWithDistance = FishingSpot & { distanceKm: number };



interface HomeExploreProps {

  spots: FishingSpot[];

  activities: Activity[];

  listings: MarketplaceListing[];

}



const CATEGORIES: { id: WaterType | "all"; icon: typeof Waves }[] = [

  { id: "all", icon: Sparkles },

  { id: "saltwater", icon: Waves },

  { id: "pond", icon: MapPin },

  { id: "river", icon: Compass },

];



const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;



export function HomeExplore({ spots, activities, listings }: HomeExploreProps) {

  const t = useTranslations("home");

  const tSpots = useTranslations("spots");

  const tCommon = useTranslations("common");

  const locale = useLocale() as Locale;

  const { userSpots } = useUserSpots();



  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);

  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  const [locating, setLocating] = useState(true);

  const [heroIndex, setHeroIndex] = useState(0);

  const [activeCategory, setActiveCategory] = useState<WaterType | "all">("all");



  useEffect(() => {

    if (!navigator.geolocation) {

      setLocating(false);

      return;

    }



    navigator.geolocation.getCurrentPosition(

      (pos) => {

        setUserLocation({

          lat: pos.coords.latitude,

          lng: pos.coords.longitude,

        });

        setLocationLabel(t("yourLocation"));

        setLocating(false);

      },

      () => {

        setLocationLabel(t("defaultLocation"));

        setLocating(false);

      },

      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },

    );

  }, [t]);



  const allPublicSpots = useMemo(() => {

    const publicUser = getPublicUserSpots(userSpots);

    const seen = new Set<string>();

    return [...publicUser, ...spots].filter((s) => {

      if (seen.has(s.id)) return false;

      seen.add(s.id);

      return s.visibility === "public";

    });

  }, [spots, userSpots]);



  const spotsWithDistance = useMemo<SpotWithDistance[]>(

    () =>

      allPublicSpots

        .map((spot) => ({

          ...spot,

          distanceKm: getDistanceKm(userLocation, spot.coordinates),

        }))

        .sort((a, b) => a.distanceKm - b.distanceKm),

    [allPublicSpots, userLocation],

  );



  const featuredSpots = useMemo(

    () => allPublicSpots.filter((s) => s.featured),

    [allPublicSpots],

  );



  const heroSpots = featuredSpots.length > 0 ? featuredSpots : allPublicSpots.slice(0, 3);

  const heroSpot = heroSpots[heroIndex % heroSpots.length] ?? heroSpots[0];



  const categoryFilteredSpots =

    activeCategory === "all"

      ? spotsWithDistance

      : spotsWithDistance.filter((s) => s.waterType === activeCategory);



  const nearbySpots = categoryFilteredSpots.slice(0, 8);

  const nearbyCount = spotsWithDistance.filter((s) => s.distanceKm < 80).length;

  const activeHeroIndex = heroIndex % heroSpots.length;



  const homeActivities = useMemo(

    () =>

      [...activities]

        .sort((a, b) => {

          if (a.promoted !== b.promoted) return a.promoted ? -1 : 1;

          return (

            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()

          );

        })

        .slice(0, 6),

    [activities],

  );



  const latestSpots = useMemo(

    () =>

      [...allPublicSpots]

        .sort(

          (a, b) =>

            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),

        )

        .slice(0, 8),

    [allPublicSpots],

  );



  const isRecentSpot = useCallback((spot: FishingSpot) => {

    return Date.now() - new Date(spot.createdAt).getTime() < SEVEN_DAYS_MS;

  }, []);



  useEffect(() => {

    if (heroSpots.length <= 1) return;

    const timer = setInterval(() => {

      setHeroIndex((i) => (i + 1) % heroSpots.length);

    }, 5500);

    return () => clearInterval(timer);

  }, [heroSpots.length]);



  const getLocationText = useCallback(

    (spot: FishingSpot) => {

      const state = getStateById(spot.stateId);

      const district = getDistrictById(spot.stateId, spot.districtId);

      if (district) return getLocalizedText(district.name, locale);

      if (state) return getLocalizedText(state.name, locale);

      return "";

    },

    [locale],

  );



  if (!heroSpot || allPublicSpots.length === 0) return null;



  return (

    <div className="-mt-14 bg-[var(--sand)]">

      {/* Featured hero */}

      <section className="relative h-[72vh] min-h-[480px] max-h-[720px] w-full overflow-hidden">

        {heroSpots.map((spot, i) => (

          <div

            key={spot.id}

            className={cn(

              "absolute inset-0 transition-opacity duration-700",

              i === activeHeroIndex

                ? "opacity-100"

                : "pointer-events-none opacity-0",

            )}

          >

            <AppImage

              src={spot.imageUrl}

              alt={getLocalizedText(spot.title, locale)}

              priority={i === 0}

              sizes="100vw"

              placeholderVariant="hero"

              placeholderLabel={tCommon("photoUnavailable")}

              className="absolute inset-0"

              imageClassName={

                i === activeHeroIndex ? "hero-ken-burns" : undefined

              }

            />

          </div>

        ))}



        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510]/90 via-[#1a1510]/30 to-[#1a1510]/10" />



        <div className="absolute left-4 top-[4.5rem] z-10 md:left-6 md:top-20">

          <div className="flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md">

            <Navigation

              className={cn("h-3.5 w-3.5", locating && "animate-pulse")}

            />

            {locating

              ? t("findingLocation")

              : `${locationLabel ?? tCommon("nearYou")} · ${t("spotsNearby", { count: nearbyCount })}`}

          </div>

        </div>



        <div className="absolute inset-x-0 bottom-0 z-10 p-5 pb-10 pb-safe md:p-8">

          <div className="mx-auto max-w-6xl">

            <span className="badge-accent inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">

              <Flame className="h-3 w-3" />

              {tCommon("featured")}

            </span>

            <h1 className="font-serif-display mt-3 max-w-lg text-3xl font-bold leading-[1.1] text-white md:text-5xl">

              {getLocalizedText(heroSpot.title, locale)}

            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">

              <span className="flex items-center gap-1 text-sm text-white/85">

                <MapPin className="h-3.5 w-3.5" />

                {getLocationText(heroSpot)}

                <span className="text-white/40">·</span>

                {formatDistance(

                  getDistanceKm(userLocation, heroSpot.coordinates),

                )}

              </span>

              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">

                {tSpots(heroSpot.waterType as "saltwater" | "freshwater" | "pond" | "river")}

              </span>

              <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">

                <MessageCircle className="h-3 w-3" />

                {heroSpot.commentCount}

              </span>

            </div>

            <Link

              href={`/spots/${heroSpot.slug}`}

              className="tap-card mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--ink)] shadow-xl hover:shadow-2xl"

            >

              {t("ctaExplore")}

              <ChevronRight className="h-4 w-4" />

            </Link>

          </div>



          {heroSpots.length > 1 && (

            <div className="mx-auto mt-6 flex max-w-6xl gap-1.5">

              {heroSpots.map((spot, i) => (

                <button

                  key={spot.id}

                  type="button"

                  aria-label={getLocalizedText(spot.title, locale)}

                  onClick={() => setHeroIndex(i)}

                  className={cn(

                    "h-1.5 flex-1 rounded-full transition-all",

                    i === activeHeroIndex

                      ? "bg-white"

                      : "bg-white/35 hover:bg-white/55",

                  )}

                />

              ))}

            </div>

          )}

        </div>

      </section>



      {/* Category filter */}

      <div className="sticky top-14 z-30 border-b border-[var(--sand-dark)]/40 bg-[var(--sand)]/95 backdrop-blur-lg">

        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 scrollbar-none">

          {CATEGORIES.map(({ id, icon: Icon }) => (

            <button

              key={id}

              type="button"

              onClick={() => setActiveCategory(id)}

              className={cn(

                "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",

                activeCategory === id

                  ? "bg-[var(--ocean)] text-white shadow-md shadow-[var(--ocean-glow)]"

                  : "bg-white text-[var(--ink-muted)] hover:bg-white/80",

              )}

            >

              <Icon className="h-3.5 w-3.5" />

              {id === "all" ? t("allSpots") : tSpots(id)}

            </button>

          ))}

        </div>

      </div>



      {/* Near you — horizontal rail */}

      <HomeRailSection

        title={tCommon("nearYou")}

        href="/spots"

        linkLabel={tCommon("viewAll")}

      >

        {nearbySpots.length === 0 ? (

          <p className="w-full rounded-2xl bg-white p-6 text-center text-sm text-[var(--ink-muted)]">

            {tSpots("noSpots")}

          </p>

        ) : (

          nearbySpots.map((spot) => (

            <HomeSpotRailCard

              key={spot.id}

              spot={spot}

              locale={locale}

              distanceKm={spot.distanceKm}

            />

          ))

        )}

      </HomeRailSection>



      {/* Hot activities — horizontal rail */}

      {homeActivities.length > 0 && (

        <HomeRailSection

          title={t("upcomingActivities")}

          href="/activities"

          linkLabel={tCommon("viewAll")}

          className="border-t border-[var(--sand-dark)]/25 bg-white/40"

        >

          {homeActivities.map((activity) => (

            <HomeActivityRailCard

              key={activity.id}

              activity={activity}

              locale={locale}

            />

          ))}

        </HomeRailSection>

      )}



      {/* Latest community shares — horizontal rail */}

      {latestSpots.length > 0 && (

        <HomeRailSection

          title={t("communityLatest")}

          href="/spots"

          linkLabel={tCommon("viewAll")}

        >

          {latestSpots.map((spot) => (

            <HomeSpotRailCard

              key={spot.id}

              spot={spot}

              locale={locale}

              showNew={isRecentSpot(spot)}

              showAuthor

            />

          ))}

        </HomeRailSection>

      )}



      <HomeDiscoverGrid
        title={t("discover")}
        labels={{
          forum: t("quickForum"),
          map: t("quickMap"),
          shop: t("quickShop"),
          guide: t("quickGuide"),
        }}
        counts={{
          forum: mockForumPosts.length,
          map: allPublicSpots.length,
          shop: listings.length,
          guide: mockArticles.length,
        }}
      />

    </div>

  );

}

