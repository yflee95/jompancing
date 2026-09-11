"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LoginGateClient } from "@/components/marketplace/login-gate-client";
import { useAuth } from "@/components/providers/auth-provider";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGeneralAreaId } from "@/data/malaysia-areas";
import { getSpotLocationLine } from "@/lib/spot-location";
import { formatDate, formatPrice } from "@/lib/utils";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ListingDetailViewProps {
  slug: string;
  locale: Locale;
}

export function ListingDetailView({ slug, locale }: ListingDetailViewProps) {
  const t = useTranslations("marketplace");
  const tCommon = useTranslations("common");
  const { user } = useAuth();
  const router = useRouter();
  const { getListingBySlug, deleteListing, isLoaded } = useMarketplace();
  const listing = getListingBySlug(slug);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--ocean)] border-t-transparent" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-[var(--ink-muted)]">{t("notFound")}</p>
      </div>
    );
  }

  const isOwner = user?.id === listing.authorId;
  const title = getLocalizedText(listing.title, locale);

  return (
    <article className="mx-auto max-w-lg px-4 py-6 pb-24">
      <div className="relative aspect-square overflow-hidden rounded-3xl">
        <AppImage
          src={listing.imageUrl}
          alt={title}
          sizes="(max-width: 512px) 100vw, 512px"
          placeholderVariant="square"
          placeholderLabel={tCommon("photoUnavailable")}
          className="absolute inset-0"
        />
        <Badge className="absolute left-3 top-3 z-10 bg-white/90 text-[var(--ink)] backdrop-blur-sm">
          {listing.condition === "new" ? t("conditionNew") : t("conditionUsed")}
        </Badge>
      </div>

      <div className="mt-5">
        <p className="text-2xl font-bold text-[var(--ocean)]">
          {formatPrice(listing.price)}
        </p>
        <h1 className="font-serif-display mt-2 text-2xl font-bold text-[var(--ink)]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          {getSpotLocationLine(
            {
              stateId: listing.stateId,
              districtId: listing.districtId,
              areaId: getGeneralAreaId(listing.districtId),
            },
            locale,
          )}
        </p>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          {t("seller")}: {listing.sellerName}
          {listing.sellerVerified && (
            <span className="ml-2 text-[var(--ocean)]">✓ {tCommon("verified")}</span>
          )}
        </p>
        <p className="mt-1 text-xs text-[var(--ink-muted)]">
          {formatDate(listing.createdAt, locale)}
        </p>

        <p className="mt-4 text-base leading-relaxed text-[var(--ink-muted)]">
          {getLocalizedText(listing.description, locale)}
        </p>

        <div className="mt-6">
          <LoginGateClient
            listingTitle={title}
            whatsapp={listing.whatsapp}
            loginMessage={t("loginForContact")}
            contactLabel={t("contactSeller")}
          />
        </div>

        <p className="mt-4 text-xs text-[var(--ink-muted)]">{t("codDisclaimer")}</p>

        {isOwner && (
          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50/50 p-4">
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
        )}
      </div>
    </article>
  );
}
