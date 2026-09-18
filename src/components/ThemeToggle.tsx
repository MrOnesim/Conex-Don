"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useTheme } from "@/components/ThemeProvider";
import { motionEase } from "@/components/motion";
import { useIsHydrated } from "@/lib/use-is-hydrated";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const mounted = useIsHydrated();
  const reducedMotion = useReducedMotion() ?? false;
  // Before hydration, retain the dark server shell to prevent a mismatch.
  const dark = mounted ? theme === "dark" : true;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="icon-control overflow-hidden"
      aria-label={dark ? "Activer le mode clair" : "Activer le mode sombre"}
      aria-pressed={!dark}
      title={dark ? "Mode clair" : "Mode sombre"}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={dark ? "sun" : "moon"}
          className="flex"
          initial={
            reducedMotion ? false : { opacity: 0, rotate: -35, scale: 0.8 }
          }
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={
            reducedMotion ? undefined : { opacity: 0, rotate: 35, scale: 0.8 }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.18, ease: motionEase }
          }
          aria-hidden="true"
        >
          {dark ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gold"
            >
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.28 5.28l1.42 1.42M17.3 17.3l1.42 1.42M18.72 5.28 17.3 6.7M6.7 17.3l-1.42 1.42" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-clay"
            >
              <path d="M20.7 15.1A8.8 8.8 0 0 1 8.9 3.3 8.8 8.8 0 1 0 20.7 15.1Z" />
            </svg>
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
