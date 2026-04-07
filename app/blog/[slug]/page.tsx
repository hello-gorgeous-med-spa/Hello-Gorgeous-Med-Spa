import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { blogPosts, getPostBySlug, getAllSlugs } from "@/data/blog-posts";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: `${SITE.url}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE.url}/blog/${post.slug}`,
      siteName: SITE.name,
      publishedTime: post.date,
      ...(post.featuredImage && {
        images: [{ url: `${SITE.url}${post.featuredImage}`, width: 1200, height: 630, alt: post.title }],
      }),
    },
  };
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-2 my-4 ml-4">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-black/80">
              <span className="text-[#E91E8C] mt-1 flex-shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item.replace(/^[-•*]\s*/, "")) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (tableHeaders.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {tableHeaders.map((h, i) => (
                  <th key={i} className="text-left p-3 font-bold text-black border-b-2 border-[#E91E8C]/30 bg-[#E91E8C]/5">{h.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-black/[0.02]" : ""}>
                  {row.map((cell, j) => (
                    <td key={j} className="p-3 text-black/75 border-b border-black/5" dangerouslySetInnerHTML={{ __html: inlineFormat(cell.trim()) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeaders = [];
      tableRows = [];
      inTable = false;
    }
  };

  const inlineFormat = (text: string): string => {
    return text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#E91E8C] font-semibold hover:underline">$1</a>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-black/5 px-1.5 py-0.5 rounded text-sm">$1</code>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table detection
    if (line.includes("|") && line.trim().startsWith("|")) {
      const cells = line.split("|").filter((c) => c.trim()).map((c) => c.trim());
      if (!inTable) {
        tableHeaders = cells;
        inTable = true;
        flushList();
        continue;
      }
      if (line.match(/^\|[\s-|]+\|$/)) continue; // separator
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Markdown images: ![alt text](/path/to/image.png)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (imgMatch) {
      flushTable();
      flushList();
      const alt = imgMatch[1];
      const src = imgMatch[2];
      elements.push(
        <figure key={`img-${i}`} className="my-10">
          {/* eslint-disable-next-line @next/next/no-img-element -- blog body uses dynamic CMS markdown paths */}
          <img
            src={src}
            alt={alt}
            className="w-full max-w-2xl mx-auto rounded-2xl border border-black/10 shadow-md"
            loading="lazy"
          />
        </figure>
      );
      continue;
    }

    // List items
    if (line.match(/^[-•*]\s/) || line.match(/^\d+\.\s/)) {
      flushTable();
      inList = true;
      listItems.push(line);
      continue;
    } else if (inList) {
      flushList();
    }

    // Headers
    if (line.startsWith("### ")) {
      flushTable(); flushList();
      elements.push(<h3 key={i} className="text-xl font-bold text-black mt-8 mb-3">{line.replace("### ", "")}</h3>);
    } else if (line.startsWith("## ")) {
      flushTable(); flushList();
      elements.push(<h2 key={i} className="text-2xl md:text-3xl font-bold text-black mt-10 mb-4 font-serif">{line.replace("## ", "")}</h2>);
    } else if (line.startsWith("# ")) {
      // Skip H1 — we render it separately
      continue;
    } else if (line.trim() === "") {
      continue;
    } else {
      elements.push(
        <p key={i} className="text-black/80 leading-relaxed my-3" dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
      );
    }
  }

  flushList();
  flushTable();

  return elements;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const postUrl = `${SITE.url}/blog/${post.slug}`;
  const breadcrumbItems = [
    { name: "Home", url: SITE.url },
    { name: "Blog", url: `${SITE.url}/blog` },
    { name: post.title, url: postUrl },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: `${SITE.url}/images/logo-full.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    ...(post.featuredImage && {
      image: [`${SITE.url}${post.featuredImage}`],
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)) }}
      />
      {post.structuredDataFaqs?.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd(post.structuredDataFaqs, postUrl)),
          }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "@id": `${SITE.url}/#organization`,
            name: SITE.name,
            telephone: SITE.phone,
            url: SITE.url,
            address: {
              "@type": "PostalAddress",
              streetAddress: SITE.address.streetAddress,
              addressLocality: SITE.address.addressLocality,
              addressRegion: SITE.address.addressRegion,
              postalCode: SITE.address.postalCode,
            },
          }),
        }}
      />

      <main className="bg-white">
        {/* Hero */}
        <section className="bg-black text-white py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#E91E8C]/20 text-[#E91E8C] text-xs font-bold rounded-full uppercase tracking-wider">
                {post.category}
              </span>
              <span className="text-white/40 text-sm">{post.readTime} read</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight font-serif mb-6">
              {post.title}
            </h1>
            <p className="text-lg text-white/70">{post.excerpt}</p>
            <div className="mt-6 text-sm text-white/40">
              Published {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} by Hello Gorgeous Med Spa
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-6">
            {renderMarkdown(post.content)}
          </div>
        </article>

        {/* CTA */}
        <section className="py-12 bg-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
              Ready to Experience Hello Gorgeous?
            </h2>
            <p className="text-white/60 mb-8">
              NP on site 7 days a week. Same-day consultations and prescriptions available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#E91E8C] hover:bg-[#c90a68] text-white font-bold rounded-full text-lg transition-all hover:scale-105"
              >
                Book Free Consultation
              </Link>
              <a
                href="tel:6306366193"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-full text-lg transition-all"
              >
                📞 630-636-6193
              </a>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-black mb-8 font-serif">More from Hello Gorgeous</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {otherPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block rounded-2xl border border-black/10 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="bg-black p-6">
                    <span className="text-xs text-[#E91E8C] font-bold uppercase tracking-wider">{p.category}</span>
                    <h3 className="text-white font-bold mt-2 group-hover:text-[#E91E8C] transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-black/60 text-sm line-clamp-2">{p.excerpt}</p>
                    <span className="text-[#E91E8C] text-sm font-semibold mt-3 block">Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
