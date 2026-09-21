import Link from "next/link";

import { Hero, HeroCanvas } from "@/components/Hero";
import { ListenTrigger } from "@/components/ListenRow";
import { Reveal, RevealWords } from "@/components/Reveal";
import { ReleaseGrid } from "@/components/ReleaseGrid";
import {
  BookingCta,
  DuoSection,
  HeritageSection,
  LatestRelease,
  LiveBanner,
  MarqueeBand,
  ModeAvionRail,
  NewsGrid,
  StatsBand,
  StoryTeaser,
  SymphonieScore,
} from "@/components/sections";
import { CTA, Kicker, SectionHead } from "@/components/ui";
import { VideoWall } from "@/components/VideoWall";
import {
  getEvents,
  getNews,
  getRelease,
  getReleases,
  getVideos,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [releases, videos, events, news, symphonie, modeAvion, latest] = await Promise.all([
    getReleases(),
    getVideos(),
    getEvents(),
    getNews(),
    getRelease("la-symphonie-beninoise"),
    getRelease("mode-avion"),
    getRelease("dessiguimanzanbera"),
  ]);

  const latestRelease = latest?.release ?? releases[0];

  return (
    <>
      <HeroCanvas />
      <Hero />
      <MarqueeBand />
      <StoryTeaser />

      {symphonie ? (
        <SymphonieScore release={symphonie.release} tracks={symphonie.tracks} />
      ) : null}

      {modeAvion ? (
        <ModeAvionRail release={modeAvion.release} tracks={modeAvion.tracks} />
      ) : null}

      <HeritageSection />
      <LatestRelease release={latestRelease} />

      <section id="musique" className="border-b border-bone/10 bg-ink">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <SectionHead
            index="06"
            label="Discographie"
            title="Musique"
            intro="Albums, EP, singles et projets live. Chaque sortie possÃ¨de sa fiche complÃ¨te : tracklist, crÃ©dits, liens de streaming."
          />
          <div className="mt-12">
            <ReleaseGrid releases={releases} />
          </div>
        </div>
      </section>

      <section className="border-b border-bone/10 bg-ink-soft">
        <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <SectionHead
            index="07"
            label="VidÃ©ographie"
            title="Clips"
            intro="Clips officiels, visualizers et captations live. Cliquez pour ouvrir le lecteur."
          />
          <div className="mt-12">
            <VideoWall videos={videos} limit={6} />
          </div>
          <div className="mt-10">
            <CTA href="/videos" tone="outline">
              Toute la vidÃ©ographie
            </CTA>
          </div>
        </div>
      </section>

      <DuoSection index="08" />
      <StatsBand />

      <section className="relative overflow-hidden border-b border-bone/10 bg-ink">
        <div className="dotgrid absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:gap-16">
            <div>
              <Kicker color="text-gold">09 â€” La communautÃ©</Kicker>
              <h2 className="type-photo display-xl mt-6 text-[clamp(3rem,16vw,4.5rem)] leading-[0.82] sm:text-[clamp(4rem,10vw,5.5rem)] lg:text-[clamp(4.5rem,8vw,7rem)]">
                ALOBA
              </h2>
              <RevealWords
                text="Ceux qui Ã©coutent depuis les freestyles de 2022."
                className="mt-7 max-w-lg text-lg text-bone/75"
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <CTA href="/aloba" tone="solid">
                  Entrer dans ALOBA
                </CTA>
                <ListenTrigger
                  label="Ã‰couter"
                  className="border border-bone/25 px-5 py-3"
                />
              </div>
            </div>
            <Reveal delay={120}>
              <ul className="divide-y divide-bone/12 border-t border-bone/12">
                {[
                  {
                    title: "Le mur des fans",
                    body: "Photos, vidÃ©os, messages et hashtags de la communautÃ©, publiÃ©s depuis le site.",
                  },
                  {
                    title: "Les Ã©vÃ©nements",
                    body: "Concours, rassemblements et avant-premiÃ¨res rÃ©servÃ©s Ã  la liste ALOBA.",
                  },
                  {
                    title: "Les contenus exclusifs",
                    body: "Coulisses, versions live et annonces envoyÃ©es en premier aux abonnÃ©s.",
                  },
                ].map((item) => (
                  <li key={item.title} className="py-5">
                    <p className="display-xl text-2xl sm:text-3xl">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-bone/60">{item.body}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <LiveBanner events={events} index="10" />
      <NewsGrid posts={news} limit={3} index="11" />

      <section className="border-b border-bone/10 bg-bone text-ink">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <p className="display-xl text-[clamp(3rem,10vw,6rem)] leading-[0.9] sm:text-[clamp(4rem,5vw,5rem)] lg:text-[clamp(5rem,4rem,6rem)]">
            L&apos;histoire <span className="text-clay">continue.</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/histoire"
              className="bg-ink px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-bone transition-colors hover:bg-clay"
            >
              Revoir la timeline
            </Link>
            <Link
              href="/epk"
              className="border border-ink/25 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors hover:border-clay hover:text-clay"
            >
              Press kit
            </Link>
          </div>
        </div>
      </section>

      <BookingCta index="12" />
    </>
  );
}
