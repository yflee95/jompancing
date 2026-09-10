import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate, formatPrice } from "@/lib/utils";
import { getLocalizedText, type Activity } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ActivityCardProps {
  activity: Activity;
  locale: Locale;
}

export async function ActivityCard({ activity, locale }: ActivityCardProps) {
  const t = await getTranslations("activities");

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9]">
        <Image
          src={activity.imageUrl}
          alt={getLocalizedText(activity.title, locale)}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge>{t(activity.type)}</Badge>
          {activity.promoted && <Badge variant="featured">Promoted</Badge>}
          {activity.verified && <Badge variant="verified">{t("organizer")} ✓</Badge>}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {getLocalizedText(activity.title, locale)}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          {getLocalizedText(activity.description, locale)}
        </p>
        <div className="mt-4 space-y-2 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-600" />
            {formatDate(activity.startDate, locale)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-teal-600" />
            {getLocalizedText(activity.venue, locale)}
          </p>
          {activity.fee !== undefined && (
            <p className="font-semibold text-teal-700 dark:text-teal-300">
              {t("fee")}: {formatPrice(activity.fee)}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
