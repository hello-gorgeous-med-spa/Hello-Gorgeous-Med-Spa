"use client";

import { useState } from "react";
import { FadeUp } from "./Section";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Naperville, IL",
    rating: 5,
    text: "Danielle is amazing! She took her time to explain everything and made me feel so comfortable for my first Botox experience. The results are so natural - I look refreshed, not frozen!",
    service: "Botox",
  },
  {
    name: "Jennifer K.",
    location: "Oswego, IL",
    rating: 5,
    text: "Best med spa experience I've ever had. The team really listens to what you want. My lip filler looks incredible and I've gotten so many compliments!",
    service: "Dermal Fillers",
  },
  {
    name: "Michelle R.",
    location: "Aurora, IL",
    rating: 5,
    text: "I hosted a Botox party with Hello Gorgeous and it was SO much fun! Great prices, professional service, and my friends are already asking when we're doing it again.",
    service: "Botox Party",
  },
  {
    name: "Amanda T.",
    location: "Plainfield, IL",
    rating: 5,
    text: "The weight loss program has been life-changing. Down 30 lbs and feeling better than I have in years. Ryan and Danielle genuinely care about your health journey.",
    service: "Weight Loss",
  },
];

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
    <section className="py-16 px-4 bg-gradient-to-b from-black via-pink-950/10 to-black">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-pink-400 text-lg font-medium tracking-wide">REAL RESULTS</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
              What Our Clients{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                Say
              </span>
            </h2>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-yellow-400 text-xl">★★★★★</span>
              <span className="text-white font-semibold">5.0</span>
              <span className="text-gray-400">on Google</span>
            </div>
          </div>
        </FadeUp>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, idx) => (
            <FadeUp key={testimonial.name} delayMs={60 * idx}>
              <div className="h-full rounded-2xl border border-pink-500/20 bg-black/50 p-6 hover:border-pink-500/40 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-medium">
                    {testimonial.service}
                  </span>
                </div>
                <StarRating rating={testimonial.rating} />
                <p className="mt-4 text-gray-300 leading-relaxed">"{testimonial.text}"</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <FadeUp>
            <div className="rounded-2xl border border-pink-500/20 bg-black/50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white font-semibold">{testimonials[activeIndex].name}</p>
                  <p className="text-gray-500 text-sm">{testimonials[activeIndex].location}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-medium">
                  {testimonials[activeIndex].service}
                </span>
              </div>
              <StarRating rating={testimonials[activeIndex].rating} />
              <p className="mt-4 text-gray-300 leading-relaxed">"{testimonials[activeIndex].text}"</p>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition ${
                    idx === activeIndex ? "bg-pink-500" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </FadeUp>
        </div>

        {/* CTA */}
        <FadeUp delayMs={300}>
          <div className="mt-10 text-center">
            <a
              href="https://g.page/r/hello-gorgeous-med-spa/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
            >
              <span>📝</span> Leave us a review on Google
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
