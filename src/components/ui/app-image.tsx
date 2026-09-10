"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ImagePlaceholder,
  ImageSkeleton,
  type PlaceholderVariant,
} from "@/components/ui/image-placeholder";
import { isWikimediaImageUrl } from "@/data/wikimedia-photos";
import { cn } from "@/lib/utils";

type ImageStatus = "loading" | "loaded" | "error";

interface AppImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  placeholderVariant?: PlaceholderVariant;
  placeholderLabel?: string;
}

function getInitialStatus(src?: string | null): ImageStatus {
  return src?.trim() ? "loading" : "error";
}

export function AppImage({
  src,
  alt,
  fill = true,
  width,
  height,
  className,
  imageClassName,
  sizes,
  priority = false,
  placeholderVariant = "spot",
  placeholderLabel,
}: AppImageProps) {
  const [status, setStatus] = useState<ImageStatus>(() => getInitialStatus(src));

  useEffect(() => {
    setStatus(getInitialStatus(src));
  }, [src]);

  const hasValidSrc = Boolean(src?.trim());
  const unoptimized = isWikimediaImageUrl(src);
  const showPlaceholder = !hasValidSrc || status === "error";
  const showSkeleton = hasValidSrc && status === "loading";

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {showPlaceholder && (
        <ImagePlaceholder
          variant={placeholderVariant}
          label={placeholderLabel}
          className="absolute inset-0"
        />
      )}

      {showSkeleton && <ImageSkeleton />}

      {hasValidSrc && status !== "error" && (
        <Image
          src={src!}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          sizes={sizes}
          priority={priority}
          unoptimized={unoptimized}
          className={cn(
            "object-cover transition-opacity duration-500",
            status === "loaded" ? "opacity-100" : "opacity-0",
            imageClassName,
          )}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}
    </div>
  );
}
