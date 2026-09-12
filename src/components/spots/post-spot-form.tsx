"use client";

import { FormEvent, useEffect, useState } from "react";
import { MapPinned, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SpotLocationMapPicker } from "@/components/spots/spot-location-map-picker";
import { useAuth } from "@/components/providers/auth-provider";
import { useUserSpots } from "@/components/providers/spots-provider";
import { getGeneralAreaId } from "@/data/malaysia-areas";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useUserLocation } from "@/hooks/use-user-location";
import {
  buildGoogleMapsCoordsUrl,
  isValidGoogleMapsUrl,
  parseGoogleMapsUrl,
} from "@/lib/google-maps";
import { resolvePinLocation } from "@/lib/resolve-pin-location";
import type { Coordinates, WaterType } from "@/types";
import type { Locale } from "@/i18n/routing";

interface PostSpotFormProps {
  defaultWaterType?: WaterType;
}

export function PostSpotForm({ defaultWaterType }: PostSpotFormProps = {}) {
  const t = useTranslations("post");
  const tCommon = useTranslations("common");
  const { user, ensureAuthForPost } = useAuth();
  const { addSpot } = useUserSpots();
  const router = useRouter();
  const locale = useLocale() as Locale;

  const [googleAddress, setGoogleAddress] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [pinCoords, setPinCoords] = useState<Coordinates | null>(null);
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const userLocation = useUserLocation(locale);

  useEffect(() => {
    const coords = parseGoogleMapsUrl(googleMapsUrl);
    if (!coords) return;
    setPinCoords((prev) => {
      if (
        prev &&
        Math.abs(prev.lat - coords.lat) < 0.00001 &&
        Math.abs(prev.lng - coords.lng) < 0.00001
      ) {
        return prev;
      }
      return coords;
    });
  }, [googleMapsUrl]);

  function applyRegionFromPin(nextStateId: string, nextDistrictId: string) {
    setStateId(nextStateId);
    setDistrictId(nextDistrictId);
    setAreaId(getGeneralAreaId(nextDistrictId));
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

    let coords = pinCoords ?? parseGoogleMapsUrl(googleMapsUrl);
    if (!coords && googleMapsUrl.trim()) {
      setError(t("googleMapsUrlNoCoords"));
      return;
    }
    if (!coords) {
      setError(t("pinRequired"));
      return;
    }

    let mapsUrl = googleMapsUrl.trim();
    if (!mapsUrl || !isValidGoogleMapsUrl(mapsUrl)) {
      mapsUrl = buildGoogleMapsCoordsUrl(coords.lat, coords.lng);
    }

    let resolvedStateId = stateId;
    let resolvedDistrictId = districtId;
    let resolvedAreaId = areaId;
    let resolvedAddress = googleAddress.trim();

    if (!resolvedStateId || !resolvedDistrictId || !resolvedAreaId) {
      const resolved = await resolvePinLocation(coords, locale);
      if (resolved.region) {
        resolvedStateId = resolved.region.stateId;
        resolvedDistrictId = resolved.region.districtId;
        resolvedAreaId = getGeneralAreaId(resolved.region.districtId);
      }
      if (!resolvedAddress) {
        resolvedAddress = resolved.address;
      }
    }

    if (!resolvedStateId || !resolvedDistrictId || !resolvedAreaId) {
      setError(t("pinRequired"));
      return;
    }

    const title =
      resolvedAddress.split(",")[0]?.trim() ||
      t("defaultSpotTitle");

    setSubmitting(true);
    try {
      const spot = await addSpot({
        title,
        description: "",
        googleAddress: resolvedAddress || mapsUrl,
        googleMapsUrl: mapsUrl,
        coordinates: coords,
        waterType: defaultWaterType ?? "saltwater",
        tags: [],
        photos: [],
        visibility: "public",
        authorId: poster.id,
        authorName: poster.name,
        locale,
        stateId: resolvedStateId,
        districtId: resolvedDistrictId,
        areaId: resolvedAreaId,
      });
      router.push(`/spots/${spot.slug}`);
    } catch {
      setError(t("publishFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  const ready = Boolean(
    pinCoords || (googleMapsUrl.trim() && parseGoogleMapsUrl(googleMapsUrl)),
  );

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--ocean)] via-[#1a7580] to-[var(--ocean-dark)] px-6 py-8 text-white shadow-lg shadow-[var(--ocean-glow)]">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <MapPinned className="mb-2 h-5 w-5 text-white/80" />
        <h1 className="font-serif-display text-2xl font-bold leading-tight">
          {t("heroTitle")}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-white/80">{t("heroSubtitleSimple")}</p>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <section className="overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-travel)] ring-1 ring-[var(--sand-dark)]/30">
          <div className="border-b border-[var(--sand-dark)]/30 bg-gradient-to-r from-[var(--ocean-light)]/80 to-white px-5 py-4">
            <h2 className="font-serif-display text-lg font-bold text-[var(--ink)]">
              {t("locationSection")}
            </h2>
            <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{t("locationHint")}</p>
          </div>
          <div className="space-y-4 p-4 sm:p-5">
            <SpotLocationMapPicker
              locale={locale}
              userCoords={userLocation.coords}
              pinCoords={pinCoords}
              onPinCoordsChange={setPinCoords}
              onMapsUrlChange={setGoogleMapsUrl}
              onAddressChange={setGoogleAddress}
              onRegionMatch={({ stateId: nextStateId, districtId: nextDistrictId }) =>
                applyRegionFromPin(nextStateId, nextDistrictId)
              }
              className="ring-0"
            />

            <div className="space-y-1.5">
              <Label htmlFor="maps-url">{t("googleMapsUrl")}</Label>
              <Input
                id="maps-url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder={t("googleMapsUrlHint")}
                className="h-12 rounded-2xl bg-[var(--sand)] text-sm"
              />
              {googleMapsUrl.trim() && (
                <p className="text-[11px] text-[var(--ink-muted)]">
                  {isValidGoogleMapsUrl(googleMapsUrl)
                    ? t("mapsUrlAutoFilled")
                    : t("googleMapsUrlInvalid")}
                </p>
              )}
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitting || !ready}
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
