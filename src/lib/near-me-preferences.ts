const SHOW_ALL_KEY = "jompancing_spots_show_all";
const SHOW_ALL_EVENT = "jompancing:spots-show-all-changed";

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
  window.dispatchEvent(new Event(SHOW_ALL_EVENT));
}

export function subscribeSpotsShowAllPreference(callback: () => void) {
  window.addEventListener(SHOW_ALL_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SHOW_ALL_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
