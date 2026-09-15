"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Erreur");
      setState("done");
      setMessage(data.message ?? "C'est noté. Aloba !");
      setEmail("");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error && error.message !== "Erreur"
          ? error.message
          : "Une erreur est survenue. Réessayez.",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <label htmlFor="newsletter-email" className="eyebrow text-bone/45">
        Liste ALOBA — sorties, concerts, rassemblement
      </label>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="votre@email.com"
          className="flex-1 border border-bone/20 bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors placeholder:text-bone/30 focus:border-gold"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="bg-bone px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold disabled:opacity-50"
        >
          {state === "loading" ? "Envoi…" : "Rejoindre"}
        </button>
      </div>
      {message ? (
        <p
          className={`mt-3 text-xs ${state === "error" ? "text-clay" : "text-gold"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
