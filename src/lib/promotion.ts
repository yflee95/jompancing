import type { Activity } from "@/types";
import type { Locale } from "@/i18n/routing";

/** Free promotion trial for new activity listings */
export const FREE_PROMOTION_DAYS = 2;

/** Paid renewal rate after free trial (MYR per day) */
export const PAID_PROMOTION_DAILY_RM = 29;

export function getPromotionInquiryHref(options: {
  locale: Locale;
  title?: string;
  slug?: string;
}): string {
  const { locale, title, slug } = options;
  const subjectPrefix = {
    en: "JomPancing promotion enquiry",
    ms: "Pertanyaan promosi JomPancing",
    zh: "JomPancing 活动推广咨询",
  }[locale];
  const subject = title ? `${subjectPrefix}: ${title}` : subjectPrefix;
  const listingUrl = title && slug
    ? `https://www.jompancing.my/${locale}/activities/${encodeURIComponent(slug)}`
    : undefined;
  const message = {
    en: {
      greeting: "Hi JomPancing,",
      specific: "I would like to ask about continuing paid promotion for this activity.",
      general: "I would like to ask about the optional paid promotion after the free trial.",
      activity: "Activity",
      listing: "Listing",
      confirm: "Please confirm availability and payment instructions. Do not renew or charge me unless I reply to confirm.",
      thanks: "Thank you.",
    },
    ms: {
      greeting: "Hai JomPancing,",
      specific: "Saya ingin bertanya tentang sambungan promosi berbayar untuk aktiviti ini.",
      general: "Saya ingin bertanya tentang promosi berbayar pilihan selepas percubaan percuma.",
      activity: "Aktiviti",
      listing: "Pautan aktiviti",
      confirm: "Sila sahkan kekosongan dan cara bayaran. Jangan sambung promosi atau membuat caj sebelum saya mengesahkannya.",
      thanks: "Terima kasih.",
    },
    zh: {
      greeting: "你好，JomPancing：",
      specific: "我想咨询这项活动的付费推广续期。",
      general: "我想咨询免费试用后的可选付费推广。",
      activity: "活动",
      listing: "活动链接",
      confirm: "请先确认档期和付款方式；未经我回复确认，请勿续期或扣款。",
      thanks: "谢谢。",
    },
  }[locale];
  const body = [
    message.greeting,
    "",
    title ? message.specific : message.general,
    ...(title ? [`${message.activity}: ${title}`] : []),
    ...(listingUrl ? [`${message.listing}: ${listingUrl}`] : []),
    "",
    message.confirm,
    "",
    message.thanks,
  ].join("\n");

  return `mailto:hello@jompancing.my?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function computeFreePromotionEnd(from: Date = new Date()): string {
  const end = new Date(from);
  end.setDate(end.getDate() + FREE_PROMOTION_DAYS);
  return end.toISOString();
}

export function isPromotionActive(
  activity: Pick<Activity, "promoted" | "promotedUntil">,
): boolean {
  if (!activity.promotedUntil) return Boolean(activity.promoted);
  return new Date(activity.promotedUntil) > new Date();
}

export function withEffectivePromotion<T extends Activity>(activity: T): T {
  return {
    ...activity,
    promoted: isPromotionActive(activity),
  };
}

export function getPromotionDaysLeft(promotedUntil?: string): number {
  if (!promotedUntil) return 0;
  const ms = new Date(promotedUntil).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
