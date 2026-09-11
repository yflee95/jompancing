"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { getGeneralAreaId } from "@/data/malaysia-areas";
import { getSpotLocationLine } from "@/lib/spot-location";
import { formatPrice } from "@/lib/utils";
import { getLocalizedText, type MarketplaceListing } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ListingCardProps {
  listing: MarketplaceListing;
  locale: Locale;
}

export function ListingCard({ listing, locale }: ListingCardProps) {
  const t = useTranslations("marketplace");
  const tCommon = useTranslations("common");

  const title = getLocalizedText(listing.title, locale);
  const location = getSpotLocationLine(
    {
      stateId: listing.stateId,
      districtId: listing.districtId,
      areaId: getGeneralAreaId(listing.districtId),
    },
    locale,
  );

  return (
    <Link
      href={`/marketplace/${listing.slug}`}
      className="tap-card group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-travel)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-travel-hover)]"
    >
      <div className="relative aspect-square overflow-hidden">
        <AppImage
          src={listing.imageUrl}
          alt={title}
          sizes="(max-width: 768px) 50vw, 33vw"
          placeholderVariant="square"
          placeholderLabel={tCommon("photoUnavailable")}
          className="absolute inset-0"
          imageClassName="transition duration-500 group-hover:scale-105"
        />
        <Badge className="absolute left-2 top-2 z-10 max-w-[calc(100%-1rem)] truncate bg-white/90 text-[var(--ink)] backdrop-blur-sm">
          {listing.condition === "new" ? t("conditionNew") : t("conditionUsed")}
        </Badge>
      </div>
      <div className="flex min-h-[4.5rem] flex-1 flex-col p-3">
        <p className="text-sm font-bold text-[var(--ocean)] md:text-base">
          {formatPrice(listing.price)}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-[var(--ink)] md:text-sm">
          {title}
        </h3>
        {location ? (
          <p className="mt-auto line-clamp-1 pt-1.5 text-[10px] text-[var(--ink-muted)] md:text-[11px]">
            {location}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
