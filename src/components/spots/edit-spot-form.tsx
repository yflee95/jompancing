"use client";

import { ChangeEvent, FormEvent, KeyboardEvent, useState } from "react";
import { Camera, ImagePlus, Lock, Unlock, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { AddressAutocomplete } from "@/components/spots/address-autocomplete";
import { LocationSelectors } from "@/components/spots/location-selectors";
import { useAuth } from "@/components/providers/auth-provider";
import { useUserSpots } from "@/components/providers/spots-provider";
import { getGeneralAreaId } from "@/data/malaysia-areas";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { isValidGoogleMapsUrl, parseGoogleMapsUrl } from "@/lib/google-maps";
import { cn } from "@/lib/utils";
import { getLocalizedText, type FishingSpot, type SpotVisibility, type WaterType } from "@/types";
import type { Locale } from "@/i18n/routing";

const WATER_TYPES: WaterType[] = ["saltwater", "freshwater", "pond", "river"];
const MAX_PHOTOS = 5;

interface EditSpotFormProps {
  spot: FishingSpot;
}

export function EditSpotForm({ spot }: EditSpotFormProps) {
  const t = useTranslations("spots");
  const tPost = useTranslations("post");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { user } = useAuth();
  const { updateSpot } = useUserSpots();

  const [photos, setPhotos] = useState<string[]>(
    spot.photos.length > 0 ? spot.photos : spot.imageUrl ? [spot.imageUrl] : [],
  );
  const [title, setTitle] = useState(getLocalizedText(spot.title, locale));
  const [description, setDescription] = useState(getLocalizedText(spot.description, locale));
  const [googleAddress, setGoogleAddress] = useState(spot.googleAddress);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(spot.googleMapsUrl);
  const [waterType, setWaterType] = useState<WaterType>(spot.waterType);
  const [tags, setTags] = useState<string[]>(spot.tags);
  const [tagDraft, setTagDraft] = useState("");
  const [visibility, setVisibility] = useState<SpotVisibility>(spot.visibility);
  const [stateId, setStateId] = useState(spot.stateId);
  const [districtId, setDistrictId] = useState(spot.districtId);
  const [areaId, setAreaId] = useState(spot.areaId);
  const [areaName, setAreaName] = useState(spot.areaName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function addTag(raw: string) {
    const next = raw.trim();
    if (!next || tags.includes(next) || tags.length >= 8) return;
    setTags((prev) => [...prev, next]);
    setTagDraft("");
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagDraft);
    }
  }

  function handlePhotos(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setPhotos((prev) =>
              [...prev, reader.result as string].slice(0, MAX_PHOTOS),
            );
          }
        };
        reader.readAsDataURL(file);
      });
    e.target.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || submitting) return;

    if (photos.length === 0) {
      setError(tPost("photoRequired"));
      return;
    }
    if (!title.trim()) {
      setError(tPost("titleRequired"));
      return;
    }
    if (!googleAddress.trim()) {
      setError(tPost("googleAddressRequired"));
      return;
    }
    if (!googleMapsUrl.trim() || !isValidGoogleMapsUrl(googleMapsUrl)) {
      setError(tPost("googleMapsUrlInvalid"));
      return;
    }
    if (!stateId || !districtId || !areaId) {
      setError(t("locationRequired"));
      return;
    }

    const coords = parseGoogleMapsUrl(googleMapsUrl) ?? spot.coordinates;

    setSubmitting(true);
    setError(null);

    try {
      const updated = await updateSpot({
        spotId: spot.id,
        authorId: user.id,
        locale,
        title: title.trim(),
        description: description.trim(),
        googleAddress: googleAddress.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
        coordinates: coords,
        waterType,
        tags,
        photos,
        visibility: user.isAnonymous ? "public" : visibility,
        stateId,
        districtId,
        areaId,
        areaName:
          areaId === getGeneralAreaId(districtId) ? areaName.trim() : undefined,
      });
      router.push(`/spots/${updated.slug}`);
    } catch {
      setError(t("updateSpotFailed"));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div className="rounded-3xl bg-white p-5 shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/30">
        <h1 className="font-serif-display text-xl font-bold text-[var(--ink)]">
          {t("editSpotTitle")}
        </h1>
        <p className="mt-1 text-xs text-[var(--ink-muted)]">{t("editSpotHint")}</p>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {photos.map((src, i) => (
            <div
              key={`${src.slice(0, 24)}-${i}`}
              className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute right-1.5 top-1.5 rounded-full bg-black/55 p-1 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <>
              <label className="flex h-28 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[var(--ocean)]/35 bg-[var(--ocean-light)]/30 text-[var(--ocean)]">
                <Camera className="h-6 w-6" />
                <span className="text-[10px] font-semibold">{tPost("takePhoto")}</span>
                <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={handlePhotos} />
              </label>
              <label className="flex h-28 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[var(--ocean)]/35 bg-[var(--ocean-light)]/30 text-[var(--ocean)]">
                <ImagePlus className="h-6 w-6" />
                <span className="text-[10px] font-semibold">{tPost("chooseFromGallery")}</span>
                <input type="file" accept="image/*" multiple className="sr-only" onChange={handlePhotos} />
              </label>
            </>
          )}
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">{tPost("title")}</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">{tPost("description")}</Label>
            <Textarea id="desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {WATER_TYPES.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setWaterType(id)}
                className={cn(
                  "rounded-2xl px-2 py-2.5 text-xs font-semibold transition",
                  waterType === id
                    ? "bg-[var(--ocean)] text-white"
                    : "bg-[var(--sand)] text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/50",
                )}
              >
                {t(id)}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">{tPost("tags")}</Label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[var(--ocean-light)] px-2.5 py-1 text-xs font-medium text-[var(--ocean-dark)]">
                  {tag}
                  <button type="button" onClick={() => setTags((prev) => prev.filter((x) => x !== tag))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <Input id="tags" value={tagDraft} onChange={(e) => setTagDraft(e.target.value)} onKeyDown={handleTagKeyDown} placeholder={tPost("tagsPlaceholder")} />
          </div>
          {!user?.isAnonymous && (
            <div className="flex gap-2">
              {(["public", "private"] as SpotVisibility[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-semibold transition",
                    visibility === v
                      ? "bg-[var(--ocean)] text-white"
                      : "bg-[var(--sand)] text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/50",
                  )}
                >
                  {v === "public" ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {t(v)}
                </button>
              ))}
            </div>
          )}
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
          <AddressAutocomplete
            locale={locale}
            stateId={stateId}
            districtId={districtId}
            value={googleAddress}
            mapsUrl={googleMapsUrl}
            onAddressChange={setGoogleAddress}
            onMapsUrlChange={setGoogleMapsUrl}
            onAreaMatch={setAreaId}
            onRegionMatch={({ stateId: nextStateId, districtId: nextDistrictId }) => {
              setStateId(nextStateId);
              setDistrictId(nextDistrictId);
              setAreaId(getGeneralAreaId(nextDistrictId));
            }}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? t("updateSpotProgress") : t("saveSpot")}
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={() => router.push(`/spots/${spot.slug}`)}>
        {tCommon("cancel")}
      </Button>
    </form>
  );
}
