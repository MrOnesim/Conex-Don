export interface SearchResultItem {
  type: "release" | "track" | "video" | "event" | "news";
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  year?: number;
  category?: string;
  subtitle?: string;
}

export interface SearchResponseData {
  results: SearchResultItem[];
  query: string;
  total: number;
  type?: string;
}

/**
 * Normalizes text by removing accents, lowercasing, and stripping extraneous whitespace.
 * e.g., "Bénin, Héritage!" -> "benin heritage"
 */
export function normalizeSearchText(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritical marks
    .replace(/['’]/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Computes relevance score between an item and a query.
 * Higher score means more relevant. Returns 0 if no match.
 */
export function scoreSearchResult(
  item: SearchResultItem,
  normalizedQuery: string,
  queryTerms: string[],
): number {
  if (!normalizedQuery || queryTerms.length === 0) return 0;

  const normalizedTitle = normalizeSearchText(item.title);
  const normalizedDesc = normalizeSearchText(item.description);
  const normalizedCategory = normalizeSearchText(item.category);
  const normalizedSubtitle = normalizeSearchText(item.subtitle);

  let score = 0;

  // Exact phrase match in title is top priority
  if (normalizedTitle === normalizedQuery) {
    score += 100;
  } else if (normalizedTitle.includes(normalizedQuery)) {
    score += 60;
  }

  // Exact phrase in subtitle or category
  if (normalizedSubtitle.includes(normalizedQuery)) {
    score += 40;
  }
  if (normalizedCategory.includes(normalizedQuery)) {
    score += 30;
  }

  // Exact phrase in description
  if (normalizedDesc.includes(normalizedQuery)) {
    score += 20;
  }

  // Check individual term matches
  let matchedTerms = 0;
  for (const term of queryTerms) {
    let termMatched = false;

    if (normalizedTitle.includes(term)) {
      score += 25;
      termMatched = true;
      // Bonus if title word starts with term
      if (normalizedTitle.split(" ").some((w) => w.startsWith(term))) {
        score += 10;
      }
    }
    if (normalizedSubtitle.includes(term)) {
      score += 15;
      termMatched = true;
    }
    if (normalizedCategory.includes(term)) {
      score += 12;
      termMatched = true;
    }
    if (normalizedDesc.includes(term)) {
      score += 8;
      termMatched = true;
    }

    if (termMatched) {
      matchedTerms++;
    }
  }

  // If none of the terms matched, return 0
  if (matchedTerms === 0) return 0;

  // Bonus if all terms matched
  if (matchedTerms === queryTerms.length) {
    score += 30;
  }

  // Slight bonus for recent items
  if (item.year) {
    score += Math.min(item.year - 2020, 10);
  }

  return score;
}

/**
 * Filters and ranks search results based on query and optional category type.
 */
export function filterAndRankSearchResults(
  query: string,
  results: SearchResultItem[],
  typeFilter: string = "all",
  limit: number = 20,
): SearchResultItem[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery || normalizedQuery.length < 2) {
    return [];
  }

  const queryTerms = normalizedQuery.split(" ").filter((term) => term.length >= 2);
  if (queryTerms.length === 0) {
    return [];
  }

  // Filter by category if specified and not 'all'
  const filteredByType =
    typeFilter === "all" || !typeFilter
      ? results
      : results.filter((item) => item.type === typeFilter);

  // Score each item and keep only those with score > 0
  const scoredItems: { item: SearchResultItem; score: number }[] = [];

  for (const item of filteredByType) {
    const score = scoreSearchResult(item, normalizedQuery, queryTerms);
    if (score > 0) {
      scoredItems.push({ item, score });
    }
  }

  // Sort by score descending, then by year descending
  scoredItems.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (b.item.year ?? 0) - (a.item.year ?? 0);
  });

  return scoredItems.slice(0, limit).map((entry) => entry.item);
}
