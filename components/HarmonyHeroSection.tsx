"use client";

import Image from "next/image";
import { useChatOpen } from "@/components/ChatOpenContext";
import { mascotImages } from "@/lib/media";
import { useState } from "react";

const QUICK_QUESTIONS = [
  "What are signs of hormone imbalance?",
  "How do Biote pellets work?",
  "Do you offer hormone lab testing?",
  "What's the difference between BHRT and HRT?",
  "What does the lab panel include?",
  "Is hormone therapy safe?",
];

export function HarmonyHeroSection() {
  const { openChat } = useChatOpen();
  const [imageError, setImageError] = useState(false);

  const handleAskHarmony = (question?: string) => {
    openChat("harmony", question ? { topics: [question] } : undefined);
  };

  // Try mascotImages first, then fallback paths
  const harmonyAvatar = imageError 
    ? "/images/characters/hello-gorgeous-mascot.png"
    : (mascotImages.harmony?.portrait || "/images/characters/hello-gorgeous-mascot.png");

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-[#E6007E] bg-gradient-to-br from-pink-50 via-white to-rose-50 p-8 md:p-12 shadow-xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-300/20 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Harmony Avatar */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E6007E] to-rose-400 rounded-full animate-pulse opacity-30" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl shadow-pink-500/20 bg-gradient-to-br from-pink-100 to-rose-100">
              <Image
                src={harmonyAvatar}
                alt="Harmony - Your Biote Hormone Expert"
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

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6007E]/10 border border-[#E6007E]/30 mb-4">
            <span className="text-lg">⚖️</span>
            <span className="text-[#E6007E] text-sm font-bold uppercase tracking-wider">AI Hormone Expert</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-3">
            Meet <span className="text-[#E6007E]">Harmony</span>
          </h2>
          <p className="text-lg text-black/70 max-w-xl mx-auto">
            Your intelligent guide to <strong className="text-[#E6007E]">Biote hormone therapy</strong>. 
            Ask anything about BHRT, lab panels, pellet therapy, symptoms, and more.
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => handleAskHarmony()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#E6007E] to-rose-500 text-white font-bold text-lg shadow-xl shadow-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/40 hover:scale-105 transition-all duration-300"
          >
            <span className="text-2xl">💬</span>
            Chat with Harmony Now
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
                onClick={() => handleAskHarmony(question)}
                className="px-4 py-2 rounded-full border-2 border-black/10 bg-white text-sm text-black/80 font-medium hover:border-[#E6007E] hover:text-[#E6007E] hover:bg-pink-50 transition-all duration-200 shadow-sm hover:shadow-md"
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
          <span className="•">•</span>
          <span className="flex items-center gap-1">
            <span>🎓</span> Biote-trained AI
          </span>
          <span className="•">•</span>
          <span className="flex items-center gap-1">
            <span>📚</span> Education only
          </span>
        </div>
      </div>
    </div>
  );
}
