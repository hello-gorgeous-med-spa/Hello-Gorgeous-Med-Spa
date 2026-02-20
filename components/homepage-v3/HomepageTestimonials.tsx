"use client";

import { HOME_TESTIMONIALS } from "@/lib/seo";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[#E6007E]" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </span>
  );
}

export function HomepageTestimonials() {
  return (
    <section className="bg-black py-20 md:py-28" aria-labelledby="testimonials-heading">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          What Our Clients Are Saying
        </h2>
        <p className="text-white/80 text-center max-w-2xl mx-auto mb-14">
          Real results and real experiences from the Hello Gorgeous community.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {HOME_TESTIMONIALS.map((t) => (
            <div
              key={t.name + t.service}
              className="rounded-2xl border-2 border-white/10 bg-white/5 p-6 md:p-8 flex flex-col"
            >
              <StarRating rating={t.rating} />
              <blockquote className="mt-4 text-white text-lg leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <footer className="mt-6 pt-4 border-t border-white/10">
                <cite className="not-italic font-semibold text-white">{t.name}</cite>
                <span className="text-white/70 text-sm block mt-0.5">{t.location}</span>
                <span className="text-[#E6007E] text-sm font-medium">{t.service}</span>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
