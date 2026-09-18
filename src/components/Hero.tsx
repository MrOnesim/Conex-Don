"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { usePlayer } from "@/components/player";

const years = ["2022", "2023", "2024", "2025", "2026"];

/**
 * The home masthead keeps one intentional parallax gesture. It is scheduled
 * from scroll events (instead of an always-on animation loop) to preserve
 * battery and main-thread headroom on long sessions.
 */
export function Hero() {
  const { play, playing, track } = usePlayer();
  const live = track.title === "DESSIGUIMANZANBERA" && playing;
  const leftRef = useRef<HTMLSpanElement | null>(null);
  const ampRef = useRef<HTMLSpanElement | null>(null);
  const rightRef = useRef<HTMLSpanElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.min(
        1.12,
        Math.max(0, window.scrollY / viewportHeight),
      );

      if (leftRef.current)
        leftRef.current.style.transform = `translate3d(${-progress * 23}%, ${progress * 4}%, 0)`;
      if (rightRef.current)
        rightRef.current.style.transform = `translate3d(${progress * 23}%, ${progress * 4}%, 0)`;
      if (ampRef.current) {
        ampRef.current.style.transform = `translate3d(0, ${-progress * 65}%, 0) scale(${1 - progress * 0.26})`;
        ampRef.current.style.opacity = String(
          Math.max(0.18, 1 - progress * 0.82),
        );
      }
      if (contentRef.current) {
        contentRef.current.style.opacity = String(
          Math.max(0, 1 - Math.max(0, progress - 0.32) * 1.48),
        );
      }
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      className="hero-stage"
      aria-label="Conex & Don — l'héritage en mouvement"
    >
      <div className="hero-stage__media" aria-hidden="true">
        <Image
          src="/images/section-hero.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55 duotone"
        />
        <div className="hero-stage__veil" />
      </div>
      <div className="hero-stage__rail" aria-hidden="true" />

      <div ref={contentRef} className="hero-stage__inner">
        <div className="hero-stage__context">
          <p className="eyebrow text-gold">Ouidah · Avédji · Bénin</p>
          <p className="hero-stage__edition">Site officiel · édition 2026</p>
        </div>

        <div className="hero-stage__headline">
          <p className="hero-stage__kicker">L&apos;héritage en mouvement</p>
          <h1
            className="display-xl hero-stage__title"
            aria-label="Conex et Don"
          >
            <span ref={leftRef} className="hero-word hero-word--left">
              CONEX
            </span>
            <span
              ref={ampRef}
              className="hero-amp"
              style={{
                fontFamily: "var(--font-serif-display)",
                textTransform: "none",
              }}
              aria-hidden="true"
            >
              &amp;
            </span>
            <span ref={rightRef} className="hero-word hero-word--right">
              DON
            </span>
          </h1>
          <p className="hero-stage__tagline">
            Deux voix. Une histoire. <span>Un héritage.</span>
          </p>
        </div>

        <div className="hero-stage__release panel">
          <button
            type="button"
            onClick={() => play(4)}
            className="hero-release__art group"
            data-cursor="Écouter"
            aria-label={`Écouter DESSIGUIMANZANBERA${live ? " — en lecture" : ""}`}
          >
            <Image
              src="/images/DESSIGUIMANZANBERA.png"
              alt=""
              fill
              sizes="96px"
              className="object-cover duotone transition-[filter,transform] duration-700 group-hover:scale-[1.05] group-hover:grayscale-0"
            />
            <span className="hero-release__play" aria-hidden="true">
              {live ? (
                <span className="hero-release__bars">
                  <i />
                  <i />
                  <i />
                </span>
              ) : (
                "▶"
              )}
            </span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-bone/45">Dernière sortie · 07.05.2026</p>
            <p className="display-xl mt-2 truncate text-2xl sm:text-3xl">
              DESSIGUIMANZANBERA
            </p>
            <p className="mt-1 truncate text-xs text-bone/55">
              Conex &amp; Don × Tony X × Fanicko · 3:09
            </p>
          </div>
          <button
            type="button"
            onClick={() => play(4)}
            className="button button--solid hero-release__listen"
          >
            <span className="button__label">
              {live ? "En lecture" : "Écouter"}
            </span>
            <span className="button__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>

      <div className="hero-stage__footer">
        <nav
          className="hero-timeline"
          aria-label="Explorer l'histoire par année"
        >
          <span className="hero-timeline__label">Chronique</span>
          {years.map((year) => (
            <Link
              key={year}
              href={`/histoire#${year}`}
              className={`hero-timeline__year ${year === "2026" ? "hero-timeline__year--current" : ""}`}
              aria-label={`Explorer l'année ${year}`}
            >
              {year}
            </Link>
          ))}
        </nav>
        <Link href="/histoire" className="hero-stage__explore">
          Entrer dans l&apos;univers <span aria-hidden="true">↓</span>
        </Link>
      </div>
    </section>
  );
}
