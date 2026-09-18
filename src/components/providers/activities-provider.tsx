"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mockActivities } from "@/data/mock-data";
import { shouldUseMockContent } from "@/lib/mock-content";
import { slugify } from "@/lib/slug";
import { computeFreePromotionEnd } from "@/lib/promotion";
import { normalizeActivities } from "@/lib/activities";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  fetchActivitiesFromDb,
  insertActivityToDb,
} from "@/lib/supabase/activities";
import type { Activity, LocalizedString, NewActivityInput } from "@/types";

const DEMO_STORAGE_KEY = "jompancing_activities";

interface ActivitiesContextValue {
  activities: Activity[];
  isLoaded: boolean;
  addActivity: (input: NewActivityInput) => Promise<Activity>;
  getActivityBySlug: (slug: string) => Activity | undefined;
  refreshActivities: () => Promise<void>;
}

const ActivitiesContext = createContext<ActivitiesContextValue | null>(null);

function toLocalized(
  text: string,
  locale: "ms" | "en" | "zh",
): LocalizedString {
  return { ms: text, en: text, zh: text, [locale]: text };
}

function loadDemoActivities(): Activity[] {
  try {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Activity[];
  } catch {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    return [];
  }
}

function persistDemoActivities(activities: Activity[]) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(activities));
}

function createDemoActivity(input: NewActivityInput): Activity {
  const now = new Date().toISOString();
  const baseSlug = slugify(input.title) || "activity";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  return {
    id: `user-activity-${Date.now()}`,
    slug,
    title: toLocalized(input.title, input.locale),
    description: toLocalized(input.description, input.locale),
    type: input.type,
    stateId: input.stateId,
    districtId: input.districtId,
    venue: toLocalized(input.venue, input.locale),
    organizer: input.organizer,
    verified: false,
    fee: input.fee,
    startDate: input.startDate,
    endDate: input.endDate,
    imageUrl: input.imageUrl ?? "",
    promoted: true,
    promotedUntil: computeFreePromotionEnd(),
    promotionFreeTrialUsed: true,
    authorId: input.authorId,
    viewCount: 0,
    interestCount: 0,
    contactWhatsApp: input.contactWhatsApp,
  };
}

export function ActivitiesProvider({ children }: { children: React.ReactNode }) {
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const useDb = isSupabaseConfigured();

  const refreshActivities = useCallback(async () => {
    if (!useDb) {
      setUserActivities(loadDemoActivities());
      setIsLoaded(true);
      return;
    }

    try {
      const rows = await fetchActivitiesFromDb();
      setUserActivities(rows);
    } catch {
      setUserActivities([]);
    } finally {
      setIsLoaded(true);
    }
  }, [useDb]);

  useEffect(() => {
    void refreshActivities();
  }, [refreshActivities]);

  const addActivity = useCallback(
    async (input: NewActivityInput): Promise<Activity> => {
      if (useDb) {
        const activity = await insertActivityToDb(input);
        setUserActivities((prev) => [
          activity,
          ...prev.filter((a) => a.id !== activity.id),
        ]);
        return activity;
      }

      const activity = createDemoActivity(input);
      const next = [activity, ...userActivities];
      setUserActivities(next);
      persistDemoActivities(next);
      return activity;
    },
    [useDb, userActivities],
  );

  const activities = useMemo(
    () =>
      normalizeActivities([
        ...userActivities,
        ...(shouldUseMockContent() ? mockActivities : []),
      ]),
    [userActivities],
  );

  const getActivityBySlug = useCallback(
    (slug: string) => activities.find((a) => a.slug === slug),
    [activities],
  );

  const value = useMemo(
    () => ({
      activities,
      isLoaded,
      addActivity,
      getActivityBySlug,
      refreshActivities,
    }),
    [activities, isLoaded, addActivity, getActivityBySlug, refreshActivities],
  );

  return (
    <ActivitiesContext.Provider value={value}>
      {children}
    </ActivitiesContext.Provider>
  );
}

export function useActivities(): ActivitiesContextValue {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) {
    throw new Error("useActivities must be used within ActivitiesProvider");
  }
  return ctx;
}
