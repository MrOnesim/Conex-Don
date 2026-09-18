import type { Metadata, Viewport } from "next";
import "@fontsource/anton/latin-400.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource-variable/inter/wght.css";
import Script from "next/script";
import { type ReactNode } from "react";

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
    images: [
      "/api/og?title=CONEX%20%26%20DON&description=L%27h%C3%A9ritage%20en%20mouvement",
    ],
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
  colorScheme: "dark light",
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
  sameAs: socials.map((social) => social.href),
  award: awards.map(
    (award) => `${award.title} ${award.year} — ${award.detail}`,
  ),
  subjectOf: { "@type": "WebSite", name: site.name, url: site.url },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className="dark">
      <body className="bg-ink text-bone antialiased">
        <Script id="theme-prepaint" strategy="beforeInteractive">
          {`try {
            const stored = localStorage.getItem('theme');
            const theme = stored === 'light' || stored === 'dark'
              ? stored
              : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(theme);
          } catch (_) { document.documentElement.classList.add('dark'); }`}
        </Script>
        <div className="contents">
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
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(musicGroupSchema),
            }}
          />
          <ThemeProvider>
            <>
              <PlayerProvider>
                <>
                  <SiteHeader />
                  <main id="contenu" className="pb-20">
                    {children}
                  </main>
                  <Footer />
                  <PlayerDock />
                </>
              </PlayerProvider>
              <span className="sr-only" aria-hidden="true">
                {stats.map((stat) => `${stat.value} ${stat.label}`).join(" — ")}
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
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
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
