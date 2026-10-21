import type { Activity } from "@/types";

/** Public event details copied in our own words from the linked organizer announcement. */
export const CURATED_ACTIVITIES: Activity[] = [
  {
    id: "official-ko-nelayan-mini-game-2026",
    slug: "ko-nelayan-mini-game-memancing-2026",
    title: {
      ms: "Pertandingan Santai Mini Game Memancing Ko-Nelayan 2026",
      en: "Ko-Nelayan Casual Mini Game Fishing Competition 2026",
      zh: "Ko-Nelayan 2026 轻松迷你钓鱼赛",
    },
    description: {
      ms: "Pengumuman rasmi Ko-Nelayan menyenaraikan pertandingan pada 31 Oktober 2026, 9.00 pagi hingga 1.00 petang di Taman Mini Akuakultur, Kg. Laya-Laya, Tuaran. Yuran yang diumumkan ialah RM38 setiap joran. Penganjur menyatakan jumlah hadiah RM3,800 dan penyertaan terhad; JomPancing tidak dapat mengesahkan baki tempat. Semak pengumuman rasmi untuk maklumat dan cara pendaftaran terkini sebelum bertolak.",
      en: "Ko-Nelayan's official announcement lists the competition for 31 October 2026, 9:00 am–1:00 pm at Taman Mini Akuakultur, Kg. Laya-Laya, Tuaran. The announced entry fee is RM38 per rod. The organizer states RM3,800 in total prizes and limited places; JomPancing has not confirmed current availability. Check the official announcement for current details and registration instructions before travelling.",
      zh: "Ko-Nelayan 官方公告列出的比赛时间为 2026 年 10 月 31 日上午 9 点至下午 1 点，地点在 Tuaran 的 Taman Mini Akuakultur, Kg. Laya-Laya。公告所列报名费为每支钓竿 RM38，奖品总额 RM3,800，名额有限；JomPancing 未核实当前剩余名额。出发前请到官方公告查看最新详情和报名方式。",
    },
    type: "contest",
    stateId: "sabah",
    districtId: "tuaran",
    venue: {
      ms: "Taman Mini Akuakultur (TMA), Kg. Laya-Laya, Tuaran",
      en: "Taman Mini Akuakultur (TMA), Kg. Laya-Laya, Tuaran",
      zh: "Taman Mini Akuakultur (TMA), Kg. Laya-Laya, Tuaran",
    },
    organizer: "Ko-Nelayan",
    verified: false,
    fee: 38,
    startDate: "2026-10-31T09:00:00+08:00",
    endDate: "2026-10-31T13:00:00+08:00",
    imageUrl: "",
    promoted: false,
    viewCount: 0,
    interestCount: 0,
    sourceUrl:
      "https://konelayan.sabah.gov.my/4.%20pusat-media-tab/aktiviti%202026/10.%20oktober/1001%20-%20Pertandingan%20Santai%20Mini%20Game%20Memancing%20Ko-Nelayan%202026.html",
  },
];

export function getCuratedActivityBySlug(slug: string): Activity | undefined {
  return CURATED_ACTIVITIES.find((activity) => activity.slug === slug);
}
