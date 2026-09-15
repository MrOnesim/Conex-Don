export interface CookiePreferences {
  necessary: boolean; // Always true
  analytics: boolean;
  media: boolean;
  timestamp: number;
  version: string;
}

export const CONSENT_COOKIE_KEY = "conex_cookie_consent";
export const CONSENT_VERSION = "1.0";

export const defaultConsentPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  media: false,
  timestamp: 0,
  version: CONSENT_VERSION,
};

export const CONSENT_EVENT_NAME = "conex_cookie_consent_changed";
export const OPEN_PREFERENCES_EVENT = "open_cookie_preferences";

/**
 * Retrieves the stored cookie consent preferences from localStorage or cookie.
 */
export function getCookieConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CONSENT_COOKIE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookiePreferences;
    if (parsed && typeof parsed.necessary === "boolean") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Saves cookie consent preferences to localStorage and dispatches change event.
 */
export function setCookieConsent(preferences: Partial<CookiePreferences>): CookiePreferences {
  const updated: CookiePreferences = {
    necessary: true,
    analytics: Boolean(preferences.analytics),
    media: Boolean(preferences.media),
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CONSENT_COOKIE_KEY, JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent(CONSENT_EVENT_NAME, { detail: updated }),
      );
    } catch {
      // Storage access might be restricted in some iframe contexts
    }
  }

  return updated;
}

/**
 * Checks if user has made an explicit choice.
 */
export function hasUserGivenConsent(): boolean {
  const consent = getCookieConsent();
  return consent !== null && consent.timestamp > 0;
}

/**
 * Triggers opening the preferences modal from anywhere on the site.
 */
export function openCookiePreferences(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
  }
}
