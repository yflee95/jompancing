"use client";

import { track } from "@vercel/analytics/react";
import type { ReactNode } from "react";

interface TrackedRegistrationLinkProps {
  href: string;
  eventSlug: string;
  placement: "home_popup" | "activity_detail";
  className: string;
  children: ReactNode;
}

export function TrackedRegistrationLink({
  href,
  eventSlug,
  placement,
  className,
  children,
}: TrackedRegistrationLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        track("Activity registration click", { event: eventSlug, placement })
      }
    >
      {children}
    </a>
  );
}
