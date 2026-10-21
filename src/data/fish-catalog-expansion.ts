import type { LocalizedString } from "@/types";
import type { FishSpecies } from "@/data/fish-catalog";
import photoSourcesJson from "@/data/fish-photo-sources.json";

const L = (ms: string, en: string, zh: string): LocalizedString => ({ ms, en, zh });

type AdviceGroup =
  | "river-carp"
  | "gourami"
  | "snakehead"
  | "river-catfish"
  | "river-predator"
  | "reef-predator"
  | "shore-predator"
  | "schooling"
  | "bottom-marine"
  | "threadfin"
  | "mullet"
  | "pelagic-predator";

interface ExpansionInput {
  slug: string;
  ms: string;
  en: string;
  zh: string;
  latin: string;
  habitats: FishSpecies["habitats"];
  style: FishSpecies["style"];
  advice: AdviceGroup;
  hot?: boolean;
  overview: LocalizedString;
  caution?: LocalizedString;
  fishbaseSlug?: string;
  photo?: FishSpecies["photo"];
}

interface PhotoSource {
  slug: string;
  fileName: string;
  credit: string;
  license: string;
  sourceUrl: string;
}

const photoBySlug = new Map(
  (photoSourcesJson as PhotoSource[]).map((photo) => [photo.slug, photo]),
);

const guidance: Record<AdviceGroup, Pick<FishSpecies, "wildDiet" | "baitTips" | "lureTips" | "starterRig">> = {
  "river-carp": {
    wildDiet: L("Diet berubah mengikut spesies, saiz dan sungai; kebanyakannya mengambil bahan tumbuhan serta makanan kecil.", "Diet varies by species, size and river; many take plant matter and small aquatic food.", "食性会随鱼种、体型和河流而变；不少会吃植物性食物和水中小生物。"),
    baitTips: L("Cuba roti, doh, jagung atau pelet yang dibenarkan, bermula dengan sedikit umpan.", "Try bread, dough, corn or permitted pellets, starting with a small amount of feed.", "场地允许时可试面包、面饵、玉米或颗粒饵，先少量打窝。"),
    lureTips: L("Umpan biasanya pilihan mudah; gewang kecil hanya wajar dicuba jika ikan aktif dan dibenarkan.", "Bait is usually the easier start; try a small lure only when fish are active and it is allowed.", "用饵通常较容易入门；鱼活跃且场地允许时才试小型路亚。"),
    starterRig: L("Gunakan pelampung atau rig dasar ringan dengan mata kail kecil. Padankan kedalaman dengan lapisan ikan makan.", "Use a float or light bottom rig with a small hook. Match depth to the feeding layer.", "可用浮漂或轻型底钓组配小钩，并按鱼群觅食水层调整深度。"),
  },
  gourami: {
    wildDiet: L("Ikan ini mengambil gabungan bahan tumbuhan dan haiwan kecil; diet serta tabiat makan berbeza mengikut habitat.", "It takes a mix of plant material and small animals; diet and feeding habits vary by habitat.", "它会吃植物性食物和小型动物；食性与进食习惯会随栖息地而不同。"),
    baitTips: L("Cuba doh, roti atau pelet jika dibenarkan oleh pengusaha kolam atau peraturan lokasi.", "Try dough, bread or pellets where the pond operator or venue rules permit them.", "鱼塘经营者或场地规定允许时，可试面饵、面包或颗粒饵。"),
    lureTips: L("Umpan lebih praktikal untuk permulaan; gewang bukan pilihan utama bagi kumpulan ini.", "Bait is more practical to start; lures are not the first choice for this group.", "入门通常先用饵较实际；这类鱼一般不以路亚为首选。"),
    starterRig: L("Mulakan dengan pelampung kecil atau rig dasar mudah dan mata kail kecil. Tanya operator tentang umpan yang dibenarkan.", "Start with a small float or simple bottom rig and a small hook. Ask the operator which baits are allowed.", "可从小浮漂或简单底钓组配小钩开始，并先问经营者允许使用哪些饵料。"),
  },
  snakehead: {
    wildDiet: L("Ikan pemangsa ini mengambil ikan kecil dan haiwan akuatik lain; tabiat berubah mengikut saiz dan habitat.", "This predator takes small fish and other aquatic animals; habits change with size and habitat.", "这种掠食鱼会吃小鱼和其他水生动物；习性会随体型和栖息地改变。"),
    baitTips: L("Cuba cacing atau umpan ikan hanya jika dibenarkan. Semak peraturan umpan hidup di lokasi.", "Try worms or fish bait only where permitted. Check local rules on live bait.", "场地允许时可试蚯蚓或鱼饵；先确认当地活饵规定。"),
    lureTips: L("Soft plastic, minnow atau gewang permukaan boleh dicuba berhampiran litupan; pastikan ruang lontaran selamat.", "Try a soft plastic, minnow or surface lure near cover; keep casting space safe.", "可在障碍物附近试软饵、米诺或水面路亚，并确认抛投空间安全。"),
    starterRig: L("Gunakan set spinning ringan-sederhana dengan leader tahan geseran; laraskan kekuatan kepada tumbuhan dan struktur.", "Use a light-to-medium spinning setup with an abrasion-resistant leader; match strength to cover and structure.", "使用轻至中型纺车装备和耐磨前导线；按水草与障碍物调整装备强度。"),
  },
  "river-catfish": {
    wildDiet: L("Sesetengah spesies memakan haiwan dasar, ikan kecil dan bahan lain; diet tepat bergantung pada spesies.", "Some species take bottom-dwelling animals, small fish and other food; exact diet depends on species.", "部分鱼种会吃底栖动物、小鱼和其他食物；具体食性视鱼种而定。"),
    baitTips: L("Cuba cacing, udang atau potongan ikan kecil jika dibenarkan; di kolam, ikut peraturan operator.", "Try worms, prawns or small fish pieces where allowed; at ponds, follow the operator's rules.", "场地允许时可试蚯蚓、虾或小块鱼肉；鱼塘请遵守经营者规定。"),
    lureTips: L("Umpan biasanya permulaan yang lebih praktikal; gewang kecil hanya jika ikan aktif dan dibenarkan.", "Bait is usually the practical starting point; try a small lure only if fish are active and it is allowed.", "用饵通常更适合作为起点；鱼活跃且场地允许时才试小型路亚。"),
    starterRig: L("Rig dasar ringkas atau pelampung dengan perambut yang sesuai. Sediakan playar untuk mengendalikan mata kail.", "Use a simple bottom or float rig with a suitable hooklength. Carry pliers for safer hook handling.", "可用简单底钓组或浮漂配合适子线；备好钳子以便安全取钩。"),
  },
  "river-predator": {
    wildDiet: L("Pemangsa sungai ini memburu ikan kecil dan haiwan akuatik; persekitaran menentukan tempat ia mencari makan.", "This river predator hunts small fish and aquatic animals; local structure affects where it feeds.", "这种河流掠食鱼会捕食小鱼和水生动物；当地水下结构会影响其觅食位置。"),
    baitTips: L("Umpan ikan boleh dicuba jika dibenarkan; elakkan umpan hidup jika peraturan melarangnya.", "Fish bait can be tried where allowed; avoid live bait if venue rules prohibit it.", "场地允许时可试鱼饵；若规定禁止活饵就不要使用。"),
    lureTips: L("Cuba minnow atau soft plastic di tepi arus dan struktur; ubah saiz mengikut keadaan air.", "Try a minnow or soft plastic along current seams and structure; adjust size to conditions.", "可沿流边和水下结构试米诺或软饵，并按水况调整尺寸。"),
    starterRig: L("Pilih set spinning sederhana dan leader yang sesuai dengan arus, batu serta saiz sasaran.", "Use a medium spinning setup with leader suited to current, rocks and target size.", "使用适中纺车装备，前导线按水流、石头和目标鱼体型选择。"),
  },
  "reef-predator": {
    wildDiet: L("Kerapu dan snapper ialah pemangsa; ikan kecil serta haiwan laut lain menjadi sebahagian daripada diet.", "Groupers and snappers are predators; small fish and other marine animals form part of their diet.", "石斑和笛鲷属于掠食鱼，会捕食小鱼和其他海洋动物。"),
    baitTips: L("Udang, sotong atau potongan ikan boleh dicuba mengikut arus dan peraturan bot atau lokasi.", "Try prawns, squid or cut fish matched to current and boat or venue rules.", "可按水流和船家或场地规定尝试虾、鱿鱼或鱼块。"),
    lureTips: L("Cuba jig atau soft plastic mengikut kedalaman; elakkan lontaran berhampiran orang dan struktur sensitif.", "Try a jig or soft plastic matched to depth; keep casts clear of people and sensitive structure.", "按水深尝试铁板或软饵；远离人群及敏感结构抛投。"),
    starterRig: L("Set sederhana-teguh dengan leader disesuaikan kepada struktur dan arus. Semak kawasan perlindungan dan had tangkapan.", "Use medium-to-sturdy tackle with leader matched to structure and current. Check protected-area and catch rules.", "使用适中偏强的装备，前导线按结构与水流选择；先查保护区和渔获规定。"),
  },
  "shore-predator": {
    wildDiet: L("Pemangsa pesisir ini memburu ikan dan haiwan kecil; kawanan mangsa serta arus boleh mengubah lokasinya.", "This coastal predator hunts fish and small animals; bait schools and current can shift where it feeds.", "这种沿岸掠食鱼会捕食鱼类和小型动物；饵鱼群和水流可能改变其位置。"),
    baitTips: L("Potongan ikan atau udang boleh dicuba jika dibenarkan; padankan umpan dengan arus dan kedalaman.", "Try fish strips or prawns where permitted; match bait to current and depth.", "场地允许时可试鱼块或虾，并按水流和水深调整饵料。"),
    lureTips: L("Cuba minnow, spoon atau gewang permukaan mengikut kedalaman; gunakan leader yang sesuai untuk spesies.", "Try a minnow, spoon or surface lure to suit depth; use a leader appropriate for the species.", "按水深尝试米诺、亮片或水面路亚，并使用适合该鱼种的前导线。"),
    starterRig: L("Set spinning sederhana dengan leader yang sesuai dan ruang lontaran selamat. Di bot, pakai jaket keselamatan.", "Use a medium spinning setup with a suitable leader and safe casting space. Wear a life jacket on boats.", "使用适中纺车装备和合适前导线，并确保抛投空间安全；乘船时穿救生衣。"),
  },
  schooling: {
    wildDiet: L("Ikan pelagik kecil ini memakan plankton atau haiwan kecil di air; kawanan bergerak mengikut keadaan setempat.", "This small pelagic fish feeds on plankton or tiny animals in the water; schools move with local conditions.", "这种小型中上层鱼会吃浮游生物或水中小动物；鱼群会随当地环境移动。"),
    baitTips: L("Cuba cebisan kecil udang atau ikan pada mata kail kecil jika dibenarkan.", "Try small pieces of prawn or fish on small hooks where permitted.", "场地允许时，可用小钩尝试虾肉或鱼肉小块。"),
    lureTips: L("Sabiki, micro-jig atau gewang kecil boleh dicuba untuk kawanan yang aktif; ikut had mata kail.", "Try a sabiki, micro-jig or small lure for active schools; follow hook limits.", "鱼群活跃时可试 Sabiki 串钩、微铁板或小路亚，并遵守钩数规定。"),
    starterRig: L("Gunakan set ringan dan tali yang sesuai. Jika memancing dari bot, jauhi kipas dan ikut arahan kru.", "Use light tackle and suitable line. From a boat, stay clear of propellers and follow crew instructions.", "使用轻型装备和合适钓线；乘船时远离螺旋桨并听从船员指示。"),
  },
  "bottom-marine": {
    wildDiet: L("Ikan dasar ini mencari makanan dekat dasar; udang, cacing laut dan haiwan kecil boleh menjadi sebahagian daripada diet.", "This bottom fish forages near the seabed; prawns, marine worms and small animals may be part of its diet.", "这种底层鱼会在海底附近觅食；虾、海虫和小型动物可能是其食物。"),
    baitTips: L("Cuba udang, sotong atau potongan ikan kecil mengikut arus dan umpan yang dibenarkan.", "Try prawns, squid or small fish pieces matched to current and permitted baits.", "可按水流和场地规定尝试虾、鱿鱼或小块鱼肉。"),
    lureTips: L("Umpan dasar biasanya lebih praktikal; gewang bukan pilihan pertama untuk kumpulan ini.", "Bottom bait is usually more practical; lures are not the first choice for this group.", "底钓用饵通常更实用；这类鱼一般不以路亚为首选。"),
    starterRig: L("Mulakan dengan rig dasar satu mata kail dan batu ladung yang sepadan dengan arus serta dasar.", "Start with a single-hook bottom rig and sinker matched to current and seabed.", "从单钩底钓组开始，铅坠重量按水流和海底情况选择。"),
  },
  threadfin: {
    wildDiet: L("Threadfin memakan haiwan dasar kecil dan ikan; diet sebenar berubah mengikut saiz serta habitat.", "Threadfin take small bottom-dwelling animals and fish; exact diet changes with size and habitat.", "马鲅类会吃小型底栖动物和鱼类；具体食性会随体型与栖息地改变。"),
    baitTips: L("Udang atau cebisan ikan boleh dicuba berhampiran muara dan pantai jika dibenarkan.", "Try prawns or fish strips near estuaries and coasts where permitted.", "河口和海岸场地允许时，可试虾或鱼肉条。"),
    lureTips: L("Umpan biasanya pilihan awal yang lebih mudah; gewang kecil hanya apabila ikan aktif.", "Bait is usually the easier first choice; try a small lure only when fish are active.", "用饵通常是较容易的起点；鱼活跃时才试小型路亚。"),
    starterRig: L("Gunakan rig dasar ringan-sederhana dengan perambut yang sesuai untuk arus dan dasar berpasir.", "Use a light-to-medium bottom rig with a hooklength suited to current and sandy bottom.", "使用轻至中型底钓组，子线按水流和沙底情况选择。"),
  },
  mullet: {
    wildDiet: L("Belanak meragut bahan organik, alga dan organisma kecil; pemakanan berubah mengikut perairan.", "Mullets graze organic matter, algae and small organisms; feeding varies by waterway.", "鲻鱼会摄食有机物、藻类和小生物；进食方式随水域变化。"),
    baitTips: L("Cuba roti atau doh dalam cebisan kecil jika dibenarkan, dan gunakan mata kail halus.", "Try small pieces of bread or dough where allowed, using a fine hook.", "场地允许时，可用小块面包或面饵配细钩。"),
    lureTips: L("Belanak biasanya lebih praktikal dipancing dengan umpan halus; gewang bukan pilihan utama.", "Fine bait is usually more practical for mullet; lures are not the first choice.", "钓鲻鱼通常以细饵更实际，路亚不是首选。"),
    starterRig: L("Gunakan pelampung halus atau rig dasar ringan; perhatikan kedalaman dan kejernihan air.", "Use a fine float or light bottom rig; watch depth and water clarity.", "可用细浮漂或轻型底钓组，并留意水深与水体清澈度。"),
  },
  "pelagic-predator": {
    wildDiet: L("Pemangsa laut ini mengejar ikan dan sesetengahnya juga mengambil sotong; diet berbeza mengikut spesies.", "This marine predator chases fish and some also take squid; diet differs by species.", "这种海洋掠食鱼会追捕鱼类，部分也吃鱿鱼；食性因鱼种而异。"),
    baitTips: L("Umpan ikan atau sotong boleh dicuba mengikut arahan operator dan keadaan laut.", "Try fish or squid bait according to operator guidance and sea conditions.", "可按船家指引和海况尝试鱼饵或鱿鱼。"),
    lureTips: L("Cuba minnow, jig logam atau gewang trolling yang sepadan dengan kedalaman; sesuaikan leader dengan ikan sasaran.", "Try a minnow, metal jig or trolling lure matched to depth; match the leader to target fish.", "按水深尝试米诺、金属铁板或拖钓路亚，并按目标鱼选择前导线。"),
    starterRig: L("Gunakan set sederhana-teguh dan periksa drag serta leader sebelum melontar. Di bot, pakai jaket keselamatan.", "Use medium-to-sturdy tackle and check drag and leader before casting. Wear a life jacket on boats.", "使用适中偏强的装备，抛投前检查泄力与前导线；乘船时穿救生衣。"),
  },
};

const expansion: ExpansionInput[] = [
  { slug: "lampam-sungai", ms: "Lampam Sungai", en: "Lampam Sungai · Tinfoil barb", zh: "红尾银鲃 · Lampam Sungai", latin: "Barbonymus schwanenfeldii", habitats: ["freshwater", "river"], style: "both", advice: "river-carp", hot: true, overview: L("Lampam Sungai ialah ikan air tawar asli yang disenaraikan oleh Jabatan Perikanan Malaysia; bezakan daripada Lampam Jawa.", "Lampam Sungai is a Malaysian native freshwater fish; distinguish it from Lampam Jawa.", "Lampam Sungai 是马来西亚本地淡水鱼；请与 Lampam Jawa 区分。"), photo: { src: "/fish/lampam-sungai.jpg", credit: "Derek Ramsey (Ram-Man)", license: "CC BY-SA 2.5", sourceUrl: "https://commons.wikimedia.org/wiki/File:Tinfoil_Barb_700.jpg" }, fishbaseSlug: "Barbonymus-schwanenfeldii" },
  { slug: "jelawat", ms: "Jelawat", en: "Jelawat · Hoven's carp", zh: "赫氏鲤 · Jelawat", latin: "Leptobarbus hoevenii", habitats: ["freshwater", "river"], style: "both", advice: "river-carp", hot: true, overview: L("Jelawat ialah ikan sungai tempatan bersaiz besar dan juga diternak; akses serta umpan yang dibenarkan bergantung pada lokasi.", "Jelawat are large local river fish and are also farmed; access and permitted bait depend on the venue.", "Jelawat 是本地大型河鱼，也有养殖；能否进入及允许用饵须按场地确认。") },
  { slug: "temoleh", ms: "Temoleh", en: "Temoleh · Jullien's golden carp", zh: "朱氏金鲤 · Temoleh", latin: "Probarbus jullieni", habitats: ["freshwater", "river"], style: "both", advice: "river-carp", overview: L("Temoleh ialah ikan sungai tempatan yang disenaraikan dalam poster spesies asli Jabatan Perikanan; semak status dan peraturan tangkapan sebelum menyasarkan ikan ini.", "Temoleh is listed among Malaysia's native fishes by the Department of Fisheries; check current catch rules before targeting it.", "Temoleh 列于马来西亚渔业局本地原生鱼名单；针对它垂钓前请确认最新渔获规定。"), caution: L("Semak peraturan pemuliharaan dan pelepasan setempat sebelum memancing.", "Check current local conservation and release rules before fishing.", "出钓前确认当地保育与放流规定。") },
  { slug: "lomah", ms: "Lomah", en: "Lomah · Small-scale mud carp", zh: "细鳞鲴 · Lomah", latin: "Thynnichthys thynnoides", habitats: ["freshwater", "river"], style: "bait", advice: "river-carp", overview: L("Lomah ialah ikan air tawar tempatan yang dicatat di sungai dan tasik; maklumat tangkapan setempat lebih berguna daripada mengandaikan ia ada di setiap lokasi.", "Lomah are recorded in local freshwater rivers and lakes; recent local catch reports are more useful than assuming they occur everywhere.", "Lomah 见于本地淡水河流和湖泊；当地近期渔获信息比假设每处都有更可靠。") },
  { slug: "terbul", ms: "Terbul", en: "Terbul · Bonylip barb", zh: "厚唇鲃 · Terbul", latin: "Osteochilus vittatus", habitats: ["freshwater", "river"], style: "both", advice: "river-carp", overview: L("Terbul ialah ikan air tawar yang direkodkan di Malaysia; spesimen dan saiz di sesuatu sungai boleh berbeza.", "Terbul are recorded in Malaysian freshwater; specimens and size can vary between rivers.", "Terbul 是马来西亚淡水鱼；不同河流的鱼体和体型可能不同。") },
  { slug: "tengalan", ms: "Tengalan", en: "Tengalan · Bulu barb", zh: "布鲁鲃 · Tengalan", latin: "Puntioplites bulu", habitats: ["freshwater", "river"], style: "both", advice: "river-carp", overview: L("Tengalan disenaraikan sebagai ikan asli air tawar Malaysia; semak kebenaran akses sungai dan gunakan umpan yang tidak melanggar aturan setempat.", "Tengalan are listed among Malaysia's native freshwater fishes; confirm river access and use only permitted bait.", "Tengalan 列于马来西亚本地淡水鱼名单；先确认河流进入许可，并遵守用饵规定。") },
  { slug: "ketutu", ms: "Ketutu · Ikan hantu", en: "Ketutu · Marble goby", zh: "云斑尖塘鳢 · Ketutu", latin: "Oxyeleotris marmorata", habitats: ["freshwater", "river"], style: "bait", advice: "river-predator", hot: true, overview: L("Ketutu sering bersembunyi berhampiran dasar dan struktur di air tawar yang tenang; periksa dasar sebelum meletakkan rig.", "Ketutu often hide near the bottom and structure in still freshwater; check the bottom before placing a rig.", "Ketutu 常躲在静水底部和障碍物附近；下钓组前先确认水底状况。") },
  { slug: "temakang", ms: "Temakang", en: "Temakang · Kissing gourami", zh: "吻鲈 · Temakang", latin: "Helostoma temminckii", habitats: ["freshwater", "river"], style: "bait", advice: "gourami", overview: L("Temakang ialah ikan air tawar yang boleh ditemui di kolam, paya dan sungai perlahan; tumbuhan air dan peraturan lokasi mempengaruhi cara memancing.", "Temakang occur in ponds, swamps and slow rivers; aquatic plants and venue rules affect how to fish.", "Temakang 可见于鱼塘、沼泽和缓流河段；水草与场地规定会影响钓法。") },
  { slug: "sepat-ronggeng", ms: "Sepat Ronggeng", en: "Three-spot gourami", zh: "三斑丝足鲈 · Sepat Ronggeng", latin: "Trichopodus trichopterus", habitats: ["freshwater", "river"], style: "bait", advice: "gourami", overview: L("Sepat ronggeng hidup di perairan tawar yang tenang dan bertumbuhan; elakkan merosakkan tumbuhan tebing semasa memancing.", "Three-spot gourami live in calm, vegetated freshwater; avoid damaging bank-side plants while fishing.", "Sepat Ronggeng 常见于静水和水草环境；垂钓时避免破坏岸边植物。") },
  { slug: "kerai-kunyit", ms: "Kerai Kunyit", en: "Kerai Kunyit · Wetmore's barb", zh: "韦氏鲃 · Kerai Kunyit", latin: "Hypsibarbus wetmorei", habitats: ["freshwater", "river"], style: "both", advice: "river-carp", overview: L("Kerai kunyit ialah ikan sungai asli yang disenaraikan oleh Jabatan Perikanan Malaysia; lokasi dan nama setempat boleh berbeza.", "Kerai kunyit are listed among Malaysia's native river fishes; local names and distribution may vary.", "Kerai kunyit 列于马来西亚本地河鱼名单；地方俗名和分布可能不同。") },
  { slug: "bujuk", ms: "Bujuk", en: "Bujuk · Forest snakehead", zh: "林鳢 · Bujuk", latin: "Channa lucius", habitats: ["freshwater", "river"], style: "lure", advice: "snakehead", hot: true, overview: L("Bujuk ialah ikan pemangsa air tawar yang dikaitkan dengan paya, parit dan sungai bervegetasi; cari kawasan litupan dengan lontaran terkawal.", "Bujuk are freshwater predators associated with swamps, canals and vegetated rivers; work cover with controlled casts.", "Bujuk 是常见于沼泽、沟渠和水草河段的淡水掠食鱼；在障碍物附近谨慎抛投。") },
  { slug: "kerandang", ms: "Kerandang", en: "Kerandang · Indonesian snakehead", zh: "印尼鳢 · Kerandang", latin: "Channa marulioides", habitats: ["freshwater", "river"], style: "lure", advice: "snakehead", hot: true, overview: L("Kerandang ialah ikan pemangsa air tawar dari Asia Tenggara; nama tempatan untuk Channa boleh berbeza mengikut negeri.", "Kerandang are Southeast Asian freshwater predators; local names for Channa species vary by region.", "Kerandang 是东南亚淡水掠食鱼；不同州对 Channa 鱼类的俗名可能不同。") },
  { slug: "haruan-kedak", ms: "Haruan Kedak", en: "Haruan Kedak · Dwarf snakehead", zh: "小型鳢 · Haruan Kedak", latin: "Channa limbata", habitats: ["freshwater", "river"], style: "lure", advice: "snakehead", overview: L("Haruan kedak ialah ikan Channa kecil yang direkodkan di Malaysia; beberapa ikan kerdil yang serupa mudah tersalah nama, jadi semak ciri dan lokasi.", "Haruan kedak are small Channa recorded in Malaysia; similar dwarf snakeheads can be misnamed, so check identification and locality.", "Haruan Kedak 是马来西亚有记录的小型 Channa 鱼；近似小型鳢容易混淆，需核对特征和地点。") },
  { slug: "belida", ms: "Belida", en: "Belida · Featherback knifefish", zh: "羽鳍鲙 · Belida", latin: "Chitala lopis", habitats: ["freshwater", "river"], style: "both", advice: "river-predator", overview: L("Belida ialah ikan asli sungai dan tasik banjir di rantau ini; semak status perlindungan serta peraturan tangkapan semasa sebelum memancing.", "Belida are native river and floodplain-lake fish in the region; check current protection and catch rules before fishing.", "Belida 是本区域河流和泛洪湖泊的本地鱼；垂钓前确认最新保护和渔获规定。"), caution: L("Jangan sasarkan atau simpan ikan jika perlindungan setempat melarangnya; lepaskan dengan cermat apabila perlu.", "Do not target or retain fish where local protection rules prohibit it; release carefully when required.", "若当地保护规定禁止捕捞或保留，请勿针对或留鱼；需要时小心放流。") },
  { slug: "lais", ms: "Lais · Wak-wak", en: "Lais · Glass catfish", zh: "玻璃鲶 · Lais", latin: "Kryptopterus bicirrhis", habitats: ["freshwater", "river"], style: "bait", advice: "river-catfish", overview: L("Lais ialah nama tempatan bagi beberapa ikan keli air tawar; halaman ini menggunakan Kryptopterus bicirrhis sebagai contoh.", "Lais is a local name used for several freshwater catfish; this page uses Kryptopterus bicirrhis as an example.", "Lais 是多种淡水鲶鱼的本地俗名；本页以 Kryptopterus bicirrhis 为例。") },
  { slug: "patin-buah", ms: "Patin Buah", en: "Patin Buah · Giant river catfish", zh: "果鲶 · Patin Buah", latin: "Pangasius nasutus", habitats: ["freshwater", "river"], style: "bait", advice: "river-catfish", hot: true, overview: L("Patin buah ialah ikan keli sungai tempatan; saiz, akses dan peraturan tangkapan berbeza antara sungai.", "Patin buah are local river catfish; size, access and catch rules differ between rivers.", "Patin Buah 是本地河鲶；不同河流的体型、进入许可和渔获规定都可能不同。") },
  { slug: "rumput", ms: "Ikan Kap Rumput", en: "Grass carp", zh: "草鱼 · Grass carp", latin: "Ctenopharyngodon idella", habitats: ["freshwater", "river"], style: "bait", advice: "river-carp", overview: L("Kap rumput ialah ikan asal Asia Timur yang diternak atau ditebar di sesetengah perairan; jangan pindahkan ikan hidup antara badan air.", "Grass carp are native to East Asia and may be farmed or stocked in some waters; do not move live fish between waterways.", "草鱼原产东亚，部分水域可能有养殖或放养；不要把活鱼转移到其他水域。"), caution: L("Ikan bukan tempatan: jangan lepaskan atau pindahkan ikan hidup ke perairan awam.", "Non-native fish: do not release or move live fish into public waters.", "外来鱼种：不要把活鱼放生或转移到公共水域。"), fishbaseSlug: "Ctenopharyngodon-idella" },
  { slug: "kap", ms: "Ikan Kap Biasa", en: "Common carp", zh: "鲤鱼 · Common carp", latin: "Cyprinus carpio", habitats: ["freshwater", "river"], style: "bait", advice: "river-carp", overview: L("Ikan kap biasa ialah ikan air tawar yang diternak dan ditebar di banyak tempat; pastikan jenis umpan dibenarkan di kolam atau tasik.", "Common carp are farmed and stocked in many places; check which baits are allowed at a pond or lake.", "鲤鱼常见于养殖和放养水域；先确认鱼塘或湖泊允许使用哪些饵料。"), caution: L("Jangan lepaskan atau pindahkan ikan hidup antara perairan.", "Do not release or move live fish between waterways.", "不要把活鱼放生或转移到其他水域。") },
  { slug: "peacock-bass", ms: "Peacock Bass", en: "Peacock bass · Cichla", zh: "孔雀鲈 · Peacock bass", latin: "Cichla ocellaris", habitats: ["freshwater", "river"], style: "lure", advice: "river-predator", hot: true, overview: L("Peacock bass berasal dari Amerika Selatan dan diperkenalkan di sesetengah perairan; jangan memindah atau melepaskan ikan hidup.", "Peacock bass are native to South America and introduced in some waters; do not move or release live fish.", "Peacock bass 原产南美，在部分水域属引入鱼种；不要转移或放生活鱼。"), caution: L("Spesies bukan tempatan di banyak perairan: jangan lepaskan atau pindahkan ikan hidup.", "Non-native in many waters: do not release or move live fish.", "在许多水域属外来鱼种：不要放生或转移活鱼。") },
  { slug: "belut-sawah", ms: "Belut Sawah", en: "Asian swamp eel", zh: "黄鳝 · Asian swamp eel", latin: "Monopterus albus", habitats: ["freshwater", "river"], style: "bait", advice: "river-catfish", overview: L("Belut sawah hidup di lumpur, sawah dan perairan tawar cetek; gunakan cangkuk dengan berhati-hati dan jangan rosakkan tebing.", "Asian swamp eels live in mud, rice fields and shallow freshwater; handle hooks carefully and avoid damaging banks.", "黄鳝常见于泥底、稻田和浅水淡水区；小心使用鱼钩，避免破坏岸边。") },
  { slug: "belut-sirip-pendek", ms: "Belut Sirip Pendek", en: "Indonesian shortfin eel", zh: "短鳍鳗 · Indonesian shortfin eel", latin: "Anguilla bicolor", habitats: ["freshwater", "river", "brackish", "sea"], style: "bait", advice: "river-predator", overview: L("Belut sirip pendek menggunakan air tawar, muara dan laut sepanjang kitaran hidupnya; kenal pasti spesies dan peraturan sebelum menyimpan tangkapan.", "Indonesian shortfin eels use freshwater, estuaries and the sea during their life cycle; identify the species and rules before keeping a catch.", "短鳍鳗会在淡水、河口和海洋间完成生命周期；保留渔获前先确认鱼种和规定。"), caution: L("Ikan migrasi: elakkan menangkap induk yang sedang bergerak ke laut untuk membiak.", "Migratory fish: avoid taking adults migrating to sea to spawn.", "迁徙鱼类：避免捕捉正洄游入海繁殖的成鱼。") },
  { slug: "pacu", ms: "Pacu", en: "Red-bellied pacu", zh: "红腹食人鲳 · Pacu", latin: "Piaractus brachypomus", habitats: ["freshwater", "river"], style: "both", advice: "river-carp", overview: L("Pacu berasal dari Amerika Selatan dan mungkin ditemui di perairan ternakan atau tebatan; jangan lepaskan atau pindahkan ikan hidup.", "Pacu are native to South America and may occur in farmed or stocked waters; never release or move live fish elsewhere.", "Pacu 原产南美，可能见于养殖或放养水域；切勿把活鱼放生或转移到其他水域。"), caution: L("Spesies bukan tempatan: jangan lepaskan atau pindahkan ikan hidup ke perairan awam.", "Non-native fish: do not release or move live fish into public waters.", "外来鱼种：不要把活鱼放生或转移到公共水域。") },
  { slug: "siakap-merah", ms: "Siakap Merah", en: "Siakap merah · Mangrove jack", zh: "红树笛鲷 · Siakap Merah", latin: "Lutjanus argentimaculatus", habitats: ["brackish", "sea", "river"], style: "both", advice: "reef-predator", hot: true, overview: L("Siakap merah menggunakan kawasan muara bakau dan pesisir; struktur, arus dan peraturan setempat menentukan kaedah yang sesuai.", "Mangrove jack use mangrove estuaries and coastal water; structure, current and local rules shape the approach.", "红树笛鲷常见于红树林河口和沿岸；水下结构、水流和当地规定会影响钓法。") },
  { slug: "kerapu-sunoh", ms: "Kerapu Sunoh", en: "Leopard coral grouper", zh: "东星斑 · Leopard coral grouper", latin: "Plectropomus leopardus", habitats: ["sea"], style: "both", advice: "reef-predator", hot: true, overview: L("Kerapu sunoh dikaitkan dengan terumbu tropika; patuhi zon perlindungan, had saiz dan peraturan tangkapan.", "Leopard coral grouper are associated with tropical reefs; follow protected-zone, size and catch rules.", "东星斑常见于热带珊瑚礁；请遵守保护区、尺寸和渔获规定。"), caution: L("Semak had saiz dan peraturan kawasan terumbu sebelum menyasarkan ikan ini.", "Check size limits and reef-area rules before targeting this fish.", "针对这种鱼前先确认尺寸限制和珊瑚礁区域规定。") },
  { slug: "kerapu-bara", ms: "Kerapu Bara", en: "Coral hind grouper", zh: "红点石斑 · Coral hind", latin: "Cephalopholis miniata", habitats: ["sea"], style: "bait", advice: "reef-predator", overview: L("Kerapu bara hidup berhampiran terumbu dan struktur marin; jangan memancing di zon perlindungan dan gunakan leader yang sesuai.", "Coral hind grouper live around reefs and marine structure; avoid protected zones and use suitable leader.", "红点石斑常在珊瑚礁和海底结构附近活动；避开保护区并使用合适前导线。") },
  { slug: "senangin", ms: "Senangin", en: "Fourfinger threadfin", zh: "四指马鲅 · Senangin", latin: "Eleutheronema tetradactylum", habitats: ["sea", "brackish"], style: "bait", advice: "threadfin", hot: true, overview: L("Senangin sering dicari di perairan pesisir dan muara; semak pasang surut serta keadaan dasar sebelum memilih rig.", "Fourfinger threadfin are often sought in coastal and estuarine water; check tide and bottom before choosing a rig.", "Senangin 常见于沿岸和河口；选择钓组前先了解潮汐和水底环境。") },
  { slug: "talang", ms: "Talang", en: "Talang · Talang queenfish", zh: "大眼鲹 · Talang", latin: "Scomberoides commersonnianus", habitats: ["sea"], style: "lure", advice: "shore-predator", hot: true, overview: L("Talang ialah pemangsa laut pesisir yang memburu ikan kecil; cari tanda kawanan mangsa dan pastikan ruang lontaran bebas.", "Talang are coastal marine predators that hunt small fish; look for bait schools and keep casting space clear.", "Talang 是沿岸海洋掠食鱼，会捕食小鱼；留意饵鱼群并确保抛投空间安全。") },
  { slug: "alu-alu", ms: "Alu-Alu", en: "Great barracuda", zh: "大魣 · Alu-Alu", latin: "Sphyraena barracuda", habitats: ["sea"], style: "lure", advice: "shore-predator", hot: true, overview: L("Alu-alu ialah pemangsa bergigi di perairan laut tropika; gunakan leader sesuai dan kendalikan ikan dengan playar.", "Great barracuda are toothy predators in tropical seas; use suitable leader and handle fish with pliers.", "Alu-Alu 是热带海域的利齿掠食鱼；使用合适前导线并用钳子安全处理。") },
  { slug: "cencaru", ms: "Cencaru", en: "Cencaru · Hardtail scad", zh: "竹荚鱼 · Cencaru", latin: "Megalaspis cordyla", habitats: ["sea"], style: "both", advice: "schooling", hot: true, overview: L("Cencaru bergerak berkumpulan di laut pesisir dan boleh mengejar ikan kecil; keadaan kawanan berubah mengikut arus.", "Hardtail scad school in coastal seas and chase small fish; schools move with current and conditions.", "Cencaru 常在沿岸成群活动并追逐小鱼；鱼群会随水流和环境移动。") },
  { slug: "selayang", ms: "Selayang", en: "Russell's scad", zh: "鲁氏圆鲹 · Selayang", latin: "Decapterus russelli", habitats: ["sea"], style: "both", advice: "schooling", overview: L("Selayang ialah ikan pelagik kecil yang berkumpulan; cari kawanan dan ikut had mata kail serta arahan operator bot.", "Russell's scad are small schooling pelagic fish; find the school and follow hook limits and boat-operator guidance.", "Selayang 是成群活动的小型中上层鱼；找到鱼群后遵守钩数和船家规定。") },
  { slug: "selar-mata-besar", ms: "Selar Mata Besar", en: "Bigeye scad", zh: "大眼圆鲹 · Selar Mata Besar", latin: "Selar crumenophthalmus", habitats: ["sea"], style: "both", advice: "schooling", overview: L("Selar mata besar hidup berkumpulan di laut terbuka dan pesisir; waktu serta lokasi kawanan bergantung pada keadaan tempatan.", "Bigeye scad school in open and coastal water; school location and timing depend on local conditions.", "Selar Mata Besar 常在近海和外海成群活动；鱼群时间和位置依当地环境而变。") },
  { slug: "bawal-hitam", ms: "Bawal Hitam", en: "Black pomfret", zh: "黑鲳 · Bawal Hitam", latin: "Parastromateus niger", habitats: ["sea"], style: "bait", advice: "bottom-marine", overview: L("Bawal hitam ialah ikan laut pesisir; periksa kedalaman, arus dan peraturan umpan di lokasi memancing.", "Black pomfret are coastal marine fish; check depth, current and bait rules at the venue.", "Bawal Hitam 是沿岸海鱼；出钓前确认水深、水流和场地用饵规定。") },
  { slug: "bawal-emas", ms: "Bawal Emas", en: "Snubnose pompano", zh: "金鲳 · Bawal Emas", latin: "Trachinotus blochii", habitats: ["sea", "brackish"], style: "both", advice: "shore-predator", overview: L("Bawal emas ditemui di perairan laut tropika dan sesetengah muara; nama pasaran tempatan mungkin meliputi ikan berkaitan.", "Snubnose pompano occur in tropical seas and some estuaries; local market names may include related fish.", "Bawal Emas 常见于热带海域及部分河口；当地市场俗名也可能涵盖近缘鱼种。") },
  { slug: "kerisi", ms: "Kerisi", en: "Kerisi · Japanese threadfin bream", zh: "日本金线鱼 · Kerisi", latin: "Nemipterus japonicus", habitats: ["sea"], style: "bait", advice: "bottom-marine", overview: L("Kerisi ialah ikan dasar laut yang biasa dijual di Malaysia; gunakan rig dan batu ladung yang sesuai dengan kedalaman serta arus.", "Kerisi are marine bottom fish commonly sold in Malaysia; match rig and sinker to depth and current.", "Kerisi 是马来西亚常见海底鱼；钓组和铅坠需按水深和水流选择。") },
  { slug: "belanak", ms: "Belanak Angin", en: "Blue-spot mullet", zh: "蓝点鲻 · Belanak", latin: "Moolgarda seheli", habitats: ["sea", "brackish"], style: "bait", advice: "mullet", overview: L("Belanak angin hidup di pesisir dan muara; air cetek serta kawanan yang kelihatan boleh membantu memilih tempat.", "Blue-spot mullet live in coastal and estuarine water; shallow areas and visible schools can help locate them.", "蓝点鲻常见于沿岸和河口；浅水区与可见鱼群有助寻找鱼位。") },
  { slug: "ikan-bulan", ms: "Ikan Bulan", en: "Indo-Pacific tarpon", zh: "大海鲢 · Ikan Bulan", latin: "Megalops cyprinoides", habitats: ["sea", "brackish", "river"], style: "lure", advice: "shore-predator", overview: L("Ikan bulan menggunakan muara, pesisir dan air tawar; ia boleh melompat kuat, jadi sediakan ruang dan kendalikan dengan cermat.", "Indo-Pacific tarpon use estuaries, coasts and freshwater; they jump strongly, so make space and handle carefully.", "Ikan Bulan 会进入河口、沿岸和淡水；中鱼后可能强力跃起，需留足空间并谨慎处理。") },
  { slug: "todak", ms: "Todak", en: "Hound needlefish", zh: "犬形针鱼 · Todak", latin: "Tylosurus crocodilus", habitats: ["sea", "brackish"], style: "lure", advice: "shore-predator", overview: L("Todak berenang dekat permukaan di perairan pesisir; paruhnya tajam, jadi gunakan playar dan jauhi hujung ikan ketika melepaskan mata kail.", "Hound needlefish swim near the surface in coastal water; their bill is sharp, so use pliers and stay clear when unhooking.", "Todak 常在沿岸水面附近活动；长嘴尖利，取钩时用钳子并避开鱼嘴。") },
  { slug: "cobia", ms: "Cobia · Ikan Lemadang", en: "Cobia", zh: "军曹鱼 · Cobia", latin: "Rachycentron canadum", habitats: ["sea"], style: "both", advice: "pelagic-predator", hot: true, overview: L("Cobia ialah ikan laut besar yang sering mengikuti struktur terapung dan objek; pemancing bot perlu ikut arahan kru serta memakai jaket keselamatan.", "Cobia are large marine fish often found near floating structure and objects; boat anglers should follow crew guidance and wear life jackets.", "Cobia 是大型海鱼，常靠近漂浮结构或物体；乘船垂钓要听从船员指示并穿救生衣。") },
  { slug: "aya", ms: "Aya · Tongkol Aya", en: "Kawakawa · Little tunny", zh: "扁舵鲣 · Aya", latin: "Euthynnus affinis", habitats: ["sea"], style: "both", advice: "pelagic-predator", hot: true, overview: L("Aya ialah tuna pelagik yang bergerak pantas dan memburu ikan kecil; cari kawanan burung atau tanda ikan, bukan lokasi tetap.", "Kawakawa are fast pelagic tuna that hunt small fish; watch for birds and bait activity rather than a fixed spot.", "Aya 是快速游动的中上层鲣类，会追捕小鱼；留意鸟群和饵鱼动态，不要假设鱼位固定。") },
  { slug: "tongkol", ms: "Tongkol", en: "Longtail tuna", zh: "长尾金枪鱼 · Tongkol", latin: "Thunnus tonggol", habitats: ["sea"], style: "both", advice: "pelagic-predator", hot: true, overview: L("Tongkol ialah tuna pelagik di perairan tropika; keadaan laut, arus dan keselamatan bot perlu dinilai sebelum keluar.", "Longtail tuna are tropical pelagic fish; assess sea, current and boat safety before heading out.", "Tongkol 是热带中上层金枪鱼；出海前先评估海况、水流和船只安全。") },
  { slug: "lampu-lampu", ms: "Ikan Lampu-Lampu", en: "Dorado · Mahi-mahi", zh: "鲯鳅 · Lampu-Lampu", latin: "Coryphaena hippurus", habitats: ["sea"], style: "both", advice: "pelagic-predator", hot: true, overview: L("Ikan lampu-lampu ialah pemangsa pelagik laut terbuka; rancang perjalanan dengan operator dan ikut panduan keselamatan bot.", "Mahi-mahi are open-water pelagic predators; plan with an operator and follow boat-safety guidance.", "Ikan Lampu-Lampu 是外海中上层掠食鱼；与船家规划行程并遵守船只安全指引。") },
  { slug: "layaran", ms: "Layaran", en: "Indo-Pacific sailfish", zh: "印度太平洋旗鱼 · Layaran", latin: "Istiophorus platypterus", habitats: ["sea"], style: "lure", advice: "pelagic-predator", hot: true, overview: L("Layaran ialah ikan sukan laut terbuka yang kuat; gunakan operator berpengalaman, pakai jaket keselamatan dan utamakan pelepasan yang cermat.", "Sailfish are powerful open-water sport fish; use an experienced operator, wear a life jacket and favour careful release.", "Layaran 是力量强的外海运动鱼；选择经验船家、穿救生衣，并优先谨慎放流。"), caution: L("Amalkan tangkap dan lepas dengan cepat serta berhati-hati; semak peraturan semasa.", "Practise quick, careful catch and release; check current rules.", "快速且谨慎地捕获放流，并确认最新规定。") },
  { slug: "parang-parang", ms: "Parang-Parang", en: "Dorab wolf-herring", zh: "狼鲱 · Parang-parang", latin: "Chirocentrus dorab", habitats: ["sea"], style: "both", advice: "pelagic-predator", overview: L("Parang-parang ialah ikan laut pelagik yang dikenali di pasaran Malaysia; ia berbeza daripada ikan air tawar yang kadangkala turut dipanggil parang.", "Dorab wolf-herring are marine pelagic fish known in Malaysian markets; they are distinct from freshwater fish sometimes also called parang.", "Parang-parang 是马来西亚市场常见的海洋中上层鱼；与部分也叫 parang 的淡水鱼不同。") },
  { slug: "talang-bintik-dua", ms: "Talang Bintik Dua", en: "Double-spotted queenfish", zh: "双斑鲹 · Queenfish", latin: "Scomberoides lysan", habitats: ["sea"], style: "lure", advice: "shore-predator", overview: L("Talang bintik dua ialah satu lagi spesies queenfish pesisir; gunakan nama saintifik kerana nama talang tempatan boleh merujuk ikan berkaitan.", "Double-spotted queenfish are a separate coastal queenfish; use the scientific name because local talang names can refer to related fish.", "Talang Bintik Dua 是另一种沿岸鲹鱼；本地 talang 俗名可能指近缘鱼，建议核对学名。") },
];

export const FISH_CATALOG_EXPANSION: FishSpecies[] = expansion.map((fish) => {
  const image = photoBySlug.get(fish.slug);
  const photo = fish.photo ?? (image ? {
    src: `/fish/${image.fileName}`,
    credit: image.credit,
    license: image.license,
    sourceUrl: image.sourceUrl,
  } : undefined);
  if (!photo) throw new Error(`Missing fish photo source for ${fish.slug}`);
  const profile = guidance[fish.advice];
  const name = L(fish.ms, fish.en, fish.zh);
  const baseTaxonNote = L(
    `Padanan saintifik untuk nama ini ialah ${fish.latin}; penggunaan nama tempatan boleh berbeza.`,
    `This entry uses ${fish.latin} as its scientific match; local common-name usage can vary.`,
    `本页以 ${fish.latin} 对应此名称；地方俗名可能因地区而异。`,
  );
  const taxonNote = fish.caution ? L(
    `${baseTaxonNote.ms} ${fish.caution.ms}`,
    `${baseTaxonNote.en} ${fish.caution.en}`,
    `${baseTaxonNote.zh} ${fish.caution.zh}`,
  ) : baseTaxonNote;
  const fishbaseSlug = fish.fishbaseSlug ?? fish.latin.replaceAll(" ", "-");
  return {
    slug: fish.slug,
    name,
    latinName: fish.latin,
    taxonNote,
    habitats: fish.habitats,
    style: fish.style,
    isHot: Boolean(fish.hot),
    overview: fish.overview,
    wildDiet: profile.wildDiet,
    baitTips: profile.baitTips,
    lureTips: profile.lureTips,
    starterRig: profile.starterRig,
    photo,
    sourceUrl: `https://www.fishbase.se/summary/${fishbaseSlug}.html`,
  };
});

