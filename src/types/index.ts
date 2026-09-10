import type { Locale } from "@/i18n/routing";

export type WaterType = "saltwater" | "freshwater" | "pond" | "river";

export type ActivityType = "contest" | "sale" | "workshop" | "meetup";

export type ListingCondition = "new" | "used";

export type GuideCategory =
  | "tips"
  | "species"
  | "regulations"
  | "gear"
  | "season";

export interface LocalizedString {
  ms: string;
  en: string;
  zh: string;
}

export interface District {
  id: string;
  slug: string;
  name: LocalizedString;
}

export interface State {
  id: string;
  slug: string;
  name: LocalizedString;
  districts: District[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface FishingSpot {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  stateId: string;
  districtId: string;
  coordinates: Coordinates;
  waterType: WaterType;
  species: string[];
  facilities: string[];
  bestTime: LocalizedString;
  imageUrl: string;
  authorName: string;
  authorAvatar?: string;
  featured: boolean;
  commentCount: number;
  createdAt: string;
}

export interface Activity {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  type: ActivityType;
  stateId: string;
  districtId: string;
  venue: LocalizedString;
  organizer: string;
  verified: boolean;
  fee?: number;
  startDate: string;
  endDate: string;
  imageUrl: string;
  promoted: boolean;
}

export interface MarketplaceListing {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  price: number;
  condition: ListingCondition;
  stateId: string;
  districtId: string;
  sellerName: string;
  sellerVerified: boolean;
  imageUrl: string;
  whatsapp: string;
  createdAt: string;
}

export interface GuideArticle {
  id: string;
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  category: GuideCategory;
  readMinutes: number;
  imageUrl: string;
  publishedAt: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  homeStateId?: string;
}

export function getLocalizedText(
  value: LocalizedString,
  locale: Locale,
): string {
  return value[locale] ?? value.ms;
}
