"use client";

import {
  CalendarDays,
  Home,
  MapPin,
  PlusCircle,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, labelKey: "nav.home" as const },
  { href: "/spots", icon: MapPin, labelKey: "nav.spots" as const },
  { href: "/post", icon: PlusCircle, labelKey: "nav.post" as const, accent: true },
  { href: "/activities", icon: CalendarDays, labelKey: "nav.activities" as const },
  { href: "/profile", icon: User, labelKey: "nav.profile" as const },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/90 backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.map(({ href, icon: Icon, labelKey, accent }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          if (accent) {
            return (
              <Link
                key={href}
                href={href}
                className="flex -mt-5 h-14 w-14 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg shadow-teal-600/30"
              >
                <Icon className="h-6 w-6" />
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-slate-500 dark:text-slate-400",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DesktopNav() {
  const pathname = usePathname();
  const t = useTranslations();

  const items = [
    { href: "/", labelKey: "nav.home" as const },
    { href: "/spots", labelKey: "nav.spots" as const },
    { href: "/activities", labelKey: "nav.activities" as const },
    { href: "/marketplace", labelKey: "nav.marketplace" as const },
    { href: "/guide", labelKey: "nav.guide" as const },
  ];

  return (
    <nav className="hidden border-b border-slate-200/60 bg-slate-50/50 md:block dark:border-slate-800 dark:bg-slate-900/30">
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-2">
        {items.map(({ href, labelKey }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
              )}
            >
              {t(labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
