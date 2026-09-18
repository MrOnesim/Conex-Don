"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { EmptyState } from "@/components/EmptyState";
import { motionEase, motionSpring } from "@/components/motion";
import { OptimizedImage } from "@/components/OptimizedImage";
import type { VideoView } from "@/lib/data";
import { useFocusTrap } from "@/lib/use-focus-trap";

const ratios = [
  "aspect-video",
  "aspect-4/5",
  "aspect-video",
  "aspect-square",
  "aspect-video",
  "aspect-4/5",
];

export function VideoWall({
  videos,
  limit,
  columns = "masonry",
  filterable = false,
}: {
  videos: VideoView[];
  limit?: number;
  columns?: "masonry" | "grid";
  filterable?: boolean;
}) {
  const scoped = typeof limit === "number" ? videos.slice(0, limit) : videos;
  const [active, setActive] = useState<VideoView | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const closeModal = useCallback(() => setActive(null), []);

  const categories = useMemo(
    () => Array.from(new Set(scoped.map((video) => video.category))),
    [scoped],
  );
  const list = category
    ? scoped.filter((video) => video.category === category)
    : scoped;

  useFocusTrap({
    active: Boolean(active),
    containerRef: dialogRef,
    initialFocusRef: closeRef,
    onEscape: closeModal,
  });

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  return (
    <>
      {filterable ? (
        <div
          className="filter-rail mb-8"
          role="group"
          aria-label="Filtrer les vidéos"
        >
          <button
            type="button"
            onClick={() => setCategory(null)}
            aria-pressed={category === null}
            data-active={category === null ? "true" : "false"}
            className="filter-button"
          >
            Tous
          </button>
          {categories.map((item) => {
            const isActive = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(isActive ? null : item)}
                aria-pressed={isActive}
                data-active={isActive ? "true" : "false"}
                className="filter-button"
              >
                {item}
              </button>
            );
          })}
          <span className="filter-total" aria-live="polite">
            {list.length} vidéo{list.length > 1 ? "s" : ""}
          </span>
        </div>
      ) : null}

      {list.length > 0 ? (
        <motion.ul
          layout
          className={
            columns === "masonry"
              ? "video-wall columns-1 gap-px sm:columns-2 lg:columns-3"
              : "video-wall grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3"
          }
          aria-label="Vidéographie"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((video, index) => (
              <motion.li
                layout
                id={video.slug}
                key={video.slug}
                className={
                  columns === "masonry" ? "mb-px break-inside-avoid" : ""
                }
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={
                  reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }
                }
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.34,
                        delay: Math.min(index * 0.025, 0.16),
                        ease: motionEase,
                      }
                }
              >
                <motion.button
                  type="button"
                  onClick={() => setActive(video)}
                  className="video-card group"
                  data-cursor="Lire"
                  aria-label={`Voir ${video.title}`}
                  whileTap={reducedMotion ? undefined : { scale: 0.985 }}
                >
                  <div
                    className={`video-card__media ${ratios[index % ratios.length]}`}
                    style={
                      video.image
                        ? undefined
                        : { backgroundColor: video.accent }
                    }
                  >
                    {video.image ? (
                      <OptimizedImage
                        src={video.image}
                        alt={`${video.title} — ${video.category}`}
                        fill
                        accent={video.accent}
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                        className="h-full w-full"
                        imageClassName="object-cover duotone transition-[filter,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="flex h-full w-full items-end p-6">
                        <span className="display-xl text-3xl leading-[0.86] text-bone/90 sm:text-4xl">
                          {video.title}
                        </span>
                      </div>
                    )}
                    <span className="video-card__shade" aria-hidden="true" />
                    <span className="video-card__meta">
                      <span>{video.category}</span>
                      <span>{video.year}</span>
                    </span>
                    <span className="video-card__footer">
                      <span className="video-card__play" aria-hidden="true">
                        ▶
                      </span>
                      <span className="video-card__title">{video.title}</span>
                    </span>
                  </div>
                </motion.button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <EmptyState
          eyebrow="Vidéographie"
          title="Aucune vidéo dans cette sélection"
          description="Réinitialisez le filtre pour retrouver les clips, visualizers et captations live du duo."
          action={
            <button
              type="button"
              className="button button--outline"
              onClick={() => setCategory(null)}
            >
              <span className="button__label">Voir toutes les vidéos</span>
              <span className="button__arrow" aria-hidden="true">
                →
              </span>
            </button>
          }
        />
      )}

      <AnimatePresence>
        {active ? (
          <motion.div
            key={`video-dialog-${active.slug}`}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-8"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: motionEase }
            }
          >
            <button
              type="button"
              className="modal-backdrop absolute inset-0 cursor-default"
              onClick={closeModal}
              aria-label="Fermer le lecteur vidéo"
              tabIndex={-1}
            />
            <motion.div
              ref={dialogRef}
              className="dialog-surface relative flex max-h-full w-full max-w-6xl flex-col overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`video-dialog-${active.slug}`}
              tabIndex={-1}
              initial={
                reducedMotion ? false : { opacity: 0, y: 18, scale: 0.985 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 10, scale: 0.99 }
              }
              transition={reducedMotion ? { duration: 0 } : motionSpring}
            >
              <div className="dialog-topline shrink-0">
                <p className="eyebrow text-bone/50">
                  {active.category} · {active.year}
                </p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeModal}
                  className="icon-control h-8 min-h-8 min-w-8 text-[0.7rem]"
                  aria-label="Fermer le lecteur vidéo"
                >
                  ×
                </button>
              </div>
              <div className="p-3 sm:p-5">
                <div className="relative aspect-video w-full overflow-hidden border border-bone/12 bg-ink-soft">
                  {active.youtubeId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?rel=0`}
                      title={`${active.title} — ${active.category}`}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
                      <p className="eyebrow text-gold">{active.category}</p>
                      <p className="display-xl text-4xl sm:text-6xl">
                        {active.title}
                      </p>
                      {active.description ? (
                        <p className="max-w-md text-sm leading-relaxed text-bone/60">
                          {active.description}
                        </p>
                      ) : null}
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(active.searchQuery)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="button button--solid"
                      >
                        <span className="button__label">Voir sur YouTube</span>
                        <span className="button__arrow" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-end justify-between gap-5 px-1 pb-1 pt-5">
                  <div>
                    <h2
                      id={`video-dialog-${active.slug}`}
                      className="display-xl text-2xl sm:text-4xl"
                    >
                      {active.title}
                    </h2>
                    {active.description ? (
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-bone/60">
                        {active.description}
                      </p>
                    ) : null}
                  </div>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(active.searchQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="button button--outline"
                  >
                    <span className="button__label">Chaîne officielle</span>
                    <span className="button__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
