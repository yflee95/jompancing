import type { Area, LocalizedString } from "@/types";
import { malaysiaStates } from "@/data/malaysia-states";

const OTHER_AREA_NAMES: LocalizedString = {
  ms: "Kawasan lain",
  en: "Other area",
  zh: "其他区域",
};

/** Named fishing areas within districts — expand as community grows */
export const malaysiaAreas: Area[] = [
  // ── Johor — Johor Bahru ──
  { id: "danga-bay", slug: "danga-bay", stateId: "johor", districtId: "johor-bahru", name: { ms: "Danga Bay", en: "Danga Bay", zh: "Danga Bay" } },
  { id: "stulang-laut", slug: "stulang-laut", stateId: "johor", districtId: "johor-bahru", name: { ms: "Stulang Laut", en: "Stulang Laut", zh: "Stulang Laut" } },
  { id: "pulai", slug: "pulai", stateId: "johor", districtId: "johor-bahru", name: { ms: "Pulai", en: "Pulai", zh: "Pulai" } },
  { id: "pasir-gudang", slug: "pasir-gudang", stateId: "johor", districtId: "johor-bahru", name: { ms: "Pasir Gudang", en: "Pasir Gudang", zh: "巴西古当" } },
  { id: "pelabuhan-johor", slug: "pelabuhan-johor", stateId: "johor", districtId: "johor-bahru", name: { ms: "Pelabuhan Johor", en: "Johor Port", zh: "柔佛港" } },
  { id: "larkin", slug: "larkin", stateId: "johor", districtId: "johor-bahru", name: { ms: "Larkin", en: "Larkin", zh: "Larkin" } },
  { id: "ulu-tiram", slug: "ulu-tiram", stateId: "johor", districtId: "johor-bahru", name: { ms: "Ulu Tiram", en: "Ulu Tiram", zh: "乌鲁地南" } },
  { id: "taman-puteri-wangsa", slug: "taman-puteri-wangsa", stateId: "johor", districtId: "johor-bahru", name: { ms: "Taman Puteri Wangsa", en: "Taman Puteri Wangsa", zh: "公主城花园" } },
  { id: "masai", slug: "masai", stateId: "johor", districtId: "johor-bahru", name: { ms: "Masai", en: "Masai", zh: "马西" } },
  { id: "permas-jaya", slug: "permas-jaya", stateId: "johor", districtId: "johor-bahru", name: { ms: "Permas Jaya", en: "Permas Jaya", zh: "Permas Jaya" } },
  { id: "skudai", slug: "skudai", stateId: "johor", districtId: "johor-bahru", name: { ms: "Skudai", en: "Skudai", zh: "士古来" } },
  { id: "tebrau", slug: "tebrau", stateId: "johor", districtId: "johor-bahru", name: { ms: "Tebrau", en: "Tebrau", zh: "地不佬" } },
  { id: "kempas", slug: "kempas", stateId: "johor", districtId: "johor-bahru", name: { ms: "Kempas", en: "Kempas", zh: "金葩斯" } },
  { id: "senai", slug: "senai", stateId: "johor", districtId: "johor-bahru", name: { ms: "Senai", en: "Senai", zh: "士乃" } },
  { id: "bandar-seri-alam", slug: "bandar-seri-alam", stateId: "johor", districtId: "johor-bahru", name: { ms: "Bandar Seri Alam", en: "Bandar Seri Alam", zh: "Bandar Seri Alam" } },
  { id: "taman-molek", slug: "taman-molek", stateId: "johor", districtId: "johor-bahru", name: { ms: "Taman Molek", en: "Taman Molek", zh: "花园摩力" } },

  // Johor — Pontian
  { id: "pontian-coast", slug: "pontian-coast", stateId: "johor", districtId: "pontian", name: { ms: "Pesisir Pontian", en: "Pontian Coast", zh: "笨珍沿海" } },
  { id: "pontian-jetty", slug: "pontian-jetty", stateId: "johor", districtId: "pontian", name: { ms: "Jeti Pontian", en: "Pontian Jetty", zh: "笨珍码头" } },
  { id: "kukup", slug: "kukup", stateId: "johor", districtId: "pontian", name: { ms: "Kukup", en: "Kukup", zh: "龟咯" } },
  { id: "benut", slug: "benut", stateId: "johor", districtId: "pontian", name: { ms: "Benut", en: "Benut", zh: "文律" } },
  { id: "ayer-baloi", slug: "ayer-baloi", stateId: "johor", districtId: "pontian", name: { ms: "Ayer Baloi", en: "Ayer Baloi", zh: "亚逸峇礼" } },

  // Johor — Muar
  { id: "muar-jetty", slug: "muar-jetty", stateId: "johor", districtId: "muar", name: { ms: "Jeti Muar", en: "Muar Jetty", zh: "麻坡码头" } },
  { id: "sungai-muar", slug: "sungai-muar", stateId: "johor", districtId: "muar", name: { ms: "Sungai Muar", en: "Muar River", zh: "麻坡河" } },
  { id: "tanjung-emu", slug: "tanjung-emu", stateId: "johor", districtId: "muar", name: { ms: "Tanjung Emu", en: "Tanjung Emu", zh: "丹绒埃姆" } },
  { id: "parit-jawa", slug: "parit-jawa", stateId: "johor", districtId: "muar", name: { ms: "Parit Jawa", en: "Parit Jawa", zh: "巴冬爪哇" } },
  { id: "tanjung-agasi", slug: "tanjung-agasi", stateId: "johor", districtId: "muar", name: { ms: "Tanjung Agas", en: "Tanjung Agas", zh: "丹绒阿加斯" } },

  // Johor — Kota Tinggi
  { id: "sungai-rinting", slug: "sungai-rinting", stateId: "johor", districtId: "kotatinggi", name: { ms: "Sungai Rinting", en: "Sungai Rinting", zh: "Rinting 河" } },
  { id: "desaru-coast", slug: "desaru-coast", stateId: "johor", districtId: "kotatinggi", name: { ms: "Pesisir Desaru", en: "Desaru Coast", zh: "迪沙鲁沿海" } },
  { id: "pengerang", slug: "pengerang", stateId: "johor", districtId: "kotatinggi", name: { ms: "Pengerang", en: "Pengerang", zh: "边佳兰" } },
  { id: "kota-tinggi-town", slug: "kota-tinggi-town", stateId: "johor", districtId: "kotatinggi", name: { ms: "Bandar Kota Tinggi", en: "Kota Tinggi Town", zh: "哥打丁宜市" } },
  { id: "sungai-ria", slug: "sungai-ria", stateId: "johor", districtId: "kotatinggi", name: { ms: "Sungai Ria", en: "Sungai Ria", zh: "Sungai Ria" } },

  // ── Selangor — Petaling ──
  { id: "ss2", slug: "ss2", stateId: "selangor", districtId: "petaling", name: { ms: "SS2", en: "SS2", zh: "SS2" } },
  { id: "kelana-jaya", slug: "kelana-jaya", stateId: "selangor", districtId: "petaling", name: { ms: "Kelana Jaya", en: "Kelana Jaya", zh: "格拉那再也" } },
  { id: "subang-jaya", slug: "subang-jaya", stateId: "selangor", districtId: "petaling", name: { ms: "Subang Jaya", en: "Subang Jaya", zh: "梳邦再也" } },
  { id: "shah-alam-lake", slug: "shah-alam-lake", stateId: "selangor", districtId: "petaling", name: { ms: "Tasik Shah Alam", en: "Shah Alam Lake", zh: "莎阿南湖" } },
  { id: "puchong", slug: "puchong", stateId: "selangor", districtId: "petaling", name: { ms: "Puchong", en: "Puchong", zh: "蒲种" } },
  { id: "damansara", slug: "damansara", stateId: "selangor", districtId: "petaling", name: { ms: "Damansara", en: "Damansara", zh: "万达" } },
  { id: "wangsa-maju", slug: "wangsa-maju", stateId: "selangor", districtId: "petaling", name: { ms: "Wangsa Maju", en: "Wangsa Maju", zh: "旺沙玛珠" } },

  // Selangor — Klang
  { id: "klang-town", slug: "klang-town", stateId: "selangor", districtId: "klang", name: { ms: "Bandar Klang", en: "Klang Town", zh: "巴生市" } },
  { id: "port-klang", slug: "port-klang", stateId: "selangor", districtId: "klang", name: { ms: "Pelabuhan Klang", en: "Port Klang", zh: "巴生港" } },
  { id: "pulau-ketam", slug: "pulau-ketam", stateId: "selangor", districtId: "klang", name: { ms: "Pulau Ketam", en: "Pulau Ketam", zh: "吉胆岛" } },
  { id: "kapar-coast", slug: "kapar-coast", stateId: "selangor", districtId: "klang", name: { ms: "Pesisir Kapar", en: "Kapar Coast", zh: "加埔沿海" } },
  { id: "pandamaran", slug: "pandamaran", stateId: "selangor", districtId: "klang", name: { ms: "Pandamaran", en: "Pandamaran", zh: "班达马兰" } },
  { id: "telok-gong", slug: "telok-gong", stateId: "selangor", districtId: "klang", name: { ms: "Telok Gong", en: "Telok Gong", zh: "Telok Gong" } },

  // Selangor — Hulu Langat
  { id: "cheras-pond", slug: "cheras-pond", stateId: "selangor", districtId: "hulu-langat", name: { ms: "Kolam Cheras", en: "Cheras Ponds", zh: "蕉赖鱼塘" } },
  { id: "kajang", slug: "kajang", stateId: "selangor", districtId: "hulu-langat", name: { ms: "Kajang", en: "Kajang", zh: "加影" } },
  { id: "semenyih", slug: "semenyih", stateId: "selangor", districtId: "hulu-langat", name: { ms: "Semenyih", en: "Semenyih", zh: "士毛月" } },
  { id: "ampang", slug: "ampang", stateId: "selangor", districtId: "hulu-langat", name: { ms: "Ampang", en: "Ampang", zh: "安邦" } },
  { id: "bangi", slug: "bangi", stateId: "selangor", districtId: "hulu-langat", name: { ms: "Bangi", en: "Bangi", zh: "万宜" } },

  // ── Penang — Timur Laut ──
  { id: "tanjung-bungah", slug: "tanjung-bungah", stateId: "penang", districtId: "timur-laut", name: { ms: "Tanjung Bungah", en: "Tanjung Bungah", zh: "丹绒bungah" } },
  { id: "gurney", slug: "gurney", stateId: "penang", districtId: "timur-laut", name: { ms: "Gurney", en: "Gurney", zh: "Gurney" } },
  { id: "georgetown-jetty", slug: "georgetown-jetty", stateId: "penang", districtId: "timur-laut", name: { ms: "Jeti Georgetown", en: "Georgetown Jetty", zh: "乔治市码头" } },
  { id: "batu-ferringhi", slug: "batu-ferringhi", stateId: "penang", districtId: "timur-laut", name: { ms: "Batu Ferringhi", en: "Batu Ferringhi", zh: "巴都丁宜" } },
  { id: "pulau-tikus", slug: "pulau-tikus", stateId: "penang", districtId: "timur-laut", name: { ms: "Pulau Tikus", en: "Pulau Tikus", zh: "牛汝莪" } },
  { id: "tanjung-tokong", slug: "tanjung-tokong", stateId: "penang", districtId: "timur-laut", name: { ms: "Tanjung Tokong", en: "Tanjung Tokong", zh: "丹绒道光" } },

  // Penang — Barat Daya
  { id: "balik-pulau", slug: "balik-pulau", stateId: "penang", districtId: "barat-daya", name: { ms: "Balik Pulau", en: "Balik Pulau", zh: "浮罗山背" } },
  { id: "teluk-kumbar", slug: "teluk-kumbar", stateId: "penang", districtId: "barat-daya", name: { ms: "Teluk Kumbar", en: "Teluk Kumbar", zh: "公巴" } },
  { id: "gertak-sanggul", slug: "gertak-sanggul", stateId: "penang", districtId: "barat-daya", name: { ms: "Gertak Sanggul", en: "Gertak Sanggul", zh: "格达桑古" } },
  { id: "bayan-lepas", slug: "bayan-lepas", stateId: "penang", districtId: "barat-daya", name: { ms: "Bayan Lepas", en: "Bayan Lepas", zh: "峇六拜" } },

  // ── Sabah — Kota Kinabalu ──
  { id: "jesselton", slug: "jesselton", stateId: "sabah", districtId: "kota-kinabalu", name: { ms: "Jesselton Point", en: "Jesselton Point", zh: "Jesselton Point" } },
  { id: "kk-waterfront", slug: "kk-waterfront", stateId: "sabah", districtId: "kota-kinabalu", name: { ms: "Waterfront KK", en: "KK Waterfront", zh: "亚庇海滨" } },
  { id: "likas-bay", slug: "likas-bay", stateId: "sabah", districtId: "kota-kinabalu", name: { ms: "Likas Bay", en: "Likas Bay", zh: "利卡斯湾" } },
  { id: "tanjung-aru", slug: "tanjung-aru", stateId: "sabah", districtId: "kota-kinabalu", name: { ms: "Tanjung Aru", en: "Tanjung Aru", zh: "丹绒亚路" } },

  // Sabah — Sandakan
  { id: "sandakan-jetty", slug: "sandakan-jetty", stateId: "sabah", districtId: "sandakan", name: { ms: "Jeti Sandakan", en: "Sandakan Jetty", zh: "山打根码头" } },
  { id: "sim-sim", slug: "sim-sim", stateId: "sabah", districtId: "sandakan", name: { ms: "Sim Sim", en: "Sim Sim", zh: "Sim Sim" } },
  { id: "separup", slug: "separup", stateId: "sabah", districtId: "sandakan", name: { ms: "Separup", en: "Separup", zh: "Separup" } },

  // ── Sarawak — Kuching ──
  { id: "kuching-waterfront", slug: "kuching-waterfront", stateId: "sarawak", districtId: "kuching", name: { ms: "Waterfront Kuching", en: "Kuching Waterfront", zh: "古晋河滨" } },
  { id: "santubong", slug: "santubong", stateId: "sarawak", districtId: "kuching", name: { ms: "Santubong", en: "Santubong", zh: "山都望" } },
  { id: "damai-beach", slug: "damai-beach", stateId: "sarawak", districtId: "kuching", name: { ms: "Damai Beach", en: "Damai Beach", zh: "达迈海滩" } },

  // Sarawak — Miri
  { id: "miri-marina", slug: "miri-marina", stateId: "sarawak", districtId: "miri", name: { ms: "Marina Miri", en: "Miri Marina", zh: "美里 marina" } },
  { id: "luak-bay", slug: "luak-bay", stateId: "sarawak", districtId: "miri", name: { ms: "Luak Bay", en: "Luak Bay", zh: "Luak 湾" } },
  { id: "taman-awas", slug: "taman-awas", stateId: "sarawak", districtId: "miri", name: { ms: "Taman Awam Miri", en: "Miri Public Park", zh: "美里公园" } },

  // ── Pahang — Kuantan ──
  { id: "kuantan-jetty", slug: "kuantan-jetty", stateId: "pahang", districtId: "kuantan", name: { ms: "Jeti Kuantan", en: "Kuantan Jetty", zh: "关丹码头" } },
  { id: "teluk-cempedak", slug: "teluk-cempedak", stateId: "pahang", districtId: "kuantan", name: { ms: "Teluk Cempedak", en: "Teluk Cempedak", zh: "珍拉丁海滩" } },
  { id: "beserah", slug: "beserah", stateId: "pahang", districtId: "kuantan", name: { ms: "Beserah", en: "Beserah", zh: "百沙厘" } },

  // Pahang — Temerloh
  { id: "sungai-pahang", slug: "sungai-pahang", stateId: "pahang", districtId: "temerloh", name: { ms: "Sungai Pahang", en: "Pahang River", zh: "彭亨河" } },
  { id: "temerloh-jetty", slug: "temerloh-jetty", stateId: "pahang", districtId: "temerloh", name: { ms: "Jeti Temerloh", en: "Temerloh Jetty", zh: "淡马鲁码头" } },

  // ── Perak — Ipoh ──
  { id: "ipoh-town", slug: "ipoh-town", stateId: "perak", districtId: "ipoh", name: { ms: "Bandar Ipoh", en: "Ipoh Town", zh: "怡保市区" } },
  { id: "tambun", slug: "tambun", stateId: "perak", districtId: "ipoh", name: { ms: "Tambun", en: "Tambun", zh: "打扪" } },
  { id: "gopeng", slug: "gopeng", stateId: "perak", districtId: "ipoh", name: { ms: "Gopeng", en: "Gopeng", zh: "务边" } },

  // Perak — Manjung
  { id: "lumut-marina", slug: "lumut-marina", stateId: "perak", districtId: "manjung", name: { ms: "Lumut Marina", en: "Lumut Marina", zh: "红土坎 marina" } },
  { id: "pangkor", slug: "pangkor", stateId: "perak", districtId: "manjung", name: { ms: "Pulau Pangkor", en: "Pangkor Island", zh: "邦咯岛" } },
  { id: "sitiawan", slug: "sitiawan", stateId: "perak", districtId: "manjung", name: { ms: "Sitiawan", en: "Sitiawan", zh: "实兆远" } },

  // ── Melaka — Melaka Tengah ──
  { id: "melaka-river", slug: "melaka-river", stateId: "melaka", districtId: "melaka-tengah", name: { ms: "Sungai Melaka", en: "Melaka River", zh: "马六甲河" } },
  { id: "umbai-jetty", slug: "umbai-jetty", stateId: "melaka", districtId: "melaka-tengah", name: { ms: "Jeti Umbai", en: "Umbai Jetty", zh: "乌蛮码头" } },
  { id: "klebang", slug: "klebang", stateId: "melaka", districtId: "melaka-tengah", name: { ms: "Klebang", en: "Klebang", zh: "吉里武安" } },

  // ── Negeri Sembilan — Seremban ──
  { id: "seremban-lake", slug: "seremban-lake", stateId: "negeri-sembilan", districtId: "seremban", name: { ms: "Tasik Seremban", en: "Seremban Lake", zh: "芙蓉湖" } },
  { id: "port-dickson", slug: "port-dickson", stateId: "negeri-sembilan", districtId: "seremban", name: { ms: "Port Dickson", en: "Port Dickson", zh: "波德申" } },
  { id: "nilai-pond", slug: "nilai-pond", stateId: "negeri-sembilan", districtId: "seremban", name: { ms: "Kolam Nilai", en: "Nilai Ponds", zh: "Nilai 鱼塘" } },

  // ── Kedah — Alor Setar ──
  { id: "alor-setar-jetty", slug: "alor-setar-jetty", stateId: "kedah", districtId: "alor-setar", name: { ms: "Jeti Alor Setar", en: "Alor Setar Jetty", zh: "亚罗士打码头" } },
  { id: "kuala-kedah", slug: "kuala-kedah", stateId: "kedah", districtId: "alor-setar", name: { ms: "Kuala Kedah", en: "Kuala Kedah", zh: "吉打港" } },
  { id: "langkawi-ferry", slug: "langkawi-ferry", stateId: "kedah", districtId: "alor-setar", name: { ms: "Kuala Perlis / Langkawi", en: "Langkawi Gateway", zh: "浮罗交怡方向" } },

  // ── Kelantan — Kota Bharu ──
  { id: "kb-jetty", slug: "kb-jetty", stateId: "kelantan", districtId: "kota-bharu", name: { ms: "Jeti Kota Bharu", en: "Kota Bharu Jetty", zh: "哥打巴鲁码头" } },
  { id: "pantai-dalam", slug: "pantai-dalam", stateId: "kelantan", districtId: "kota-bharu", name: { ms: "Pantai Dalam", en: "Pantai Dalam", zh: "Pantai Dalam" } },
  { id: "sungai-kelantan", slug: "sungai-kelantan", stateId: "kelantan", districtId: "kota-bharu", name: { ms: "Sungai Kelantan", en: "Kelantan River", zh: "吉兰丹河" } },

  // ── Terengganu — Kuala Terengganu ──
  { id: "kt-jetty", slug: "kt-jetty", stateId: "terengganu", districtId: "kuala-terengganu", name: { ms: "Jeti KT", en: "KT Jetty", zh: "瓜登码头" } },
  { id: "chendering", slug: "chendering", stateId: "terengganu", districtId: "kuala-terengganu", name: { ms: "Chendering", en: "Chendering", zh: "Chendering" } },
  { id: "marang", slug: "marang", stateId: "terengganu", districtId: "kuala-terengganu", name: { ms: "Marang", en: "Marang", zh: "马浪" } },

  // ── Perlis — Kangar ──
  { id: "kuala-perlis", slug: "kuala-perlis", stateId: "perlis", districtId: "kangar", name: { ms: "Kuala Perlis", en: "Kuala Perlis", zh: "玻璃市港" } },
  { id: "kangar-river", slug: "kangar-river", stateId: "perlis", districtId: "kangar", name: { ms: "Sungai Perlis", en: "Perlis River", zh: "玻璃市河" } },

  // ── KL ──
  { id: "klang-gates", slug: "klang-gates", stateId: "kl", districtId: "kl-city", name: { ms: "Klang Gates", en: "Klang Gates", zh: "Klang Gates" } },
  { id: "taman-botani", slug: "taman-botani", stateId: "kl", districtId: "kl-city", name: { ms: "Taman Botani Perdana", en: "Lake Gardens", zh: "湖滨公园" } },
  { id: "sungai-besi", slug: "sungai-besi", stateId: "kl", districtId: "kl-city", name: { ms: "Sungai Besi", en: "Sungai Besi", zh: "新街场" } },

  // ── Putrajaya ──
  { id: "putrajaya-lake", slug: "putrajaya-lake", stateId: "putrajaya", districtId: "putrajaya-core", name: { ms: "Tasik Putrajaya", en: "Putrajaya Lake", zh: "布城湖" } },
  { id: "cyberjaya-pond", slug: "cyberjaya-pond", stateId: "putrajaya", districtId: "putrajaya-core", name: { ms: "Cyberjaya", en: "Cyberjaya", zh: "赛城" } },

  // ── Labuan ──
  { id: "labuan-international", slug: "labuan-international", stateId: "labuan", districtId: "labuan-island", name: { ms: "Labuan International Sea Sports", en: "Labuan Sea Sports", zh: "纳闽海上运动" } },
  { id: "labuan-town", slug: "labuan-town", stateId: "labuan", districtId: "labuan-island", name: { ms: "Bandar Labuan", en: "Labuan Town", zh: "纳闽市区" } },
];

export function getGeneralAreaId(districtId: string): string {
  return `${districtId}-general`;
}

export function getAreasByDistrict(
  stateId: string,
  districtId: string,
): Area[] {
  const specific = malaysiaAreas.filter(
    (a) => a.stateId === stateId && a.districtId === districtId,
  );
  const general: Area = {
    id: getGeneralAreaId(districtId),
    slug: "general",
    stateId,
    districtId,
    name: OTHER_AREA_NAMES,
  };
  return [...specific, general];
}

export function getAreaById(
  stateId: string,
  districtId: string,
  areaId: string,
): Area | undefined {
  if (areaId === getGeneralAreaId(districtId)) {
    return getAreasByDistrict(stateId, districtId).find((a) => a.id === areaId);
  }
  return malaysiaAreas.find(
    (a) =>
      a.id === areaId && a.stateId === stateId && a.districtId === districtId,
  );
}

/** Districts with zero named areas still get "Other area" only */
export function getDistrictCoverageStats(): {
  totalDistricts: number;
  withNamedAreas: number;
} {
  const districtKeys = new Set<string>();
  for (const state of malaysiaStates) {
    for (const d of state.districts) {
      districtKeys.add(`${state.id}:${d.id}`);
    }
  }
  const covered = new Set(
    malaysiaAreas.map((a) => `${a.stateId}:${a.districtId}`),
  );
  return {
    totalDistricts: districtKeys.size,
    withNamedAreas: covered.size,
  };
}
