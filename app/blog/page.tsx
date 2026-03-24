import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { blogPosts } from "@/data/blog-posts";

export const metadata: Metadata = pageMetadata({
  title: "Blog & Resources | Hello Gorgeous Med Spa",
  description:
    "Expert articles on Botox, fillers, weight loss, hormone therapy, peptides, Morpheus8 Burst, Solaria CO₂, QuantumRF, men's health, and Hello Gorgeous RX™ compounded prescription guides (Oswego, IL).",
  path: "/blog",
});

export default function BlogPage() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#E91E8C] text-sm font-semibold uppercase tracking-widest mb-4">
            Expert Resources
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            Hello Gorgeous Blog
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Evidence-based articles on aesthetic treatments, medical weight loss, hormone therapy,
            and advanced technology — written by our clinical team.
          </p>
        </div>
      </section>

      {/* Featured Article */}
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
                <span>{new Date(featured.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-12 md:py-16 bg-white border-t border-black/5">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-black mb-8 font-serif">All Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {rest.map((post) => (
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

      {/* CTA */}
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
