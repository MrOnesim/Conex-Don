"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { EmptyState } from "@/components/EmptyState";
import { motionEase } from "@/components/motion";
import { OptimizedImage } from "@/components/OptimizedImage";
import { PageHeader } from "@/components/ui";
import type { SearchResultItem, SearchResponseData } from "@/lib/search";

const categories = [
  { id: "all", label: "Tous" },
  { id: "release", label: "Musique" },
  { id: "track", label: "Morceaux" },
  { id: "video", label: "Vidéos" },
  { id: "event", label: "Live & dates" },
  { id: "news", label: "Presse" },
] as const;

const suggestions = [
  "Ayato",
  "Amapiano",
  "Dessiguimanzanbera",
  "Mode Avion",
  "Bénin",
  "Concert",
  "Cotonou",
  "La Symphonie Béninoise",
];

const typeLabel: Record<string, string> = {
  release: "Musique",
  track: "Morceau",
  video: "Vidéo",
  event: "Live",
  news: "Presse",
};

const typeAccent: Record<string, string> = {
  release: "#D6A83A",
  track: "#6F4A32",
  video: "#9E382C",
  event: "#173F32",
  news: "#D6A83A",
};

function SearchGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      aria-hidden="true"
    >
      <circle cx="10.7" cy="10.7" r="6.7" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reducedMotion = useReducedMotion() ?? false;
  const urlQuery = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("type") ?? "all";
  const validUrlCategory = categories.some(
    (category) => category.id === urlCategory,
  )
    ? urlCategory
    : "all";
  const [query, setQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(validUrlCategory);
  const [previousUrlQuery, setPreviousUrlQuery] = useState(urlQuery);
  const [previousUrlCategory, setPreviousUrlCategory] = useState(urlCategory);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const controllerRef = useRef<AbortController | null>(null);
  const requestRef = useRef(0);

  // URL changes can also come from the global command palette or browser
  // history. The guarded render update intentionally keeps the controlled
  // inputs in sync without an extra effect/render pass.
  if (urlQuery !== previousUrlQuery) {
    setPreviousUrlQuery(urlQuery);
    setQuery(urlQuery);
  }
  if (urlCategory !== previousUrlCategory) {
    setPreviousUrlCategory(urlCategory);
    setSelectedCategory(validUrlCategory);
  }

  const updateUrl = useCallback(
    (nextQuery: string, nextCategory: string) => {
      const normalized = nextQuery.trim();
      const params = new URLSearchParams();
      if (normalized.length >= 2) params.set("q", normalized);
      if (normalized.length >= 2 && nextCategory !== "all")
        params.set("type", nextCategory);
      const nextUrl =
        params.size > 0 ? `/search?${params.toString()}` : "/search";
      startTransition(() => router.replace(nextUrl, { scroll: false }));
    },
    [router, startTransition],
  );

  const fetchResults = useCallback(async (value: string, category: string) => {
    const normalized = value.trim();
    if (normalized.length < 2) {
      controllerRef.current?.abort();
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const requestId = ++requestRef.current;
    setLoading(true);
    setError("");

    try {
      const endpoint = `/api/search?q=${encodeURIComponent(normalized)}&type=${encodeURIComponent(category)}&limit=30`;
      const response = await fetch(endpoint, { signal: controller.signal });
      if (!response.ok)
        throw new Error("La recherche est momentanément indisponible.");
      const data: SearchResponseData = await response.json();
      if (requestId !== requestRef.current) return;
      setResults(data.results || []);
    } catch (searchError) {
      if (controller.signal.aborted || requestId !== requestRef.current) return;
      setResults([]);
      setError(
        searchError instanceof Error
          ? searchError.message
          : "La recherche est momentanément indisponible.",
      );
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const normalized = query.trim();
      updateUrl(query, selectedCategory);
      if (normalized.length >= 2)
        void fetchResults(normalized, selectedCategory);
      else {
        setResults([]);
        setError("");
      }
    }, 220);
    return () => window.clearTimeout(timeout);
  }, [fetchResults, query, selectedCategory, updateUrl]);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    [],
  );

  const clear = () => {
    controllerRef.current?.abort();
    setQuery("");
    setResults([]);
    setError("");
    updateUrl("", "all");
  };

  const chooseCategory = (category: string) => {
    setSelectedCategory(category);
    updateUrl(query, category);
  };

  const isSearching = query.trim().length >= 2;

  return (
    <div className="min-h-screen bg-ink pb-24 text-bone">
      <PageHeader
        eyebrow="Exploration & découverte"
        title="RECHERCHE"
        lead="Une porte d'entrée rapide vers les projets, titres, clips, archives live et articles de Conex & Don."
        accent="#D6A83A"
      />

      <section className="bg-ink">
        <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="grid grid-cols-1 gap-9 lg:grid-cols-[minmax(11rem,0.22fr)_minmax(0,0.78fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow text-gold">Index vivant</p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone/60">
                Cherchez par titre, année, lieu, artiste invité ou mot-clé. Les
                résultats se mettent à jour au fil de votre saisie.
              </p>
              <div className="mt-6 hidden border-t border-bone/12 pt-5 lg:block">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-bone/40">
                  Raccourci
                </p>
                <p className="mt-2 text-sm text-bone/70">
                  <kbd className="mr-2 border border-bone/15 px-1.5 py-0.5 text-[0.62rem] text-gold">
                    ⌘ K
                  </kbd>{" "}
                  recherche globale
                </p>
              </div>
            </aside>

            <div>
              <div className="search-field px-3 sm:px-4">
                <span className="shrink-0 text-gold">
                  <SearchGlyph />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher une chanson, un album, un concert…"
                  className="search-field__input px-3 py-4 text-base sm:text-lg"
                  autoFocus
                  autoComplete="off"
                  aria-label="Rechercher dans le site"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={clear}
                    className="icon-control h-8 min-h-8 min-w-8 border-0 text-lg"
                    aria-label="Effacer la recherche"
                  >
                    ×
                  </button>
                ) : (
                  <span className="hidden border-l border-bone/12 pl-3 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-bone/40 sm:block">
                    Au moins 2 lettres
                  </span>
                )}
              </div>

              <div className="mt-5">
                <div
                  className="filter-rail"
                  role="group"
                  aria-label="Filtrer les résultats"
                >
                  {categories.map((category) => {
                    const active = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => chooseCategory(category.id)}
                        aria-pressed={active}
                        data-active={active ? "true" : "false"}
                        className="filter-button"
                      >
                        {category.label}
                      </button>
                    );
                  })}
                  <span className="filter-total" aria-live="polite">
                    {isPending
                      ? "Mise à jour…"
                      : isSearching
                        ? `${results.length} résultat${results.length > 1 ? "s" : ""}`
                        : "Catalogue complet"}
                  </span>
                </div>
              </div>

              {!isSearching ? (
                <div className="mt-8 grid grid-cols-1 gap-px border border-bone/12 bg-bone/12 sm:grid-cols-2">
                  <div className="bg-ink p-6 sm:p-8">
                    <p className="eyebrow text-gold">Commencer ici</p>
                    <h2 className="display-xl mt-4 text-3xl sm:text-4xl">
                      QU&apos;EST-CE QUE VOUS CHERCHEZ ?
                    </h2>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-bone/60">
                      Choisissez une entrée rapide ou écrivez le nom d&apos;un
                      titre, d&apos;un lieu ou d&apos;une période.
                    </p>
                  </div>
                  <div className="bg-ink-soft p-6 sm:p-8">
                    <p className="eyebrow text-bone/45">
                      Recherches fréquentes
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {suggestions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setQuery(item)}
                          className="filter-button border border-bone/12"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-8">
                {loading ? (
                  <div
                    className="search-results-grid"
                    aria-live="polite"
                    aria-label="Recherche en cours"
                  >
                    {[0, 1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="skeleton h-[12rem]" />
                    ))}
                  </div>
                ) : null}

                {!loading && error ? (
                  <EmptyState
                    eyebrow="Recherche"
                    title="Une pause technique"
                    description={error}
                    action={
                      <button
                        type="button"
                        onClick={() =>
                          void fetchResults(query, selectedCategory)
                        }
                        className="button button--outline"
                      >
                        <span className="button__label">Réessayer</span>
                        <span className="button__arrow" aria-hidden="true">
                          →
                        </span>
                      </button>
                    }
                  />
                ) : null}

                {!loading && !error && isSearching && results.length === 0 ? (
                  <EmptyState
                    eyebrow="Aucun résultat"
                    title={`Pas encore de trace de “${query.trim()}”`}
                    description="Essayez une autre orthographe, un artiste invité, ou réinitialisez la recherche pour parcourir les entrées proposées."
                    action={
                      <button
                        type="button"
                        onClick={clear}
                        className="button button--outline"
                      >
                        <span className="button__label">Réinitialiser</span>
                        <span className="button__arrow" aria-hidden="true">
                          →
                        </span>
                      </button>
                    }
                  />
                ) : null}

                {!loading && !error && results.length > 0 ? (
                  <motion.ul
                    layout
                    className="search-results-grid"
                    aria-label="Résultats de recherche"
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {results.map((item, index) => (
                        <motion.li
                          layout
                          key={`${item.type}-${item.id}`}
                          initial={
                            reducedMotion ? false : { opacity: 0, y: 12 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            reducedMotion
                              ? { opacity: 0 }
                              : { opacity: 0, scale: 0.98 }
                          }
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : {
                                  duration: 0.28,
                                  delay: Math.min(index * 0.02, 0.16),
                                  ease: motionEase,
                                }
                          }
                        >
                          <Link href={item.url} className="search-result group">
                            <div className="relative aspect-[16/7] overflow-hidden border-b border-bone/10 bg-ink-soft">
                              {item.image ? (
                                <OptimizedImage
                                  src={item.image}
                                  alt=""
                                  fill
                                  accent={typeAccent[item.type] ?? "#D6A83A"}
                                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                                  className="h-full w-full"
                                  imageClassName="object-cover duotone transition-[filter,transform] duration-700 group-hover:scale-[1.035] group-hover:grayscale-0"
                                />
                              ) : (
                                <div
                                  className="h-full w-full"
                                  style={{
                                    backgroundColor:
                                      typeAccent[item.type] ?? "#D6A83A",
                                  }}
                                />
                              )}
                              <span className="absolute left-3 top-3 border border-bone/20 bg-ink/80 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.13em] text-bone">
                                {typeLabel[item.type] ?? item.type}
                              </span>
                              {item.year ? (
                                <span className="absolute right-3 top-3 text-[0.6rem] font-semibold tabular-nums text-bone/65">
                                  {item.year}
                                </span>
                              ) : null}
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                              <h2 className="display-xl text-2xl leading-[0.9] transition-colors duration-200 group-hover:text-gold">
                                {item.title}
                              </h2>
                              {item.subtitle ? (
                                <p className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gold/80">
                                  {item.subtitle}
                                </p>
                              ) : null}
                              {item.description ? (
                                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-bone/60">
                                  {item.description}
                                </p>
                              ) : null}
                              <span className="mt-6 flex items-center gap-2 border-t border-bone/10 pt-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-bone/50 transition-colors group-hover:text-gold">
                                Consulter{" "}
                                <span className="transition-transform duration-200 group-hover:translate-x-1">
                                  →
                                </span>
                              </span>
                            </div>
                          </Link>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ink px-5 pt-32 sm:px-8">
          <div className="mx-auto max-w-[1600px] space-y-5">
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-24 max-w-3xl" />
            <div className="skeleton mt-12 h-16 max-w-4xl" />
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
