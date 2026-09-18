"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { motionEase } from "@/components/motion";

export type SubmissionState = "idle" | "loading" | "done" | "error";

const labels: Record<SubmissionState, string> = {
  idle: "",
  loading: "Envoi…",
  done: "Envoyé",
  error: "Réessayer",
};

export function FormSubmitButton({
  state,
  idleLabel,
  loadingLabel,
  doneLabel,
  errorLabel,
  className = "",
}: {
  state: SubmissionState;
  idleLabel: string;
  loadingLabel?: string;
  doneLabel?: string;
  errorLabel?: string;
  className?: string;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const label =
    state === "loading"
      ? (loadingLabel ?? labels.loading)
      : state === "done"
        ? (doneLabel ?? labels.done)
        : state === "error"
          ? (errorLabel ?? labels.error)
          : idleLabel;

  return (
    <button
      type="submit"
      disabled={state === "loading"}
      aria-busy={state === "loading"}
      className={`button button--solid button--submit ${
        state === "loading" ? "button--loading" : ""
      } ${state === "done" ? "button--success" : ""} ${className}`}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={`${state}-${label}`}
          className="button__label"
          initial={reducedMotion ? false : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -5 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.16, ease: motionEase }
          }
        >
          {state === "loading" ? (
            <span className="button__spinner" aria-hidden="true" />
          ) : null}
          {state === "done" ? (
            <span className="button__check" aria-hidden="true">
              ✓
            </span>
          ) : null}
          {label}
        </motion.span>
      </AnimatePresence>
      <span className="button__arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}

export function FormFeedback({
  state,
  children,
  className = "",
}: {
  state: SubmissionState;
  children: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  if (state === "idle" || !children) return null;
  const isError = state === "error";

  return (
    <motion.p
      className={`form-feedback ${isError ? "form-feedback--error" : "form-feedback--success"} ${className}`}
      role={isError ? "alert" : "status"}
      initial={reducedMotion ? false : { opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reducedMotion ? { duration: 0 } : { duration: 0.24, ease: motionEase }
      }
    >
      <span aria-hidden="true">{isError ? "!" : "✓"}</span>
      {children}
    </motion.p>
  );
}
