import { getTranslations, setRequestLocale } from "next-intl/server";
import { SpotsExplore } from "@/components/spots/spots-explore";
import { SpotsRegionItemListJsonLd } from "@/components/seo/spots-region-itemlist-json-ld";
import { SpotsStatesSeoNav } from "@/components/seo/spots-states-seo-nav";
import { Link } from "@/i18n/navigation";
import { getStateById } from "@/data/malaysia-states";
import { getLocalizedText } from "@/types";
import { loadPublicSpots } from "@/lib/public-spots";
import {
  filterSpotsByRegion,
  getSpotLocationLine,
} from "@/lib/spot-location";
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
  const filtered = filterSpotsByRegion(
    spots,
    filters.stateId,
    filters.districtId,
    filters.areaId,
  ).filter((spot) => (filters.water ? spot.waterType === filters.water : true));
  const crawlableSpots = filtered
    .filter((spot) => spot.visibility === "public")
    .slice(0, 24);
  const hasCuratedDistrictLanding =
    filters.stateId === "johor" &&
    filters.districtId === "johor-bahru" &&
    !filters.areaId &&
    !filters.water;

  const seoCopy = getSpotsSeoCopy({
    locale,
    t,
    filters,
    spotCount: filtered.length,
  });
  const { title, subtitle } =
    state || filters.water === "pond"
      ? { title: seoCopy.title, subtitle: seoCopy.description }
      : { title: t("title"), subtitle: t("subtitle") };

  return (
    <>
      {state ? (
        <SpotsRegionItemListJsonLd
          locale={locale}
          stateId={state.id}
          stateName={getLocalizedText(state.name, locale)}
          listPath={seoCopy.path}
          listName={title}
          spots={
            hasCuratedDistrictLanding
              ? crawlableSpots
              : filtered.slice(0, 24)
          }
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
        {crawlableSpots.length > 0 &&
          (!filters.districtId || hasCuratedDistrictLanding) &&
          !filters.areaId && (
          <section
            className="mt-10 border-t border-[var(--sand-dark)]/40 pt-6"
            aria-labelledby="spots-crawlable-heading"
          >
            <h2
              id="spots-crawlable-heading"
              className="font-serif-display text-xl font-bold text-[var(--ink)]"
            >
              {locale === "ms"
                ? state
                  ? hasCuratedDistrictLanding
                    ? "Port memancing pilihan di Johor Bahru"
                    : `Lokasi memancing pilihan di ${getLocalizedText(state.name, locale)}`
                  : "Port memancing pilihan di Malaysia"
                : locale === "zh"
                  ? state
                    ? hasCuratedDistrictLanding
                      ? "新山精选钓点"
                      : `${getLocalizedText(state.name, locale)}精选钓点`
                    : "马来西亚精选钓点"
                  : state
                    ? hasCuratedDistrictLanding
                      ? "Featured fishing spots in Johor Bahru"
                      : `Featured fishing spots in ${getLocalizedText(state.name, locale)}`
                    : "Featured fishing spots in Malaysia"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-[var(--ink-muted)]">
              {locale === "ms"
                ? hasCuratedDistrictLanding
                  ? "Terokai kolam pancing, jeti dan lokasi memancing sekitar Johor Bahru. Buka setiap spot untuk melihat alamat dan maklumat yang dikongsi pemancing."
                  : "Lihat butiran lokasi, jenis air, kawasan dan maklumat yang dikongsi komuniti pemancing."
                : locale === "zh"
                  ? hasCuratedDistrictLanding
                    ? "浏览新山一带的钓场、码头与钓鱼地点。打开钓点查看地址及钓友分享的信息。"
                    : "查看地点、水域类型、区域以及钓友社区分享的钓点信息。"
                  : hasCuratedDistrictLanding
                    ? "Explore fishing ponds, jetties and angling locations around Johor Bahru. Open each spot for its address and community shared details."
                    : "Explore location details, water types, areas and information shared by the angling community."}
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {crawlableSpots.map((spot) => {
                const location = getSpotLocationLine(spot, locale);
                const title = getLocalizedText(spot.title, locale);
                const description = getLocalizedText(spot.description, locale);
                return (
                  <li key={spot.id}>
                    <Link
                      href={`/spots/${spot.slug}`}
                      className="block h-full rounded-2xl bg-white p-4 ring-1 ring-[var(--sand-dark)]/40 hover:ring-[var(--ocean)]/40"
                    >
                      <h3 className="font-semibold text-[var(--ocean)] hover:underline">
                        {title}
                      </h3>
                      {location && (
                        <p className="mt-1 text-xs text-[var(--ink-muted)]">
                          {location}
                        </p>
                      )}
                      {description && (
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                          {description}
                        </p>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
          )}
      </div>
      {!state ? <SpotsStatesSeoNav locale={locale} /> : null}
    </>
  );
}
