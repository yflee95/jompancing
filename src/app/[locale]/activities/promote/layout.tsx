import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { FREE_PROMOTION_DAYS, PAID_PROMOTION_DAILY_RM } from "@/lib/promotion";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "activities" });
  return buildPageMetadata({
    locale,
    path: "/activities/promote",
    title: t("promote"),
    description: t("promotePageDesc", { days: FREE_PROMOTION_DAYS, price: PAID_PROMOTION_DAILY_RM }),
    noIndex: true,
  });
}

export default function PromoteActivityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
