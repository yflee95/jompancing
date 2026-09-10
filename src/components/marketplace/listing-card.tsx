import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LoginGateClient } from "@/components/marketplace/login-gate-client";
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

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={listing.imageUrl}
          alt={getLocalizedText(listing.title, locale)}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <Badge className="absolute left-3 top-3">
          {listing.condition === "new" ? t("conditionNew") : t("conditionUsed")}
        </Badge>
      </div>
      <div className="p-4">
        <p className="text-lg font-bold text-teal-700 dark:text-teal-300">
          {formatPrice(listing.price)}
        </p>
        <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900 dark:text-white">
          {getLocalizedText(listing.title, locale)}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{listing.sellerName}</p>
        <div className="mt-4">
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
