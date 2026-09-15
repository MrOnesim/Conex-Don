"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;
    let frame = 0;
    let cancelled = false;

    const start = async () => {
      if (cancelled) return;
      const mod = await import("lenis");
      const Lenis = mod.default;
      const instance = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });
      lenis = instance as unknown as { raf: (time: number) => void; destroy: () => void };
      const raf = (time: number) => {
        instance.raf(time);
        frame = window.requestAnimationFrame(raf);
      };
      frame = window.requestAnimationFrame(raf);
    };

    void start();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return null;
}
