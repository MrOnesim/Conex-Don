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
      className={`group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-70 ${className}`}
      style={{ color: accent }}
      title={`Écouter — ${track.project}`}
    >
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
