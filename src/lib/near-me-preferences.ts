const SHOW_ALL_KEY = "jompancing_spots_show_all";

export function getSpotsShowAllPreference(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SHOW_ALL_KEY) === "1";
}

export function setSpotsShowAllPreference(showAll: boolean) {
  if (typeof window === "undefined") return;
  if (showAll) {
    sessionStorage.setItem(SHOW_ALL_KEY, "1");
  } else {
    sessionStorage.removeItem(SHOW_ALL_KEY);
  }
}
