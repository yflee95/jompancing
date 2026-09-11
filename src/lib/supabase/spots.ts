import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/client";
import type {
  FishingSpot,
  LocalizedString,
  SpotVisibility,
  WaterType,
} from "@/types";
import type { NewSpotInput, UpdateSpotInput } from "@/types";

type SpotRow = {
  id: string;
  slug: string;
  author_id: string;
  title_ms: string;
  title_en: string;
  title_zh: string;
  description_ms: string;
  description_en: string;
  description_zh: string;
  state_id: string;
  district_id: string;
  area_id: string;
  area_name: string | null;
  lat: number;
  lng: number;
  water_type: string;
  google_address: string;
  google_maps_url: string;
  visibility: SpotVisibility;
  tags: string[];
  species: string[];
  image_url: string;
  featured: boolean;
  comment_count: number;
  created_at: string;
  source?: string;
  is_curated?: boolean;
  google_place_id?: string | null;
  google_photo_attribution?: string | null;
  profiles: { name: string; avatar_url: string | null } | null;
  spot_photos: { url: string; sort_order: number }[] | null;
};

const SPOT_SELECT = `
  *,
  profiles ( name, avatar_url ),
  spot_photos ( url, sort_order )
`;

function toLocalized(row: SpotRow, field: "title" | "description"): LocalizedString {
  return {
    ms: row[`${field}_ms`],
    en: row[`${field}_en`],
    zh: row[`${field}_zh`],
  };
}

export function mapSpotRow(row: SpotRow): FishingSpot {
  const photos = [...(row.spot_photos ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) => p.url);

  return {
    id: row.id,
    slug: row.slug,
    title: toLocalized(row, "title"),
    description: toLocalized(row, "description"),
    stateId: row.state_id,
    districtId: row.district_id,
    areaId: row.area_id,
    areaName: row.area_name ?? undefined,
    coordinates: { lat: row.lat, lng: row.lng },
    waterType: row.water_type as WaterType,
    species: row.species ?? [],
    facilities: [],
    bestTime: { ms: "—", en: "—", zh: "—" },
    imageUrl: row.image_url || photos[0] || "",
    photos,
    tags: row.tags ?? [],
    googleAddress: row.google_address,
    googleMapsUrl: row.google_maps_url,
    authorId: row.author_id,
    authorName: row.profiles?.name ?? "Angler",
    authorAvatar: row.profiles?.avatar_url ?? undefined,
    visibility: row.visibility,
    isUserGenerated: row.source !== "google",
    featured: row.featured,
    photoAttribution: row.google_photo_attribution
      ? {
          artist: row.google_photo_attribution,
          license: "Google Maps",
          filePage: row.google_maps_url,
        }
      : undefined,
    commentCount: row.comment_count,
    createdAt: row.created_at,
  };
}

async function uploadDataUrlPhoto(
  userId: string,
  spotId: string,
  dataUrl: string,
  index: number,
): Promise<string> {
  const supabase = createClient();
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const ext = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
  const path = `${userId}/${spotId}/${index}.${ext}`;

  const { error } = await supabase.storage
    .from("spot-photos")
    .upload(path, blob, { upsert: true, contentType: blob.type });

  if (error) throw error;

  const { data } = supabase.storage.from("spot-photos").getPublicUrl(path);
  return data.publicUrl;
}

export async function fetchSpotsFromDb(): Promise<FishingSpot[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("spots")
    .select(SPOT_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as SpotRow[]).map(mapSpotRow);
}

async function syncSpotPhotos(
  authorId: string,
  spotId: string,
  photos: string[],
): Promise<string[]> {
  const supabase = createClient();
  const { error: deleteError } = await supabase
    .from("spot_photos")
    .delete()
    .eq("spot_id", spotId);
  if (deleteError) throw deleteError;

  const photoUrls: string[] = [];
  for (const [i, photo] of photos.entries()) {
    if (!photo) continue;
    const url = photo.startsWith("data:")
      ? await uploadDataUrlPhoto(authorId, spotId, photo, i)
      : photo;
    photoUrls.push(url);
  }

  if (photoUrls.length > 0) {
    const { error: photosError } = await supabase.from("spot_photos").insert(
      photoUrls.map((url, sort_order) => ({
        spot_id: spotId,
        url,
        sort_order,
      })),
    );
    if (photosError) throw photosError;
  }

  return photoUrls;
}

export async function updateSpotInDb(input: UpdateSpotInput): Promise<FishingSpot> {
  const supabase = createClient();
  const title = input.title.trim();
  const description = input.description.trim() || "—";

  const { error: updateError } = await supabase
    .from("spots")
    .update({
      title_ms: title,
      title_en: title,
      title_zh: title,
      description_ms: description,
      description_en: description,
      description_zh: description,
      state_id: input.stateId,
      district_id: input.districtId,
      area_id: input.areaId,
      area_name: input.areaName ?? null,
      lat: input.coordinates.lat,
      lng: input.coordinates.lng,
      water_type: input.waterType,
      google_address: input.googleAddress,
      google_maps_url: input.googleMapsUrl,
      visibility: input.visibility,
      tags: input.tags,
      species: input.tags.filter(Boolean).slice(0, 5),
    })
    .eq("id", input.spotId)
    .eq("author_id", input.authorId);

  if (updateError) throw updateError;

  const photoUrls = await syncSpotPhotos(
    input.authorId,
    input.spotId,
    input.photos,
  );

  await supabase
    .from("spots")
    .update({ image_url: photoUrls[0] ?? "" })
    .eq("id", input.spotId);

  const { data: refreshed, error: refreshError } = await supabase
    .from("spots")
    .select(SPOT_SELECT)
    .eq("id", input.spotId)
    .single();

  if (refreshError || !refreshed) {
    throw refreshError ?? new Error("Failed to load spot");
  }

  return mapSpotRow(refreshed as SpotRow);
}

export async function deleteSpotFromDb(spotId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("spots").delete().eq("id", spotId);
  if (error) throw error;
}

export async function insertSpotToDb(input: NewSpotInput): Promise<FishingSpot> {
  const supabase = createClient();
  const baseSlug = slugify(input.title) || "spot";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const title = input.title;
  const description = input.description || "—";

  const { data: spotRow, error: spotError } = await supabase
    .from("spots")
    .insert({
      slug,
      author_id: input.authorId,
      title_ms: title,
      title_en: title,
      title_zh: title,
      description_ms: description,
      description_en: description,
      description_zh: description,
      state_id: input.stateId,
      district_id: input.districtId,
      area_id: input.areaId,
      area_name: input.areaName ?? null,
      lat: input.coordinates.lat,
      lng: input.coordinates.lng,
      water_type: input.waterType,
      google_address: input.googleAddress,
      google_maps_url: input.googleMapsUrl,
      visibility: input.visibility,
      tags: input.tags,
      species: input.tags.filter(Boolean).slice(0, 5),
      image_url: "",
    })
    .select(SPOT_SELECT)
    .single();

  if (spotError || !spotRow) throw spotError ?? new Error("Failed to create spot");

  const photoUrls = await syncSpotPhotos(
    input.authorId,
    spotRow.id,
    input.photos,
  );

  if (photoUrls.length > 0) {
    await supabase
      .from("spots")
      .update({ image_url: photoUrls[0] })
      .eq("id", spotRow.id);
  }

  const { data: refreshed, error: refreshError } = await supabase
    .from("spots")
    .select(SPOT_SELECT)
    .eq("id", spotRow.id)
    .single();

  if (refreshError || !refreshed) throw refreshError ?? new Error("Failed to load spot");
  return mapSpotRow(refreshed as SpotRow);
}
