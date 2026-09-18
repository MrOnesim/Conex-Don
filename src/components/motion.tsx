"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Motion tokens shared by the interface. They deliberately favour short,
 * transform/opacity-only transitions so navigation feels immediate rather
 * than theatrical.
 */
export const motionEase = [0.16, 1, 0.3, 1] as const;
export const motionSpring = {
  type: "spring" as const,
  stiffness: 360,
  damping: 32,
  mass: 0.72,
};

export function PageMotion({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className="page-motion"
      initial={
        reducedMotion ? false : { opacity: 0, y: 10, filter: "blur(3px)" }
      }
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={
        reducedMotion ? { duration: 0 } : { duration: 0.46, ease: motionEase }
      }
    >
      {children}
    </motion.div>
  );
}

/** A small entrance wrapper for client-side states and empty views. */
export function SoftEnter({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 0.36, delay, ease: motionEase }
      }
    >
      {children}
    </motion.div>
  );
}
