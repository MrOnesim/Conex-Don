import Link from "next/link";

import { ListenTrigger } from "@/components/ListenRow";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pt-24 sm:px-8 lg:px-12">
      <div className="weave absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="aurora absolute inset-0" aria-hidden="true" />
      <span
        className="outline-giant pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[60vw] leading-none sm:text-[34vw]"
        aria-hidden="true"
      >
        404
      </span>
      <div className="relative mx-auto w-full max-w-[1600px]">
        <p className="eyebrow text-clay">Erreur 404</p>
        <h1 className="display-xl mt-5 text-[22vw] leading-[0.82] sm:text-[12rem]">
          HÉ ?
        </h1>
        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-bone/70">
          Cette page n&apos;existe pas — ou plus. Retournez à l&apos;accueil, ou lancez un titre du
          duo pendant que vous cherchez.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="shine bg-bone px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold"
          >
            Retour à l&apos;accueil
          </Link>
          <ListenTrigger
            label="Écouter"
            className="border border-bone/25 px-5 py-4"
          />
        </div>
      </div>
    </section>
  );
}
