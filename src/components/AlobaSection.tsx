"use client";

import { useState } from "react";

export type AlobaPost = {
  id: number;
  displayName: string;
  handle: string | null;
  city: string | null;
  mood: string | null;
  message: string;
  createdAt: string;
};

const moods = ["Aloba !", "Mode avion", "Ayato forever", "Héritage vivant", "Trop vrai"];

export function AlobaForm({ onAdded }: { onAdded: (post: AlobaPost) => void }) {
  const [form, setForm] = useState({
    displayName: "",
    handle: "",
    city: "",
    mood: moods[0],
    message: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      const response = await fetch("/api/aloba", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { post?: AlobaPost; error?: string };
      if (!response.ok || !data.post) throw new Error(data.error ?? "Erreur");
      onAdded(data.post);
      setForm({ displayName: "", handle: "", city: "", mood: moods[0], message: "" });
      setState("done");
      setFeedback("Publié. Aloba !");
    } catch (error) {
      setState("error");
      setFeedback(
        error instanceof Error && error.message !== "Erreur"
          ? error.message
          : "Publication impossible pour le moment.",
      );
    }
  }

  const field =
    "w-full border border-bone/20 bg-transparent px-4 py-3 text-sm text-bone outline-none transition-colors placeholder:text-bone/30 focus:border-gold";
  const label = "eyebrow text-bone/40";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="aloba-name">
            Prénom / nom
          </label>
          <input
            id="aloba-name"
            required
            value={form.displayName}
            onChange={(event) => update("displayName", event.target.value)}
            className={`mt-2 ${field}`}
            placeholder="Sètondji"
          />
        </div>
        <div>
          <label className={label} htmlFor="aloba-city">
            Ville
          </label>
          <input
            id="aloba-city"
            value={form.city}
            onChange={(event) => update("city", event.target.value)}
            className={`mt-2 ${field}`}
            placeholder="Cotonou"
          />
        </div>
        <div>
          <label className={label} htmlFor="aloba-handle">
            Réseau social
          </label>
          <input
            id="aloba-handle"
            value={form.handle}
            onChange={(event) => update("handle", event.target.value)}
            className={`mt-2 ${field}`}
            placeholder="@moncompte"
          />
        </div>
        <div>
          <label className={label} htmlFor="aloba-mood">
            Humeur
          </label>
          <select
            id="aloba-mood"
            value={form.mood}
            onChange={(event) => update("mood", event.target.value)}
            className={`mt-2 ${field}`}
          >
            {moods.map((mood) => (
              <option key={mood} value={mood} className="bg-ink">
                {mood}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={label} htmlFor="aloba-message">
          Ton message au duo
        </label>
        <textarea
          id="aloba-message"
          required
          rows={4}
          value={form.message}
          onChange={(event) => update("message", event.target.value)}
          className={`mt-2 ${field}`}
          placeholder="Ce que leur musique a changé pour toi…"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "loading"}
          className="bg-bone px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold disabled:opacity-50"
        >
          {state === "loading" ? "Publication…" : "Publier"}
        </button>
        {feedback ? (
          <p className={`text-xs ${state === "error" ? "text-clay" : "text-gold"}`} role="status">
            {feedback}
          </p>
        ) : (
          <p className="text-xs text-bone/40">
            Les messages sont publiés sur le mur de la communauté.
          </p>
        )}
      </div>
    </form>
  );
}

export function AlobaWall({ initialPosts }: { initialPosts: AlobaPost[] }) {
  const [posts, setPosts] = useState(initialPosts);

  return (
    <div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-14">
        <div className="border border-bone/12 p-6 sm:p-8">
          <p className="eyebrow text-bone/40">Ton mot</p>
          <h3 className="display-xl mt-4 text-3xl sm:text-4xl">ÉCRIRE AU DUO</h3>
          <div className="mt-7">
            <AlobaForm onAdded={(post) => setPosts((prev) => [post, ...prev])} />
          </div>
        </div>

        <div>
          <p className="eyebrow text-bone/40">
            {posts.length} message{posts.length > 1 ? "s" : ""} · #ALOBA
          </p>
          <ul className="mt-5 columns-1 gap-4 sm:columns-2">
            {posts.map((post) => (
              <li key={post.id} className="mb-4 break-inside-avoid border border-bone/12 p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm uppercase tracking-[0.1em] text-bone/90">
                    {post.displayName}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-gold">
                    {post.mood}
                  </span>
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-bone/35">
                  {[post.handle, post.city].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-bone/70">{post.message}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
