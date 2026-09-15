import Link from "next/link";
import type { ReactNode } from "react";

import { CountUp } from "@/components/CountUp";
import { Reveal, RevealWords } from "@/components/Reveal";
import type { StreamLinks } from "@/content/music";

export function Kicker({
  children,
  color = "text-gold",
}: {
  children: ReactNode;
  color?: string;
}) {
  return <p className={`eyebrow ${color}`}>{children}</p>;
}

export function SectionHead({
  index,
  label,
  title,
  intro,
  accent = "#D6A83A",
}: {
  index?: string;
  label: string;
  title: string;
  intro?: string;
  accent?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
      <div>
        <div className="flex items-center gap-4">
          {index ? (
            <span
              className="flex h-8 w-8 items-center justify-center text-[11px] font-semibold tabular-nums"
              style={{ backgroundColor: accent, color: "#080808" }}
            >
              {index}
            </span>
          ) : null}
          <span className="eyebrow text-bone/45">{label}</span>
        </div>
        <h2 className="display-xl mt-5 text-[13vw] leading-[0.84] sm:text-6xl lg:text-[4.6rem]">
          <RevealWords as="span" step={60} text={title} className="block" />
        </h2>
      </div>
      {intro ? (
        <Reveal variant="wipe" className="lg:pt-14">
          <p className="max-w-xl text-[15px] leading-relaxed text-bone/70">{intro}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

export function Marquee({
  items,
  reverse = false,
  slow = false,
  className = "",
  separator = "◦",
}: {
  items: string[];
  reverse?: boolean;
  slow?: boolean;
  className?: string;
  separator?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={`marquee overflow-hidden ${className}`} aria-hidden="true">
      <div
        className={`marquee-track ${slow ? "marquee-track--slow" : ""} ${
          reverse ? "marquee-track--reverse" : ""
        }`}
      >
        {row.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-6 whitespace-nowrap px-6"
          >
            <span>{item}</span>
            <span className="text-gold">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function CTA({
  href,
  children,
  tone = "solid",
  onClick,
  type = "button",
}: {
  href?: string;
  children: ReactNode;
  tone?: "solid" | "outline" | "gold";
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-3 overflow-hidden px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 button-hover";
  const tones = {
    solid: "bg-bone text-ink hover:bg-gold",
    outline: "border border-bone/30 text-bone hover:border-gold hover:text-gold",
    gold: "bg-gold text-ink hover:bg-bone",
  } as const;
  const cls = `${base} ${tones[tone]}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
        <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
      <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
    </button>
  );
}

const streamLabels: Array<{ key: keyof StreamLinks; label: string }> = [
  { key: "spotify", label: "Spotify" },
  { key: "apple", label: "Apple Music" },
  { key: "audiomack", label: "Audiomack" },
  { key: "youtube", label: "YouTube" },
  { key: "deezer", label: "Deezer" },
  { key: "amazon", label: "Amazon Music" },
];

export function StreamingLinks({
  links,
  compact = false,
}: {
  links: StreamLinks;
  compact?: boolean;
}) {
  return (
    <ul className={`flex flex-wrap ${compact ? "gap-2" : "gap-2.5"}`}>
      {streamLabels.map(({ key, label }) => {
        const href = links[key];
        if (!href) return null;
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`inline-block border border-bone/20 uppercase tracking-[0.16em] transition-colors duration-300 hover:border-gold hover:text-gold ${
                compact
                  ? "px-2.5 py-1 text-[9px]"
                  : "px-3.5 py-2 text-[10px] tracking-[0.2em]"
              }`}
            >
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-bone/15 pl-4">
      <p className="display-xl text-[clamp(2rem,3vw,3.5rem)] sm:text-[clamp(3rem,4vw,4rem)]">
        <CountUp value={value} />
      </p>
      <p className="mt-2 text-[clamp(0.75rem,0.8em,0.875rem)] uppercase tracking-[0.2em] text-bone/45">{label}</p>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  image,
  accent = "#6F4A32",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  image?: string;
  accent?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-bone/10 pt-32 sm:pt-40">
      {image ? (
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover opacity-25 duotone"
            aria-hidden="true"
          />
        </div>
      ) : (
        <div className="weave absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      )}
      <div
        className="absolute inset-x-0 top-0 -z-10 h-1"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-[1600px] px-5 pb-12 sm:px-8 lg:px-12">
        <Kicker>{eyebrow}</Kicker>
        <h1 className="display-xl mt-5 text-[15vw] leading-[0.8] sm:text-8xl lg:text-[10rem]">
          <RevealWords as="span" step={70} text={title} className="block" />
        </h1>
        {lead ? (
          <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-bone/70 sm:text-base">
            {lead}
          </p>
        ) : null}
      </div>
    </header>
  );
}
