"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

interface ShareActionsProps {
  /** Path after locale, e.g. `/spots/my-jetty` */
  path: string;
  title: string;
  className?: string;
  compact?: boolean;
}

function buildShareUrl(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : SITE_URL.replace(/\/$/, "");
  return `${origin}/${locale}${normalized}`;
}

function isShareCancelled(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function ShareActions({
  path,
  title,
  className,
  compact,
}: ShareActionsProps) {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => buildShareUrl(path, locale), [path, locale]);
  const shareText = `${title} — Jompancing`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareText, text: shareText, url });
        return;
      } catch (error) {
        if (isShareCancelled(error)) return;
      }
    }
    void handleCopy();
  }

  function openWhatsApp() {
    const text = encodeURIComponent(`${shareText}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        className="rounded-full"
        onClick={() => void handleNativeShare()}
      >
        <Share2 className="h-4 w-4" />
        {t("share")}
      </Button>
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        className="rounded-full"
        onClick={openWhatsApp}
      >
        {t("shareWhatsApp")}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size={compact ? "sm" : "default"}
        className="rounded-full"
        onClick={() => void handleCopy()}
      >
        {copied ? (
          <Check className="h-4 w-4 text-[var(--ocean)]" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {copied ? t("linkCopied") : t("copyLink")}
      </Button>
    </div>
  );
}
