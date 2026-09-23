"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { OptimizedImage } from "@/components/OptimizedImage";
import { StreamingLinks } from "@/components/ui";
import type { ReleaseView } from "@/lib/data";

const filters = [
  { key: "all", label: "Tous" },
  { key: "album", label: "Albums" },
  { key: "ep", label: "EP" },
  { key: "single", label: "Singles" },
  { key: "live", label: "Live" },
] as const;

const kindLabel: Record<string, string> = {
  album: "Album",
  ep: "EP",
  single: "Single",
  live: "Live",
};

export function ReleaseGrid({ releases }: { releases: ReleaseView[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");

  const visible = useMemo(
    () => (filter === "all" ? releases : releases.filter((release) => release.kind === filter)),
    [filter, releases],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-y border-bone/12 py-4">
        {filters.map((item) => {
          const active = filter === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              aria-pressed={active}
              className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 ${
                active
                  ? "bg-gold text-ink shadow-[0_8px_24px_-8px_rgba(214,168,58,0.7)]"
                  : "border border-bone/20 text-bone/60 hover:-translate-y-px hover:border-gold hover:text-gold"
              }`}
            >
              {item.label}
            </button>
          );
        })}
        <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-bone/35">
          {visible.length} projet{visible.length > 1 ? "s" : ""}
        </span>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-px border border-bone/12 bg-bone/12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((release) => (
          <li key={release.slug} className="bg-ink">
            <Link
              href={`/musique/${release.slug}`}
              className="corner-hover-gold group flex h-full flex-col"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                {release.coverImage ? (
                  <OptimizedImage
                    src={release.coverImage}
                    alt={`Couverture — ${release.title}`}
                    fill
                    accent={release.accent}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                    className="h-full w-full"
                    imageClassName="object-cover duotone transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0 group-hover:translate-y-[-4px] group-hover:shadow-[0_-12px_32px_rgba(0,0,0,0.4)]"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-end p-6"
                    style={{ backgroundColor: release.accent }}
                  >
                    <span className="display-xl text-[13vw] leading-[0.8] text-bone/90 sm:text-5xl lg:text-6xl">
                      {release.title}
                    </span>
                  </div>
                )}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <span className="flex translate-y-3 items-center gap-3 border border-gold/60 bg-ink/60 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-bone backdrop-blur-md transition-transform duration-500 group-hover:translate-y-0">
                    Ouvrir <span className="text-gold">→</span>
                  </span>
                </span>
                <span
                  className="absolute left-0 top-0 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em]"
                  style={{ backgroundColor: release.accent, color: "#F5F2EA" }}
                >
                  {kindLabel[release.kind] ?? release.kind}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="display-xl text-2xl leading-none transition-colors group-hover:text-gold sm:text-3xl">
                    {release.title}
                  </h3>
                  <span className="text-[11px] tabular-nums text-bone/40">
                    <span className="text-gold/70">{release.year}</span>
                  </span>
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-bone/45">
                  {release.tagline}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-bone/65">
                  {release.description}
                </p>
                <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-bone/40">
                  {release.trackCount} titre{release.trackCount > 1 ? "s" : ""}
                  {release.duration ? ` · ${release.duration}` : ""}
                </p>
              </div>
            </Link>
            <div className="px-6 pb-6">
              <StreamingLinks links={release.links} compact />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
