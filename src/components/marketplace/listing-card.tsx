import { getTranslations } from "next-intl/server";
import { LoginGateClient } from "@/components/marketplace/login-gate-client";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { getLocalizedText, type MarketplaceListing } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ListingCardProps {
  listing: MarketplaceListing;
  locale: Locale;
}

export async function ListingCard({ listing, locale }: ListingCardProps) {
  const t = await getTranslations("marketplace");
  const tCommon = await getTranslations("common");

  return (
    <Card className="transition hover:-translate-y-0.5">
      <div className="relative aspect-square overflow-hidden">
        <AppImage
          src={listing.imageUrl}
          alt={getLocalizedText(listing.title, locale)}
          sizes="(max-width: 768px) 50vw, 25vw"
          placeholderVariant="square"
          placeholderLabel={tCommon("photoUnavailable")}
          className="absolute inset-0"
        />
        <Badge className="absolute left-2 top-2 z-10 bg-white/90 text-[var(--ink)] backdrop-blur-sm">
          {listing.condition === "new" ? t("conditionNew") : t("conditionUsed")}
        </Badge>
      </div>
      <div className="p-3">
        <p className="text-base font-bold text-[var(--ocean)]">
          {formatPrice(listing.price)}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-[var(--ink)]">
          {getLocalizedText(listing.title, locale)}
        </h3>
        <div className="mt-3">
          <LoginGateClient
            listingTitle={getLocalizedText(listing.title, locale)}
            whatsapp={listing.whatsapp}
            loginMessage={t("loginForContact")}
            contactLabel={t("contactSeller")}
          />
        </div>
      </div>
    </Card>
  );
}
