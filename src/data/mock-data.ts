import type {
  Activity,
  FishingSpot,
  GuideArticle,
  MarketplaceListing,
} from "@/types";

export const mockSpots: FishingSpot[] = [
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
    authorName: "Ahmad F.",
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
    authorName: "Lee W.",
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
    authorName: "Raj K.",
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
    authorName: "Tan M.L.",
    featured: true,
    commentCount: 12,
    createdAt: "2026-02-28T04:00:00Z",
  },
];

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
): FishingSpot[] {
  return mockSpots.filter((spot) => {
    if (stateId && spot.stateId !== stateId) return false;
    if (districtId && spot.districtId !== districtId) return false;
    return true;
  });
}
