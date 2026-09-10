import Image from "next/image";
import { Clock } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { mockArticles } from "@/data/mock-data";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guide" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guide");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden">
            <div className="relative aspect-[16/10]">
              <Image
                src={article.imageUrl}
                alt={getLocalizedText(article.title, locale)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-5">
              <Badge className="mb-3">
                {t(`categories.${article.category}` as "categories.tips")}
              </Badge>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {getLocalizedText(article.title, locale)}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                {getLocalizedText(article.excerpt, locale)}
              </p>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {article.readMinutes} min · {t("readMore")}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
