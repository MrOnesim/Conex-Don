import Link from "next/link";

import { CookiePreferencesButton } from "@/components/CookiePreferencesButton";
import { NewsletterForm } from "@/components/NewsletterForm";
import { VelocitySkew } from "@/components/VelocitySkew";
import { Marquee } from "@/components/ui";
import { nav, site, socials } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative border-t border-bone/12 bg-ink">
      <div className="border-b border-bone/12 py-4 text-[11px] uppercase tracking-[0.3em] text-bone/40">
        <VelocitySkew max={1.6}>
        <Marquee
          items={[
            "L'HÉRITAGE EN MOUVEMENT",
            "DEUX VOIX · UNE HISTOIRE · UN HÉRITAGE",
            "OUIDAH — AVÉDJI — BÉNIN",
          ]}
          slow
        />
        </VelocitySkew>
      </div>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,1fr)] lg:px-12">
        <div>
          <p className="display-xl text-4xl">
            CONEX <span className="text-gold">&amp;</span> DON
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/60">
            {site.tagline} Duo musical béninois — afrobeat, amapiano, rap, humour et culture
            béninoise.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>

        <nav aria-label="Navigation pied de page">
          <p className="eyebrow text-bone/40">Naviguer</p>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-bone/70 transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/press"
                className="text-sm text-bone/70 transition-colors hover:text-gold"
              >
                NEWSROOM
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className="text-sm text-bone/70 transition-colors hover:text-gold"
              >
                RECHERCHE
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-bone/40">Plateformes</p>
          <ul className="mt-4 space-y-2">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-bone/70 transition-colors hover:text-gold"
                >
                  {social.label} <span className="text-bone/35">{social.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-bone/40">Booking &amp; management</p>
          <a
            href={`mailto:${site.contact.bookingEmail}`}
            className="mt-4 block text-sm text-gold underline decoration-gold/40 underline-offset-4"
          >
            {site.contact.bookingEmail}
          </a>
          <a
            href={`tel:${site.contact.bookingPhone.replace(/\s/g, "")}`}
            className="mt-2 block text-sm text-bone/70 transition-colors hover:text-bone"
          >
            {site.contact.bookingPhone}
          </a>
          <p className="mt-4 text-sm text-bone/50">{site.contact.management}</p>
          <Link
            href="/booking"
            className="mt-6 inline-block border border-bone/25 px-5 py-3 text-[10px] uppercase tracking-[0.22em] transition-colors hover:border-gold hover:text-gold"
          >
            Book Conex &amp; Don
          </Link>
        </div>
      </div>

      <div className="border-t border-bone/12">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-5 text-[10px] uppercase tracking-[0.2em] text-bone/40 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© {new Date().getFullYear()} Conex &amp; Don — Site officiel</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/legal" className="hover:text-bone">
              Mentions légales
            </Link>
            <CookiePreferencesButton className="hover:text-bone" />
            <Link href="/epk" className="hover:text-bone">
              Press kit
            </Link>
            <a href="/api/epk" className="hover:text-bone">
              EPK (PDF)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
