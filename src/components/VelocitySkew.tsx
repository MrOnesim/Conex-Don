"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Inclinaison vélocité : le contenu se tord légèrement (skewY) pendant
 * le scroll, comme une bande de tissu entraînée par le doigt, puis
 * revient à plat. Amplitude bornée (±max deg), lissée par interpolation.
 * Aucun effet si prefers-reduced-motion.
 */
export function VelocitySkew({ children, max = 2.2 }: { children: ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;

    let last = window.scrollY;
    let target = 0;
    let current = 0;
    let frame = 0;
    let running = false;

    const loop = () => {
      current += (target - current) * 0.14;
      target *= 0.88;
      if (Math.abs(current) < 0.02 && Math.abs(target) < 0.02) {
        current = 0;
        target = 0;
        node.style.transform = "";
        running = false;
        return;
      }
      node.style.transform = `skewY(${current.toFixed(2)}deg)`;
      frame = requestAnimationFrame(loop);
    };

    const kick = () => {
      if (!running) {
        running = true;
        frame = requestAnimationFrame(loop);
      }
    };

    const onScroll = () => {
      const delta = window.scrollY - last;
      last = window.scrollY;
      target = Math.max(-max, Math.min(max, target + delta * 0.025));
      kick();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [max]);

  return (
    <div ref={ref} className="will-change-transform">
      {children}
    </div>
  );
}
