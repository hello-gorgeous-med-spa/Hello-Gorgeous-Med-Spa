"use client";

import Image from "next/image";
import { useChatOpen } from "@/components/ChatOpenContext";
import { mascotImages } from "@/lib/media";
import { useState } from "react";

const PEPTIDE_CATEGORIES = [
  {
    name: "Healing & Recovery",
    peptides: ["BPC-157", "TB-500"],
    icon: "🩹",
    description: "Tissue repair, gut healing, injury recovery"
  },
  {
    name: "Growth & Anti-Aging",
    peptides: ["Sermorelin", "Ipamorelin", "CJC-1295", "Tesamorelin"],
    icon: "⚡",
    description: "Growth hormone optimization, muscle, recovery"
  },
  {
    name: "Weight & Metabolism",
    peptides: ["Semaglutide", "Tirzepatide", "AOD-9604", "MOTS-c"],
    icon: "🔥",
    description: "Fat loss, metabolic support, appetite control"
  },
  {
    name: "Immune & Longevity",
    peptides: ["Thymosin Alpha-1", "Epithalon", "BPC-157"],
    icon: "🛡️",
    description: "Immune modulation, cellular health, longevity"
  },
  {
    name: "Sexual Wellness",
    peptides: ["PT-141 (Bremelanotide)"],
    icon: "💫",
    description: "Libido support for men and women"
  },
];

const QUICK_QUESTIONS = [
  "What peptide is best for healing?",
  "How does BPC-157 work?",
  "Semaglutide vs Tirzepatide?",
  "What are growth hormone peptides?",
  "Are peptides safe?",
  "How are peptides administered?",
];

export function PeppiHeroSection() {
  const { openChat } = useChatOpen();
  const [imageError, setImageError] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleAskPeppi = (question?: string) => {
    openChat("peppi", question ? { topics: [question] } : undefined);
  };

  const peppiAvatar = imageError 
    ? "/images/characters/peppi.png"
    : (mascotImages.peppi?.portrait || "/images/characters/peppi.png");

  return (
    <div className="space-y-8">
      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[#FF2D8E] bg-gradient-to-br from-fuchsia-50 via-white to-purple-50 p-8 md:p-12 shadow-xl">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-fuchsia-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-300/20 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Peppi Avatar */}
            <div className="relative w-28 h-28 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br bg-[#FF2D8E] rounded-full animate-pulse opacity-30" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl shadow-[#FF2D8E]/20 bg-gradient-to-br from-fuchsia-100 to-purple-100">
                <Image
                  src={peppiAvatar}
                  alt="Peppi - Your Peptide & Wellness Expert"
                  fill
                  className="object-cover"
                  sizes="112px"
                  priority
                  onError={() => setImageError(true)}
                />
              </div>
              {/* Online indicator */}
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E]/10 border border-[#FF2D8E]/30 mb-4">
              <span className="text-lg">💊</span>
              <span className="text-[#FF2D8E] text-sm font-bold uppercase tracking-wider">AI Peptide Expert</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#000000] mb-3">
              Meet <span className="text-[#FF2D8E]">Peppi</span>
            </h2>
            <p className="text-lg text-black/70 max-w-xl mx-auto">
              Your intelligent guide to <strong className="text-[#FF2D8E]">peptide therapies</strong>, 
              IV infusions, vitamin injections, and regenerative wellness. Ask anything!
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-8">
            <button
              onClick={() => handleAskPeppi()}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r bg-[#FF2D8E] text-white font-bold text-lg shadow-xl shadow-[#FF2D8E]/30 hover:shadow-2xl hover:shadow-[#FF2D8E]/40 hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl">💬</span>
              Chat with Peppi Now
            </button>
          </div>

          {/* Quick Questions Grid */}
          <div className="space-y-4">
            <p className="text-center text-sm text-black/60 font-medium uppercase tracking-wide">
              Popular Questions
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => handleAskPeppi(question)}
                  className="px-4 py-2 rounded-full border-2 border-black/10 bg-white text-sm text-black/80 font-medium hover:border-[#FF2D8E] hover:text-[#FF2D8E] hover:bg-fuchsia-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4 text-xs text-black/50">
            <span className="flex items-center gap-1">
              <span>🔒</span> HIPAA-mindful
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>🎓</span> Olympia-trained AI
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>📚</span> Education only
            </span>
          </div>
        </div>
      </div>

      {/* Peptide Categories Explorer */}
      <div className="rounded-3xl border-2 border-black bg-gradient-to-br from-white to-fuchsia-50/50 p-6 md:p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-[#000000]">
            Explore Peptide Categories
          </h3>
          <p className="text-black/60 mt-2">
            Click a category to learn more, or ask Peppi about any specific peptide
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PEPTIDE_CATEGORIES.map((category) => (
            <div
              key={category.name}
              className="group"
            >
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                  expandedCategory === category.name
                    ? "border-[#FF2D8E] bg-fuchsia-50 shadow-lg"
                    : "border-black/10 bg-white hover:border-[#FF2D8E]/50 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{category.icon}</span>
                  <h4 className="font-bold text-black group-hover:text-[#FF2D8E] transition-colors">
                    {category.name}
                  </h4>
                </div>
                <p className="text-sm text-black/60 mb-3">{category.description}</p>
                <div className="flex flex-wrap gap-1">
                  {category.peptides.map((peptide) => (
                    <span
                      key={peptide}
                      className="px-2 py-1 text-xs rounded-full bg-fuchsia-100 text-fuchsia-700 font-medium"
                    >
                      {peptide}
                    </span>
                  ))}
                </div>
              </button>
              
              {/* Expanded state with Ask button */}
              {expandedCategory === category.name && (
                <div className="mt-2 p-4 rounded-xl bg-[#FF2D8E]/10 border border-[#FF2D8E]/20">
                  <p className="text-sm text-black/70 mb-3">
                    Want to learn more about {category.name.toLowerCase()}?
                  </p>
                  <button
                    onClick={() => handleAskPeppi(`Tell me about ${category.peptides[0]} and other ${category.name.toLowerCase()} peptides`)}
                    className="w-full py-2 px-4 rounded-full bg-[#FF2D8E] text-white font-semibold text-sm hover:bg-black transition-colors"
                  >
                    Ask Peppi About {category.peptides[0]}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Book Consultation CTA */}
      <div className="rounded-3xl border-2 border-[#FF2D8E]/50 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-fuchsia-500/10 p-6 md:p-8 text-center">
        <h3 className="text-xl font-bold text-[#000000] mb-2">
          Ready to Start Your Peptide Journey?
        </h3>
        <p className="text-black/70 mb-4 max-w-xl mx-auto">
          All peptide therapies require a medical consultation. Our providers will review your goals, 
          health history, and create a personalized protocol.
        </p>
        <a
          href="https://hellogorgeousmedspa.janeapp.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#000000] text-white font-semibold hover:bg-[#333] transition-colors"
        >
          Book a Peptide Consultation
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
