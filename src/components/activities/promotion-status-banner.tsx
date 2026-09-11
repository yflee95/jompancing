"use client";

import { Clock, Megaphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import {
  getPromotionDaysLeft,
  isPromotionActive,
  PAID_PROMOTION_DAILY_RM,
} from "@/lib/promotion";
import type { Activity } from "@/types";
interface PromotionStatusBannerProps {
  activity: Activity;
}

export function PromotionStatusBanner({
  activity,
}: PromotionStatusBannerProps) {
  const t = useTranslations("activities");
  const { user } = useAuth();

  const isOwner = user?.id === activity.authorId;
  if (!isOwner) return null;

  const active = isPromotionActive(activity);
  const daysLeft = getPromotionDaysLeft(activity.promotedUntil);

  if (active) {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[var(--ocean-light)] p-4 ring-1 ring-[var(--ocean)]/20">
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ocean)]" />
        <div>
          <p className="text-sm font-semibold text-[var(--ocean-dark)]">
            {t("promotionActive", { days: daysLeft })}
          </p>
          <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
            {t("promotionActiveHint", { price: PAID_PROMOTION_DAILY_RM })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-[var(--accent-light)] p-4 ring-1 ring-[var(--accent)]/25 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-[var(--ink)]">
          {t("promotionExpired")}
        </p>
        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
          {t("promotionExpiredHint", { price: PAID_PROMOTION_DAILY_RM })}
        </p>
      </div>
      <Link
        href="/activities/promote"
        className="tap-card inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white"
      >
        <Megaphone className="h-4 w-4" />
        {t("renewPromotion")}
      </Link>
    </div>
  );
}
