import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-stage">
      <div className="not-found-stage__rail" aria-hidden="true">
        <span>PAGE INTROUVABLE</span>
        <span>·</span>
        <span>REPRENDRE LE FIL</span>
      </div>
      <section
        className="not-found-stage__content"
        aria-labelledby="not-found-title"
      >
        <p className="eyebrow text-gold">Erreur 404</p>
        <p className="not-found-stage__number" aria-hidden="true">
          404
        </p>
        <h1
          id="not-found-title"
          className="display-xl relative z-10 max-w-3xl text-[clamp(3.2rem,13vw,8rem)] leading-[0.82]"
        >
          ON A PERDU
          <br />
          LA PISTE.
        </h1>
        <p className="relative z-10 mt-7 max-w-lg text-base leading-relaxed text-bone/65 sm:text-lg">
          L&apos;adresse demandée ne mène à aucune page du site. Reprenez la
          route avec la musique, l&apos;histoire ou le prochain live.
        </p>
        <div className="relative z-10 mt-9 flex flex-wrap gap-3">
          <Link href="/" className="button button--solid">
            <span className="button__label">Retour à l&apos;accueil</span>
            <span className="button__arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/musique" className="button button--outline">
            <span className="button__label">Explorer la musique</span>
            <span className="button__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </section>
      <nav className="not-found-stage__links" aria-label="Pages suggérées">
        <Link href="/histoire">Notre histoire</Link>
        <Link href="/live">Les lives</Link>
        <Link href="/search">Recherche</Link>
      </nav>
    </main>
  );
}
