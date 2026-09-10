import { getTranslations, setRequestLocale } from "next-intl/server";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Button } from "@/components/ui/button";
import { mockListings } from "@/data/mock-data";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketplace" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function MarketplacePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("marketplace");

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
        <Button variant="outline">{t("postListing")}</Button>
      </div>

      <p className="mb-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
        {t("codDisclaimer")}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} locale={locale} />
        ))}
      </div>
    </div>
  );
}
