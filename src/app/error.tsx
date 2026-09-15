"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <div className="min-h-screen bg-ink flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <div className="text-gold mb-6" aria-hidden="true">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="display-xl text-4xl sm:text-5xl mb-4">Quelque chose a mal tourné</h1>
        <p className="text-bone/60 mb-8 leading-relaxed">
          Nous n&apos;avons pas pu charger cette page. L&apos;équipe a été notifiée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-gold px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold/90"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="border border-bone/25 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-bone transition-colors hover:border-gold hover:text-gold"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left text-xs text-bone/40">
            <summary className="cursor-pointer mb-2">Détails techniques</summary>
            <pre className="bg-bone/5 p-4 overflow-auto">{error.message}</pre>
            {error.digest && <p>Digest: {error.digest}</p>}
          </details>
        )}
      </div>
    </div>
  );
}