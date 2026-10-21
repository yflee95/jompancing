"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FishSpeciesCard } from "@/components/fish/fish-species-card";
import { HomeRailSection } from "@/components/home/home-rail-section";
import { FISH_SPECIES, HOT_FISH, type FishHabitat } from "@/data/fish-catalog";
export function HomeFishSection() {
  const t = useTranslations("fish");
  return (
    <HomeRailSection
      title={t("hotTitle")}
      href="/fish"
      linkLabel={t("viewAll")}
      className="border-t border-[var(--sand-dark)]/20 bg-white/55 py-6 md:py-8"
    >
      {HOT_FISH.map((fish) => (
        <FishSpeciesCard key={fish.slug} fish={fish} variant="rail" />
      ))}
    </HomeRailSection>
  );
}

export function FishCatalog() {
  const t = useTranslations("fish");
  const [activeHabitat, setActiveHabitat] = useState<FishHabitat | "all">("all");
  const filtered =
    activeHabitat === "all"
      ? FISH_SPECIES
      : FISH_SPECIES.filter((fish) => fish.habitats.includes(activeHabitat));

  const filters: Array<FishHabitat | "all"> = [
    "all",
    "freshwater",
    "river",
    "brackish",
    "sea",
  ];

  return (
    <>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filters.map((habitat) => (
          <button
            key={habitat}
            type="button"
            aria-pressed={activeHabitat === habitat}
            onClick={() => setActiveHabitat(habitat)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeHabitat === habitat
                ? "bg-[var(--ocean)] text-white"
                : "bg-white text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/50 hover:text-[var(--ocean)]"
            }`}
          >
            {habitat === "all" ? t("allHabitats") : t(`habitats.${habitat}` as "habitats.freshwater" | "habitats.river" | "habitats.brackish" | "habitats.sea")}
            <span className="ml-1.5 opacity-70">
              {habitat === "all"
                ? FISH_SPECIES.length
                : FISH_SPECIES.filter((fish) => fish.habitats.includes(habitat)).length}
            </span>
          </button>
        ))}
      </div>
      <p className="mb-4 text-xs text-[var(--ink-muted)]">
        {t("count", { count: filtered.length })}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((fish) => (
          <FishSpeciesCard key={fish.slug} fish={fish} />
        ))}
      </div>
    </>
  );
}
