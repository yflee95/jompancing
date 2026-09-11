import { getTranslations } from "next-intl/server";
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
    path: "/marketplace/new",
    title: t("postListing"),
    description: t("subtitle"),
    noIndex: true,
  });
}

export default function NewListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
