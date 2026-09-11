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
    path: "/marketplace/edit",
    title: t("editListingTitle"),
    description: t("editListingHint"),
    noIndex: true,
  });
}

export default function EditListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
