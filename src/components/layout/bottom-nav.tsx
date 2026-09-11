"use client";

import {
  Home,
  Map,
  MapPin,
  PlusCircle,
  ShoppingBag,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type MobileNavHref = "/" | "/spots" | "/post" | "/map" | "/marketplace";

type NavItem = {
  href: MobileNavHref;
  icon: typeof Home;
  labelKey:
    | "nav.home"
    | "nav.spots"
    | "nav.post"
    | "nav.map"
    | "nav.marketplace";
  accent?: boolean;
};

const mobileNavItems: NavItem[] = [
  { href: "/", icon: Home, labelKey: "nav.home" },
  { href: "/spots", icon: MapPin, labelKey: "nav.spots" },
  { href: "/post", icon: PlusCircle, labelKey: "nav.post", accent: true },
  { href: "/map", icon: Map, labelKey: "nav.map" },
  { href: "/marketplace", icon: ShoppingBag, labelKey: "nav.marketplace" },
];

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--sand-dark)]/50 bg-white/95 pb-safe backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-[4.25rem] max-w-lg items-center justify-around px-1">
        {mobileNavItems.map(({ href, icon: Icon, labelKey, accent }) => {
          const isActive = isNavActive(pathname, href);

          if (accent) {
            return (
              <Link
                key={href}
                href={href}
                aria-label={t(labelKey)}
                className="flex -mt-6 h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]"
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
                "relative flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-1 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[var(--ocean)]"
                  : "text-[var(--ink-muted)]",
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive && "stroke-[2.5]")} />
              <span className="max-w-full truncate">{t(labelKey)}</span>
              {isActive && (
                <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[var(--ocean)]" />
              )}
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
    { href: "/map", labelKey: "nav.map" as const },
    { href: "/forum", labelKey: "nav.forum" as const },
    { href: "/activities", labelKey: "nav.activities" as const },
    { href: "/marketplace", labelKey: "nav.marketplace" as const },
    { href: "/guide", labelKey: "nav.guide" as const },
  ];

  return (
    <nav className="hidden border-b border-[var(--sand-dark)]/40 bg-white/60 md:block">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5 md:px-6 scrollbar-none">
        {items.map(({ href, labelKey }) => {
          const isActive = isNavActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--ocean)] text-white"
                  : "text-[var(--ink-muted)] hover:bg-[var(--ocean-light)] hover:text-[var(--ocean)]",
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
