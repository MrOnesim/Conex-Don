"use client";

import type { CSSProperties } from "react";

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
        if (playing) setOpen(true);
        else void play();
      }}
      className={`listen-trigger group ${className}`}
      style={{ "--listen-accent": accent } as CSSProperties}
      aria-pressed={playing}
      title={`Écouter — ${track.project}`}
    >
      <span className="listen-trigger__bars" aria-hidden="true">
        <span
          className={playing ? "eq-bar" : ""}
          style={{ height: playing ? "100%" : "35%" }}
        />
        <span
          className={playing ? "eq-bar" : ""}
          style={{ height: playing ? "70%" : "100%", animationDelay: ".12s" }}
        />
        <span
          className={playing ? "eq-bar" : ""}
          style={{ height: playing ? "45%" : "55%", animationDelay: ".24s" }}
        />
      </span>
      <span>{playing ? "En cours" : label}</span>
      <span className="listen-trigger__arrow" aria-hidden="true">
        {playing ? "↗" : "→"}
      </span>
    </button>
  );
}
