import type { Metadata } from "next";

import { AlobaWall, type AlobaPost } from "@/components/AlobaSection";
import { Marquee, PageHeader } from "@/components/ui";
import { socials } from "@/content/site";
import { getAlobaPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ALOBA — la communauté Conex & Don",
  description:
    "ALOBA, la communauté de Conex & Don : le mur des fans, les messages, les hashtags, les événements et les contenus exclusifs.",
  alternates: { canonical: "/aloba" },
};

export default async function AlobaPage() {
  const posts = await getAlobaPosts();
  const initial: AlobaPost[] = posts.map((post) => ({
    id: post.id,
    displayName: post.displayName,
    handle: post.handle,
    city: post.city,
    mood: post.mood,
    message: post.message,
    createdAt: post.createdAt,
  }));

  return (
    <>
      <PageHeader
        eyebrow="La communauté"
        title="ALOBA"
        lead="ALOBA, c'est le nom donné à ceux qui suivent le duo depuis les freestyles de 2022. Ce mur leur appartient : photos, vidéos, messages, hashtags, concours et avant-premières."
        accent="#D6A83A"
      />

      <div className="border-b border-bone/12 py-4 text-[11px] uppercase tracking-[0.28em] text-bone/40">
        <Marquee
          items={["#ALOBA", "CONEX & DON", "L'HÉRITAGE EN MOUVEMENT", "DEUX VOIX · UNE HISTOIRE"]}
        />
      </div>

      <section className="bg-ink">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <AlobaWall initialPosts={initial} />

          <div className="mt-16 grid grid-cols-1 gap-px border border-bone/12 bg-bone/12 sm:grid-cols-3">
            {[
              {
                title: "Événements",
                body: "Concours, rassemblements et avant-premières réservés à la liste ALOBA.",
              },
              {
                title: "Hashtags",
                body: "#ALOBA #ConexEtDon #HéritageVivant #ModeAvion #SymphonieBéninoise",
              },
              {
                title: "Exclusifs",
                body: "Coulisses, versions live et annonces envoyées en premier aux abonnés.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-ink p-6 sm:p-8">
                <h3 className="display-xl text-2xl sm:text-3xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/60">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-bone/12 pt-8">
            <p className="eyebrow text-bone/40">Suivre le duo</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-sm text-bone/70 hover:text-gold"
                  >
                    {social.label} <span className="text-bone/35">{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
