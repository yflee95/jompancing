import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";

export const SITE_NAME = "Jompancing";
export const META_DESCRIPTION_MAX = 160;

export function truncateMetaDescription(
  text: string,
  max = META_DESCRIPTION_MAX,
): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

/** Strip simple markdown / newlines for meta descriptions. */
export function plainTextForMeta(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_>`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Default social preview — served by app/opengraph-image.tsx */
export const DEFAULT_OG_IMAGE_PATH = "/opengraph-image";

export function getSiteOrigin(): string {
  return SITE_URL.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteOrigin()}${normalized}`;
}

export function localePath(locale: Locale, path = ""): string {
  const suffix = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `/${locale}${suffix}`;
}

export function buildLanguageAlternates(path = ""): Record<string, string> {
  return {
    "x-default": localePath("ms", path),
    ...Object.fromEntries(
      locales.map((locale) => [locale, localePath(locale, path)]),
    ),
  };
}

interface PageMetadataInput {
  locale: Locale;
  /** Path after locale, e.g. `/spots` or `/spots/my-jetty` */
  path?: string;
  title: string;
  description: string;
  /** Absolute or site-relative image URL */
  ogImage?: string | null;
  noIndex?: boolean;
  ogType?: "website" | "article";
  /** Skip layout title template (e.g. when title already includes brand). */
  titleAbsolute?: boolean;
}

export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  ogImage,
  noIndex = false,
  ogType = "website",
  titleAbsolute = false,
}: PageMetadataInput): Metadata {
  const canonicalPath = localePath(locale, path);
  const metaDescription = truncateMetaDescription(
    plainTextForMeta(description),
  );
  const imageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : absoluteUrl(ogImage)
    : absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const alternateLocales = locales.filter((l) => l !== locale);

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description: metaDescription,
    alternates: {
      canonical: canonicalPath,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      title,
      description: metaDescription,
      url: absoluteUrl(canonicalPath),
      siteName: SITE_NAME,
      locale,
      alternateLocale: alternateLocales,
      type: ogType,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
  };
}

export function buildRootMetadata(
  locale: Locale,
  title: string,
  description: string,
): Metadata {
  return {
    metadataBase: new URL(getSiteOrigin()),
    ...buildPageMetadata({ locale, path: "", title, description }),
  };
}
