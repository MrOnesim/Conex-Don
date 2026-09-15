"use client";

import { useSyncExternalStore } from "react";
import { Analytics } from "@vercel/analytics/react";
import { getCookieConsent, CONSENT_EVENT_NAME } from "@/lib/cookie-consent";

function subscribeToConsent(callback: () => void): () => void {
  window.addEventListener(CONSENT_EVENT_NAME, callback);
  return () => window.removeEventListener(CONSENT_EVENT_NAME, callback);
}

function getAnalyticsConsent(): boolean {
  return getCookieConsent()?.analytics ?? false;
}

export function AnalyticsProvider() {
  const enabled = useSyncExternalStore(
    subscribeToConsent,
    getAnalyticsConsent,
    () => false,
  );

  if (!enabled) return null;
  return <Analytics />;
}