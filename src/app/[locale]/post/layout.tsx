import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "post" });
  return buildPageMetadata({
    locale,
    path: "/post",
    title: t("heroTitle"),
    description: t("heroSubtitle"),
    noIndex: true,
  });
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
