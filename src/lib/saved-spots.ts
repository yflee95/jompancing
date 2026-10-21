const STORAGE_KEY = "jompancing:saved-spots:v1";
const CHANGE_EVENT = "jompancing:saved-spots-changed";

let cachedSlugs: string[] | null = null;
const SERVER_SNAPSHOT: string[] = [];

function readSavedSlugs(): string[] {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  if (cachedSlugs) return cachedSlugs;

  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    cachedSlugs = Array.isArray(value)
      ? [...new Set(value.filter((item): item is string => typeof item === "string" && item.length <= 120))].slice(0, 500)
      : [];
  } catch {
    cachedSlugs = [];
  }

  return cachedSlugs;
}

function notifySavedSpotsChanged() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getSavedSpotSlugs(): string[] {
  return readSavedSlugs();
}

export function subscribeSavedSpots(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    cachedSlugs = null;
    callback();
  };

  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export function toggleSavedSpot(slug: string): boolean {
  const current = readSavedSlugs();
  const isSaved = current.includes(slug);
  const next = isSaved
    ? current.filter((savedSlug) => savedSlug !== slug)
    : [...current, slug].slice(-500);

  cachedSlugs = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Keep the current-tab state usable if browser storage is unavailable.
  }
  notifySavedSpotsChanged();
  return !isSaved;
}
