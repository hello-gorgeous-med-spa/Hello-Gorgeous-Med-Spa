import type { Metadata } from "next";
import Link from "next/link";

import { BLOG_CATEGORY_HELLO_GORGEOUS_RX, rxProductBlogPosts } from "@/data/blog-rx-product-posts";
import { blogPosts } from "@/data/blog-posts";
import { pageMetadata, SITE } from "@/lib/seo";

const RX_FILTER = "rx" as const;

function isRxFilter(value: string | string[] | undefined): boolean {
  if (Array.isArray(value)) return value[0] === RX_FILTER;
  return value === RX_FILTER;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const rxOnly = isRxFilter(params.filter);

  if (rxOnly) {
    const canonical = `${SITE.url}/blog?filter=${RX_FILTER}`;
    const title = "Hello Gorgeous RX™ Articles | Compounded Rx Guides | Oswego, IL";
    const description =
      "Every Hello Gorgeous RX™ compounded medication guide in one place — GLP-1 weight loss, peptides, hormones, NAD+, hair loss, sexual wellness, and vitamins. Oswego, IL · serving Naperville, Aurora & Plainfield.";
    return {
      ...pageMetadata({ title, description, path: "/blog" }),
      title,
      description,
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        title: `${title} | ${SITE.name}`,
        description,
        siteName: SITE.name,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | ${SITE.name}`,
        description,
      },
    };
  }

  return pageMetadata({
    title: "Blog & Resources | Hello Gorgeous Med Spa",
    description:
      "Expert articles on Botox, fillers, weight loss, hormone therapy, peptides, Morpheus8 Burst, Solaria CO₂, QuantumRF, men's health, and Hello Gorgeous RX™ compounded prescription guides (Oswego, IL).",
    path: "/blog",
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const params = await searchParams;
  const rxOnly = isRxFilter(params.filter);

  const rxSorted = [...rxProductBlogPosts].sort((a, b) => b.date.localeCompare(a.date));

  const featured = blogPosts[0];
  const restAll = blogPosts.slice(1);

  const filterTabs = (
    <div className="flex flex-wrap items-center gap-2 mb-8" role="tablist" aria-label="Blog categories">
      <Link
        href="/blog"
        scroll={false}
        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          !rxOnly
            ? "bg-[#E91E8C] text-white"
            : "bg-black/5 text-black/70 hover:bg-black/10 hover:text-black"
        }`}
        aria-selected={!rxOnly}
        role="tab"
      >
        All articles
      </Link>
      <Link
        href={`/blog?filter=${RX_FILTER}`}
        scroll={false}
        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          rxOnly
            ? "bg-[#E91E8C] text-white"
            : "bg-black/5 text-black/70 hover:bg-black/10 hover:text-black"
        }`}
        aria-selected={rxOnly}
        role="tab"
      >
        Hello Gorgeous RX™
        <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold tabular-nums">
          {rxSorted.length}
        </span>
      </Link>
      {rxOnly ? (
        <Link
          href="/products-we-offer"
          className="ml-auto text-sm font-semibold text-[#E91E8C] hover:underline"
        >
          View product catalog →
        </Link>
      ) : null}
    </div>
  );

  if (rxOnly) {
    const featuredRx = rxSorted[0];
    const restRx = rxSorted.slice(1);

    return (
      <main className="bg-white">
        <section className="bg-black text-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-[#E91E8C] text-sm font-semibold uppercase tracking-widest mb-4">
              Hello Gorgeous RX™
            </p>
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Compounded Rx guides</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              One article per medication family on our catalog — education only; prescriptions require a consultation
              in Oswego, IL.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-12 bg-white border-b border-black/5">
          <div className="max-w-4xl mx-auto px-6">{filterTabs}</div>
        </section>

        {featuredRx ? (
          <section className="py-12 md:py-16 bg-white">
            <div className="max-w-4xl mx-auto px-6">
              <p className="text-sm font-semibold text-black/50 uppercase tracking-wider mb-4">Featured guide</p>
              <Link
                href={`/blog/${featuredRx.slug}`}
                className="group block rounded-2xl overflow-hidden border border-black/10 hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-r from-black to-[#1a0a14] p-8 md:p-12">
                  <span className="text-xs text-[#E91E8C] font-bold uppercase tracking-wider">
                    {BLOG_CATEGORY_HELLO_GORGEOUS_RX}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-bold text-white mt-3 mb-4 font-serif group-hover:text-[#E91E8C] transition-colors">
                    {featuredRx.title}
                  </h2>
                  <p className="text-white/60 text-lg mb-4 max-w-2xl">{featuredRx.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-white/40">
                    <span>{featuredRx.readTime} read</span>
                    <span>·</span>
                    <span>
                      {new Date(featuredRx.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        ) : null}

        <section className="py-12 md:py-16 bg-white border-t border-black/5">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-black mb-2 font-serif">All Hello Gorgeous RX™ articles</h2>
            <p className="text-black/55 text-sm mb-8">
              {rxSorted.length} guides · paired with our{" "}
              <Link href="/products-we-offer" className="text-[#E91E8C] font-semibold hover:underline">
                products we offer
              </Link>{" "}
              page
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {restRx.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-black/10 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="bg-black p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-[#E91E8C] font-bold uppercase tracking-wider">{post.category}</span>
                      <span className="text-white/30 text-xs">{post.readTime}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg group-hover:text-[#E91E8C] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                  <div className="p-5">
                    <p className="text-black/60 text-sm line-clamp-3 mb-3">{post.excerpt}</p>
                    <span className="text-[#E91E8C] text-sm font-semibold">Read article →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-black text-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold mb-4 font-serif">Have Questions?</h2>
            <p className="text-white/60 mb-8">
              Our NP is on site 7 days a week for consultations. We&apos;d love to help you find the right treatment.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#E91E8C] hover:bg-[#c90a68] text-white font-bold rounded-full text-lg transition-all hover:scale-105"
            >
              Book Free Consultation
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <section className="bg-black text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#E91E8C] text-sm font-semibold uppercase tracking-widest mb-4">Expert Resources</p>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Hello Gorgeous Blog</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Evidence-based articles on aesthetic treatments, medical weight loss, hormone therapy, and advanced
            technology — written by our clinical team.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-white border-b border-black/5">
        <div className="max-w-4xl mx-auto px-6">{filterTabs}</div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href={`/blog/${featured.slug}`}
            className="group block rounded-2xl overflow-hidden border border-black/10 hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-r from-black to-[#1a0a14] p-8 md:p-12">
              <span className="text-xs text-[#E91E8C] font-bold uppercase tracking-wider">{featured.category}</span>
              <h2 className="text-2xl md:text-4xl font-bold text-white mt-3 mb-4 font-serif group-hover:text-[#E91E8C] transition-colors">
                {featured.title}
              </h2>
              <p className="text-white/60 text-lg mb-4 max-w-2xl">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-white/40">
                <span>{featured.readTime} read</span>
                <span>·</span>
                <span>
                  {new Date(featured.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-t border-black/5">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-black mb-8 font-serif">All Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {restAll.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-black/10 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-black p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-[#E91E8C] font-bold uppercase tracking-wider">{post.category}</span>
                    <span className="text-white/30 text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg group-hover:text-[#E91E8C] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-black/60 text-sm line-clamp-3 mb-3">{post.excerpt}</p>
                  <span className="text-[#E91E8C] text-sm font-semibold">Read article →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4 font-serif">Have Questions?</h2>
          <p className="text-white/60 mb-8">
            Our NP is on site 7 days a week for consultations. We&apos;d love to help you find the right treatment.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#E91E8C] hover:bg-[#c90a68] text-white font-bold rounded-full text-lg transition-all hover:scale-105"
          >
            Book Free Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
