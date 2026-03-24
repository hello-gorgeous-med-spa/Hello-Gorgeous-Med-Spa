"use client";

import Link from "next/link";

/** Promo section linking to Morpheus8 Burst, Quantum RF, and Solaria CO2 blog articles. Blast across Oswego and surrounding areas. */
export function TechBlogPromo({
  title = "Learn More About Our Advanced Technology",
  subtitle = "Expert guides on Morpheus8 Burst, Quantum RF, and Solaria CO₂ — only at Hello Gorgeous in Oswego.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const articles = [
    {
      slug: "the-story-behind-hello-gorgeous-oswego-il",
      title: "The Story Behind Hello Gorgeous",
      excerpt: "From acne at 12 to med spa owner — Danielle's journey",
      icon: "💗",
    },
    {
      slug: "morpheus8-burst-vs-regular-oswego",
      title: "Morpheus8 Burst vs Regular",
      excerpt: "8mm vs 4mm — why depth matters",
      icon: "⚡",
    },
    {
      slug: "quantum-rf-what-it-is-how-we-help",
      title: "Quantum RF Guide",
      excerpt: "Non-surgical skin tightening",
      icon: "🎯",
    },
    {
      slug: "inmode-solaria-co2-laser-complete-guide",
      title: "Solaria CO₂ Laser",
      excerpt: "Gold standard resurfacing",
      icon: "✨",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-2">
          {title}
        </h2>
        <p className="text-black/70 text-center mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block rounded-xl border-2 border-black/10 bg-white p-6 hover:border-[#E6007E]/50 hover:shadow-lg transition-all"
            >
              <span className="text-3xl mb-3 block">{article.icon}</span>
              <h3 className="font-bold text-lg text-black group-hover:text-[#E6007E] transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-black/60 mt-1">{article.excerpt}</p>
              <span className="inline-block mt-3 text-[#E6007E] font-semibold text-sm group-hover:underline">
                Read article →
              </span>
            </Link>
          ))}
        </div>
        <p className="text-center mt-6 text-sm text-black/50">
          Serving Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery & the Fox Valley
        </p>
      </div>
    </section>
  );
}
