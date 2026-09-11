"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mockListings } from "@/data/mock-data";
import { slugify } from "@/lib/slug";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  deleteListingFromDb,
  fetchListingsClient,
  insertListingToDb,
  updateListingInDb,
} from "@/lib/supabase/marketplace";
import type {
  LocalizedString,
  MarketplaceListing,
  NewMarketplaceListingInput,
  UpdateMarketplaceListingInput,
} from "@/types";

const DEMO_STORAGE_KEY = "jompancing_marketplace_listings";

interface MarketplaceContextValue {
  listings: MarketplaceListing[];
  isLoaded: boolean;
  addListing: (input: NewMarketplaceListingInput) => Promise<MarketplaceListing>;
  updateListing: (input: UpdateMarketplaceListingInput) => Promise<MarketplaceListing>;
  deleteListing: (listingId: string) => Promise<void>;
  getListingBySlug: (slug: string) => MarketplaceListing | undefined;
  refreshListings: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

function toLocalized(text: string, locale: "ms" | "en" | "zh"): LocalizedString {
  return { ms: text, en: text, zh: text, [locale]: text };
}

function loadDemoListings(): MarketplaceListing[] {
  try {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as MarketplaceListing[]) : [];
  } catch {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    return [];
  }
}

function persistDemoListings(listings: MarketplaceListing[]) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(listings));
}

function createDemoListing(input: NewMarketplaceListingInput): MarketplaceListing {
  const now = new Date().toISOString();
  const baseSlug = slugify(input.title) || "listing";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  return {
    id: `user-listing-${Date.now()}`,
    slug,
    title: toLocalized(input.title, input.locale),
    description: toLocalized(input.description, input.locale),
    price: input.price,
    condition: input.condition,
    stateId: input.stateId,
    districtId: input.districtId,
    sellerName: input.authorName,
    sellerVerified: false,
    imageUrl: input.photo ?? "",
    whatsapp: input.whatsapp.replace(/\D/g, ""),
    createdAt: now,
    authorId: input.authorId,
  };
}

function mergeListings(
  userListings: MarketplaceListing[],
  seed: MarketplaceListing[],
): MarketplaceListing[] {
  const seen = new Set<string>();
  return [...userListings, ...seed].filter((listing) => {
    if (seen.has(listing.id)) return false;
    seen.add(listing.id);
    return true;
  });
}

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const useDb = isSupabaseConfigured();
  const [userListings, setUserListings] = useState<MarketplaceListing[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshListings = useCallback(async () => {
    if (useDb) {
      try {
        const rows = await fetchListingsClient();
        setUserListings(rows);
      } catch {
        setUserListings([]);
      }
    } else {
      setUserListings(loadDemoListings());
    }
    setIsLoaded(true);
  }, [useDb]);

  useEffect(() => {
    void refreshListings();
  }, [refreshListings]);

  const listings = useMemo(
    () => mergeListings(userListings, mockListings),
    [userListings],
  );

  const addListing = useCallback(
    async (input: NewMarketplaceListingInput): Promise<MarketplaceListing> => {
      if (useDb) {
        const listing = await insertListingToDb(input);
        setUserListings((prev) => [
          listing,
          ...prev.filter((l) => l.id !== listing.id),
        ]);
        return listing;
      }

      const listing = createDemoListing(input);
      const next = [listing, ...userListings];
      setUserListings(next);
      persistDemoListings(next);
      return listing;
    },
    [useDb, userListings],
  );

  const updateListing = useCallback(
    async (input: UpdateMarketplaceListingInput): Promise<MarketplaceListing> => {
      if (useDb) {
        const listing = await updateListingInDb(input);
        setUserListings((prev) =>
          prev.map((l) => (l.id === listing.id ? listing : l)),
        );
        return listing;
      }

      const existing = userListings.find((l) => l.id === input.listingId);
      if (!existing || existing.authorId !== input.authorId) {
        throw new Error("Forbidden");
      }

      const updated: MarketplaceListing = {
        ...existing,
        title: toLocalized(input.title, input.locale),
        description: toLocalized(input.description, input.locale),
        price: input.price,
        condition: input.condition,
        stateId: input.stateId,
        districtId: input.districtId,
        whatsapp: input.whatsapp.replace(/\D/g, ""),
        imageUrl: input.photo ?? existing.imageUrl,
      };
      const next = userListings.map((l) => (l.id === updated.id ? updated : l));
      setUserListings(next);
      persistDemoListings(next);
      return updated;
    },
    [useDb, userListings],
  );

  const deleteListing = useCallback(
    async (listingId: string) => {
      if (useDb) {
        await deleteListingFromDb(listingId);
      }
      setUserListings((prev) => {
        const next = prev.filter((l) => l.id !== listingId);
        if (!useDb) persistDemoListings(next);
        return next;
      });
    },
    [useDb],
  );

  const getListingBySlug = useCallback(
    (slug: string) => listings.find((l) => l.slug === slug),
    [listings],
  );

  const value = useMemo(
    () => ({
      listings,
      isLoaded,
      addListing,
      updateListing,
      deleteListing,
      getListingBySlug,
      refreshListings,
    }),
    [
      listings,
      isLoaded,
      addListing,
      updateListing,
      deleteListing,
      getListingBySlug,
      refreshListings,
    ],
  );

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace(): MarketplaceContextValue {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) {
    throw new Error("useMarketplace must be used within MarketplaceProvider");
  }
  return ctx;
}
