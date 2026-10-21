"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

type LeadStatus = "new" | "contacted" | "converted" | "closed";
type Claim = {
  id: string;
  claimantName: string;
  businessName: string;
  businessLocation: string;
  relationship: string;
  contact: string;
  website: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
  spot: { slug: string; title_ms: string; title_en: string; title_zh: string } | null;
};

export function PondClaimAdmin({ locale }: { locale: Locale }) {
  const t = useTranslations("spots.claimAdmin");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void fetch("/api/admin/pond-claims", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load leads");
        return (await response.json()) as { claims: Claim[] };
      })
      .then((result) => {
        if (active) setClaims(result.claims);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function updateStatus(id: string, status: LeadStatus) {
    setSavingId(id);
    setError(false);
    try {
      const response = await fetch("/api/admin/pond-claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) throw new Error("Unable to update lead");
      setClaims((current) => current.map((claim) => claim.id === id ? { ...claim, status } : claim));
    } catch {
      setError(true);
    } finally {
      setSavingId(null);
    }
  }

  function getSpotTitle(spot: Claim["spot"]) {
    if (!spot) return "Deleted pond";
    return locale === "zh" ? spot.title_zh : locale === "en" ? spot.title_en : spot.title_ms;
  }

  function getStatusLabel(status: LeadStatus) {
    if (status === "new") return t("statusNew");
    if (status === "contacted") return t("statusContacted");
    if (status === "converted") return t("statusConverted");
    return t("statusClosed");
  }

  function getContactHref(contact: string) {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      return `mailto:${contact}`;
    }
    const digits = contact.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) return null;
    const international = digits.startsWith("0")
      ? `60${digits.slice(1)}`
      : digits;
    return `https://wa.me/${international}`;
  }

  if (loading) return <p className="py-10 text-sm text-[var(--ink-muted)]">{t("loading")}</p>;
  if (error && claims.length === 0) return <p role="alert" className="py-10 text-sm text-red-700">{t("error")}</p>;
  if (claims.length === 0) return <p className="py-10 text-sm text-[var(--ink-muted)]">{t("empty")}</p>;

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{t("error")}</p>}
      {claims.map((claim) => (
        <article key={claim.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[var(--sand-dark)]/40">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--ink)]">{claim.businessName}</h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">{claim.claimantName} · {claim.relationship}</p>
              {claim.spot && <Link className="mt-2 inline-flex text-sm text-[var(--ocean)] hover:underline" href={`/spots/${claim.spot.slug}`}>{getSpotTitle(claim.spot)}</Link>}
            </div>
            <span className="rounded-full bg-[var(--sand)] px-3 py-1 text-xs font-semibold text-[var(--ink-muted)]">{getStatusLabel(claim.status)}</span>
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-[var(--ink-muted)]">{t("contact")}</dt><dd className="break-words font-medium text-[var(--ink)]"><a href={getContactHref(claim.contact) ?? undefined} target={claim.contact.includes("@") ? undefined : "_blank"} rel="noopener noreferrer" className="hover:text-[var(--ocean)] hover:underline">{claim.contact}</a></dd></div>
            <div><dt className="text-xs text-[var(--ink-muted)]">{t("location")}</dt><dd className="text-[var(--ink)]">{claim.businessLocation}</dd></div>
            <div><dt className="text-xs text-[var(--ink-muted)]">{t("submitted")}</dt><dd className="text-[var(--ink)]">{formatDate(claim.createdAt, locale)}</dd></div>
            {claim.website && <div><dt className="text-xs text-[var(--ink-muted)]">{t("website")}</dt><dd className="break-all text-[var(--ink)]">{claim.website}</dd></div>}
            {claim.message && <div><dt className="text-xs text-[var(--ink-muted)]">{t("message")}</dt><dd className="whitespace-pre-wrap text-[var(--ink)]">{claim.message}</dd></div>}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["contacted", "converted", "closed"] as const).map((status) => (
              <Button key={status} size="sm" variant={claim.status === status ? "default" : "outline"} disabled={savingId === claim.id || claim.status === status} onClick={() => void updateStatus(claim.id, status)}>
                {t(status === "contacted" ? "contacted" : status === "converted" ? "converted" : "closed")}
              </Button>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
