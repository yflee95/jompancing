import { getTranslations, setRequestLocale } from "next-intl/server";
import { ActivityDetailContent } from "@/components/activities/activity-detail-content";
import { ActivityDetailView } from "@/components/activities/activity-detail-view";
import { getActivityBySlug } from "@/data/mock-data";
import { shouldUseMockContent } from "@/lib/mock-content";
import { buildActivityDetailSeo } from "@/lib/content-seo";
import { buildPageMetadata } from "@/lib/seo";
import { fetchActivityBySlugFromDb } from "@/lib/supabase/activities-server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ActivityDetailPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

async function resolveActivity(slug: string) {
  if (isSupabaseConfigured()) {
    try {
      const dbActivity = await fetchActivityBySlugFromDb(slug);
      if (dbActivity) return dbActivity;
    } catch {
      /* fall through */
    }
  }

  if (shouldUseMockContent()) {
    return getActivityBySlug(slug) ?? null;
  }

  return null;
}

export async function generateMetadata({ params }: ActivityDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "activities" });
  const activity = await resolveActivity(slug);

  if (!activity) {
    return buildPageMetadata({
      locale,
      path: `/activities/${slug}`,
      title: t("notFound"),
      description: t("subtitle"),
      noIndex: true,
    });
  }

  const seo = buildActivityDetailSeo({
    title: getLocalizedText(activity.title, locale),
    description: getLocalizedText(activity.description, locale),
    venue: getLocalizedText(activity.venue, locale),
    t,
  });

  return buildPageMetadata({
    locale,
    path: `/activities/${slug}`,
    title: seo.title,
    description: seo.description,
    ogImage: activity.imageUrl || undefined,
    ogType: "article",
  });
}

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const activity = await resolveActivity(slug);
  if (!activity) {
    return <ActivityDetailView slug={slug} locale={locale} />;
  }

  return <ActivityDetailContent activity={activity} locale={locale} />;
}
