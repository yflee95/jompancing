import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "common" });
  return buildPageMetadata({
    locale,
    path: "",
    title: t("notFoundTitle"),
    description: t("notFoundDescription"),
    noIndex: true,
  });
}

export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-3 text-sm text-[var(--ink-muted)]">{t("notFoundDescription")}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[var(--ocean)] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
