"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics/react";
import { ZoomIn, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppImage } from "@/components/ui/app-image";

interface CampaignFlyerProps {
  src: string;
  alt: string;
  eventSlug: string;
}

export function CampaignFlyer({ src, alt, eventSlug }: CampaignFlyerProps) {
  const t = useTranslations("home");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        window.setTimeout(() => triggerRef.current?.focus(), 0);
      } else if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen(true);
          track("Activity poster enlarged", {
            event: eventSlug,
            placement: "activity_detail",
          });
        }}
        aria-label={t("enlargeEventPoster")}
        className="group absolute inset-0 block h-full w-full bg-[#07548c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
      >
        <AppImage
          src={src}
          alt={alt}
          priority
          sizes="(max-width: 896px) 100vw, 440px"
          className="absolute inset-0"
          imageClassName="object-contain"
        />
        <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white opacity-80 transition group-hover:opacity-100">
          <ZoomIn className="h-5 w-5" />
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("enlargeEventPoster")}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={t("closeFeaturedEvent")}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-[var(--ink)]"
          >
            <X className="h-5 w-5" />
          </button>
          <Image
            src={src}
            alt={alt}
            width={1125}
            height={2000}
            className="max-h-[92dvh] w-auto max-w-full object-contain"
          />
        </div>
      )}
    </>
  );
}
