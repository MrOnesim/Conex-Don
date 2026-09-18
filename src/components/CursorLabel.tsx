"use client";

import { useEffect, useRef } from "react";

/**
 * Curseur éditorial : utile uniquement pour donner le verbe d'action des
 * visuels interactifs. Désactivé sur tactile et en mouvement réduit.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let label = "";

    const onMove = (event: MouseEvent) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        node.style.transform = `translate3d(${event.clientX - 46}px, ${event.clientY - 46}px, 0)`;
      });
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor]",
      );
      if (target) {
        const next = target.dataset.cursor ?? "";
        if (next !== label) {
          label = next;
          node.textContent = label;
        }
        node.style.opacity = "1";
        node.style.width = "92px";
        node.style.height = "92px";
      } else {
        label = "";
        node.style.opacity = "0";
        node.style.width = "0px";
        node.style.height = "0px";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] flex h-0 w-0 items-center justify-center rounded-full border border-gold bg-ink/70 text-center text-[9px] font-semibold uppercase leading-tight tracking-[0.18em] text-gold opacity-0 transition-[opacity,width,height,transform] duration-150"
      style={{ backdropFilter: "blur(2px)" }}
    />
  );
}
