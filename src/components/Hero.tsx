"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { usePlayer } from "@/components/player";

const years = ["2022", "2023", "2024", "2025", "2026"];

export function Hero() {
    const { play } = usePlayer();
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
            className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 sm:pt-32"
            data-cursor="Aloba !"
            aria-label="Conex & Don — l'héritage en mouvement"
        >
            <div className="absolute inset-0" aria-hidden="true">
                <Image
                    src="/images/section-hero.jpeg"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-35 duotone"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
            </div>

            <div
                ref={contentRef}
                className="relative mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12"
            >
                <h1 className="display-xl flex flex-wrap items-center text-[clamp(2rem,19vw,4rem)] leading-[0.78] sm:text-[clamp(1.5rem,16vw,3rem)] lg:text-[clamp(3rem,15rem,5rem)]">
                    <span
                        ref={leftRef}
                        className="inline-block will-change-transform"
                    >
                        CONEX
                    </span>
                    <span
                        ref={ampRef}
                        className="mx-2 inline-block font-[Instrument_Serif] text-[clamp(1.5rem,10vw,3rem)] italic text-gold sm:mx-5 sm:text-[clamp(2rem,8vw,2.5rem)] lg:text-[clamp(4rem,7rem,5rem)]"
                        style={{
                            fontFamily: "var(--font-serif-display)",
                            textTransform: "none",
                        }}
                    >
                        &amp;
                    </span>
                    <span
                        ref={rightRef}
                        className="inline-block will-change-transform"
                    >
                        DON
                    </span>
                </h1>

                <p className="mt-6 max-w-2xl text-[clamp(1rem,1.8vw,1.25rem)] leading-snug text-bone/85 sm:mt-8 sm:text-[clamp(1.25rem,2vw,1.5rem)]">
                    Deux voix-Une histoire-{" "}
                    <span className="text-gold">Un héritage.</span>
                </p>
            </div>

            <div className="relative">
                {/* Années — la timeline qui se révèle au scroll */}
                <div className="mx-auto flex max-w-[1600px] flex-wrap items-end gap-x-6 gap-y-1 px-5 sm:gap-x-12 sm:px-8 lg:px-12">
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
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-gold to-clay opacity-50 scale-100 group-hover:scale-110 transition-transform duration-500"
                    aria-hidden="true"
                />

                <div className="relative mx-auto mt-8 max-w-[1600px] border-t border-bone/20 px-5 pb-10 sm:px-8 lg:px-12">
                    <div className="flex flex-col gap-6 pt-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-md">
                            <p className="eyebrow text-bone/45">
                                Dernière sortie — 7 mai 2026
                            </p>
                            <p className="display-xl mt-3 text-2xl sm:text-3xl">
                                DESSIGUIMANZANBERA
                            </p>
                            <p className="mt-2 text-sm text-bone/60">
                                Conex &amp; Don × Tony X × Fanicko — 3:09
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => play(4)}
                                className="group inline-flex items-center gap-3 bg-bone px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink transition-colors duration-500 hover:bg-gold"
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
