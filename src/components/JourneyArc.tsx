"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { Reveal } from "@/components/Reveal";
import { Kicker } from "@/components/ui";

const milestones = [
    {
        year: "2022",
        title: "Freestyles",
        kicker: "Naissance du duo",
        note: "TikTok. Un téléphone, une ville.",
        image: "/images/Don.jpeg",
    },
    {
        year: "2023",
        title: "DéCOUVERTE",
        kicker: "Premier EP",
        note: "5 titres — 13 avril 2023",
        image: "/images/Découverte.jpg",
    },
    {
        year: "2024",
        title: "Symphonie béninoise",
        kicker: "Premier album",
        note: "13 pistes — février 2024",
        image: "/images/SYMPHONIE-BÉNINOISE.webp",
    },
    {
        year: "2025",
        title: "Sept singles",
        kicker: "La nouvelle génération",
        note: "AKA → Guepard, rythme imposé",
        image: "/images/AKA.jpg",
    },
    {
        year: "2026",
        title: "HÉRITAGE VIVANT",
        kicker: "Live expérience",
        note: "Mémoire, résilience, spiritualité",
        image: "/images/HÉRITAGE-VIVANT.jpg",
    },
];

export function JourneyArc() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;
        if (
            !("IntersectionObserver" in window) ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            setActive(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(true);
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.05 },
        );
        io.observe(node);
        return () => io.disconnect();
    }, []);

    const maskStyle = (delay: number): CSSProperties =>
        active
            ? { transitionDelay: `${delay}ms`, transitionDuration: "1.1s" }
            : { transitionDelay: "0ms", transitionDuration: "0ms" };

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden border-b border-bone/10 bg-ink"
            aria-label="Le parcours — 2022 à 2026"
        >
            <span
                className="outline-giant pointer-events-none absolute -top-6 right-2 select-none text-[clamp(5rem,18vw,14rem)] leading-none opacity-80"
                aria-hidden="true"
            >
                2022 — 2026
            </span>

            <div className="relative mx-auto max-w-[1600px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <Kicker>2022 → 2026</Kicker>
                        <div
                            className="reveal-mask"
                            data-visible={active ? "true" : "false"}
                            style={maskStyle(60)}
                        >
                            <h2 className="display-xl mt-4 text-[clamp(2rem,6vw,3.4rem)] leading-[0.86] sm:text-[clamp(2.5rem,4vw,3.9rem)]">
                                CINQ ANS.
                                <br />
                                LA MÊME ÉNERGIE.
                            </h2>
                        </div>
                    </div>
                    <Reveal variant="fade" delay={260}>
                        <Link
                            href="/histoire"
                            className="group inline-flex items-center gap-3 border border-bone/30 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-bone/80 transition-colors duration-500 hover:border-gold hover:text-gold"
                        >
                            Voir l&apos;histoire
                            <span
                                className="h-px w-8 bg-gold/50 transition-all duration-500 group-hover:w-12 group-hover:bg-gold"
                                aria-hidden="true"
                            />
                        </Link>
                    </Reveal>
                </div>

                <div className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 lg:mt-12 lg:grid lg:grid-cols-5 lg:gap-8 lg:overflow-visible lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {milestones.map((m, index) => {
                        const last = index === milestones.length - 1;
                        return (
                            <article
                                key={m.year}
                                className="group w-[min(78vw,300px)] shrink-0 snap-start lg:w-auto"
                            >
                                <div
                                    className="reveal-mask"
                                    data-visible={active ? "true" : "false"}
                                    style={maskStyle(index * 90)}
                                >
                                    <div className="frame-offset relative aspect-[4/5] overflow-hidden border border-bone/15 transition-colors duration-500 group-hover:border-gold/40">
                                        <div className="duotone absolute inset-0 transition-[filter] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[filter:grayscale(0)_contrast(1.06)_brightness(1.05)]">
                                            <Image
                                                src={m.image}
                                                alt=""
                                                fill
                                                sizes="(min-width:1024px) 19vw, 78vw"
                                                className="object-cover object-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                                            />
                                        </div>
                                        <div
                                            className="pointer-events-none absolute inset-0 bg-ink/30 transition-colors duration-700 group-hover:bg-ink/10"
                                            aria-hidden="true"
                                        />
                                        <span className="pointer-events-none absolute left-3 top-3 translate-y-2 bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                                            {m.kicker}
                                        </span>
                                        <span
                                            className="pointer-events-none absolute bottom-3 right-3 text-[10px] font-semibold tracking-[0.2em] text-bone/70 transition-colors duration-500 group-hover:text-gold"
                                            aria-hidden="true"
                                        >
                                            {m.year}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className="reveal-mask"
                                    data-visible={active ? "true" : "false"}
                                    style={maskStyle(index * 90 + 70)}
                                >
                                    <div className="mt-4">
                                        <p className="eyebrow flex items-baseline gap-3 text-bone/45">
                                            <span className="text-gold transition-colors duration-500 group-hover:text-gold">
                                                {m.year}
                                            </span>
                                            <span className="h-px w-6 bg-gold/30" aria-hidden="true" />
                                        </p>
                                        <h3 className="display-xl mt-2 text-2xl uppercase leading-[0.9] transition-colors duration-500 group-hover:text-gold">
                                            {m.title}
                                        </h3>
                                    </div>
                                </div>

                                <Reveal variant="fade" delay={index * 90 + 150}>
                                    <p className="mt-3 text-sm leading-relaxed text-bone/55">
                                        {m.note}
                                    </p>
                                </Reveal>

                                <div className="mt-8 flex items-center" aria-hidden="true">
                                    <span className="h-px flex-1 bg-gold/25 transition-colors duration-500 group-hover:bg-gold/70" />
                                    <span className="relative mx-2 flex size-3 items-center justify-center">
                                        <span className="absolute inset-0 rounded-full bg-gold opacity-15 transition-all duration-700 ease-out group-hover:scale-[2.8] group-hover:opacity-0" />
                                        <span className="size-1.5 rounded-full bg-gold transition-transform duration-500 group-hover:scale-150" />
                                    </span>
                                    {last ? null : (
                                        <span className="h-px flex-1 bg-gold/25 transition-colors duration-500 group-hover:bg-gold/70" />
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}