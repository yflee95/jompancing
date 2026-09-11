import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "spots" });
  return buildPageMetadata({
    locale,
    path: "/spots/edit",
    title: t("editSpotTitle"),
    description: t("editSpotHint"),
    noIndex: true,
  });
}

export default function EditSpotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
