"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { EmptyState } from "@/components/EmptyState";
import {
  FormFeedback,
  FormSubmitButton,
  type SubmissionState,
} from "@/components/FormSubmitButton";
import { motionEase } from "@/components/motion";

export type AlobaPost = {
  id: number;
  displayName: string;
  handle: string | null;
  city: string | null;
  mood: string | null;
  message: string;
  createdAt: string;
};

const moods = [
  "Aloba !",
  "Mode avion",
  "Ayato forever",
  "Héritage vivant",
  "Trop vrai",
];
const tilts = [
  "-rotate-1",
  "rotate-[0.8deg]",
  "-rotate-[0.6deg]",
  "rotate-[1.2deg]",
];
const emptyForm = {
  displayName: "",
  handle: "",
  city: "",
  mood: moods[0],
  message: "",
};
type AlobaValues = typeof emptyForm;
type AlobaField = keyof AlobaValues;
type Touched = Partial<Record<AlobaField, boolean>>;

function getError(key: AlobaField, value: string) {
  if (key === "displayName" && !value.trim())
    return "Ajoutez votre prénom ou votre nom.";
  if (key === "message" && !value.trim())
    return "Écrivez un mot à partager avec le duo et la communauté.";
  return "";
}

function Field({
  id,
  label,
  required,
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
        {required ? (
          <span className="field-label__required" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      <p id={`${id}-error`} className="field-message" aria-live="polite">
        {error}
      </p>
    </div>
  );
}

export function AlobaForm({ onAdded }: { onAdded: (post: AlobaPost) => void }) {
  const [form, setForm] = useState<AlobaValues>(emptyForm);
  const [touched, setTouched] = useState<Touched>({});
  const [state, setState] = useState<SubmissionState>("idle");
  const [feedback, setFeedback] = useState("");

  const errors = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(form) as AlobaField[]).map((key) => [
          key,
          touched[key] ? getError(key, form[key]) : "",
        ]),
      ) as Record<AlobaField, string>,
    [form, touched],
  );

  function update(key: AlobaField, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (state !== "idle") setState("idle");
    if (feedback) setFeedback("");
  }

  function markTouched(key: AlobaField) {
    setTouched((previous) => ({ ...previous, [key]: true }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const allTouched = Object.fromEntries(
      (Object.keys(form) as AlobaField[]).map((key) => [key, true]),
    ) as Touched;
    setTouched(allTouched);

    const invalid = (Object.keys(form) as AlobaField[]).find((key) =>
      getError(key, form[key]),
    );
    if (invalid) {
      setState("error");
      setFeedback("Il manque une information avant la publication.");
      document.getElementById(`aloba-${invalid}`)?.focus();
      return;
    }

    setState("loading");
    setFeedback("");
    try {
      const response = await fetch("/api/aloba", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as {
        post?: AlobaPost;
        error?: string;
      };
      if (!response.ok || !data.post) throw new Error(data.error ?? "Erreur");
      onAdded(data.post);
      setForm(emptyForm);
      setTouched({});
      setState("done");
      setFeedback("Publié sur le mur. Aloba !");
    } catch (submitError) {
      setState("error");
      setFeedback(
        submitError instanceof Error && submitError.message !== "Erreur"
          ? submitError.message
          : "Publication impossible pour le moment.",
      );
    }
  }

  const inputProps = (key: AlobaField) => ({
    onBlur: () => markTouched(key),
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `aloba-${key}-error` : undefined,
  });

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
        <Field
          id="aloba-displayName"
          label="Prénom / nom"
          required
          error={errors.displayName}
          valid={Boolean(
            touched.displayName && form.displayName && !errors.displayName,
          )}
        >
          <input
            id="aloba-displayName"
            value={form.displayName}
            onChange={(event) => update("displayName", event.target.value)}
            className="field-control"
            placeholder="Sètondji"
            autoComplete="name"
            {...inputProps("displayName")}
          />
        </Field>
        <Field id="aloba-city" label="Ville" error="" valid={false}>
          <input
            id="aloba-city"
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
            className="field-control"
            placeholder="Cotonou"
            autoComplete="address-level2"
          />
        </Field>
        <Field id="aloba-handle" label="Réseau social" error="" valid={false}>
          <input
            id="aloba-handle"
            value={form.handle}
            onChange={(event) => update("handle", event.target.value)}
            className="field-control"
            placeholder="@moncompte"
          />
        </Field>
        <Field id="aloba-mood" label="Humeur" error="" valid={false}>
          <select
            id="aloba-mood"
            value={form.mood}
            onChange={(event) => update("mood", event.target.value)}
            className="field-control"
          >
            {moods.map((mood) => (
              <option key={mood} value={mood} className="bg-ink">
                {mood}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field
        id="aloba-message"
        label="Ton message au duo"
        required
        error={errors.message}
        valid={Boolean(touched.message && form.message && !errors.message)}
      >
        <textarea
          id="aloba-message"
          rows={4}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          className="field-control"
          placeholder="Ce que leur musique a changé pour toi…"
          {...inputProps("message")}
        />
      </Field>
      <div className="flex flex-col gap-4 border-t border-bone/12 pt-5 sm:flex-row sm:items-center">
        <FormSubmitButton
          state={state}
          idleLabel="Publier sur le mur"
          loadingLabel="Publication…"
          doneLabel="Publié"
        />
        {state === "idle" ? (
          <p className="text-xs leading-relaxed text-bone/40">
            Les messages apparaissent sur le mur de la communauté.
          </p>
        ) : (
          <FormFeedback state={state}>{feedback}</FormFeedback>
        )}
      </div>
    </form>
  );
}

export function AlobaWall({ initialPosts }: { initialPosts: AlobaPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-14">
        <div className="panel panel--raised h-fit p-6 sm:p-8 lg:sticky lg:top-28">
          <p className="eyebrow text-gold">Ton mot</p>
          <h3 className="display-xl mt-4 text-3xl sm:text-4xl">
            ÉCRIRE AU DUO
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/60">
            Quelques lignes, une humeur et une ville : le mur se construit avec
            les voix ALOBA.
          </p>
          <div className="mt-7">
            <AlobaForm
              onAdded={(post) => setPosts((previous) => [post, ...previous])}
            />
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4 border-b border-bone/12 pb-4">
            <p className="eyebrow text-bone/45">Mur de la communauté</p>
            <p
              className="text-[0.63rem] font-semibold uppercase tracking-[0.16em] text-gold"
              aria-live="polite"
            >
              {posts.length} message{posts.length > 1 ? "s" : ""} · #ALOBA
            </p>
          </div>
          {posts.length > 0 ? (
            <ul
              className="mt-7 columns-1 gap-4 pt-3 sm:columns-2"
              aria-label="Messages de la communauté"
            >
              <AnimatePresence initial={false}>
                {posts.map((post, postIndex) => (
                  <li
                    key={post.id}
                    className={`postcard mb-5 break-inside-avoid border border-bone/12 bg-ink-soft p-5 ${tilts[postIndex % tilts.length]}`}
                  >
                    <motion.div
                      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }
                      }
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { duration: 0.34, ease: motionEase }
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-[0.08em] text-bone/90">
                            {post.displayName}
                          </p>
                          {[post.handle, post.city].filter(Boolean).length >
                          0 ? (
                            <p className="mt-1 text-[0.6rem] uppercase tracking-[0.14em] text-bone/40">
                              {[post.handle, post.city]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          ) : null}
                        </div>
                        {post.mood ? (
                          <span className="shrink-0 border border-gold/35 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-gold">
                            {post.mood}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-5 text-sm leading-relaxed text-bone/70">
                        {post.message}
                      </p>
                    </motion.div>
                  </li>
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <div className="mt-7">
              <EmptyState
                compact
                eyebrow="Le mur attend son premier mot"
                title="Faites entendre votre voix"
                description="Partagez un souvenir, une phrase ou votre titre préféré avec la communauté ALOBA."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
