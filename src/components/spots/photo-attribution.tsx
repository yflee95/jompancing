import { ExternalLink } from "lucide-react";
import type { FishingSpot } from "@/types";

interface PhotoAttributionProps {
  spot: FishingSpot;
  label: string;
}

export function PhotoAttribution({ spot, label }: PhotoAttributionProps) {
  const attr = spot.photoAttribution;
  if (!attr) return null;

  return (
    <p className="mt-2 text-[11px] leading-relaxed text-[var(--ink-muted)]">
      {label}:{" "}
      <a
        href={attr.filePage}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 text-[var(--ocean)] underline-offset-2 hover:underline"
      >
        {attr.artist}
        <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
      </a>
      {" · "}
      {attr.license}
      {" · "}
      <a
        href="https://commons.wikimedia.org"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--ocean)] underline-offset-2 hover:underline"
      >
        Wikimedia Commons
      </a>
    </p>
  );
}
