"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FadeUp } from "./Section";
import { BOOKING_URL } from "@/lib/flows";

type SlideCategory = "peptides" | "weightloss" | "vitamins";

interface Slide {
  id: string;
  category: SlideCategory;
  name: string;
  tagline: string;
  benefits: string[];
  icon: string;
  gradient: string;
  serviceLink: string;
  /** Optional image path – when set, replaces icon in the yellow/gradient box */
  image?: string;
}

const slides: Slide[] = [
  // GLP-1 Weight Loss
  {
    id: "semaglutide",
    category: "weightloss",
    name: "Semaglutide",
    tagline: "The #1 prescribed GLP-1 for weight loss",
    benefits: ["Reduces appetite naturally", "Avg 15-20% body weight loss", "Weekly injection", "FDA-approved molecule"],
    icon: "⚖️",
    gradient: "from-pink-600 to-rose-500",
    serviceLink: "/services/weight-loss-therapy",
  },
  {
    id: "tirzepatide",
    category: "weightloss",
    name: "Tirzepatide",
    tagline: "Dual-action GLP-1/GIP for maximum results",
    benefits: ["Up to 25% weight loss", "Blood sugar control", "Weekly injection", "Newest generation"],
    icon: "🎯",
    gradient: "from-purple-600 to-pink-500",
    serviceLink: "/services/weight-loss-therapy",
  },
  // Peptides
  {
    id: "bpc157",
    category: "peptides",
    name: "BPC-157",
    serviceLink: "/services/sermorelin-growth-peptide",
    tagline: "Body Protection Compound for healing",
    benefits: ["Accelerates tissue repair", "Gut healing support", "Joint & tendon recovery", "Anti-inflammatory"],
    icon: "🔬",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    id: "pt141",
    serviceLink: "/services/sermorelin-growth-peptide",
    category: "peptides",
    name: "PT-141 (Bremelanotide)",
    tagline: "Sexual wellness peptide",
    benefits: ["Increases libido", "Works for men & women", "On-demand dosing", "Non-hormonal"],
    icon: "💫",
    gradient: "from-pink-500 to-red-500",
  },
  {
    id: "sermorelin",
    serviceLink: "/services/sermorelin-growth-peptide",
    category: "peptides",
    name: "Sermorelin",
    tagline: "Growth hormone releasing peptide",
    benefits: ["Better sleep quality", "Increased energy", "Muscle recovery", "Anti-aging benefits"],
    icon: "⚡",
    gradient: "from-indigo-600 to-purple-500",
    image: "/images/olympia-sermorelin.png",
  },
  {
    id: "ipamorelin",
    serviceLink: "/services/sermorelin-growth-peptide",
    category: "peptides",
    name: "Ipamorelin + CJC-1295",
    tagline: "The gold standard for GH optimization",
    benefits: ["Fat loss support", "Lean muscle gains", "Improved recovery", "Better body composition"],
    icon: "💪",
    gradient: "from-fuchsia-600 to-pink-500",
  },
  {
    id: "aod9604",
    serviceLink: "/services/sermorelin-growth-peptide",
    category: "peptides",
    name: "AOD-9604",
    tagline: "Fat-burning peptide fragment",
    benefits: ["Targets stubborn fat", "No effect on blood sugar", "Safe for long-term use", "Mimics natural fat loss"],
    icon: "🔥",
    gradient: "from-orange-500 to-red-500",
  },
  // Vitamin Injections
  {
    id: "b12",
    serviceLink: "/services/vitamin-injections",
    category: "vitamins",
    name: "Vitamin B12",
    tagline: "Energy & metabolism booster",
    benefits: ["Instant energy boost", "Supports metabolism", "Improves mood", "Better focus"],
    icon: "⚡",
    gradient: "from-yellow-500 to-orange-500",
    image: "/images/olympia-b12-methyl.png",
  },
  {
    id: "biotin",
    serviceLink: "/services/vitamin-injections",
    category: "vitamins",
    name: "Biotin (B7)",
    tagline: "Hair, skin & nail support",
    benefits: ["Stronger hair growth", "Healthier nails", "Glowing skin", "Metabolism support"],
    icon: "✨",
    gradient: "from-pink-400 to-rose-400",
    image: "/images/olympia-biotin.png",
  },
  {
    id: "glutathione",
    serviceLink: "/services/vitamin-injections",
    category: "vitamins",
    name: "Glutathione",
    tagline: "Master antioxidant for detox & glow",
    benefits: ["Skin brightening", "Powerful detox", "Immune support", "Anti-aging"],
    icon: "🌟",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "mic",
    serviceLink: "/services/vitamin-injections",
    category: "vitamins",
    name: "MIC + B12 (Lipo Shot)",
    tagline: "Fat-burning vitamin cocktail",
    benefits: ["Boosts fat metabolism", "Liver support", "Energy increase", "Weight loss aid"],
    icon: "💉",
    gradient: "from-fuchsia-500 to-pink-500",
  },
  {
    id: "vitaminD",
    serviceLink: "/services/vitamin-injections",
    category: "vitamins",
    name: "Vitamin D3",
    tagline: "The sunshine vitamin",
    benefits: ["Immune system boost", "Bone health", "Mood improvement", "Energy support"],
    icon: "☀️",
    gradient: "from-amber-400 to-yellow-500",
    image: "/images/olympia-vitamin-d3.png",
  },
];

const categories = [
  { id: "all" as const, label: "All", icon: "🏥" },
  { id: "weightloss" as const, label: "Weight Loss", icon: "⚖️" },
  { id: "peptides" as const, label: "Peptides", icon: "🔬" },
  { id: "vitamins" as const, label: "Vitamins", icon: "💉" },
];

export function PharmacyShowcase() {
  const [activeCategory, setActiveCategory] = useState<"all" | SlideCategory>("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const filteredSlides = activeCategory === "all" 
    ? slides 
    : slides.filter(s => s.category === activeCategory);

  // Reset slide when category changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeCategory]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [filteredSlides.length, isPaused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % filteredSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + filteredSlides.length) % filteredSlides.length);

  const currentItem = filteredSlides[currentSlide];

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-10">
            <p className="text-[#E6007E] text-sm font-medium tracking-wide">COMPOUNDED PHARMACY</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold text-[#E6007E]">
              Peptides, GLP-1 &{" "}
              <span className="text-[#E6007E]">
                Vitamin Injections
              </span>
            </h2>
            <p className="mt-4 text-[#E6007E] max-w-2xl mx-auto">
              Premium compounded medications for weight loss, wellness, and optimization.
              All prescribed by our medical team after consultation.
            </p>
          </div>
        </FadeUp>

        {/* Category Tabs */}
        <FadeUp delayMs={60}>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#E6007E] text-white shadow-md"
                    : "bg-[#111111]/5 text-[#E6007E] hover:bg-[#111111]/10 hover:text-[#E6007E] border border-black"
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* Main Slideshow */}
        <FadeUp delayMs={120}>
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Slide Card */}
            <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${currentItem.gradient} p-1`}>
              <div className="bg-white rounded-[22px] p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left - Visual */}
                  <div className="relative">
                    <div className={`aspect-square rounded-2xl bg-gradient-to-br ${currentItem.gradient} p-6 flex items-center justify-center overflow-hidden`}>
                      <div className="text-center w-full h-full flex flex-col items-center justify-center">
                        {currentItem.image ? (
                          <img
                            src={currentItem.image}
                            alt={`${currentItem.name} – Olympia Pharmaceuticals`}
                            className="max-h-[70%] max-w-full object-contain mb-3"
                          />
                        ) : (
                          <span className="text-8xl md:text-9xl block mb-4">{currentItem.icon}</span>
                        )}
                        <span className="text-white/90 text-sm font-medium uppercase tracking-wider">
                          {currentItem.category === "weightloss" ? "GLP-1 Weight Loss" : 
                           currentItem.category === "peptides" ? "Peptide Therapy" : 
                           "Vitamin Injection"}
                        </span>
                      </div>
                    </div>
                    {/* Slide counter */}
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-[#E6007E] text-white text-xs font-medium">
                      {currentSlide + 1} / {filteredSlides.length}
                    </div>
                  </div>

                  {/* Right - Info */}
                  <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-[#E6007E]/10 text-[#E6007E] text-xs font-medium mb-4">
                      {currentItem.category === "weightloss" ? "GLP-1 WEIGHT LOSS" : 
                       currentItem.category === "peptides" ? "PEPTIDE THERAPY" : 
                       "VITAMIN INJECTION"}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#E6007E] mb-2">
                      {currentItem.name}
                    </h3>
                    <p className="text-xl text-[#E6007E] mb-6">
                      {currentItem.tagline}
                    </p>

                    <div className="space-y-3 mb-8">
                      {currentItem.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#E6007E] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <span className="text-[#E6007E]">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-6 bg-[#E6007E] text-white font-bold text-center rounded-full hover:bg-[#B0005F] transition shadow-lg"
                      >
                        Book Consultation
                      </a>
                      <Link
                        href={currentItem.serviceLink}
                        className="py-3 px-6 border-2 border-[#E6007E] text-[#E6007E] font-semibold text-center rounded-full hover:bg-[#E6007E]/5 transition block"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-2 border-[#E6007E] text-[#E6007E] flex items-center justify-center hover:bg-[#E6007E] hover:text-white transition z-10 shadow-md"
            >
              ←
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-2 border-[#E6007E] text-[#E6007E] flex items-center justify-center hover:bg-[#E6007E] hover:text-white transition z-10 shadow-md"
            >
              →
            </button>
          </div>
        </FadeUp>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {filteredSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? "bg-[#E6007E] w-8" : "bg-gray-300 w-2 hover:bg-[#E6007E]/50"
              }`}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <FadeUp delayMs={180}>
          <p className="mt-8 text-center text-xs text-gray-500 max-w-2xl mx-auto">
            All medications require a consultation and prescription from our medical provider. 
            Results vary by individual. These statements have not been evaluated by the FDA.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
