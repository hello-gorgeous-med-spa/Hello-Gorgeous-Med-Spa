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
        <span key={i} className={i < rating ? "text-pink-400" : "text-gray-600"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-[#FDF7FA]">
      <div className="max-w-5xl mx-auto min-w-0">
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-[#E6007E] text-sm font-medium tracking-wide">REAL RESULTS</p>
            <h2 className="mt-4 text-2xl md:text-4xl font-serif font-bold text-[#111111]">
              What Our Clients{" "}
              <span className="text-[#E6007E]">
                Say
              </span>
            </h2>
            <a
              href={SITE.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 text-[#5E5E66] hover:text-[#111111] transition"
            >
              <span className="text-yellow-400 text-xl">★★★★★</span>
              <span className="text-[#111111] font-semibold">{SITE.reviewRating}</span>
              <span className="text-[#5E5E66]">on Google · Leave a review</span>
            </a>
          </div>
        </FadeUp>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, idx) => (
            <FadeUp key={testimonial.name} delayMs={60 * idx}>
              <div className="h-full rounded-xl border border-[#111111]/10 bg-white shadow-md p-6 hover:border-[#E6007E]/30 hover:shadow-xl hover:-translate-y-[2px] transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[#111111] font-semibold">{testimonial.name}</p>
                    <p className="text-[#5E5E66] text-sm">{testimonial.location}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E6007E]/10 text-[#E6007E] text-xs font-medium">
                    {testimonial.service}
                  </span>
                </div>
                <StarRating rating={testimonial.rating} />
                <p className="mt-4 text-[#5E5E66] leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <FadeUp>
            <div className="rounded-xl border border-[#111111]/10 bg-white shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[#111111] font-semibold">{testimonials[activeIndex].name}</p>
                  <p className="text-[#5E5E66] text-sm">{testimonials[activeIndex].location}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-medium">
                  {testimonials[activeIndex].service}
                </span>
              </div>
              <StarRating rating={testimonials[activeIndex].rating} />
                <p className="mt-4 text-[#5E5E66] leading-relaxed">&ldquo;{testimonials[activeIndex].text}&rdquo;</p>
            </div>

            {/* Dots - 44px tap targets for thumb-friendly taps */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`View testimonial ${idx + 1}`}
                  className={`min-w-[44px] min-h-[44px] p-2 rounded-full flex items-center justify-center transition ${
                    idx === activeIndex ? "bg-[#E6007E]" : "bg-[#5E5E66]/30"
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
              className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition text-sm font-medium"
            >
              <span>⭐</span> Leave a Google Review
            </a>
            <a
              href={REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
            >
              <span>📝</span> See all reviews
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
