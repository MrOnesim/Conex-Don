import type { Metadata } from "next";
import { OptimizedImage } from "@/components/OptimizedImage";
import { CTA, PageHeader } from "@/components/ui";
import {
  awards,
  biography,
  duo,
  socials,
  stats,
  technicalRider,
} from "@/content/site";
import { getEvents, getNews, getReleases, getVideos } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Press / EPK — dossier de presse",
  description:
    "EPK Conex & Don : biographie courte et longue, photos HD, discographie, vidéographie, statistiques, distinctions, fiche technique et contacts management / booking.",
  alternates: { canonical: "/epk" },
  openGraph: {
    title: "Dossier de Presse & EPK — CONEX & DON",
    description:
      "Dossier de presse complet, photos HD, discographie, distinction et contacts booking du duo Conex & Don.",
    images: [
      {
        url: "/api/og?title=DOSSIER%20DE%20PRESSE%20%2F%20EPK&description=Kit%20m%C3%A9dia%2C%20biographie%20officielle%20et%20ressources%20presse&type=article",
        width: 1200,
        height: 630,
        alt: "EPK — Conex & Don",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dossier de Presse & EPK — CONEX & DON",
    images: [
      "/api/og?title=DOSSIER%20DE%20PRESSE%20%2F%20EPK&description=Kit%20m%C3%A9dia%2C%20biographie%20officielle%20et%20ressources%20presse&type=article",
    ],
  },
};

const photos = [
  {
    src: "/images/HÉRITAGE-VIVANT.jpg",
    label: "HÉRITAGE VIVANT — visuel (carré)",
  },
  {
    src: "/images/DESSIGUIMANZANBERA.png",
    label: "DESSIGUIMANZANBERA — visuel (carré)",
  },
  { src: "/images/MODE-AVION.jpg", label: "MODE AVION — visuel (carré)" },
  {
    src: "/images/SYMPHONIE-BÉNINOISE.webp",
    label: "LA SYMPHONIE BÉNINOISE — visuel (carré)",
  },
  { src: "/images/Découverte.jpg", label: "DÉCOUVERTE — visuel (carré)" },
  { src: "/images/Tchiza.jpg", label: "TCHIZA — visuel (carré)" },
  { src: "/images/AKA.jpg", label: "AKA — visuel (carré)" },
  { src: "/images/MINKA-NANGBE.jpeg", label: "MINKANANGBÈ — visuel (carré)" },
  { src: "/images/TOR-TOR.jpeg", label: "TOR TOR — visuel (carré)" },
  { src: "/images/PERCER.png", label: "PERCER — visuel (carré)" },
  { src: "/images/PAUSE.png", label: "PAUSE — visuel (carré)" },
  { src: "/images/VAMIDJO.png", label: "VAMIDJO — visuel (carré)" },
  { src: "/images/Di-TOLOLO.png", label: "DI TOLOLO — visuel (carré)" },
  { src: "/images/WOTO-WOTO.png", label: "WOTTO WOTTO — visuel (carré)" },
  { src: "/images/MEDLEY.png", label: "HÉRITAGE VIVANT — Medley" },
  { src: "/images/AGADO.png", label: "HÉRITAGE VIVANT — Djo Agado" },
  { src: "/images/Djivèdé.png", label: "HÉRITAGE VIVANT — Djivèdé" },
  { src: "/images/Mi-ze-gan-gospel.png", label: "HÉRITAGE VIVANT — Gospel" },
  { src: "/images/AGBON.png", label: "AGBON — visuel (carré)" },
  { src: "/images/AYATO.png", label: "AYATO — visuel (carré)" },
  { src: "/images/MAN-LON-ô.png", label: "MAN LON Ô — visuel (carré)" },
];

export default async function EpkPage() {
  const [releases, videos, events, news] = await Promise.all([
    getReleases(),
    getVideos(),
    getEvents(),
    getNews(),
  ]);

  const pressMentions = news.filter((post) => post.source);

  return (
    <>
      <PageHeader
        eyebrow="Electronic Press Kit"
        title="PRESS / EPK"
        lead="Dossier de presse numérique de Conex & Don. Tout ce dont un programmateur, un journaliste ou un partenaire a besoin, au même endroit."
        accent="#D6A83A"
      />

      <section
        className="route-section route-section--soft"
        aria-label="Actions Press Kit"
      >
        <div className="route-frame route-frame--compact flex flex-wrap items-center gap-3">
          <a href="/api/epk" className="button button--solid">
            <span className="button__label">Télécharger le press kit (PDF)</span>
            <span className="button__arrow" aria-hidden="true">↓</span>
          </a>
          <CTA href="mailto:booking.conexetdon@gmail.com" tone="outline">
            Contacter le management
          </CTA>
          <nav
            className="epk-index ml-0 flex flex-wrap gap-x-4 gap-y-2 lg:ml-auto"
            aria-label="Sommaire EPK"
          >
            <a href="#epk-bio">Bio</a>
            <a href="#epk-photos">Photos</a>
            <a href="#epk-catalogue">Catalogue</a>
            <a href="#epk-reperes">Repères</a>
            <a href="#epk-rider">Rider</a>
          </nav>
        </div>
      </section>

      <section id="epk-bio" className="route-section">
        <div className="route-frame grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow text-bone/40">01 — Biographie courte</p>
            <p className="mt-5 text-[15px] leading-relaxed text-bone/80">
              {biography.short}
            </p>
          </div>
          <div>
            <p className="eyebrow text-bone/40">02 — Identité</p>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                { label: "Formation", value: "Conex & Don — duo, depuis 2022" },
                {
                  label: "Conex",
                  value: `${duo.conex.fullName} — ${duo.conex.origin}`,
                },
                {
                  label: "Don",
                  value: `${duo.don.fullName} — ${duo.don.origin}`,
                },
                {
                  label: "Genres",
                  value: "Afrobeat · Afropop · Amapiano · Rap",
                },
                {
                  label: "Langues",
                  value: "Français, fongbé et langues locales du Bénin",
                },
                { label: "Base", value: "Bénin" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between gap-6 border-b border-bone/10 pb-3"
                >
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-bone/40">
                    {item.label}
                  </dt>
                  <dd className="max-w-[62%] text-right text-bone/80">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-2">
            <p className="eyebrow text-bone/40">03 — Biographie longue</p>
            <div className="mt-6 max-w-4xl space-y-5 text-[15px] leading-[1.75] text-bone/75">
              {biography.long.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="epk-photos" className="route-section route-section--soft">
        <div className="route-frame">
          <p className="eyebrow text-bone/40">
            04 — Photos HD (usage presse, crédit obligatoire)
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-px border border-bone/12 bg-bone/12 lg:grid-cols-4">
            {photos.map((photo) => (
              <li key={photo.src} className="editorial-row bg-ink">
                <div className="relative aspect-4/5 w-full overflow-hidden">
                  <OptimizedImage
                    src={photo.src}
                    alt={photo.label}
                    fill
                    accent="#D6A83A"
                    sizes="(max-width: 640px) 46vw, 24vw"
                    className="h-full w-full"
                    imageClassName="object-cover duotone"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[11px] leading-snug text-bone/70">
                    {photo.label}
                  </p>
                  <a
                    href={photo.src}
                    download
                    className="mt-3 inline-block border-b border-bone/30 pb-1 text-[9px] uppercase tracking-[0.2em] text-bone/50 transition-colors hover:border-gold hover:text-gold"
                  >
                    Télécharger
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-bone/40">
            Crédit photo : « Conex &amp; Don — visuels d&apos;illustration du
            site officiel ».
          </p>
        </div>
      </section>

      <section id="epk-catalogue" className="route-section">
        <div className="route-frame grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow text-bone/40">05 — Discographie</p>
            <ul className="editorial-list mt-6">
              {releases.map((release) => (
                <li
                  key={release.slug}
                  className="editorial-row flex items-baseline justify-between gap-4 py-3"
                >
                  <span className="display-xl text-lg sm:text-xl">
                    {release.title}
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-bone/45">
                    {release.year} · {release.kind} · {release.trackCount}{" "}
                    titres
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-bone/40">
              06 — Vidéographie (sélection)
            </p>
            <ul className="editorial-list mt-6">
              {videos.slice(0, 12).map((video) => (
                <li
                  key={video.slug}
                  className="editorial-row flex items-baseline justify-between gap-4 py-3"
                >
                  <span className="display-xl text-lg sm:text-xl">
                    {video.title}
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-bone/45">
                    {video.year} · {video.category}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="epk-reperes" className="route-section route-section--soft">
        <div className="route-frame">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div>
              <p className="eyebrow text-bone/40">07 — Statistiques</p>
              <ul className="mt-6 space-y-5">
                {stats.map((stat) => (
                  <li key={stat.label} className="border-l border-bone/15 pl-4">
                    <p className="display-xl text-3xl">{stat.value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-bone/45">
                      {stat.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-bone/40">08 — Distinctions</p>
              <ul className="mt-6 space-y-5">
                {awards.map((award) => (
                  <li key={award.title} className="border-l border-gold pl-4">
                    <p className="display-xl text-2xl">{award.title}</p>
                    <p className="mt-1 text-sm text-bone/70">{award.detail}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-bone/40">
                      {award.year}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-bone/40">09 — Concerts &amp; live</p>
              <ul className="mt-6 space-y-5">
                {events.map((event) => (
                  <li
                    key={event.title}
                    className="border-l border-bone/15 pl-4"
                  >
                    <p className="text-sm uppercase tracking-[0.08em] text-bone/85">
                      {event.title}
                    </p>
                    <p className="mt-1 text-[11px] text-bone/50">
                      {event.eventDate} · {event.city} · {event.country}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="epk-rider" className="route-section">
        <div className="route-frame grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow text-bone/40">
              10 — Fiche technique / rider (indicatif)
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-bone/70">
              {technicalRider.map((item) => (
                <li key={item} className="border-b border-bone/10 pb-3">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-bone/40">
              Fiche technique détaillée transmise par l&apos;équipe technique
              lors de la confirmation.
            </p>
          </div>
          <div>
            <p className="eyebrow text-bone/40">11 — Presse &amp; contacts</p>
            <ul className="mt-6 space-y-4">
              {pressMentions.map((post) => (
                <li key={post.slug} className="border-b border-bone/10 pb-3">
                  <a
                    href={post.sourceUrl ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-bone/85 transition-colors hover:text-gold"
                  >
                    {post.title}
                  </a>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-bone/40">
                    {post.source} · {post.publishedAt}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8 border border-bone/12 p-6">
              <p className="eyebrow text-bone/40">Management / booking</p>
              <a
                href="mailto:booking.conexetdon@gmail.com"
                className="mt-3 block break-all text-gold"
              >
                booking.conexetdon@gmail.com
              </a>
              <p className="mt-2 text-sm text-bone/70">+229 01 96 19 98 70</p>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] uppercase tracking-[0.18em] text-bone/50 hover:text-gold"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
