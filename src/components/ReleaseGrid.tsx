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
              className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
                active
                  ? "bg-bone text-ink"
                  : "border border-bone/20 text-bone/60 hover:border-gold hover:text-gold"
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
              className="group flex h-full flex-col"
              data-cursor="Ouvrir"
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
                    imageClassName="object-cover duotone transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0"
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
                  <span className="text-[11px] tabular-nums text-bone/40">{release.year}</span>
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
