"use client";

import { useState } from "react";

export function YouTubeEmbed({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden border border-bone/15 bg-ink-soft">
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
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-6 p-8 text-center transition-colors hover:bg-bone/5"
          aria-label={`Lancer ${title} — YouTube`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold text-lg text-gold">
            ▶
          </span>
          <span className="display-xl text-2xl text-bone/80 sm:text-4xl">{title}</span>
          <span className="eyebrow text-bone/40">Écouter en direct · YouTube</span>
        </button>
      )}
    </div>
  );
}