import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSessionAdminEmail } from "@/lib/admin";
import { SpotDetailView } from "@/components/spots/spot-detail-view";
import { UserSpotDetail } from "@/components/spots/user-spot-detail";
import { SpotsRegionShell } from "@/components/spots/spots-region-shell";
import { getStateBySlug, malaysiaStates } from "@/data/malaysia-states";
import { buildPageMetadata } from "@/lib/seo";
import { loadPublicSpots } from "@/lib/public-spots";
import { filterSpotsByRegion } from "@/lib/spot-location";
import { fetchCommentsForThreadServer } from "@/lib/supabase/comments";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchSpotBySlugFromDb } from "@/lib/supabase/spots-server";
import { buildSpotDetailSeo, getSpotsSeoCopy } from "@/lib/spots-seo";
import { parseWaterTypeParam } from "@/lib/water-types";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotDetailPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams: Promise<{ district?: string; area?: string; water?: string }>;
}

async function resolveSpot(slug: string) {
  if (!isSupabaseConfigured()) return null;
  try {
    return await fetchSpotBySlugFromDb(slug);
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return malaysiaStates.map((state) => ({ slug: state.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: SpotDetailPageProps) {
  const { locale, slug } = await params;
  const { district, area, water } = await searchParams;
  const t = await getTranslations({ locale, namespace: "spots" });

  const state = getStateBySlug(slug);
  if (state) {
    const filters = {
      stateId: state.id,
      districtId: district,
      areaId: area,
      water: parseWaterTypeParam(water),
    };
    const spots = await loadPublicSpots();
    let list = filterSpotsByRegion(spots, state.id, district, area);
    if (filters.water) {
      list = list.filter((spot) => spot.waterType === filters.water);
    }
    const copy = getSpotsSeoCopy({
      locale,
      t,
      filters,
      spotCount: list.length,
    });
    return buildPageMetadata({
      locale,
      path: copy.path,
      title: copy.title,
      description: copy.description,
    });
  }

  const spot = await resolveSpot(slug);

  if (!spot || spot.visibility === "private") {
    return buildPageMetadata({
      locale,
      path: `/spots/${slug}`,
      title: spot ? t("privateSpot") : t("notFound"),
      description: t("subtitle"),
      noIndex: true,
    });
  }

  const seo = buildSpotDetailSeo({ spot, locale, t });

  return buildPageMetadata({
    locale,
    path: `/spots/${slug}`,
    title: seo.title,
    description: seo.description,
    ogImage: spot.imageUrl || undefined,
    ogType: "article",
  });
}

export default async function SpotDetailPage({
  params,
  searchParams,
}: SpotDetailPageProps) {
  const { locale, slug } = await params;
  const { district, area, water } = await searchParams;
  setRequestLocale(locale);

  const state = getStateBySlug(slug);
  if (state) {
    return (
      <SpotsRegionShell
        locale={locale}
        filters={{
          stateId: state.id,
          districtId: district,
          areaId: area,
          water: parseWaterTypeParam(water),
        }}
      />
    );
  }

  if (isSupabaseConfigured()) {
    try {
      const dbSpot = await resolveSpot(slug);
      if (dbSpot) {
        if (dbSpot.visibility === "private") {
          return <UserSpotDetail slug={slug} locale={locale} />;
        }

        let dbComments: Awaited<ReturnType<typeof fetchCommentsForThreadServer>> =
          [];
        try {
          dbComments = await fetchCommentsForThreadServer("spot", dbSpot.id);
        } catch {
          /* empty comments */
        }

        const showAdminDelete = !!(await getSessionAdminEmail());

        return (
          <SpotDetailView
            spot={dbSpot}
            comments={dbComments}
            locale={locale}
            showAdminDelete={showAdminDelete}
          />
        );
      }
    } catch {
      /* fall through to client fallback */
    }
  }

  return <UserSpotDetail slug={slug} locale={locale} />;
}
