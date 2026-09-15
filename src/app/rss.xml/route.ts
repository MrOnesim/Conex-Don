import { getNews, getReleases } from "@/lib/data";
import { site } from "@/content/site";

export const dynamic = "force-static";
export const revalidate = 3600;

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(dateString: string | null): string {
  if (!dateString) return new Date().toISOString();
  const date = new Date(dateString);
  return date.toISOString();
}

export async function GET() {
  const [news, releases] = await Promise.all([getNews(), getReleases()]);

  const baseUrl = site.url;
  const now = new Date().toISOString();

  const newsItems = news
    .filter((post) => post.publishedAt)
    .slice(0, 20)
    .map((post) => `
    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${baseUrl}/press/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/press/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt!).toUTCString()}</pubDate>
      <description><![CDATA[${escapeXml(post.excerpt)}]]></description>
      <category>${escapeXml(post.category)}</category>
      ${post.image ? `<enclosure url="${baseUrl}${post.image}" type="image/jpeg" />` : ""}
    </item>
  `).join("");

  const releaseItems = releases
    .filter((release) => release.releaseDate)
    .slice(0, 20)
    .map((release) => `
    <item>
      <title><![CDATA[${escapeXml(release.title)} (${release.kind})]]></title>
      <link>${baseUrl}/musique/${release.slug}</link>
      <guid isPermaLink="true">${baseUrl}/musique/${release.slug}</guid>
      <pubDate>${new Date(release.releaseDate!).toUTCString()}</pubDate>
      <description><![CDATA[${escapeXml(release.description ?? "")}]]></description>
      <category>${escapeXml(release.kind)}</category>
      ${release.coverImage ? `<enclosure url="${baseUrl}${release.coverImage}" type="image/jpeg" />` : ""}
    </item>
  `).join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title><![CDATA[${escapeXml(site.name)} — Actualités & Sorties]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${escapeXml(site.description)}]]></description>
    <language>fr</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/images/HÉRITAGE-VIVANT.jpg</url>
      <title><![CDATA[${escapeXml(site.name)}]]></title>
      <link>${baseUrl}</link>
    </image>
    ${newsItems}
    ${releaseItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}