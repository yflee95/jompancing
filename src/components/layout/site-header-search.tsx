"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface SiteHeaderSearchProps {
  isOverlay: boolean;
}

export function SiteHeaderSearch({ isOverlay }: SiteHeaderSearchProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (pathname.startsWith("/search") || pathname.startsWith("/spots")) {
      setQuery(searchParams.get("q") ?? "");
    }
  }, [pathname, searchParams]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  }

  return (
    <form onSubmit={handleSearch} className="relative min-w-0 flex-1">
      <Search
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
          isOverlay ? "text-white/70" : "text-[var(--ink-muted)]",
        )}
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("home.searchPlaceholder")}
        aria-label={t("home.searchPlaceholder")}
        className={cn(
          "h-10 w-full rounded-full border-0 pl-10 pr-4 text-sm outline-none transition focus:ring-2",
          isOverlay
            ? "bg-white/15 text-white placeholder:text-white/60 backdrop-blur-md focus:bg-white/25 focus:ring-white/30"
            : "bg-white text-[var(--ink)] shadow-sm ring-1 ring-[var(--sand-dark)]/60 placeholder:text-[var(--ink-muted)] focus:ring-[var(--ocean)]/30",
        )}
      />
    </form>
  );
}

export function SiteHeaderSearchFallback({ isOverlay }: SiteHeaderSearchProps) {
  const t = useTranslations();

  return (
    <div className="relative min-w-0 flex-1">
      <Search
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
          isOverlay ? "text-white/70" : "text-[var(--ink-muted)]",
        )}
      />
      <div
        className={cn(
          "h-10 w-full rounded-full pl-10 pr-4 text-sm",
          isOverlay
            ? "bg-white/15 backdrop-blur-md"
            : "bg-white shadow-sm ring-1 ring-[var(--sand-dark)]/60",
        )}
        aria-hidden
      >
        <span className="sr-only">{t("home.searchPlaceholder")}</span>
      </div>
    </div>
  );
}
