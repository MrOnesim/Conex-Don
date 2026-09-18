import type { Metadata } from "next";

import { VelocitySkew } from "@/components/VelocitySkew";
import { Marquee } from "@/components/ui";
import { ReleaseGrid } from "@/components/ReleaseGrid";
import { PageHeader } from "@/components/ui";
import { getReleases } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Musique — discographie complète",
  description:
    "Discographie officielle de Conex & Don : Découverte (EP, 2023), La Symphonie Béninoise (album, 2024), Concert Symphonie Béninoise (live), Mode Avion (album, 2024), Héritage Vivant Live (2026) et tous les singles.",
  alternates: { canonical: "/musique" },
};

export default async function MusicPage() {
  const releases = await getReleases();
  const trackTotal = releases.reduce((total, release) => total + release.trackCount, 0);

  return (
    <>
      <PageHeader
        eyebrow="Discographie officielle"
        title="MUSIQUE"
        lead={`${releases.length} projets · ${trackTotal} titres référencés. Filtrez par albums, EP, singles et projets live.`}
        image="/images/SYMPHONIE-BÉNINOISE.webp"
        accent="#D6A83A"
      />

      <div className="border-b border-bone/12 py-4 text-[11px] uppercase tracking-[0.28em] text-bone/40">
        <VelocitySkew max={1.6}>
        <Marquee
          items={releases.map((release) => `${release.title} — ${release.year}`)}
          slow
          reverse
        />
        </VelocitySkew>
      </div>

      <section className="route-section">
        <div className="route-frame route-frame--compact">
          <ReleaseGrid releases={releases} />
        </div>
      </section>
    </>
  );
}
