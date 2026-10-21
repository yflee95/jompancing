import { getTranslations, setRequestLocale } from "next-intl/server";
import { FishCatalog } from "@/components/fish/fish-catalog";
import { FISH_SPECIES } from "@/data/fish-catalog";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fish" });
  return buildPageMetadata({ locale, path: "/fish", title: t("seoTitle"), description: t("seoDescription") });
}

export default async function FishIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("fish");
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: t("title"), numberOfItems: FISH_SPECIES.length, itemListElement: FISH_SPECIES.map((fish, index) => ({ "@type": "ListItem", position: index + 1, name: fish.name[locale], url: `https://www.jompancing.my/${locale}/fish/${fish.slug}` })) };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }} />
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <header className="mb-6 max-w-3xl">
        <h1 className="mt-2 font-serif-display text-3xl font-bold text-[var(--ink)] md:text-4xl">{t("title")}</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">{t("subtitle")}</p>
      </header>
      <FishCatalog />
    </main>
  </>;
}
