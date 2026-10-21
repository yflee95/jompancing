import { NextResponse } from "next/server";
import { getSessionAdminEmail } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceSupabaseClient } from "@/lib/supabase/service";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const LEAD_STATUSES = new Set(["contacted", "converted", "closed"]);

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  if (!(await getSessionAdminEmail())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("pond_claim_requests")
      .select("id, spot_id, claimant_name, business_name, business_location, relationship, contact, website, message, lead_status, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;

    const claims = (data ?? []) as Array<{
      id: string;
      spot_id: string | null;
      claimant_name: string;
      business_name: string;
      business_location: string;
      relationship: string;
      contact: string;
      website: string;
      message: string;
      lead_status: "new" | "contacted" | "converted" | "closed";
      created_at: string;
    }>;
    const spotIds = [...new Set(claims.map((claim) => claim.spot_id).filter((id): id is string => Boolean(id)))];
    const spotsResult = spotIds.length
      ? await supabase
          .from("spots")
          .select("id, slug, title_ms, title_en, title_zh, verified_opening_hours, verified_fees, verified_rules, owner_verified_at")
          .in("id", spotIds)
      : { data: [], error: null };
    if (spotsResult.error) throw spotsResult.error;

    const spots = (spotsResult.data ?? []) as Array<{
      id: string;
      slug: string;
      title_ms: string;
      title_en: string;
      title_zh: string;
      verified_opening_hours: string | null;
      verified_fees: string | null;
      verified_rules: string | null;
      owner_verified_at: string | null;
    }>;
    const spotById = new Map(spots.map((spot) => [spot.id, spot]));
    return NextResponse.json({
      claims: claims.map((claim) => ({
        id: claim.id,
        claimantName: claim.claimant_name,
        businessName: claim.business_name,
        businessLocation: claim.business_location,
        relationship: claim.relationship,
        contact: claim.contact,
        website: claim.website,
        message: claim.message,
        status: claim.lead_status,
        createdAt: claim.created_at,
        spot: claim.spot_id ? spotById.get(claim.spot_id) ?? null : null,
      })),
    });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  if (!(await getSessionAdminEmail())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const body = parsedBody as { id?: unknown; status?: unknown };

  if (
    typeof body.id !== "string" ||
    !UUID_PATTERN.test(body.id) ||
    typeof body.status !== "string" ||
    !LEAD_STATUSES.has(body.status)
  ) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  try {
    const supabase = createServiceSupabaseClient();
    const { error } = await supabase
      .from("pond_claim_requests")
      .update({ lead_status: body.status, updated_at: new Date().toISOString() })
      .eq("id", body.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }
}
