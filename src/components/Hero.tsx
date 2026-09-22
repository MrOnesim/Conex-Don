"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { usePlayer } from "@/components/player";

export { default as HeroCanvas } from "./HeroCanvas";

const years = ["2022", "2023", "2024", "2025", "2026"];

export function Hero() {
    const { play, playing, track } = usePlayer();
    const live = track.title === "DESSIGUIMANZANBERA" && playing;
    const leftRef = useRef<HTMLSpanElement | null>(null);
    const ampRef = useRef<HTMLSpanElement | null>(null);
    const rightRef = useRef<HTMLSpanElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const yearsRef = useRef<Array<HTMLSpanElement | null>>([]);
    const vhRef = useRef<number>(0);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            if (contentRef.current) {
                contentRef.current.style.opacity = "1";
            }
            yearsRef.current.forEach((node) => {
                if (node) {
                    node.style.opacity = "1";
                    node.style.transform = "none";
                }
            });
            return;
        }
        let frame = 0;
        let last = -1;
        let ticker = 0;

        const loop = () => {
            vhRef.current = window.innerHeight || 1;
            const p = Math.min(
                1.2,
                Math.max(0, window.scrollY / vhRef.current),
            );
            ticker++;

            if (Math.abs(p - last) < 0.0008) {
                if (ticker < 3) {
                    frame = window.requestAnimationFrame(loop);
                    return;
                }
                ticker = 0;
            } else {
                ticker = 0;
            }
            last = p;

            if (leftRef.current) {
                leftRef.current.style.transform = `translate3d(${-p * 34}%, ${p * 6}%, 0)`;
            }
            if (rightRef.current) {
                rightRef.current.style.transform = `translate3d(${p * 34}%, ${p * 6}%, 0)`;
            }
            if (ampRef.current) {
                ampRef.current.style.transform = `translate3d(0, ${-p * 120}%, 0) scale(${1 - p * 0.5})`;
                ampRef.current.style.opacity = String(Math.max(0, 1 - p * 1.8));
            }
            if (contentRef.current) {
                contentRef.current.style.opacity = String(
                    Math.max(0, 1 - Math.max(0, p - 0.45) * 2.2),
                );
            }
            yearsRef.current.forEach((node, index) => {
                if (!node) return;
                const delay = index * 0.16;
                const local = Math.min(
                    1,
                    Math.max(0, (p - 0.18 - delay) / 0.28),
                );
                node.style.opacity = String(local);
                node.style.transform = `translateY(${(1 - local) * 26}px)`;
            });
            frame = window.requestAnimationFrame(loop);
        };

        frame = window.requestAnimationFrame(loop);
        return () => window.cancelAnimationFrame(frame);
    }, []);

    return (
        <section
            className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pb-24"
            aria-label="Conex & Don — l'héritage en mouvement"
        >
            <div className="absolute inset-0" aria-hidden="true">
                <Image
                    src="/images/section-hero.jpeg"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-50 duotone kenburns"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
                <div className="aurora absolute inset-0 opacity-80" />
            </div>
            <span
                className="outline-giant pointer-events-none absolute left-1/2 top-[22%] z-0 -translate-x-1/2 select-none text-[46vw] leading-none sm:text-[34vw] lg:text-[28vw]"
                aria-hidden="true"
            >
                C&D
            </span>

            <div
                ref={contentRef}
                className="relative mx-auto w-full max-w-[1600px] px-5 text-center sm:px-8 lg:max-w-none lg:px-12"
            >
<h1 className="display-xl flex flex-wrap items-center justify-center text-[clamp(2.75rem,17vw,4.5rem)] leading-[0.78] sm:text-[clamp(4rem,12vw,6.5rem)] lg:text-[clamp(8rem,10vw,16rem)]">
                    <span
                        ref={leftRef}
                        className="inline-block will-change-transform animate-in fade-in slide-in-from-bottom-5 duration-200"
                    >
                        CONEX
                    </span>
                    <span
                        ref={ampRef}
                        className="mx-5 inline-block font-[Instrument_Serif] text-[clamp(2rem,9vw,3.25rem)] italic text-gold drop-shadow-[0_0_22px_rgba(214,168,58,0.45)] sm:mx-5 sm:text-[clamp(2.75rem,6vw,4.25rem)] lg:text-[clamp(3.5rem,5vw,5.5rem)]"
                        style={{
                            fontFamily: "var(--font-serif-display)",
                            textTransform: "none",
                        }}
                    >
                        &
                    </span>
                    <span
                        ref={rightRef}
                        className="inline-block will-change-transform animate-in fade-in slide-in-from-bottom-5 duration-300"
                    >
                        DON
                    </span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-[clamp(1rem,1.8vw,1.25rem)] leading-snug text-bone/85 sm:mt-8 sm:text-[clamp(1.25rem,2vw,1.5rem)] lg:max-w-none">
                    Deux voix-Une histoire-{" "}
                    <span className="text-gold">Un héritage.</span>
                </p>
            </div>

            <div className="relative">
                {/* Années — la timeline qui se révèle au scroll */}
                <div className="mx-auto flex max-w-[1600px] flex-wrap items-end gap-x-6 gap-y-8 px-5 sm:gap-x-12 sm:px-8 lg:px-12">
                    {years.map((year, index) => (
                        <span
                            key={year}
                            ref={(node) => {
                                yearsRef.current[index] = node;
                            }}
                            className={`display-xl text-2xl sm:text-4xl ${
                                index === years.length - 1
                                    ? "text-gold"
                                    : "text-bone/35"
                            }`}
                            style={{ opacity: index === 0 ? 1 : 0 }}
                        >
                            {year}
                        </span>
                    ))}
                </div>
                <div
                    className="hairline-gold absolute bottom-0 left-0 w-full opacity-60"
                    aria-hidden="true"
                />

                <div className="relative mx-auto mt-8 max-w-[1600px] border-t border-bone/20 px-5 pb-10 sm:px-8 lg:px-12">
                    <div className="flex flex-col gap-6 pt-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
                            <button
                                type="button"
                                onClick={() => play(4)}
                                className="group relative aspect-square w-28 shrink-0 sm:w-40"
                                data-cursor="Écouter"
                                aria-label={`Écouter DESSIGUIMANZANBERA${live ? " — en lecture" : ""}`}
                            >
                                <span
                                    className="absolute inset-0 translate-x-3 translate-y-3 border border-gold/30 transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:translate-y-2"
                                    aria-hidden="true"
                                />
                                <span className="relative block h-full w-full animate-in fade-in zoom-in-95 -rotate-2 slide-in-from-right-4 duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                                    <Image
                                        src="/images/DESSIGUIMANZANBERA.png"
                                        alt=""
                                        fill
                                        sizes="160px"
                                        className="duotone object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                                    />
                                    <span
                                        className="absolute inset-0 bg-ink/15 transition-colors duration-500 group-hover:bg-ink/5"
                                        aria-hidden="true"
                                    />
                                    <span
                                        className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center border transition-colors duration-500 ${
                                            live
                                                ? "border-gold bg-gold"
                                                : "border-bone/40 bg-ink/80 group-hover:border-gold group-hover:bg-gold"
                                        }`}
                                        aria-hidden="true"
                                    >
                                        {live ? (
                                            <span className="flex h-3 items-end gap-[2px]">
                                                <span className="eq-bar block w-[2px] bg-ink" style={{ height: "60%" }} />
                                                <span className="eq-bar block w-[2px] bg-ink" style={{ height: "100%" }} />
                                                <span className="eq-bar block w-[2px] bg-ink" style={{ height: "40%" }} />
                                            </span>
                                        ) : (
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="h-3 w-3 fill-bone transition-colors duration-500 group-hover:fill-ink"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </span>
                                </span>
                            </button>

                            <div className="min-w-0">
                                <p className="eyebrow text-bone/45">
                                    Dernière sortie — 7 mai 2026
                                </p>
                                <p className="display-xl mt-3 text-2xl sm:text-3xl">
                                    DESSIGUIMANZANBERA
                                </p>
                                <p className="mt-2 text-sm text-bone/60">
                                    Conex &amp; Don × Tony X × Fanicko — 3:09
                                </p>
                                {live ? (
                                    <p className="mt-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                                        <span className="h-1 w-1 animate-pulse rounded-full bg-gold" aria-hidden="true" />
                                        En lecture
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => play(4)}
                                className="group shine inline-flex items-center gap-3 bg-bone px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink transition-colors duration-500 hover:bg-gold"
                            >
                                <span className="flex h-3 items-end gap-[2px]">
                                    <span
                                        className="eq-bar block w-[2px] bg-ink"
                                        style={{ height: "60%" }}
                                    />
                                    <span
                                        className="eq-bar block w-[2px] bg-ink"
                                        style={{ height: "100%" }}
                                    />
                                    <span
                                        className="eq-bar block w-[2px] bg-ink"
                                        style={{ height: "40%" }}
                                    />
                                </span>
                                Écouter la dernière sortie
                            </button>
                            <Link
                                href="/histoire"
                                className="group inline-flex items-center gap-3 border border-bone/30 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 hover:border-gold hover:text-gold"
                            >
                                Entrer dans l&apos;univers
                                <span className="transition-transform duration-500 group-hover:translate-y-1">
                                    ↓
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
