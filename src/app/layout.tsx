import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Inter } from "next/font/google";
import { type ReactNode } from "react";
import { AnimatePresence } from 'framer-motion';
import Cursor from '@/components/Cursor';
import { AmbientSound } from "@/components/AmbientSound";

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

const fontDisplay = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const fontSerifDisplay = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: "Conex & Don",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    title: "Conex & Don",
    statusBarStyle: "black-translucent",
  },
  title: {
    default: "CONEX & DON â€” Site officiel | L'hÃ©ritage en mouvement",
    template: "%s | CONEX & DON",
  },
  description: site.description,
  keywords: [
    "Conex et Don",
    "Conex & Don",
    "Conex et Don BÃ©nin",
    "Conex et Don musique",
    "Conex et Don Ayato",
    "Conex et Don La Symphonie BÃ©ninoise",
    "Conex et Don Mode Avion",
    "Conex et Don HÃ©ritage Vivant",
    "Conex et Don DESSIGUIMANZANBERA",
    "duo musical bÃ©ninois",
    "afrobeat bÃ©nin",
    "amapiano bÃ©nin",
  ],
  authors: [{ name: "Conex & Don" }],
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: "CONEX & DON â€” Site officiel",
    title: "CONEX & DON â€” L'hÃ©ritage en mouvement",
    description: site.description,
    images: [
      {
        url: "/api/og?title=CONEX%20%26%20DON&description=L%27h%C3%A9ritage%20en%20mouvement",
        width: 1200,
        height: 630,
        alt: "Conex & Don â€” Site officiel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@conexetdon",
    title: "CONEX & DON â€” L'hÃ©ritage en mouvement",
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
  genre: ["Afrobeat", "Afropop", "Amapiano", "Rap", "Musique bÃ©ninoise"],
  description: site.description,
  foundingLocation: { "@type": "Place", name: "BÃ©nin" },
  foundingDate: "2022",
  member: [
    {
      "@type": "Person",
      name: "Houngbedji Constant ExhaucÃ©",
      alternateName: "Conex",
      birthPlace: { "@type": "Place", name: "Ouidah, BÃ©nin" },
    },
    {
      "@type": "Person",
      name: "Acakpo DieudonnÃ©",
      alternateName: "Don",
      birthPlace: { "@type": "Place", name: "AvÃ©dji, BÃ©nin" },
    },
  ],
  sameAs: socials.map((social, index) => `${social.href}`),
  award: awards.map((award, index) => `${award.title} ${award.year} â€” ${award.detail}`),
  subjectOf: { "@type": "WebSite", name: site.name, url: site.url },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      className={`dark ${fontDisplay.variable} ${fontSerifDisplay.variable} ${fontBody.variable}`}
    >
      <body className="bg-ink text-bone antialiased">
        <div className="ambient" aria-hidden="true" />
        <div className="contents">
          <AmbientSound src="/sounds/ambient-loop.wav" volume={0.08} />
          <link rel="preconnect" href="https://i.ytimg.com" />
          <link rel="preconnect" href="https://s.ytimg.com" />
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
                    <AnimatePresence mode="wait">
                      {children}
                    </AnimatePresence>
                  </main>
                  <Footer />
                  <PlayerDock />
                </>
              </PlayerProvider>
              <span className="sr-only" aria-hidden="true">
                {stats.map((stat, index) => `${stat.value} ${stat.label}`).join(" â€” ")}
              </span>
              <AnalyticsProvider />
              <CookieConsent />
            </>
          </ThemeProvider>
          <script
            dangerouslySetInnerHTML={{
              __html: process.env.NODE_ENV === "production"
                ? `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', async () => {
                  try {
                    const registration = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
                    let refreshing = false;
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                      if (refreshing) return;
                      refreshing = true;
                      window.location.reload();
                    });
                    registration.addEventListener('updatefound', () => {
                      const newWorker = registration.installing;
                      if (!newWorker || !navigator.serviceWorker.controller) return;
                      newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed') {
                          newWorker.postMessage('skipWaiting');
                        }
                      });
                    });
                    console.log('SW registered:', registration.scope);
                  } catch (error) {
                    console.log('SW registration failed:', error);
                  }
                });
              }
            `
                : `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                  registrations.forEach((registration) => registration.unregister());
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
