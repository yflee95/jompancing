import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FishDetail } from "@/components/fish/fish-detail";
import { FISH_SPECIES, getFishBySlug } from "@/data/fish-catalog";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

interface FishPageProps { params: Promise<{ locale: Locale; slug: string }> }

export function generateStaticParams() {
  return FISH_SPECIES.map((fish) => ({ slug: fish.slug }));
}

export async function generateMetadata({ params }: FishPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "fish" });
  const fish = getFishBySlug(slug);
  if (!fish) return buildPageMetadata({ locale, path: `/fish/${slug}`, title: t("seoTitle"), description: t("seoDescription"), noIndex: true });
  return buildPageMetadata({ locale, path: `/fish/${slug}`, title: `${fish.name[locale]} — ${t("title")}`, description: fish.overview[locale], ogImage: fish.photo.src });
}

export default async function FishSpeciesPage({ params }: FishPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const fish = getFishBySlug(slug);
  if (!fish) notFound();
  const t = await getTranslations("fish");
  const detail = t.raw("detail") as { wildDiet: string; baitTips: string; lureTips: string; starterRig: string; habitat: string; method: string; source: string; photo: string; noteTitle: string; note: string; browseSpots: string; back: string };
  const labels = { ...detail, styles: { bait: t("styles.bait"), lure: t("styles.lure"), both: t("styles.both") }, habitats: { freshwater: t("habitats.freshwater"), river: t("habitats.river"), brackish: t("habitats.brackish"), sea: t("habitats.sea") } };
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: fish.name[locale], about: fish.latinName, description: fish.overview[locale], image: `https://www.jompancing.my${fish.photo.src}`, author: { "@type": "Organization", name: "Jompancing" }, citation: fish.sourceUrl };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <FishDetail fish={fish} locale={locale} labels={labels} />
  </>;
}
