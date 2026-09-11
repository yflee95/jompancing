import { malaysiaStates } from "@/data/malaysia-states";
import { getLocalizedText } from "@/types";
import type { Locale } from "@/i18n/routing";

export interface InferredUserRegion {
  stateId: string;
  districtId: string;
  label: string;
}

type NominatimAddress = Record<string, string>;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function namesMatch(a: string, b: string) {
  const x = normalize(a);
  const y = normalize(b);
  return x.includes(y) || y.includes(x);
}

function addressCandidates(address: NominatimAddress): string[] {
  return [
    address.suburb,
    address.city,
    address.town,
    address.village,
    address.county,
    address.state,
    address["state_district"],
  ].filter((v): v is string => Boolean(v?.trim()));
}

/** Match Nominatim reverse-geocode address parts to our state/district IDs. */
export function matchRegionFromNominatim(
  address: NominatimAddress,
  locale: Locale,
): InferredUserRegion | null {
  const candidates = addressCandidates(address);
  if (candidates.length === 0) return null;

  for (const state of malaysiaStates) {
    const stateNames = Object.values(state.name);
    const stateHit = candidates.some((c) =>
      stateNames.some((name) => namesMatch(c, name)),
    );
    if (!stateHit) continue;

    for (const district of state.districts) {
      const districtNames = Object.values(district.name);
      const districtHit = candidates.some((c) =>
        districtNames.some((name) => namesMatch(c, name)),
      );
      if (districtHit) {
        return {
          stateId: state.id,
          districtId: district.id,
          label: getLocalizedText(district.name, locale),
        };
      }
    }

    const fallbackDistrict = state.districts[0];
    if (fallbackDistrict) {
      return {
        stateId: state.id,
        districtId: fallbackDistrict.id,
        label: getLocalizedText(fallbackDistrict.name, locale),
      };
    }
  }

  return null;
}
