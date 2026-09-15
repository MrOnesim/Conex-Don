"use client";

import { openCookiePreferences } from "@/lib/cookie-consent";

export function CookiePreferencesButton({
  className = "",
  children = "Gestion des cookies",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => openCookiePreferences()}
      className={`transition-colors text-left ${className}`}
    >
      {children}
    </button>
  );
}
