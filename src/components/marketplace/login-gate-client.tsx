"use client";

import { MessageCircle } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

interface LoginGateClientProps {
  whatsapp: string;
  listingTitle: string;
  loginMessage: string;
  contactLabel: string;
  compact?: boolean;
}

export function LoginGateClient({
  whatsapp,
  listingTitle,
  loginMessage,
  contactLabel,
  compact = false,
}: LoginGateClientProps) {
  const { isRegisteredUser } = useAuth();

  if (!isRegisteredUser) {
    return (
      <div className="rounded-2xl bg-[var(--sand)] p-3 text-center ring-1 ring-[var(--sand-dark)]/40">
        {!compact ? (
          <p className="text-[11px] leading-relaxed text-[var(--ink-muted)]">
            {loginMessage}
          </p>
        ) : null}
        <Button
          asChild
          size="sm"
          variant={compact ? "default" : "outline"}
          className={`w-full whitespace-normal text-center leading-snug${compact ? "" : " mt-2"}`}
        >
          <Link href="/login">{contactLabel}</Link>
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="w-full whitespace-normal text-center leading-snug"
      size="sm"
      onClick={() => {
        window.open(
          buildWhatsAppUrl(
            whatsapp,
            `Hi, I'm interested in: ${listingTitle} (via Jompancing)`,
          ),
          "_blank",
          "noopener,noreferrer",
        );
      }}
    >
      <MessageCircle className="h-4 w-4" />
      {contactLabel}
    </Button>
  );
}
