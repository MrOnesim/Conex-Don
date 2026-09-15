import { describe, it, expect } from "vitest";
import {
  normalizeSearchText,
  scoreSearchResult,
  filterAndRankSearchResults,
  type SearchResultItem,
} from "@/lib/search";

describe("Search Lib - normalizeSearchText", () => {
  it("normalizes accents and diacritics to basic Latin characters", () => {
    expect(normalizeSearchText("Bénin")).toBe("benin");
    expect(normalizeSearchText("Héritage Vivant")).toBe("heritage vivant");
    expect(normalizeSearchText("Événement À Cotonou")).toBe("evenement a cotonou");
    expect(normalizeSearchText("Ça va aller")).toBe("ca va aller");
  });

  it("handles punctuation, quotes and apostrophes cleanly", () => {
    expect(normalizeSearchText("L'héritage en mouvement")).toBe("l heritage en mouvement");
    expect(normalizeSearchText("DESSIGUIMANZANBERA (Live)")).toBe("dessiguimanzanbera live");
    expect(normalizeSearchText("  Conex   &   Don   ")).toBe("conex don");
  });

  it("returns an empty string for null, undefined or empty input", () => {
    expect(normalizeSearchText("")).toBe("");
    expect(normalizeSearchText(null)).toBe("");
    expect(normalizeSearchText(undefined)).toBe("");
  });
});

describe("Search Lib - scoreSearchResult", () => {
  const sampleItem: SearchResultItem = {
    type: "release",
    id: "ayato",
    title: "Ayato",
    description: "Le grand single afrobeat et amapiano béninois",
    url: "/musique/ayato",
    year: 2024,
    category: "single",
    subtitle: "SINGLE • 2024",
  };

  it("assigns top score for exact title matches", () => {
    const score = scoreSearchResult(sampleItem, "ayato", ["ayato"]);
    expect(score).toBeGreaterThanOrEqual(100);
  });

  it("gives partial score for description matches", () => {
    const score = scoreSearchResult(sampleItem, "amapiano", ["amapiano"]);
    expect(score).toBeGreaterThan(0);
  });

  it("returns 0 if query does not match any field", () => {
    const score = scoreSearchResult(sampleItem, "rockstar", ["rockstar"]);
    expect(score).toBe(0);
  });
});

describe("Search Lib - filterAndRankSearchResults", () => {
  const dataset: SearchResultItem[] = [
    {
      type: "release",
      id: "dessigui",
      title: "DESSIGUIMANZANBERA",
      description: "Album studio rap et afro",
      url: "/musique/dessiguimanzanbera",
      year: 2024,
      category: "album",
    },
    {
      type: "track",
      id: "track-1",
      title: "Ayato",
      description: "Morceau issu de l'album",
      url: "/musique/dessiguimanzanbera",
      year: 2024,
      category: "Morceau",
    },
    {
      type: "video",
      id: "video-ayato",
      title: "Clip officiel Ayato",
      description: "Clip réalisé à Cotonou",
      url: "/videos#ayato",
      year: 2024,
      category: "Clip",
    },
    {
      type: "event",
      id: "event-1",
      title: "Concert Live Bénin",
      description: "Grand concert live à Ouidah",
      url: "/live",
      year: 2026,
      category: "upcoming",
    },
  ];

  it("matches terms regardless of accents in query or target", () => {
    const results = filterAndRankSearchResults("benin", dataset);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.title.includes("Bénin"))).toBe(true);

    const accentedQueryResults = filterAndRankSearchResults("bénin", dataset);
    expect(accentedQueryResults.length).toBe(results.length);
  });

  it("filters accurately by category type", () => {
    const videoOnly = filterAndRankSearchResults("ayato", dataset, "video");
    expect(videoOnly.length).toBe(1);
    expect(videoOnly[0].type).toBe("video");

    const tracksOnly = filterAndRankSearchResults("ayato", dataset, "track");
    expect(tracksOnly.length).toBe(1);
    expect(tracksOnly[0].type).toBe("track");
  });

  it("returns empty array for very short queries", () => {
    expect(filterAndRankSearchResults("a", dataset)).toEqual([]);
    expect(filterAndRankSearchResults("  ", dataset)).toEqual([]);
  });
});
