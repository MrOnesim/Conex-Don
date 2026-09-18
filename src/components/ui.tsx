import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

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
    <div className="grid grid-cols-1 gap-7 border-t border-bone/12 pt-6 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-12 lg:pt-8">
      <div>
        <div className="flex items-center gap-3">
          {index ? (
            <span
              className="flex h-7 min-w-7 items-center justify-center px-1 text-[10px] font-bold tabular-nums"
              style={{ backgroundColor: accent, color: "#080808" }}
            >
              {index}
            </span>
          ) : null}
          <span className="eyebrow text-bone/45">{label}</span>
        </div>
        <h2 className="display-xl mt-5 max-w-[11ch] text-[13vw] leading-[0.84] sm:text-6xl lg:text-[4.6rem]">
          <RevealWords as="span" step={55} text={title} className="block" />
        </h2>
      </div>
      {intro ? (
        <Reveal variant="wipe" className="flex items-end lg:pb-1 lg:pt-12">
          <p className="max-w-xl border-l border-bone/15 pl-5 text-[15px] leading-relaxed text-bone/70">
            {intro}
          </p>
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

/** Primary CTA with a consistent hover, press and focus response. */
export function CTA({
  href,
  children,
  tone = "solid",
  onClick,
  type = "button",
  external = false,
}: {
  href?: string;
  children: ReactNode;
  tone?: "solid" | "outline" | "gold";
  onClick?: () => void;
  type?: "button" | "submit";
  external?: boolean;
}) {
  const tones = {
    solid: "button--solid",
    outline: "button--outline",
    gold: "button--gold",
  } as const;
  const className = `button ${tones[tone]}`;
  const content = (
    <>
      <span className="button__label">{children}</span>
      <span className="button__arrow" aria-hidden="true">
        →
      </span>
    </>
  );

  if (href) {
    const isExternal =
      external ||
      href.startsWith("/api/") ||
      /^(https?:|mailto:|tel:)/.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={className}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={className}>
      {content}
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
    <ul
      className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}
      aria-label="Écouter sur les plateformes"
    >
      {streamLabels.map(({ key, label }) => {
        const href = links[key];
        if (!href) return null;
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`stream-link ${compact ? "stream-link--compact" : ""}`}
            >
              {label}
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="group border-l border-bone/15 pl-4 transition-colors duration-300 hover:border-gold">
      <p className="display-xl text-[clamp(2rem,3vw,3.5rem)] transition-colors duration-300 group-hover:text-gold sm:text-[clamp(3rem,4vw,4rem)]">
        <CountUp value={value} />
      </p>
      <p className="mt-2 max-w-[15ch] text-[clamp(0.67rem,0.8em,0.78rem)] uppercase tracking-[0.18em] text-bone/45">
        {label}
      </p>
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
    <header
      className="page-header"
      style={{ "--header-accent": accent } as CSSProperties}
    >
      {image ? (
        <div className="page-header__image" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover opacity-35 duotone"
          />
        </div>
      ) : (
        <div className="page-header__texture weave" aria-hidden="true" />
      )}
      <div className="page-header__accent" aria-hidden="true" />
      <div className="page-header__inner">
        <div className="page-header__topline">
          <Kicker>{eyebrow}</Kicker>
          <span className="page-header__edition">
            CONEX &amp; DON / OFFICIEL
          </span>
        </div>
        <h1 className="page-header__title display-xl text-[15vw] leading-[0.8] sm:text-8xl lg:text-[10rem]">
          <RevealWords as="span" step={62} text={title} className="block" />
        </h1>
        <div className="page-header__lead-wrap">
          {lead ? (
            <p className="page-header__lead">{lead}</p>
          ) : (
            <span aria-hidden="true" />
          )}
        </div>
        <div className="page-header__footer">
          <span>Archives, musique &amp; scènes</span>
          <span aria-hidden="true">↓</span>
        </div>
      </div>
    </header>
  );
}
