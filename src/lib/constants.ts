export const APP_NAME = "Jompancing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://jompancing.my";

export const DEMO_USER = {
  id: "demo-user-1",
  name: "Demo Angler",
  email: "demo@jompancing.my",
  homeStateId: "johor",
} as const;

export const AUTH_COOKIE = "jompancing_session";
