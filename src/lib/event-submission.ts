import type { Locale } from "@/i18n/routing";

const eventSubmissionCopy = {
  en: {
    subject: "Suggest a fishing event for JomPancing",
    body: [
      "Hi JomPancing,",
      "",
      "Please consider this fishing event for the JomPancing calendar:",
      "Event name:",
      "Organizer:",
      "Date and time:",
      "Venue and area:",
      "Entry fee (if any):",
      "Official event or registration link:",
      "Organizer contact (optional):",
      "",
      "I understand the details will be checked with the organizer before publication. There is no submission fee.",
      "",
      "Thank you.",
    ].join("\n"),
  },
  ms: {
    subject: "Cadangkan acara memancing untuk JomPancing",
    body: [
      "Hai JomPancing,",
      "",
      "Sila pertimbangkan acara memancing ini untuk kalendar JomPancing:",
      "Nama acara:",
      "Penganjur:",
      "Tarikh dan masa:",
      "Tempat dan kawasan:",
      "Yuran penyertaan (jika ada):",
      "Pautan rasmi acara atau pendaftaran:",
      "Hubungan penganjur (pilihan):",
      "",
      "Saya faham maklumat akan disemak dengan penganjur sebelum diterbitkan. Tiada bayaran untuk menghantar cadangan.",
      "",
      "Terima kasih.",
    ].join("\n"),
  },
  zh: {
    subject: "推荐钓鱼活动给 JomPancing",
    body: [
      "你好，JomPancing：",
      "",
      "请考虑将以下钓鱼活动加入 JomPancing 活动日历：",
      "活动名称：",
      "主办方：",
      "日期和时间：",
      "地点和地区：",
      "报名费（如有）：",
      "官方活动或报名链接：",
      "主办方联系方式（选填）：",
      "",
      "我了解活动资料会先向主办方核实再发布，提交资料不收费。",
      "",
      "谢谢。",
    ].join("\n"),
  },
} satisfies Record<Locale, { subject: string; body: string }>;

export function getEventSubmissionHref(locale: Locale): `mailto:${string}` {
  const copy = eventSubmissionCopy[locale];
  return `mailto:hello@jompancing.my?subject=${encodeURIComponent(copy.subject)}&body=${encodeURIComponent(copy.body)}`;
}
