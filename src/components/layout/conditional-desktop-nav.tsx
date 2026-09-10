"use client";

import { usePathname } from "@/i18n/navigation";
import { DesktopNav } from "@/components/layout/bottom-nav";

export function ConditionalDesktopNav() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <DesktopNav />;
}
