"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { motionEase } from "@/components/motion";
import {
  getCookieConsent,
  OPEN_PREFERENCES_EVENT,
  setCookieConsent,
} from "@/lib/cookie-consent";
import { markHydrated, useIsHydrated } from "@/lib/use-is-hydrated";

function Preference({
  id,
  title,
  description,
  checked,
  onChange,
  disabled = false,
  alwaysOn = false,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  alwaysOn?: boolean;
}) {
  return (
    <div className="preference-row">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={id} className="text-sm font-semibold text-bone">
            {title}
          </label>
          {alwaysOn ? (
            <span className="border border-gold/35 px-1.5 py-0.5 text-[0.54rem] font-bold uppercase tracking-[0.12em] text-gold">
              Toujours actif
            </span>
          ) : null}
        </div>
        <p
          id={`${id}-description`}
          className="mt-1.5 max-w-2xl text-xs leading-relaxed text-bone/60"
        >
          {description}
        </p>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="preference-switch"
        aria-describedby={`${id}-description`}
      />
    </div>
  );
}

export function CookieConsent() {
  const mounted = useIsHydrated();
  const reducedMotion = useReducedMotion() ?? false;
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
      const timer = window.setTimeout(() => setVisible(true), 650);
      return () => window.clearTimeout(timer);
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

  const closeWith = (analytics: boolean, media: boolean) => {
    setCookieConsent({ analytics, media });
    setVisible(false);
    setShowDetails(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          key="cookie-consent"
          role="region"
          aria-label="Consentement aux cookies"
          className="fixed inset-x-0 bottom-0 z-[95] px-3 pb-20 pt-3 sm:px-5 sm:pb-28 sm:pt-5"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.32, ease: motionEase }
          }
        >
          <div className="dialog-surface mx-auto max-w-4xl p-5 sm:p-6">
            {!showDetails ? (
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span
                      className="live-dot h-2 w-2 bg-gold"
                      aria-hidden="true"
                    />
                    <h2 className="eyebrow text-gold">
                      Votre espace, vos choix
                    </h2>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-bone/70">
                    Le site utilise les cookies nécessaires au lecteur et à la
                    navigation. Avec votre accord, nous activons aussi les
                    mesures d&apos;audience anonymisées et les médias externes.{" "}
                    <Link
                      href="/legal#cookies"
                      className="link-underline text-gold hover:text-bone"
                    >
                      En savoir plus
                    </Link>
                    .
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className="button button--outline"
                  >
                    <span className="button__label">Personnaliser</span>
                    <span className="button__arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => closeWith(false, false)}
                    className="button button--outline"
                  >
                    <span className="button__label">Refuser</span>
                    <span className="button__arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => closeWith(true, true)}
                    className="button button--gold"
                  >
                    <span className="button__label">Tout accepter</span>
                    <span className="button__arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-5 border-b border-bone/12 pb-4">
                  <div>
                    <h2 className="eyebrow text-gold">
                      Préférences de confidentialité
                    </h2>
                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-bone/60">
                      Choisissez les finalités facultatives que vous souhaitez
                      autoriser. Votre choix reste modifiable à tout moment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDetails(false)}
                    className="icon-control h-8 min-h-8 min-w-8"
                    aria-label="Retour au résumé des cookies"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  <Preference
                    id="consent-necessary"
                    title="Cookies strictement nécessaires"
                    description="Requis pour la sécurité, le thème, le lecteur intégré et le bon fonctionnement de la navigation."
                    checked
                    disabled
                    alwaysOn
                  />
                  <Preference
                    id="consent-analytics"
                    title="Mesures d'audience anonymisées"
                    description="Aident à comprendre les parcours et les contenus les plus consultés, sans identifiant personnel."
                    checked={analyticsAllowed}
                    onChange={setAnalyticsAllowed}
                  />
                  <Preference
                    id="consent-media"
                    title="Médias et lecteurs externes"
                    description="Facilitent l'intégration des clips YouTube et les passages vers les plateformes musicales officielles."
                    checked={mediaAllowed}
                    onChange={setMediaAllowed}
                  />
                </div>
                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-bone/12 pt-4">
                  <button
                    type="button"
                    onClick={() => closeWith(false, false)}
                    className="button button--outline"
                  >
                    <span className="button__label">Refuser tout</span>
                    <span className="button__arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => closeWith(analyticsAllowed, mediaAllowed)}
                    className="button button--outline"
                  >
                    <span className="button__label">Enregistrer mes choix</span>
                    <span className="button__arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => closeWith(true, true)}
                    className="button button--gold"
                  >
                    <span className="button__label">Tout autoriser</span>
                    <span className="button__arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
