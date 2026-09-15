import Image from "next/image";
import Link from "next/link";

import { Reveal, RevealWords } from "@/components/Reveal";
import { timeline } from "@/content/site";

export function Timeline() {
  return (
    <div className="relative">
      <div
        className="absolute left-0 top-0 hidden h-full w-px bg-bone/12 lg:block"
        aria-hidden="true"
      />
      <ol className="space-y-16 lg:space-y-28">
        {timeline.map((entry, index) => (
          <li key={`${entry.year}-${entry.title}`} id={entry.year} className="relative lg:pl-16">
            <span
              className="absolute -left-[7px] top-3 hidden h-3.5 w-3.5 border-2 border-ink bg-gold lg:block"
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-14">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Reveal variant="wipe">
                  <p className="display-xl text-6xl text-bone/25 sm:text-7xl lg:text-8xl">
                    {entry.year}
                  </p>
                  <p className="eyebrow mt-3 text-gold">{entry.kicker}</p>
                </Reveal>
                {entry.image ? (
                  <Reveal variant="mask" delay={100} className="mt-7 hidden lg:block">
                    <div className="relative aspect-4/5 w-full overflow-hidden border border-bone/15">
                      <Image
                        src={entry.image}
                        alt={`${entry.title} — ${entry.year}`}
                        fill
                        sizes="35vw"
                        className="object-cover duotone"
                      />
                      <div className="absolute inset-0 bg-ink/20" />
                    </div>
                  </Reveal>
                ) : null}
              </div>

              <div>
                <RevealWords
                  text={entry.title}
                  className="display-xl text-[9vw] leading-[0.88] sm:text-5xl lg:text-[3.6rem]"
                />
                <Reveal delay={100} className="mt-6">
                  <p className="max-w-xl text-[15px] leading-relaxed text-bone/70">
                    {entry.body}
                  </p>
                </Reveal>
                <Reveal delay={180} className="mt-7">
                  <ul className="flex flex-wrap gap-2">
                    {entry.highlights.map((item) => (
                      <li
                        key={item}
                        className="border border-bone/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-bone/60"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                {entry.releaseSlug ? (
                  <Reveal delay={220} className="mt-8">
                    <Link
                      href={`/musique/${entry.releaseSlug}`}
                      className="group inline-flex items-center gap-3 border-b border-bone/30 pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors hover:border-gold hover:text-gold"
                    >
                      Voir le projet
                      <span className="transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </Reveal>
                ) : null}
                {entry.image ? (
                  <Reveal variant="mask" delay={120} className="mt-8 lg:hidden">
                    <div className="relative aspect-16/10 w-full overflow-hidden border border-bone/15">
                      <Image
                        src={entry.image}
                        alt={`${entry.title} — ${entry.year}`}
                        fill
                        sizes="92vw"
                        className="object-cover duotone"
                      />
                    </div>
                  </Reveal>
                ) : null}
                <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-bone/25">
                  {String(index + 1).padStart(2, "0")} / {String(timeline.length).padStart(2, "0")}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
