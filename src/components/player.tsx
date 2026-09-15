"use client";

import Image from "next/image";
import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { engineTracks } from "@/lib/audio-engine";

/* ------------------------------------------------- YouTube IFrame API types */

type YTPlayer = {
  loadVideoById: (videoId: string) => void;
  cueVideoById: (videoId: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  getVideoData: () => { video_id?: string };
  destroy: () => void;
};

type YTPlayerConfig = {
  width?: string | number;
  height?: string | number;
  videoId?: string;
  playerVars?: Record<string, string | number | boolean>;
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onStateChange?: (event: { data: number; target: YTPlayer }) => void;
  };
};

type YTNamespace = {
  Player: new (element: HTMLElement, config: YTPlayerConfig) => YTPlayer;
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/* ------------------------------------------------------------- player API */

type PlayerApi = {
  playing: boolean;
  trackIndex: number;
  volume: number;
  position: number;
  duration: number;
  open: boolean;
  track: (typeof engineTracks)[number];
  toggle: () => void;
  play: (index?: number) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (value: number) => void;
  setOpen: (value: boolean) => void;
  setTrackIndex: (value: number) => void;
};

const PlayerContext = createContext<PlayerApi | null>(null);

const covers: Record<string, string> = {
  medley: "/images/MEDLEY.png",
  "djo-agado": "/images/AGADO.png",
  "ayato-feel": "/images/AYATO.png",
  "mode-avion": "/images/MODE-AVION.jpg",
  dessigui: "/images/DESSIGUIMANZANBERA.png",
};

const fmt = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

let ytApiPromise: Promise<void> | null = null;

function loadYoutubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
  return ytApiPromise;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolumeState] = useState(0.9);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(engineTracks[0].durationSec);
  const [open, setOpen] = useState(false);

  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const intendRef = useRef(false);
  const trackIndexRef = useRef(trackIndex);
  trackIndexRef.current = trackIndex;
  const volumeRef = useRef(volume);
  volumeRef.current = volume;
  const playingRef = useRef(playing);
  playingRef.current = playing;

  const track = engineTracks[trackIndex];

  // Crée le lecteur YouTube une seule fois une fois l'API chargée.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof window === "undefined") return;

    let disposed = false;
    let player: YTPlayer | null = null;

    loadYoutubeApi().then(() => {
      if (disposed || !window.YT?.Player) return;
      while (host.firstChild) host.removeChild(host.firstChild);
      player = new window.YT.Player(host, {
        width: "320",
        height: "180",
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          rel: 0,
          iv_load_policy: 3,
          modestbranding: 1,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            event.target.setVolume(Math.round(volumeRef.current * 100));
            const id = engineTracks[trackIndexRef.current].youtubeId;
            if (intendRef.current) event.target.loadVideoById(id);
            else event.target.cueVideoById(id);
          },
          onStateChange: (event) => {
            const states = window.YT?.PlayerState;
            if (!states) return;
            if (event.data === states.UNSTARTED || event.data === states.CUED) return;
            if (event.data === states.PLAYING) setPlaying(true);
            else if (event.data === states.PAUSED) setPlaying(false);
            if (event.data === states.ENDED) {
              setPlaying(false);
              intendRef.current = true;
              setTrackIndex((index) => (index + 1) % engineTracks.length);
            }
          },
        },
      });
    });

    return () => {
      disposed = true;
      player?.destroy();
      playerRef.current = null;
    };
  }, []);

  // Quand le mouvement change : charger la vidéo (et jouer si l'utilisateur écoute).
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const id = engineTracks[trackIndex].youtubeId;
    if (intendRef.current) player.loadVideoById(id);
    else player.cueVideoById(id);
  }, [trackIndex]);

  // Suivi de la position et de la durée PENDANT la lecture.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      setPosition(player.getCurrentTime());
      const real = player.getDuration();
      if (Number.isFinite(real) && real > 0) setDuration(real);
    }, 250);
    return () => window.clearInterval(id);
  }, [playing]);

  const playVideo = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      player.playVideo();
    }
  }, []);

  const pauseVideo = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const play = useCallback(
    (index?: number) => {
      const target = index ?? trackIndexRef.current;
      intendRef.current = true;
      setPlaying(true);
      if (target !== trackIndexRef.current) {
        setTrackIndex(target);
        return;
      }
      const player = playerRef.current;
      if (player) {
        const id = engineTracks[target].youtubeId;
        const states = window.YT?.PlayerState;
        const state = player.getPlayerState();
        const isLoaded = player.getVideoData()?.video_id === id;
        if (isLoaded && states && state !== states.ENDED) player.playVideo();
        else player.loadVideoById(id);
      }
    },
    [],
  );

  const pause = useCallback(() => {
    intendRef.current = false;
    pauseVideo();
    setPlaying(false);
  }, [pauseVideo]);

  const toggle = useCallback(() => {
    if (playingRef.current) pause();
    else {
      intendRef.current = true;
      play();
    }
  }, [pause, play]);

  const requestTrack = useCallback(
    (value: number) => {
      intendRef.current = true;
      setTrackIndex(value);
    },
    [],
  );

  const next = useCallback(() => {
    requestTrack((trackIndexRef.current + 1) % engineTracks.length);
  }, [requestTrack]);

  const prev = useCallback(() => {
    requestTrack((trackIndexRef.current - 1 + engineTracks.length) % engineTracks.length);
  }, [requestTrack]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
  }, []);

  // Applique le volume au lecteur (dès qu'il existe).
  useEffect(() => {
    playerRef.current?.setVolume(Math.round(volume * 100));
  }, [volume]);

  // Raccourci clavier : Échap ferme l'overlay LISTEN.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<PlayerApi>(
    () => ({
      playing,
      trackIndex,
      volume,
      position,
      duration,
      open,
      track,
      toggle,
      play,
      pause,
      next,
      prev,
      setVolume,
      setOpen,
      setTrackIndex: requestTrack,
    }),
    [
      duration,
      next,
      open,
      pause,
      play,
      playing,
      position,
      prev,
      requestTrack,
      setVolume,
      toggle,
      track,
      trackIndex,
      volume,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      <div className="contents">{Children.toArray(children)}</div>
      <div
        ref={hostRef}
        data-youtube-host="true"
        aria-hidden="true"
        className="pointer-events-none fixed -left-[9999px] top-0 h-[180px] w-[320px]"
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerApi {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer doit être utilisé dans PlayerProvider");
  return ctx;
}

/* ------------------------------------------------------------- visualizer */

function Visualizer({ bars = 28, className = "" }: { bars?: number; className?: string }) {
  const { playing } = usePlayer();
  return (
    <span className={`flex h-full items-end gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, index) => (
        <span
          key={index}
          className={playing ? "eq-bar" : ""}
          style={{
            width: 3,
            height: `${18 + ((index * 37) % 62)}%`,
            backgroundColor: "currentColor",
            animationDelay: `${(index % 7) * 0.08}s`,
          }}
        />
      ))}
    </span>
  );
}

/* --------------------------------------------------------------- controls */

export function ListenButton({
  className = "",
  label = "LISTEN",
}: {
  className?: string;
  label?: string;
}) {
  const { playing, toggle } = usePlayer();
  return (
    <div className="flex items-stretch">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Mettre en pause" : "Écouter"}
        className={`group flex items-center gap-2 border border-bone/25 px-4 py-2 eyebrow transition-colors duration-300 hover:border-gold hover:text-gold ${className}`}
      >
        <span className="flex h-3 items-end gap-[2px] text-gold">
          <span
            className={`block w-[2px] bg-current ${playing ? "eq-bar" : ""}`}
            style={{ height: "35%" }}
          />
          <span
            className={`block w-[2px] bg-current ${playing ? "eq-bar" : ""}`}
            style={{ height: "100%", animationDelay: ".12s" }}
          />
          <span
            className={`block w-[2px] bg-current ${playing ? "eq-bar" : ""}`}
            style={{ height: "55%", animationDelay: ".24s" }}
          />
        </span>
        {playing ? "PAUSE" : label}
      </button>
    </div>
  );
}

export function PlayerDock() {
  const { playing, track, position, duration, volume, toggle, next, prev, setVolume, setOpen, setTrackIndex } =
    usePlayer();
  const total = duration > 0 ? duration : track.durationSec;
  const progress = Math.min(100, (position / total) * 100);

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-[85] border-t border-bone/15 bg-ink/95 backdrop-blur-md"
        data-engine-owner="true"
      >
        <div
          className="h-[2px] w-full bg-bone/10"
          role="progressbar"
          aria-label="Progression"
          aria-valuenow={Math.round(progress)}
        >
          <div
            className="h-full bg-gold transition-[width] duration-200 ease-linear"
            style={{ width: `${progress}%`, backgroundColor: track.accent }}
          />
        </div>
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-3 py-2 sm:gap-5 sm:px-6 sm:py-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative h-11 w-11 shrink-0 overflow-hidden border border-bone/20 sm:h-12 sm:w-12"
            aria-label="Ouvrir le mode LISTEN"
          >
            <Image
              src={covers[track.id] ?? "/images/MODE-AVION.jpg"}
              alt={`Visuel — ${track.project}`}
              fill
              sizes="48px"
              className="object-cover duotone"
            />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] sm:text-xs">
              {track.title}
            </p>
            <p className="truncate text-[10px] uppercase tracking-[0.22em] text-bone/45 sm:text-[11px]">
              {track.project} {playing ? "· en lecture" : ""}
            </p>
          </div>

          <div className="hidden items-center gap-2 text-bone/60 lg:flex">
            <Visualizer bars={22} />
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={prev}
              className="px-1 text-bone/50 transition-colors hover:text-bone"
              aria-label="Mouvement précédent"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 5h2v14H6zm12 0v14l-9-7z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center border border-bone/25 transition-colors hover:border-gold hover:text-gold sm:h-10 sm:w-10"
              aria-label={playing ? "Mettre en pause" : "Écouter"}
            >
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 5h3v14H7zm7 0h3v14h-3z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5l12 7-12 7z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={next}
              className="px-1 text-bone/50 transition-colors hover:text-bone"
              aria-label="Mouvement suivant"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16 5h2v14h-2zM6 5l9 7-9 7z" />
              </svg>
            </button>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <span className="text-[10px] uppercase tracking-[0.2em] text-bone/40">Vol</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="h-[3px] w-20 cursor-pointer appearance-none bg-bone/20 accent-gold"
              aria-label="Volume"
            />
          </div>

          <span className="hidden text-[11px] tabular-nums text-bone/50 sm:inline">
            {fmt(position)} / {fmt(total)}
          </span>
        </div>
      </div>

      <ListenOverlay />
    </>
  );
}

function ListenOverlay() {
  const {
    open,
    setOpen,
    track,
    playing,
    duration,
    position,
    toggle,
    next,
    prev,
    trackIndex,
    setTrackIndex,
  } = usePlayer();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-ink grain" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 opacity-40"
        style={{ backgroundColor: track.accent }}
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between border-b border-bone/15 px-5 py-4">
        <p className="eyebrow text-bone/60">{track.project} · Lecteur intégré</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="border border-bone/25 px-3 py-2 eyebrow transition-colors hover:border-gold hover:text-gold"
        >
          Fermer ✕
        </button>
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-8 overflow-y-auto px-5 py-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:px-10">
        <div className="relative aspect-square w-full max-w-md overflow-hidden border border-bone/15">
          <Image
            src={covers[track.id] ?? "/images/MODE-AVION.jpg"}
            alt={`Visuel — ${track.project}`}
            fill
            sizes="(max-width: 1024px) 90vw, 40vw"
            className={`object-cover duotone ${playing ? "kenburns" : ""}`}
            priority
          />
          <div className="absolute inset-x-0 bottom-0 flex h-24 items-end px-5 pb-5 text-bone mix-blend-difference">
            <Visualizer bars={40} />
          </div>
        </div>

        <div>
          <p className="eyebrow text-gold">Mouvement {trackIndex + 1} / {engineTracks.length}</p>
          <h2 className="display-xl mt-4 text-[13vw] leading-[0.82] sm:text-6xl lg:text-7xl">
            {track.title}
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-bone/70">
            Chaque mouvement se lance en audio, ici-même dans le lecteur intégré du site — du clip
            aux live expériences. La musique continue quand on change de page.
          </p>

          <div className="mt-7 flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              className="border border-bone/25 px-4 py-3 eyebrow hover:border-gold"
            >
              ←
            </button>
            <button
              type="button"
              onClick={toggle}
              className="flex items-center gap-3 bg-bone px-7 py-4 text-ink eyebrow transition-colors hover:bg-gold"
            >
              {playing ? "❚❚  Mettre en pause" : "▶  Écouter"}
            </button>
            <button
              type="button"
              onClick={next}
              className="border border-bone/25 px-4 py-3 eyebrow hover:border-gold"
            >
              →
            </button>
            <span className="ml-2 text-xs tabular-nums text-bone/50">
              {fmt(position)} / {fmt(duration > 0 ? duration : track.durationSec)}
            </span>
          </div>

          <div className="mt-10 hairline pt-6">
            <p className="eyebrow text-bone/40">Écouter les titres officiels</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: "Spotify", href: "https://open.spotify.com/artist/4vibJGQKsr8i8A5a1LizZ0" },
                {
                  label: "Apple Music",
                  href: "https://music.apple.com/fr/artist/conex-et-don/1668784419",
                },
                { label: "Audiomack", href: "https://audiomack.com/conexetdonofficiel" },
                { label: "YouTube", href: "https://www.youtube.com/watch?v=" + track.youtubeId },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-bone/20 px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors hover:border-gold hover:text-gold"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="eyebrow text-bone/40">Mouvements</p>
            <ul className="mt-3 divide-y divide-bone/10">
              {engineTracks.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setTrackIndex(index)}
                    className={`flex w-full items-baseline justify-between gap-4 py-3 text-left transition-colors ${
                      index === trackIndex ? "text-gold" : "text-bone/70 hover:text-bone"
                    }`}
                  >
                    <span className="text-sm uppercase tracking-[0.12em]">
                      {String(index + 1).padStart(2, "0")} — {item.title}
                    </span>
                    <span className="text-[11px] tabular-nums text-bone/40">
                      {fmt(item.durationSec)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}