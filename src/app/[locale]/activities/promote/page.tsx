import { getTranslations, setRequestLocale } from "next-intl/server";
import { PromoteActivityForm } from "@/components/activities/promote-activity-form";
import type { Locale } from "@/i18n/routing";

export default async function PromoteActivityPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("activities");

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24 md:pb-10">
      <div className="mb-6">
        <h1 className="font-serif-display text-2xl font-bold text-[var(--ink)] md:text-3xl">
          {t("promote")}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--ink-muted)] md:text-base">
          {t("promotePageDesc")}
        </p>
      </div>
      <PromoteActivityForm />
    </div>
  );
}
