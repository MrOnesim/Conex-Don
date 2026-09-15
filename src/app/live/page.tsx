import type { Metadata } from "next";
import { OptimizedImage } from "@/components/OptimizedImage";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Reveal } from "@/components/Reveal";
import { BookingCta, HeritageSection } from "@/components/sections";
import { CTA, Kicker, PageHeader } from "@/components/ui";
import { getEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live — concerts, rassemblement et archives",
  description:
    "Agenda live de Conex & Don : le grand rassemblement ALOBA annoncé en 2026, la live expérience Héritage Vivant, le Concert Symphonie Béninoise et les archives de concerts.",
  alternates: { canonical: "/live" },
  openGraph: {
    title: "Concerts & Scène Live — CONEX & DON",
    description:
      "Dates de tournée, grands rassemblements ALOBA et archives scéniques du duo Conex & Don.",
    images: [
      {
        url: "/api/og?title=CONCERTS%20%26%20LIVE&description=Dates%20de%20tourn%C3%A9e%2C%20exp%C3%A9riences%20sc%C3%A9niques%20et%20archives&type=live",
        width: 1200,
        height: 630,
        alt: "Live — Conex & Don",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Concerts & Scène Live — CONEX & DON",
    images: [
      "/api/og?title=CONCERTS%20%26%20LIVE&description=Dates%20de%20tourn%C3%A9e%2C%20exp%C3%A9riences%20sc%C3%A9niques%20et%20archives&type=live",
    ],
  },
};

function generateEventSchema(events: Awaited<ReturnType<typeof getEvents>>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "MusicEvent",
        name: event.title,
        startDate: event.eventDate ?? undefined,
        eventStatus: event.status === "upcoming" ? "https://schema.org/EventScheduled" : "https://schema.org/EventCompleted",
        location: {
          "@type": "Place",
          name: event.venue ?? undefined,
          address: {
            "@type": "PostalAddress",
            addressLocality: event.city ?? undefined,
            addressCountry: event.country ?? "Bénin",
          },
        },
        image: event.image ?? undefined,
        description: event.note ?? undefined,
        performer: {
          "@type": "MusicGroup",
          name: "Conex et Don",
          url: "https://conexetdon.com",
        },
        ...(event.ticketUrl ? { offers: { "@type": "Offer", url: event.ticketUrl } } : {}),
      },
    })),
  };
}

export default async function LivePage() {
  const events = await getEvents();
  const upcoming = events.filter((event) => event.status === "upcoming");
  const archives = events.filter((event) => event.status !== "upcoming");
  const hero = upcoming[0];

  const eventSchema = generateEventSchema(events);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <PageHeader
        eyebrow="Live experience"
        title="LIVE"
        lead="Le prochain rendez-vous, la billetterie quand elle ouvre, et les archives de ce qui a déjà été joué."
        image="/images/HÉRITAGE-VIVANT.jpg"
        accent="#173F32"
      />

      {hero ? (
        <section className="border-b border-bone/10 bg-ink">
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:gap-16 lg:px-12 lg:py-24">
            <div>
              <span className="flex items-center gap-3 eyebrow text-clay">
                <span className="live-dot block h-2 w-2 rounded-full bg-clay" />
                Prochainement
              </span>
              <h2 className="display-xl mt-6 text-[12vw] leading-[0.84] sm:text-6xl lg:text-[6rem]">
                {hero.title}
              </h2>
              <dl className="mt-9 grid grid-cols-2 gap-6 border-y border-bone/12 py-6 sm:grid-cols-4">
                {[
                  { label: "Date", value: hero.eventDate ?? "À annoncer" },
                  { label: "Ville", value: hero.city ?? "Bénin" },
                  { label: "Pays", value: hero.country ?? "Bénin" },
                  { label: "Lieu", value: hero.venue ?? "—" },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="eyebrow text-bone/40">{item.label}</dt>
                    <dd className="mt-2 text-sm text-bone/85">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-bone/70">{hero.note}</p>
            </div>

            <Reveal variant="mask">
              <div className="relative aspect-4/5 w-full overflow-hidden border border-bone/15 lg:aspect-square">
                <OptimizedImage
                  src={hero.image ?? "/images/HÉRITAGE-VIVANT.jpg"}
                  alt={`${hero.title} — visuel live`}
                  fill
                  accent="#173F32"
                  sizes="(max-width: 1024px) 92vw, 42vw"
                  className="h-full w-full"
                  imageClassName="object-cover duotone"
                />
                <div className="absolute inset-0 bg-ink/25" />
              </div>
              <div className="mt-6 border border-bone/12 p-6">
                <Kicker>Billetterie</Kicker>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">
                  La billetterie n&apos;est pas encore ouverte. Inscrivez-vous à la liste ALOBA :
                  vous recevrez la date, le lieu et le lien de réservation en premier.
                </p>
                <div className="mt-5">
                  <NewsletterForm />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="border-b border-bone/10 bg-ink-soft">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-bone/12 pb-6">
            <h2 className="display-xl text-[12vw] leading-[0.86] sm:text-6xl lg:text-7xl">
              ARCHIVES
            </h2>
            <p className="max-w-sm text-sm text-bone/55">
              Ce qui a déjà été joué : albums sur scène, invités, moments forts.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-px border border-bone/12 bg-bone/12 sm:grid-cols-2">
            {archives.map((event) => (
              <li key={event.title} className="bg-ink">
                <div className="group relative aspect-16/10 w-full overflow-hidden">
                  <OptimizedImage
                    src={event.image ?? "/images/SYMPHONIE-BÉNINOISE.webp"}
                    alt={`${event.title} — ${event.city}`}
                    fill
                    accent="#9E382C"
                    sizes="(max-width: 640px) 92vw, 46vw"
                    className="h-full w-full"
                    imageClassName="object-cover duotone transition-transform duration-[1200ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ink/35" />
                  <span className="absolute left-4 top-4 bg-ink/85 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-bone/80">
                    {event.eventDate}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="display-xl text-2xl sm:text-3xl">{event.title}</h3>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-bone/45">
                    {event.venue} · {event.city} · {event.country}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-bone/65">{event.note}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <CTA href="/videos" tone="outline">
              Voir les captations
            </CTA>
            <CTA href="/booking" tone="solid">
              Book Conex & Don
            </CTA>
          </div>
        </div>
      </section>

      <HeritageSection />
      <BookingCta />
    </>
  );
}