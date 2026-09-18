import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSessionAdminEmail } from "@/lib/admin";
import { SpotDetailView } from "@/components/spots/spot-detail-view";
import { UserSpotDetail } from "@/components/spots/user-spot-detail";
import { buildPageMetadata } from "@/lib/seo";
import { fetchCommentsForThreadServer } from "@/lib/supabase/comments";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchSpotBySlugFromDb } from "@/lib/supabase/spots-server";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotDetailPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

async function resolveSpot(slug: string) {
  if (!isSupabaseConfigured()) return null;
  try {
    return await fetchSpotBySlugFromDb(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: SpotDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "spots" });
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

  return buildPageMetadata({
    locale,
    path: `/spots/${slug}`,
    title: getLocalizedText(spot.title, locale),
    description: getLocalizedText(spot.description, locale),
    ogImage: spot.imageUrl || undefined,
    ogType: "article",
  });
}

export default async function SpotDetailPage({ params }: SpotDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

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
