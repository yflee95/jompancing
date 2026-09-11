"use client";

import { ExternalLink, Navigation } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { buildMapsUrl } from "@/lib/utils";

interface SpotDetailActionsProps {
  lat: number;
  lng: number;
}

export function SpotDetailActions({ lat, lng }: SpotDetailActionsProps) {
  const t = useTranslations("spots");
  const { isRegisteredUser } = useAuth();

  function openDirections() {
    window.open(buildMapsUrl(lat, lng), "_blank", "noopener,noreferrer");
  }

  if (!isRegisteredUser) {
    return (
      <>
        <div className="hidden sm:block">
          <div className="rounded-2xl bg-[var(--ocean-light)] p-5 ring-1 ring-[var(--ocean)]/15">
            <p className="text-sm text-[var(--ocean-dark)]">
              {t("loginForDirections")}
            </p>
            <Button asChild className="mt-3" size="lg">
              <Link href="/login">
                <Navigation className="h-4 w-4" />
                {t("directions")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-[4.25rem] z-40 border-t border-[var(--sand-dark)]/40 bg-white/95 p-3 backdrop-blur-xl sm:hidden">
          <Button asChild className="w-full" size="lg">
            <Link href="/login">
              <Navigation className="h-4 w-4" />
              {t("loginForDirections")}
            </Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hidden sm:block">
        <Button className="w-full sm:w-auto" size="lg" onClick={openDirections}>
          <Navigation className="h-4 w-4" />
          {t("directions")}
          <ExternalLink className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </div>

      <div className="fixed inset-x-0 bottom-[4.25rem] z-40 border-t border-[var(--sand-dark)]/40 bg-white/95 p-3 backdrop-blur-xl sm:hidden">
        <Button className="w-full" onClick={openDirections}>
          <Navigation className="h-4 w-4" />
          {t("directions")}
        </Button>
      </div>
    </>
  );
}
