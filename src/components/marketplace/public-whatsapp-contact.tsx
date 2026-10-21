"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/utils";

interface PublicWhatsAppContactProps {
  whatsapp: string;
  listingTitle: string;
  contactLabel: string;
  compact?: boolean;
}

export function PublicWhatsAppContact({
  whatsapp,
  listingTitle,
  contactLabel,
  compact = false,
}: PublicWhatsAppContactProps) {
  return (
    <Button
      asChild
      size="sm"
      variant={compact ? "default" : "outline"}
      className="w-full whitespace-normal text-center leading-snug"
    >
      <a
        href={buildWhatsAppUrl(
          whatsapp,
          `Hi, I'm interested in: ${listingTitle} (via Jompancing)`,
        )}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="h-4 w-4" />
        {contactLabel}
      </a>
    </Button>
  );
}
