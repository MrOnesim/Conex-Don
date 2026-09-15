import { buildPressKitPdf } from "@/lib/pdf";
import {
  awards,
  biography,
  duo,
  site,
  stats,
  technicalRider,
} from "@/content/site";
import { getEvents, getReleases, getVideos } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const [releases, videos, events] = await Promise.all([
    getReleases(),
    getVideos(),
    getEvents(),
  ]);

  const blocks = [
    { type: "title" as const, text: "Conex & Don — Press Kit" },
    { type: "text" as const, text: `${site.tagline} — ${site.concept}` },
    { type: "text" as const, text: `Booking : ${site.contact.bookingEmail} — ${site.contact.bookingPhone}` },
    { type: "rule" as const },
    { type: "heading" as const, text: "Biographie courte" },
    { type: "text" as const, text: biography.short },
    { type: "heading" as const, text: "Biographie longue" },
    ...biography.long.split("\n\n").map((paragraph) => ({
      type: "text" as const,
      text: paragraph,
    })),
    { type: "heading" as const, text: "Identité" },
    { type: "text" as const, text: `Conex : ${duo.conex.fullName} — ${duo.conex.origin} — ${duo.conex.role}` },
    { type: "text" as const, text: `Don : ${duo.don.fullName} — ${duo.don.origin} — ${duo.don.role}` },
    { type: "text" as const, text: "Genres : Afrobeat, Afropop, Amapiano, Rap, humour et culture béninoise." },
    { type: "heading" as const, text: "Discographie" },
    ...releases.map((release) => ({
      type: "text" as const,
      text: `${release.title} — ${release.kind.toUpperCase()} — ${
        release.releaseDate ?? release.year
      } — ${release.trackCount} titre(s)${release.label ? ` — ${release.label}` : ""}`,
    })),
    { type: "heading" as const, text: "Vidéographie (sélection)" },
    { type: "text" as const, text: videos.map((video) => video.title).join(" · ") },
    { type: "heading" as const, text: "Chiffres clés" },
    ...stats.map((stat) => ({ type: "text" as const, text: `${stat.value} — ${stat.label}` })),
    { type: "heading" as const, text: "Distinctions" },
    ...awards.map((award) => ({
      type: "text" as const,
      text: `${award.year} — ${award.title} — ${award.detail}`,
    })),
    { type: "heading" as const, text: "Concerts & live" },
    ...events.map((event) => ({
      type: "text" as const,
      text: `${event.title} — ${event.eventDate} — ${event.city}, ${event.country} (${event.status})`,
    })),
    { type: "heading" as const, text: "Fiche technique (indicatif)" },
    ...technicalRider.map((item) => ({ type: "text" as const, text: `- ${item}` })),
    { type: "heading" as const, text: "Contacts" },
    { type: "text" as const, text: `Booking / partenariats : ${site.contact.bookingEmail}` },
    { type: "text" as const, text: `Téléphone : ${site.contact.bookingPhone}` },
    { type: "text" as const, text: "Plateformes : YouTube, Spotify, Apple Music, Audiomack, Deezer, Amazon Music." },
    { type: "text" as const, text: "Document généré depuis le site officiel de Conex & Don." },
  ];

  const pdf = buildPressKitPdf({ blocks });

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="conex-et-don-press-kit.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
