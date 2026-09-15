import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  alobaPosts,
  events as eventsTable,
  newsPosts as newsTable,
  releases as releasesTable,
  tracks as tracksTable,
  videos as videosTable,
} from "@/db/schema";
import { releases as releaseSeed, type ReleaseKind, type StreamLinks } from "@/content/music";
import {
  events as eventSeed,
  news as newsSeed,
  videos as videoSeed,
  alobaSeed,
} from "@/content/media";
import { site } from "@/content/site";

export type ReleaseView = {
  slug: string;
  title: string;
  kind: ReleaseKind;
  releaseDate: string | null;
  year: number;
  trackCount: number;
  duration: string | null;
  tagline: string | null;
  description: string | null;
  longDescription: string | null;
  coverImage: string | null;
  accent: string;
  label: string | null;
  links: StreamLinks;
};

export type TrackView = {
  position: number;
  title: string;
  featuring: string | null;
  duration: string | null;
  note: string | null;
};

export type VideoView = {
  slug: string;
  title: string;
  category: string;
  year: number;
  youtubeId: string | null;
  searchQuery: string;
  image: string | null;
  accent: string;
  description: string | null;
};

export type EventView = {
  title: string;
  city: string | null;
  country: string | null;
  venue: string | null;
  eventDate: string | null;
  status: string;
  note: string | null;
  ticketUrl: string | null;
  image: string | null;
};

export type NewsView = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string | null;
  publishedAt: string | null;
  source: string | null;
  sourceUrl: string | null;
  image: string | null;
};

let seedPromise: Promise<void> | null = null;

async function seed(): Promise<void> {
  const existing = await db.select({ id: releasesTable.id }).from(releasesTable).limit(1);
  if (existing.length === 0) {
    await db.insert(releasesTable).values(
      releaseSeed.map((release, index) => ({
        slug: release.slug,
        title: release.title,
        kind: release.kind,
        releaseDate: release.releaseDate,
        year: release.year,
        trackCount: release.tracks.length,
        duration: release.duration ?? null,
        tagline: release.tagline,
        description: release.description,
        longDescription: release.longDescription ?? null,
        coverImage: release.coverImage ?? null,
        accent: release.accent,
        label: release.label ?? null,
        links: release.links as Record<string, string>,
        featured: release.featured ?? false,
        sortOrder: index,
      })),
    );
    await db.insert(tracksTable).values(
      releaseSeed.flatMap((release) =>
        release.tracks.map((track) => ({
          releaseSlug: release.slug,
          position: track.position,
          title: track.title,
          featuring: track.featuring ?? null,
          duration: track.duration ?? null,
          note: track.note ?? null,
        })),
      ),
    );
  }

  const existingVideos = await db.select({ id: videosTable.id }).from(videosTable).limit(1);
  if (existingVideos.length === 0) {
    await db.insert(videosTable).values(
      videoSeed.map((video, index) => ({
        slug: video.slug,
        title: video.title,
        category: video.category,
        year: video.year,
        youtubeId: video.youtubeId ?? null,
        searchQuery: video.searchQuery,
        image: video.image ?? null,
        accent: video.accent,
        description: video.description,
        sortOrder: index,
      })),
    );
  }

  const existingEvents = await db.select({ id: eventsTable.id }).from(eventsTable).limit(1);
  if (existingEvents.length === 0) {
    await db.insert(eventsTable).values(
      eventSeed.map((event, index) => ({
        title: event.title,
        city: event.city,
        country: event.country,
        venue: event.venue,
        eventDate: event.eventDate,
        status: event.status,
        note: event.note,
        ticketUrl: event.ticketUrl ?? null,
        image: event.image ?? null,
        sortOrder: index,
      })),
    );
  }

  const existingNews = await db.select({ id: newsTable.id }).from(newsTable).limit(1);
  if (existingNews.length === 0) {
    await db.insert(newsTable).values(
      newsSeed.map((post, index) => ({
        slug: post.slug,
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        body: post.body,
        publishedAt: post.publishedAt,
        source: post.source ?? null,
        sourceUrl: post.sourceUrl ?? null,
        image: post.image ?? null,
        sortOrder: index,
      })),
    );
  }

  const existingAloba = await db.select({ id: alobaPosts.id }).from(alobaPosts).limit(1);
  if (existingAloba.length === 0) {
    await db.insert(alobaPosts).values(alobaSeed);
  }
}

export async function ensureSeeded(): Promise<boolean> {
  if (!seedPromise) {
    seedPromise = seed();
  }
  try {
    await seedPromise;
    return true;
  } catch {
    seedPromise = null;
    return false;
  }
}

/* ---------------------------------------------------------------- fallbacks */

const fallbackReleases: ReleaseView[] = releaseSeed.map((release) => ({
  slug: release.slug,
  title: release.title,
  kind: release.kind,
  releaseDate: release.releaseDate,
  year: release.year,
  trackCount: release.tracks.length,
  duration: release.duration ?? null,
  tagline: release.tagline,
  description: release.description,
  longDescription: release.longDescription ?? null,
  coverImage: release.coverImage ?? null,
  accent: release.accent,
  label: release.label ?? null,
  links: release.links,
}));

const fallbackTracks: Record<string, TrackView[]> = Object.fromEntries(
  releaseSeed.map((release) => [
    release.slug,
    release.tracks.map((track) => ({
      position: track.position,
      title: track.title,
      featuring: track.featuring ?? null,
      duration: track.duration ?? null,
      note: track.note ?? null,
    })),
  ]),
);

const fallbackVideos: VideoView[] = videoSeed.map((video) => ({
  slug: video.slug,
  title: video.title,
  category: video.category,
  year: video.year,
  youtubeId: video.youtubeId ?? null,
  searchQuery: video.searchQuery,
  image: video.image ?? null,
  accent: video.accent,
  description: video.description,
}));

const fallbackEvents: EventView[] = eventSeed.map((event) => ({
  title: event.title,
  city: event.city,
  country: event.country,
  venue: event.venue,
  eventDate: event.eventDate,
  status: event.status,
  note: event.note,
  ticketUrl: event.ticketUrl ?? null,
  image: event.image ?? null,
}));

const fallbackNews: NewsView[] = newsSeed.map((post) => ({
  slug: post.slug,
  title: post.title,
  category: post.category,
  excerpt: post.excerpt,
  body: post.body,
  publishedAt: post.publishedAt,
  source: post.source ?? null,
  sourceUrl: post.sourceUrl ?? null,
  image: post.image ?? null,
}));

/* ------------------------------------------------------------------ readers */

export async function getReleases(): Promise<ReleaseView[]> {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(releasesTable)
      .orderBy(desc(releasesTable.year), asc(releasesTable.sortOrder));
    if (rows.length === 0) return fallbackReleases;
    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      kind: (row.kind as ReleaseKind) ?? "single",
      releaseDate: row.releaseDate,
      year: row.year,
      trackCount: row.trackCount,
      duration: row.duration,
      tagline: row.tagline,
      description: row.description,
      longDescription: row.longDescription,
      coverImage: row.coverImage,
      accent: row.accent,
      label: row.label,
      links: (row.links ?? {}) as StreamLinks,
    }));
  } catch {
    return fallbackReleases;
  }
}

export async function getRelease(
  slug: string,
): Promise<{ release: ReleaseView; tracks: TrackView[] } | null> {
  const all = await getReleases();
  const release = all.find((item) => item.slug === slug);
  if (!release) return null;
  try {
    const rows = await db
      .select()
      .from(tracksTable)
      .where(eq(tracksTable.releaseSlug, slug))
      .orderBy(asc(tracksTable.position));
    if (rows.length === 0) {
      return { release, tracks: fallbackTracks[slug] ?? [] };
    }
    return {
      release,
      tracks: rows.map((row) => ({
        position: row.position,
        title: row.title,
        featuring: row.featuring,
        duration: row.duration,
        note: row.note,
      })),
    };
  } catch {
    return { release, tracks: fallbackTracks[slug] ?? [] };
  }
}

export async function getVideos(): Promise<VideoView[]> {
  try {
    await ensureSeeded();
    const rows = await db.select().from(videosTable).orderBy(asc(videosTable.sortOrder));
    if (rows.length === 0) return fallbackVideos;
    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      category: row.category,
      year: row.year,
      youtubeId: row.youtubeId,
      searchQuery: row.searchQuery,
      image: row.image,
      accent: row.accent,
      description: row.description,
    }));
  } catch {
    return fallbackVideos;
  }
}

export async function getEvents(): Promise<EventView[]> {
  try {
    await ensureSeeded();
    const rows = await db.select().from(eventsTable).orderBy(asc(eventsTable.sortOrder));
    if (rows.length === 0) return fallbackEvents;
    return rows.map((row) => ({
      title: row.title,
      city: row.city,
      country: row.country,
      venue: row.venue,
      eventDate: row.eventDate,
      status: row.status,
      note: row.note,
      ticketUrl: row.ticketUrl,
      image: row.image,
    }));
  } catch {
    return fallbackEvents;
  }
}

export async function getNews(): Promise<NewsView[]> {
  try {
    await ensureSeeded();
    const rows = await db.select().from(newsTable).orderBy(asc(newsTable.sortOrder));
    if (rows.length === 0) return fallbackNews;
    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      category: row.category,
      excerpt: row.excerpt,
      body: row.body,
      publishedAt: row.publishedAt,
      source: row.source,
      sourceUrl: row.sourceUrl,
      image: row.image,
    }));
  } catch {
    return fallbackNews;
  }
}

export async function getNewsPost(slug: string): Promise<NewsView | null> {
  const all = await getNews();
  return all.find((post) => post.slug === slug) ?? null;
}

export type AlobaPostView = {
  id: number;
  displayName: string;
  handle: string | null;
  city: string | null;
  mood: string | null;
  message: string;
  createdAt: string;
};

const fallbackAlobaPosts: AlobaPostView[] = alobaSeed.map((post, index) => ({
  id: -(index + 1),
  displayName: post.displayName,
  handle: post.handle,
  city: post.city,
  mood: post.mood,
  message: post.message,
  createdAt: new Date().toISOString(),
}));

export async function getAlobaPosts(): Promise<AlobaPostView[]> {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(alobaPosts)
      .orderBy(desc(alobaPosts.createdAt))
      .limit(60);
    if (rows.length === 0) return fallbackAlobaPosts;
    return rows
      .filter((row) => row.approved)
      .map((row) => ({
        id: row.id,
        displayName: row.displayName,
        handle: row.handle,
        city: row.city,
        mood: row.mood,
        message: row.message,
        createdAt: row.createdAt.toISOString(),
      }));
  } catch {
    return fallbackAlobaPosts;
  }
}

export const bookingContact = site.contact;
