import { describe, it, expect } from "vitest";
import {
  generateMusicReleaseSchema,
  generateEventSchema,
  generateVideoSchema,
  generateBreadcrumbSchema,
  generateWebsiteSchema,
} from "@/lib/structured-data";
import type { ReleaseView, TrackView, EventView, VideoView } from "@/lib/data";

describe("Structured Data Generator", () => {
  it("generates a compliant MusicAlbum / MusicSingle schema with tracks", () => {
    const sampleRelease: ReleaseView = {
      slug: "ayato",
      title: "Ayato",
      kind: "single",
      releaseDate: "2024-06-15",
      year: 2024,
      trackCount: 1,
      duration: "03:20",
      tagline: "Single officiel",
      description: "Le grand hit amapiano",
      longDescription: null,
      coverImage: "/images/ayato.jpg",
      accent: "#D6A83A",
      label: "Conex & Don",
      links: {},
    };

    const sampleTracks: TrackView[] = [
      {
        position: 1,
        title: "Ayato",
        featuring: "Guest Star",
        duration: "03:20",
        note: null,
      },
    ];

    const schema = generateMusicReleaseSchema(sampleRelease, sampleTracks);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("MusicSingle");
    expect(schema.name).toBe("Ayato");
    expect(schema.numTracks).toBe(1);
    expect(Array.isArray(schema.track)).toBe(true);

    const tracks = schema.track as Array<{ name: string; contributor?: string; duration?: string }>;
    expect(tracks[0].name).toBe("Ayato");
    expect(tracks[0].contributor).toBe("Guest Star");
    expect(tracks[0].duration).toBe("PT03M20S");
  });

  it("generates an ItemList with MusicEvent elements", () => {
    const sampleEvents: EventView[] = [
      {
        title: "Grand Concert Cotonou",
        city: "Cotonou",
        country: "BJ",
        venue: "Palais des Congrès",
        eventDate: "2026-12-20",
        status: "upcoming",
        note: "Concert de fin d'année",
        ticketUrl: "https://tickets.example.com",
        image: "/images/live.jpg",
      },
    ];

    const schema = generateEventSchema(sampleEvents);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("ItemList");

    const items = schema.itemListElement as Array<{
      item: { name: string; eventStatus: string; offers?: { url: string } };
    }>;
    expect(items.length).toBe(1);
    expect(items[0].item.name).toBe("Grand Concert Cotonou");
    expect(items[0].item.eventStatus).toBe("https://schema.org/EventScheduled");
    expect(items[0].item.offers?.url).toBe("https://tickets.example.com");
  });

  it("generates an ItemList with VideoObject elements and embed URLs", () => {
    const sampleVideos: VideoView[] = [
      {
        slug: "ayato-clip",
        title: "Ayato (Clip Officiel)",
        category: "Clip",
        year: 2024,
        youtubeId: "dQw4w9WgXcQ",
        searchQuery: "ayato conex et don",
        image: "/images/video.jpg",
        accent: "#D6A83A",
        description: "Clip officiel tourné à Cotonou",
      },
    ];

    const schema = generateVideoSchema(sampleVideos);
    const items = schema.itemListElement as Array<{
      item: { name: string; embedUrl?: string; contentUrl?: string };
    }>;
    expect(items[0].item.name).toBe("Ayato (Clip Officiel)");
    expect(items[0].item.embedUrl).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("generates a BreadcrumbList schema", () => {
    const breadcrumbs = [
      { name: "Accueil", url: "https://conexetdon.com" },
      { name: "Musique", url: "https://conexetdon.com/musique" },
    ];
    const schema = generateBreadcrumbSchema(breadcrumbs);
    expect(schema["@type"]).toBe("BreadcrumbList");
    const items = schema.itemListElement as Array<{ position: number; name: string }>;
    expect(items.length).toBe(2);
    expect(items[0].position).toBe(1);
    expect(items[0].name).toBe("Accueil");
  });

  it("generates a WebSite schema with SearchAction for discoverability", () => {
    const schema = generateWebsiteSchema();
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.name).toContain("CONEX & DON");
    expect(schema.potentialAction).toBeDefined();
    const action = schema.potentialAction as { "@type": string; target: { urlTemplate: string } };
    expect(action["@type"]).toBe("SearchAction");
    expect(action.target.urlTemplate).toContain("/search?q=");
  });
});
