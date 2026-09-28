import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { malaysiaStates } from "@/data/malaysia-states";
import { pickSpotsForSeoHub, spotSeoHubLabel } from "@/lib/content-seo";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

interface HomeSeoHubProps {
  locale: Locale;
  spots: FishingSpot[];
}

export async function HomeSeoHub({ locale, spots }: HomeSeoHubProps) {
  const t = await getTranslations({ locale, namespace: "seoHub" });
  const featured = pickSpotsForSeoHub(spots, 20);

  return (
    <section
      className="border-t border-[var(--sand-dark)]/40 bg-white py-10"
      aria-labelledby="seo-hub-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <h2
          id="seo-hub-heading"
          className="font-serif-display text-xl font-bold text-[var(--ink)]"
        >
          {t("heading")}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-[var(--ink-muted)]">
          {t("intro")}
        </p>

        <nav className="mt-6" aria-label={t("statesNavLabel")}>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
            {t("statesTitle")}
          </h3>
          <ul className="mt-3 columns-2 gap-x-6 text-sm sm:columns-3 md:columns-4">
            {malaysiaStates.map((state) => (
              <li key={state.id} className="mb-2 break-inside-avoid">
                <Link
                  href={`/spots/${state.slug}`}
                  className="text-[var(--ocean)] hover:underline"
                >
                  {getLocalizedText(state.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {featured.length > 0 && (
          <nav className="mt-8" aria-label={t("spotsNavLabel")}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
              {t("spotsTitle")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {featured.map((spot) => (
                <li key={spot.id}>
                  <Link
                    href={`/spots/${spot.slug}`}
                    className="text-[var(--ocean)] hover:underline"
                  >
                    {spotSeoHubLabel(spot, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav
          className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium"
          aria-label={t("exploreNavLabel")}
        >
          <Link href="/spots" className="text-[var(--ocean)] hover:underline">
            {t("linkSpots")}
          </Link>
          <Link href="/map" className="text-[var(--ocean)] hover:underline">
            {t("linkMap")}
          </Link>
          <Link href="/guide" className="text-[var(--ocean)] hover:underline">
            {t("linkGuide")}
          </Link>
          <Link href="/activities" className="text-[var(--ocean)] hover:underline">
            {t("linkActivities")}
          </Link>
        </nav>
      </div>
    </section>
  );
}
