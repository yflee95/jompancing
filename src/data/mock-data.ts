import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { filterActivitiesByRegion } from "@/lib/activities";
import type {
  Activity,
  ActivitySort,
  FishingSpot,
  ForumCategory,
  ForumPost,
  ForumReply,
  GuideArticle,
  MarketplaceListing,
  SpotComment,
} from "@/types";

function spotSearchText(spot: FishingSpot): string {
  const parts = [
    ...Object.values(spot.title),
    ...Object.values(spot.description),
    ...spot.species,
    ...spot.tags,
    spot.googleAddress,
    spot.areaName ?? "",
    spot.authorName,
    spot.slug.replace(/-/g, " "),
  ];
  const state = getStateById(spot.stateId);
  const district = getDistrictById(spot.stateId, spot.districtId);
  if (state) parts.push(...Object.values(state.name));
  if (district) parts.push(...Object.values(district.name));
  if (spot.areaId) parts.push(spot.areaId.replace(/-/g, " "));
  return parts.join(" ").toLowerCase();
}

/** @deprecated Spot comments for removed mock seed spots — kept for reference only. */
export const mockSpotComments: SpotComment[] = [
  {
    id: "sc-1",
    spotId: "spot-1",
    authorName: "Ahmad F.",
    body: {
      ms: "Pagi 6-8 pagi paling best untuk siakap. Guna live prawn.",
      en: "6-8 AM is best for barramundi. Use live prawn.",
      zh: "早上 6-8 点钓金目鲈最好，用活虾。",
    },
    createdAt: "2026-03-08T06:30:00Z",
  },
];

/** Deprecated — public spots now come from Supabase (Google Places seed + UGC). */
export const mockSpots: FishingSpot[] = [];

export function getPublicSpots(spots: FishingSpot[]): FishingSpot[] {
  return spots.filter((s) => s.visibility === "public");
}

/** Real activities from organizers — empty until UGC / admin listings */
export const mockActivities: Activity[] = [];

export const mockForumPosts: ForumPost[] = [
  {
    id: "fp-1",
    slug: "best-bait-siakap-jb",
    title: {
      ms: "Umpan terbaik untuk siakap di JB?",
      en: "Best bait for barramundi in JB?",
      zh: "新山钓金目鲈最好的饵料？",
    },
    body: {
      ms: "Saya baru mula memancing siakap. Live prawn vs cut bait — mana lebih effective?",
      en: "Just started barramundi fishing. Live prawn vs cut bait — which works better?",
      zh: "刚开始钓金目鲈，活虾和切饵哪个更有效？",
    },
    category: "bait",
    authorName: "Ahmad F.",
    replyCount: 18,
    viewCount: 420,
    hotScore: 95,
    createdAt: "2026-03-07T10:00:00Z",
    lastReplyAt: "2026-03-09T08:30:00Z",
    pinned: true,
  },
  {
    id: "fp-2",
    slug: "hook-size-river-fishing",
    title: {
      ms: "Saiz mata kail untuk memancing sungai",
      en: "Hook sizes for river fishing",
      zh: "河流钓鱼用多大的钩？",
    },
    body: {
      ms: "Nak tanya saiz kail untuk keli & patin di kolam/sungai. #2 ke #6?",
      en: "What hook size for catfish & patin in ponds/rivers? #2 or #6?",
      zh: "池塘/河流钓鲶鱼和巴丁，用几号钩？2号还是6号？",
    },
    category: "hooks",
    authorName: "Lee W.",
    replyCount: 12,
    viewCount: 280,
    hotScore: 72,
    createdAt: "2026-03-06T14:00:00Z",
    lastReplyAt: "2026-03-08T16:00:00Z",
  },
  {
    id: "fp-3",
    slug: "danga-bay-night-tips",
    title: {
      ms: "Tips memancing malam di Danga Bay",
      en: "Night fishing tips at Danga Bay",
      zh: "Danga Bay 夜钓技巧",
    },
    body: {
      ms: "Share pengalaman korang. Lampu apa yang korang guna?",
      en: "Share your experience. What lights do you use?",
      zh: "分享你们的经验，用什么灯？",
    },
    category: "spots",
    authorName: "Raj K.",
    replyCount: 24,
    viewCount: 560,
    hotScore: 88,
    createdAt: "2026-03-04T20:00:00Z",
    lastReplyAt: "2026-03-09T12:00:00Z",
  },
  {
    id: "fp-4",
    slug: "lure-casting-technique",
    title: {
      ms: "Teknik casting lure untuk pemula",
      en: "Lure casting technique for beginners",
      zh: "新手路亚抛投技巧",
    },
    body: {
      ms: "Video tutorial pun ok. Saya selalu backlash 😅",
      en: "Video tutorials welcome. I keep getting backlash 😅",
      zh: "欢迎视频教程，我总是炸线 😅",
    },
    category: "techniques",
    authorName: "Hafiz R.",
    replyCount: 9,
    viewCount: 190,
    hotScore: 55,
    createdAt: "2026-03-03T09:00:00Z",
    lastReplyAt: "2026-03-07T11:00:00Z",
  },
  {
    id: "fp-5",
    slug: "arowana-vs-koi-pond",
    title: {
      ms: "Kolam arowana vs koi — pengalaman?",
      en: "Arowana vs koi pond — your experience?",
      zh: "龙鱼池 vs 锦鲤池 — 你的经验？",
    },
    body: {
      ms: "Nak setup kolam ikan hiasan. Budget RM15k. Apa recommend?",
      en: "Setting up ornamental pond. Budget RM15k. Recommendations?",
      zh: "想建观赏鱼池，预算 RM15k，有什么推荐？",
    },
    category: "ornamental",
    authorName: "Chen M.",
    replyCount: 15,
    viewCount: 310,
    hotScore: 68,
    createdAt: "2026-03-02T16:00:00Z",
    lastReplyAt: "2026-03-08T09:00:00Z",
  },
  {
    id: "fp-6",
    slug: "identify-talang-vs-ebek",
    title: {
      ms: "Cara bezakan talang vs ebek?",
      en: "How to tell talang vs ebek apart?",
      zh: "怎么区分皇后鱼和石鲷？",
    },
    body: {
      ms: "Selalu keliru bila upload foto. Ada tips?",
      en: "Always confused when uploading photos. Any tips?",
      zh: "上传照片时总是搞混，有技巧吗？",
    },
    category: "fish",
    authorName: "Siti N.",
    replyCount: 7,
    viewCount: 145,
    hotScore: 42,
    createdAt: "2026-03-01T12:00:00Z",
    lastReplyAt: "2026-03-06T18:00:00Z",
  },
  {
    id: "fp-7",
    slug: "best-spots-pontian",
    title: {
      ms: "Tempat memancing best di Pontian?",
      en: "Best fishing spots in Pontian?",
      zh: "笨珍最好的钓点？",
    },
    body: {
      ms: "Weekend trip dari JB. Parking senang preferred.",
      en: "Weekend trip from JB. Prefer easy parking.",
      zh: "从 JB 周末去，最好停车方便。",
    },
    category: "spots",
    authorName: "Ahmad F.",
    replyCount: 11,
    viewCount: 220,
    hotScore: 61,
    createdAt: "2026-02-28T08:00:00Z",
    lastReplyAt: "2026-03-05T14:00:00Z",
  },
  {
    id: "fp-8",
    slug: "soft-plastic-vs-hard-lure",
    title: {
      ms: "Soft plastic vs hard lure — bila guna?",
      en: "Soft plastic vs hard lure — when to use?",
      zh: "软饵 vs 硬饵 — 什么时候用？",
    },
    body: {
      ms: "Nak build tackle box yang versatile untuk saltwater.",
      en: "Building a versatile saltwater tackle box.",
      zh: "想组一套通用的海水路亚装备。",
    },
    category: "techniques",
    authorName: "Lee W.",
    replyCount: 14,
    viewCount: 265,
    hotScore: 70,
    createdAt: "2026-02-27T10:00:00Z",
    lastReplyAt: "2026-03-07T20:00:00Z",
  },
];

export const mockForumReplies: ForumReply[] = [
  {
    id: "fr-1",
    postId: "fp-1",
    authorName: "Raj K.",
    body: {
      ms: "Live prawn confirm jalan. Cut bait ok tapi siakap picky sikit.",
      en: "Live prawn definitely works. Cut bait ok but barramundi can be picky.",
      zh: "活虾肯定有效，切饵也行但金目鲈有点挑。",
    },
    createdAt: "2026-03-07T14:00:00Z",
  },
  {
    id: "fr-2",
    postId: "fp-1",
    authorName: "Hafiz R.",
    body: {
      ms: "Try udang galah at night. Game changer.",
      en: "Try giant prawn at night. Game changer.",
      zh: "晚上试试大罗氏虾，效果惊人。",
    },
    createdAt: "2026-03-08T09:00:00Z",
  },
  {
    id: "fr-3",
    postId: "fp-3",
    authorName: "Ahmad F.",
    body: {
      ms: "LED floodlight 50W cukup. Jangan lupa power bank.",
      en: "50W LED floodlight is enough. Don't forget power bank.",
      zh: "50W LED 投光灯够了，别忘了充电宝。",
    },
    createdAt: "2026-03-05T22:00:00Z",
  },
  {
    id: "fr-4",
    postId: "fp-3",
    authorName: "Lee W.",
    body: {
      ms: "Hati-hati slippery rocks. Wear proper shoes.",
      en: "Watch out for slippery rocks. Wear proper shoes.",
      zh: "小心滑石，穿合适的鞋。",
    },
    createdAt: "2026-03-06T07:00:00Z",
  },
];

export const mockListings: MarketplaceListing[] = [
  {
    id: "list-1",
    slug: "shimano-stradic-4000",
    title: {
      ms: "Shimano Stradic 4000 (Terpakai)",
      en: "Shimano Stradic 4000 (Used)",
      zh: "Shimano Stradic 4000（二手）",
    },
    description: {
      ms: "Reel terpakai kondisi 9/10. Servis terakhir bulan lepas.",
      en: "Used reel in 9/10 condition. Last serviced last month.",
      zh: "二手渔轮，成色 9/10，上月刚保养。",
    },
    price: 450,
    condition: "used",
    stateId: "johor",
    districtId: "johor-bahru",
    sellerName: "Hafiz R.",
    sellerVerified: true,
    imageUrl:
      "https://images.unsplash.com/photo-1532015917327-7a360180f871?w=800&q=80",
    whatsapp: "60123456789",
    createdAt: "2026-03-08T12:00:00Z",
  },
  {
    id: "list-2",
    slug: "daiwa-rod-combo-new",
    title: {
      ms: "Set Rod + Reel Daiwa (Baru)",
      en: "Daiwa Rod + Reel Combo (New)",
      zh: "Daiwa 竿轮套装（全新）",
    },
    description: {
      ms: "Set lengkap untuk pemula. Masih dalam kotak.",
      en: "Complete beginner set. Still in box.",
      zh: "新手完整套装，未拆封。",
    },
    price: 280,
    condition: "new",
    stateId: "selangor",
    districtId: "klang",
    sellerName: "FishMart Klang",
    sellerVerified: true,
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-77ef2d0cfcb6?w=800&q=80",
    whatsapp: "60198765432",
    createdAt: "2026-03-10T09:00:00Z",
  },
  {
    id: "list-3",
    slug: "lure-set-assorted",
    title: {
      ms: "Set Lure Pelbagai (20pcs)",
      en: "Assorted Lure Set (20pcs)",
      zh: "混合假饵套装（20个）",
    },
    description: {
      ms: "Lure soft plastic & hard bait. Sesuai untuk siakap & talang.",
      en: "Soft plastic & hard bait lures. Great for barramundi & queenfish.",
      zh: "软胶和硬饵，适合金目鲈和旗鱼。",
    },
    price: 65,
    condition: "new",
    stateId: "penang",
    districtId: "timur-laut",
    sellerName: "Chen Angler",
    sellerVerified: false,
    imageUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    whatsapp: "60187654321",
    createdAt: "2026-03-11T14:00:00Z",
  },
];

export const mockArticles: GuideArticle[] = [
  {
    id: "guide-1",
    slug: "siakap-fishing-tips-malaysia",
    title: {
      ms: "Tips Memancing Siakap di Malaysia",
      en: "Barramundi Fishing Tips in Malaysia",
      zh: "马来西亚金目鲈钓鱼技巧",
    },
    excerpt: {
      ms: "Panduan lengkap teknik, umpan & tempat terbaik untuk siakap.",
      en: "Complete guide on techniques, baits & best spots for barramundi.",
      zh: "金目鲈钓法、饵料和最佳钓点完整指南。",
    },
    body: {
      ms: "Siakap (barramundi) adalah spesies popular di perairan payau Malaysia — dari Johor hingga Sabah. Waktu terbaik biasanya awal pagi dan petang lewat apabila air tenang.\n\nUmpan hidup seperti udang galah dan ikan kecil masih paling berkesan. Untuk casting, soft plastic 3–4 inci warna putih/perak berfungsi baik di waktu malam.\n\nCari struktur: tiang jeti, pokok bakau, dan perubahan arus. Jangan lupa peraturan saiz minimum mengikut negeri — semak sebelum keep.",
      en: "Barramundi (siakap) thrive in Malaysia's brackish waters — from Johor to Sabah. Best bites are usually early morning and late evening when the tide slows.\n\nLive bait such as prawns and small fish still outfish most lures. For casting, 3–4 inch white/silver soft plastics work well at night under lights.\n\nTarget structure: jetty piles, mangrove edges, and current breaks. Always check your state's minimum size rules before keeping fish.",
      zh: "金目鲈（Siakap）是马来西亚半咸淡水的热门鱼种，从柔佛到沙巴都有。最佳时段通常是清晨和傍晚水流较缓时。\n\n活饵如小虾和小鱼依然最有效。路亚可选 3–4 寸白/银软胶，夜钓灯光下效果不错。\n\n找结构位：码头桩、红树林边、缓流区。保留前务必查阅各州最小尺寸规定。",
    },
    category: "tips",
    readMinutes: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    publishedAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "guide-2",
    slug: "fishing-license-malaysia",
    title: {
      ms: "Lesen Memancing Malaysia: Apa Perlu Tahu",
      en: "Malaysia Fishing License: What You Need to Know",
      zh: "马来西亚钓鱼执照须知",
    },
    excerpt: {
      ms: "Peraturan lesen memancing mengikut negeri dan jenis air.",
      en: "Fishing license rules by state and water type.",
      zh: "各州和各水域类型的钓鱼执照规定。",
    },
    body: {
      ms: "Lesen memancing di Malaysia diurus oleh negeri masing-masing — tiada satu lesen kebangsaan untuk semua perairan.\n\nKolam komersial dan jeti persendirian selalunya tidak memerlukan lesen negeri, tetapi tanya pengurusan venue. Memancing di laut, sungai awam, atau empangan kerajaan biasanya memerlukan lesen atau permit.\n\nLesen harian, mingguan, dan tahunan tersedia di pejabat PERHILITAN atau platform dalam talian negeri. Bawa IC dan simpan resit semasa memancing.",
      en: "Fishing licences in Malaysia are managed by each state — there is no single national licence for all waters.\n\nCommercial ponds and private jetties often do not require a state licence, but always confirm with the venue. Sea, public rivers, and government reservoirs usually need a licence or permit.\n\nDaily, weekly, and annual licences are sold at state PERHILITAN offices or online portals. Bring your ID and keep the receipt while fishing.",
      zh: "马来西亚钓鱼执照由各州自行管理，没有一张全国通用执照。\n\n商业钓场和私人码头通常不需要州执照，但仍建议向场方确认。海钓、公共河流和政府水库一般需要执照或许可证。\n\n日票、周票和年票可在州 PERHILITAN 办公室或线上购买。请携带身份证，并保留收据以备检查。",
    },
    category: "regulations",
    readMinutes: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
    publishedAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "guide-3",
    slug: "monsoon-fishing-guide",
    title: {
      ms: "Memancing Semasa Monsun: Musim Terbaik",
      en: "Fishing During Monsoon: Best Seasons",
      zh: "季风季节钓鱼指南",
    },
    excerpt: {
      ms: "Bila perlu memancing pantai timur vs barat semasa monsun.",
      en: "When to fish east vs west coast during monsoon season.",
      zh: "季风期间东海岸与西海岸钓鱼时机。",
    },
    body: {
      ms: "Malaysia mengalami monsun barat (Mei–Okt) dan monsun timur (Nov–Mac). Pantai barat Semenanjung lebih hujan lebat pada monsun barat; pantai timur pula lebih teruk semasa monsun timur.\n\nSemasa hujan lebat, elakkan jeti terbuka dan perhatikan amaran ribut. Kolam dalaman dan empangan sheltered masih boleh dimancing dengan selamat jika cuaca dibenarkan.\n\nMusim inter-monsun (Mac–April dan Okt–Nov) sering memberi angin lemah dan air jernih — sesuai untuk memancing pantai dan estuari.",
      en: "Malaysia sees the southwest monsoon (May–Oct) and northeast monsoon (Nov–Mar). The west coast of Peninsular Malaysia gets heavier rain during the southwest monsoon; the east coast is worst during the northeast monsoon.\n\nIn heavy rain, avoid exposed jetties and watch storm warnings. Sheltered ponds and inland dams can still fish safely when conditions allow.\n\nInter-monsoon windows (Mar–Apr and Oct–Nov) often bring lighter winds and clearer water — good for shore and estuary fishing.",
      zh: "马来西亚有西南季风（5–10 月）和东北季风（11–3 月）。半岛西海岸在西南季风期间雨势较大；东海岸则在东北季风期间受影响更明显。\n\n大雨时应避免开放码头，留意风暴预警。室内钓场和有遮蔽的水库在条件允许时仍可安全作钓。\n\n季风间歇期（3–4 月、10–11 月）常风小水清，适合岸钓和河口钓。",
    },
    category: "season",
    readMinutes: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1498654200943-1088dd4438ea?w=800&q=80",
    publishedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "guide-4",
    slug: "patin-pond-fishing-malaysia",
    title: {
      ms: "Memancing Patin di Kolam Berbayar",
      en: "Patin Pond Fishing in Malaysia",
      zh: "马来西亚巴丁鱼收费钓场指南",
    },
    excerpt: {
      ms: "Umpan, sesi, dan tip untuk kolam patin popular.",
      en: "Baits, sessions, and tips for popular patin ponds.",
      zh: "热门巴丁鱼塘的饵料、场次与技巧。",
    },
    body: {
      ms: "Kolam patin popular di Lembah Klang, Johor, dan Utara — sesi pagi/malam 4–6 jam.\n\nUmpan pellet + aroma patin, atau ikan kecil hidup. Rod medium 6–7 kaki, tali 20–30 lb.\n\nTanya yuran masuk, had tangkapan, dan sama ada live bait dibenarkan sebelum bayar.",
      en: "Patin ponds are popular across Klang Valley, Johor, and the north — morning/night sessions of 4–6 hours.\n\nUse pellet with patin scent or small live bait. Medium 6–7 ft rod, 20–30 lb line.\n\nAsk entry fee, keep limits, and live-bait rules before paying.",
      zh: "巴丁鱼塘在巴生谷、柔佛和北部都很常见——早场/夜场通常 4–6 小时。\n\n饵料可用巴丁味颗粒或小鱼活饵。中硬 6–7 尺竿，20–30 lb 线。\n\n付费前先问入场费、带走限制和是否允许活饵。",
    },
    category: "tips",
    readMinutes: 7,
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-77a415543845?w=800&q=80",
    publishedAt: "2026-02-15T00:00:00Z",
  },
  {
    id: "guide-5",
    slug: "shore-jetty-fishing-safety",
    title: {
      ms: "Keselamatan Memancing Jeti & Pantai",
      en: "Shore & Jetty Fishing Safety",
      zh: "岸钓与码头安全须知",
    },
    excerpt: {
      ms: "Slippery decks, ombak, dan gear asas untuk pemancing baru.",
      en: "Slippery decks, swell, and basic gear for new anglers.",
      zh: "湿滑码头、涌浪，以及新手必备装备。",
    },
    body: {
      ms: "Pakai kasut grip, jangan duduk di tepi jeti tanpa pagar. Perhatikan ombak dan bot lalu.\n\nBawa torch, first aid mini, dan air minum. Jangan memancing solo di jeti terpencil waktu malam.\n\nSimpul tali yang betul dan jaga jarak dari pemancing lain — especially semasa cast.",
      en: "Wear grippy shoes; avoid sitting on unguarded jetty edges. Watch swell and passing boats.\n\nBring a torch, mini first aid, and water. Avoid solo night fishing on remote jetties.\n\nTie solid knots and keep casting distance from other anglers.",
      zh: "穿防滑鞋，不要坐在无护栏的码头边缘。留意涌浪和过往船只。\n\n带上手电、简易急救包和饮用水。避免独自在偏远码头夜钓。\n\n打牢线结，抛投时与其他钓友保持距离。",
    },
    category: "gear",
    readMinutes: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1505118380757-91db5dda3b55?w=800&q=80",
    publishedAt: "2026-02-20T00:00:00Z",
  },
  {
    id: "guide-6",
    slug: "best-bait-freshwater-malaysia",
    title: {
      ms: "Umpan Terbaik Air Tawar Malaysia",
      en: "Best Freshwater Baits in Malaysia",
      zh: "马来西亚淡水钓最佳饵料",
    },
    excerpt: {
      ms: "Cacing, udang, ikan hidup & artificial untuk sungai dan tasik.",
      en: "Worms, prawns, live bait & lures for rivers and lakes.",
      zh: "蚯蚓、虾、活饵与假饵——河流和湖泊适用。",
    },
    body: {
      ms: "Sungai: cacing tanah, udang galah kecil, ikan hidup untuk haruan/sebarau.\n\nTasik/empangan: ikan kecil, udang, dan paste ikan untuk talapia/kelah.\n\nKolam: ikut spesies target — patin suka pellet, talapia suka paste.\n\nSimpan umpan hidup dalam bekas beroksigen dan jangan campur air laut ke air tawar.",
      en: "Rivers: earthworms, small prawns, live bait for haruan/sebarau.\n\nLakes/dams: small fish, prawns, and paste for talapia/kelah.\n\nPonds: match the target — patin likes pellet, talapia likes paste.\n\nKeep live bait aerated and never mix saltwater into freshwater bait.",
      zh: "河流：蚯蚓、小虾、活饵钓生鱼/西刀。\n\n湖泊/水坝：小鱼、虾、鱼糊钓罗非/吉罗。\n\n钓场：按目标鱼种——巴丁喜颗粒，罗非喜鱼糊。\n\n活饵要充氧保存，勿把海水混入淡水饵。",
    },
    category: "species",
    readMinutes: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1519709093765-457415791451?w=800&q=80",
    publishedAt: "2026-02-25T00:00:00Z",
  },
];

export function getSpotBySlug(slug: string): FishingSpot | undefined {
  return mockSpots.find((spot) => spot.slug === slug);
}

export function filterSpots(
  stateId?: string,
  districtId?: string,
  query?: string,
  areaId?: string,
): FishingSpot[] {
  const normalizedQuery = query?.trim().toLowerCase();

  return mockSpots.filter((spot) => {
    if (stateId && spot.stateId !== stateId) return false;
    if (districtId && spot.districtId !== districtId) return false;
    if (areaId && spot.areaId !== areaId) return false;
    if (normalizedQuery) {
      const haystack = spotSearchText(spot);
      const terms = normalizedQuery.split(/\s+/).filter(Boolean);
      if (!terms.every((term) => haystack.includes(term))) return false;
    }
    return true;
  });
}

export function filterActivities(
  stateId?: string,
  districtId?: string,
  sort: ActivitySort = "hot",
): Activity[] {
  return filterActivitiesByRegion(mockActivities, stateId, districtId, sort);
}

export function getActivityBySlug(slug: string): Activity | undefined {
  return mockActivities.find((activity) => activity.slug === slug);
}

export function filterForumPosts(category?: ForumCategory): ForumPost[] {
  const posts = category
    ? mockForumPosts.filter((p) => p.category === category)
    : [...mockForumPosts];

  return posts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.hotScore - a.hotScore;
  });
}

export function getListingBySlug(slug: string): MarketplaceListing | undefined {
  return mockListings.find((listing) => listing.slug === slug);
}

export function getArticleBySlug(slug: string): GuideArticle | undefined {
  return mockArticles.find((article) => article.slug === slug);
}

export function getForumPostBySlug(slug: string): ForumPost | undefined {
  return mockForumPosts.find((post) => post.slug === slug);
}

export function getForumRepliesForPost(postId: string): ForumReply[] {
  return mockForumReplies
    .filter((r) => r.postId === postId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
}

export function getCommentsForSpot(spotId: string): SpotComment[] {
  return mockSpotComments
    .filter((c) => c.spotId === spotId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}
