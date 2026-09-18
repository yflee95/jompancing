"use client";

import { UserLocationProvider } from "@/components/providers/user-location-provider";
import type { Locale } from "@/i18n/routing";

export function UserLocationShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <UserLocationProvider locale={locale}>{children}</UserLocationProvider>
  );
}
