import { curatedSpots } from "@/data/curated-spots";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { applyWikimediaPhotos } from "@/data/wikimedia-photos";
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

const seedSpots: FishingSpot[] = [
  {
    id: "spot-1",
    slug: "danga-bay-jetty",
    title: {
      ms: "Jeti Danga Bay",
      en: "Danga Bay Jetty",
      zh: "Danga Bay 码头",
    },
    description: {
      ms: "Jeti popular untuk memancing siakap dan jenahak. Parkir mudah, sesuai untuk keluarga.",
      en: "Popular jetty for barramundi and snapper. Easy parking, family-friendly.",
      zh: "热门码头，可钓金目鲈和石斑。停车方便，适合家庭。",
    },
    stateId: "johor",
    districtId: "johor-bahru",
    areaId: "danga-bay",
    coordinates: { lat: 1.4578, lng: 103.7225 },
    waterType: "saltwater",
    species: ["Siakap", "Jenahak", "Kembung"],
    facilities: ["Parking", "Toilet", "Shelter"],
    bestTime: {
      ms: "Pagi awal & malam",
      en: "Early morning & night",
      zh: "清晨和夜晚",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-77ef2d0cfcb6?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1544551763-77ef2d0cfcb6?w=800&q=80",
    ],
    tags: ["Siakap", "Jenahak", "Night fishing"],
    googleAddress: "Danga Bay Marina, Johor Bahru, Johor, Malaysia",
    googleMapsUrl: "https://www.google.com/maps?q=1.4578,103.7225",
    authorId: "demo-ahmad",
    authorName: "Ahmad F.",
    visibility: "public",
    isUserGenerated: true,
    featured: true,
    commentCount: 24,
    createdAt: "2026-03-01T08:00:00Z",
  },
  {
    id: "spot-2",
    slug: "pontian-coastal-rock",
    title: {
      ms: "Tebing Batu Pontian",
      en: "Pontian Coastal Rocks",
      zh: "笨珍沿海岩石区",
    },
    description: {
      ms: "Kawasan tebing batu untuk memancing ikan laut. Bawa lampu malam untuk hasil terbaik.",
      en: "Rocky coastal area for sea fishing. Bring night lights for best results.",
      zh: "沿海岩石钓点。建议带夜灯，效果更好。",
    },
    stateId: "johor",
    districtId: "pontian",
    areaId: "pontian-coast",
    coordinates: { lat: 1.4867, lng: 103.3894 },
    waterType: "saltwater",
    species: ["Talang", "Ebek", "Kerisi"],
    facilities: ["Street parking"],
    bestTime: {
      ms: "Malam hujung minggu",
      en: "Weekend nights",
      zh: "周末夜晚",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
    ],
    tags: ["Talang", "Rock fishing", "Night"],
    googleAddress: "Pontian Coastal Road, Pontian, Johor, Malaysia",
    googleMapsUrl: "https://www.google.com/maps?q=1.4867,103.3894",
    authorId: "demo-lee",
    authorName: "Lee W.",
    visibility: "public",
    isUserGenerated: true,
    featured: true,
    commentCount: 18,
    createdAt: "2026-02-20T10:00:00Z",
  },
  {
    id: "spot-3",
    slug: "klang-pond-fishing",
    title: {
      ms: "Kolam Memancing Klang",
      en: "Klang Pond Fishing",
      zh: "巴生钓鱼池",
    },
    description: {
      ms: "Kolam berbayar dengan patin dan keli. Sesuai untuk pemula dan kanak-kanak.",
      en: "Paid pond with patin and catfish. Great for beginners and kids.",
      zh: "收费鱼塘，有巴丁鱼和鲶鱼。适合新手和儿童。",
    },
    stateId: "selangor",
    districtId: "klang",
    areaId: "klang-town",
    coordinates: { lat: 3.0449, lng: 101.4455 },
    waterType: "pond",
    species: ["Patin", "Keli", "Lampam"],
    facilities: ["Parking", "Toilet", "Canteen", "Rod rental"],
    bestTime: {
      ms: "Pagi & petang",
      en: "Morning & afternoon",
      zh: "上午和下午",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2178?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2178?w=800&q=80",
    ],
    tags: ["Patin", "Pond", "Family"],
    googleAddress: "Klang Fishing Pond, Klang, Selangor, Malaysia",
    googleMapsUrl: "https://www.google.com/maps?q=3.0449,101.4455",
    authorId: "demo-raj",
    authorName: "Raj K.",
    visibility: "public",
    isUserGenerated: true,
    featured: false,
    commentCount: 31,
    createdAt: "2026-01-15T06:00:00Z",
  },
  {
    id: "spot-4",
    slug: "tanjung-bungah-pier",
    title: {
      ms: "Jeti Tanjung Bungah",
      en: "Tanjung Bungah Pier",
      zh: "丹绒bungah 码头",
    },
    description: {
      ms: "Pemandangan laut yang indah. Sesuai untuk memancing ringan dan fotografi.",
      en: "Beautiful sea views. Great for light fishing and photography.",
      zh: "海景优美，适合轻钓和摄影。",
    },
    stateId: "penang",
    districtId: "timur-laut",
    areaId: "tanjung-bungah",
    coordinates: { lat: 5.4632, lng: 100.2921 },
    waterType: "saltwater",
    species: ["Selar", "Kembung", "Jenahak"],
    facilities: ["Parking", "Food nearby"],
    bestTime: {
      ms: "Subuh & senja",
      en: "Dawn & dusk",
      zh: "黎明和黄昏",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1498654200943-1088dd4438ea?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1498654200943-1088dd4438ea?w=800&q=80",
    ],
    tags: ["Selar", "Jetty", "Scenic"],
    googleAddress: "Tanjung Bungah, Penang, Malaysia",
    googleMapsUrl: "https://www.google.com/maps?q=5.4632,100.2921",
    authorId: "demo-tan",
    authorName: "Tan M.L.",
    visibility: "public",
    isUserGenerated: true,
    featured: true,
    commentCount: 12,
    createdAt: "2026-02-28T04:00:00Z",
  },
  {
    id: "spot-5",
    slug: "stulang-laut-jetty",
    title: {
      ms: "Jeti Stulang Laut",
      en: "Stulang Laut Jetty",
      zh: "Stulang Laut 码头",
    },
    description: {
      ms: "Jeti popular JB — siakap malam, parkir senang.",
      en: "Popular JB jetty — night barramundi, easy parking.",
      zh: "新山热门码头，夜钓金目鲈，停车方便。",
    },
    stateId: "johor",
    districtId: "johor-bahru",
    areaId: "stulang-laut",
    coordinates: { lat: 1.4782, lng: 103.7812 },
    waterType: "saltwater",
    species: ["Siakap", "Kembung"],
    facilities: ["Parking", "Mamak nearby"],
    bestTime: { ms: "Malam", en: "Night", zh: "夜晚" },
    imageUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    ],
    tags: ["Siakap", "JB", "Night"],
    googleAddress: "Stulang Laut, Johor Bahru, Johor, Malaysia",
    googleMapsUrl: "https://www.google.com/maps?q=1.4782,103.7812",
    authorId: "demo-bob",
    authorName: "Bob T.",
    visibility: "public",
    isUserGenerated: true,
    featured: true,
    commentCount: 45,
    createdAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "spot-6",
    slug: "pulai-spring-pond",
    title: {
      ms: "Kolam Pulai Spring",
      en: "Pulai Spring Pond",
      zh: "Pulai Spring 钓鱼池",
    },
    description: {
      ms: "Kolam berbayar 20 min dari JB. Sesuai keluarga.",
      en: "Paid pond 20 min from JB. Family-friendly.",
      zh: "距新山 20 分钟收费鱼塘，适合家庭。",
    },
    stateId: "johor",
    districtId: "johor-bahru",
    areaId: "pulai",
    coordinates: { lat: 1.5512, lng: 103.8234 },
    waterType: "pond",
    species: ["Patin", "Lampam", "Keli"],
    facilities: ["Parking", "Canteen", "Rod rental"],
    bestTime: { ms: "Pagi", en: "Morning", zh: "上午" },
    imageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2178?w=800&q=80",
    photos: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2178?w=800&q=80",
    ],
    tags: ["Patin", "Pond", "Family"],
    googleAddress: "Pulai Spring, Johor Bahru, Johor, Malaysia",
    googleMapsUrl: "https://www.google.com/maps?q=1.5512,103.8234",
    authorId: "demo-sarah",
    authorName: "Sarah L.",
    visibility: "public",
    isUserGenerated: true,
    featured: false,
    commentCount: 22,
    createdAt: "2026-02-15T08:00:00Z",
  },
  ...curatedSpots,
];

export const mockSpots: FishingSpot[] = applyWikimediaPhotos(seedSpots);

export function getPublicSpots(spots: FishingSpot[]): FishingSpot[] {
  return spots.filter((s) => s.visibility === "public");
}

export const mockActivities: Activity[] = [
  {
    id: "act-1",
    slug: "jb-siakap-contest-2026",
    title: {
      ms: "Peraduan Siakap JB 2026",
      en: "JB Barramundi Contest 2026",
      zh: "新山金目鲈大赛 2026",
    },
    description: {
      ms: "Peraduan siakap terbesar di Johor Bahru. Hadiah utama RM5,000!",
      en: "Johor Bahru's biggest barramundi contest. Grand prize RM5,000!",
      zh: "新山最大金目鲈比赛，首奖 RM5,000！",
    },
    type: "contest",
    stateId: "johor",
    districtId: "johor-bahru",
    venue: {
      ms: "Danga Bay Marina",
      en: "Danga Bay Marina",
      zh: "Danga Bay  Marina",
    },
    organizer: "JB Anglers Club",
    verified: true,
    fee: 50,
    startDate: "2026-04-15T06:00:00Z",
    endDate: "2026-04-15T18:00:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    promoted: true,
    viewCount: 1240,
    interestCount: 89,
    contactWhatsApp: "60123456789",
  },
  {
    id: "act-2",
    slug: "tackle-world-mega-sale",
    title: {
      ms: "Jualan Mega Tackle World",
      en: "Tackle World Mega Sale",
      zh: "Tackle World 大促销",
    },
    description: {
      ms: "Diskaun sehingga 50% untuk rod, reel & lure. COD tersedia.",
      en: "Up to 50% off rods, reels & lures. COD available.",
      zh: "鱼竿、渔轮、假饵最高 5 折，支持 COD。",
    },
    type: "sale",
    stateId: "selangor",
    districtId: "petaling",
    venue: {
      ms: "Tackle World SS2",
      en: "Tackle World SS2",
      zh: "Tackle World SS2",
    },
    organizer: "Tackle World",
    verified: true,
    startDate: "2026-03-20T09:00:00Z",
    endDate: "2026-03-22T21:00:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1532015917327-7a360180f871?w=800&q=80",
    promoted: true,
    viewCount: 980,
    interestCount: 56,
    contactWhatsApp: "60198765432",
  },
  {
    id: "act-3",
    slug: "beginner-lure-workshop",
    title: {
      ms: "Bengkel Lure untuk Pemula",
      en: "Beginner Lure Fishing Workshop",
      zh: "新手路亚工作坊",
    },
    description: {
      ms: "Belajar teknik lure asas dengan jurulatih berpengalaman. Peralatan disediakan.",
      en: "Learn basic lure techniques with experienced coaches. Gear provided.",
      zh: "资深教练教授基础路亚技巧，提供装备。",
    },
    type: "workshop",
    stateId: "penang",
    districtId: "timur-laut",
    venue: {
      ms: "Gurney Drive",
      en: "Gurney Drive",
      zh: "Gurney Drive",
    },
    organizer: "Penang Fishing Academy",
    verified: false,
    fee: 80,
    startDate: "2026-04-05T08:00:00Z",
    endDate: "2026-04-05T12:00:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    promoted: false,
    viewCount: 340,
    interestCount: 22,
    contactWhatsApp: "60111222333",
  },
  {
    id: "act-4",
    slug: "kk-deep-sea-meetup",
    title: {
      ms: "Meetup Memancing Laut Dalam KK",
      en: "KK Deep Sea Fishing Meetup",
      zh: "亚庇深海钓鱼聚会",
    },
    description: {
      ms: "Perjumpaan pemancing untuk trip laut dalam. Tempat terhad, daftar awal.",
      en: "Anglers meetup for deep sea trips. Limited slots, register early.",
      zh: "深海钓鱼聚会，名额有限，请尽早报名。",
    },
    type: "meetup",
    stateId: "sabah",
    districtId: "kota-kinabalu",
    venue: {
      ms: "Jesselton Point",
      en: "Jesselton Point",
      zh: "Jesselton Point",
    },
    organizer: "Sabah Anglers Network",
    verified: true,
    fee: 120,
    startDate: "2026-05-10T05:00:00Z",
    endDate: "2026-05-10T17:00:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-77ef2d0cfcb6?w=800&q=80",
    promoted: true,
    viewCount: 760,
    interestCount: 45,
    contactWhatsApp: "60187654321",
  },
  {
    id: "act-5",
    slug: "melaka-river-fishing-day",
    title: {
      ms: "Hari Memancing Sungai Melaka",
      en: "Melaka River Fishing Day",
      zh: "马六甲河钓日",
    },
    description: {
      ms: "Acara keluarga di tebing sungai. Kanak-kanak dialu-alukan.",
      en: "Family event by the riverbank. Kids welcome.",
      zh: "河畔家庭钓鱼活动，欢迎儿童参加。",
    },
    type: "meetup",
    stateId: "melaka",
    districtId: "melaka-tengah",
    venue: {
      ms: "Sungai Melaka",
      en: "Melaka River",
      zh: "马六甲河",
    },
    organizer: "Melaka Fishing Club",
    verified: false,
    startDate: "2026-04-20T07:00:00Z",
    endDate: "2026-04-20T14:00:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
    promoted: false,
    viewCount: 210,
    interestCount: 18,
    contactWhatsApp: "60155667788",
  },
  {
    id: "act-6",
    slug: "ipoh-tackle-swap",
    title: {
      ms: "Swap Meet Peralatan Ipoh",
      en: "Ipoh Tackle Swap Meet",
      zh: "怡保渔具交换会",
    },
    description: {
      ms: "Bawa peralatan terpakai untuk tukar-tukar atau jual. Tiada yuran masuk.",
      en: "Bring used gear to swap or sell. Free entry.",
      zh: "带来二手渔具交换或出售，免费入场。",
    },
    type: "sale",
    stateId: "perak",
    districtId: "ipoh",
    venue: {
      ms: "Dataran Ipoh",
      en: "Ipoh Square",
      zh: "怡保广场",
    },
    organizer: "Perak Anglers",
    verified: true,
    startDate: "2026-03-28T09:00:00Z",
    endDate: "2026-03-28T16:00:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1532015917327-7a360180f871?w=800&q=80",
    promoted: false,
    viewCount: 430,
    interestCount: 31,
    contactWhatsApp: "60199887766",
  },
];

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
  {
    id: "sc-2",
    spotId: "spot-1",
    authorName: "Lee W.",
    body: {
      ms: "Parkir penuh hujung minggu. Datang awal!",
      en: "Parking fills up on weekends. Come early!",
      zh: "周末停车位很满，要早点到！",
    },
    createdAt: "2026-03-05T14:20:00Z",
  },
  {
    id: "sc-3",
    spotId: "spot-1",
    authorName: "Raj K.",
    body: {
      ms: "Malam pun boleh, tapi bawa lampu kuat.",
      en: "Night fishing works too, bring strong lights.",
      zh: "晚上也能钓，但要带好灯光。",
    },
    createdAt: "2026-03-01T20:15:00Z",
  },
  {
    id: "sc-4",
    spotId: "spot-2",
    authorName: "Hafiz R.",
    body: {
      ms: "Talang banyak lepas hujan. Jig head 40g recommended.",
      en: "Lots of queenfish after rain. 40g jig head recommended.",
      zh: "雨后皇后鱼很多，建议 40g 铅头钩。",
    },
    createdAt: "2026-02-28T09:00:00Z",
  },
  {
    id: "sc-5",
    spotId: "spot-3",
    authorName: "Chen M.",
    body: {
      ms: "Sesuai untuk anak-anak. Patin banyak hujung minggu.",
      en: "Great for kids. Lots of patin on weekends.",
      zh: "适合带孩子，周末巴丁鱼很多。",
    },
    createdAt: "2026-02-25T11:45:00Z",
  },
];

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
    category: "season",
    readMinutes: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1498654200943-1088dd4438ea?w=800&q=80",
    publishedAt: "2026-01-10T00:00:00Z",
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

function activityHotScore(activity: Activity): number {
  return (
    (activity.promoted ? 1000 : 0) +
    activity.interestCount * 3 +
    activity.viewCount * 0.1
  );
}

export function filterActivities(
  stateId?: string,
  districtId?: string,
  sort: ActivitySort = "hot",
): Activity[] {
  let results = mockActivities.filter((activity) => {
    if (stateId && activity.stateId !== stateId) return false;
    if (districtId && activity.districtId !== districtId) return false;
    return true;
  });

  if (sort === "hot") {
    results = [...results].sort(
      (a, b) => activityHotScore(b) - activityHotScore(a),
    );
  } else {
    results = [...results].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  }

  return results;
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
