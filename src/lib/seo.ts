import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";

export const SITE_NAME = "Jompancing";

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
  return Object.fromEntries(
    locales.map((locale) => [locale, localePath(locale, path)]),
  );
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
}

export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  ogImage,
  noIndex = false,
  ogType = "website",
}: PageMetadataInput): Metadata {
  const canonicalPath = localePath(locale, path);
  const imageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : absoluteUrl(ogImage)
    : absoluteUrl(DEFAULT_OG_IMAGE_PATH);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      siteName: SITE_NAME,
      locale,
      type: ogType,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
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
