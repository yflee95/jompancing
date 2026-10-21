import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

const NOT_REPORTED: Record<Locale, string> = {
  ms: "Belum dikongsi",
  en: "Not reported",
  zh: "尚无资料",
};

export function getSpotSpeciesLine(spot: FishingSpot, locale: Locale): string {
  if (spot.species.length > 0) return spot.species.slice(0, 4).join(", ");
  const fromTags = spot.tags.filter((tag) =>
    /siakap|patin|talapia|kembung|kelah|sebarau|haruan|ikan/i.test(tag),
  );
  if (fromTags.length > 0) return fromTags.slice(0, 3).join(", ");
  return NOT_REPORTED[locale];
}

export function getSpotBestTimeLine(spot: FishingSpot, locale: Locale): string {
  const localized = getLocalizedText(spot.bestTime, locale).trim();
  if (localized && localized !== "—" && localized.length > 2) {
    return localized;
  }
  return NOT_REPORTED[locale];
}

export function getSpotFacilitiesLine(spot: FishingSpot, locale: Locale): string {
  if (spot.facilities.length > 0) return spot.facilities.slice(0, 2).join(", ");
  const parkingTag = spot.tags.find((tag) =>
    /parking|parkir|jeti|toilet|pondok|fee|berbayar/i.test(tag),
  );
  if (parkingTag) return parkingTag;
  return NOT_REPORTED[locale];
}
