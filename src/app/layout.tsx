import type { Metadata, Viewport } from "next";
import { Children, type ReactNode } from "react";

import { AnalyticsProvider } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { CursorLabel } from "@/components/CursorLabel";
import { Footer } from "@/components/Footer";
import { PlayerDock, PlayerProvider } from "@/components/player";
import { SiteHeader } from "@/components/SiteHeader";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import { awards, site, socials, stats } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "CONEX & DON — Site officiel | L'héritage en mouvement",
    template: "%s | CONEX & DON",
  },
  description: site.description,
  keywords: [
    "Conex et Don",
    "Conex & Don",
    "Conex et Don Bénin",
    "Conex et Don musique",
    "Conex et Don Ayato",
    "Conex et Don La Symphonie Béninoise",
    "Conex et Don Mode Avion",
    "Conex et Don Héritage Vivant",
    "Conex et Don DESSIGUIMANZANBERA",
    "duo musical béninois",
    "afrobeat bénin",
    "amapiano bénin",
  ],
  authors: [{ name: "Conex & Don" }],
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: "CONEX & DON — Site officiel",
    title: "CONEX & DON — L'héritage en mouvement",
    description: site.description,
    images: [
      {
        url: "/api/og?title=CONEX%20%26%20DON&description=L%27h%C3%A9ritage%20en%20mouvement",
        width: 1200,
        height: 630,
        alt: "Conex & Don — Site officiel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@conexetdon",
    title: "CONEX & DON — L'héritage en mouvement",
    description: site.description,
    images: ["/api/og?title=CONEX%20%26%20DON&description=L%27h%C3%A9ritage%20en%20mouvement"],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

const musicGroupSchema = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Conex et Don",
  alternateName: ["Conex & Don", "Conexetdon"],
  genre: ["Afrobeat", "Afropop", "Amapiano", "Rap", "Musique béninoise"],
  description: site.description,
  foundingLocation: { "@type": "Place", name: "Bénin" },
  foundingDate: "2022",
  member: [
    {
      "@type": "Person",
      name: "Houngbedji Constant Exhaucé",
      alternateName: "Conex",
      birthPlace: { "@type": "Place", name: "Ouidah, Bénin" },
    },
    {
      "@type": "Person",
      name: "Acakpo Dieudonné",
      alternateName: "Don",
      birthPlace: { "@type": "Place", name: "Avédji, Bénin" },
    },
  ],
  sameAs: socials.map((social, index) => `${social.href}`),
  award: awards.map((award, index) => `${award.title} ${award.year} — ${award.detail}`),
  subjectOf: { "@type": "WebSite", name: site.name, url: site.url },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="CONEX & DON — RSS" href="/rss.xml" />
        <meta name="theme-color" content="#080808" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Conex & Don" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.classList.remove("dark","light");document.documentElement.classList.add(t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-ink text-bone antialiased">
        <div className="contents">
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://i.ytimg.com" />
          <link rel="preconnect" href="https://s.ytimg.com" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap"
          />
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
          >
            Aller au contenu
          </a>
          <SmoothScroll />
          <ScrollProgress />
          <CursorLabel />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroupSchema) }}
          />
          <ThemeProvider>
            <>
              <PlayerProvider>
                <>
                  <SiteHeader />
                  <main id="contenu" className="pb-20">
                    {Children.toArray(children)}
                  </main>
                  <Footer />
                  <PlayerDock />
                </>
              </PlayerProvider>
              <span className="sr-only" aria-hidden="true">
                {stats.map((stat, index) => `${stat.value} ${stat.label}`).join(" — ")}
              </span>
              <AnalyticsProvider />
              <CookieConsent />
            </>
          </ThemeProvider>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then((registration) => {
                    console.log('SW registered:', registration.scope);
                  }).catch((error) => {
                    console.log('SW registration failed:', error);
                  });
                });
              }
            `,
            }}
          />
        </div>
      </body>
    </html>
  );
}