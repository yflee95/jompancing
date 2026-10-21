"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/utils";

interface ActivityDetailActionsProps {
  activityTitle: string;
  organizer: string;
  contactWhatsApp?: string;
}

export function ActivityDetailActions({
  activityTitle,
  organizer,
  contactWhatsApp,
}: ActivityDetailActionsProps) {
  const t = useTranslations("activities");

  const message = t("whatsappMessage", { title: activityTitle, organizer });
  if (!contactWhatsApp) {
    return (
      <div className="mt-6 rounded-2xl bg-[var(--sand)] p-4 ring-1 ring-[var(--sand-dark)]/40">
        <p className="text-sm text-[var(--ink-muted)]">
          {t("organizerNoContact")}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-[4.25rem] z-40 flex gap-2 border-t border-[var(--sand-dark)]/40 bg-white/95 p-3 backdrop-blur-xl sm:static sm:mt-8 sm:border-0 sm:p-0">
      <Button asChild className="flex-1" size="lg">
        <a
          href={buildWhatsAppUrl(contactWhatsApp, message)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Heart className="h-4 w-4" />
          {t("imInterested")}
        </a>
      </Button>
    </div>
  );
}
