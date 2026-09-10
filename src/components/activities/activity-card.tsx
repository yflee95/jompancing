import { Calendar, Flame, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AppImage } from "@/components/ui/app-image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDistrictById, getStateById } from "@/data/malaysia-states";
import { formatDate } from "@/lib/utils";
import { getLocalizedText, type Activity } from "@/types";
import type { Locale } from "@/i18n/routing";

interface ActivityCardProps {
  activity: Activity;
  locale: Locale;
}

export async function ActivityCard({ activity, locale }: ActivityCardProps) {
  const t = await getTranslations("activities");
  const tCommon = await getTranslations("common");

  const state = getStateById(activity.stateId);
  const district = getDistrictById(activity.stateId, activity.districtId);
  const locationLabel = district
    ? getLocalizedText(district.name, locale)
    : state
      ? getLocalizedText(state.name, locale)
      : getLocalizedText(activity.venue, locale);

  return (
    <Link href={`/activities/${activity.slug}`} className="tap-card block">
      <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(44,36,22,0.1)]">
        <div className="relative aspect-[16/10] overflow-hidden">
          <AppImage
            src={activity.imageUrl}
            alt={getLocalizedText(activity.title, locale)}
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholderVariant="wide"
            placeholderLabel={tCommon("photoUnavailable")}
            className="absolute inset-0"
            imageClassName="transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
            <Badge className="bg-white/90 text-[var(--ink)] backdrop-blur-sm">
              {t(activity.type)}
            </Badge>
            {activity.promoted && (
              <span className="badge-accent inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold">
                <Flame className="h-3 w-3" />
                {t("hot")}
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-serif-display line-clamp-2 text-lg font-semibold text-[var(--ink)]">
            {getLocalizedText(activity.title, locale)}
          </h3>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--ink-muted)]">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-[var(--ocean)]" />
              {formatDate(activity.startDate, locale)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[var(--ocean)]" />
              {locationLabel}
            </span>
          </div>
          <p className="mt-2 text-xs text-[var(--ocean)]">{t("viewDetails")}</p>
        </div>
      </Card>
    </Link>
  );
}
