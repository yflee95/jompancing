import { setRequestLocale } from "next-intl/server";
import { ActivityDetailView } from "@/components/activities/activity-detail-view";
import type { Locale } from "@/i18n/routing";

interface ActivityDetailPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return <ActivityDetailView locale={locale} slug={slug} />;
}
