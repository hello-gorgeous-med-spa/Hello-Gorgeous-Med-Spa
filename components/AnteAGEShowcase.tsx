"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FadeUp } from "./Section";
import { BOOKING_URL } from "@/lib/flows";

const anteageImages = [
  {
    src: "/images/anteage/hair/mdx-biosome-hair-solution-ba.png",
    title: "AnteAGE MDX® Biosome Hair Solution",
    description: "Scalp biosomes + before/after density — professional hair restoration",
  },
  {
    src: "/images/anteage/mdx-brightening-exosome-vials.png",
    title: "AnteAGE MDX® Brightening Exosomes",
    description: "10 billion exosomes + HA/TXA diluent — professional brightening protocol",
  },
  {
    src: "/images/anteage/mdx-brightening-before-after-spots.png",
    title: "Brightening results — 1 treatment",
    description: "Sun spots & texture improvement in about one month",
  },
  {
    src: "/images/anteage/mdx-brightening-before-after-eyes.png",
    title: "Smoother, brighter skin",
    description: "Crow’s feet and cheek tone after AnteAGE MDX brightening",
  },
  {
    src: "/images/anteage/growth-factor-before-after.png",
    title: "Growth Factor + microneedling",
    description: "Scar texture and tone with AnteAGE MD Growth Factor Solution",
  },
  {
    src: "/images/anteage/people-growth-factor-feature.png",
    title: "As featured in People en Español",
    description: "Stem cell microneedling for luminous, even skin",
  },
  {
    src: "/images/anteage/md-microneedling-kit.png",
    title: "AnteAGE MD® professional kit",
    description: "Growth factor microneedling for face & hair — clinical grade",
  },
];

const benefits = [
  "Safe for ALL skin types",
  "Promotes healthy glow",
  "Reduces pigmentation",
  "Regenerative science",
  "Pairs with microneedling",
  "Clinically proven results",
];

export function AnteAGEShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-black">
              AnteAGE MD®{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-[#E6007E]">
                Regenerative Skin
              </span>
            </h2>
            <p className="mt-4 text-black/70 max-w-2xl mx-auto">
              Growth factors, exosomes, and brightening protocols — booked under AnteAGE Skin Regeneration
              at Hello Gorgeous Med Spa in Oswego.
            </p>
          </div>
        </FadeUp>

        {/* Vertical treatment reel */}
        <FadeUp delayMs={40}>
          <div className="mx-auto mb-12 grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <video
                className="aspect-[9/16] w-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster="/images/anteage/video-poster-reel.jpg"
                aria-label="AnteAGE treatment reel"
              >
                <source src="/videos/anteage/anteage-treatment-reel.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="overflow-hidden rounded-3xl border-4 border-black bg-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
              <video
                className="aspect-[9/16] w-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster="/images/anteage/video-poster-hero.jpg"
                aria-label="AnteAGE treatment video"
              >
                <source src="/videos/anteage/anteage-treatment-hero.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <FadeUp delayMs={60}>
            <div className="relative">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">{anteageImages[currentSlide].title}</h3>
                  <p className="text-white/80 text-sm mt-1">{anteageImages[currentSlide].description}</p>
                </div>
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white text-black text-xs font-medium opacity-0 group-hover:opacity-100 transition">
                  Click to expand
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#FF2D8E] hover:text-white transition border-2 border-black"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#FF2D8E] hover:text-white transition border-2 border-black"
              >
                →
              </button>

              <div className="flex justify-center gap-2 mt-4">
                {anteageImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition ${
                      idx === currentSlide ? "bg-[#FF2D8E] w-8" : "bg-black/20 w-2.5 hover:bg-black/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delayMs={120}>
            <div className="space-y-6">
              <div>
                <p className="text-[#FF2D8E] font-semibold text-sm tracking-wide mb-2">WHAT IS IT?</p>
                <p className="text-black leading-relaxed">
                  AnteAGE MD® and MDX® use bone-marrow stem cell growth factors and exosomes to support
                  brighter tone, smoother texture, and healthier recovery after microneedling — safe for
                  all Fitzpatrick skin types when used by our NP-led team.
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
                  Hyperpigmentation, sun damage, melasma, uneven tone, dull complexion, acne texture, and
                  anyone wanting regenerative brightening with microneedling.
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
                  className="py-4 px-6 border-2 border-black text-black font-semibold text-center rounded-full hover:bg-[#FFF0F7] transition"
                >
                  Call (630) 636-6193
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 text-white text-2xl flex items-center justify-center hover:bg-white/20 transition"
          >
            ✕
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white text-xl flex items-center justify-center hover:bg-[#FF2D8E] transition"
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
              <p className="text-white/80 mt-1">{anteageImages[currentSlide].description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white text-xl flex items-center justify-center hover:bg-[#FF2D8E] transition"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
