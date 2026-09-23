"use client";

import { useEffect, useMemo, useState } from "react";

import { OptimizedImage } from "@/components/OptimizedImage";
import type { VideoView } from "@/lib/data";

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

  const categories = useMemo(
    () => Array.from(new Set(videos.map((video) => video.category))),
    [videos],
  );
  const list = category ? scoped.filter((video) => video.category === category) : scoped;

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      {filterable ? (
        <div className="mb-10 flex flex-wrap items-center gap-2 border-y border-bone/12 py-4">
          <button
            type="button"
            onClick={() => setCategory(null)}
            aria-pressed={category === null}
            className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
              category === null
                ? "bg-bone text-ink"
                : "border border-bone/20 text-bone/60 hover:border-gold hover:text-gold"
            }`}
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
                className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
                  isActive
                    ? "bg-bone text-ink"
                    : "border border-bone/20 text-bone/60 hover:border-gold hover:text-gold"
                }`}
              >
                {item}
              </button>
            );
          })}
          <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-bone/35">
            {list.length} vidéo{list.length > 1 ? "s" : ""}
          </span>
        </div>
      ) : null}
      <ul
        className={
          columns === "masonry"
            ? "columns-1 gap-px sm:columns-2 lg:columns-3"
            : "grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {list.map((video, index) => (
          <li
            key={video.slug}
            className={columns === "masonry" ? "mb-px break-inside-avoid" : ""}
          >
            <button
              type="button"
              onClick={() => setActive(video)}
              className="group relative block w-full overflow-hidden text-left"
              aria-label={`Voir ${video.title}`}
            >
              <div
                className={`relative w-full ${ratios[index % ratios.length]}`}
                style={video.image ? undefined : { backgroundColor: video.accent }}
              >
                {video.image ? (
                  <OptimizedImage
                    src={video.image}
                    alt={`${video.title} — ${video.category}`}
                    fill
                    accent={video.accent}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                    className="h-full w-full"
                    imageClassName="object-cover duotone transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0 group-hover:translate-y-[-4px] group-hover:shadow-[0_-12px_32px_rgba(0,0,0,0.4)]"
                  />
                ) : (
                  <div className="flex h-full w-full items-end p-6">
                    <span className="display-xl text-3xl leading-[0.86] text-bone/90 sm:text-4xl">
                      {video.title}
                    </span>
                  </div>
                )}
                <span className="absolute inset-0 bg-ink/25 transition-colors duration-500 group-hover:bg-ink/10" />
                <span className="absolute left-4 top-4 bg-ink/85 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-bone/80">
                  {video.category}
                </span>
                <span className="absolute right-4 top-4 text-[10px] tabular-nums text-bone/60">
                  {video.year}
                </span>
                <span className="absolute bottom-4 left-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center border border-bone/50 text-bone transition-colors duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                    ▶
                  </span>
                  <span className="max-w-[70%] text-sm uppercase tracking-[0.08em] text-bone">
                    {video.title}
                  </span>
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 border border-bone/25 px-4 py-2 eyebrow transition-colors hover:border-gold hover:text-gold sm:right-8 sm:top-8"
          >
            Fermer ✕
          </button>

          <div className="w-full max-w-5xl">
            <div className="relative aspect-video w-full border border-bone/15 bg-ink-soft">
              {active.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?rel=0`}
                  title={`${active.title} — ${active.category}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
                  <p className="eyebrow text-bone/45">{active.category}</p>
                  <p className="display-xl text-4xl sm:text-6xl">{active.title}</p>
                  <p className="max-w-md text-sm text-bone/60">{active.description}</p>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      active.searchQuery,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-bone px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold"
                  >
                    Voir sur YouTube
                  </a>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="display-xl text-2xl">{active.title}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-bone/45">
                  {active.category} · {active.year}
                </p>
              </div>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  active.searchQuery,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="border border-bone/20 px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition-colors hover:border-gold hover:text-gold"
              >
                Chaîne officielle
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
