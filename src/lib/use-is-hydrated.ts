"use client";

import { useSyncExternalStore } from "react";

let hydrated = false;
const subscribers = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

export function markHydrated(): void {
  if (hydrated) return;
  hydrated = true;
  subscribers.forEach((callback) => callback());
}

export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => hydrated,
    () => false,
  );
}