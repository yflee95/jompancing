/**
 * Seed curated fishing spots from Google Places into Supabase.
 *
 * Prerequisites:
 * - Run supabase/migrations/006_curated_google_spots.sql
 * - Env: GOOGLE_MAPS_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * - Enable Places API + Geocoding API in Google Cloud
 *
 * Usage:
 *   npm run seed:spots
 *   npm run seed:spots -- --district=johor-bahru
 *   npm run seed:spots -- --dry-run
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { malaysiaStates } from "../src/data/malaysia-states";
import { getGeneralAreaId } from "../src/data/malaysia-areas";
import {
  buildGoogleMapsPlaceUrl,
  buildGooglePhotoFetchUrl,
  fetchGooglePlaceDetails,
  searchGooglePlaces,
} from "../src/lib/google-places-server";
import { slugify } from "../src/lib/slug";
import type { WaterType } from "../src/types";

const SPOTS_PER_DISTRICT = 2;
const SEED_USER_ID = "c0ffee00-0000-4000-8000-000000000001";
const SEED_EMAIL = "curated@jompancing.my";
const SEED_NAME = "Jompancing";

loadEnvFile();

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const districtFilter = args
  .find((a) => a.startsWith("--district="))
  ?.split("=")[1];

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!envPath || !existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function inferWaterType(name: string, types: string[]): WaterType {
  const haystack = `${name} ${types.join(" ")}`.toLowerCase();
  if (/kolam|pond|fish.?farm|memancing.?kolam/.test(haystack)) return "pond";
  if (/sungai|river|waterfall/.test(haystack)) return "river";
  if (/tasik|lake|empangan|dam/.test(haystack)) return "freshwater";
  return "saltwater";
}

function isFishingRelated(name: string, types: string[]): boolean {
  const haystack = `${name} ${types.join(" ")}`.toLowerCase();
  return /fish|memancing|jeti|jetty|pier|marina|kolam|pond|angling|laut|pantai|coast|harbour|harbor|port|tasik|sungai|river|aquarium|nelayan/.test(
    haystack,
  );
}

function buildQueries(districtEn: string, stateEn: string): string[] {
  return [
    `fishing spot ${districtEn} ${stateEn} Malaysia`,
    `kolam memancing ${districtEn} Malaysia`,
    `jeti memancing ${districtEn} Malaysia`,
    `fishing jetty ${districtEn} Malaysia`,
  ];
}

function buildDescription(
  name: string,
  address: string,
  rating?: number,
  reviews?: number,
): string {
  const parts = [
    `${name} — curated from Google Maps for Malaysian anglers.`,
    address,
  ];
  if (rating && reviews) {
    parts.push(`Google rating ${rating}/5 (${reviews} reviews).`);
  }
  parts.push("Verify access rules and tides before fishing.");
  return parts.join(" ");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SeedSupabase = any;

async function ensureSeedUser(supabase: SeedSupabase) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", SEED_USER_ID)
    .maybeSingle();

  if (existing) return;

  const { error: authError } = await supabase.auth.admin.createUser({
    id: SEED_USER_ID,
    email: SEED_EMAIL,
    email_confirm: true,
    user_metadata: { name: SEED_NAME },
  });

  if (authError && !authError.message.includes("already")) {
    throw authError;
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: SEED_USER_ID,
    name: SEED_NAME,
    email: SEED_EMAIL,
  });

  if (profileError) throw profileError;
}

async function uploadPlacePhoto(
  supabase: SeedSupabase,
  spotId: string,
  photoReference: string,
): Promise<string | null> {
  const photoUrl = buildGooglePhotoFetchUrl(photoReference);
  const response = await fetch(photoUrl);
  if (!response.ok) return null;

  const blob = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const ext = contentType.includes("png") ? "png" : "jpg";
  const path = `${SEED_USER_ID}/${spotId}/cover.${ext}`;

  const { error } = await supabase.storage
    .from("spot-photos")
    .upload(path, blob, { upsert: true, contentType });

  if (error) {
    console.warn("  photo upload failed:", error.message);
    return null;
  }

  const { data } = supabase.storage.from("spot-photos").getPublicUrl(path);
  return data.publicUrl;
}

async function seedDistrict(
  supabase: SeedSupabase,
  stateId: string,
  stateEn: string,
  districtId: string,
  districtEn: string,
) {
  console.log(`\n📍 ${districtEn}, ${stateEn}`);

  const { data: existingRows } = await supabase
    .from("spots")
    .select("google_place_id")
    .eq("state_id", stateId)
    .eq("district_id", districtId)
    .eq("source", "google");

  const seen = new Set(
    (existingRows ?? [])
      .map((r: { google_place_id: string | null }) => r.google_place_id)
      .filter(Boolean) as string[],
  );

  let inserted = 0;
  const queries = buildQueries(districtEn, stateEn);

  for (const query of queries) {
    if (inserted >= SPOTS_PER_DISTRICT) break;

    let results;
    try {
      results = await searchGooglePlaces(query);
    } catch (error) {
      console.warn(`  search failed (${query}):`, error);
      await sleep(300);
      continue;
    }

    for (const candidate of results) {
      if (inserted >= SPOTS_PER_DISTRICT) break;
      if (seen.has(candidate.placeId)) continue;
      if (!isFishingRelated(candidate.name, candidate.types)) continue;

      await sleep(250);
      const details = await fetchGooglePlaceDetails(candidate.placeId);
      if (!details) continue;

      const title = details.name.trim();
      const description = buildDescription(
        title,
        details.address,
        details.rating,
        details.userRatingsTotal,
      );
      const waterType = inferWaterType(title, details.types);
      const slug = `${slugify(title) || "spot"}-${details.placeId.slice(-8)}`;
      const mapsUrl = buildGoogleMapsPlaceUrl(
        details.placeId,
        details.lat,
        details.lng,
      );

      console.log(`  + ${title}`);

      if (dryRun) {
        seen.add(details.placeId);
        inserted++;
        continue;
      }

      const { data: spotRow, error: insertError } = await supabase
        .from("spots")
        .insert({
          slug,
          author_id: SEED_USER_ID,
          title_ms: title,
          title_en: title,
          title_zh: title,
          description_ms: description,
          description_en: description,
          description_zh: description,
          state_id: stateId,
          district_id: districtId,
          area_id: getGeneralAreaId(districtId),
          lat: details.lat,
          lng: details.lng,
          water_type: waterType,
          google_address: details.address,
          google_maps_url: mapsUrl,
          visibility: "public",
          tags: ["Google Maps", waterType],
          species: [],
          image_url: "",
          featured: inserted === 0,
          source: "google",
          is_curated: true,
          google_place_id: details.placeId,
          google_photo_attribution: details.photoAttribution ?? null,
        })
        .select("id")
        .single();

      if (insertError) {
        console.warn("  insert failed:", insertError.message);
        continue;
      }

      seen.add(details.placeId);
      inserted++;

      if (details.photoReference && spotRow?.id) {
        await sleep(250);
        const publicUrl = await uploadPlacePhoto(
          supabase,
          spotRow.id,
          details.photoReference,
        );
        if (publicUrl) {
          await supabase
            .from("spots")
            .update({ image_url: publicUrl })
            .eq("id", spotRow.id);
          await supabase.from("spot_photos").insert({
            spot_id: spotRow.id,
            url: publicUrl,
            sort_order: 0,
          });
        }
      }
    }

    await sleep(300);
  }

  if (inserted < SPOTS_PER_DISTRICT) {
    console.warn(
      `  ⚠ only ${inserted}/${SPOTS_PER_DISTRICT} spots found — try adding manually`,
    );
  }
}

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (!dryRun) {
    await ensureSeedUser(supabase);
  }

  let districtCount = 0;

  for (const state of malaysiaStates) {
    for (const district of state.districts) {
      if (districtFilter && district.id !== districtFilter) continue;
      districtCount++;
      await seedDistrict(
        supabase,
        state.id,
        state.name.en,
        district.id,
        district.name.en,
      );
    }
  }

  console.log(
    `\n✅ Done${dryRun ? " (dry run)" : ""} — processed ${districtCount} districts`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
