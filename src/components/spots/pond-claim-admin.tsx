"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/input";
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
  spot: {
    id: string;
    slug: string;
    title_ms: string;
    title_en: string;
    title_zh: string;
    verified_opening_hours: string | null;
    verified_fees: string | null;
    verified_rules: string | null;
    owner_verified_at: string | null;
  } | null;
};

type VerifiedDraft = { openingHours: string; fees: string; rules: string };

export function PondClaimAdmin({ locale }: { locale: Locale }) {
  const t = useTranslations("spots.claimAdmin");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingSpotId, setSavingSpotId] = useState<string | null>(null);
  const [verifiedDrafts, setVerifiedDrafts] = useState<Record<string, VerifiedDraft>>({});
  const [operatorConfirmedSpotIds, setOperatorConfirmedSpotIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    void fetch("/api/admin/pond-claims", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load leads");
        return (await response.json()) as { claims: Claim[] };
      })
      .then((result) => {
        if (active) {
          setClaims(result.claims);
          setVerifiedDrafts(Object.fromEntries(result.claims.flatMap((claim) => claim.spot ? [[claim.spot.id, {
            openingHours: claim.spot.verified_opening_hours ?? "",
            fees: claim.spot.verified_fees ?? "",
            rules: claim.spot.verified_rules ?? "",
          }]] : [])));
        }
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

  async function saveVerifiedDetails(spotId: string) {
    const draft = verifiedDrafts[spotId];
    if (!draft) return;
    setSavingSpotId(spotId);
    setError(false);
    try {
      const response = await fetch(`/api/admin/spots/${spotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, operatorConfirmed: operatorConfirmedSpotIds[spotId] === true }),
      });
      if (!response.ok) throw new Error("Unable to publish verified details");
      const result = await response.json() as { verifiedAt: string };
      setClaims((current) => current.map((claim) => claim.spot?.id === spotId
        ? { ...claim, spot: { ...claim.spot, verified_opening_hours: draft.openingHours.trim(), verified_fees: draft.fees.trim(), verified_rules: draft.rules.trim(), owner_verified_at: result.verifiedAt } }
        : claim));
      setOperatorConfirmedSpotIds((current) => ({ ...current, [spotId]: false }));
    } catch {
      setError(true);
    } finally {
      setSavingSpotId(null);
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
          {claim.spot && (
            <section className="mt-5 space-y-3 rounded-2xl border border-[var(--sand-dark)]/50 bg-[var(--sand)]/30 p-4">
              <div>
                <h3 className="text-sm font-semibold text-[var(--ink)]">{t("verifiedDetailsTitle")}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">{t("verifiedDetailsHint")}</p>
                {claim.spot.owner_verified_at && <p className="mt-1 text-xs font-medium text-emerald-800">{t("verifiedDetailsSaved", { date: formatDate(claim.spot.owner_verified_at, locale) })}</p>}
              </div>
              {([
                ["openingHours", t("verifiedOpeningHours")],
                ["fees", t("verifiedFees")],
                ["rules", t("verifiedRules")],
              ] as const).map(([field, label]) => (
                <div key={field} className="space-y-1.5">
                  <Label htmlFor={`verified-${field}-${claim.spot!.id}`}>{label}</Label>
                  <Textarea
                    id={`verified-${field}-${claim.spot!.id}`}
                    rows={2}
                    maxLength={500}
                    value={verifiedDrafts[claim.spot!.id]?.[field] ?? ""}
                    onChange={(event) => setVerifiedDrafts((current) => ({
                      ...current,
                      [claim.spot!.id]: { ...(current[claim.spot!.id] ?? { openingHours: "", fees: "", rules: "" }), [field]: event.target.value },
                    }))}
                  />
                </div>
              ))}
              <label className="flex items-start gap-2 text-xs leading-relaxed text-[var(--ink-muted)]">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[var(--ocean)]"
                  checked={operatorConfirmedSpotIds[claim.spot.id] === true}
                  onChange={(event) => setOperatorConfirmedSpotIds((current) => ({ ...current, [claim.spot!.id]: event.target.checked }))}
                />
                <span>{t("operatorConfirmation")}</span>
              </label>
              <Button size="sm" disabled={savingSpotId === claim.spot.id || operatorConfirmedSpotIds[claim.spot.id] !== true} onClick={() => void saveVerifiedDetails(claim.spot!.id)}>
                {savingSpotId === claim.spot.id ? t("verifiedDetailsSaving") : t("verifiedDetailsPublish")}
              </Button>
            </section>
          )}
        </article>
      ))}
    </div>
  );
}
