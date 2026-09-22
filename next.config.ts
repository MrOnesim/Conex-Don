import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Aperçu live Arena : le proxy de preview est servi depuis *.e2b.app
  allowedDevOrigins: ["**.e2b.app"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        // Static public media (images, audio, fonts)
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|mp3|wav|ogg|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: isProd
              ? "public, max-age=31536000, immutable"
              : "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        // Public images directory
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: isProd
              ? "public, max-age=31536000, immutable"
              : "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        // Web manifest, favicon and app icons with fast revalidation
        source: "/(manifest.json|favicon.ico|robots.txt|sitemap.xml|rss.xml)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Global security headers
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
