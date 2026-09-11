import { ArrowLeft, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getLocalizedText, type GuideArticle } from "@/types";
import type { Locale } from "@/i18n/routing";

interface GuideArticleContentProps {
  article: GuideArticle;
  locale: Locale;
}

export async function GuideArticleContent({
  article,
  locale,
}: GuideArticleContentProps) {
  const t = await getTranslations({ locale, namespace: "guide" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const title = getLocalizedText(article.title, locale);
  const body = getLocalizedText(article.body, locale);
  const paragraphs = body.split(/\n\n+/).filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-4 py-6 pb-24">
      <Link
        href="/guide"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ocean)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToGuide")}
      </Link>

      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
        <AppImage
          src={article.imageUrl}
          alt={title}
          sizes="(max-width: 768px) 100vw, 768px"
          placeholderVariant="wide"
          placeholderLabel={tCommon("photoUnavailable")}
          className="absolute inset-0"
        />
      </div>

      <div className="mt-6">
        <Badge>{t(`categories.${article.category}` as "categories.tips")}</Badge>
        <h1 className="font-serif-display mt-3 text-3xl font-bold text-[var(--ink)]">
          {title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--ink-muted)]">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {article.readMinutes} min
          </span>
          <span>{formatDate(article.publishedAt, locale)}</span>
        </div>

        <div className="prose prose-neutral mt-8 max-w-none">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="mb-4 text-base leading-relaxed text-[var(--ink-muted)] last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
