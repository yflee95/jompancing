export const APP_NAME = "Jompancing";

const configuredSiteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jompancing.my",
);

// The apex host permanently redirects to www. Keep canonicals, sitemap, and
// robots URLs on the final destination even if an old environment value says apex.
if (configuredSiteUrl.hostname === "jompancing.my") {
  configuredSiteUrl.hostname = "www.jompancing.my";
}

export const SITE_URL = configuredSiteUrl.origin;

export const DEMO_USER = {
  id: "demo-user-1",
  name: "Demo Angler",
  email: "demo@jompancing.my",
  homeStateId: "johor",
} as const;

export const AUTH_COOKIE = "jompancing_session";
