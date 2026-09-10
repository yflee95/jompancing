import Image from "next/image";
import { MapPin, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { getLocalizedText, type FishingSpot } from "@/types";
import type { Locale } from "@/i18n/routing";

interface SpotCardProps {
  spot: FishingSpot;
  locale: Locale;
}

export async function SpotCard({ spot, locale }: SpotCardProps) {
  const t = await getTranslations("spots");
  const state = getStateById(spot.stateId);
  const district = getDistrictById(spot.stateId, spot.districtId);

  return (
    <Link href={`/spots/${spot.slug}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-600/10">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={spot.imageUrl}
            alt={getLocalizedText(spot.title, locale)}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {spot.featured && (
            <Badge variant="featured" className="absolute left-3 top-3">
              ★ Featured
            </Badge>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-xs font-medium text-teal-200">
              {state && getLocalizedText(state.name, locale)} ·{" "}
              {district && getLocalizedText(district.name, locale)}
            </p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900 group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">
            {getLocalizedText(spot.title, locale)}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
            {getLocalizedText(spot.description, locale)}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {t(spot.waterType as "saltwater" | "freshwater" | "pond" | "river")}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {spot.commentCount}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
