"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AppImage } from "@/components/ui/app-image";
import { formatPrice } from "@/lib/utils";
import { getLocalizedText, type MarketplaceListing } from "@/types";
import type { Locale } from "@/i18n/routing";

interface HomeListingRailCardProps {
  listing: MarketplaceListing;
  locale: Locale;
}

export function HomeListingRailCard({ listing, locale }: HomeListingRailCardProps) {
  const t = useTranslations("marketplace");
  const tCommon = useTranslations("common");
  const title = getLocalizedText(listing.title, locale);

  return (
    <Link
      href={`/marketplace/${listing.slug}`}
      className="tap-card group relative w-[42vw] max-w-[180px] min-w-[140px] shrink-0 snap-start overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-travel)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-travel-hover)] md:w-full md:max-w-none md:min-w-0"
    >
      <div className="relative aspect-square">
        <AppImage
          src={listing.imageUrl}
          alt={title}
          sizes="180px"
          placeholderVariant="square"
          placeholderLabel={tCommon("photoUnavailable")}
          className="absolute inset-0"
          imageClassName="transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[var(--ink)] backdrop-blur-sm">
          {listing.condition === "new" ? t("conditionNew") : t("conditionUsed")}
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-bold text-[var(--ocean)]">
          {formatPrice(listing.price)}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-[var(--ink)]">
          {title}
        </h3>
      </div>
    </Link>
  );
}
