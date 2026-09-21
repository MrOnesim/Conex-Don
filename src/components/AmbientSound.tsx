"use client";

import { useAmbientSound } from "@/lib/useAmbientSound";

export function AmbientSound({ src, volume = 0.08 }: { src: string; volume?: number }) {
  useAmbientSound(src, volume);
  return null;
}