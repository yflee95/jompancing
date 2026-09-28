import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { malaysiaStates } from "@/data/malaysia-states";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotsStatesSeoNavProps {
  locale: Locale;
}

export async function SpotsStatesSeoNav({ locale }: SpotsStatesSeoNavProps) {
  const t = await getTranslations({ locale, namespace: "seoHub" });

  return (
    <nav
      className="mx-auto max-w-6xl border-t border-[var(--sand-dark)]/30 px-4 py-8 pb-24 md:pb-10"
      aria-label={t("statesNavLabel")}
    >
      <h2 className="text-sm font-semibold text-[var(--ink)]">{t("statesTitle")}</h2>
      <ul className="mt-3 columns-2 gap-x-6 text-sm sm:columns-3 md:columns-4">
        {malaysiaStates.map((state) => (
          <li key={state.id} className="mb-2 break-inside-avoid">
            <Link
              href={`/spots/${state.slug}`}
              className="text-[var(--ocean)] hover:underline"
            >
              {t("stateSpotsLink", {
                state: getLocalizedText(state.name, locale),
              })}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
