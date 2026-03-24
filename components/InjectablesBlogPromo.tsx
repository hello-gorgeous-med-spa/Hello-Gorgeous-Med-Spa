"use client";

import Link from "next/link";

/** Promo section linking to Botox/Dysport/Jeuveau and injectables blog articles. */
export function InjectablesBlogPromo({
  title = "Learn More About Botox, Dysport & Jeuveau",
  subtitle = "We offer all three. Read our FAQ to compare and decide which is right for you. Hello Gorgeous in Oswego.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const articles = [
    {
      slug: "botox-vs-dysport-vs-jeuveau-faq-oswego",
      title: "Botox vs Dysport vs Jeuveau",
      excerpt: "Which one is right for you? Compare onset, longevity & cost",
      icon: "💉",
    },
    {
      slug: "should-i-start-medical-weight-loss-morpheus8-body",
      title: "Medical Weight Loss + Morpheus8 Body",
      excerpt: "One team for weight loss and skin tightening",
      icon: "🎯",
    },
    {
      slug: "vip-model-program-complete-guide",
      title: "VIP Model Program",
      excerpt: "Up to 50% off Morpheus8, Solaria & Trifecta",
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
        <div className="grid md:grid-cols-3 gap-6">
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
