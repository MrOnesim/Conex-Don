import type { Metadata } from "next";
import Link from "next/link";

import { OptimizedImage } from "@/components/OptimizedImage";
import { PageHeader } from "@/components/ui";
import { getNews } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsroom — actualités et presse",
  description:
    "Newsroom Conex & Don : sorties, concerts, annonces, interviews, presse et coulisses. Le grand rassemblement ALOBA, DESSIGUIMANZANBERA, Héritage Vivant, Mode Avion, La Symphonie Béninoise.",
  alternates: { canonical: "/press" },
  openGraph: {
    title: "Newsroom & Actualités — CONEX & DON",
    description:
      "Toutes les actualités officielles, sorties, annonces de concerts et interviews du duo Conex & Don.",
    images: [
      {
        url: "/api/og?title=NEWSROOM%20%26%20PRESSE&description=Actualit%C3%A9s%2C%20communiqu%C3%A9s%2C%20sorties%20et%20coulisses&type=article",
        width: 1200,
        height: 630,
        alt: "Newsroom — Conex & Don",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsroom & Actualités — CONEX & DON",
    images: [
      "/api/og?title=NEWSROOM%20%26%20PRESSE&description=Actualit%C3%A9s%2C%20communiqu%C3%A9s%2C%20sorties%20et%20coulisses&type=article",
    ],
  },
};

const categoryAccent: Record<string, string> = {
  MUSIC: "#D6A83A",
  LIVE: "#9E382C",
  PRESS: "#173F32",
  "BEHIND THE SCENES": "#6F4A32",
  ANNONCE: "#D6A83A",
};

export default async function PressPage() {
  const posts = await getNews();
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHeader
        eyebrow="Newsroom"
        title="ACTUALITÉS"
        lead="Sorties, concerts, annonces, presse et coulisses. Chaque information est sourcée et reliée à son support d'origine lorsqu'il existe."
        image="/images/DESSIGUIMANZANBERA.jpg"
        accent="#D6A83A"
      />

      <section className="bg-ink">
        <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          {lead ? (
            <Link
              href={`/press/${lead.slug}`}
              className="group grid grid-cols-1 gap-8 border-b border-bone/12 pb-12 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] lg:gap-14"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden border border-bone/15">
                <OptimizedImage
                  src={lead.image ?? "/images/HÉRITAGE-VIVANT.jpg"}
                  alt={lead.title}
                  fill
                  priority
                  accent={categoryAccent[lead.category] ?? "#D6A83A"}
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="h-full w-full"
                  imageClassName="object-cover duotone transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <span
                  className="absolute left-4 top-4 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em]"
                  style={{
                    backgroundColor: categoryAccent[lead.category] ?? "#D6A83A",
                    color: "#080808",
                  }}
                >
                  À la une · {lead.category}
                </span>
              </div>
              <div className="flex flex-col justify-end">
                <p className="eyebrow text-bone/40">{lead.publishedAt}</p>
                <h2 className="display-xl mt-4 text-3xl leading-[0.95] sm:text-5xl lg:text-[3.4rem]">
                  {lead.title}
                </h2>
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-bone/70">
                  {lead.excerpt}
                </p>
                <span className="mt-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Lire l&apos;article
                  <span className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ) : null}

          <ul className="mt-12 divide-y divide-bone/10">
            {rest.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/press/${post.slug}`}
                  className="group grid grid-cols-1 gap-4 py-7 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
                >
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: categoryAccent[post.category] ?? "#D6A83A" }}
                  >
                    {post.category}
                  </span>
                  <span>
                    <span className="display-xl block text-2xl leading-tight transition-colors group-hover:text-gold sm:text-3xl">
                      {post.title}
                    </span>
                    <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-bone/60">
                      {post.excerpt}
                    </span>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-bone/40">
                    {post.publishedAt}
                    {post.source ? ` · ${post.source}` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid grid-cols-1 gap-px border border-bone/12 bg-bone/12 sm:grid-cols-3">
            {[
              { title: "Press kit", body: "Biographies, photos HD, discographie, fiche technique.", href: "/epk" },
              { title: "Booking", body: "Concerts, festivals, activations, partenariats.", href: "/booking" },
              { title: "EPK PDF", body: "Télécharger le dossier de presse complet.", href: "/api/epk" },
            ].map((item) => (
              <div key={item.title} className="bg-ink p-6">
                <p className="display-xl text-2xl">{item.title}</p>
                <p className="mt-2 text-sm text-bone/60">{item.body}</p>
                <Link
                  href={item.href}
                  className="mt-5 inline-block border-b border-bone/30 pb-1 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold"
                >
                  Accéder
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
