"use client";

import { useState, useEffect } from "react";
import { SITE } from "@/lib/seo";

const testimonials = [
  { 
    name: "Sarah M.", 
    location: "Naperville, IL", 
    rating: 5, 
    text: "Danielle is amazing! She took her time to explain everything and made me feel so comfortable for my first Botox experience. The results are so natural - I look refreshed, not frozen!", 
    service: "Botox" 
  },
  { 
    name: "Jennifer K.", 
    location: "Oswego, IL", 
    rating: 5, 
    text: "Best med spa experience I've ever had. The team really listens to what you want. My lip filler looks incredible and I've gotten so many compliments!", 
    service: "Dermal Fillers" 
  },
  { 
    name: "Michelle R.", 
    location: "Aurora, IL", 
    rating: 5, 
    text: "I hosted a Botox party with Hello Gorgeous and it was SO much fun! Great prices, professional service, and my friends are already asking when we're doing it again.", 
    service: "Botox Party" 
  },
  { 
    name: "Amanda T.", 
    location: "Plainfield, IL", 
    rating: 5, 
    text: "The weight loss program has been life-changing. Down 30 lbs and feeling better than I have in years. Ryan and Danielle genuinely care about your health journey.", 
    service: "Weight Loss" 
  },
  {
    name: "Lisa D.",
    location: "Yorkville, IL",
    rating: 5,
    text: "Finally found a med spa I trust! The attention to detail and genuine care is unmatched. I've referred all my friends and they love it too!",
    service: "Microneedling"
  },
  {
    name: "Rachel P.",
    location: "Montgomery, IL",
    rating: 5,
    text: "Ryan is incredibly knowledgeable about hormone therapy. After just a few weeks I felt like myself again. Life changing!",
    service: "Hormone Therapy"
  },
];

export function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-16 md:py-24 bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Real People. <span className="text-[#FF2D8E]">Real Reviews.</span>
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-[#FF2D8E] text-xl">★★★★★</span>
            <span className="text-white font-bold">{SITE.reviewRating}</span>
            <span className="text-white/70">on Google</span>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Cards */}
          <div className="flex gap-6 transition-transform duration-500 ease-out"
               style={{ transform: `translateX(-${activeIndex * (100 / 3)}%)` }}>
            {[...testimonials, ...testimonials].map((testimonial, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full md:w-[calc(33.333%-16px)] bg-white rounded-2xl p-6 shadow-xl"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#FF2D8E] text-lg">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-800 leading-relaxed mb-6 line-clamp-4">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-black">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FF2D8E]/10 text-[#FF2D8E] text-xs font-bold">
                    {testimonial.service}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#FF2D8E] hover:bg-[#FF2D8E] hover:text-white transition hidden md:flex"
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#FF2D8E] hover:bg-[#FF2D8E] hover:text-white transition hidden md:flex"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === activeIndex 
                  ? "bg-[#FF2D8E] w-8" 
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href={SITE.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-full hover:bg-white hover:text-[#FF2D8E] transition"
          >
            ⭐ Leave Us a Review
          </a>
        </div>
      </div>
    </section>
  );
}
