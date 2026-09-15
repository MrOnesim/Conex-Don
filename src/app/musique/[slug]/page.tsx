import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ListenTrigger } from "@/components/ListenRow";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Reveal } from "@/components/Reveal";
import { StreamingLinks } from "@/components/ui";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { getRelease, getReleases } from "@/lib/data";
import {
  generateMusicReleaseSchema,
  generateBreadcrumbSchema,
  generateWebsiteSchema,
} from "@/lib/structured-data";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getRelease(slug);
  if (!data) return { title: "Projet introuvable" };
  const { release } = data;
  const ogImage = `/api/og?title=${encodeURIComponent(release.title)}&description=${encodeURIComponent(
    release.description ?? "",
  )}&type=${encodeURIComponent(release.kind)}${
    release.coverImage ? `&image=${encodeURIComponent(release.coverImage)}` : ""
  }`;

  return {
    title: `${release.title} — ${release.year}`,
    description: `${release.description} ${release.trackCount} titre(s). Conex & Don, duo musical béninois.`,
    alternates: { canonical: `/musique/${release.slug}` },
    openGraph: {
      title: `${release.title} — Conex & Don`,
      description: release.description ?? undefined,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: release.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${release.title} — Conex & Don`,
      description: release.description ?? undefined,
      images: [ogImage],
    },
  };
}

const kindLabel: Record<string, string> = {
  album: "Album",
  ep: "EP",
  single: "Single",
  live: "Live",
};

export default async function ReleasePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getRelease(slug);
  if (!data) notFound();
  const { release, tracks } = data;
  const all = await getReleases();
  const others = all.filter((item) => item.slug !== release.slug).slice(0, 4);

  const musicSchema = generateMusicReleaseSchema(release, tracks);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "https://conexetdon.com" },
    { name: "Musique", url: "https://conexetdon.com/musique" },
    { name: release.title, url: `https://conexetdon.com/musique/${release.slug}` },
  ]);
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <article className="pt-24 sm:pt-32">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
          <Link
            href="/musique"
            className="link-underline text-[10px] uppercase tracking-[0.22em] text-bone/50 hover:text-bone"
          >
            ← Discographie
          </Link>

          <header className="mt-8 grid grid-cols-1 gap-10 border-b border-bone/12 pb-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-16">
            <Reveal variant="mask">
              <div className="relative aspect-square w-full overflow-hidden border border-bone/15">
                {release.coverImage ? (
                  <OptimizedImage
                    src={release.coverImage}
                    alt={`Couverture — ${release.title}`}
                    fill
                    priority
                    accent={release.accent}
                    sizes="(max-width: 1024px) 92vw, 42vw"
                    className="h-full w-full"
                    imageClassName="object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-end p-7"
                    style={{ backgroundColor: release.accent }}
                  >
                    <span className="display-xl text-5xl leading-[0.84] text-bone/90 sm:text-7xl">
                      {release.title}
                    </span>
                  </div>
                )}
              </div>
            </Reveal>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em]"
                  style={{ backgroundColor: release.accent, color: "#F5F2EA" }}
                >
                  {kindLabel[release.kind] ?? release.kind}
                </span>
                <span className="eyebrow text-bone/45">
                  {release.releaseDate ?? release.year}
                </span>
                {release.duration ? (
                  <span className="eyebrow text-bone/45">{release.duration}</span>
                ) : null}
              </div>

              <h1 className="display-xl mt-5 text-[13vw] leading-[0.84] sm:text-7xl lg:text-[6.2rem]">
                {release.title}
              </h1>
              <p className="mt-5 text-sm uppercase tracking-[0.2em] text-bone/55">
                {release.tagline}
              </p>
              <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-bone/70">
                {release.longDescription ?? release.description}
              </p>

              <div className="mt-8">
                <StreamingLinks links={release.links} />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ListenTrigger
                  label="Écouter"
                  accent="#D6A83A"
                  className="border border-bone/25 px-5 py-3"
                />
                <p className="max-w-sm text-xs leading-relaxed text-bone/40">
                  Le titre officiel se lance directement ici, dans le lecteur intégré du site.
                </p>
              </div>
            </div>
          </header>

          {release.links.youtubeId ? (
            <section className="border-b border-bone/12 py-14">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="eyebrow text-gold">Écouter en direct</h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-bone/60">
                    Lecture intégrale du morceau officiel sans quitter la page.
                  </p>
                </div>
                <a
                  href={release.links.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-[10px] uppercase tracking-[0.22em] text-bone/50 hover:text-bone"
                >
                  Voir sur YouTube →
                </a>
              </div>
              <YouTubeEmbed youtubeId={release.links.youtubeId} title={release.title} />
            </section>
          ) : null}

          <section className="grid grid-cols-1 gap-10 py-14 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:gap-16">
            <div>
              <h2 className="display-xl text-3xl sm:text-4xl">Tracklist</h2>
              <ol className="mt-6 divide-y divide-bone/10 border-t border-bone/12">
                {tracks.map((track) => (
                  <li
                    key={`${track.position}-${track.title}`}
                    id={track.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                    className="group flex items-center gap-4 py-4"
                  >
                    <span className="w-7 text-[11px] tabular-nums text-bone/35">
                      {String(track.position).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="display-xl block truncate text-xl transition-colors group-hover:text-gold sm:text-3xl">
                        {track.title}
                      </span>
                      {track.featuring ? (
                        <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-bone/45">
                          feat. {track.featuring}
                        </span>
                      ) : null}
                      {track.note ? (
                        <span className="mt-1 block text-[11px] text-bone/40">{track.note}</span>
                      ) : null}
                    </span>
                    <span className="text-[11px] tabular-nums text-bone/35">
                      {track.duration ?? "—"}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="border border-bone/12 p-6 sm:p-8">
              <h2 className="display-xl text-2xl sm:text-3xl">Crédits</h2>
              <dl className="mt-6 space-y-4 text-sm">
                {[
                  { label: "Artiste", value: "Conex & Don" },
                  { label: "Type", value: kindLabel[release.kind] ?? release.kind },
                  { label: "Sortie", value: release.releaseDate ?? String(release.year) },
                  { label: "Titres", value: String(release.trackCount) },
                  { label: "Label / distribution", value: release.label ?? "—" },
                  { label: "Genres", value: "Afrobeat · Afropop · Amapiano · Rap" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between gap-6 border-b border-bone/10 pb-3">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-bone/40">
                      {item.label}
                    </dt>
                    <dd className="max-w-[60%] text-right text-bone/80">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-xs leading-relaxed text-bone/40">
                Crédits détaillés, producteurs et réalisateurs disponibles sur demande auprès de
                l&apos;équipe — voir la page EPK.
              </p>
            </aside>
          </section>

          <section className="border-t border-bone/12 py-14">
            <h2 className="display-xl text-2xl sm:text-3xl">Dans la même discographie</h2>
            <ul className="mt-8 grid grid-cols-2 gap-px border border-bone/12 bg-bone/12 lg:grid-cols-4">
              {others.map((item) => (
                <li key={item.slug} className="bg-ink">
                  <Link href={`/musique/${item.slug}`} className="group block p-5">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-bone/40">
                      {item.year} · {kindLabel[item.kind] ?? item.kind}
                    </span>
                    <span className="display-xl mt-3 block text-xl transition-colors group-hover:text-gold sm:text-2xl">
                      {item.title}
                    </span>
                    <span className="mt-2 block text-[11px] text-bone/45">
                      {item.trackCount} titre{item.trackCount > 1 ? "s" : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </>
  );
}