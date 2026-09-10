import { Fish, MapPin, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

export type PlaceholderVariant = "spot" | "hero" | "tile" | "square" | "wide";

interface ImagePlaceholderProps {
  variant?: PlaceholderVariant;
  className?: string;
  label?: string;
}

const variantIcons = {
  spot: MapPin,
  hero: Waves,
  tile: Fish,
  square: Fish,
  wide: Waves,
} as const;

export function ImagePlaceholder({
  variant = "spot",
  className,
  label,
}: ImagePlaceholderProps) {
  const Icon = variantIcons[variant];

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden",
        className,
      )}
      role="img"
      aria-label={label ?? "Image placeholder"}
    >
      {/* Layered travel gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--ocean-light)] via-[var(--sand)] to-[var(--sand-dark)]" />

      {/* Decorative waves */}
      <svg
        className="absolute inset-x-0 bottom-0 text-[var(--ocean)]/10"
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,40 C80,70 120,10 200,40 C280,70 320,20 400,45 L400,80 L0,80 Z"
        />
        <path
          fill="currentColor"
          opacity="0.6"
          d="M0,55 C100,80 150,35 250,58 C320,75 360,45 400,60 L400,80 L0,80 Z"
        />
      </svg>

      {/* Soft glow */}
      <div className="absolute left-1/2 top-1/3 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--ocean)]/10 blur-2xl" />

      {/* Icon + label */}
      <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 shadow-sm ring-1 ring-[var(--sand-dark)]/40 backdrop-blur-sm">
          <Icon className="h-5 w-5 text-[var(--ocean)]" strokeWidth={1.75} />
        </div>
        {label && (
          <p className="max-w-[80%] text-[11px] font-medium leading-tight text-[var(--ink-muted)]">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}

export function ImageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("skeleton-shimmer absolute inset-0", className)}
      aria-hidden
    />
  );
}
