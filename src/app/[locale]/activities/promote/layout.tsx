import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
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
    description: t("promotePageDesc"),
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
