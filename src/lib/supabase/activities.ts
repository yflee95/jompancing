import { slugify } from "@/lib/slug";
import { computeFreePromotionEnd } from "@/lib/promotion";
import { createClient } from "@/lib/supabase/client";
import type {
  Activity,
  ActivityType,
  LocalizedString,
  NewActivityInput,
} from "@/types";

type ActivityRow = {
  id: string;
  slug: string;
  author_id: string;
  title_ms: string;
  title_en: string;
  title_zh: string;
  description_ms: string;
  description_en: string;
  description_zh: string;
  type: string;
  state_id: string;
  district_id: string;
  venue_ms: string;
  venue_en: string;
  venue_zh: string;
  organizer: string;
  verified: boolean;
  fee: number | null;
  start_date: string;
  end_date: string;
  image_url: string;
  promoted: boolean;
  promoted_until: string | null;
  promotion_free_trial_used: boolean;
  view_count: number;
  interest_count: number;
  contact_whatsapp: string | null;
  profiles: { name: string } | null;
};

const ACTIVITY_SELECT = `*, profiles ( name )`;

function toLocalized(
  row: ActivityRow,
  field: "title" | "description" | "venue",
): LocalizedString {
  return {
    ms: row[`${field}_ms`],
    en: row[`${field}_en`],
    zh: row[`${field}_zh`],
  };
}

export function mapActivityRow(row: ActivityRow): Activity {
  return {
    id: row.id,
    slug: row.slug,
    title: toLocalized(row, "title"),
    description: toLocalized(row, "description"),
    type: row.type as ActivityType,
    stateId: row.state_id,
    districtId: row.district_id,
    venue: toLocalized(row, "venue"),
    organizer: row.organizer,
    verified: row.verified,
    fee: row.fee ?? undefined,
    startDate: row.start_date,
    endDate: row.end_date,
    imageUrl: row.image_url,
    promoted: row.promoted,
    promotedUntil: row.promoted_until ?? undefined,
    promotionFreeTrialUsed: row.promotion_free_trial_used,
    authorId: row.author_id,
    viewCount: row.view_count,
    interestCount: row.interest_count,
    contactWhatsApp: row.contact_whatsapp ?? undefined,
  };
}

export async function fetchActivitiesFromDb(): Promise<Activity[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("activities")
    .select(ACTIVITY_SELECT)
    .order("start_date", { ascending: true });

  if (error) throw error;
  return ((data ?? []) as ActivityRow[]).map(mapActivityRow);
}

export async function insertActivityToDb(
  input: NewActivityInput,
): Promise<Activity> {
  const supabase = createClient();
  const baseSlug = slugify(input.title) || "activity";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const promotedUntil = computeFreePromotionEnd();

  const { data, error } = await supabase
    .from("activities")
    .insert({
      slug,
      author_id: input.authorId,
      title_ms: input.title,
      title_en: input.title,
      title_zh: input.title,
      description_ms: input.description,
      description_en: input.description,
      description_zh: input.description,
      type: input.type,
      state_id: input.stateId,
      district_id: input.districtId,
      venue_ms: input.venue,
      venue_en: input.venue,
      venue_zh: input.venue,
      organizer: input.organizer,
      fee: input.fee ?? null,
      start_date: input.startDate,
      end_date: input.endDate,
      image_url: input.imageUrl ?? "",
      promoted: true,
      promoted_until: promotedUntil,
      promotion_free_trial_used: true,
      contact_whatsapp: input.contactWhatsApp ?? null,
    })
    .select(ACTIVITY_SELECT)
    .single();

  if (error || !data) throw error ?? new Error("Failed to create activity");
  return mapActivityRow(data as ActivityRow);
}
