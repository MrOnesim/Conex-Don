"use client";

import { useState } from "react";

const eventTypes = [
  "Concert / show",
  "Festival",
  "Showcase",
  "Activation de marque",
  "Événement privé",
  "Interview / média",
  "Partenariat",
  "Autre",
];

const field =
  "w-full border border-bone/20 bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors placeholder:text-bone/30 focus:border-gold";
const label = "eyebrow text-bone/40";

export function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    eventType: eventTypes[0],
    eventDate: "",
    capacity: "",
    budget: "",
    message: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setFeedback("");
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { reference?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Erreur");
      setState("done");
      setReference(data.reference ?? null);
      setFeedback(
        "Demande enregistrée. L'équipe revient vers vous rapidement — merci de préciser toute information complémentaire par email.",
      );
      setForm({
        name: "",
        organization: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        eventType: eventTypes[0],
        eventDate: "",
        capacity: "",
        budget: "",
        message: "",
      });
    } catch (error) {
      setState("error");
      setFeedback(
        error instanceof Error && error.message !== "Erreur"
          ? error.message
          : "Envoi impossible pour le moment. Écrivez directement à booking.conexetdon@gmail.com.",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="bk-name">
            Nom *
          </label>
          <input
            id="bk-name"
            required
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            className={`mt-2 ${field}`}
            placeholder="Nom et prénom"
          />
        </div>
        <div>
          <label className={label} htmlFor="bk-org">
            Organisation
          </label>
          <input
            id="bk-org"
            value={form.organization}
            onChange={(event) => update("organization", event.target.value)}
            className={`mt-2 ${field}`}
            placeholder="Structure, label, marque"
          />
        </div>
        <div>
          <label className={label} htmlFor="bk-email">
            Email *
          </label>
          <input
            id="bk-email"
            type="email"
            required
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className={`mt-2 ${field}`}
            placeholder="vous@structure.com"
          />
        </div>
        <div>
          <label className={label} htmlFor="bk-phone">
            Téléphone
          </label>
          <input
            id="bk-phone"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={`mt-2 ${field}`}
            placeholder="+229 …"
          />
        </div>
        <div>
          <label className={label} htmlFor="bk-country">
            Pays
          </label>
          <input
            id="bk-country"
            value={form.country}
            onChange={(event) => update("country", event.target.value)}
            className={`mt-2 ${field}`}
            placeholder="Bénin"
          />
        </div>
        <div>
          <label className={label} htmlFor="bk-city">
            Ville
          </label>
          <input
            id="bk-city"
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
            className={`mt-2 ${field}`}
            placeholder="Cotonou"
          />
        </div>
        <div>
          <label className={label} htmlFor="bk-type">
            Type d&apos;événement
          </label>
          <select
            id="bk-type"
            value={form.eventType}
            onChange={(event) => update("eventType", event.target.value)}
            className={`mt-2 ${field}`}
          >
            {eventTypes.map((type) => (
              <option key={type} value={type} className="bg-ink">
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="bk-date">
            Date envisagée
          </label>
          <input
            id="bk-date"
            type="date"
            value={form.eventDate}
            onChange={(event) => update("eventDate", event.target.value)}
            className={`mt-2 ${field}`}
          />
        </div>
        <div>
          <label className={label} htmlFor="bk-capacity">
            Capacité / jauge
          </label>
          <input
            id="bk-capacity"
            value={form.capacity}
            onChange={(event) => update("capacity", event.target.value)}
            className={`mt-2 ${field}`}
            placeholder="2 000 places"
          />
        </div>
        <div>
          <label className={label} htmlFor="bk-budget">
            Budget indicatif
          </label>
          <input
            id="bk-budget"
            value={form.budget}
            onChange={(event) => update("budget", event.target.value)}
            className={`mt-2 ${field}`}
            placeholder="à préciser / fourchette FCFA"
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="bk-message">
          Message *
        </label>
        <textarea
          id="bk-message"
          required
          rows={5}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          className={`mt-2 ${field}`}
          placeholder="Contexte, ligne d'affichage, conditions techniques, attentes…"
        />
      </div>

      <div className="flex flex-wrap items-center gap-5 border-t border-bone/12 pt-6">
        <button
          type="submit"
          disabled={state === "loading"}
          className="bg-bone px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold disabled:opacity-50"
        >
          {state === "loading" ? "Envoi…" : "Envoyer une demande de booking"}
        </button>
        {state === "done" ? (
          <p className="text-xs text-gold" role="status">
            {feedback}
            {reference ? ` Référence : ${reference}.` : ""}
          </p>
        ) : null}
        {state === "error" ? (
          <p className="text-xs text-clay" role="alert">
            {feedback}
          </p>
        ) : null}
        {state === "idle" ? (
          <p className="text-xs text-bone/40">
            Les demandes sont enregistrées puis transmises à l&apos;équipe booking.
          </p>
        ) : null}
      </div>
    </form>
  );
}
