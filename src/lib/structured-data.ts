import type { ReleaseView, TrackView } from "@/lib/data";
import type { EventView } from "@/lib/data";
import type { VideoView } from "@/lib/data";

export interface StructuredData {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

export function generateMusicReleaseSchema(
  release: ReleaseView,
  tracks: TrackView[],
): StructuredData {
  const isSingle = release.kind === "single";
  const releaseType = {
    album: "MusicAlbum",
    ep: "MusicAlbum",
    single: "MusicSingle",
    live: "MusicAlbum",
  }[release.kind] ?? "MusicAlbum";

  return {
    "@context": "https://schema.org",
    "@type": releaseType,
    name: release.title,
    datePublished: release.releaseDate ?? String(release.year),
    inLanguage: "fr",
    albumReleaseType: {
      album: "Album",
      ep: "EP",
      single: "Single",
      live: "Live",
    }[release.kind] ?? release.kind,
    byArtist: {
      "@type": "MusicGroup",
      name: "Conex et Don",
      url: "https://conexetdon.com",
    },
    numTracks: release.trackCount,
    track: tracks.map((track) => ({
      "@type": "MusicRecording",
      name: track.title,
      position: track.position,
      byArtist: { "@type": "MusicGroup", name: "Conex et Don" },
      ...(track.duration ? { duration: `PT${track.duration.replace(":", "M")}S` } : {}),
      ...(track.featuring ? { contributor: track.featuring } : {}),
    })),
    ...(release.coverImage ? { image: release.coverImage } : {}),
    ...(release.description ? { description: release.description } : {}),
    ...(release.label ? { publisher: { "@type": "Organization", name: release.label } } : {}),
  };
}

export function generateEventSchema(events: EventView[]): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "MusicEvent",
        name: event.title,
        startDate: event.eventDate ?? undefined,
        eventStatus:
          event.status === "upcoming"
            ? "https://schema.org/EventScheduled"
            : "https://schema.org/EventCompleted",
        location: {
          "@type": "Place",
          name: event.venue ?? undefined,
          address: {
            "@type": "PostalAddress",
            addressLocality: event.city ?? undefined,
            addressCountry: event.country ?? "BJ",
          },
        },
        image: event.image ?? undefined,
        description: event.note ?? undefined,
        performer: {
          "@type": "MusicGroup",
          name: "Conex et Don",
          url: "https://conexetdon.com",
        },
        ...(event.ticketUrl
          ? {
              offers: {
                "@type": "Offer",
                url: event.ticketUrl,
                availability: "https://schema.org/InStock",
              },
            }
          : {}),
      },
    })),
  };
}

export function generateVideoSchema(videos: VideoView[]): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: videos.map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: video.title,
        description: video.description ?? undefined,
        uploadDate: String(video.year),
        thumbnailUrl: video.image ?? undefined,
        contentUrl: video.youtubeId
          ? `https://www.youtube.com/watch?v=${video.youtubeId}`
          : undefined,
        embedUrl: video.youtubeId
          ? `https://www.youtube.com/embed/${video.youtubeId}`
          : undefined,
        genre: video.category,
        publisher: {
          "@type": "MusicGroup",
          name: "Conex et Don",
          url: "https://conexetdon.com",
        },
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebsiteSchema(): StructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CONEX & DON — Site officiel",
    url: "https://conexetdon.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://conexetdon.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}