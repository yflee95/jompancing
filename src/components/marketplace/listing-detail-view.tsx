"use client";

import { useTranslations } from "next-intl";
import { ListingOwnerActions } from "@/components/marketplace/listing-owner-actions";
import { LoginGateClient } from "@/components/marketplace/login-gate-client";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
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
  const { getListingBySlug, isLoaded } = useMarketplace();
  const listing = getListingBySlug(slug);

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

        <ListingOwnerActions listing={listing} />
      </div>
    </article>
  );
}
