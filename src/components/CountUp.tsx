"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Compteur animé : le nombre monte à l'entrée dans le viewport
 * (ease-out cubique), puis reste figé. Format français conservé
 * (espaces de milliers, virgule décimale, suffixe intact : « K+ », « M »…).
 * Désactivé si prefers-reduced-motion : la valeur finale s'affiche directement.
 */
export function CountUp({ value, duration = 1500 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const match = value.match(/^([\d.,\s\u202f\u00a0]+)(.*)$/);
    if (!match) return;
    const raw = match[1].replace(/[\s\u202f\u00a0]/g, "").replace(",", ".");
    const target = Number.parseFloat(raw);
    if (!Number.isFinite(target)) return;
    const decimals = (raw.split(".")[1] ?? "").length;
    const suffix = match[2] ?? "";

    const format = (amount: number) => {
      const [int, dec] = amount.toFixed(decimals).split(".");
      return `${Number(int).toLocaleString("fr-FR")}${dec ? `,${dec}` : ""}${suffix}`;
    };

    let frame = 0;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(format(target * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          setDisplay(format(0));
          frame = requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
