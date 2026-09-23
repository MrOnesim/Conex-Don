"use client";

import { usePlayer } from "@/components/player";

export function ListenTrigger({
  label = "On écoute ?",
  accent = "#D6A83A",
  className = "",
}: {
  label?: string;
  accent?: string;
  className?: string;
}) {
  const { play, setOpen, playing, track } = usePlayer();
  return (
    <button
      type="button"
      onClick={() => {
        if (playing) {
          setOpen(true);
        } else {
          void play();
        }
      }}
      className={`group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:opacity-70 hover:-translate-y-px ${className}`}
      style={{ color: accent }}
      title={`Écouter — ${track.project}`}
    >
      {playing ? (
        <span
          className="relative flex h-4 w-4 items-center justify-center"
          aria-hidden="true"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" style={{ backgroundColor: accent }} />
          <span className="relative inline-block h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
        </span>
      ) : null}
      <span className="flex h-2.5 items-end gap-[2px]">
        <span
          className={`block w-[2px] bg-current ${playing ? "eq-bar" : ""}`}
          style={{ height: playing ? "100%" : "35%" }}
        />
        <span
          className={`block w-[2px] bg-current ${playing ? "eq-bar" : ""}`}
          style={{ height: playing ? "70%" : "100%", animationDelay: ".12s" }}
        />
        <span
          className={`block w-[2px] bg-current ${playing ? "eq-bar" : ""}`}
          style={{ height: playing ? "45%" : "55%", animationDelay: ".24s" }}
        />
      </span>
      {playing ? "En cours" : label}
    </button>
  );
}
