import type { LocalizedString } from "@/types";

export type FishHabitat = "freshwater" | "river" | "brackish" | "sea";
export type FishStyle = "bait" | "lure" | "both";

export interface FishSpecies {
  slug: string;
  name: LocalizedString;
  latinName: string;
  /** A local-name group can include multiple species. */
  taxonNote: LocalizedString;
  habitats: FishHabitat[];
  style: FishStyle;
  isHot: boolean;
  overview: LocalizedString;
  wildDiet: LocalizedString;
  baitTips: LocalizedString;
  lureTips: LocalizedString;
  starterRig: LocalizedString;
  photo: {
    src: string;
    credit: string;
    license: string;
    sourceUrl: string;
  };
  sourceUrl: string;
}

const L = (ms: string, en: string, zh: string): LocalizedString => ({ ms, en, zh });

export const FISH_HABITATS: FishHabitat[] = ["freshwater", "river", "brackish", "sea"];
export const FISH_STYLES: FishStyle[] = ["bait", "lure", "both"];

export const FISH_SPECIES: FishSpecies[] = [
  {
    slug: "haruan",
    name: L("Haruan", "Haruan · Striped snakehead", "乌鳢 · Haruan"),
    latinName: "Channa striata",
    taxonNote: L("Nama tempatan: haruan", "Common Malaysian name: haruan", "马来西亚常用名：Haruan"),
    habitats: ["freshwater", "river"],
    style: "lure",
    isHot: true,
    overview: L(
      "Haruan biasa ditemui di paya air tawar, parit, sungai tanah rendah dan air yang perlahan. Ia pemangsa; cari kawasan berumput atau berstruktur, tetapi minta izin dan semak peraturan dahulu.",
      "Haruan occurs in freshwater swamps, canals, lowland rivers and slow water. It is predatory; look around cover, but confirm access and local rules before fishing.",
      "Haruan 常见于淡水沼泽、沟渠、低地河流和缓流水域。它是掠食鱼；可留意水草和障碍物附近，但出钓前先确认进入许可和当地规则。",
    ),
    wildDiet: L("Ikan kecil, serangga, cacing dan krustasea.", "Small fish, insects, worms and crustaceans.", "小鱼、昆虫、蠕虫和甲壳类。"),
    baitTips: L("Cuba cacing atau umpan ikan kecil jika dibenarkan di lokasi.", "Try worms or small fish bait where the venue permits it.", "场地允许时，可试蚯蚓或小鱼饵。"),
    lureTips: L("Cuba soft plastic atau gewang katak weedless di tepi tumbuhan air.", "Try a weedless soft plastic or frog lure beside aquatic cover.", "可在水草边试用防挂软虫或蛙形路亚。"),
    starterRig: L("Set casting ringan-sederhana dengan leader tahan geseran dan soft plastic berkail tunggal. Kurangkan risiko tersangkut di kawasan berumput.", "Start with a light-to-medium casting setup, abrasion-resistant leader and a single-hook weedless soft plastic around cover.", "可从轻至中型路亚竿、耐磨前导线和单钩防挂软饵开始，在草区减少挂底。"),
    photo: { src: "/fish/haruan.jpg", credit: "renjus box", license: "CC BY 4.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Channa_striata_342778351.jpg" },
    sourceUrl: "https://www.fishbase.se/summary/Channa-striata.html",
  },
  {
    slug: "toman",
    name: L("Toman", "Toman · Giant snakehead", "巨型黑鱼 · Toman"),
    latinName: "Channa micropeltes",
    taxonNote: L("Nama tempatan: toman", "Common Malaysian name: toman", "马来西亚常用名：Toman"),
    habitats: ["freshwater", "river"],
    style: "lure",
    isHot: true,
    overview: L(
      "Toman mendiami tasik, paya, sungai tanah rendah dan saluran yang besar atau berarus perlahan. Ikan dewasa memburu ikan; cari kawasan air terbuka berhampiran struktur dan tumbuhan.",
      "Toman inhabit lakes, swamps, lowland rivers and larger slow-flowing channels. Adults prey mainly on fish; look for open water near structure and vegetation.",
      "Toman 常见于湖泊、沼泽、低地河流及较大的缓流水道。成鱼主要捕食鱼类，可留意障碍物和水草附近的开阔水域。",
    ),
    wildDiet: L("Terutamanya ikan, juga sesetengah krustasea.", "Mainly fish, with some crustaceans.", "主要吃鱼，也会吃一些甲壳类。"),
    baitTips: L("Umpan ikan hanya jika dibenarkan; semak peraturan umpan hidup setempat.", "Use fish bait only where allowed; check local rules on live bait.", "只有场地允许时才用鱼饵；先确认活饵规定。"),
    lureTips: L("Gewang permukaan, minnow atau soft swimbait boleh dicuba berhampiran kawasan toman memburu.", "Try a surface lure, minnow or soft swimbait near active feeding areas.", "可在鱼群捕食区域附近试水面路亚、米诺或软体游鱼饵。"),
    starterRig: L("Gunakan set casting lebih tegap dan leader yang sepadan dengan struktur serta saiz ikan. Pastikan ruang lontaran selamat dan jangan paksa ikan ke kawasan orang lain.", "Use a sturdier casting setup and leader matched to the cover and fish size. Check casting space and avoid forcing fish through other anglers.", "使用与障碍物和目标鱼体型相配的较强路亚装备和前导线。先确认抛投空间安全，不要把鱼强行拉向其他钓友。"),
    photo: { src: "/fish/toman.jpg", credit: "George Chernilevsky", license: "Public domain", sourceUrl: "https://commons.wikimedia.org/wiki/File:Channa_micropeltes_2012_G1.jpg" },
    sourceUrl: "https://www.fishbase.se/summary/Channa-micropeltes.html",
  },
  {
    slug: "sebarau",
    name: L("Sebarau", "Sebarau · Hampala barb", "马来大眼鲃 · Sebarau"),
    latinName: "Hampala macrolepidota",
    taxonNote: L("Ikan air tawar; nama Inggeris: Hampala barb", "Freshwater fish; English name: Hampala barb", "淡水鱼；英文名 Hampala barb"),
    habitats: ["river", "freshwater"],
    style: "lure",
    isHot: true,
    overview: L(
      "Sebarau banyak dikaitkan dengan sungai atau anak sungai yang jernih dan berarus, tetapi juga ditemui di tasik takungan. Cuba cari sempadan arus, lubuk dan struktur bawah air.",
      "Sebarau are associated with clear, flowing rivers and streams, and also occur in reservoirs. Look for current seams, pools and submerged structure.",
      "Sebarau 常见于清澈、有流水的河川和溪流，也会出现在水库。可留意流速交界、深潭和水下结构。",
    ),
    wildDiet: L("Ikan kecil dan serangga akuatik; diet berubah mengikut saiz dan lokasi.", "Small fish and aquatic insects; diet varies with size and location.", "小鱼和水生昆虫；食性会随体型和地点而变化。"),
    baitTips: L("Cacing atau umpan kecil boleh dicuba jika dibenarkan, tetapi ramai pemancing memburunya dengan gewang.", "Small worms or bait can be tried where permitted, though many anglers target it with lures.", "场地允许时可试小型虫饵；不少钓友会用路亚钓它。"),
    lureTips: L("Cuba minnow kecil, spoon atau spinner melintasi arus dan tepi lubuk.", "Try a small minnow, spoon or spinner across current seams and pool edges.", "可用小米诺、亮片或旋转亮片横向搜索流边和深潭边缘。"),
    starterRig: L("Set spinning ringan-sederhana dengan tali dan leader yang sesuai untuk arus serta batu. Kawal gewang merentasi arus; jangan berdiri di permukaan licin.", "Use a light-to-medium spinning setup with line and leader suited to current and rocks. Work the lure across the flow and avoid slippery banks.", "使用适合水流和石头环境的轻至中型纺车装备。让路亚横过水流搜索，并避开湿滑河岸。"),
    photo: { src: "/fish/sebarau.jpg", credit: "Sahat Ratmuangkhwang", license: "CC BY 3.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Hampala_macrolepidota.jpg" },
    sourceUrl: "https://www.fishbase.se/summary/Hampala-macrolepidota.html",
  },
  {
    slug: "siakap",
    name: L("Siakap", "Siakap · Asian seabass", "亚洲海鲈 · Siakap"),
    latinName: "Lates calcarifer",
    taxonNote: L("Juga dikenali sebagai barramundi", "Also known as barramundi or barramundi perch", "也称 Barramundi（澳洲金目鲈）"),
    habitats: ["brackish", "sea", "river"],
    style: "both",
    isHot: true,
    overview: L(
      "Siakap boleh hidup di laut, muara dan air tawar; ia sering dikaitkan dengan kawasan pesisir, lagun dan sungai. Kedalaman, pasang surut dan akses berbeza mengikut lokasi.",
      "Siakap can live in marine, estuarine and fresh water, and is found around coasts, lagoons and rivers. Depth, tide and access vary by location.",
      "Siakap 可生活于海水、河口和淡水环境，常见于海岸、潟湖和河流。水深、潮汐和进入许可因地点而异。",
    ),
    wildDiet: L("Ikan dan krustasea seperti udang.", "Fish and crustaceans such as prawns.", "鱼类和虾等甲壳类。"),
    baitTips: L("Udang atau umpan ikan boleh dicuba di kawasan muara jika dibenarkan.", "Try prawns or fish bait in estuaries where permitted.", "在场地允许的河口水域，可试虾或鱼饵。"),
    lureTips: L("Soft plastic, minnow atau gewang permukaan boleh disesuaikan dengan kedalaman dan arus.", "Match a soft plastic, minnow or surface lure to the depth and current.", "根据水深和水流，选择软饵、米诺或水面路亚。"),
    starterRig: L("Untuk umpan, mula dengan rig running sinker ringkas dan leader; untuk gewang, gunakan set spinning sepadan. Semak keadaan pasang dan peraturan lokasi.", "For bait, start with a simple running-sinker rig and leader; for lures, use a balanced spinning setup. Check tides and venue rules.", "用饵可从简单的活动铅坠钓组和前导线开始；用路亚则配平衡的纺车装备。先查潮汐和场地规定。"),
    photo: { src: "/fish/siakap.jpg", credit: "John Robert McPherson", license: "CC0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Lates_calcarifer_(barramundi),_Airlie_Beach_IMGP0254.jpg" },
    sourceUrl: "https://www.fishbase.se/summary/Lates-calcarifer.html",
  },
  {
    slug: "patin",
    name: L("Patin", "Patin catfish", "巴丁鱼 · Patin"),
    latinName: "Pangasiidae · several local species",
    taxonNote: L("Nama patin boleh merujuk beberapa spesies keluarga Pangasiidae; gambar menunjukkan Pangasianodon hypophthalmus.", "Patin is a local name used for several Pangasiidae catfishes; the photo shows Pangasianodon hypophthalmus.", "Patin 是当地对多种巨鲶科鱼类的统称之一；照片所示为 Pangasianodon hypophthalmus。"),
    habitats: ["freshwater", "river"],
    style: "bait",
    isHot: true,
    overview: L(
      "Patin yang diternak biasa ditemui di kolam; spesies liar hidup di sungai air tawar besar. Tanya operator tentang umpan, bayaran dan had tangkapan sebelum memancing di kolam.",
      "Farmed patin are common in fishing ponds; wild species occur in large freshwater rivers. Ask pond operators about bait, fees and catch rules before fishing.",
      "养殖 Patin 常见于钓鱼池，野生种则生活在大型淡水河流。去鱼塘前先问清楚可用饵料、收费和渔获规定。",
    ),
    wildDiet: L("Bagi striped catfish, diet bersifat omnivor termasuk ikan, krustasea dan bahan tumbuhan.", "Striped catfish are omnivorous, eating fish, crustaceans and plant matter.", "以条纹巨鲶为例，它是杂食性，会吃鱼、甲壳类和植物性食物。"),
    baitTips: L("Di kolam, cuba pelet atau doh yang diluluskan operator; umpan kegemaran berbeza mengikut kolam.", "At ponds, try operator-approved pellets or dough; preferred bait varies by venue.", "鱼塘可先试经营者允许的颗粒饵或面饵；不同鱼塘偏好的饵料会不同。"),
    lureTips: L("Patin biasanya lebih praktikal disasarkan dengan umpan; gewang bukan pilihan pertama.", "Patin are usually more practical to target with bait; lures are not the first choice.", "Patin 通常更适合用饵垂钓，路亚不是首选。"),
    starterRig: L("Rig dasar running sinker yang ringkas dengan perambut pendek. Padankan batu ladung dan tali dengan saiz ikan, kedalaman dan arus.", "Start with a simple running-sinker bottom rig and short hooklength. Match sinker and line to fish size, depth and current.", "从简单的活动铅坠底钓组和短子线开始；铅坠和钓线按鱼体型、水深和流速调整。"),
    photo: { src: "/fish/patin.png", credit: "Trương Minh Khải", license: "CC0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Pangasianodon_hypophthalmus_in_Dong_Nai_river,_Vietnam.png" },
    sourceUrl: "https://www.fishbase.se/summary/Pangasianodon-hypophthalmus",
  },
  {
    slug: "tilapia",
    name: L("Tilapia", "Tilapia", "罗非鱼 · Tilapia"),
    latinName: "Oreochromis spp. · common farmed species",
    taxonNote: L("Tilapia ialah nama umum; spesies dan kacukan berbeza mengikut kolam.", "Tilapia is a common name; species and hybrids vary by fishery.", "Tilapia 是常用俗名，不同鱼塘的种类和杂交品系可能不同。"),
    habitats: ["freshwater", "river"],
    style: "both",
    isHot: false,
    overview: L(
      "Tilapia biasa hidup di kolam, tasik dan sungai; sesetengah spesies juga tahan air payau. Keadaan kolam dan umpan yang dibenarkan berbeza, jadi semak dengan operator.",
      "Tilapia commonly live in ponds, lakes and rivers; some species tolerate brackish water. Pond conditions and permitted baits vary, so check with the operator.",
      "罗非鱼常见于鱼塘、湖泊和河流；部分种类也能耐受半咸水。鱼塘环境和允许饵料不同，出钓前先向经营者确认。",
    ),
    wildDiet: L("Banyak tilapia memakan alga, fitoplankton, larva serangga dan detritus.", "Many tilapia feed on algae, phytoplankton, insect larvae and detritus.", "许多罗非鱼会吃藻类、浮游植物、昆虫幼虫和碎屑。"),
    baitTips: L("Cuba doh, pelet atau roti kecil jika dibenarkan; gunakan sedikit umpan dahulu.", "Try dough, pellets or small bread bait where allowed; start with a small amount.", "场地允许时可试面饵、颗粒饵或小块面包；先少量打窝。"),
    lureTips: L("Gewang kecil boleh dicuba untuk ikan aktif; semak sama ada gewang dibenarkan di kolam.", "Small lures can be tried for active fish; check whether lures are allowed at the pond.", "鱼活跃时可试小型路亚；先确认鱼塘是否允许使用路亚。"),
    starterRig: L("Pelampung kecil dengan mata kail kecil ialah pilihan mudah; laraskan kedalaman supaya umpan hampir dengan dasar atau kawasan ikan makan.", "A small float and hook make a simple starter rig; adjust depth to present bait near the bottom or feeding zone.", "小浮漂配小钩容易上手；调整深度，让饵靠近底部或鱼群觅食层。"),
    photo: { src: "/fish/tilapia.jpg", credit: "Sahat Ratmuangkhwang", license: "CC BY 3.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Oreochromis_niloticus_Thailand.jpg" },
    sourceUrl: "https://www.fishbase.se/summary/Oreochromis-niloticus.html",
  },
  {
    slug: "keli",
    name: L("Keli", "Keli · Walking catfish group", "鲶鱼 · Keli"),
    latinName: "Clarias spp. · species vary by region",
    taxonNote: L("Nama keli merangkumi beberapa spesies Clarias; gambar contoh ialah Clarias batrachus.", "Keli refers to several Clarias species; the photo is Clarias batrachus.", "Keli 可指多种 Clarias 鲶鱼；照片示例为 Clarias batrachus。"),
    habitats: ["freshwater", "river"],
    style: "bait",
    isHot: false,
    overview: L(
      "Ikan keli boleh ditemui di kolam, paya, parit dan air tawar yang perlahan. Spesies sebenar berbeza mengikut tempat, dan kolam berbayar mungkin menetapkan umpan serta kaedah tertentu.",
      "Keli catfish occur in ponds, swamps, canals and slow freshwater. The exact species varies by place, and paid ponds may set bait and method rules.",
      "Keli 鲶鱼可见于鱼塘、沼泽、沟渠和缓流水域。各地实际种类可能不同，收费鱼塘也可能规定饵料和钓法。",
    ),
    wildDiet: L("Kumpulan Clarias boleh makan larva serangga, cacing, siput, udang kecil, ikan dan bahan tumbuhan.", "Clarias catfish can eat insect larvae, worms, snails, small prawns, fish and plant matter.", "Clarias 鲶鱼会吃昆虫幼虫、蠕虫、螺、小虾、鱼类和植物性食物。"),
    baitTips: L("Cuba cacing atau udang kecil; di kolam komersial ikut umpan yang ditetapkan operator.", "Try worms or small prawns; at commercial ponds, follow the operator's bait rules.", "可试蚯蚓或小虾；商业鱼塘请遵守经营者规定的饵料。"),
    lureTips: L("Umpan biasanya lebih mudah untuk pemula; soft plastic kecil boleh dicuba jika gewang dibenarkan.", "Bait is usually the easier starting point; try a small soft plastic only if lures are allowed.", "新手通常先用饵更容易；若场地允许路亚，也可试小型软饵。"),
    starterRig: L("Rig dasar ringkas atau pelampung yang membolehkan umpan berada dekat dasar. Gunakan playar untuk mengendalikan mata kail dengan selamat.", "Use a simple bottom or float rig that keeps bait near the bottom. Carry pliers for safer hook handling.", "使用能让饵靠近底部的简单底钓或浮漂钓组；备好钳子以便安全取钩。"),
    photo: { src: "/fish/keli.jpg", credit: "Vassil", license: "CC0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Aquarium_tropical_de_Pierrefitte-Nestalas_03082018_Clarias_batrachus_2.jpg" },
    sourceUrl: "https://www.fishbase.se/Summary/Clarias-batrachus",
  },
  {
    slug: "jenahak",
    name: L("Jenahak", "Jenahak · John's snapper", "约翰笛鲷 · Jenahak"),
    latinName: "Lutjanus johnii",
    taxonNote: L("Spesies snapper pesisir dan muara", "A coastal and estuarine snapper", "常见于近海及河口的笛鲷"),
    habitats: ["sea", "brackish"],
    style: "bait",
    isHot: false,
    overview: L(
      "Jenahak dewasa dikaitkan dengan kawasan marin dan struktur, sementara anak ikan ditemui di muara bakau. Semak kawasan perlindungan, had tangkapan dan peraturan lokasi sebelum memancing.",
      "Adult John's snapper are associated with marine structure, while juveniles occur in mangrove estuaries. Check protected areas, catch limits and local rules before fishing.",
      "成年 Jenahak 常见于海水结构区，幼鱼则可出现在红树林河口。出钓前确认保护区、渔获限制和当地规定。",
    ),
    wildDiet: L("Ikan serta haiwan dasar seperti udang, ketam dan sotong.", "Fish and bottom-dwelling prey such as prawns, crabs and cephalopods.", "鱼类，以及虾、蟹和头足类等底栖猎物。"),
    baitTips: L("Udang, sotong atau potongan ikan boleh dicuba mengikut arus dan umpan yang dibenarkan.", "Try prawns, squid or cut fish, matched to current and permitted bait.", "可按水流和场地规定尝试虾、鱿鱼或鱼块。"),
    lureTips: L("Jenahak biasanya lebih praktikal dicari dengan umpan dasar; gewang bukan pilihan utama.", "Bottom bait is usually the practical starting point for John's snapper; lures are not the first choice.", "钓 Jenahak 通常先考虑底钓用饵，路亚不是首选。"),
    starterRig: L("Rig dasar satu mata kail dengan batu ladung bergerak atau paternoster ringkas; laraskan berat kepada arus dan dasar.", "Start with a single-hook running-sinker or simple paternoster rig; match sinker weight to current and bottom.", "从单钩活动铅坠或简单天平钓组开始；铅坠重量按水流和海底调整。"),
    photo: { src: "/fish/jenahak.jpg", credit: "Rick Stuart-Smith / Reef Life Survey", license: "CC BY 3.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:LutjanusJohniiRLS.jpg" },
    sourceUrl: "https://www.fishbase.se/summary/Lutjanus-johnii.html",
  },
  {
    slug: "kembung",
    name: L("Ikan Kembung", "Kembung · Indian mackerel", "印度鲭 · Ikan Kembung"),
    latinName: "Rastrelliger kanagurta",
    taxonNote: L("Ikan pelagik laut; nama biasa Inggeris: Indian mackerel", "A marine pelagic fish; also called Indian mackerel", "海洋中上层鱼类；英文常名 Indian mackerel"),
    habitats: ["sea"],
    style: "both",
    isHot: false,
    overview: L(
      "Kembung hidup berkumpulan di teluk pesisir, pelabuhan dan lagun. Ia ikan pelagik; cari maklumat kawasan dan keselamatan bot daripada operator atau pemancing setempat.",
      "Kembung school in coastal bays, harbours and lagoons. They are pelagic; check local conditions and boat safety with the operator or local anglers.",
      "Kembung 常成群出现在沿岸海湾、港口和潟湖，属于中上层鱼类。出海前向船家或当地钓友确认海况和安全安排。",
    ),
    wildDiet: L("Fitoplankton dan zooplankton kecil; ikan dewasa juga memakan zooplankton lebih besar seperti larva udang dan ikan.", "Phytoplankton and small zooplankton; adults also take larger plankton such as shrimp and fish larvae.", "以浮游植物和小型浮游动物为食；成鱼也会吃较大的浮游生物，例如虾和鱼类幼体。"),
    baitTips: L("Cuba cebisan umpan kecil atau umpan ikan jika dibenarkan; kawanan ikan mungkin bergerak pantas.", "Try small bait pieces or fish bait where allowed; schools can move quickly.", "场地允许时可试小块饵或鱼饵；鱼群移动可能很快。"),
    lureTips: L("Micro jig, sabiki atau gewang kecil berkilat boleh dicuba untuk kawanan yang aktif.", "Try a micro-jig, sabiki or small shiny lure for active schools.", "鱼群活跃时可试微铁板、Sabiki 串钩或小型亮片路亚。"),
    starterRig: L("Gunakan set ringan dan sabiki/gewang kecil yang dibenarkan; jika menaiki bot, ikut arahan kru dan pakai jaket keselamatan.", "Use a light setup with a permitted sabiki or small lure; on a boat, follow crew directions and wear a life jacket.", "使用轻型装备和场地允许的 Sabiki 串钩或小路亚；乘船时听从船员指示并穿救生衣。"),
    photo: { src: "/fish/kembung.jpg", credit: "Sahat Ratmuangkhwang", license: "CC BY 3.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Rastrelliger_kanagurta_Thailand.jpg" },
    sourceUrl: "https://www.fishbase.se/summary/Rastrelliger-kanagurta.html",
  },
];

export const HOT_FISH = FISH_SPECIES.filter((fish) => fish.isHot);

export function getFishBySlug(slug: string): FishSpecies | undefined {
  return FISH_SPECIES.find((fish) => fish.slug === slug);
}
