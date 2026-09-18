import type { Metadata } from "next";

import { CTA, PageHeader, SectionHead } from "@/components/ui";
import { VideoWall } from "@/components/VideoWall";
import { getVideos } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vidéos — clips, visualizers et live",
  description:
    "Vidéographie de Conex & Don : Ayato, Agbon, Tor Tor, Wotto Wotto, AKA, Minkanangbè, Vivi, Sessi, Dozo, Héritage Vivant, DESSIGUIMANZANBERA et les captations live.",
  alternates: { canonical: "/videos" },
  openGraph: {
    title: "Vidéos & Clips — CONEX & DON",
    description:
      "Vidéographie complète de Conex & Don : clips officiels, visualizers et captations scéniques.",
    images: [
      {
        url: "/api/og?title=VID%C3%89OGRAPHIE&description=Clips%20officiels%2C%20visualizers%20et%20captations%20live&type=video",
        width: 1200,
        height: 630,
        alt: "Vidéos — Conex & Don",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidéos & Clips — CONEX & DON",
    images: [
      "/api/og?title=VID%C3%89OGRAPHIE&description=Clips%20officiels%2C%20visualizers%20et%20captations%20live&type=video",
    ],
  },
};

function generateVideoSchema(videos: Awaited<ReturnType<typeof getVideos>>) {
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
        contentUrl: video.youtubeId ? `https://www.youtube.com/watch?v=${video.youtubeId}` : undefined,
        embedUrl: video.youtubeId ? `https://www.youtube.com/embed/${video.youtubeId}` : undefined,
        genre: video.category,
        publisher: {
          "@type": "MusicGroup",
          name: "Conex et Don",
          url: "https://conexetdon.com",
        },
        ...(video.youtubeId ? {
          duration: undefined,
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: { "@type": "WatchAction" },
            userInteractionCount: 0,
          },
        } : {}),
      },
    })),
  };
}

export default async function VideosPage() {
  const videos = await getVideos();

  const videoSchema = generateVideoSchema(videos);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />

      <PageHeader
        eyebrow="Vidéographie"
        title="VIDÉOS"
        lead="Clips officiels, visualizers et captations live. Chaque vidéo se lance directement dans le lecteur du site, sans quitter la page."
        accent="#9E382C"
      />

      <section className="route-section">
        <div className="route-frame route-frame--compact">
          <VideoWall videos={videos} filterable />

          <div className="mt-16">
            <SectionHead
              label="Chaîne officielle"
              title="YouTube"
              intro="La chaîne rassemble les clips, visualizers, performances et contenus musicaux du duo — plus de 100 000 abonnés."
              accent="#D6A83A"
            />
            <div className="mt-8">
              <CTA href="https://www.youtube.com/@ConexetDon" tone="solid" external>
                Ouvrir la chaîne
              </CTA>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}