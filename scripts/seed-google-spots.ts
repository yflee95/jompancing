/**
 * Seed curated fishing spots from Google Places — per named area (州 → 縣 → 區域).
 *
 * Target: up to 2 unique spots per area (1 is acceptable if Google has no second match).
 * Each google_place_id is used once across the whole site (no cross-area duplicates).
 *
 * Examples:
 *   Selangor → Petaling → SS2
 *   Johor → Johor Bahru → Masai
 *   Penang → Northeast → Gurney
 *
 * Prerequisites:
 * - Run supabase/migrations/006_curated_google_spots.sql
 * - Env: GOOGLE_MAPS_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * - Enable Places API + Geocoding API in Google Cloud
 *
 * Usage:
 *   npm run seed:spots
 *   npm run seed:spots -- --state=johor
 *   npm run seed:spots -- --district=petaling
 *   npm run seed:spots -- --area=ss2
 *   npm run seed:spots -- --dry-run
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { malaysiaStates } from "../src/data/malaysia-states";
import { malaysiaAreas } from "../src/data/malaysia-areas";
import {
  buildGoogleMapsPlaceUrl,
  buildGooglePhotoFetchUrl,
  fetchGooglePlaceDetails,
  geocodeAreaCenter,
  searchGooglePlacesPage,
  type GooglePlaceCandidate,
  type GooglePlacesSearchOptions,
} from "../src/lib/google-places-server";
import { slugify } from "../src/lib/slug";
import type { WaterType } from "../src/types";

const SPOTS_PER_AREA = 2;
const SEED_USER_ID = "c0ffee00-0000-4000-8000-000000000001";
const SEED_EMAIL = "curated@jompancing.my";
const SEED_NAME = "Jompancing";

loadEnvFile();

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const stateFilter = args.find((a) => a.startsWith("--state="))?.split("=")[1];
const districtFilter = args
  .find((a) => a.startsWith("--district="))
  ?.split("=")[1];
const areaFilter = args.find((a) => a.startsWith("--area="))?.split("=")[1];

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

function buildQueries(
  areaEn: string,
  areaMs: string,
  districtEn: string,
  stateEn: string,
): string[] {
  return [
    `fishing spot ${areaEn} ${districtEn} Malaysia`,
    `kolam memancing ${areaEn} ${stateEn}`,
    `jeti memancing ${areaEn} Malaysia`,
    `tempat memancing ${areaMs || areaEn}`,
    `fishing jetty ${areaEn} ${districtEn}`,
    `kolam pancing ${areaEn}`,
    `port memancing ${areaEn}`,
    `fishing pond ${areaEn} ${stateEn}`,
  ];
}

function getLocationLabels(
  stateId: string,
  districtId: string,
): { stateEn: string; districtEn: string } | null {
  const state = malaysiaStates.find((s) => s.id === stateId);
  if (!state) return null;
  const district = state.districts.find((d) => d.id === districtId);
  if (!district) return null;
  return { stateEn: state.name.en, districtEn: district.name.en };
}

async function trimExcessCuratedSpots(
  supabase: SeedSupabase,
  stateId: string,
  districtId: string,
  areaId: string,
): Promise<string[]> {
  const { data: rows } = await supabase
    .from("spots")
    .select("id, google_place_id, featured, created_at")
    .eq("state_id", stateId)
    .eq("district_id", districtId)
    .eq("area_id", areaId)
    .eq("source", "google")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: true });

  const spots = rows ?? [];
  if (spots.length <= SPOTS_PER_AREA) return [];

  const remove = spots.slice(SPOTS_PER_AREA);
  const freedPlaceIds: string[] = [];

  for (const spot of remove) {
    const { error } = await supabase.from("spots").delete().eq("id", spot.id);
    if (error) {
      console.warn(`  trim failed (${spot.id}):`, error.message);
      continue;
    }
    console.log(`  − removed extra curated spot`);
    if (spot.google_place_id) freedPlaceIds.push(spot.google_place_id);
  }

  return freedPlaceIds;
}

async function cleanupLegacyDistrictSpots(supabase: SeedSupabase): Promise<number> {
  const { data: rows } = await supabase
    .from("spots")
    .select("id, google_place_id, area_id")
    .eq("source", "google")
    .like("area_id", "%-general");

  const legacy = (rows ?? []).filter((r: { area_id: string }) =>
    r.area_id.endsWith("-general"),
  );
  if (legacy.length === 0) return 0;

  let removed = 0;
  for (const spot of legacy) {
    const { error } = await supabase.from("spots").delete().eq("id", spot.id);
    if (!error) removed++;
  }

  console.log(`\n🧹 Removed ${removed} legacy district-level curated spots`);
  return removed;
}

async function loadGlobalUsedPlaceIds(
  supabase: SeedSupabase,
): Promise<Set<string>> {
  const used = new Set<string>();
  const { data } = await supabase
    .from("spots")
    .select("google_place_id")
    .not("google_place_id", "is", null);

  for (const row of data ?? []) {
    if (row.google_place_id) used.add(row.google_place_id);
  }
  return used;
}

async function collectCandidates(
  query: string,
  searchOptions: GooglePlacesSearchOptions,
): Promise<GooglePlaceCandidate[]> {
  const collected: GooglePlaceCandidate[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < 2; page++) {
    let pageResult;
    try {
      pageResult = await searchGooglePlacesPage(query, {
        ...searchOptions,
        pageToken,
      });
    } catch (error) {
      if (page === 0) throw error;
      break;
    }

    collected.push(...pageResult.results);
    if (!pageResult.nextPageToken) break;

    pageToken = pageResult.nextPageToken;
    await sleep(2100);
  }

  return collected;
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

async function seedArea(
  supabase: SeedSupabase,
  globalUsedPlaceIds: Set<string>,
  stateId: string,
  stateEn: string,
  districtId: string,
  districtEn: string,
  areaId: string,
  areaEn: string,
  areaMs: string,
): Promise<"ok" | "partial" | "empty" | "skipped"> {
  console.log(`\n📍 ${stateEn} → ${districtEn} → ${areaEn}`);

  if (!dryRun) {
    const freedPlaceIds = await trimExcessCuratedSpots(
      supabase,
      stateId,
      districtId,
      areaId,
    );
    for (const placeId of freedPlaceIds) {
      globalUsedPlaceIds.delete(placeId);
    }
  }

  const { data: existingRows } = await supabase
    .from("spots")
    .select("google_place_id")
    .eq("state_id", stateId)
    .eq("district_id", districtId)
    .eq("area_id", areaId)
    .eq("source", "google");

  const areaPlaceIds = new Set(
    (existingRows ?? [])
      .map((r: { google_place_id: string | null }) => r.google_place_id)
      .filter(Boolean) as string[],
  );

  const existingCount = areaPlaceIds.size;
  const needed = SPOTS_PER_AREA - existingCount;

  if (needed <= 0) {
    console.log(`  ✓ already has ${existingCount} curated spots`);
    return "skipped";
  }

  const center = await geocodeAreaCenter(areaEn, districtEn, stateEn);
  await sleep(200);
  const searchOptions: GooglePlacesSearchOptions = center
    ? { lat: center.lat, lng: center.lng, radiusM: 12_000 }
    : {};

  let inserted = 0;
  const queries = buildQueries(areaEn, areaMs, districtEn, stateEn);

  for (const query of queries) {
    if (inserted >= needed) break;

    let results: GooglePlaceCandidate[];
    try {
      results = await collectCandidates(query, searchOptions);
    } catch (error) {
      console.warn(`  search failed (${query}):`, error);
      await sleep(300);
      continue;
    }

    for (const candidate of results) {
      if (inserted >= needed) break;
      if (areaPlaceIds.has(candidate.placeId)) continue;
      if (globalUsedPlaceIds.has(candidate.placeId)) continue;
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
        areaPlaceIds.add(details.placeId);
        globalUsedPlaceIds.add(details.placeId);
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
          area_id: areaId,
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
        if (insertError.message.includes("google_place_id")) {
          globalUsedPlaceIds.add(details.placeId);
        }
        console.warn("  insert failed:", insertError.message);
        continue;
      }

      areaPlaceIds.add(details.placeId);
      globalUsedPlaceIds.add(details.placeId);
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

  const totalNow = existingCount + inserted;
  if (totalNow === 0) {
    console.warn(`  ⚠ no spots found for this area`);
    return "empty";
  }
  if (totalNow === 1) {
    console.log(`  ~ only 1 spot found (acceptable)`);
    return "partial";
  }
  return "ok";
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
    await cleanupLegacyDistrictSpots(supabase);
  }

  let globalUsedPlaceIds = await loadGlobalUsedPlaceIds(supabase);
  let areaCount = 0;
  const emptyAreas: string[] = [];
  const partialAreas: string[] = [];

  for (const area of malaysiaAreas) {
    if (stateFilter && area.stateId !== stateFilter) continue;
    if (areaFilter && area.id !== areaFilter) continue;
    if (districtFilter && area.districtId !== districtFilter) continue;

    const labels = getLocationLabels(area.stateId, area.districtId);
    if (!labels) {
      console.warn(`\n⚠ skipping ${area.id}: unknown state/district`);
      continue;
    }

    areaCount++;
    const result = await seedArea(
      supabase,
      globalUsedPlaceIds,
      area.stateId,
      labels.stateEn,
      area.districtId,
      labels.districtEn,
      area.id,
      area.name.en,
      area.name.ms,
    );

    if (result === "empty") {
      emptyAreas.push(`${labels.stateEn} → ${labels.districtEn} → ${area.name.en}`);
    } else if (result === "partial") {
      partialAreas.push(`${labels.stateEn} → ${labels.districtEn} → ${area.name.en}`);
    }
  }

  console.log(
    `\n✅ Done${dryRun ? " (dry run)" : ""} — processed ${areaCount} areas`,
  );
  if (partialAreas.length > 0) {
    console.log(
      `\n~ ${partialAreas.length} areas with only 1 spot (ok):\n  ${partialAreas.join("\n  ")}`,
    );
  }
  if (emptyAreas.length > 0) {
    console.warn(
      `\n⚠ ${emptyAreas.length} areas with no spots:\n  ${emptyAreas.join("\n  ")}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
