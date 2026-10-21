import { getTranslations, setRequestLocale } from "next-intl/server";
import { PondClaimAdmin } from "@/components/spots/pond-claim-admin";
import { getSessionAdminEmail } from "@/lib/admin";
import { buildPageMetadata } from "@/lib/seo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "spots.claimAdmin" });
  return buildPageMetadata({
    locale,
    path: "/admin/pond-claims",
    title: t("title"),
    description: t("description"),
    noIndex: true,
  });
}

export default async function PondClaimAdminPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("spots.claimAdmin");
  if (!isSupabaseConfigured() || !(await getSessionAdminEmail())) {
    return <main className="mx-auto max-w-3xl px-4 py-12"><p className="rounded-2xl bg-white p-6 text-sm text-[var(--ink-muted)]">{t("adminOnly")}</p></main>;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-20">
      <h1 className="font-serif-display text-2xl font-bold text-[var(--ink)]">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)]">{t("description")}</p>
      <div className="mt-6"><PondClaimAdmin locale={locale} /></div>
    </main>
  );
}
