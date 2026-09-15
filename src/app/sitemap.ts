import type { MetadataRoute } from "next";

import { releases } from "@/content/music";
import { news } from "@/content/media";
import { site } from "@/content/site";

const toDate = (value: string) => {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  const year = value.match(/\d{4}/)?.[0];
  return year ? new Date(Number(year), 0, 1) : new Date(0);
};

const staticRoutes = [
  "",
  "/histoire",
  "/musique",
  "/videos",
  "/live",
  "/aloba",
  "/press",
  "/epk",
  "/booking",
  "/contact",
  "/legal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = staticRoutes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const musicPages = releases.map((release) => ({
    url: `${site.url}/musique/${release.slug}`,
    lastModified: toDate(release.releaseDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const pressPages = news.map((post) => ({
    url: `${site.url}/press/${post.slug}`,
    lastModified: toDate(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...musicPages, ...pressPages];
}