"use client";

import Link from "next/link";

/** Promo section linking to Morpheus8 Burst, Quantum RF, and Solaria CO2 blog articles. */
export function TechBlogPromo({
  title = "Learn More About Our Advanced Technology",
  subtitle = "Expert guides on Morpheus8 Burst, Quantum RF, and Solaria CO₂ — only at Hello Gorgeous in Oswego.",
  /** `secondary` = smaller type, less visual weight (e.g. after a landing-page close). */
  variant = "default",
}: {
  title?: string;
  subtitle?: string;
  variant?: "default" | "secondary";
}) {
  const isSecondary = variant === "secondary";
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
    <section
      className={
        isSecondary
          ? "border-t-2 border-black/10 bg-white py-8 md:py-10"
          : "py-12 md:py-16 bg-gray-50 border-t border-gray-100"
      }
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {isSecondary ? (
          <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-black/50 mb-1">
            Further reading
          </p>
        ) : null}
        <h2
          className={
            isSecondary
              ? "text-lg md:text-xl font-bold text-black text-center mb-1"
              : "text-2xl md:text-3xl font-bold text-black text-center mb-2"
          }
        >
          {title}
        </h2>
        <p
          className={
            isSecondary
              ? "text-black/55 text-center mb-5 max-w-2xl mx-auto text-sm"
              : "text-black/70 text-center mb-8 max-w-2xl mx-auto"
          }
        >
          {subtitle}
        </p>
        <div
          className={
            isSecondary
              ? "grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
              : "grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          }
        >
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className={
                isSecondary
                  ? "group block rounded-lg border border-black/15 bg-white p-4 hover:border-black/30 transition-all"
                  : "group block rounded-xl border-2 border-black/10 bg-white p-6 hover:border-[#E6007E]/50 hover:shadow-lg transition-all"
              }
            >
              <span className={isSecondary ? "text-2xl mb-2 block" : "text-3xl mb-3 block"}>
                {article.icon}
              </span>
              <h3
                className={
                  isSecondary
                    ? "font-semibold text-sm text-black group-hover:text-[#E6007E] transition-colors"
                    : "font-bold text-lg text-black group-hover:text-[#E6007E] transition-colors"
                }
              >
                {article.title}
              </h3>
              <p className={isSecondary ? "text-xs text-black/50 mt-0.5" : "text-sm text-black/60 mt-1"}>
                {article.excerpt}
              </p>
              <span
                className={
                  isSecondary
                    ? "inline-block mt-2 text-[#E6007E] font-medium text-xs"
                    : "inline-block mt-3 text-[#E6007E] font-semibold text-sm group-hover:underline"
                }
              >
                {isSecondary ? "Read →" : "Read article →"}
              </span>
            </Link>
          ))}
        </div>
        <p
          className={
            isSecondary
              ? "text-center mt-4 text-xs text-black/40"
              : "text-center mt-6 text-sm text-black/50"
          }
        >
          Serving Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery & the Fox Valley
        </p>
      </div>
    </section>
  );
}
