import type { District, State } from "@/types";

export const malaysiaStates: State[] = [
  {
    id: "johor",
    slug: "johor",
    name: { ms: "Johor", en: "Johor", zh: "柔佛" },
    districts: [
      {
        id: "johor-bahru",
        slug: "johor-bahru",
        name: { ms: "Johor Bahru", en: "Johor Bahru", zh: "新山" },
      },
      {
        id: "pontian",
        slug: "pontian",
        name: { ms: "Pontian", en: "Pontian", zh: "笨珍" },
      },
      {
        id: "muar",
        slug: "muar",
        name: { ms: "Muar", en: "Muar", zh: "麻坡" },
      },
      {
        id: "kotatinggi",
        slug: "kotatinggi",
        name: { ms: "Kota Tinggi", en: "Kota Tinggi", zh: "哥打丁宜" },
      },
    ],
  },
  {
    id: "selangor",
    slug: "selangor",
    name: { ms: "Selangor", en: "Selangor", zh: "雪兰莪" },
    districts: [
      {
        id: "petaling",
        slug: "petaling",
        name: { ms: "Petaling", en: "Petaling", zh: "八打灵" },
      },
      {
        id: "klang",
        slug: "klang",
        name: { ms: "Klang", en: "Klang", zh: "巴生" },
      },
      {
        id: "hulu-langat",
        slug: "hulu-langat",
        name: { ms: "Hulu Langat", en: "Hulu Langat", zh: "乌鲁冷岳" },
      },
    ],
  },
  {
    id: "penang",
    slug: "penang",
    name: { ms: "Pulau Pinang", en: "Penang", zh: "槟城" },
    districts: [
      {
        id: "timur-laut",
        slug: "timur-laut",
        name: { ms: "Timur Laut", en: "Northeast", zh: "东北区" },
      },
      {
        id: "barat-daya",
        slug: "barat-daya",
        name: { ms: "Barat Daya", en: "Southwest", zh: "西南区" },
      },
    ],
  },
  {
    id: "sabah",
    slug: "sabah",
    name: { ms: "Sabah", en: "Sabah", zh: "沙巴" },
    districts: [
      {
        id: "kota-kinabalu",
        slug: "kota-kinabalu",
        name: { ms: "Kota Kinabalu", en: "Kota Kinabalu", zh: "亚庇" },
      },
      {
        id: "sandakan",
        slug: "sandakan",
        name: { ms: "Sandakan", en: "Sandakan", zh: "山打根" },
      },
    ],
  },
  {
    id: "sarawak",
    slug: "sarawak",
    name: { ms: "Sarawak", en: "Sarawak", zh: "砂拉越" },
    districts: [
      {
        id: "kuching",
        slug: "kuching",
        name: { ms: "Kuching", en: "Kuching", zh: "古晋" },
      },
      {
        id: "miri",
        slug: "miri",
        name: { ms: "Miri", en: "Miri", zh: "美里" },
      },
    ],
  },
  {
    id: "pahang",
    slug: "pahang",
    name: { ms: "Pahang", en: "Pahang", zh: "彭亨" },
    districts: [
      {
        id: "kuantan",
        slug: "kuantan",
        name: { ms: "Kuantan", en: "Kuantan", zh: "关丹" },
      },
      {
        id: "temerloh",
        slug: "temerloh",
        name: { ms: "Temerloh", en: "Temerloh", zh: "淡马鲁" },
      },
    ],
  },
  {
    id: "perak",
    slug: "perak",
    name: { ms: "Perak", en: "Perak", zh: "霹雳" },
    districts: [
      {
        id: "ipoh",
        slug: "ipoh",
        name: { ms: "Ipoh", en: "Ipoh", zh: "怡保" },
      },
      {
        id: "manjung",
        slug: "manjung",
        name: { ms: "Manjung", en: "Manjung", zh: "曼绒" },
      },
    ],
  },
  {
    id: "melaka",
    slug: "melaka",
    name: { ms: "Melaka", en: "Malacca", zh: "马六甲" },
    districts: [
      {
        id: "melaka-tengah",
        slug: "melaka-tengah",
        name: { ms: "Melaka Tengah", en: "Central Malacca", zh: "马六甲中央" },
      },
    ],
  },
  {
    id: "negeri-sembilan",
    slug: "negeri-sembilan",
    name: { ms: "Negeri Sembilan", en: "Negeri Sembilan", zh: "森美兰" },
    districts: [
      {
        id: "seremban",
        slug: "seremban",
        name: { ms: "Seremban", en: "Seremban", zh: "芙蓉" },
      },
    ],
  },
  {
    id: "kedah",
    slug: "kedah",
    name: { ms: "Kedah", en: "Kedah", zh: "吉打" },
    districts: [
      {
        id: "alor-setar",
        slug: "alor-setar",
        name: { ms: "Alor Setar", en: "Alor Setar", zh: "亚罗士打" },
      },
    ],
  },
  {
    id: "kelantan",
    slug: "kelantan",
    name: { ms: "Kelantan", en: "Kelantan", zh: "吉兰丹" },
    districts: [
      {
        id: "kota-bharu",
        slug: "kota-bharu",
        name: { ms: "Kota Bharu", en: "Kota Bharu", zh: "哥打巴鲁" },
      },
    ],
  },
  {
    id: "terengganu",
    slug: "terengganu",
    name: { ms: "Terengganu", en: "Terengganu", zh: "登嘉楼" },
    districts: [
      {
        id: "kuala-terengganu",
        slug: "kuala-terengganu",
        name: { ms: "Kuala Terengganu", en: "Kuala Terengganu", zh: "瓜拉登嘉楼" },
      },
    ],
  },
  {
    id: "perlis",
    slug: "perlis",
    name: { ms: "Perlis", en: "Perlis", zh: "玻璃市" },
    districts: [
      {
        id: "kangar",
        slug: "kangar",
        name: { ms: "Kangar", en: "Kangar", zh: "加央" },
      },
    ],
  },
  {
    id: "kl",
    slug: "kuala-lumpur",
    name: { ms: "Kuala Lumpur", en: "Kuala Lumpur", zh: "吉隆坡" },
    districts: [
      {
        id: "kl-city",
        slug: "kl-city",
        name: { ms: "Kuala Lumpur", en: "Kuala Lumpur", zh: "吉隆坡" },
      },
    ],
  },
  {
    id: "putrajaya",
    slug: "putrajaya",
    name: { ms: "Putrajaya", en: "Putrajaya", zh: "布城" },
    districts: [
      {
        id: "putrajaya-core",
        slug: "putrajaya-core",
        name: { ms: "Putrajaya", en: "Putrajaya", zh: "布城" },
      },
    ],
  },
  {
    id: "labuan",
    slug: "labuan",
    name: { ms: "Labuan", en: "Labuan", zh: "纳闽" },
    districts: [
      {
        id: "labuan-island",
        slug: "labuan-island",
        name: { ms: "Labuan", en: "Labuan", zh: "纳闽岛" },
      },
    ],
  },
];

export function getStateById(stateId: string): State | undefined {
  return malaysiaStates.find((state) => state.id === stateId);
}

export function getDistrictById(
  stateId: string,
  districtId: string,
): District | undefined {
  return getStateById(stateId)?.districts.find(
    (district) => district.id === districtId,
  );
}
