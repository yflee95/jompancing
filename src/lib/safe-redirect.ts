import { locales } from "@/i18n/routing";

const LOCALE_PATTERN = locales.join("|");

/** Only allow same-origin locale paths — blocks open redirects. */
export function sanitizeAuthRedirect(next: string | null | undefined): string {
  const fallback = "/ms/profile";
  if (!next || typeof next !== "string") return fallback;

  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (/^\/https?:\/\//i.test(trimmed)) return fallback;

  const match = trimmed.match(
    new RegExp(`^\\/(${LOCALE_PATTERN})(\\/|$)`, "i"),
  );
  if (!match) return fallback;

  return trimmed;
}
