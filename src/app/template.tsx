"use client";

import type { ReactNode } from "react";

import { PageMotion } from "@/components/motion";

/**
 * App Router remounts this template for each route. The persistent shell and
 * audio engine remain untouched while the next page settles in softly.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <PageMotion>{children}</PageMotion>;
}
