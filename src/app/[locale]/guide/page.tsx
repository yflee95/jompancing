import { Clock } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mockArticles } from "@/data/mock-data";
import { buildPageMetadata } from "@/lib/seo";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guide" });
  return buildPageMetadata({
    locale,
    path: "/guide",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guide");
  const tCommon = await getTranslations("common");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="font-serif-display mb-6 text-2xl font-bold text-[var(--ink)]">
        {t("title")}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockArticles.map((article) => (
          <Card key={article.id} className="transition hover:-translate-y-0.5">
            <div className="relative aspect-[16/10] overflow-hidden">
              <AppImage
                src={article.imageUrl}
                alt={getLocalizedText(article.title, locale)}
                sizes="(max-width: 768px) 100vw, 33vw"
                placeholderVariant="wide"
                placeholderLabel={tCommon("photoUnavailable")}
                className="absolute inset-0"
              />
            </div>
            <div className="p-4">
              <Badge className="mb-2">
                {t(`categories.${article.category}` as "categories.tips")}
              </Badge>
              <h2 className="font-serif-display line-clamp-2 text-base font-semibold text-[var(--ink)]">
                {getLocalizedText(article.title, locale)}
              </h2>
              <p className="mt-2 flex items-center gap-1 text-xs text-[var(--ink-muted)]">
                <Clock className="h-3 w-3" />
                {article.readMinutes} min
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
