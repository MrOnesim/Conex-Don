"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { FormFeedback, FormSubmitButton, type SubmissionState } from "@/components/FormSubmitButton";

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

const emptyForm = {
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
};

type BookingValues = typeof emptyForm;
type FieldName = keyof BookingValues;
type Touched = Partial<Record<FieldName, boolean>>;

function validationError(key: FieldName, value: string) {
  if (key === "name" && !value.trim()) return "Indiquez votre nom pour que l'équipe puisse vous répondre.";
  if (key === "email") {
    if (!value.trim()) return "Indiquez une adresse email de contact.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Cette adresse email semble incomplète.";
  }
  if (key === "message" && !value.trim()) return "Ajoutez quelques détails sur votre événement.";
  return "";
}

function Field({
  id,
  label,
  required = false,
  error,
  valid,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error: string;
  valid: boolean;
  children: ReactNode;
}) {
  return (
    <div className="field-wrap" data-valid={valid ? "true" : "false"}>
      <label className="field-label" htmlFor={id}>
        {label}
        {required ? <span className="field-label__required" aria-hidden="true">*</span> : null}
      </label>
      {children}
      <p id={`${id}-error`} className="field-message" aria-live="polite">
        {error}
      </p>
    </div>
  );
}

export function BookingForm() {
  const [form, setForm] = useState<BookingValues>(emptyForm);
  const [touched, setTouched] = useState<Touched>({});
  const [state, setState] = useState<SubmissionState>("idle");
  const [feedback, setFeedback] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  const errors = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(form) as FieldName[]).map((key) => [
          key,
          touched[key] ? validationError(key, form[key]) : "",
        ]),
      ) as Record<FieldName, string>,
    [form, touched],
  );

  function update(key: FieldName, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (state !== "idle") setState("idle");
    if (feedback) setFeedback("");
  }

  function markTouched(key: FieldName) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTouched = Object.fromEntries(
      (Object.keys(form) as FieldName[]).map((key) => [key, true]),
    ) as Touched;
    setTouched(nextTouched);

    const firstInvalid = (Object.keys(form) as FieldName[]).find((key) => validationError(key, form[key]));
    if (firstInvalid) {
      setState("error");
      setFeedback("Vérifiez les champs signalés avant d'envoyer votre demande.");
      document.getElementById(`bk-${firstInvalid}`)?.focus();
      return;
    }

    setState("loading");
    setFeedback("");
    setReference(null);
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
        "Demande enregistrée. L'équipe revient vers vous rapidement — vous pouvez ajouter des précisions par email.",
      );
      setForm(emptyForm);
      setTouched({});
    } catch (error) {
      setState("error");
      setFeedback(
        error instanceof Error && error.message !== "Erreur"
          ? error.message
          : "Envoi impossible pour le moment. Écrivez directement à booking.conexetdon@gmail.com.",
      );
    }
  }

  const fieldProps = (key: FieldName) => ({
    onBlur: () => markTouched(key),
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `bk-${key}-error` : undefined,
  });

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-x-5 gap-y-1 sm:grid-cols-2">
        <Field id="bk-name" label="Nom" required error={errors.name} valid={Boolean(touched.name && form.name && !errors.name)}>
          <input
            id="bk-name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            className="field-control"
            placeholder="Nom et prénom"
            autoComplete="name"
            {...fieldProps("name")}
          />
        </Field>
        <Field id="bk-organization" label="Organisation" error="" valid={false}>
          <input
            id="bk-organization"
            value={form.organization}
            onChange={(event) => update("organization", event.target.value)}
            className="field-control"
            placeholder="Structure, label, marque"
            autoComplete="organization"
          />
        </Field>
        <Field id="bk-email" label="Email" required error={errors.email} valid={Boolean(touched.email && form.email && !errors.email)}>
          <input
            id="bk-email"
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className="field-control"
            placeholder="vous@structure.com"
            autoComplete="email"
            {...fieldProps("email")}
          />
        </Field>
        <Field id="bk-phone" label="Téléphone" error="" valid={false}>
          <input
            id="bk-phone"
            type="tel"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            className="field-control"
            placeholder="+229 …"
            autoComplete="tel"
          />
        </Field>
        <Field id="bk-country" label="Pays" error="" valid={false}>
          <input
            id="bk-country"
            value={form.country}
            onChange={(event) => update("country", event.target.value)}
            className="field-control"
            placeholder="Bénin"
            autoComplete="country-name"
          />
        </Field>
        <Field id="bk-city" label="Ville" error="" valid={false}>
          <input
            id="bk-city"
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
            className="field-control"
            placeholder="Cotonou"
            autoComplete="address-level2"
          />
        </Field>
        <Field id="bk-eventType" label="Type d'événement" error="" valid={false}>
          <select
            id="bk-eventType"
            value={form.eventType}
            onChange={(event) => update("eventType", event.target.value)}
            className="field-control"
          >
            {eventTypes.map((type) => (
              <option key={type} value={type} className="bg-ink">
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field id="bk-eventDate" label="Date envisagée" error="" valid={false}>
          <input
            id="bk-eventDate"
            type="date"
            value={form.eventDate}
            onChange={(event) => update("eventDate", event.target.value)}
            className="field-control"
          />
        </Field>
        <Field id="bk-capacity" label="Capacité / jauge" error="" valid={false}>
          <input
            id="bk-capacity"
            value={form.capacity}
            onChange={(event) => update("capacity", event.target.value)}
            className="field-control"
            placeholder="2 000 places"
          />
        </Field>
        <Field id="bk-budget" label="Budget indicatif" error="" valid={false}>
          <input
            id="bk-budget"
            value={form.budget}
            onChange={(event) => update("budget", event.target.value)}
            className="field-control"
            placeholder="À préciser / fourchette FCFA"
          />
        </Field>
      </div>

      <Field id="bk-message" label="Message" required error={errors.message} valid={Boolean(touched.message && form.message && !errors.message)}>
        <textarea
          id="bk-message"
          rows={5}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          className="field-control"
          placeholder="Contexte, ligne d'affichage, conditions techniques, attentes…"
          {...fieldProps("message")}
        />
      </Field>

      <div className="flex flex-col gap-4 border-t border-bone/12 pt-6 sm:flex-row sm:items-center">
        <FormSubmitButton
          state={state}
          idleLabel="Envoyer la demande"
          loadingLabel="Transmission…"
          doneLabel="Demande envoyée"
        />
        {state === "idle" ? (
          <p className="max-w-md text-xs leading-relaxed text-bone/40">
            Les demandes sont enregistrées puis transmises à l&apos;équipe booking.
          </p>
        ) : (
          <FormFeedback state={state}>
            {feedback}
            {reference ? ` Référence : ${reference}.` : ""}
          </FormFeedback>
        )}
      </div>
    </form>
  );
}
