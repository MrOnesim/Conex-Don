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
    index: "01",
    title: "Booking & partenariats",
    body: "Concerts, festivals, showcases, activations de marque.",
    value: site.contact.bookingEmail,
    href: `mailto:${site.contact.bookingEmail}`,
  },
  {
    index: "02",
    title: "Téléphone",
    body: "Ligne booking / partenariats affichée par l'équipe.",
    value: site.contact.bookingPhone,
    href: `tel:${site.contact.bookingPhone.replace(/\s/g, "")}`,
  },
  {
    index: "03",
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

      <section className="route-section">
        <div className="route-frame grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.58fr)_minmax(20rem,0.42fr)] lg:gap-16">
          <div>
            <p className="eyebrow text-gold">Les bons interlocuteurs</p>
            <ul className="editorial-list mt-5">
              {channels.map((channel) => (
                <li
                  key={channel.title}
                  className="editorial-row grid grid-cols-[auto_minmax(0,1fr)] gap-4 py-6 sm:gap-7 sm:py-8"
                >
                  <span className="pt-1 text-[0.65rem] font-semibold tabular-nums tracking-[0.14em] text-gold">
                    {channel.index}
                  </span>
                  <div>
                    <p className="eyebrow text-bone/40">{channel.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-bone/60">
                      {channel.body}
                    </p>
                    <a
                      href={channel.href}
                      className="display-xl mt-4 block max-w-full break-all text-2xl transition-colors hover:text-gold sm:text-4xl"
                    >
                      {channel.value}{" "}
                      <span
                        className="inline-block text-base text-gold"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-bone/12 pt-6">
              <p className="eyebrow text-bone/40">Plateformes & réseaux</p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="route-link"
                    >
                      {social.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="editorial-panel editorial-panel--padded border-l-2 border-gold lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-gold">La liste ALOBA</p>
            <h2 className="display-xl mt-4 text-4xl sm:text-5xl">
              ÊTRE PRÉVENU
              <br />
              EN PREMIER
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-bone/65">
              Sorties, concerts, rassemblement annoncé en 2026 et contenus
              exclusifs. Pas de spam, uniquement ce qui compte.
            </p>
            <div className="mt-7">
              <NewsletterForm />
            </div>
            <p className="mt-5 border-t border-bone/12 pt-4 text-[0.66rem] leading-relaxed text-bone/40">
              Vous pouvez vous désinscrire à tout moment. Les détails figurent
              dans nos{" "}
              <a
                href="/legal#cookies"
                className="text-gold underline underline-offset-4"
              >
                mentions légales
              </a>
              .
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
