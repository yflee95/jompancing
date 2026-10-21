import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSessionAdminEmail } from "@/lib/admin";
import { locales } from "@/i18n/routing";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServiceSupabaseClient } from "@/lib/supabase/service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const MAX_DETAIL_LENGTH = 500;

export async function PATCH(request: Request, context: RouteContext) {
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

  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "invalid_spot_id" }, { status: 400 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const details = body as Record<string, unknown>;
  const fields = ["openingHours", "fees", "rules"] as const;
  if (details.operatorConfirmed !== true) {
    return NextResponse.json({ error: "operator_confirmation_required" }, { status: 400 });
  }
  if (fields.some((field) => typeof details[field] !== "string" || (details[field] as string).length > MAX_DETAIL_LENGTH)) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 400 });
  }
  if (fields.every((field) => !(details[field] as string).trim())) {
    return NextResponse.json({ error: "empty_details" }, { status: 400 });
  }

  try {
    const supabase = createServiceSupabaseClient();
    const verifiedAt = new Date().toISOString();
    const { error } = await supabase
      .from("spots")
      .update({
        verified_opening_hours: (details.openingHours as string).trim(),
        verified_fees: (details.fees as string).trim(),
        verified_rules: (details.rules as string).trim(),
        owner_verified_at: verifiedAt,
      })
      .eq("id", id);
    if (error) throw error;

    const { data: spot, error: readError } = await supabase
      .from("spots")
      .select("slug")
      .eq("id", id)
      .single();
    if (readError) throw readError;
    for (const locale of locales) {
      revalidatePath(`/${locale}/spots/${spot.slug}`);
    }
    return NextResponse.json({ ok: true, verifiedAt });
  } catch {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const adminEmail = await getSessionAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing spot id" }, { status: 400 });
  }

  try {
    const supabase = createServiceSupabaseClient();
    const { error } = await supabase.from("spots").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    for (const locale of locales) {
      revalidatePath(`/${locale}`);
      revalidatePath(`/${locale}/spots`);
      revalidatePath(`/${locale}/map`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete spot";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
