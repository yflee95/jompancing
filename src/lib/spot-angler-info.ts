import { getLocalizedText, type FishingSpot, type WaterType } from "@/types";
import type { Locale } from "@/i18n/routing";

const DEFAULT_SPECIES: Record<WaterType, string> = {
  saltwater: "Siakap, kembung, jenahak",
  freshwater: "Talapia, patin, kelah",
  pond: "Patin, talapia, catfish",
  river: "Kelah, sebarau, haruan",
};

const DEFAULT_BEST_TIME: Record<WaterType, { ms: string; en: string; zh: string }> = {
  saltwater: {
    ms: "Awal pagi & petang — air tenang",
    en: "Early morning & evening — slack tide",
    zh: "清晨和傍晚 — 水流较缓",
  },
  freshwater: {
    ms: "Pagi awal atau lepas hujan",
    en: "Early morning or after rain",
    zh: "清晨或雨后",
  },
  pond: {
    ms: "Pagi & malam — sesi 4–6 jam",
    en: "Morning & night — 4–6 hr sessions",
    zh: "早上和晚上 — 4–6 小时场",
  },
  river: {
    ms: "Hujung air naik & awal surut",
    en: "End of rising tide & early fall",
    zh: "涨潮末期和退潮初期",
  },
};

const DEFAULT_FACILITIES: Record<WaterType, string> = {
  saltwater: "Jeti, parking tepi jalan",
  freshwater: "Tepi tasik, amenity asas",
  pond: "Kolam berbayar, pondok, tandas",
  river: "Tepi sungai, amaran arus",
};

export function getSpotSpeciesLine(spot: FishingSpot): string {
  if (spot.species.length > 0) return spot.species.slice(0, 4).join(", ");
  const fromTags = spot.tags.filter((tag) =>
    /siakap|patin|talapia|kembung|kelah|sebarau|haruan|ikan/i.test(tag),
  );
  if (fromTags.length > 0) return fromTags.slice(0, 3).join(", ");
  return DEFAULT_SPECIES[spot.waterType];
}

export function getSpotBestTimeLine(spot: FishingSpot, locale: Locale): string {
  const localized = getLocalizedText(spot.bestTime, locale).trim();
  if (localized && localized !== "—" && localized.length > 2) {
    return localized;
  }
  return DEFAULT_BEST_TIME[spot.waterType][locale];
}

export function getSpotFacilitiesLine(spot: FishingSpot): string {
  if (spot.facilities.length > 0) return spot.facilities.slice(0, 2).join(", ");
  const parkingTag = spot.tags.find((tag) =>
    /parking|parkir|jeti|toilet|pondok|fee|berbayar/i.test(tag),
  );
  if (parkingTag) return parkingTag;
  return DEFAULT_FACILITIES[spot.waterType];
}
