import { NextRequest, NextResponse } from "next/server";
import { apiRateLimit } from "@/lib/rate-limit";
import { getReleases, getVideos, getEvents, getNews, getRelease } from "@/lib/data";
import {
  filterAndRankSearchResults,
  type SearchResultItem,
  type SearchResponseData,
} from "@/lib/search";

export async function GET(request: NextRequest) {
  const rateLimitResponse = await apiRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const typeFilter = searchParams.get("type")?.trim().toLowerCase() ?? "all";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

  if (!query || query.length < 2) {
    const emptyResponse: SearchResponseData = {
      results: [],
      query,
      total: 0,
      type: typeFilter,
    };
    return NextResponse.json(emptyResponse);
  }

  try {
    const [releases, videos, events, news] = await Promise.all([
      getReleases(),
      getVideos(),
      getEvents(),
      getNews(),
    ]);

    // Gather tracks from releases
    const releasesWithTracks = await Promise.all(
      releases.map(async (r) => {
        const full = await getRelease(r.slug);
        return {
          release: r,
          tracks: full?.tracks ?? [],
        };
      }),
    );

    const allResults: SearchResultItem[] = [
      ...releases.map((r) => ({
        type: "release" as const,
        id: r.slug,
        title: r.title,
        description: r.description ?? r.tagline ?? "",
        url: `/musique/${r.slug}`,
        image: r.coverImage ?? undefined,
        year: r.year,
        category: r.kind,
        subtitle: `${r.kind.toUpperCase()} • ${r.year} • ${r.trackCount} titres`,
      })),
      ...releasesWithTracks.flatMap(({ release, tracks }) =>
        tracks.map((t) => ({
          type: "track" as const,
          id: `${release.slug}-track-${t.position}`,
          title: t.title,
          description: `Titre extrait de « ${release.title} » (${release.year})`,
          url: `/musique/${release.slug}`,
          image: release.coverImage ?? undefined,
          year: release.year,
          category: "Morceau",
          subtitle: t.featuring ? `feat. ${t.featuring}` : `Sur « ${release.title} »`,
        })),
      ),
      ...videos.map((v) => ({
        type: "video" as const,
        id: v.slug,
        title: v.title,
        description: v.description ?? "",
        url: `/videos#${v.slug}`,
        image: v.image ?? undefined,
        year: v.year,
        category: v.category,
        subtitle: `Vidéo • ${v.category}`,
      })),
      ...events.map((e, i) => ({
        type: "event" as const,
        id: `event-${i}`,
        title: e.title,
        description: [e.venue, e.city, e.country, e.note].filter(Boolean).join(" — "),
        url: `/live`,
        image: e.image ?? undefined,
        year: e.eventDate ? new Date(e.eventDate).getFullYear() : undefined,
        category: e.status,
        subtitle: e.city ? `${e.city}${e.country ? `, ${e.country}` : ""}` : "Concert & Live",
      })),
      ...news.map((n) => ({
        type: "news" as const,
        id: n.slug,
        title: n.title,
        description: n.excerpt ?? "",
        url: `/press/${n.slug}`,
        image: n.image ?? undefined,
        year: n.publishedAt ? new Date(n.publishedAt).getFullYear() : undefined,
        category: n.category,
        subtitle: `Presse • ${n.category}`,
      })),
    ];

    const ranked = filterAndRankSearchResults(query, allResults, typeFilter, limit);

    const payload: SearchResponseData = {
      results: ranked,
      query,
      total: ranked.length,
      type: typeFilter,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json(
      { results: [], query, total: 0, type: typeFilter },
      { status: 500 },
    );
  }
}