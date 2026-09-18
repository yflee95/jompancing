import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { absoluteUrl, localePath } from "@/lib/seo";
import {
  getActivitySlugs,
  getForumSlugs,
  getGuideSlugs,
  getMarketplaceSlugs,
  getPublicSpotSlugs,
  PUBLIC_STATIC_PATHS,
} from "@/lib/sitemap-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const spotSlugs = await getPublicSpotSlugs();
  const forumSlugs = await getForumSlugs();
  const activitySlugs = await getActivitySlugs();
  const marketplaceSlugs = await getMarketplaceSlugs();
  const guideSlugs = await getGuideSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of PUBLIC_STATIC_PATHS) {
      entries.push({
        url: absoluteUrl(localePath(locale, path)),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const spot of spotSlugs) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/spots/${spot.slug}`)),
        lastModified: spot.lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const post of forumSlugs) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/forum/${post.slug}`)),
        lastModified: post.lastModified,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const activity of activitySlugs) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/activities/${activity.slug}`)),
        lastModified: activity.lastModified,
        changeFrequency: "weekly",
        priority: 0.65,
      });
    }

    for (const listing of marketplaceSlugs) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/marketplace/${listing.slug}`)),
        lastModified: listing.lastModified,
        changeFrequency: "weekly",
        priority: 0.65,
      });
    }

    for (const article of guideSlugs) {
      entries.push({
        url: absoluteUrl(localePath(locale, `/guide/${article.slug}`)),
        lastModified: article.lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
