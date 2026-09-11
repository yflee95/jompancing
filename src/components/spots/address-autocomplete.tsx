"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, Loader2, MapPin, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  enrichSuggestionsWithUserInput,
  geocodeAddress,
  isValidMalaysiaCoordinate,
  mergeAddressSuggestions,
  searchLocalAddresses,
  searchOsmAddresses,
  type AddressSuggestion,
} from "@/lib/address-search";
import { buildGoogleMapsCoordsUrl } from "@/lib/google-maps";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

interface AddressAutocompleteProps {
  locale: Locale;
  stateId: string;
  districtId: string;
  value: string;
  mapsUrl: string;
  onAddressChange: (address: string) => void;
  onMapsUrlChange: (url: string) => void;
  onAreaMatch?: (areaId: string) => void;
  onRegionMatch?: (payload: {
    stateId: string;
    districtId: string;
  }) => void;
  disabled?: boolean;
}

export function AddressAutocomplete({
  locale,
  stateId,
  districtId,
  value,
  mapsUrl,
  onAddressChange,
  onMapsUrlChange,
  onAreaMatch,
  onRegionMatch,
  disabled,
}: AddressAutocompleteProps) {
  const t = useTranslations("post");
  const listId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchGenerationRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [autoFilled, setAutoFilled] = useState(false);
  const [selecting, setSelecting] = useState(false);

  const canSearch = !disabled;
  const hasDistrict = Boolean(districtId);
  const hasState = Boolean(stateId);
  const trimmed = value.trim();
  const showPanel = open && canSearch && trimmed.length >= 2;

  useEffect(() => {
    if (!canSearch || trimmed.length < 1) {
      setSuggestions([]);
      setLoading(false);
      setSearched(false);
      setOpen(false);
      return;
    }

    const local =
      hasState && hasDistrict
        ? searchLocalAddresses(stateId, districtId, value, locale)
        : [];
    setSuggestions(local);
    setSearched(false);

    if (trimmed.length >= 2) {
      setOpen(true);
    } else {
      setOpen(local.length > 0);
    }

    if (trimmed.length < 2) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const generation = ++searchGenerationRef.current;

    const timer = setTimeout(async () => {
      setLoading(true);
      const remote = await searchOsmAddresses(
        hasState ? stateId : "",
        hasDistrict ? districtId : undefined,
        value,
        locale,
        8,
        controller.signal,
      );

      if (generation !== searchGenerationRef.current) return;

      const freshLocal =
        hasState && hasDistrict
          ? searchLocalAddresses(stateId, districtId, value, locale)
          : [];
      setSuggestions(
        enrichSuggestionsWithUserInput(
          mergeAddressSuggestions(freshLocal, remote),
          value,
        ),
      );
      setLoading(false);
      setSearched(true);
      setOpen(true);
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [canSearch, districtId, hasDistrict, hasState, locale, stateId, trimmed, value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function confirmTypedAddress() {
    setSelecting(true);
    onAddressChange(trimmed);
    const geocoded = await geocodeAddress(
      trimmed,
      locale,
      hasState ? stateId : undefined,
      hasDistrict ? districtId : undefined,
    );
    if (geocoded && isValidMalaysiaCoordinate(geocoded.lat, geocoded.lng)) {
      onMapsUrlChange(buildGoogleMapsCoordsUrl(geocoded.lat, geocoded.lng));
      setAutoFilled(true);
    }
    setOpen(false);
    setSelecting(false);
  }

  async function selectSuggestion(item: AddressSuggestion) {
    setSelecting(true);
    onAddressChange(item.address);

    let coords = item.coordinates;
    if (coords.lat === 0 && coords.lng === 0) {
      const geocoded = await geocodeAddress(
        item.address,
        locale,
        stateId,
        hasDistrict ? districtId : undefined,
      );
      if (geocoded) coords = geocoded;
    }

    if (isValidMalaysiaCoordinate(coords.lat, coords.lng)) {
      onMapsUrlChange(buildGoogleMapsCoordsUrl(coords.lat, coords.lng));
      setAutoFilled(true);
    } else {
      setAutoFilled(false);
    }

    if (item.areaId && onAreaMatch) onAreaMatch(item.areaId);
    if (item.stateId && item.districtId && onRegionMatch) {
      onRegionMatch({ stateId: item.stateId, districtId: item.districtId });
    }
    setOpen(false);
    setSelecting(false);
  }

  return (
    <div ref={wrapperRef} className="space-y-2">
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ocean)]" />
        <input
          id="googleAddress"
          type="text"
          value={value}
          disabled={!canSearch}
          onChange={(e) => {
            onAddressChange(e.target.value);
            setAutoFilled(false);
          }}
          onFocus={() => canSearch && trimmed.length >= 2 && setOpen(true)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={t("googleAddressPlaceholder")}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open}
          className={cn(
            "h-12 w-full rounded-2xl border-0 bg-white py-2 pl-10 pr-10 text-sm text-[var(--ink)] shadow-sm ring-1 outline-none transition focus:ring-2 focus:ring-[var(--ocean)]/25",
            canSearch
              ? "ring-[var(--sand-dark)]/60"
              : "cursor-not-allowed bg-[var(--sand)] text-[var(--ink-muted)] ring-[var(--sand-dark)]/40",
          )}
        />
        {(loading || selecting) && (
          <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[var(--ocean)]" />
        )}

        {showPanel && (
          <ul
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-2xl border border-[var(--sand-dark)]/50 bg-white py-1 shadow-[var(--shadow-travel-hover)]"
          >
            {loading && suggestions.length === 0 && (
              <li className="px-3.5 py-3 text-sm text-[var(--ink-muted)]">
                {t("addressSearching")}
              </li>
            )}

            {suggestions.map((item) => (
              <li key={item.id} role="option">
                <button
                  type="button"
                  disabled={selecting}
                  onClick={() => void selectSuggestion(item)}
                  className="flex w-full items-start gap-3 px-3.5 py-2.5 text-left transition hover:bg-[var(--ocean-light)]/60 disabled:opacity-60"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ocean)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-[var(--ink)]">
                      {item.label}
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-xs text-[var(--ink-muted)]">
                      {item.address}
                    </span>
                  </span>
                  {item.source === "local" && item.id.startsWith("area-") ? (
                    <span className="shrink-0 rounded-full bg-[var(--sand)] px-2 py-0.5 text-[10px] font-semibold text-[var(--ink-muted)]">
                      {t("addressArea")}
                    </span>
                  ) : item.source === "local" ? (
                    <span className="shrink-0 rounded-full bg-[var(--ocean-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--ocean-dark)]">
                      {t("addressPopular")}
                    </span>
                  ) : item.source === "google" ? (
                    <span className="shrink-0 rounded-full bg-[var(--ocean-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--ocean-dark)]">
                      Google
                    </span>
                  ) : null}
                </button>
              </li>
            ))}

            {!loading && searched && suggestions.length === 0 && (
              <li className="px-3.5 py-3 text-sm text-[var(--ink-muted)]">
                {t("addressNoResults")}
              </li>
            )}

            {!loading && trimmed.length >= 6 && (
              <li className="border-t border-[var(--sand-dark)]/40">
                <button
                  type="button"
                  disabled={selecting}
                  onClick={() => void confirmTypedAddress()}
                  className="flex w-full items-start gap-3 px-3.5 py-2.5 text-left transition hover:bg-[var(--ocean-light)]/60 disabled:opacity-60"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ocean)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-[var(--ink)]">
                      {t("addressUseTyped")}
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-xs text-[var(--ink-muted)]">
                      {trimmed}
                    </span>
                  </span>
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
        <Sparkles className="h-3.5 w-3.5 text-[var(--ocean)]" />
        {hasState ? t("googleAddressHint") : t("googleAddressHintNoState")}
      </p>

      {mapsUrl && autoFilled && (
        <div className="flex items-center gap-2 rounded-xl bg-[var(--ocean-light)]/50 px-3 py-2 text-xs text-[var(--ocean-dark)]">
          <Check className="h-3.5 w-3.5 shrink-0" />
          {t("mapsUrlAutoFilled")}
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="googleMapsUrl"
          className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]"
        >
          {t("googleMapsUrl")}
        </label>
        <input
          id="googleMapsUrl"
          type="url"
          value={mapsUrl}
          onChange={(e) => {
            onMapsUrlChange(e.target.value);
            setAutoFilled(false);
          }}
          placeholder="https://maps.google.com/..."
          className="h-11 w-full rounded-2xl border-0 bg-[var(--sand)] px-4 text-sm text-[var(--ink)] ring-1 ring-[var(--sand-dark)]/60 outline-none focus:ring-2 focus:ring-[var(--ocean)]/25"
        />
        <p className="text-xs text-[var(--ink-muted)]">{t("googleMapsUrlHint")}</p>
      </div>
    </div>
  );
}
