"use client";

import { useState } from "react";
import { REVIEWS_URL } from "@/lib/flows";
import { HOME_TESTIMONIALS, SITE } from "@/lib/seo";

const testimonials = HOME_TESTIMONIALS;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-lg">
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
    <section className="section-white section-padding">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-[#FF2D8E] text-sm font-bold tracking-wider uppercase">Real Results</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold">
            What Our Clients <span className="text-[#FF2D8E]">Say</span>
          </h2>
          <a
            href={SITE.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-3 hover:text-[#FF2D8E] transition"
          >
            <span className="text-[#FF2D8E] text-xl">★★★★★</span>
            <span className="font-bold">{SITE.reviewRating}</span>
            <span>on Google · Leave a review</span>
          </a>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.name}
              className="hg-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-lg">{testimonial.name}</p>
                  <p className="text-sm">{testimonial.location}</p>
                </div>
                <span className="px-4 py-1 rounded-full border-2 border-[#FF2D8E] text-[#FF2D8E] text-xs font-bold">
                  {testimonial.service}
                </span>
              </div>
              <StarRating rating={testimonial.rating} />
              <p className="mt-4 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <div className="hg-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-lg">{testimonials[activeIndex].name}</p>
                <p className="text-sm">{testimonials[activeIndex].location}</p>
              </div>
              <span className="px-4 py-1 rounded-full border-2 border-[#FF2D8E] text-[#FF2D8E] text-xs font-bold">
                {testimonials[activeIndex].service}
              </span>
            </div>
            <StarRating rating={testimonials[activeIndex].rating} />
            <p className="mt-4 leading-relaxed">&ldquo;{testimonials[activeIndex].text}&rdquo;</p>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View testimonial ${idx + 1}`}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  idx === activeIndex 
                    ? "bg-[#FF2D8E] scale-110" 
                    : "bg-black/10 hover:bg-black/20"
                }`}
              >
                <span className="sr-only">Testimonial {idx + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={SITE.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <span className="mr-2">⭐</span> Leave a Google Review
          </a>
          <a
            href={REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <span className="mr-2">📝</span> See all reviews
          </a>
        </div>
      </div>
    </section>
  );
}
