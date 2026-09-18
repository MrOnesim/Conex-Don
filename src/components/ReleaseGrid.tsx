"use client";

import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import { useMemo, useState, type CSSProperties } from "react";

import { EmptyState } from "@/components/EmptyState";
import { motionEase } from "@/components/motion";
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

type FilterKey = (typeof filters)[number]["key"];

export function ReleaseGrid({ releases }: { releases: ReleaseView[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const reducedMotion = useReducedMotion() ?? false;

  const visible = useMemo(
    () =>
      filter === "all"
        ? releases
        : releases.filter((release) => release.kind === filter),
    [filter, releases],
  );

  return (
    <div>
      <div
        className="filter-rail"
        role="group"
        aria-label="Filtrer la discographie"
      >
        {filters.map((item) => {
          const active = filter === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              aria-pressed={active}
              data-active={active ? "true" : "false"}
              className="filter-button"
            >
              {item.label}
            </button>
          );
        })}
        <span className="filter-total" aria-live="polite">
          {visible.length} projet{visible.length > 1 ? "s" : ""}
        </span>
      </div>

      {visible.length > 0 ? (
        <LayoutGroup>
          <motion.ul
            layout
            className="release-grid mt-8"
            aria-label="Projets musicaux"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((release, index) => (
                <motion.li
                  layout
                  key={release.slug}
                  initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }
                  }
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.36,
                          delay: Math.min(index * 0.035, 0.16),
                          ease: motionEase,
                        }
                  }
                >
                  <article
                    className="release-card"
                    style={
                      { "--release-accent": release.accent } as CSSProperties
                    }
                  >
                    <Link
                      href={`/musique/${release.slug}`}
                      className="release-card__primary group"
                      data-cursor="Ouvrir"
                    >
                      <div className="release-card__cover">
                        {release.coverImage ? (
                          <OptimizedImage
                            src={release.coverImage}
                            alt={`Couverture — ${release.title}`}
                            fill
                            accent={release.accent}
                            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                            className="h-full w-full"
                            imageClassName="object-cover duotone transition-[filter,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035] group-hover:grayscale-0"
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
                        <span className="release-card__kind">
                          {kindLabel[release.kind] ?? release.kind}
                        </span>
                        <span className="release-card__open" aria-hidden="true">
                          ↗
                        </span>
                      </div>

                      <div className="release-card__body">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="display-xl min-w-0 text-2xl leading-[0.9] sm:text-3xl">
                            {release.title}
                          </h3>
                          <span className="shrink-0 pt-1 text-[0.66rem] font-semibold tabular-nums text-bone/40">
                            {release.year}
                          </span>
                        </div>
                        <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-bone/45">
                          {release.tagline}
                        </p>
                        {release.description ? (
                          <p className="release-card__description">
                            {release.description}
                          </p>
                        ) : null}
                        <div className="release-card__meta">
                          <span>
                            {release.trackCount} titre
                            {release.trackCount > 1 ? "s" : ""}
                          </span>
                          {release.duration ? (
                            <span>{release.duration}</span>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                    <div className="release-card__platforms">
                      <StreamingLinks links={release.links} compact />
                    </div>
                  </article>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      ) : null}

      {visible.length === 0 ? (
        <EmptyState
          eyebrow="Discographie"
          title="Aucun projet dans cette sélection"
          description="Changez de filtre pour retrouver tous les albums, singles, EP et lives de Conex & Don."
          action={
            <button
              type="button"
              className="button button--outline"
              onClick={() => setFilter("all")}
            >
              <span className="button__label">Voir tous les projets</span>
              <span className="button__arrow" aria-hidden="true">
                →
              </span>
            </button>
          }
        />
      ) : null}
    </div>
  );
}
