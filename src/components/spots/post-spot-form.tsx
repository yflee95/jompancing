"use client";

import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  Camera,
  Compass,
  Fish,
  ImagePlus,
  Lock,
  MapPinned,
  Sparkles,
  Unlock,
  Waves,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { AddressAutocomplete } from "@/components/spots/address-autocomplete";
import { LocationSelectors } from "@/components/spots/location-selectors";
import { useAuth } from "@/components/providers/auth-provider";
import { useUserSpots } from "@/components/providers/spots-provider";
import { getGeneralAreaId } from "@/data/malaysia-areas";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useUserLocation } from "@/hooks/use-user-location";
import { isValidGoogleMapsUrl, parseGoogleMapsUrl } from "@/lib/google-maps";
import { cn } from "@/lib/utils";
import type { SpotVisibility, WaterType } from "@/types";
import type { Locale } from "@/i18n/routing";

const WATER_TYPES: { id: WaterType; icon: typeof Waves }[] = [
  { id: "saltwater", icon: Waves },
  { id: "freshwater", icon: Fish },
  { id: "pond", icon: MapPinned },
  { id: "river", icon: Compass },
];

const MAX_PHOTOS = 5;
const SUGGESTED_TAGS = ["Siakap", "Night fishing", "Family", "Live bait", "Jetty"];

function FormSection({
  step,
  title,
  subtitle,
  children,
}: {
  step: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/30">
      <div className="border-b border-[var(--sand-dark)]/30 bg-gradient-to-r from-[var(--ocean-light)]/80 to-white px-5 py-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--ocean)]">
          {step}
        </span>
        <h2 className="font-serif-display mt-0.5 text-lg font-bold text-[var(--ink)]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{subtitle}</p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function PostSpotForm() {
  const t = useTranslations("post");
  const tSpots = useTranslations("spots");
  const tCommon = useTranslations("common");
  const { user, isRegisteredUser, ensureAuthForPost } = useAuth();
  const { addSpot } = useUserSpots();
  const router = useRouter();
  const locale = useLocale() as Locale;

  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [googleAddress, setGoogleAddress] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [waterType, setWaterType] = useState<WaterType>("saltwater");
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [visibility, setVisibility] = useState<SpotVisibility>("public");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [areaName, setAreaName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const userLocation = useUserLocation(locale);

  useEffect(() => {
    if (!userLocation.region || stateId) return;
    setStateId(userLocation.region.stateId);
    setDistrictId(userLocation.region.districtId);
  }, [userLocation.region, stateId]);

  function handleStateChange(id: string) {
    setStateId(id);
    setDistrictId("");
    setAreaId("");
    setAreaName("");
    setGoogleAddress("");
    setGoogleMapsUrl("");
  }

  function handleDistrictChange(id: string) {
    setDistrictId(id);
    setAreaId("");
    setAreaName("");
    setGoogleAddress("");
    setGoogleMapsUrl("");
  }

  function applyRegionFromAddress(nextStateId: string, nextDistrictId: string) {
    setStateId(nextStateId);
    setDistrictId(nextDistrictId);
    setAreaId("");
    setAreaName("");
  }

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

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (submitting) return;

    const poster = user ?? (await ensureAuthForPost());
    if (!poster) {
      setError(t("authRequired"));
      return;
    }
    if (photos.length === 0) {
      setError(t("photoRequired"));
      return;
    }
    if (!title.trim()) {
      setError(t("titleRequired"));
      return;
    }
    if (!googleAddress.trim()) {
      setError(t("googleAddressRequired"));
      return;
    }
    if (!googleMapsUrl.trim() || !isValidGoogleMapsUrl(googleMapsUrl)) {
      setError(t("googleMapsUrlInvalid"));
      return;
    }
    if (!stateId || !districtId || !areaId) {
      setError(tSpots("locationRequired"));
      return;
    }
    if (areaId === getGeneralAreaId(districtId) && !areaName.trim()) {
      setError(tSpots("areaNameRequired"));
      return;
    }

    const coords = parseGoogleMapsUrl(googleMapsUrl);
    if (!coords) {
      setError(t("googleMapsUrlNoCoords"));
      return;
    }

    setSubmitting(true);
    try {
      const spot = await addSpot({
        title: title.trim(),
        description: description.trim(),
        googleAddress: googleAddress.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
        coordinates: coords,
        waterType,
        tags,
        photos,
        visibility: poster.isAnonymous ? "public" : visibility,
        authorId: poster.id,
        authorName: poster.name,
        locale,
        stateId,
        districtId,
        areaId,
        areaName:
          areaId === getGeneralAreaId(districtId) ? areaName.trim() : undefined,
      });
      router.push(`/spots/${spot.slug}`);
    } catch {
      setError(t("publishFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  const progress = [
    photos.length > 0,
    title.trim().length > 0,
    Boolean(stateId && districtId && areaId && googleAddress),
  ].filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--ocean)] via-[#1a7580] to-[var(--ocean-dark)] px-6 py-8 text-white shadow-lg shadow-[var(--ocean-glow)]">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-6 left-1/3 h-24 w-24 rounded-full bg-white/5" />
        <Sparkles className="mb-2 h-5 w-5 text-white/80" />
        <h1 className="font-serif-display text-2xl font-bold leading-tight">
          {t("heroTitle")}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-white/80">{t("heroSubtitle")}</p>
        <div className="mt-5 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all",
                progress >= n ? "bg-white" : "bg-white/25",
              )}
            />
          ))}
          <span className="ml-1 text-xs font-medium text-white/70">
            {progress}/3
          </span>
        </div>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <FormSection step="01" title={t("uploadPhotos")} subtitle={t("photoHint")}>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {photos.map((src, i) => (
              <div
                key={i}
                className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/55 p-1 text-white backdrop-blur-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <>
                <label className="flex h-28 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[var(--ocean)]/35 bg-[var(--ocean-light)]/30 text-[var(--ocean)] transition hover:border-[var(--ocean)]/60 hover:bg-[var(--ocean-light)]/50">
                  <Camera className="h-7 w-7" />
                  <span className="text-[10px] font-semibold">{t("takePhoto")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={handlePhotos}
                  />
                </label>
                <label className="flex h-28 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[var(--ocean)]/35 bg-[var(--ocean-light)]/30 text-[var(--ocean)] transition hover:border-[var(--ocean)]/60 hover:bg-[var(--ocean-light)]/50">
                  <ImagePlus className="h-7 w-7" />
                  <span className="text-[10px] font-semibold">{t("chooseFromGallery")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={handlePhotos}
                  />
                </label>
              </>
            )}
          </div>
          {photos.length === 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--sand)] py-4 text-sm font-medium text-[var(--ocean)] ring-1 ring-[var(--sand-dark)]/50 transition hover:bg-[var(--ocean-light)]/40">
                <Camera className="h-4 w-4" />
                {t("takePhoto")}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={handlePhotos}
                />
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--sand)] py-4 text-sm font-medium text-[var(--ocean)] ring-1 ring-[var(--sand-dark)]/50 transition hover:bg-[var(--ocean-light)]/40">
                <ImagePlus className="h-4 w-4" />
                {t("chooseFromGallery")}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handlePhotos}
                />
              </label>
            </div>
          )}
        </FormSection>

        <FormSection step="02" title={t("detailsSection")} subtitle={t("detailsHint")}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">{t("title")} *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("titlePlaceholder")}
                className="h-12 rounded-2xl bg-[var(--sand)] text-base"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc">{t("description")}</Label>
              <Textarea
                id="desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                className="rounded-2xl bg-[var(--sand)]"
              />
            </div>

            <div className="space-y-2">
              <Label>{tSpots("filterWaterType")}</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {WATER_TYPES.map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setWaterType(id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-xs font-semibold transition",
                      waterType === id
                        ? "bg-[var(--ocean)] text-white shadow-md shadow-[var(--ocean-glow)]"
                        : "bg-[var(--sand)] text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/50 hover:text-[var(--ink)]",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {tSpots(id)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">{t("tags")}</Label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--ocean-light)] px-2.5 py-1 text-xs font-medium text-[var(--ocean-dark)]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((x) => x !== tag))}
                      className="rounded-full hover:bg-[var(--ocean)]/10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                id="tags"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => tagDraft.trim() && addTag(tagDraft)}
                placeholder={t("tagsPlaceholder")}
                className="h-11 rounded-2xl bg-[var(--sand)]"
              />
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_TAGS.filter((s) => !tags.includes(s)).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--ink-muted)] ring-1 ring-[var(--sand-dark)]/60 transition hover:text-[var(--ocean)]"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection step="03" title={t("locationSection")} subtitle={t("locationHint")}>
          <div className="space-y-4">
            <LocationSelectors
              locale={locale}
              stateId={stateId}
              districtId={districtId}
              areaId={areaId}
              areaName={areaName}
              onStateChange={handleStateChange}
              onDistrictChange={handleDistrictChange}
              onAreaChange={setAreaId}
              onAreaNameChange={setAreaName}
            />

            <div className="space-y-1.5">
              <Label>{t("googleAddress")} *</Label>
              <AddressAutocomplete
                locale={locale}
                stateId={stateId}
                districtId={districtId}
                value={googleAddress}
                mapsUrl={googleMapsUrl}
                onAddressChange={setGoogleAddress}
                onMapsUrlChange={setGoogleMapsUrl}
                onAreaMatch={setAreaId}
                onRegionMatch={({ stateId: nextStateId, districtId: nextDistrictId }) =>
                  applyRegionFromAddress(nextStateId, nextDistrictId)
                }
              />
            </div>
          </div>
        </FormSection>

        {isRegisteredUser ? (
          <FormSection step="04" title={t("visibility")} subtitle={t("visibilityHint")}>
            <div className="grid grid-cols-2 gap-3">
              {(["public", "private"] as SpotVisibility[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl px-4 py-5 text-sm font-semibold ring-1 transition",
                    visibility === v
                      ? "bg-[var(--ocean-light)] text-[var(--ocean-dark)] ring-[var(--ocean)]/30 shadow-sm"
                      : "bg-[var(--sand)] text-[var(--ink-muted)] ring-[var(--sand-dark)]/50",
                  )}
                >
                  {v === "public" ? (
                    <Unlock className="h-6 w-6" />
                  ) : (
                    <Lock className="h-6 w-6" />
                  )}
                  {t(`visibility_${v}`)}
                </button>
              ))}
            </div>
          </FormSection>
        ) : (
          <p className="rounded-2xl bg-[var(--ocean-light)]/50 px-4 py-3 text-xs text-[var(--ocean-dark)] ring-1 ring-[var(--ocean)]/15">
            {t("anonymousPublicOnly")}
          </p>
        )}

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="h-14 w-full text-base shadow-lg shadow-[var(--ocean-glow)]"
          size="lg"
        >
          <Sparkles className="h-5 w-5" />
          {submitting ? tCommon("loading") : t("publishSpot")}
        </Button>
      </form>
    </div>
  );
}
