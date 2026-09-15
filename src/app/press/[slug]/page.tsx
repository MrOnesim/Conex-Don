import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OptimizedImage } from "@/components/OptimizedImage";
import { getNews, getNewsPost } from "@/lib/data";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) return { title: "Article introuvable" };
  const ogImage = `/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(
    post.excerpt,
  )}&type=article${post.image ? `&image=${encodeURIComponent(post.image)}` : ""}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/press/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export default async function NewsPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) notFound();
  const others = (await getNews()).filter((item) => item.slug !== post.slug).slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    inLanguage: "fr",
    articleSection: post.category,
    author: { "@type": "Organization", name: "Conex & Don" },
    publisher: { "@type": "Organization", name: "Conex & Don" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article className="pt-24 sm:pt-32">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link
            href="/press"
            className="link-underline text-[10px] uppercase tracking-[0.22em] text-bone/50 hover:text-bone"
          >
            ← Newsroom
          </Link>
          <p className="eyebrow mt-8 text-gold">{post.category}</p>
          <h1 className="display-xl mt-5 text-[10vw] leading-[0.9] sm:text-5xl">{post.title}</h1>
          <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-bone/40">
            <span>{post.publishedAt}</span>
            {post.source ? <span>Source : {post.source}</span> : null}
          </p>
        </div>

        {post.image ? (
          <div className="relative mx-auto mt-10 aspect-16/9 w-full max-w-6xl overflow-hidden border-y border-bone/12">
            <OptimizedImage
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="h-full w-full"
              imageClassName="object-cover duotone"
            />
            <div className="absolute inset-0 bg-ink/25" />
          </div>
        ) : null}

        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
          <div className="space-y-6 text-[16px] leading-[1.75] text-bone/80">
            {(post.body ?? post.excerpt).split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {post.sourceUrl ? (
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block border border-bone/25 px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold"
            >
              Voir la source : {post.source}
            </a>
          ) : null}

          <div className="mt-16 border-t border-bone/12 pt-8">
            <p className="eyebrow text-bone/40">À lire ensuite</p>
            <ul className="mt-5 divide-y divide-bone/10">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/press/${item.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-4"
                  >
                    <span className="display-xl text-xl transition-colors group-hover:text-gold sm:text-2xl">
                      {item.title}
                    </span>
                    <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-bone/40">
                      {item.publishedAt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </>
  );
}
