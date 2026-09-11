export type AuthErrorKey =
  | "emailAlreadyRegistered"
  | "invalidCredentials"
  | "weakPassword"
  | "oauthFailed"
  | "generic";

export function resolveAuthError(
  message?: string | null,
  options?: { duplicateEmail?: boolean },
): AuthErrorKey {
  if (options?.duplicateEmail) return "emailAlreadyRegistered";

  const m = (message ?? "").toLowerCase();

  if (
    m.includes("already registered") ||
    m.includes("already been registered") ||
    m.includes("user already exists")
  ) {
    return "emailAlreadyRegistered";
  }

  if (
    m.includes("invalid login credentials") ||
    m.includes("invalid email or password")
  ) {
    return "invalidCredentials";
  }

  if (m.includes("password") && m.includes("least")) {
    return "weakPassword";
  }

  return "generic";
}
