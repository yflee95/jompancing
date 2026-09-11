"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useUserSpots } from "@/components/providers/spots-provider";
import { Button } from "@/components/ui/button";
import type { FishingSpot } from "@/types";

interface SpotOwnerActionsProps {
  spot: FishingSpot;
}

export function SpotOwnerActions({ spot }: SpotOwnerActionsProps) {
  const t = useTranslations("spots");
  const { user } = useAuth();
  const router = useRouter();
  const { deleteSpot } = useUserSpots();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!user || user.id !== spot.authorId || !spot.isUserGenerated) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-2xl border border-[var(--sand-dark)]/40 bg-white p-4">
        <p className="text-sm font-medium text-[var(--ink)]">{t("manageSpotTitle")}</p>
        <p className="mt-1 text-xs text-[var(--ink-muted)]">{t("manageSpotDesc")}</p>
        <Button asChild variant="outline" className="mt-3">
          <Link href={`/spots/${spot.slug}/edit`}>
            <Pencil className="h-4 w-4" />
            {t("editSpot")}
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
        <p className="text-sm font-medium text-red-800">{t("deleteSpotTitle")}</p>
        <p className="mt-1 text-xs text-red-700/80">{t("deleteSpotDesc")}</p>
        {deleteError && (
          <p className="mt-2 text-xs text-red-600">{deleteError}</p>
        )}
        <Button
          type="button"
          variant="outline"
          disabled={deleting}
          className="mt-3 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
          onClick={() => {
            if (!window.confirm(t("deleteSpotConfirm"))) return;
            setDeleting(true);
            setDeleteError(null);
            void deleteSpot(spot.id)
              .then(() => router.push("/spots"))
              .catch(() => setDeleteError(t("deleteSpotFailed")))
              .finally(() => setDeleting(false));
          }}
        >
          <Trash2 className="h-4 w-4" />
          {deleting ? t("deleteSpotProgress") : t("deleteSpot")}
        </Button>
      </div>
    </div>
  );
}
