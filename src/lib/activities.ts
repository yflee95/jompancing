import { isPromotionActive, withEffectivePromotion } from "@/lib/promotion";
import type { Activity, ActivitySort } from "@/types";

function activityHotScore(activity: Activity): number {
  const active = isPromotionActive(activity);
  return (
    (active ? 1000 : 0) +
    activity.interestCount * 3 +
    activity.viewCount * 0.1
  );
}

export function normalizeActivities(activities: Activity[]): Activity[] {
  return activities.map(withEffectivePromotion);
}

export function filterActivitiesByRegion(
  activities: Activity[],
  stateId?: string,
  districtId?: string,
  sort: ActivitySort = "hot",
): Activity[] {
  let results = activities.filter((activity) => {
    if (stateId && activity.stateId !== stateId) return false;
    if (districtId && activity.districtId !== districtId) return false;
    return true;
  });

  if (sort === "hot") {
    results = [...results].sort(
      (a, b) => activityHotScore(b) - activityHotScore(a),
    );
  } else {
    results = [...results].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  }

  return normalizeActivities(results);
}
