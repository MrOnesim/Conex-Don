import type { Metadata } from "next";

import { NewsletterForm } from "@/components/NewsletterForm";
import { PageHeader } from "@/components/ui";
import { site, socials } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contacter Conex & Don et leur équipe : booking, partenariats, presse, médias et communauté ALOBA.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    title: "Booking & partenariats",
    body: "Concerts, festivals, showcases, activations de marque.",
    value: site.contact.bookingEmail,
    href: `mailto:${site.contact.bookingEmail}`,
  },
  {
    title: "Téléphone",
    body: "Ligne booking / partenariats affichée par l'équipe.",
    value: site.contact.bookingPhone,
    href: `tel:${site.contact.bookingPhone.replace(/\s/g, "")}`,
  },
  {
    title: "Presse & médias",
    body: "Interviews, demandes d'images, dossier de presse.",
    value: "Voir l'EPK",
    href: "/epk",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="PARLER AU DUO"
        lead="Une demande de concert, un projet de média, un partenariat ou simplement un message : voici les bons canaux."
      />

      <section className="bg-ink">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:gap-16 lg:px-12 lg:py-24">
          <div>
            <ul className="divide-y divide-bone/10 border-t border-bone/12">
              {channels.map((channel) => (
                <li key={channel.title} className="py-7">
                  <p className="eyebrow text-bone/40">{channel.title}</p>
                  <p className="mt-3 text-sm text-bone/60">{channel.body}</p>
                  <a
                    href={channel.href}
                    className="display-xl mt-4 block break-all text-2xl transition-colors hover:text-gold sm:text-3xl"
                  >
                    {channel.value}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-10 border-t border-bone/12 pt-8">
              <p className="eyebrow text-bone/40">Plateformes & réseaux</p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline text-sm text-bone/70 hover:text-gold"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border border-bone/12 p-6 sm:p-8">
            <p className="eyebrow text-bone/40">Liste ALOBA</p>
            <h2 className="display-xl mt-4 text-3xl sm:text-4xl">
              ÊTRE PRÉVENU
              <br />
              EN PREMIER
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-bone/65">
              Sorties, concerts, rassemblement annoncé en 2026 et contenus exclusifs. Pas de spam,
              uniquement ce qui compte.
            </p>
            <div className="mt-7">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
