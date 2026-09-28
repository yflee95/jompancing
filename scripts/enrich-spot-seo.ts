/**
 * Upgrade thin / generic spot descriptions for SEO (GSC long-tail).
 *
 * Prerequisites: migration 008_spots_updated_at.sql (optional but recommended)
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npm run enrich:spot-seo
 *   npm run enrich:spot-seo -- --dry-run
 *   npm run enrich:spot-seo -- --slug=jeti-bagan-ajam-xxxx
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  findEnrichmentForSpot,
  isThinOrGenericDescription,
} from "../src/data/spot-seo-enrichments";

loadEnvFile();

const dryRun = process.argv.includes("--dry-run");
const slugFilter = process.argv
  .find((a) => a.startsWith("--slug="))
  ?.split("=")[1]
  ?.trim();

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
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

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let query = supabase
    .from("spots")
    .select(
      "id, slug, title_ms, title_en, description_ms, description_en, description_zh, google_address, tags, species, visibility",
    )
    .eq("visibility", "public");

  if (slugFilter) {
    query = query.eq("slug", slugFilter);
  }

  const { data: spots, error } = await query;
  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;

  for (const spot of spots ?? []) {
    if (!isThinOrGenericDescription(spot.description_ms ?? "")) {
      skipped++;
      continue;
    }

    const enrichment = findEnrichmentForSpot({
      slug: spot.slug,
      title_ms: spot.title_ms,
      title_en: spot.title_en,
      google_address: spot.google_address,
    });

    if (!enrichment) {
      skipped++;
      continue;
    }

    const tags = new Set(spot.tags ?? []);
    for (const tag of enrichment.extraTags ?? []) tags.add(tag);

    const species =
      (spot.species?.length ?? 0) > 0
        ? spot.species
        : (enrichment.species ?? []);

    console.log(`${dryRun ? "[dry-run] " : ""}↑ ${spot.slug}`);

    if (dryRun) {
      updated++;
      continue;
    }

    const { error: updateError } = await supabase
      .from("spots")
      .update({
        description_ms: enrichment.description_ms,
        description_en: enrichment.description_en,
        description_zh: enrichment.description_zh,
        tags: [...tags],
        species,
      })
      .eq("id", spot.id);

    if (updateError) {
      console.warn(`  failed: ${updateError.message}`);
      continue;
    }
    updated++;
  }

  console.log(
    `Done. ${updated} updated, ${skipped} skipped (already rich or no rule).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
