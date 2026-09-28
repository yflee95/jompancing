import { absoluteUrl, localePath, SITE_NAME } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

interface WebsiteJsonLdProps {
  locale: Locale;
  description: string;
}

export function WebsiteJsonLd({ locale, description }: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description,
    url: absoluteUrl(localePath(locale)),
    inLanguage: locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
