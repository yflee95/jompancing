"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
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
  const { user } = useAuth();

  const message = t("whatsappMessage", { title: activityTitle, organizer });

  function handleInterest() {
    if (!contactWhatsApp) return;
    window.open(
      buildWhatsAppUrl(contactWhatsApp, message),
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-x-0 bottom-[4.25rem] z-40 border-t border-[var(--sand-dark)]/40 bg-white/95 p-3 backdrop-blur-xl sm:static sm:mt-8 sm:rounded-2xl sm:border sm:p-5">
        <p className="mb-3 text-center text-sm text-[var(--ink-muted)] sm:text-left">
          {t("loginForContact")}
        </p>
        <Button asChild className="w-full" size="lg">
          <Link href="/login">
            <MessageCircle className="h-4 w-4" />
            {t("contactOrganizer")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-[4.25rem] z-40 flex gap-2 border-t border-[var(--sand-dark)]/40 bg-white/95 p-3 backdrop-blur-xl sm:static sm:mt-8 sm:border-0 sm:p-0">
      <Button
        className="flex-1"
        size="lg"
        onClick={handleInterest}
        disabled={!contactWhatsApp}
      >
        <Heart className="h-4 w-4" />
        {t("imInterested")}
      </Button>
    </div>
  );
}
