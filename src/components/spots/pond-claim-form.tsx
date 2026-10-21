"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BadgeCheck, Building2, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

interface PondClaimFormProps {
  spotId?: string;
  defaultLocation?: string;
  initiallyOpen?: boolean;
}

export function PondClaimForm({
  spotId,
  defaultLocation = "",
  initiallyOpen = false,
}: PondClaimFormProps) {
  const t = useTranslations("spots");
  const [open, setOpen] = useState(initiallyOpen);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!spotId) return;

    const openForClaimLink = () => {
      if (window.location.hash === "#pond-claim") setOpen(true);
    };

    openForClaimLink();
    window.addEventListener("hashchange", openForClaimLink);
    return () => window.removeEventListener("hashchange", openForClaimLink);
  }, [spotId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setError(false);
    try {
      const response = await fetch("/api/pond-claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotId: spotId ?? null,
          claimantName: formData.get("claimantName"),
          businessName: formData.get("businessName"),
          businessLocation: formData.get("businessLocation"),
          relationship: formData.get("relationship"),
          contact: formData.get("contact"),
          website: formData.get("website"),
          message: formData.get("message"),
          companyFax: formData.get("companyFax"),
          consent: formData.get("consent") === "on",
        }),
      });
      if (!response.ok) throw new Error("Claim submission failed");
      setSubmitted(true);
      form.reset();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id={spotId ? "pond-claim" : undefined} className="mt-8 scroll-mt-24 overflow-hidden rounded-3xl bg-white ring-1 ring-[var(--sand-dark)]/40">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="pond-claim-form-fields"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 p-5 text-left"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--ocean-light)] text-[var(--ocean)]">
          <Building2 className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-[var(--ink)]">{spotId ? t("claimPondTitle") : t("pondOwnerPageTitle")}</span>
          <span className="mt-1 block text-xs text-[var(--ink-muted)]">{spotId ? t("claimPondHint") : t("pondOwnerPageHint")}</span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--ink-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        id="pond-claim-form-fields"
        hidden={!open}
        className="border-t border-[var(--sand-dark)]/30 p-5"
      >
          {submitted ? (
            <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-900">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm">{spotId ? t("claimPondSuccess") : t("pondOwnerSuccess")}</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-[var(--ink-muted)]">{t("claimPondPrivacy")}</p>
              <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="claimant-name">{t("claimantName")}</Label>
                  <Input id="claimant-name" name="claimantName" required minLength={2} maxLength={100} autoComplete="name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="business-name">{t("claimBusinessName")}</Label>
                  <Input id="business-name" name="businessName" required minLength={2} maxLength={160} autoComplete="organization" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="business-location">{t("claimLocation")}</Label>
                  <Input id="business-location" name="businessLocation" required minLength={5} maxLength={300} defaultValue={defaultLocation} placeholder={t("claimLocationHint")} autoComplete="street-address" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="claim-relationship">{t("claimRelationship")}</Label>
                  <Input id="claim-relationship" name="relationship" required maxLength={80} placeholder={t("claimRelationshipHint")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="claim-contact">{t("claimContact")}</Label>
                  <Input id="claim-contact" name="contact" required minLength={5} maxLength={160} autoComplete="tel" placeholder={t("claimContactHint")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="claim-website">{t("claimWebsite")}</Label>
                  <Input id="claim-website" name="website" type="url" maxLength={300} placeholder="https://" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="claim-message">{t("claimMessage")}</Label>
                  <Textarea id="claim-message" name="message" rows={3} maxLength={1200} />
                  <p className="text-xs leading-relaxed text-[var(--ink-muted)]">{t("claimMessageHint")}</p>
                </div>
                <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="claim-company-fax">Company fax</label>
                  <input id="claim-company-fax" name="companyFax" tabIndex={-1} autoComplete="off" />
                </div>
                <label className="flex items-start gap-2 text-xs leading-relaxed text-[var(--ink-muted)]">
                  <input name="consent" type="checkbox" required className="mt-0.5 accent-[var(--ocean)]" />
                  <span>{t("claimConsent")}</span>
                </label>
                {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{t("claimPondError")}</p>}
                <Button type="submit" disabled={submitting} className="w-full" size="lg">
                  {submitting ? t("claimSubmitting") : t("claimSubmit")}
                </Button>
              </form>
            </>
          )}
      </div>
    </section>
  );
}
