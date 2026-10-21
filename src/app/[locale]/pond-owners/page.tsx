import { getTranslations, setRequestLocale } from "next-intl/server";
import { PondClaimForm } from "@/components/spots/pond-claim-form";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "spots" });
  return buildPageMetadata({
    locale,
    path: "/pond-owners",
    title: t("pondOwnerPageTitle"),
    description: t("pondOwnerPageIntro"),
  });
}

export default async function PondOwnersPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("spots");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-24">
      <div className="rounded-3xl bg-gradient-to-br from-[var(--ocean)] via-[#1a7580] to-[var(--ocean-dark)] p-6 text-white shadow-lg sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Jompancing</p>
        <h1 className="font-serif-display mt-2 text-3xl font-bold leading-tight sm:text-4xl">{t("pondOwnerPageTitle")}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">{t("pondOwnerPageIntro")}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[t("pondOwnerBenefit1"), t("pondOwnerBenefit2"), t("pondOwnerBenefit3")].map((benefit) => (
          <div key={benefit} className="rounded-2xl bg-white p-4 text-sm font-medium text-[var(--ink)] ring-1 ring-[var(--sand-dark)]/40">
            {benefit}
          </div>
        ))}
      </div>

      <PondClaimForm initiallyOpen />
    </main>
  );
}
