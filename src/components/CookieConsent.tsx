"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCookieConsent,
  setCookieConsent,
  OPEN_PREFERENCES_EVENT,
  type CookiePreferences,
} from "@/lib/cookie-consent";
import { markHydrated, useIsHydrated } from "@/lib/use-is-hydrated";

export function CookieConsent() {
  const mounted = useIsHydrated();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [analyticsAllowed, setAnalyticsAllowed] = useState(
    () => getCookieConsent()?.analytics ?? false,
  );
  const [mediaAllowed, setMediaAllowed] = useState(
    () => getCookieConsent()?.media ?? false,
  );

  useEffect(() => {
    markHydrated();
    if (!getCookieConsent()) {
      // Delay entrance slightly for non-jarring luxury presentation
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      const existing = getCookieConsent();
      if (existing) {
        setAnalyticsAllowed(existing.analytics);
        setMediaAllowed(existing.media);
      }
      setShowDetails(true);
      setVisible(true);
    };

    window.addEventListener(OPEN_PREFERENCES_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, handleOpen);
  }, []);

  if (!mounted || !visible) return null;

  const handleAcceptAll = () => {
    setCookieConsent({ analytics: true, media: true });
    setVisible(false);
    setShowDetails(false);
  };

  const handleRejectAll = () => {
    setCookieConsent({ analytics: false, media: false });
    setVisible(false);
    setShowDetails(false);
  };

  const handleSaveCustom = () => {
    setCookieConsent({
      analytics: analyticsAllowed,
      media: mediaAllowed,
    });
    setVisible(false);
    setShowDetails(false);
  };

  return (
    <div
      role="region"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-[80] px-3 pt-3 sm:px-5 sm:pt-5 pb-20 sm:pb-28 pointer-events-none animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="mx-auto max-w-4xl pointer-events-auto rounded-2xl border border-bone/15 bg-ink/95 p-5 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        {!showDetails ? (
          /* Simple initial banner */
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1.5 pr-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Respect de votre vie privée
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-bone/75 max-w-2xl">
                Nous utilisons des cookies indispensables au bon fonctionnement du site et de son
                lecteur audio. Avec votre accord, nous activons également des mesures d&apos;audience
                anonymisées pour perfectionner votre expérience musicale.{" "}
                <Link
                  href="/legal#cookies"
                  className="text-gold underline underline-offset-2 hover:text-bone"
                >
                  En savoir plus
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 shrink-0">
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.18em] border border-bone/20 rounded-lg text-bone/70 hover:border-bone/50 hover:text-bone transition-colors"
              >
                Personnaliser
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.18em] border border-bone/20 rounded-lg text-bone/70 hover:border-bone/50 hover:text-bone transition-colors"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] bg-gold text-ink rounded-lg hover:bg-gold/90 transition-all shadow-md shadow-gold/20"
              >
                Tout accepter
              </button>
            </div>
          </div>
        ) : (
          /* Granular custom settings modal */
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-bone/10 pb-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
                  Paramètres de confidentialité &amp; Cookies
                </h2>
                <p className="text-xs text-bone/50 mt-0.5">
                  Choisissez les finalités que vous souhaitez autoriser lors de votre navigation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="text-xs text-bone/50 hover:text-bone p-1"
                aria-label="Fermer les paramètres"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Essential cookies */}
              <div className="flex items-start justify-between gap-4 rounded-xl bg-bone/[0.03] p-3.5 border border-bone/8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-bone">Cookies strictement nécessaires</span>
                    <span className="rounded bg-bone/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-gold">
                      Toujours actif
                    </span>
                  </div>
                  <p className="text-bone/60 leading-relaxed">
                    Requis pour la sécurité, la conservation de votre thème d&apos;affichage, l&apos;état
                    du lecteur audio immersif et le bon fonctionnement de la navigation.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 h-4 w-4 accent-gold cursor-not-allowed opacity-70"
                />
              </div>

              {/* Analytics cookies */}
              <div className="flex items-start justify-between gap-4 rounded-xl bg-bone/[0.03] p-3.5 border border-bone/8">
                <div className="space-y-1">
                  <span className="font-semibold text-bone">Mesures d&apos;audience anonymisées</span>
                  <p className="text-bone/60 leading-relaxed">
                    Permettent d&apos;analyser les volumes de visites, les morceaux les plus écoutés
                    et les performances de diffusion sans collecter d&apos;identifiant personnel.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  id="consent-analytics"
                  className="mt-1 h-4 w-4 accent-gold cursor-pointer"
                />
              </div>

              {/* External Media cookies */}
              <div className="flex items-start justify-between gap-4 rounded-xl bg-bone/[0.03] p-3.5 border border-bone/8">
                <div className="space-y-1">
                  <span className="font-semibold text-bone">Médias &amp; Lecteurs externes</span>
                  <p className="text-bone/60 leading-relaxed">
                    Facilitent l&apos;intégration fluide des clips YouTube et des liens vers Spotify,
                    Apple Music et Audiomack.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={mediaAllowed}
                  onChange={(e) => setMediaAllowed(e.target.checked)}
                  id="consent-media"
                  className="mt-1 h-4 w-4 accent-gold cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-bone/10 pt-4">
              <button
                type="button"
                onClick={handleRejectAll}
                className="px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] border border-bone/20 rounded-lg text-bone/70 hover:text-bone hover:border-bone/50 transition-colors"
              >
                Refuser tout
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] border border-gold text-gold rounded-lg hover:bg-gold/10 transition-colors"
              >
                Enregistrer mes choix
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] bg-gold text-ink rounded-lg hover:bg-gold/90 transition-all shadow-md shadow-gold/20"
              >
                Tout autoriser
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
