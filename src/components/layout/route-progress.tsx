"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";

export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = window.setTimeout(() => setActive(false), 450);
    return () => window.clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <div
      className={`route-progress${active ? " is-active" : ""}`}
      aria-hidden
    />
  );
}
