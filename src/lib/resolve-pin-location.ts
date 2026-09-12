import type { Coordinates } from "@/types";
import type { InferredUserRegion } from "@/lib/reverse-geocode";
import type { Locale } from "@/i18n/routing";

export interface ResolvedPinLocation {
  address: string;
  region: InferredUserRegion | null;
}

export async function resolvePinLocation(
  coords: Coordinates,
  locale: Locale,
): Promise<ResolvedPinLocation> {
  const fallbackAddress = `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;

  try {
    const response = await fetch(
      `/api/reverse-geocode?lat=${coords.lat}&lng=${coords.lng}&locale=${locale}`,
    );
    if (!response.ok) {
      return { address: fallbackAddress, region: null };
    }

    const data = (await response.json()) as {
      region?: InferredUserRegion | null;
      address?: string | null;
    };

    return {
      address: data.address?.trim() || fallbackAddress,
      region: data.region ?? null,
    };
  } catch {
    return { address: fallbackAddress, region: null };
  }
}
