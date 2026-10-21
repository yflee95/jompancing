"use client";

import { FormEvent, useState } from "react";
import { CalendarDays, Gift, Megaphone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LocationSelectors } from "@/components/spots/location-selectors";
import { useAuth } from "@/components/providers/auth-provider";
import { useActivities } from "@/components/providers/activities-provider";
import { getGeneralAreaId } from "@/data/malaysia-areas";
import { FREE_PROMOTION_DAYS, PAID_PROMOTION_DAILY_RM } from "@/lib/promotion";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { ActivityType } from "@/types";
import type { Locale } from "@/i18n/routing";

const ACTIVITY_TYPES: ActivityType[] = [
  "contest",
  "sale",
  "workshop",
  "meetup",
];

export function PromoteActivityForm() {
  const t = useTranslations("activities");
  const tSpots = useTranslations("spots");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { user } = useAuth();
  const { addActivity } = useActivities();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ActivityType>("contest");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [areaName, setAreaName] = useState("");
  const [venue, setVenue] = useState("");
  const [organizer, setOrganizer] = useState(user?.name ?? "");
  const [fee, setFee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contactWhatsApp, setContactWhatsApp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/30">
        <p className="text-sm text-[var(--ink-muted)]">{t("loginToPromote")}</p>
        <Button className="mt-4" onClick={() => router.push("/login")}>
          {tCommon("login")}
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user) return;

    if (!stateId || !districtId || !areaId) {
      setError(tSpots("locationRequired"));
      return;
    }

    setSubmitting(true);
    try {
      const activity = await addActivity({
        title: title.trim(),
        description: description.trim(),
        type,
        stateId,
        districtId,
        venue: venue.trim() || areaName.trim() || title.trim(),
        organizer: organizer.trim() || user.name,
        fee: fee ? Number(fee) : undefined,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate || startDate).toISOString(),
        contactWhatsApp: contactWhatsApp.trim() || undefined,
        authorId: user.id,
        authorName: user.name,
        locale,
      });
      router.push(`/activities/${activity.slug}`);
    } catch {
      setError(t("submitFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  const selectClass =
    "h-11 w-full rounded-2xl border-0 bg-[var(--sand)] px-4 text-sm ring-1 ring-[var(--sand-dark)]/60 outline-none focus:ring-2 focus:ring-[var(--ocean)]/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--accent-light)] via-white to-[var(--ocean-light)] p-5 ring-1 ring-[var(--accent)]/25 md:p-6">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-md shadow-[var(--accent-glow)]">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--accent)]">
              {t("freeTrialBadge", { days: FREE_PROMOTION_DAYS })}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">
              {t("freeTrialDesc", {
                days: FREE_PROMOTION_DAYS,
                price: PAID_PROMOTION_DAILY_RM,
              })}
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-3xl bg-white p-5 shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/30">
        <h2 className="font-serif-display text-lg font-bold text-[var(--ink)]">
          {t("promoteFormTitle")}
        </h2>
        <p className="mt-1 text-xs text-[var(--ink-muted)]">{t("promoteFormHint")}</p>

        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">{t("fieldTitle")} *</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("fieldTitlePlaceholder")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="type">{t("fieldType")} *</Label>
            <select
              id="type"
              required
              value={type}
              onChange={(e) => setType(e.target.value as ActivityType)}
              className={selectClass}
            >
              {ACTIVITY_TYPES.map((id) => (
                <option key={id} value={id}>
                  {t(id)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">{t("fieldDescription")} *</Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("fieldDescriptionPlaceholder")}
            />
          </div>

          <LocationSelectors
            locale={locale}
            stateId={stateId}
            districtId={districtId}
            areaId={areaId}
            areaName={areaName}
            onStateChange={(id) => {
              setStateId(id);
              setDistrictId("");
              setAreaId("");
            }}
            onDistrictChange={(id) => {
              setDistrictId(id);
              setAreaId(id ? getGeneralAreaId(id) : "");
            }}
            onAreaChange={setAreaId}
            onAreaNameChange={setAreaName}
          />

          <div className="space-y-1.5">
            <Label htmlFor="venue">{t("venue")} *</Label>
            <Input
              id="venue"
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder={t("fieldVenuePlaceholder")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">{t("fieldStartDate")} *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">{t("fieldEndDate")}</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="organizer">{t("organizer")} *</Label>
              <Input
                id="organizer"
                required
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fee">{t("fee")} (RM)</Label>
              <Input
                id="fee"
                type="number"
                min={0}
                step={1}
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder={t("fieldFeeOptional")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">{t("fieldWhatsApp")}</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={contactWhatsApp}
              onChange={(e) => setContactWhatsApp(e.target.value)}
              placeholder="60123456789"
            />
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? (
          t("submitting")
        ) : (
          <>
            <Megaphone className="h-4 w-4" />
            {t("submitPromote", { days: FREE_PROMOTION_DAYS })}
          </>
        )}
      </Button>

      <p className="flex items-start gap-2 text-center text-xs text-[var(--ink-muted)]">
        <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {t("renewalNote", { price: PAID_PROMOTION_DAILY_RM })}
      </p>
    </form>
  );
}
