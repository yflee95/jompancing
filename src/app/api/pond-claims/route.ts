import { NextResponse } from "next/server";
import { getClientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceSupabaseClient } from "@/lib/supabase/service";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_REQUEST_BYTES = 8_000;

function clean(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const limited = rateLimit(`pond-claim:${getClientIp(request)}`, 5, 60 * 60_000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfterSec);
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader !== null) {
    const contentLength = Number(contentLengthHeader);
    if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
    if (contentLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "request_too_large" }, { status: 413 });
    }
  }
  let parsedBody: unknown;
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_REQUEST_BYTES) {
        await reader.cancel();
        return NextResponse.json({ error: "request_too_large" }, { status: 413 });
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    parsedBody = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  } finally {
    reader.releaseLock();
  }
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const body = parsedBody as Record<string, unknown>;

  // Honeypot: silently accept bots without storing the submission.
  if (clean(body.companyFax, 120)) return NextResponse.json({ ok: true });

  const spotId = clean(body.spotId, 64);
  const claimantName = clean(body.claimantName, 100);
  const businessName = clean(body.businessName, 160);
  const businessLocation = clean(body.businessLocation, 300);
  const relationship = clean(body.relationship, 80);
  const contact = clean(body.contact, 160);
  const website = clean(body.website, 300);
  const message = clean(body.message, 1200);
  const consent = body.consent === true;

  if (
    (spotId.length > 0 && !UUID_PATTERN.test(spotId)) ||
    claimantName.length < 2 ||
    businessName.length < 2 ||
    businessLocation.length < 5 ||
    relationship.length < 2 ||
    contact.length < 5 ||
    !consent
  ) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }

  try {
    const supabase = createServiceSupabaseClient();
    if (spotId) {
      const { data: spot, error: spotError } = await supabase
        .from("spots")
        .select("id")
        .eq("id", spotId)
        .eq("water_type", "pond")
        .eq("visibility", "public")
        .maybeSingle();

      if (spotError) throw spotError;
      if (!spot) return NextResponse.json({ error: "spot_not_found" }, { status: 404 });
    }

    const { error } = await supabase.from("pond_claim_requests").insert({
      spot_id: spotId || null,
      claimant_name: claimantName,
      business_name: businessName,
      business_location: businessLocation,
      relationship,
      contact,
      website,
      message,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "submit_failed" }, { status: 500 });
  }
}
