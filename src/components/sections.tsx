import Image from "next/image";
import Link from "next/link";

import { ListenTrigger } from "@/components/ListenRow";
import { Reveal, RevealWords } from "@/components/Reveal";
import { CTA, Kicker, Marquee, SectionHead, Stat, StreamingLinks } from "@/components/ui";
import { awards, duo, heritage, site, stats, timeline } from "@/content/site";
import type { EventView, NewsView, ReleaseView, TrackView } from "@/lib/data";

/* ------------------------------------------------------------------- story */

export function StoryTeaser() {
  const first = timeline[0];
  return (
    <section id="histoire" className="relative border-b border-bone/10 bg-ink grain">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-28">
        <div>
          <Kicker color="text-gold">01 — L&apos;histoire</Kicker>
          <RevealWords
            text="Tout a commencé par des freestyles."
            className="display-xl mt-6 text-[10vw] leading-[0.86] sm:text-6xl lg:text-[clamp(3rem,4rem,4.5rem)]"
          />
          <Reveal delay={120} className="mt-8">
            <div className="max-w-lg space-y-4 text-[15px] leading-relaxed text-bone/70">
              <p>
                {first.body.split("\n\n")[0]}
              </p>
              <p className="text-bone/55">
                Avant les albums, il y a eu des téléphones, des cours de maison et le quotidien
                béninois filmé à hauteur d&apos;homme.
              </p>
            </div>
          </Reveal>
          <Reveal delay={200} className="mt-10">
            <CTA href="/histoire" tone="outline">
              Traverser la timeline
            </CTA>
          </Reveal>
        </div>

        <Reveal variant="mask" className="relative">
          <div className="relative flex aspect-4/5 w-full flex-col justify-between overflow-hidden border border-bone/15 bg-ink-soft grain">
            <Image
              src="/images/Don.jpeg"
              alt="Don — les premiers freestyles publiés sur TikTok en 2022"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover duotone opacity-90"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/25"
              aria-hidden="true"
            />
            <div className="absolute bottom-0 left-0 bg-ink/85 px-5 py-4">
              <p className="eyebrow text-gold">2022</p>
              <p className="mt-1 text-xs text-bone/60">TikTok · freestyles · deux amis d&apos;enfance</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- symphonie score */

export function SymphonieScore({
  release,
  tracks,
}: {
  release: ReleaseView;
  tracks: TrackView[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-bone/10 bg-ink-soft">
      <div className="dotgrid absolute inset-0 opacity-25" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <SectionHead
          index="02"
          label="2024 — premier album"
          title={release.title}
          intro={`${release.longDescription ?? release.description} Le projet est pensé comme une partition : chaque morceau est une note.`}
          accent="#6F4A32"
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:gap-14">
          <Reveal variant="mask">
            <Link
              href={`/musique/${release.slug}`}
              className="group relative block aspect-square w-full overflow-hidden border border-bone/15"
              data-cursor="Ouvrir"
            >
              <Image
                src={release.coverImage ?? "/images/SYMPHONIE-BÉNINOISE.webp"}
                alt={`Couverture — ${release.title}`}
                fill
                sizes="(max-width: 1024px) 90vw, 30vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 img-zoom"
              />
              <span className="absolute bottom-3 left-3 bg-ink/85 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-bone/70">
                {release.trackCount} pistes · {release.year}
              </span>
            </Link>
            <div className="mt-5">
              <StreamingLinks links={release.links} compact />
            </div>
            <div className="mt-6 space-y-2 border-t border-bone/12 pt-5 text-[11px] uppercase tracking-[0.16em] text-bone/45">
              <p>{release.label}</p>
              <p>{release.duration}</p>
            </div>
          </Reveal>

          <ol className="divide-y divide-bone/10 border-t border-bone/12">
            {tracks.map((track, index) => (
              <Reveal
                as="li"
                key={`${track.position}-${track.title}`}
                delay={index * 35}
                variant="wipe"
              >
                <div className="group flex items-center gap-4 py-3.5 sm:gap-6">
                  <span className="w-7 shrink-0 text-[11px] tabular-nums text-bone/35">
                    {String(track.position).padStart(2, "0")}
                  </span>
                  <span className="display-xl flex-1 text-xl transition-colors duration-300 group-hover:text-gold sm:text-3xl lg:text-4xl">
                    {track.title}
                  </span>
                  {track.featuring ? (
                    <span className="hidden text-[10px] uppercase tracking-[0.18em] text-bone/45 sm:block">
                      feat. {track.featuring}
                    </span>
                  ) : null}
                  <ListenTrigger label="Écouter" accent="#D6A83A" />
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- mode avion rail */

const modeAvionArt: Record<string, string> = {
  PERCER: "/images/PERCER.png",
  "TOR TOR": "/images/TOR-TOR.jpeg",
  PAUSE: "/images/PAUSE.png",
  VAMIDJO: "/images/VAMIDJO.png",
  "COCA COLA": "/images/MODE-AVION.jpg",
  "DI TOLOLO": "/images/Di-TOLOLO.png",
  "WOTTO WOTTO": "/images/WOTO-WOTO.png",
};

export function ModeAvionRail({
  release,
  tracks,
}: {
  release: ReleaseView;
  tracks: TrackView[];
}) {
  return (
    <section className="relative border-b border-bone/10 bg-bone text-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
          <div>
            <p className="eyebrow text-clay">03 — 24 octobre 2024</p>
            <h2 className="display-xl mt-5 text-[clamp(3rem,17vw,5rem)] leading-[0.8] sm:text-8xl lg:text-[clamp(5rem,8.5rem,7rem)]">
              MODE
              <br />
              AVION
            </h2>
          </div>
          <Reveal variant="wipe" className="lg:pt-16">
            <p className="max-w-xl text-[15px] leading-relaxed text-ink/75">
              Sept titres, un mouvement : partir, couper le monde quelques heures, puis percer.
              Classé Afrobeat / Afrosounds par les plateformes, MODE AVION est le projet le plus
              urbain du duo.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/musique/${release.slug}`}
                className="inline-block bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-bone transition-colors hover:bg-clay"
              >
                Voir le projet
              </Link>
              <StreamingLinks links={release.links} compact />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="no-scrollbar overflow-x-auto pb-16 lg:pb-24">
        <div className="flex items-stretch gap-0 px-5 sm:px-8 lg:px-12">
          {tracks.map((track, index) => (
            <div
              key={track.title}
              className="group relative flex w-[74vw] shrink-0 flex-col justify-between overflow-hidden border-l border-ink/15 px-5 py-8 transition-colors duration-500 hover:bg-ink hover:text-bone sm:w-[38vw] lg:w-[24vw]"
              data-cursor="On écoute ?"
            >
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-25"
                aria-hidden="true"
              >
                <Image
                  src={modeAvionArt[track.title] ?? "/images/MODE-AVION.jpg"}
                  alt=""
                  fill
                  sizes="24vw"
                  className="object-cover"
                />
              </div>
              <span className="relative z-10 text-[11px] tabular-nums text-ink/40 group-hover:text-bone/40">
                {String(track.position).padStart(2, "0")} / 0{tracks.length}
              </span>
              <span className="relative z-10">
                <span className="display-xl block text-3xl leading-[0.9] sm:text-5xl lg:text-6xl">
                  {track.title}
                </span>
                {track.featuring ? (
                  <span className="mt-3 block text-[10px] uppercase tracking-[0.2em] text-clay group-hover:text-gold">
                    feat. {track.featuring}
                  </span>
                ) : null}
              </span>
              <span className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink/45 group-hover:text-bone/50">
                  Mode avion — {index === 0 ? "décollage" : index === tracks.length - 1 ? "atterrissage" : "en vol"}
                </span>
                <span className="text-lg">→</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- heritage */

export function HeritageSection() {
  return (
    <section className="relative overflow-hidden border-b border-bone/10 bg-ink">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/HÉRITAGE-VIVANT.jpg"
          alt="Public et lumières de scène pendant une live expérience de Conex & Don"
          fill
          sizes="100vw"
          className="object-cover opacity-30 duotone"
        />
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <div className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:gap-20">
          <div>
            <Kicker color="text-gold">04 — Live expérience 2026</Kicker>
            <h2 className="display-xl mt-6 text-[clamp(3rem,14vw,5rem)] leading-[0.84] sm:text-7xl lg:text-[clamp(4rem,7rem,5.5rem)]">
              HÉRITAGE
              <br />
              VIVANT
            </h2>
            <blockquote className="mt-10 max-w-xl border-l-2 border-gold pl-6">
              <p
                className="text-2xl leading-tight text-bone sm:text-3xl"
                style={{ fontFamily: "var(--font-serif-display)", fontStyle: "italic" }}
              >
                « {heritage.quote} »
              </p>
            </blockquote>
            <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-bone/65">
              Quatre séquences traversent la mémoire collective, la résilience, l&apos;amour, la
              spiritualité, la vigilance et la gratitude. Le duo ne raconte plus seulement le
              quotidien : il transmet.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CTA href="/musique/heritage-vivant-live" tone="gold">
                Découvrir le projet
              </CTA>
              <a
                href="https://www.youtube.com/watch?v=oGZLv0Vc7aU"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 border border-bone/30 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors hover:border-gold hover:text-gold"
              >
                Voir la live expérience
              </a>
            </div>
          </div>

          <ol className="divide-y divide-bone/12 border-t border-bone/12">
            {heritage.sequences.map((sequence, index) => (
              <Reveal as="li" key={sequence.title} delay={index * 90} variant="wipe">
                <div className="group flex items-center gap-4 py-6 sm:gap-6">
                  {sequence.image ? (
                    <span className="relative hidden aspect-square w-16 shrink-0 overflow-hidden border border-bone/15 sm:block">
                      <Image
                        src={sequence.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover duotone transition-transform duration-700 group-hover:scale-110"
                      />
                    </span>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="display-xl text-2xl transition-colors group-hover:text-gold sm:text-4xl">
                        {sequence.title}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.22em] text-bone/40">
                        {sequence.index} · {sequence.theme}
                      </span>
                    </div>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/55">
                      {sequence.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ latest release */

export function LatestRelease({ release }: { release: ReleaseView }) {
  return (
    <section className="relative border-b border-bone/10 bg-ink-soft">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:gap-16 lg:px-12 lg:py-28">
        <Reveal variant="mask">
          <Link
            href={`/musique/${release.slug}`}
            className="group relative block aspect-square w-full overflow-hidden border border-bone/15"
            data-cursor="Ouvrir"
          >
            <Image
              src={release.coverImage ?? "/images/DESSIGUIMANZANBERA.jpg"}
              alt={`Couverture — ${release.title}`}
              fill
              sizes="(max-width: 1024px) 92vw, 42vw"
              className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-ink/15" />
            <span className="absolute right-3 top-3 bg-clay px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-bone">
              Nouvelle sortie
            </span>
          </Link>
        </Reveal>

        <div>
          <Kicker color="text-clay">05 — 7 mai 2026 · 3:09</Kicker>
          <h2 className="display-xl mt-5 text-[clamp(2rem,11vw,3.5rem)] leading-[0.84] sm:text-6xl lg:text-[clamp(3rem,5.4rem,4.5rem)]">
            {release.title}
          </h2>
          <p className="mt-5 text-sm uppercase tracking-[0.2em] text-bone/55">{release.tagline}</p>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-bone/70">
            {release.longDescription ?? release.description}
          </p>
          <div className="mt-8">
            <StreamingLinks links={release.links} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <CTA href={`/musique/${release.slug}`} tone="solid">
              Fiche complète
            </CTA>
            <ListenTrigger
              label="Écouter"
              accent="#D6A83A"
              className="border border-bone/25 px-5 py-3"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- duo */

export function DuoSection() {
  return (
    <section className="relative border-b border-bone/10 bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <SectionHead
          index="06"
          label="Conex / Don"
          title="Deux esprits"
          intro="Conex apporte la douceur mélodique. Don, des flows plus directs et virulents. Ensemble, ils utilisent l'humour, le langage populaire et l'observation du quotidien pour raconter des réalités béninoises."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {[duo.conex, duo.don].map((member, index) => (
            <Reveal key={member.name} delay={index * 120} variant="rise">
              <article className="group flex h-full flex-col border border-bone/12">
                <div className="relative aspect-4/5 w-full overflow-hidden bg-ink-soft grain">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={`${member.name} — ${member.fullName}`}
                      fill
                      sizes="(max-width: 1024px) 92vw, 45vw"
                      className="object-cover duotone transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 img-zoom"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                      <span
                        className="display-xl text-[clamp(5rem,9rem,6rem)] leading-none opacity-25"
                        style={{ color: member.accent }}
                      >
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1"
                    style={{ backgroundColor: member.accent }}
                  />
                  <span
                    className="absolute left-4 top-4 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em]"
                    style={{ backgroundColor: member.accent, color: "#F5F2EA" }}
                  >
                    {member.role}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <p className="eyebrow text-bone/40">{member.origin}</p>
                  <h3 className="display-xl mt-3 text-5xl sm:text-6xl">{member.name}</h3>
                  <p className="mt-2 text-sm text-bone/50">{member.fullName}</p>
                  <p className="mt-5 flex-1 text-[15px] leading-relaxed text-bone/70">
                    {member.bio}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {member.style.map((tag) => (
                      <li
                        key={tag}
                        className="border border-bone/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-bone/60"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 border-t border-bone/12 pt-10 text-center">
          <p className="display-xl text-[9vw] leading-[0.9] sm:text-6xl lg:text-8xl">
            TWO MINDS. <span className="text-gold">ONE SOUND.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ stats */

export function StatsBand() {
  return (
    <section className="border-b border-bone/10 bg-ink-soft">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-8 px-5 py-14 sm:px-8 lg:grid-cols-4 lg:px-12 lg:py-20">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 80}>
            <Stat value={stat.value} label={stat.label} />
          </Reveal>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 border-t border-bone/12 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        {awards.map((award) => (
          <p key={award.title} className="text-sm text-bone/60">
            <span className="text-gold">{award.year}</span> — {award.title} ·{" "}
            <span className="text-bone/80">{award.detail}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- live */

export function LiveBanner({ events }: { events: EventView[] }) {
  const upcoming = events.filter((event) => event.status === "upcoming");
  const archives = events.filter((event) => event.status !== "upcoming").slice(0, 3);
  const hero = upcoming[0] ?? archives[0];

  if (!hero) return null;

  return (
    <section className="relative border-b border-bone/10 bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 eyebrow text-gold">
            <span className="live-dot block h-2 w-2 rounded-full bg-clay" />
            07 — Live
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] lg:gap-16">
          <div>
            <h2 className="display-xl text-[clamp(2rem,12vw,4rem)] leading-[0.84] sm:text-6xl lg:text-[clamp(3rem,6rem,4.5rem)]">
              {hero.title}
            </h2>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-bone/12 pt-6 sm:grid-cols-4">
              {[
                { label: "Date", value: hero.eventDate ?? "À annoncer" },
                { label: "Ville", value: hero.city ?? "Bénin" },
                { label: "Pays", value: hero.country ?? "Bénin" },
                { label: "Lieu", value: hero.venue ?? "—" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="eyebrow text-bone/40">{item.label}</dt>
                  <dd className="mt-2 text-sm text-bone/85">{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-bone/65">{hero.note}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CTA href="/live" tone="solid">
                Page live
              </CTA>
              <CTA href="/aloba" tone="outline">
                Rejoindre ALOBA
              </CTA>
            </div>
          </div>

          <div className="border-t border-bone/12 pt-6">
            <p className="eyebrow text-bone/40">Archives live</p>
            <ul className="mt-5 space-y-5">
              {archives.map((event) => (
                <li key={event.title} className="border-l border-bone/15 pl-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-bone/40">
                    {event.eventDate}
                  </p>
                  <p className="mt-1 text-sm uppercase tracking-[0.06em] text-bone/85">
                    {event.title}
                  </p>
                  <p className="mt-1 text-xs text-bone/45">
                    {event.city} · {event.country}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- news */

export function NewsGrid({ posts, limit }: { posts: NewsView[]; limit?: number }) {
  const list = typeof limit === "number" ? posts.slice(0, limit) : posts;
  return (
    <section className="border-b border-bone/10 bg-ink-soft">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <SectionHead
          index="08"
          label="Newsroom"
          title="Actualités"
          intro="Sorties, concerts, presse, annonces et coulisses. La newsroom centrale du duo."
        />
        <ul className="mt-14 grid grid-cols-1 gap-px border border-bone/12 bg-bone/12 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((post, index) => (
            <Reveal as="li" key={post.slug} delay={index * 60} className="bg-ink">
              <Link
                href={`/press/${post.slug}`}
                className="group flex h-full flex-col justify-between p-6 transition-colors duration-500 hover:bg-bone hover:text-ink sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold">
                      {post.category}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-bone/40 group-hover:text-ink/50">
                      {post.publishedAt}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl leading-tight normal-case tracking-normal sm:text-2xl">
                    {post.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-bone/60 group-hover:text-ink/70">
                    {post.excerpt}
                  </p>
                </div>
                <span className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-bone/45 group-hover:text-clay">
                  Lire <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
        <div className="mt-10">
          <CTA href="/press" tone="outline">
            Toute la newsroom
          </CTA>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- booking cta */

export function BookingCta() {
  return (
    <section className="relative overflow-hidden bg-clay">
      <div className="weave absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] lg:gap-16">
          <div>
            <p className="eyebrow text-bone/70">09 — Professionnels</p>
            <h2 className="display-xl mt-5 text-[14vw] leading-[0.84] text-bone sm:text-7xl lg:text-[7rem]">
              BOOK CONEX &amp; DON
            </h2>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-bone/80">
              Concerts, festivals, showcases, activations de marque, partenariats et médias.
              Envoyez les détails de votre projet : date, ville, capacité, type d&apos;événement.
            </p>
          </div>
          <div className="flex flex-col justify-end gap-5">
            <a
              href={`mailto:${site.contact.bookingEmail}`}
              className="block border-b border-bone/40 pb-3 text-lg text-bone"
              data-cursor="Écrire"
            >
              {site.contact.bookingEmail}
            </a>
            <a
              href={`tel:${site.contact.bookingPhone.replace(/\s/g, "")}`}
              className="block border-b border-bone/40 pb-3 text-lg text-bone"
            >
              {site.contact.bookingPhone}
            </a>
            <div className="mt-2">
              <CTA href="/booking" tone="solid">
                Envoyer une demande
              </CTA>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarqueeBand() {
  return (
    <div className="border-y border-bone/12 bg-ink py-5">
      <Marquee
        items={[
          "AFROBEAT",
          "AMAPIANO",
          "RAP",
          "HUMOUR",
          "CULTURE BÉNINOISE",
          "STORYTELLING",
          "RÉALITÉ",
          "HÉRITAGE",
        ]}
        className="display-xl text-3xl text-bone/25 sm:text-5xl"
        separator="·"
      />
    </div>
  );
}
