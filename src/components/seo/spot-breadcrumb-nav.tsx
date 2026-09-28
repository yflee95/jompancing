import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotBreadcrumbNavProps {
  spot: FishingSpot;
  locale: Locale;
}

export async function SpotBreadcrumbNav({
  spot,
  locale,
}: SpotBreadcrumbNavProps) {
  const t = await getTranslations("spots");
  const state = getStateById(spot.stateId);
  const district = getDistrictById(spot.stateId, spot.districtId);
  const stateName = state ? getLocalizedText(state.name, locale) : "";
  const districtName = district ? getLocalizedText(district.name, locale) : "";

  const districtHref = state
    ? `/spots/${state.slug}?district=${encodeURIComponent(spot.districtId)}`
    : null;

  return (
    <nav
      aria-label={t("seoBreadcrumbLabel")}
      className="mb-4 flex flex-wrap items-center gap-1 text-xs text-[var(--ink-muted)]"
    >
      <Link href="/spots" className="font-medium text-[var(--ocean)] hover:underline">
        {t("seoBreadcrumbSpots")}
      </Link>
      {state && (
        <>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
          <Link
            href={`/spots/${state.slug}`}
            className="font-medium text-[var(--ocean)] hover:underline"
          >
            {stateName}
          </Link>
        </>
      )}
      {districtHref && districtName && (
        <>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
          <Link href={districtHref} className="hover:text-[var(--ink)] hover:underline">
            {districtName}
          </Link>
        </>
      )}
      <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
      <span className="line-clamp-1 font-medium text-[var(--ink)]">
        {getLocalizedText(spot.title, locale)}
      </span>
    </nav>
  );
}
