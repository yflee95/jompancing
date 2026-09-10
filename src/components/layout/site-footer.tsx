import { Fish } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600">
              <Fish className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                {t("common.appName")}
              </p>
              <p className="text-sm text-slate-500">{t("common.tagline")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-400">
            <Link href="/guide" className="hover:text-teal-600">
              {t("footer.about")}
            </Link>
            <span>{t("footer.terms")}</span>
            <span>{t("footer.privacy")}</span>
            <span>{t("footer.contact")}</span>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          {t("footer.copyright", { year })}
        </p>
      </div>
    </footer>
  );
}
