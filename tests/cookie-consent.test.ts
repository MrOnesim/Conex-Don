import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getCookieConsent,
  setCookieConsent,
  hasUserGivenConsent,
  CONSENT_COOKIE_KEY,
  CONSENT_VERSION,
  CONSENT_EVENT_NAME,
} from "@/lib/cookie-consent";

describe("Cookie Consent Lib", () => {
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};

    // Mock localStorage
    const mockLocalStorage = {
      getItem: (key: string) => mockStore[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStore[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStore[key];
      },
      clear: () => {
        mockStore = {};
      },
    };

    vi.stubGlobal("localStorage", mockLocalStorage);
    vi.stubGlobal("window", {
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it("returns null when no consent has been registered", () => {
    expect(getCookieConsent()).toBeNull();
    expect(hasUserGivenConsent()).toBe(false);
  });

  it("persists consent preferences and enforces necessary=true", () => {
    const saved = setCookieConsent({
      analytics: true,
      media: false,
    });

    expect(saved.necessary).toBe(true);
    expect(saved.analytics).toBe(true);
    expect(saved.media).toBe(false);
    expect(saved.version).toBe(CONSENT_VERSION);
    expect(saved.timestamp).toBeGreaterThan(0);

    const stored = getCookieConsent();
    expect(stored).toEqual(saved);
    expect(hasUserGivenConsent()).toBe(true);
  });

  it("dispatches custom event on consent update", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    setCookieConsent({ analytics: false, media: true });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe(CONSENT_EVENT_NAME);
    expect(event.detail.media).toBe(true);
    expect(event.detail.analytics).toBe(false);
  });
});
