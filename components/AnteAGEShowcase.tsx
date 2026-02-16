"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FadeUp } from "./Section";
import { BOOKING_URL } from "@/lib/flows";

// Add more AnteAGE images here as you get them
const anteageImages = [
  {
    src: "/images/anteage/brightening-exosomes.png",
    title: "Brightening Exosomes",
    description: "Improves unwanted pigmentation, safe for all Fitzpatrick types",
  },
  // Placeholder slides - replace with real images when available
  {
    src: "/images/anteage/brightening-exosomes.png",
    title: "Before & After Results",
    description: "Real patient transformations with AnteAGE MD treatments",
  },
  {
    src: "/images/anteage/brightening-exosomes.png",
    title: "Regenerative Science",
    description: "Stem cell technology for natural skin rejuvenation",
  },
];

const benefits = [
  "Safe for ALL skin types",
  "Promotes healthy glow",
  "Reduces pigmentation",
  "Regenerative science",
  "Versatile for any treatment",
  "Clinically proven results",
];

export function AnteAGEShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % anteageImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % anteageImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + anteageImages.length) % anteageImages.length);
  };

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-[#FFFFFF]">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-10">
            <p className="text-[#FF2D8E] text-lg font-medium tracking-wide">FEATURED TREATMENT</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">
              AnteAGE MD®{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                Brightening Exosomes
              </span>
            </h2>
            <p className="mt-4 text-black max-w-2xl mx-auto">
              Revolutionary regenerative science for radiant, even-toned skin.
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Slideshow */}
          <FadeUp delayMs={60}>
            <div className="relative">
              {/* Main Image */}
              <div
                className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-[#FF2D8E]/30 cursor-pointer group"
                onClick={() => setIsModalOpen(true)}
              >
                <Image
                  src={anteageImages[currentSlide].src}
                  alt={anteageImages[currentSlide].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">{anteageImages[currentSlide].title}</h3>
                  <p className="text-black text-sm mt-1">{anteageImages[currentSlide].description}</p>
                </div>

                {/* Click to expand hint */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition">
                  Click to expand
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-white flex items-center justify-center hover:bg-[#FF2D8E] transition"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-white flex items-center justify-center hover:bg-[#FF2D8E] transition"
              >
                →
              </button>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {anteageImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      idx === currentSlide ? "bg-[#FF2D8E] w-8" : "bg-white hover:bg-white0"
                    }`}
                  />
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Info Panel */}
          <FadeUp delayMs={120}>
            <div className="space-y-6">
              <div>
                <p className="text-[#FF2D8E] font-semibold text-sm tracking-wide mb-2">WHAT IS IT?</p>
                <p className="text-black leading-relaxed">
                  AnteAGE MD® Brightening Exosomes use cutting-edge stem cell technology to target 
                  unwanted pigmentation and promote a healthy, radiant glow. This regenerative treatment 
                  is safe for all Fitzpatrick skin types and delivers visible results.
                </p>
              </div>

              <div>
                <p className="text-[#FF2D8E] font-semibold text-sm tracking-wide mb-3">KEY BENEFITS</p>
                <div className="grid grid-cols-2 gap-2">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <span className="text-[#FF2D8E]">✓</span>
                      <span className="text-black text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[#FF2D8E] font-semibold text-sm tracking-wide mb-2">IDEAL FOR</p>
                <p className="text-black">
                  Hyperpigmentation, sun damage, melasma, uneven skin tone, dull complexion, 
                  and anyone seeking a brighter, more youthful appearance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 px-6 bg-[#FF2D8E] text-white font-bold text-center rounded-full hover:bg-black transition shadow-lg shadow-[#FF2D8E]/25"
                >
                  Book AnteAGE Treatment
                </a>
                <a
                  href="tel:630-636-6193"
                  className="py-4 px-6 border border-black text-white font-semibold text-center rounded-full hover:bg-white transition"
                >
                  📞 Ask Questions
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white text-white text-2xl flex items-center justify-center hover:bg-white/20 transition"
          >
            ✕
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-white text-xl flex items-center justify-center hover:bg-[#FF2D8E] transition"
          >
            ←
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={anteageImages[currentSlide].src}
              alt={anteageImages[currentSlide].title}
              width={1200}
              height={1500}
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent rounded-b-xl">
              <h3 className="text-2xl font-bold text-white">{anteageImages[currentSlide].title}</h3>
              <p className="text-black mt-1">{anteageImages[currentSlide].description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-white text-xl flex items-center justify-center hover:bg-[#FF2D8E] transition"
          >
            →
          </button>

          {/* Dots in modal */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {anteageImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                className={`w-3 h-3 rounded-full transition ${
                  idx === currentSlide ? "bg-[#FF2D8E]" : "bg-white/30 hover:bg-white0"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
