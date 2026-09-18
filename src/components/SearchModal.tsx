"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/EmptyState";
import { motionEase, motionSpring } from "@/components/motion";
import type { SearchResultItem, SearchResponseData } from "@/lib/search";
import { useFocusTrap } from "@/lib/use-focus-trap";

const typeLabels: Record<string, string> = {
  release: "Projet",
  track: "Morceau",
  video: "Vidéo",
  event: "Live",
  news: "Actualité",
};

const typeIcons: Record<string, ReactNode> = {
  release: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M7 6.5 16.5 3v13L7 19.5V6.5Z" />
      <path d="M7 6.5 16.5 10M7 12.8l9.5 3.2" />
    </svg>
  ),
  track: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </svg>
  ),
  video: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="2.5" y="5" width="14" height="14" />
      <path d="m10 9 4 3-4 3V9Z" />
      <path d="m16.5 10 5-3v10l-5-3" />
    </svg>
  ),
  event: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" />
      <path d="M8 2v4m8-4v4M3 10h18" />
    </svg>
  ),
  news: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 3h11l3 3v15H5V3Z" />
      <path d="M16 3v4h4M8 11h8M8 15h8M8 19h5" />
    </svg>
  ),
};

const quickSearches = [
  "Ayato",
  "Dessiguimanzanbera",
  "Mode Avion",
  "Live",
  "Bénin",
];

export function SearchModal({ onOpen }: { onOpen?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const requestRef = useRef(0);
  const router = useRouter();
  const reducedMotion = useReducedMotion() ?? false;

  const closeModal = useCallback(() => {
    controllerRef.current?.abort();
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  useFocusTrap({
    active: isOpen,
    containerRef: dialogRef,
    initialFocusRef: inputRef,
    onEscape: closeModal,
  });

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isOpen) closeModal();
        else {
          onOpen?.();
          setIsOpen(true);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, isOpen, onOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const search = useCallback(async (value: string) => {
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
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(normalized)}&limit=8`,
        {
          signal: controller.signal,
        },
      );
      if (!response.ok)
        throw new Error("La recherche est momentanément indisponible.");
      const data: SearchResponseData = await response.json();
      if (requestId !== requestRef.current) return;
      setResults(data.results || []);
      setSelectedIndex(-1);
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
    if (!isOpen) return;
    const timeout = window.setTimeout(() => void search(query), 170);
    return () => window.clearTimeout(timeout);
  }, [isOpen, query, search]);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    [],
  );

  const selectResult = useCallback(
    (result: SearchResultItem) => {
      router.push(result.url);
      closeModal();
    },
    [closeModal, router],
  );

  const openSearchPage = useCallback(() => {
    const value = query.trim();
    router.push(
      value.length >= 2 ? `/search?q=${encodeURIComponent(value)}` : "/search",
    );
    closeModal();
  }, [closeModal, query, router]);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => Math.max(index - 1, -1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex])
        selectResult(results[selectedIndex]);
      else openSearchPage();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onOpen?.();
          setIsOpen(true);
        }}
        className="icon-control gap-2 px-2.5 sm:px-3"
        aria-label="Rechercher dans le site (Commande K)"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <circle cx="10.7" cy="10.7" r="6.7" />
          <path d="m16 16 4.2 4.2" />
        </svg>
        <span className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.16em] sm:inline">
          Recherche
        </span>
        <kbd className="hidden border-l border-bone/15 pl-2 text-[0.57rem] text-bone/40 md:inline">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-[110] flex items-start justify-center px-3 pt-[max(4.75rem,10vh)] sm:px-6"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.18, ease: motionEase }
            }
          >
            <button
              type="button"
              className="modal-backdrop absolute inset-0 cursor-default"
              onClick={closeModal}
              aria-label="Fermer la recherche"
              tabIndex={-1}
            />
            <motion.div
              ref={dialogRef}
              className="dialog-surface relative w-full max-w-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="search-dialog-title"
              tabIndex={-1}
              initial={
                reducedMotion ? false : { opacity: 0, y: 16, scale: 0.985 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 8, scale: 0.99 }
              }
              transition={reducedMotion ? { duration: 0 } : motionSpring}
            >
              <div className="dialog-topline">
                <p id="search-dialog-title" className="eyebrow text-gold">
                  Recherche dans l&apos;univers
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="icon-control h-8 min-h-8 min-w-8"
                  aria-label="Fermer la recherche"
                >
                  ×
                </button>
              </div>
              <div className="p-3 sm:p-5">
                <div className="search-field px-3 sm:px-4">
                  <svg
                    className="shrink-0 text-gold"
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <circle cx="10.7" cy="10.7" r="6.7" />
                    <path d="m16 16 4.2 4.2" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Un titre, une date, un concert…"
                    className="search-field__input px-3 py-4 text-base sm:text-lg"
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-controls="search-modal-results"
                    aria-activedescendant={
                      selectedIndex >= 0
                        ? `modal-result-${selectedIndex}`
                        : undefined
                    }
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="icon-control h-8 min-h-8 min-w-8 border-0 text-lg"
                      aria-label="Effacer la recherche"
                    >
                      ×
                    </button>
                  ) : (
                    <kbd className="hidden text-[0.6rem] font-semibold tracking-[0.12em] text-bone/40 sm:inline">
                      ENTRÉE
                    </kbd>
                  )}
                </div>

                {query.trim().length < 2 ? (
                  <div className="px-1 pb-2 pt-5">
                    <p className="eyebrow text-bone/40">
                      Recherches fréquentes
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {quickSearches.map((item) => (
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
                    <button
                      type="button"
                      onClick={openSearchPage}
                      className="mt-7 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-gold transition-colors hover:text-bone"
                    >
                      Ouvrir la recherche avancée →
                    </button>
                  </div>
                ) : null}

                <div
                  id="search-modal-results"
                  className="mt-3 max-h-[52vh] overflow-y-auto"
                  role="listbox"
                  aria-label="Résultats de recherche"
                >
                  {loading ? (
                    <div
                      className="space-y-2 py-2"
                      aria-live="polite"
                      aria-label="Recherche en cours"
                    >
                      {[0, 1, 2].map((item) => (
                        <div key={item} className="skeleton h-[4.55rem]" />
                      ))}
                    </div>
                  ) : null}
                  {!loading && error ? (
                    <div className="py-3">
                      <EmptyState
                        compact
                        eyebrow="Recherche"
                        title="Une pause technique"
                        description={error}
                        action={
                          <button
                            type="button"
                            onClick={() => void search(query)}
                            className="button button--outline"
                          >
                            <span className="button__label">Réessayer</span>
                            <span className="button__arrow" aria-hidden="true">
                              →
                            </span>
                          </button>
                        }
                      />
                    </div>
                  ) : null}
                  {!loading &&
                  !error &&
                  query.trim().length >= 2 &&
                  results.length === 0 ? (
                    <div className="py-3">
                      <EmptyState
                        compact
                        eyebrow="Aucun résultat"
                        title={`Pas encore de trace de “${query.trim()}”`}
                        description="Essayez un autre mot, ou parcourez toute la recherche pour explorer le catalogue."
                        action={
                          <button
                            type="button"
                            onClick={openSearchPage}
                            className="button button--outline"
                          >
                            <span className="button__label">
                              Recherche avancée
                            </span>
                            <span className="button__arrow" aria-hidden="true">
                              →
                            </span>
                          </button>
                        }
                      />
                    </div>
                  ) : null}
                  {!loading && !error && results.length > 0 ? (
                    <div className="divide-y divide-bone/10 border-y border-bone/10">
                      {results.map((result, index) => {
                        const selected = selectedIndex === index;
                        return (
                          <button
                            id={`modal-result-${index}`}
                            key={`${result.type}-${result.id}`}
                            type="button"
                            role="option"
                            aria-selected={selected}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => selectResult(result)}
                            className={`command-result ${selected ? "command-result--selected" : ""}`}
                          >
                            <span className="command-result__icon">
                              {typeIcons[result.type]}
                            </span>
                            <span className="min-w-0 flex-1 text-left">
                              <span className="flex items-center justify-between gap-3">
                                <span className="text-[0.59rem] font-semibold uppercase tracking-[0.16em] text-gold">
                                  {typeLabels[result.type] ?? result.type}
                                </span>
                                {result.year ? (
                                  <span className="text-[0.59rem] tabular-nums text-bone/40">
                                    {result.year}
                                  </span>
                                ) : null}
                              </span>
                              <span className="mt-1 block truncate text-sm font-semibold text-bone">
                                {result.title}
                              </span>
                              {result.subtitle ? (
                                <span className="mt-1 block truncate text-xs text-bone/50">
                                  {result.subtitle}
                                </span>
                              ) : null}
                            </span>
                            <span
                              className="command-result__arrow"
                              aria-hidden="true"
                            >
                              ↗
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                {query.trim().length >= 2 ? (
                  <div className="flex items-center justify-between gap-4 border-t border-bone/10 px-1 pt-4 text-[0.6rem] uppercase tracking-[0.14em] text-bone/40">
                    <span>
                      {results.length} résultat{results.length > 1 ? "s" : ""}
                    </span>
                    <button
                      type="button"
                      onClick={openSearchPage}
                      className="font-semibold text-gold transition-colors hover:text-bone"
                    >
                      Tout voir ↗
                    </button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
