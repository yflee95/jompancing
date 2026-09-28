import { getTranslations, setRequestLocale } from "next-intl/server";
import { SpotsExplore } from "@/components/spots/spots-explore";
import { SpotsRegionItemListJsonLd } from "@/components/seo/spots-region-itemlist-json-ld";
import { SpotsStatesSeoNav } from "@/components/seo/spots-states-seo-nav";
import { getStateById } from "@/data/malaysia-states";
import { getLocalizedText } from "@/types";
import { loadPublicSpots } from "@/lib/public-spots";
import { filterSpotsByRegion } from "@/lib/spot-location";
import {
  getSpotsSeoCopy,
  type SpotsBrowseFilters,
} from "@/lib/spots-seo";
import type { Locale } from "@/i18n/routing";

interface SpotsRegionShellProps {
  locale: Locale;
  filters: SpotsBrowseFilters;
}

export async function SpotsRegionShell({ locale, filters }: SpotsRegionShellProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "spots" });
  const spots = await loadPublicSpots();

  const state = filters.stateId ? getStateById(filters.stateId) : undefined;
  const filtered = state
    ? filterSpotsByRegion(
        spots,
        filters.stateId,
        filters.districtId,
        filters.areaId,
      ).filter((spot) =>
        filters.water ? spot.waterType === filters.water : true,
      )
    : spots;

  const { title, subtitle } = (() => {
    const copy = getSpotsSeoCopy({
      locale,
      t,
      filters,
      spotCount: filtered.length,
    });
    if (state) {
      return { title: copy.title, subtitle: copy.description };
    }
    return { title: t("title"), subtitle: t("subtitle") };
  })();

  return (
    <>
      {state ? (
        <SpotsRegionItemListJsonLd
          locale={locale}
          stateId={state.id}
          stateName={getLocalizedText(state.name, locale)}
          spots={filtered.slice(0, 24)}
        />
      ) : null}
      <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-8">
        <SpotsExplore
          initialSpots={spots}
          locale={locale}
          filterState={filters.stateId}
          filterDistrict={filters.districtId}
          filterArea={filters.areaId}
          filterWater={filters.water}
          pageTitle={title}
          pageSubtitle={subtitle}
        />
      </div>
      {!state ? <SpotsStatesSeoNav locale={locale} /> : null}
    </>
  );
}
