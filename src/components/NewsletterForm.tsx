"use client";

import { useId, useState, type FormEvent } from "react";

import {
  FormFeedback,
  FormSubmitButton,
  type SubmissionState,
} from "@/components/FormSubmitButton";

const emailError = (email: string) => {
  if (!email.trim()) return "Indiquez votre adresse email.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return "Cette adresse email semble incomplète.";
  return "";
};

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");
  const id = useId().replace(/:/g, "");
  const inputId = `newsletter-${id}`;
  const error = touched ? emailError(email) : "";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    const invalid = emailError(email);
    if (invalid) {
      setState("error");
      setMessage("Vérifiez votre adresse email avant de rejoindre la liste.");
      return;
    }

    setState("loading");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error ?? "Erreur");
      setState("done");
      setMessage(data.message ?? "C'est noté. Tu es sur la liste ALOBA.");
      setEmail("");
      setTouched(false);
    } catch (submitError) {
      setState("error");
      setMessage(
        submitError instanceof Error && submitError.message !== "Erreur"
          ? submitError.message
          : "Une erreur est survenue. Réessayez.",
      );
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="w-full">
      <label htmlFor={inputId} className="field-label">
        Liste ALOBA — sorties, concerts, rassemblement
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <div
          className="field-wrap min-w-0 flex-1"
          data-valid={touched && email && !error ? "true" : "false"}
        >
          <input
            id={inputId}
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (state !== "idle") setState("idle");
              if (message) setMessage("");
            }}
            onBlur={() => setTouched(true)}
            placeholder="votre@email.com"
            className="field-control field-control--flush"
            autoComplete="email"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
          <p
            id={`${inputId}-error`}
            className="field-message"
            aria-live="polite"
          >
            {error}
          </p>
        </div>
        <FormSubmitButton
          state={state}
          idleLabel="Rejoindre"
          loadingLabel="Ajout…"
          doneLabel="Bienvenue"
          className="h-12 shrink-0"
        />
      </div>
      {state !== "idle" ? (
        <FormFeedback state={state} className="mt-2">
          {message}
        </FormFeedback>
      ) : null}
    </form>
  );
}
