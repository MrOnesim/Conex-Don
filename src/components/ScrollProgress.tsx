"use client";

import { useEffect, useRef } from "react";

/**
 * Filet de progression de lecture — dégradé or → argile, 2 px,
 * fixé sous le bord haut du viewport. Transform-only (aucun reflow).
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const node = ref.current;
      if (!node) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      node.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]" aria-hidden="true">
      <div ref={ref} className="hairline-gold h-full origin-left scale-x-0" />
    </div>
  );
}
