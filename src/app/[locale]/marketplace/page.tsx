import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { MarketplaceExplore } from "@/components/marketplace/marketplace-explore";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketplace" });
  return buildPageMetadata({
    locale,
    path: "/marketplace",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function MarketplacePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 py-6 pb-28 md:pb-8">
      <MarketplaceExplore locale={locale} />
    </div>
  );
}
