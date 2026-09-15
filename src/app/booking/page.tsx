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

export default function BookingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Professionnels"
        title="BOOK CONEX & DON"
        lead="Concerts, festivals, showcases, activations de marque, partenariats et médias. Renseignez les informations clés de votre projet : l'équipe revient vers vous."
        accent="#9E382C"
      />

      <section className="bg-ink">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)] lg:gap-16 lg:px-12 lg:py-20">
          <div className="border border-bone/12 p-6 sm:p-10">
            <p className="eyebrow text-bone/40">Formulaire de demande</p>
            <h2 className="display-xl mt-4 text-3xl sm:text-4xl">VOTRE ÉVÉNEMENT</h2>
            <div className="mt-9">
              <BookingForm />
            </div>
          </div>

          <aside className="space-y-8">
            <div className="border border-bone/12 p-6 sm:p-8">
              <p className="eyebrow text-bone/40">Contact booking</p>
              <a
                href={`mailto:${site.contact.bookingEmail}`}
                className="mt-4 block break-all text-lg text-gold"
                data-cursor="Écrire"
              >
                {site.contact.bookingEmail}
              </a>
              <a
                href={`tel:${site.contact.bookingPhone.replace(/\s/g, "")}`}
                className="mt-3 block text-lg text-bone/85"
              >
                {site.contact.bookingPhone}
              </a>
              <p className="mt-4 text-sm text-bone/55">{site.contact.management}</p>
            </div>

            <div className="border border-bone/12 p-6 sm:p-8">
              <p className="eyebrow text-bone/40">Ce qu&apos;il faut préciser</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-bone/65">
                <li>— Date, ville, pays et lieu de l&apos;événement</li>
                <li>— Type de prestation et durée de set souhaitée</li>
                <li>— Jauge / capacité attendue et public</li>
                <li>— Budget indicatif (cache, travel, hébergement)</li>
                <li>— Ligne d&apos;affichage et autres artistes confirmés</li>
                <li>— Fiche technique et backline disponibles sur place</li>
              </ul>
            </div>

            <div className="border border-bone/12 p-6 sm:p-8">
              <p className="eyebrow text-bone/40">Délais</p>
              <p className="mt-4 text-sm leading-relaxed text-bone/65">
                Les demandes internationales et les dates de haute saison sont traitées en priorité
                : anticipez si possible 8 à 12 semaines avant la date envisagée.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
