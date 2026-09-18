"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { motionSpring } from "@/components/motion";

export function YouTubeEmbed({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div className="youtube-embed relative aspect-video w-full overflow-hidden border border-bone/15 bg-ink-soft">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&autoplay=1`}
          title={`${title} — YouTube`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-5 p-8 text-center"
          aria-label={`Lancer ${title} — YouTube`}
        >
          <motion.span
            className="youtube-embed__play"
            aria-hidden="true"
            whileHover={reducedMotion ? undefined : { scale: 1.08 }}
            whileTap={reducedMotion ? undefined : { scale: 0.94 }}
            transition={reducedMotion ? { duration: 0 } : motionSpring}
          >
            ▶
          </motion.span>
          <span className="display-xl text-2xl text-bone/85 sm:text-4xl">
            {title}
          </span>
          <span className="eyebrow text-bone/45">
            Écouter en direct · YouTube
          </span>
        </button>
      )}
    </div>
  );
}
