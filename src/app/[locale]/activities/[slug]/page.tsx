import { getTranslations, setRequestLocale } from "next-intl/server";
import { ActivityDetailContent } from "@/components/activities/activity-detail-content";
import { ActivityDetailView } from "@/components/activities/activity-detail-view";
import { getActivityBySlug } from "@/data/mock-data";
import { buildPageMetadata } from "@/lib/seo";
import { fetchActivityBySlugFromDb } from "@/lib/supabase/activities-server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ActivityDetailPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

async function resolveActivity(slug: string) {
  const mockActivity = getActivityBySlug(slug);
  if (mockActivity) return mockActivity;

  if (!isSupabaseConfigured()) return null;

  try {
    return await fetchActivityBySlugFromDb(slug);
  } catch {
    return null;
  }
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
    });
  }

  return buildPageMetadata({
    locale,
    path: `/activities/${slug}`,
    title: getLocalizedText(activity.title, locale),
    description: getLocalizedText(activity.description, locale),
    ogImage: activity.imageUrl || undefined,
    ogType: "article",
  });
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const activity = await resolveActivity(slug);
  if (activity) {
    return <ActivityDetailContent activity={activity} locale={locale} />;
  }

  return <ActivityDetailView locale={locale} slug={slug} />;
}
