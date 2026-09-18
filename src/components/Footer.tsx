import Link from "next/link";

import { CookiePreferencesButton } from "@/components/CookiePreferencesButton";
import { NewsletterForm } from "@/components/NewsletterForm";
import { VelocitySkew } from "@/components/VelocitySkew";
import { Marquee } from "@/components/ui";
import { nav, site, socials } from "@/content/site";

export function Footer() {
  return (
    <footer className="site-footer relative bg-ink">
      <div className="site-footer__marquee">
        <VelocitySkew max={1.3}>
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

      <div className="site-footer__lead">
        <div>
          <p className="eyebrow text-gold">Rester dans le mouvement</p>
          <p className="display-xl mt-4 max-w-3xl text-[12vw] leading-[0.82] sm:text-7xl lg:text-[5.8rem]">
            UNE HISTOIRE
            <br />
            QUI CONTINUE.
          </p>
        </div>
        <div className="site-footer__newsletter panel">
          <p className="eyebrow text-bone/45">Le prochain rendez-vous</p>
          <p className="mt-3 text-sm leading-relaxed text-bone/65">
            Sorties, dates, rassemblements et coulisses : l&apos;essentiel, au
            bon moment.
          </p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="site-footer__grid">
        <div>
          <p className="display-xl text-3xl">
            CONEX <span className="text-gold">&amp;</span> DON
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/60">
            {site.tagline} Duo musical béninois — afrobeat, amapiano, rap,
            humour et culture béninoise.
          </p>
        </div>

        <nav aria-label="Navigation pied de page">
          <p className="eyebrow text-bone/40">Explorer</p>
          <ul className="site-footer__links">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/press">Newsroom</Link>
            </li>
            <li>
              <Link href="/search">Recherche</Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-bone/40">Plateformes</p>
          <ul className="site-footer__links">
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer">
                  {social.label} <span>{social.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-bone/40">Booking &amp; management</p>
          <a
            href={`mailto:${site.contact.bookingEmail}`}
            className="site-footer__contact"
            data-cursor="Écrire"
          >
            {site.contact.bookingEmail} ↗
          </a>
          <a
            href={`tel:${site.contact.bookingPhone.replace(/\s/g, "")}`}
            className="site-footer__phone"
          >
            {site.contact.bookingPhone}
          </a>
          <p className="mt-3 text-sm text-bone/50">{site.contact.management}</p>
          <Link href="/booking" className="button button--outline mt-6">
            <span className="button__label">Book Conex &amp; Don</span>
            <span className="button__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Conex &amp; Don — site officiel</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/legal">Mentions légales</Link>
          <CookiePreferencesButton>Gestion des cookies</CookiePreferencesButton>
          <Link href="/epk">Press kit</Link>
          <a href="/api/epk">EPK (PDF)</a>
        </div>
      </div>
    </footer>
  );
}
