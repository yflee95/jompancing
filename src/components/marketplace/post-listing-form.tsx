"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Camera, ImagePlus, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LocationSelectors } from "@/components/spots/location-selectors";
import { useAuth } from "@/components/providers/auth-provider";
import { useMarketplace } from "@/components/providers/marketplace-provider";
import { getGeneralAreaId } from "@/data/malaysia-areas";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { ListingCondition } from "@/types";
import type { Locale } from "@/i18n/routing";

export function PostListingForm() {
  const t = useTranslations("marketplace");
  const tSpots = useTranslations("spots");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { user, isRegisteredUser } = useAuth();
  const { addListing } = useMarketplace();

  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<ListingCondition>("used");
  const [whatsapp, setWhatsapp] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [areaName, setAreaName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isRegisteredUser || !user) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/30">
        <p className="text-sm text-[var(--ink-muted)]">{t("loginToPost")}</p>
        <Button className="mt-4" onClick={() => router.push("/login")}>
          {tCommon("login")}
        </Button>
      </div>
    );
  }

  function handlePhotoPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const priceNum = Number(price);
    if (!title.trim() || !description.trim() || !priceNum || priceNum <= 0) {
      setError(t("formIncomplete"));
      return;
    }
    if (!stateId || !districtId || !areaId) {
      setError(tSpots("locationRequired"));
      return;
    }
    const wa = whatsapp.replace(/\D/g, "");
    if (wa.length < 9) {
      setError(t("whatsappRequired"));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const listing = await addListing({
        title: title.trim(),
        description: description.trim(),
        price: priceNum,
        condition,
        stateId,
        districtId,
        whatsapp: wa,
        photo: photo ?? undefined,
        authorId: user!.id,
        authorName: user!.name,
        locale,
      });
      router.push(`/marketplace/${listing.slug}`);
    } catch {
      setError(t("postFailed"));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-3xl bg-white p-5 shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/30">
        <h2 className="font-serif-display text-lg font-bold text-[var(--ink)]">
          {t("postFormTitle")}
        </h2>
        <p className="mt-1 text-xs text-[var(--ink-muted)]">{t("postFormHint")}</p>

        <div className="mt-4">
          {photo ? (
            <div className="relative aspect-square max-w-xs overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <label className="flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-2xl bg-[var(--sand)] p-4 ring-1 ring-[var(--sand-dark)]/40">
                <Camera className="h-6 w-6 text-[var(--ocean)]" />
                <span className="text-xs font-medium text-[var(--ink-muted)]">
                  {t("takePhoto")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoPick}
                />
              </label>
              <label className="flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-2xl bg-[var(--sand)] p-4 ring-1 ring-[var(--sand-dark)]/40">
                <ImagePlus className="h-6 w-6 text-[var(--ocean)]" />
                <span className="text-xs font-medium text-[var(--ink-muted)]">
                  {t("choosePhoto")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoPick}
                />
              </label>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">{t("fieldTitle")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("fieldTitlePlaceholder")}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">{t("fieldDescription")}</Label>
            <Textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("fieldDescriptionPlaceholder")}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">{t("fieldPrice")}</Label>
              <Input
                id="price"
                type="number"
                min="1"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="450"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="condition">{t("condition")}</Label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as ListingCondition)}
                className="h-11 w-full rounded-2xl border-0 bg-[var(--sand)] px-4 text-sm ring-1 ring-[var(--sand-dark)]/60 outline-none focus:ring-2 focus:ring-[var(--ocean)]/30"
              >
                <option value="new">{t("conditionNew")}</option>
                <option value="used">{t("conditionUsed")}</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">{t("fieldWhatsApp")}</Label>
            <Input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="60123456789"
              required
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
        </div>
      </div>

      <p className="text-xs text-[var(--ink-muted)]">{t("codDisclaimer")}</p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={submitting}
      >
        {submitting ? tCommon("submitting") : t("postListing")}
      </Button>
    </form>
  );
}
