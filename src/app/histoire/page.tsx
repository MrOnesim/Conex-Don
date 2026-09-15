import type { Metadata } from "next";

import { Reveal, RevealWords } from "@/components/Reveal";
import { Timeline } from "@/components/Timeline";
import { DuoSection, StatsBand } from "@/components/sections";
import { CTA, Kicker, PageHeader } from "@/components/ui";
import { biography, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Histoire — 2022 · 2023 · 2024 · 2025 · 2026",
  description:
    "L'histoire de Conex & Don : les freestyles TikTok de 2022, l'EP Découverte, La Symphonie Béninoise, Mode Avion, les singles 2025, Héritage Vivant et DESSIGUIMANZANBERA.",
  alternates: { canonical: "/histoire" },
};

export default function StoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="L'héritage en mouvement"
        title="HISTOIRE"
        lead={`${site.tagline} Deux amis d'enfance originaires de Ouidah et d'Avédji, devenus l'un des duos les plus reconnaissables de la nouvelle scène musicale béninoise.`}
      />

      <section className="border-b border-bone/10 bg-ink">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <RevealWords
            text="Tout a commencé par des freestyles."
            className="display-xl max-w-5xl text-[12vw] leading-[0.86] sm:text-7xl lg:text-[6.5rem]"
          />
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:gap-20">
            <Reveal variant="wipe">
              <p className="text-[15px] leading-relaxed text-bone/70">{biography.short}</p>
              <div className="mt-8">
                <CTA href="/epk" tone="outline">
                  Biographie complète (EPK)
                </CTA>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="border-l border-gold pl-6">
                <Kicker>Les piliers</Kicker>
                <ul className="mt-5 space-y-4">
                  {[
                    {
                      title: "Le Bénin",
                      body: "Ouidah, Avédji, Dogbo. Un pays, des langues, des textures — jamais un cliché africain générique.",
                    },
                    {
                      title: "L'humour",
                      body: "Une signature. Le rire comme manière de dire des choses sérieuses.",
                    },
                    {
                      title: "Le réel",
                      body: "Le quotidien béninois, observé à hauteur d'homme.",
                    },
                    {
                      title: "La transmission",
                      body: "Depuis Héritage Vivant : être la continuité d'une histoire, pas seulement son héritier.",
                    },
                  ].map((item) => (
                    <li key={item.title}>
                      <p className="display-xl text-2xl">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-bone/60">{item.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-bone/10 bg-ink-soft">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6 border-b border-bone/12 pb-6">
            <h2 className="display-xl text-[12vw] leading-[0.86] sm:text-6xl lg:text-7xl">
              LA TIMELINE
            </h2>
            <p className="max-w-sm text-sm text-bone/55">
              De 2022 à 2026 : chaque année est une scène. Faites défiler pour traverser leur
              carrière.
            </p>
          </div>
          <Timeline />
        </div>
      </section>

      <DuoSection index="02" />
      <StatsBand />
    </>
  );
}
