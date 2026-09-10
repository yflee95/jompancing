import { Megaphone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ActivityCard } from "@/components/activities/activity-card";
import { Button } from "@/components/ui/button";
import { mockActivities } from "@/data/mock-data";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "activities" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("activities");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>
        <Button>
          <Megaphone className="h-4 w-4" />
          {t("promote")}
        </Button>
      </div>

      <div className="mb-8 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 dark:border-amber-800/50 dark:from-amber-950/30 dark:to-orange-950/20">
        <h2 className="font-semibold text-amber-900 dark:text-amber-200">
          {t("promote")}
        </h2>
        <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-300/80">
          {t("promoteDesc")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} locale={locale} />
        ))}
      </div>
    </div>
  );
}
