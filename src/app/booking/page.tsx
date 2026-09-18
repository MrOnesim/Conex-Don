import type { Metadata } from "next";

import { BookingForm } from "@/components/BookingForm";
import { PageHeader } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Booking — book Conex & Don",
  description:
    "Book Conex & Don : concerts, festivals, showcases, activations de marque et partenariats. Formulaire de demande et contacts officiels de booking.",
  alternates: { canonical: "/booking" },
};

const checklist = [
  "Date, ville, pays et lieu de l'événement",
  "Type de prestation et durée de set souhaitée",
  "Jauge / capacité attendue et public",
  "Budget indicatif : cachet, voyage et hébergement",
  "Ligne d'affichage et artistes confirmés",
  "Fiche technique et backline disponibles sur place",
];

export default function BookingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Professionnels"
        title="BOOK CONEX & DON"
        lead="Concerts, festivals, showcases, activations de marque, partenariats et médias. Renseignez les informations clés de votre projet : l'équipe revient vers vous."
        accent="#9E382C"
      />

      <section className="route-section">
        <div className="route-frame grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.62fr)_minmax(18rem,0.38fr)] lg:gap-12">
          <article className="editorial-panel editorial-panel--padded border-l-2 border-clay">
            <div className="flex items-baseline justify-between gap-4 border-b border-bone/12 pb-5">
              <div>
                <p className="eyebrow text-clay">Demande de disponibilité</p>
                <h2 className="display-xl mt-3 text-3xl sm:text-5xl">
                  VOTRE ÉVÉNEMENT
                </h2>
              </div>
              <p className="text-[0.63rem] font-semibold tabular-nums tracking-[0.15em] text-bone/40">
                01 / 01
              </p>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-bone/60">
              Quelques informations suffisent pour lancer l&apos;échange. Les
              champs marqués d&apos;un astérisque sont nécessaires pour vous
              répondre.
            </p>
            <div className="mt-8">
              <BookingForm />
            </div>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <section className="editorial-panel editorial-panel--padded">
              <p className="eyebrow text-bone/40">Contact direct</p>
              <a
                href={`mailto:${site.contact.bookingEmail}`}
                className="route-link mt-4 max-w-full break-all text-gold"
                data-cursor="Écrire"
              >
                {site.contact.bookingEmail} <span aria-hidden="true">↗</span>
              </a>
              <a
                href={`tel:${site.contact.bookingPhone.replace(/\s/g, "")}`}
                className="mt-4 block text-lg text-bone/85 transition-colors hover:text-gold"
              >
                {site.contact.bookingPhone}
              </a>
              <p className="mt-3 text-sm text-bone/50">
                {site.contact.management}
              </p>
            </section>

            <section className="editorial-panel editorial-panel--padded">
              <p className="eyebrow text-bone/40">Pour aller vite</p>
              <ul className="editorial-list mt-4">
                {checklist.map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-3 py-3 text-sm leading-relaxed text-bone/65"
                  >
                    <span className="shrink-0 text-[0.63rem] font-semibold tabular-nums text-clay">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="route-callout py-3">
              <p className="eyebrow text-gold">Délais</p>
              <p className="mt-3 text-sm leading-relaxed text-bone/60">
                Les demandes internationales et les dates de haute saison sont
                traitées en priorité. Anticipez si possible 8 à 12 semaines
                avant la date envisagée.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </>
  );
}
