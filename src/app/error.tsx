"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="error-stage">
      <div className="error-stage__index" aria-hidden="true">
        500
      </div>
      <section className="error-stage__content" aria-labelledby="error-title">
        <p className="eyebrow text-gold">Interruption de signal</p>
        <h1
          id="error-title"
          className="display-xl mt-5 max-w-3xl text-[clamp(3rem,12vw,7rem)] leading-[0.83]"
        >
          LE RYTHME A<br />
          MARQUÉ UNE PAUSE.
        </h1>
        <p className="mt-7 max-w-xl text-base leading-relaxed text-bone/65 sm:text-lg">
          Cette page n&apos;a pas pu se charger correctement. Vous pouvez
          relancer la lecture ou revenir au point de départ.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="button button--solid"
          >
            <span className="button__label">Réessayer</span>
            <span className="button__arrow" aria-hidden="true">
              ↻
            </span>
          </button>
          <Link href="/" className="button button--outline">
            <span className="button__label">Retour à l&apos;accueil</span>
            <span className="button__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
        {process.env.NODE_ENV === "development" ? (
          <details className="error-stage__details">
            <summary>Détails techniques</summary>
            <pre>{error.message}</pre>
            {error.digest ? <p>Digest : {error.digest}</p> : null}
          </details>
        ) : null}
      </section>
      <p className="error-stage__note">Conex &amp; Don · site officiel</p>
    </main>
  );
}
