"use client";

import { useState } from "react";
import { REVIEWS_URL } from "@/lib/flows";
import { HOME_TESTIMONIALS, SITE } from "@/lib/seo";
import { FadeUp } from "./Section";

const testimonials = HOME_TESTIMONIALS;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? "text-[#FF2D8E]" : "text-black/20"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-5xl mx-auto min-w-0">
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-[#FF2D8E] text-sm font-bold tracking-wide uppercase">Real Results</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-black">
              What Our Clients <span className="text-[#FF2D8E]">Say</span>
            </h2>
            <a
              href={SITE.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 text-black hover:text-[#FF2D8E] transition"
            >
              <span className="text-[#FF2D8E] text-xl">★★★★★</span>
              <span className="font-bold">{SITE.reviewRating}</span>
              <span>on Google · Leave a review</span>
            </a>
          </div>
        </FadeUp>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, idx) => (
            <FadeUp key={testimonial.name} delayMs={60 * idx}>
              <div className="h-full rounded-2xl border-2 border-black bg-white p-6 hover:border-[#FF2D8E] hover:shadow-xl hover:-translate-y-1 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-black font-bold">{testimonial.name}</p>
                    <p className="text-black text-sm">{testimonial.location}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FF2D8E]/10 text-[#FF2D8E] text-xs font-bold">
                    {testimonial.service}
                  </span>
                </div>
                <StarRating rating={testimonial.rating} />
                <p className="mt-4 text-black leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <FadeUp>
            <div className="rounded-2xl border-2 border-black bg-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-black font-bold">{testimonials[activeIndex].name}</p>
                  <p className="text-black text-sm">{testimonials[activeIndex].location}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FF2D8E]/10 text-[#FF2D8E] text-xs font-bold">
                  {testimonials[activeIndex].service}
                </span>
              </div>
              <StarRating rating={testimonials[activeIndex].rating} />
              <p className="mt-4 text-black leading-relaxed">&ldquo;{testimonials[activeIndex].text}&rdquo;</p>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`View testimonial ${idx + 1}`}
                  className={`min-w-[44px] min-h-[44px] p-2 rounded-full flex items-center justify-center transition ${
                    idx === activeIndex ? "bg-[#FF2D8E]" : "bg-black/20"
                  }`}
                >
                  <span className="sr-only">Testimonial {idx + 1}</span>
                </button>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* CTA */}
        <FadeUp delayMs={300}>
          <div className="mt-10 text-center flex flex-wrap justify-center gap-6">
            <a
              href={SITE.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FF2D8E] text-white font-bold hover:bg-black transition"
            >
              <span>⭐</span> Leave a Google Review
            </a>
            <a
              href={REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-black text-black font-bold hover:bg-black hover:text-white transition"
            >
              <span>📝</span> See all reviews
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
