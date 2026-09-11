import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";

/** Cookie-less client for static routes (sitemap) and public SSR reads. */
export function createPublicSupabaseClient() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
