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
}

export function LoginGateClient({
  whatsapp,
  listingTitle,
  loginMessage,
  contactLabel,
}: LoginGateClientProps) {
  const { isRegisteredUser } = useAuth();

  if (!isRegisteredUser) {
    return (
      <div className="rounded-2xl bg-[var(--sand)] p-3 text-center ring-1 ring-[var(--sand-dark)]/40">
        <p className="text-[11px] text-[var(--ink-muted)]">{loginMessage}</p>
        <Button asChild size="sm" variant="outline" className="mt-2 w-full">
          <Link href="/login">{contactLabel}</Link>
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="w-full"
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
