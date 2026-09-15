"use client";

import { useState, useEffect, useCallback, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { OptimizedImage } from "@/components/OptimizedImage";
import { PageHeader } from "@/components/ui";
import type { SearchResultItem, SearchResponseData } from "@/lib/search";

const categories = [
  { id: "all", label: "Tous" },
  { id: "release", label: "Musique" },
  { id: "track", label: "Morceaux" },
  { id: "video", label: "Vidéos" },
  { id: "event", label: "Live & Dates" },
  { id: "news", label: "Presse & Actualités" },
];

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

const categoryBadgeStyles: Record<string, string> = {
  release: "bg-gold/15 text-gold border-gold/30",
  track: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  video: "bg-red-500/15 text-red-300 border-red-500/30",
  event: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  news: "bg-blue-500/15 text-blue-300 border-blue-500/30",
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlQuery = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("type") ?? "all";

  const [query, setQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  // Sync local state when the URL params change (e.g. navigating from the
  // global ⌘K modal while already on this page).
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [prevUrlCategory, setPrevUrlCategory] = useState(urlCategory);
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }
  if (urlCategory !== prevUrlCategory) {
    setPrevUrlCategory(urlCategory);
    setSelectedCategory(urlCategory);
  }

  const fetchResults = useCallback(async (q: string, type: string) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const endpoint = `/api/search?q=${encodeURIComponent(q.trim())}&type=${encodeURIComponent(
        type,
      )}&limit=30`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Erreur recherche");
      const data: SearchResponseData = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search: writes state back into the URL and fetches results.
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim().length >= 2) {
        startTransition(() => {
          const params = new URLSearchParams();
          params.set("q", query.trim());
          if (selectedCategory !== "all") {
            params.set("type", selectedCategory);
          }
          router.replace(`/search?${params.toString()}`, { scroll: false });
        });
        fetchResults(query, selectedCategory);
      } else if (query.trim().length === 0) {
        setResults([]);
        router.replace("/search", { scroll: false });
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [query, selectedCategory, router, fetchResults, startTransition]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (query.trim().length >= 2) {
      const params = new URLSearchParams();
      params.set("q", query.trim());
      if (catId !== "all") {
        params.set("type", catId);
      }
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    router.replace("/search", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-ink pb-24 text-bone">
      <PageHeader
        eyebrow="Exploration & Découverte"
        title="RECHERCHE"
        accent="#D6A83A"
      />

      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Search Bar Input */}
        <div className="relative mx-auto max-w-3xl">
          <div className="relative flex items-center overflow-hidden rounded-2xl border border-bone/20 bg-bone/[0.04] backdrop-blur-md transition-all focus-within:border-gold focus-within:bg-bone/[0.08] focus-within:shadow-[0_0_30px_rgba(214,168,58,0.2)]">
            <span className="pl-5 text-bone/40" aria-hidden="true">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une chanson, un album, un concert, un article..."
              className="w-full bg-transparent px-4 py-4 text-base text-bone placeholder-bone/40 outline-none sm:text-lg"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="mr-3 rounded-full p-2 text-bone/40 hover:bg-bone/10 hover:text-bone transition-colors"
                aria-label="Effacer la recherche"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Query Suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-bone/40">
              Suggestions :
            </span>
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setQuery(item)}
                className="rounded-full border border-bone/12 bg-bone/[0.03] px-3 py-1 text-xs text-bone/70 transition-colors hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-b border-bone/10 pb-6">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] transition-all ${
                  isActive
                    ? "bg-gold text-ink font-semibold shadow-lg shadow-gold/20"
                    : "border border-bone/15 bg-bone/[0.03] text-bone/70 hover:border-bone/35 hover:text-bone"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results Area */}
        <div className="mt-10">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-bone/50">
              <svg
                className="h-8 w-8 animate-spin text-gold"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
              </svg>
              <p className="mt-4 text-xs uppercase tracking-[0.2em]">Recherche en cours...</p>
            </div>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div className="rounded-2xl border border-bone/10 bg-bone/[0.02] py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-bone/10 text-gold">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-bone">
                Aucun résultat pour « {query} »
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-bone/60">
                Essayez d&apos;autres mots-clés ou explorez nos suggestions ci-dessus comme « Ayato »
                ou « Dessiguimanzanbera ».
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <div className="mb-6 flex items-center justify-between text-xs text-bone/50">
                <span>
                  {results.length} résultat{results.length > 1 ? "s" : ""} trouvé
                  {results.length > 1 ? "s" : ""}
                </span>
                <span className="uppercase tracking-wider">Filtre : {selectedCategory}</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((item) => {
                  const badgeClass =
                    categoryBadgeStyles[item.type] || "bg-bone/10 text-bone border-bone/20";

                  return (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={item.url}
                      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-bone/12 bg-bone/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-bone/[0.06] hover:shadow-xl hover:shadow-gold/5"
                    >
                      <div>
                        {item.image && (
                          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-bone/10">
                            <OptimizedImage
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${badgeClass}`}
                          >
                            {item.category || item.type}
                          </span>
                          {item.year && (
                            <span className="text-[10px] text-bone/40">{item.year}</span>
                          )}
                        </div>

                        <h3 className="mt-3 text-lg font-bold text-bone transition-colors group-hover:text-gold">
                          {item.title}
                        </h3>

                        {item.subtitle && (
                          <p className="mt-1 text-xs font-medium text-gold/80">
                            {item.subtitle}
                          </p>
                        )}

                        {item.description && (
                          <p className="mt-2 text-xs leading-relaxed text-bone/60 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 flex items-center gap-1.5 border-t border-bone/10 pt-3 text-xs font-medium text-gold transition-transform duration-200 group-hover:translate-x-1">
                        <span>Consulter</span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {!loading && query.trim().length < 2 && (
            <div className="py-16 text-center text-bone/50">
              <p className="text-sm">
                Tapez au moins deux lettres pour rechercher dans toute l&apos;œuvre de Conex &amp; Don.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ink py-32 text-center text-bone/50">
          Chargement de la recherche...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
