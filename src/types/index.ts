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

export type ForumCategory =
  | "spots"
  | "techniques"
  | "bait"
  | "hooks"
  | "fish"
  | "ornamental"
  | "general";

export type ActivitySort = "hot" | "upcoming";

export type SpotVisibility = "public" | "private";

export interface LocalizedString {
  ms: string;
  en: string;
  zh: string;
}

export interface Area {
  id: string;
  slug: string;
  name: LocalizedString;
  stateId: string;
  districtId: string;
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

export interface NewSpotInput {
  title: string;
  description: string;
  googleAddress: string;
  googleMapsUrl: string;
  coordinates: Coordinates;
  waterType: WaterType;
  tags: string[];
  photos: string[];
  visibility: SpotVisibility;
  authorId: string;
  authorName: string;
  locale: Locale;
  stateId: string;
  districtId: string;
  areaId: string;
  areaName?: string;
}

export interface FishingSpot {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  stateId: string;
  districtId: string;
  areaId: string;
  /** Custom area label when areaId ends with `-general` override or user typed */
  areaName?: string;
  coordinates: Coordinates;
  waterType: WaterType;
  species: string[];
  facilities: string[];
  bestTime: LocalizedString;
  /** Primary cover — first user photo or legacy mock image */
  imageUrl: string;
  /** User-uploaded photos (UGC core) */
  photos: string[];
  /** Wikimedia Commons attribution when seed photo is from Commons */
  photoAttribution?: {
    artist: string;
    license: string;
    filePage: string;
  };
  /** User tags: species, bait, notes, etc. */
  tags: string[];
  /** Required Google Maps address / place name */
  googleAddress: string;
  googleMapsUrl: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  visibility: SpotVisibility;
  isUserGenerated: boolean;
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
  viewCount: number;
  interestCount: number;
  contactWhatsApp?: string;
}

export interface ForumPost {
  id: string;
  slug: string;
  title: LocalizedString;
  body: LocalizedString;
  category: ForumCategory;
  authorName: string;
  replyCount: number;
  viewCount: number;
  hotScore: number;
  createdAt: string;
  lastReplyAt: string;
  pinned?: boolean;
}

export interface ForumReply {
  id: string;
  postId: string;
  authorName: string;
  body: LocalizedString;
  createdAt: string;
}

export interface SpotComment {
  id: string;
  spotId: string;
  authorName: string;
  body: LocalizedString;
  createdAt: string;
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
