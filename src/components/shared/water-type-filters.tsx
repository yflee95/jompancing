"use client";

import { Compass, Droplets, MapPin, Sparkles, Waves } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { parseWaterTypeParam } from "@/lib/water-types";
import type { WaterType } from "@/types";
import { cn } from "@/lib/utils";

const WATER_OPTIONS: Array<{
  id: WaterType | "all";
  icon: typeof Waves;
  labelKey: "filterAll" | "saltwater" | "freshwater" | "pond" | "river";
}> = [
  { id: "all", icon: Sparkles, labelKey: "filterAll" },
  { id: "saltwater", icon: Waves, labelKey: "saltwater" },
  { id: "freshwater", icon: Droplets, labelKey: "freshwater" },
  { id: "pond", icon: MapPin, labelKey: "pond" },
  { id: "river", icon: Compass, labelKey: "river" },
];

interface WaterTypeFiltersProps {
  className?: string;
  compact?: boolean;
}

export function WaterTypeFilters({ className, compact }: WaterTypeFiltersProps) {
  const t = useTranslations("spots");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current: WaterType | "all" =
    parseWaterTypeParam(searchParams.get("water")) ?? "all";

  function setWater(water: WaterType | "all") {
    const params = new URLSearchParams(searchParams.toString());
    if (water === "all") {
      params.delete("water");
    } else {
      params.set("water", water);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-0.5 scrollbar-none",
        className,
      )}
      aria-label={t("filterWaterType")}
    >
      {WATER_OPTIONS.map(({ id, icon: Icon, labelKey }) => {
        const active = current === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setWater(id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold transition ring-1",
              compact ? "h-8 px-3 text-[11px]" : "h-9 px-3.5 text-xs",
              active
                ? "bg-[var(--ocean)] text-white ring-[var(--ocean)] shadow-sm shadow-[var(--ocean-glow)]"
                : "bg-white text-[var(--ink-muted)] ring-[var(--sand-dark)]/60 hover:text-[var(--ink)]",
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {t(labelKey)}
          </button>
        );
      })}
    </div>
  );
}
