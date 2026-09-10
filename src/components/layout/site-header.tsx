"use client";

import { Suspense } from "react";
import { Fish, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import {
  SiteHeaderSearch,
  SiteHeaderSearchFallback,
} from "@/components/layout/site-header-search";
import { useScrolledPast } from "@/hooks/use-scrolled-past";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations();
  const { user } = useAuth();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrolled = useScrolledPast(60);
  const isOverlay = isHome && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isOverlay
          ? "border-b border-white/10 bg-gradient-to-b from-black/55 via-black/25 to-transparent"
          : "border-b border-[var(--sand-dark)]/50 bg-[var(--sand)]/95 shadow-sm shadow-[var(--sand-dark)]/20 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
              isOverlay
                ? "bg-white/20 backdrop-blur-sm"
                : "bg-[var(--ocean)] shadow-md shadow-[var(--ocean-glow)]",
            )}
          >
            <Fish className="h-4 w-4 text-white" />
          </div>
          <span
            className={cn(
              "font-serif-display hidden text-lg font-bold sm:block",
              isOverlay ? "text-white" : "text-[var(--ink)]",
            )}
          >
            {t("common.appName")}
          </span>
        </Link>

        <Suspense fallback={<SiteHeaderSearchFallback isOverlay={isOverlay} />}>
          <SiteHeaderSearch isOverlay={isOverlay} />
        </Suspense>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LocaleSwitcher variant={isOverlay ? "light" : "default"} />
          <Link
            href={user ? "/profile" : "/login"}
            aria-label={user ? user.name : t("common.login")}
            className={cn(
              "flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-xs font-bold transition active:scale-95",
              isOverlay
                ? "bg-white/20 text-white ring-2 ring-white/30 backdrop-blur-sm"
                : "bg-[var(--ocean-light)] text-[var(--ocean)] ring-2 ring-white shadow-sm",
            )}
          >
            {user ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <User className="h-4 w-4" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
