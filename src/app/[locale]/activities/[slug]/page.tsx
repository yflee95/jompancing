import { getTranslations, setRequestLocale } from "next-intl/server";
import { ActivityDetailView } from "@/components/activities/activity-detail-view";
import { getActivityBySlug } from "@/data/mock-data";
import { buildPageMetadata } from "@/lib/seo";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ActivityDetailPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateMetadata({ params }: ActivityDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "activities" });
  const activity = getActivityBySlug(slug);

  if (!activity) {
    return buildPageMetadata({
      locale,
      path: `/activities/${slug}`,
      title: t("title"),
      description: t("subtitle"),
    });
  }

  return buildPageMetadata({
    locale,
    path: `/activities/${slug}`,
    title: getLocalizedText(activity.title, locale),
    description: getLocalizedText(activity.description, locale),
    ogImage: activity.imageUrl,
    ogType: "article",
  });
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return <ActivityDetailView locale={locale} slug={slug} />;
}
