"use client";

import { useEffect, type RefObject } from "react";

type FocusTrapOptions = {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

// More than one transient surface can exist momentarily (for example the
// search palette above mobile navigation). Only the most recently opened
// surface should receive Tab/Escape handling.
const activeTrapStack: symbol[] = [];

/**
 * Keeps keyboard focus inside a transient dialog and restores it on close.
 * It is intentionally dependency-free so every overlay shares the same
 * accessible behaviour (search, video and player).
 */
export function useFocusTrap({
  active,
  containerRef,
  initialFocusRef,
  onEscape,
}: FocusTrapOptions) {
  useEffect(() => {
    if (!active) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const trapId = Symbol("focus-trap");
    activeTrapStack.push(trapId);
    let frame = window.requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;
      const candidates = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((node) => !node.hasAttribute("inert"));
      (initialFocusRef?.current ?? candidates[0] ?? container).focus({
        preventScroll: true,
      });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (activeTrapStack.at(-1) !== trapId) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape?.();
        return;
      }
      if (event.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;
      const candidates = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((node) => !node.hasAttribute("inert"));
      if (candidates.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = candidates[0];
      const last = candidates[candidates.length - 1];
      const current = document.activeElement;
      if (
        event.shiftKey &&
        (current === first || !container.contains(current))
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      const stackIndex = activeTrapStack.lastIndexOf(trapId);
      if (stackIndex >= 0) activeTrapStack.splice(stackIndex, 1);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [active, containerRef, initialFocusRef, onEscape]);
}
