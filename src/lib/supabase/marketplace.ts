import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/client";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type {
  ListingCondition,
  LocalizedString,
  MarketplaceListing,
  NewMarketplaceListingInput,
} from "@/types";

type ListingRow = {
  id: string;
  slug: string;
  author_id: string;
  title_ms: string;
  title_en: string;
  title_zh: string;
  description_ms: string;
  description_en: string;
  description_zh: string;
  price: number;
  condition: string;
  state_id: string;
  district_id: string;
  image_url: string;
  whatsapp: string;
  seller_verified: boolean;
  created_at: string;
  profiles: { name: string } | { name: string }[] | null;
};

const LISTING_SELECT = `
  *,
  profiles ( name )
`;

function toLocalized(
  row: ListingRow,
  field: "title" | "description",
): LocalizedString {
  return {
    ms: row[`${field}_ms`],
    en: row[`${field}_en`],
    zh: row[`${field}_zh`],
  };
}

function profileName(profiles: ListingRow["profiles"]): string {
  if (!profiles) return "Seller";
  if (Array.isArray(profiles)) return profiles[0]?.name ?? "Seller";
  return profiles.name ?? "Seller";
}

export function mapListingRow(row: ListingRow): MarketplaceListing {
  return {
    id: row.id,
    slug: row.slug,
    title: toLocalized(row, "title"),
    description: toLocalized(row, "description"),
    price: Number(row.price),
    condition: row.condition as ListingCondition,
    stateId: row.state_id,
    districtId: row.district_id,
    sellerName: profileName(row.profiles),
    sellerVerified: row.seller_verified,
    imageUrl: row.image_url,
    whatsapp: row.whatsapp,
    createdAt: row.created_at,
    authorId: row.author_id,
  };
}

async function uploadListingPhoto(
  userId: string,
  listingId: string,
  dataUrl: string,
): Promise<string> {
  const supabase = createClient();
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const ext = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const path = `${userId}/${listingId}/cover.${ext}`;

  const { error } = await supabase.storage
    .from("listing-photos")
    .upload(path, blob, { upsert: true, contentType: blob.type });

  if (error) throw error;

  const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function fetchListingsFromDb(): Promise<MarketplaceListing[]> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(LISTING_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as ListingRow[]).map(mapListingRow);
}

export async function fetchListingBySlugFromDb(
  slug: string,
): Promise<MarketplaceListing | null> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(LISTING_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapListingRow(data as ListingRow);
}

export async function fetchListingsClient(): Promise<MarketplaceListing[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(LISTING_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as ListingRow[]).map(mapListingRow);
}

export async function insertListingToDb(
  input: NewMarketplaceListingInput,
): Promise<MarketplaceListing> {
  const supabase = createClient();
  const baseSlug = slugify(input.title) || "listing";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const title = input.title.trim();
  const description = input.description.trim();

  const { data: row, error } = await supabase
    .from("marketplace_listings")
    .insert({
      slug,
      author_id: input.authorId,
      title_ms: title,
      title_en: title,
      title_zh: title,
      description_ms: description,
      description_en: description,
      description_zh: description,
      price: input.price,
      condition: input.condition,
      state_id: input.stateId,
      district_id: input.districtId,
      whatsapp: input.whatsapp.replace(/\D/g, ""),
      image_url: "",
    })
    .select(LISTING_SELECT)
    .single();

  if (error || !row) throw error ?? new Error("Failed to create listing");

  let imageUrl = "";
  if (input.photo?.startsWith("data:")) {
    imageUrl = await uploadListingPhoto(input.authorId, row.id, input.photo);
    await supabase
      .from("marketplace_listings")
      .update({ image_url: imageUrl })
      .eq("id", row.id);
  } else if (input.photo) {
    imageUrl = input.photo;
    await supabase
      .from("marketplace_listings")
      .update({ image_url: imageUrl })
      .eq("id", row.id);
  }

  const { data: refreshed, error: refreshError } = await supabase
    .from("marketplace_listings")
    .select(LISTING_SELECT)
    .eq("id", row.id)
    .single();

  if (refreshError || !refreshed) {
    throw refreshError ?? new Error("Failed to load listing");
  }

  return mapListingRow(refreshed as ListingRow);
}

export async function deleteListingFromDb(listingId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("marketplace_listings")
    .delete()
    .eq("id", listingId);
  if (error) throw error;
}
