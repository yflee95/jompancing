import type { Activity } from "@/types";

/** Free promotion trial for new activity listings */
export const FREE_PROMOTION_DAYS = 2;

/** Paid renewal rate after free trial (MYR per day) */
export const PAID_PROMOTION_DAILY_RM = 29;

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
