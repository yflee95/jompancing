"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import { Button } from "@/components/ui/button";
import type { MarketplaceListing } from "@/types";

interface ListingOwnerActionsProps {
  listing: MarketplaceListing;
}

export function ListingOwnerActions({ listing }: ListingOwnerActionsProps) {
  const t = useTranslations("marketplace");
  const { user } = useAuth();
  const router = useRouter();
  const { deleteListing } = useMarketplace();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!user || !listing.authorId || user.id !== listing.authorId) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-2xl border border-[var(--sand-dark)]/40 bg-white p-4">
        <p className="text-sm font-medium text-[var(--ink)]">{t("manageListingTitle")}</p>
        <p className="mt-1 text-xs text-[var(--ink-muted)]">{t("manageListingDesc")}</p>
        <Button asChild variant="outline" className="mt-3">
          <Link href={`/marketplace/${listing.slug}/edit`}>
            <Pencil className="h-4 w-4" />
            {t("editListing")}
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
        <p className="text-sm font-medium text-red-800">{t("deleteListingTitle")}</p>
        <p className="mt-1 text-xs text-red-700/80">{t("deleteListingDesc")}</p>
        {deleteError && (
          <p className="mt-2 text-xs text-red-600">{deleteError}</p>
        )}
        <Button
          type="button"
          variant="outline"
          disabled={deleting}
          className="mt-3 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
          onClick={() => {
            if (!window.confirm(t("deleteListingConfirm"))) return;
            setDeleting(true);
            setDeleteError(null);
            void deleteListing(listing.id)
              .then(() => router.push("/marketplace"))
              .catch(() => setDeleteError(t("deleteListingFailed")))
              .finally(() => setDeleting(false));
          }}
        >
          <Trash2 className="h-4 w-4" />
          {deleting ? t("deleteListingProgress") : t("deleteListing")}
        </Button>
      </div>
    </div>
  );
}
