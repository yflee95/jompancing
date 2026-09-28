import { locales } from "@/i18n/routing";
import { absoluteUrl, localePath, SITE_NAME } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

interface WebsiteJsonLdProps {
  locale: Locale;
  description: string;
}

export function WebsiteJsonLd({ locale, description }: WebsiteJsonLdProps) {
  const siteUrl = absoluteUrl(localePath(locale));
  const logoUrl = absoluteUrl("/icon");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${absoluteUrl("")}#organization`,
        name: SITE_NAME,
        url: absoluteUrl(""),
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
        description,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: SITE_NAME,
        description,
        url: siteUrl,
        inLanguage: locales,
        publisher: { "@id": `${absoluteUrl("")}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: absoluteUrl(localePath(locale, "/search?q={search_term_string}")),
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
