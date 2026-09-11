import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "forum" });
  return buildPageMetadata({
    locale,
    path: "/forum/new",
    title: t("newTopic"),
    description: t("subtitle"),
    noIndex: true,
  });
}

export default function NewForumTopicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
