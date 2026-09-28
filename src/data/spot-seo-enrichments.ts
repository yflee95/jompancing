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
    match: /pusat memancing shah|fishing spot shah|shah alam.*memancing/i,
    description_ms:
      "Pusat / spot memancing Shah Alam & Lembah Klang — kolam, tasik atau jeti mengikut lokasi. Sesuai sesi keluarga; semak waktu, yuran dan peraturan tempat. Parkir & cuaca panas — bawa air minum.",
    description_en:
      "Shah Alam / Klang Valley fishing spot — pond, lake or jetty depending on venue. Check hours, fees and rules; bring water in hot weather.",
    description_zh:
      "莎阿南 / 巴生谷钓点 — 钓塘、湖泊或码头视场地而定。确认时间与收费，注意防暑补水。",
    extraTags: ["shah alam", "selangor"],
  },
  {
    match: /port mancing tnb|tnb.*port/i,
    description_ms:
      "Port / jeti memancing berhampiran kawasan TNB — lokasi cast ke tasik atau saluran air tawar. Patuhi tanda keselamatan utiliti; jangan memancing di kawasan larangan. Semak akses jalan dan waktu operasi.",
    description_en:
      "TNB-area fishing port — freshwater lake or canal fishing. Obey utility safety signs and no-fishing zones; check road access and hours.",
    description_zh:
      "TNB 附近钓点 — 淡水湖或渠道。遵守安全告示与禁钓区，确认道路与开放时间。",
    extraTags: ["tnb", "port"],
  },
  {
    match: /semenyih|danau semenyih/i,
    description_ms:
      "Kolam / tasik berhampiran Semenyih & Danau Semenyih — memancing air tawar popular di Selangor. Semak yuran kolam, umpan dibenarkan dan sesi siang/malam. Sesuai patin, talapia dan udang galah (mengikut venue).",
    description_en:
      "Semenyih / Danau Semenyih area — popular Selangor freshwater ponds. Check fees, bait rules and day/night sessions.",
    description_zh:
      "Semenyih / 士毛月湖一带 — 雪兰莪淡水钓场。确认收费、饵料与日夜场次。",
    species: ["patin", "talapia", "udang galah"],
    extraTags: ["semenyih", "selangor"],
  },
  {
    match: /98 fishing village|fishing village/i,
    description_ms:
      "98 Fishing Village — destinasi memancing & makanan laut, sesuai keluarga. Semak pakej memancing, waktu operasi dan tempat letak kereta. Kongsi pengalaman di Jompancing.",
    description_en:
      "98 Fishing Village — fishing and seafood destination for families. Check fishing packages, hours and parking.",
    description_zh:
      "98 Fishing Village — 钓鱼与海鲜休闲点，适合家庭。确认套餐、营业时间与停车。",
    extraTags: ["kolam", "family"],
  },
  {
    match: /river resource|klang gate|sg klang/i,
    description_ms:
      "River Resource / Klang Gate — memancing sungai & tasik empangan di Lembah Klang. Perhatikan aras air, lesen jika perlu, dan keselamatan tepi air. Ikan talapia, patin dan species sungai mengikut musim.",
    description_en:
      "River Resource / Klang Gate — river and dam fishing in Klang Valley. Mind water level, licensing and bank safety.",
    description_zh:
      "Klang Gate / 河流资源区 — 河谷水坝与河流钓点。注意水位、证照与岸堤安全。",
    species: ["talapia", "patin", "kelah"],
    extraTags: ["klang", "empangan"],
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
  /Jom pancing & kongsi tips di Jompancing/i,
  /Share tips on Jompancing\.\s*$/i,
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
