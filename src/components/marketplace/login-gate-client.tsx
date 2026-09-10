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
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-3 text-center dark:border-slate-700">
        <p className="text-xs text-slate-500">{loginMessage}</p>
        <Button asChild size="sm" className="mt-2 w-full">
          <Link href="/login">{contactLabel}</Link>
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="w-full"
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
