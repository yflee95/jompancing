"use client";

import { usePathname } from "@/i18n/navigation";
import { SiteFooter } from "@/components/layout/site-footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <SiteFooter />;
}
