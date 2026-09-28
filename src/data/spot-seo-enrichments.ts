/**
 * Curated copy upgrades for high-impression / thin Google-seed spots.
 * Matched by title + address; applied via `npm run enrich:spot-seo`.
 */

export type SpotSeoEnrichment = {
  /** Case-insensitive match on title_ms / title_en or slug fragment */
  match: RegExp;
  description_ms: string;
  description_en: string;
  description_zh: string;
  species?: string[];
  extraTags?: string[];
};

export const SPOT_SEO_ENRICHMENTS: SpotSeoEnrichment[] = [
  {
    match: /paradise fishing villa/i,
    description_ms:
      "Paradise Fishing Villa — tempat memancing & kolam popular untuk keluarga dan kaki pancing. Sesuai sesi santai, often pay pond / villa stay. Semak waktu operasi, yuran masuk dan peraturan tangkapan sebelum pergi. Kongsi tips di Jompancing.",
    description_en:
      "Paradise Fishing Villa — popular fishing villa and pond for casual sessions. Check opening hours, entry fees and catch rules before you go. Share tips on Jompancing.",
    description_zh:
      "Paradise Fishing Villa — 热门钓场/钓场别墅，适合休闲钓鱼。出发前确认营业时间、收费与渔规。欢迎在 Jompancing 分享心得。",
    species: ["patin", "talapia", "catfish"],
    extraTags: ["kolam", "villa"],
  },
  {
    match: /air kuning|sungai air kuning/i,
    description_ms:
      "Empangan / tasik Air Kuning — lokasi memancing air tawar di Malaysia. Perhatikan aras air, peraturan JPPM dan keselamatan tepi empangan. Bawa kelengkapan sesuai ikan talapia, patin atau kelah mengikut musim. Verify access on site.",
    description_en:
      "Air Kuning dam / lake — freshwater fishing in Malaysia. Mind water level, local rules and dam safety. Bring gear suited to tilapia, catfish or mahseer depending on season.",
    description_zh:
      "Air Kuning 水坝/湖泊 — 马来西亚淡水钓点。注意水位、当地规定与安全。按季节准备罗非、鲶鱼或鲤科装备。",
    species: ["talapia", "patin", "kelah"],
    extraTags: ["empangan", "tasik"],
  },
  {
    match: /jeti bagan ajam|bagan ajam/i,
    description_ms:
      "Jeti Bagan Ajam — spot memancing laut & jeti pantai di Pulau Pinang. Sesuai siakap, kembung dan ikan tepi jeti; timing pasang surut penting. Parking tepi jalan — jaga keselamatan dan kebersihan jeti.",
    description_en:
      "Bagan Ajam jetty — sea fishing on Penang’s coast. Try barramundi, mackerel and jetty species; tide timing matters. Street parking — stay safe and leave no trace.",
    description_zh:
      "Bagan Ajam 码头 — 槟城海钓点，可钓金目鲈、鲭鱼等。注意潮汐与停车安全。",
    species: ["siakap", "kembung"],
    extraTags: ["jeti", "laut", "penang"],
  },
  {
    match: /kolam memancing|kolam pancing|fishing pond|pay pond/i,
    description_ms:
      "Kolam memancing berbayar — sesi 4–6 jam, often patin & talapia. Semak harga tiket, umpan dibenarkan, peraturan tag & release, serta waktu malam/pagi. Sesuai pemula dan keluarga — jom pancing!",
    description_en:
      "Pay fishing pond — typical 4–6 hour sessions, often catfish and tilapia. Check ticket price, bait rules and session times. Great for beginners and families.",
    description_zh:
      "收费钓塘 — 常见 4–6 小时场，多為鲶鱼、罗非。确认票价、饵料规定与场次时间，适合新手与家庭。",
    species: ["patin", "talapia"],
    extraTags: ["kolam", "berbayar"],
  },
  {
    match: /jeti|jetty|pier/i,
    description_ms:
      "Jeti memancing — lokasi cast dari tepi jeti ke air laut atau estuari. Bawa sinker & jig sesuai arus; awal pagi dan petang biasanya lebih produktif. Patuhi tanda larangan dan jaga keselamatan anak-anak di jeti.",
    description_en:
      "Fishing jetty — cast from the pier into sea or estuary. Bring sinkers/jigs for current; early morning and evening often fish best. Follow signage and jetty safety.",
    description_zh:
      "钓鱼码头 — 向海或河口下竿。准备铅坠/路亚，早晚口常较好，遵守告示与安全规则。",
    extraTags: ["jeti", "memancing"],
  },
];

/** Generic Google-seed blurbs we replace when no specific rule matched. */
export const GENERIC_SEED_DESCRIPTION_MARKERS = [
  /curated from Google Maps for Malaysian anglers/i,
  /Verify access rules and tides before fishing/i,
];

export function isThinOrGenericDescription(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 72) return true;
  return GENERIC_SEED_DESCRIPTION_MARKERS.some((re) => re.test(trimmed));
}

export function findEnrichmentForSpot(spot: {
  slug: string;
  title_ms: string;
  title_en: string;
  google_address: string;
}): SpotSeoEnrichment | undefined {
  const haystack = `${spot.title_ms} ${spot.title_en} ${spot.slug} ${spot.google_address}`;
  return SPOT_SEO_ENRICHMENTS.find((rule) => rule.match.test(haystack));
}
