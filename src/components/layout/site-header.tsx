"use client";

import { Fish, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const t = useTranslations();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg shadow-teal-600/25">
            <Fish className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              {t("common.appName")}
            </p>
            <p className="text-xs text-teal-600 dark:text-teal-400">
              {t("common.tagline")}
            </p>
          </div>
        </Link>

        <div className="hidden flex-1 max-w-md md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder={t("common.search")}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher className="hidden sm:flex" />
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block"
              >
                {user.name}
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                {t("common.logout")}
              </Button>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">{t("common.login")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
