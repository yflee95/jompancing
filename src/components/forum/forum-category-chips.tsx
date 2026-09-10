"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import type { ForumCategory } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES: (ForumCategory | "all")[] = [
  "all",
  "spots",
  "techniques",
  "bait",
  "hooks",
  "fish",
  "ornamental",
  "general",
];

interface ForumCategoryChipsProps {
  currentCategory?: ForumCategory;
}

export function ForumCategoryChips({ currentCategory }: ForumCategoryChipsProps) {
  const t = useTranslations("forum");
  const router = useRouter();
  const pathname = usePathname();

  function selectCategory(category: ForumCategory | "all") {
    if (category === "all") {
      router.push(pathname);
    } else {
      router.push(`${pathname}?category=${category}`);
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => selectCategory(category)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
            (category === "all" && !currentCategory) || currentCategory === category
              ? "bg-[var(--ocean)] text-white shadow-md shadow-[var(--ocean-glow)]"
              : "bg-white text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/60 hover:text-[var(--ink)]",
          )}
        >
          {category === "all" ? t("allTopics") : t(`categories.${category}`)}
        </button>
      ))}
    </div>
  );
}
