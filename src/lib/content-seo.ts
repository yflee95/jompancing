import type { Locale } from "@/i18n/routing";
import { getSpotLocationLine } from "@/lib/spot-location";
import {
  plainTextForMeta,
  truncateMetaDescription,
} from "@/lib/seo";
import { getLocalizedText, type FishingSpot } from "@/types";

const MIN_RICH_BODY_CHARS = 72;

type ContentTranslate = (
  key: string,
  values?: Record<string, string | number>,
) => string;

function pickDescription(
  raw: string,
  rich: string,
  minChars = MIN_RICH_BODY_CHARS,
): string {
  const body = plainTextForMeta(raw);
  if (body.length >= minChars) {
    return truncateMetaDescription(body);
  }
  return truncateMetaDescription(rich);
}

export function buildGuideArticleSeo({
  title,
  excerpt,
  categoryLabel,
  t,
}: {
  title: string;
  excerpt: string;
  categoryLabel: string;
  t: ContentTranslate;
}): { title: string; description: string } {
  const name = title.trim();
  const raw = excerpt;
  return {
    title: t("seoArticleTitle", { title: name }),
    description: pickDescription(
      raw,
      t("seoArticleDescriptionRich", {
        title: name,
        category: categoryLabel,
        excerpt: plainTextForMeta(raw) || name,
      }),
    ),
  };
}

export function buildForumThreadSeo({
  title,
  body,
  t,
}: {
  title: string;
  body: string;
  t: ContentTranslate;
}): { title: string; description: string } {
  const name = title.trim();
  const raw = plainTextForMeta(body);
  return {
    title: t("seoThreadTitle", { title: name }),
    description: pickDescription(
      raw,
      t("seoThreadDescriptionRich", {
        title: name,
        excerpt: raw.slice(0, 120) || name,
      }),
      48,
    ),
  };
}

export function buildActivityDetailSeo({
  title,
  description,
  venue,
  t,
}: {
  title: string;
  description: string;
  venue: string;
  t: ContentTranslate;
}): { title: string; description: string } {
  const name = title.trim();
  const raw = plainTextForMeta(description);
  return {
    title: t("seoActivityTitle", { title: name }),
    description: pickDescription(
      raw,
      t("seoActivityDescriptionRich", {
        title: name,
        venue: venue.trim() || name,
        excerpt: raw.slice(0, 100) || name,
      }),
    ),
  };
}

export function buildMarketplaceListingSeo({
  title,
  description,
  priceLabel,
  t,
}: {
  title: string;
  description: string;
  priceLabel: string;
  t: ContentTranslate;
}): { title: string; description: string } {
  const name = title.trim();
  const raw = plainTextForMeta(description);
  return {
    title: t("seoListingTitle", { title: name }),
    description: pickDescription(
      raw,
      t("seoListingDescriptionRich", {
        title: name,
        price: priceLabel,
        excerpt: raw.slice(0, 100) || name,
      }),
    ),
  };
}

/** Home / hub ItemList — top public spots for crawl paths. */
export function pickSpotsForSeoHub(
  spots: FishingSpot[],
  limit = 16,
): FishingSpot[] {
  return [...spots]
    .filter((s) => s.visibility === "public")
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.commentCount - a.commentCount;
    })
    .slice(0, limit);
}

export function spotSeoHubLabel(spot: FishingSpot, locale: Locale): string {
  const title = getLocalizedText(spot.title, locale);
  const location = getSpotLocationLine(spot, locale);
  return location ? `${title} — ${location}` : title;
}
