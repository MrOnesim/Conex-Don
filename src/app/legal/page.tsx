import type { Metadata } from "next";

import { CookiePreferencesButton } from "@/components/CookiePreferencesButton";
import { PageHeader } from "@/components/ui";
import { site, socials } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales, crédits, propriété intellectuelle et politique de confidentialité du site officiel de Conex & Don.",
  alternates: { canonical: "/legal" },
};

const sections = [
  {
    title: "Éditeur",
    body: `Le présent site est l'univers numérique officiel du duo Conex & Don (Houngbedji Constant Exhaucé, dit Conex, et Acakpo Dieudonné, dit Don), duo musical béninois.\n\nContact : ${site.contact.bookingEmail} — ${site.contact.bookingPhone}`,
  },
  {
    title: "Hébergement & réalisation",
    body: "Site développé en Next.js (App Router), Tailwind CSS et PostgreSQL via Drizzle ORM. Les visuels présentés sont des visuels d'illustration réalisés pour le site officiel.",
  },
  {
    title: "Propriété intellectuelle",
    body: "Les noms Conex & Don, les titres, les œuvres musicales, les clips et les visuels cités appartiennent à leurs ayants droit respectifs. Toute reproduction sans autorisation est interdite. Les liens de streaming renvoient vers les catalogues officiels des plateformes.",
  },
  {
    title: "Données personnelles",
    body: "Le site collecte uniquement les données que vous transmettez volontairement : demandes de booking, inscriptions à la liste ALOBA et messages publiés sur le mur de la communauté. Elles servent exclusivement au suivi de ces demandes et ne sont ni vendues, ni cédées. Vous pouvez demander leur suppression par email.",
  },
  {
    title: "Cookies & Confidentialité",
    body: "Conformément au RGPD et aux recommandations de la CNIL, le site utilise des cookies techniques strictement nécessaires au fonctionnement de la navigation et du lecteur audio immersif. Des mesures d'audience anonymisées peuvent également être collectées si vous les autorisez explicitement. Vous pouvez modifier ou révoquer vos choix à tout moment via le gestionnaire de préférences ci-dessous.",
    isCookieSection: true,
  },
  {
    title: "Crédits",
    body: `Direction artistique et développement : équipe du site officiel.\n\nPlateformes officielles : ${socials
      .map((social) => social.label)
      .join(", ")}.`,
  },
];

export default function LegalPage() {
  return (
    <>
      <PageHeader eyebrow="Informations" title="MENTIONS LÉGALES" accent="#173F32" />
      <section className="bg-ink">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
          {sections.map((section) => (
            <div key={section.title} className="border-b border-bone/12 py-8 first:pt-0">
              <h2 className="display-xl text-2xl sm:text-3xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-bone/70">
                {section.body.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                {section.isCookieSection && (
                  <div className="pt-2">
                    <CookiePreferencesButton className="inline-block border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold hover:bg-gold hover:text-ink transition-colors">
                      Ouvrir les préférences de cookies
                    </CookiePreferencesButton>
                  </div>
                )}
              </div>
            </div>
          ))}
          <p className="mt-8 text-xs text-bone/40">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}.
          </p>
        </div>
      </section>
    </>
  );
}
