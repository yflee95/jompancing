"use client";

import { ExternalLink, MessageCircle, Navigation } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { LoginGate } from "@/components/shared/login-gate";
import { Button } from "@/components/ui/button";
import { buildMapsUrl } from "@/lib/utils";

interface SpotDetailActionsProps {
  lat: number;
  lng: number;
  loginMessage: string;
  directionsLabel: string;
  commentsLabel: string;
  commentCount: number;
}

export function SpotDetailActions({
  lat,
  lng,
  loginMessage,
  directionsLabel,
  commentsLabel,
  commentCount,
}: SpotDetailActionsProps) {
  const { user } = useAuth();

  if (!user) {
    return <LoginGate message={loginMessage} />;
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        className="flex-1"
        onClick={() =>
          window.open(buildMapsUrl(lat, lng), "_blank", "noopener,noreferrer")
        }
      >
        <Navigation className="h-4 w-4" />
        {directionsLabel}
        <ExternalLink className="h-3.5 w-3.5 opacity-60" />
      </Button>
      <Button variant="outline" className="flex-1">
        <MessageCircle className="h-4 w-4" />
        {commentsLabel} ({commentCount})
      </Button>
    </div>
  );
}
