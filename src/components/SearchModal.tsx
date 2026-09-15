"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SearchResultItem, SearchResponseData } from "@/lib/search";

const typeLabels: Record<string, string> = {
  release: "Projet",
  track: "Morceau",
  video: "Vidéo",
  event: "Live",
  news: "Actualité",
};

const typeIcons: Record<string, React.ReactNode> = {
  release: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a1 1 0 0 1 0 1.41l-4.04 4.04" />
    </svg>
  ),
  track: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  video: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  event: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  news: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
};

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const search = useCallback(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&limit=8`);
      if (!response.ok) throw new Error("Search request failed");
      const data: SearchResponseData = await response.json();
      setResults(data.results || []);
      setSelectedIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      search(query);
    }, 150);
    return () => clearTimeout(timeout);
  }, [query, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        const result = results[selectedIndex];
        router.push(result.url);
        closeModal();
      } else if (query.trim().length >= 2) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        closeModal();
      }
    } else if (e.key === "Escape") {
      closeModal();
    }
  };

  const selectResult = (result: SearchResultItem) => {
    router.push(result.url);
    closeModal();
  };

  const openSearchPage = () => {
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    closeModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 border border-bone/25 rounded-full text-bone/65 hover:text-bone hover:border-gold transition-colors text-xs"
        aria-label="Rechercher (⌘K)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="text-[10px] uppercase tracking-[0.2em] hidden sm:inline">Recherche</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] text-bone/45 bg-bone/10 rounded font-mono">
          <span>⌘</span>K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4">
          <div
            className="fixed inset-0 bg-ink/80 backdrop-blur-md transition-opacity"
            onClick={closeModal}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-2xl bg-[#0e0e0e] border border-bone/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header / Input */}
            <div className="flex items-center gap-3 p-4 border-b border-bone/10 bg-bone/[0.02]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold flex-shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Rechercher musiques, concerts, vidéos..."
                className="flex-1 bg-transparent text-bone placeholder:text-bone/40 text-base sm:text-lg outline-none"
                autoComplete="off"
                aria-label="Rechercher"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-xs text-bone/40 hover:text-bone p-1"
                >
                  Effacer
                </button>
              )}
              <kbd
                onClick={closeModal}
                className="cursor-pointer px-2 py-1 text-[10px] text-bone/40 hover:text-bone bg-bone/5 border border-bone/10 rounded font-mono"
              >
                ESC
              </kbd>
            </div>

            {/* Quick Suggestions when empty */}
            {query.trim().length < 2 && (
              <div className="p-4 sm:p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-bone/40 mb-3">
                  Recherches fréquentes
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Ayato", "Dessiguimanzanbera", "Mode Avion", "Live", "Bénin"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQuery(item)}
                      className="px-3 py-1 rounded-full border border-bone/12 bg-bone/[0.03] text-xs text-bone/70 hover:border-gold/40 hover:text-gold transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results List */}
            <div ref={resultsRef} className="max-h-[55vh] overflow-y-auto p-2">
              {loading && (
                <div className="flex items-center justify-center py-10 text-bone/50 gap-3">
                  <svg className="animate-spin h-5 w-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs uppercase tracking-widest">Recherche...</span>
                </div>
              )}

              {results.length === 0 && !loading && query.trim().length >= 2 && (
                <div className="py-12 text-center text-bone/50">
                  <p className="text-sm">Aucun résultat trouvé pour « {query} »</p>
                  <button
                    type="button"
                    onClick={openSearchPage}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-gold underline underline-offset-4 hover:text-bone"
                  >
                    Ouvrir la page de recherche avancée
                  </button>
                </div>
              )}

              {results.map((result, index) => {
                const isSelected = index === selectedIndex;
                const icon = typeIcons[result.type] || typeIcons.release;
                const label = typeLabels[result.type] || result.type;

                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => selectResult(result)}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-xl transition-colors text-left ${
                      isSelected ? "bg-gold/15 border border-gold/30" : "hover:bg-bone/5"
                    }`}
                    tabIndex={-1}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-bone/10 flex items-center justify-center text-gold">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded">
                          {label}
                        </span>
                        {result.year && (
                          <span className="text-[10px] text-bone/40">{result.year}</span>
                        )}
                        {result.subtitle && (
                          <span className="text-[10px] text-bone/40 truncate hidden sm:inline">
                            • {result.subtitle}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm font-semibold truncate text-bone">
                        {result.title}
                      </p>
                      {result.description && (
                        <p className="mt-0.5 text-xs text-bone/50 truncate">
                          {result.description}
                        </p>
                      )}
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bone/30 flex-shrink-0">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                );
              })}
            </div>

            {/* Footer with summary and full page link */}
            {query.trim().length >= 2 && (
              <div className="border-t border-bone/10 px-4 py-3 bg-bone/[0.02] flex items-center justify-between text-xs text-bone/50">
                <span>
                  {results.length} résultat{results.length > 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  onClick={openSearchPage}
                  className="text-gold hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Voir tous les résultats</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}