"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { slugify } from "@/lib/slug";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  deleteSpotFromDb,
  fetchSpotsFromDb,
  insertSpotToDb,
  updateSpotInDb,
} from "@/lib/supabase/spots";
import type {
  FishingSpot,
  LocalizedString,
  NewSpotInput,
  UpdateSpotInput,
} from "@/types";

const DEMO_STORAGE_KEY = "jompancing_user_spots";

export type { NewSpotInput, UpdateSpotInput };

interface SpotsContextValue {
  userSpots: FishingSpot[];
  isLoaded: boolean;
  addSpot: (input: NewSpotInput) => Promise<FishingSpot>;
  updateSpot: (input: UpdateSpotInput) => Promise<FishingSpot>;
  deleteSpot: (spotId: string) => Promise<void>;
  getUserSpotBySlug: (slug: string) => FishingSpot | undefined;
  getMySpots: (authorId: string) => FishingSpot[];
  refreshSpots: () => Promise<void>;
}

const SpotsContext = createContext<SpotsContextValue | null>(null);

function toLocalized(text: string, locale: "ms" | "en" | "zh"): LocalizedString {
  return { ms: text, en: text, zh: text, [locale]: text };
}

function loadDemoSpots(): FishingSpot[] {
  try {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Partial<FishingSpot>[];
    return parsed.map((s) => ({
      ...s,
      areaId: s.areaId ?? `${s.districtId ?? "johor-bahru"}-general`,
      photos: s.photos ?? (s.imageUrl ? [s.imageUrl] : []),
      tags: s.tags ?? s.species ?? [],
      googleAddress: s.googleAddress ?? "",
      googleMapsUrl: s.googleMapsUrl ?? "",
      visibility: s.visibility ?? "public",
      isUserGenerated: s.isUserGenerated ?? true,
    })) as FishingSpot[];
  } catch {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    return [];
  }
}

function persistDemoSpots(spots: FishingSpot[]) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(spots));
}

function createDemoSpot(input: NewSpotInput, existing: FishingSpot[]): FishingSpot {
  const now = new Date().toISOString();
  const baseSlug = slugify(input.title) || "spot";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const cover = input.photos[0] ?? "";

  return {
    id: `user-spot-${Date.now()}`,
    slug,
    title: toLocalized(input.title, input.locale),
    description: toLocalized(input.description, input.locale),
    stateId: input.stateId,
    districtId: input.districtId,
    areaId: input.areaId,
    areaName: input.areaName,
    coordinates: input.coordinates,
    waterType: input.waterType,
    species: input.tags.filter(Boolean).slice(0, 5),
    facilities: [],
    bestTime: toLocalized("—", input.locale),
    imageUrl: cover,
    photos: input.photos,
    tags: input.tags,
    googleAddress: input.googleAddress,
    googleMapsUrl: input.googleMapsUrl,
    authorId: input.authorId,
    authorName: input.authorName,
    visibility: input.visibility,
    isUserGenerated: true,
    featured: false,
    commentCount: 0,
    createdAt: now,
  };
}

export function SpotsProvider({ children }: { children: React.ReactNode }) {
  const [userSpots, setUserSpots] = useState<FishingSpot[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const useDb = isSupabaseConfigured();

  const refreshSpots = useCallback(async () => {
    if (!useDb) {
      setUserSpots(loadDemoSpots());
      setIsLoaded(true);
      return;
    }

    try {
      const spots = await fetchSpotsFromDb();
      setUserSpots(spots);
    } catch {
      setUserSpots([]);
    } finally {
      setIsLoaded(true);
    }
  }, [useDb]);

  useEffect(() => {
    void refreshSpots();
  }, [refreshSpots]);

  const addSpot = useCallback(
    async (input: NewSpotInput): Promise<FishingSpot> => {
      if (useDb) {
        const spot = await insertSpotToDb(input);
        setUserSpots((prev) => [spot, ...prev.filter((s) => s.id !== spot.id)]);
        return spot;
      }

      const spot = createDemoSpot(input, userSpots);
      const next = [spot, ...userSpots];
      setUserSpots(next);
      persistDemoSpots(next);
      return spot;
    },
    [useDb, userSpots],
  );

  const updateSpot = useCallback(
    async (input: UpdateSpotInput): Promise<FishingSpot> => {
      if (useDb) {
        const spot = await updateSpotInDb(input);
        setUserSpots((prev) =>
          prev.map((s) => (s.id === spot.id ? spot : s)),
        );
        return spot;
      }

      const existing = userSpots.find((s) => s.id === input.spotId);
      if (!existing) throw new Error("Spot not found");

      const cover = input.photos[0] ?? "";
      const updated: FishingSpot = {
        ...existing,
        title: toLocalized(input.title, input.locale),
        description: toLocalized(input.description, input.locale),
        stateId: input.stateId,
        districtId: input.districtId,
        areaId: input.areaId,
        areaName: input.areaName,
        coordinates: input.coordinates,
        waterType: input.waterType,
        species: input.tags.filter(Boolean).slice(0, 5),
        imageUrl: cover,
        photos: input.photos,
        tags: input.tags,
        googleAddress: input.googleAddress,
        googleMapsUrl: input.googleMapsUrl,
        visibility: input.visibility,
      };

      const next = userSpots.map((s) => (s.id === updated.id ? updated : s));
      setUserSpots(next);
      persistDemoSpots(next);
      return updated;
    },
    [useDb, userSpots],
  );

  const deleteSpot = useCallback(
    async (spotId: string): Promise<void> => {
      if (useDb) {
        await deleteSpotFromDb(spotId);
      }
      setUserSpots((prev) => {
        const next = prev.filter((s) => s.id !== spotId);
        if (!useDb) persistDemoSpots(next);
        return next;
      });
    },
    [useDb],
  );

  const getUserSpotBySlug = useCallback(
    (slug: string) => userSpots.find((s) => s.slug === slug),
    [userSpots],
  );

  const getMySpots = useCallback(
    (authorId: string) => userSpots.filter((s) => s.authorId === authorId),
    [userSpots],
  );

  const value = useMemo(
    () => ({
      userSpots,
      isLoaded,
      addSpot,
      updateSpot,
      deleteSpot,
      getUserSpotBySlug,
      getMySpots,
      refreshSpots,
    }),
    [userSpots, isLoaded, addSpot, updateSpot, deleteSpot, getUserSpotBySlug, getMySpots, refreshSpots],
  );

  return (
    <SpotsContext.Provider value={value}>{children}</SpotsContext.Provider>
  );
}

export function useUserSpots(): SpotsContextValue {
  const ctx = useContext(SpotsContext);
  if (!ctx) throw new Error("useUserSpots must be used within SpotsProvider");
  return ctx;
}

/** Public user spots visible to everyone */
export function getPublicUserSpots(userSpots: FishingSpot[]): FishingSpot[] {
  return userSpots.filter((s) => s.visibility === "public");
}
