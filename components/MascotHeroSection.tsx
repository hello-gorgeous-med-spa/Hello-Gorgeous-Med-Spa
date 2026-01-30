"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { PersonaId } from "@/lib/personas/types";
import { PERSONA_UI } from "@/lib/personas/ui";
import { getPersonaConfig } from "@/lib/personas/index";
import { getMascotVideoSrc, pickMascotVideoIntentForContext } from "@/lib/media";

type MascotFeature = {
  icon: string;
  title: string;
  description: string;
};

type MascotHeroData = {
  id: PersonaId;
  characterImage: string;
  videoSrc: string | null;
  features: MascotFeature[];
};

const mascotHeroData: MascotHeroData[] = [
  {
    id: "peppi",
    characterImage: "/images/characters/peppi.png",
    videoSrc: "/videos/mascots/peppi/peppi-intro.mp4",
    features: [
      { icon: "🫶", title: "First-Time Guidance", description: "What to expect at your first visit" },
      { icon: "😌", title: "Anxiety Relief", description: "Calm explanations and reassurance" },
      { icon: "📋", title: "Prep & Aftercare", description: "Step-by-step preparation tips" },
      { icon: "💬", title: "Consultation Guide", description: "How appointments work" },
    ],
  },
  {
    id: "beau-tox",
    characterImage: "/images/characters/beau.png",
    videoSrc: "/videos/mascots/beau-tox/beau-tox.mp4",
    features: [
      { icon: "💉", title: "Botox Education", description: "How neuromodulators actually work" },
      { icon: "⏱️", title: "Timeline & Results", description: "What to expect and when" },
      { icon: "🚫", title: "Myth Busting", description: "Separating fact from fiction" },
      { icon: "✅", title: "Safety First", description: "What you need to know before treatment" },
    ],
  },
  {
    id: "filla-grace",
    characterImage: "/images/characters/filla-grace.png",
    videoSrc: "/videos/mascots/filla-grace/filla-grace-intro.mp4",
    features: [
      { icon: "✨", title: "Filler Types", description: "Understanding different filler options" },
      { icon: "🎭", title: "Facial Harmony", description: "Balance and natural enhancement" },
      { icon: "💎", title: "Subtle vs Dramatic", description: "Finding your perfect look" },
      { icon: "🛡️", title: "Safety Zones", description: "High-risk areas to understand" },
    ],
  },
  {
    id: "founder",
    characterImage: "/images/characters/founder.png",
    videoSrc: "/videos/mascots/founder/founder-vision.mp4",
    features: [
      { icon: "🖤", title: "Our Vision", description: "Why Hello Gorgeous exists" },
      { icon: "💫", title: "Patient-First Care", description: "Our core philosophy" },
      { icon: "🏆", title: "Standards", description: "What makes us different" },
      { icon: "🤝", title: "Trust & Safety", description: "Our commitment to you" },
    ],
  },
  {
    id: "ryan",
    characterImage: "/images/characters/ryan.png",
    videoSrc: "/videos/mascots/ryan/ryan-intro.mp4",
    features: [
      { icon: "🩺", title: "Clinical Authority", description: "Medical oversight and safety" },
      { icon: "⚠️", title: "Contraindications", description: "Who should avoid treatments" },
      { icon: "📊", title: "Evidence-Based", description: "Science-backed decisions" },
      { icon: "🏥", title: "When to Seek Care", description: "Knowing your limits" },
    ],
  },
];

function MascotHero({ data, onAskClick }: { data: MascotHeroData; onAskClick: (id: PersonaId) => void }) {
  const cfg = getPersonaConfig(data.id);
  const ui = PERSONA_UI[data.id];
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    setShowVideo(true);
    setIsPlaying(true);
  };

  return (
    <div className="rounded-3xl border border-pink-500/30 bg-gradient-to-br from-black via-black to-pink-950/20 p-6 md:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Content */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{ui.emoji}</span>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">{cfg.displayName}</h3>
              <div className="h-1 w-16 bg-pink-500 rounded-full mt-1" />
              <p className="text-sm text-pink-400 mt-1">{cfg.role}</p>
            </div>
          </div>

          <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6">
            {ui.tagline}
          </p>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {data.features.map((feature, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-4 transition hover:scale-[1.02] hover:border-pink-500/40"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{feature.icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-pink-400">{feature.title}</p>
                    <p className="text-xs text-white/60 mt-1">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {data.videoSrc && (
              <button
                type="button"
                onClick={handlePlayVideo}
                className="px-6 py-3 rounded-full bg-pink-500/10 text-pink-400 font-semibold text-sm border border-pink-500/30 hover:bg-pink-500/20 transition flex items-center gap-2"
              >
                <span>▶</span> Watch Video
              </button>
            )}
            <button
              type="button"
              onClick={() => onAskClick(data.id)}
              className="px-6 py-3 rounded-full bg-pink-500 text-white font-semibold text-sm hover:bg-pink-600 transition flex items-center gap-2 shadow-lg shadow-pink-500/25"
            >
              <span>💬</span> Ask {cfg.displayName.split(" ")[0]}
            </button>
            <a
              href="https://fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition"
            >
              Book Now
            </a>
          </div>
        </div>

        {/* Right side - Character Image or Video */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/20 border border-pink-500/20">
            {showVideo && data.videoSrc ? (
              <video
                ref={videoRef}
                src={data.videoSrc}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <Image
                  src={data.characterImage}
                  alt={`${cfg.displayName} character`}
                  fill
                  className="object-contain object-bottom"
                  sizes="(max-width: 768px) 256px, 320px"
                />
                {data.videoSrc && (
                  <button
                    type="button"
                    onClick={handlePlayVideo}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition group"
                  >
                    <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/50 group-hover:scale-110 transition">
                      <span className="text-white text-2xl ml-1">▶</span>
                    </div>
                  </button>
                )}
              </>
            )}
          </div>
          {/* Decorative glow */}
          <div className="absolute -inset-4 bg-pink-500/10 rounded-3xl blur-3xl opacity-30 -z-10" />
        </div>
      </div>
    </div>
  );
}

export function MascotHeroSection() {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaId | null>(null);

  const handleAskClick = (id: PersonaId) => {
    setSelectedPersona(id);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedPersona(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <p className="text-pink-400 text-lg font-medium tracking-wide">MEET YOUR CARE TEAM</p>
        <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">Your experts, on demand</h2>
        <p className="mt-4 text-base md:text-lg text-white/70 max-w-3xl mx-auto">
          Pick an expert to get clear, calm answers. Education only—book a consult for medical advice.
        </p>
      </div>

      {mascotHeroData.map((mascot) => (
        <MascotHero key={mascot.id} data={mascot} onAskClick={handleAskClick} />
      ))}

      {/* Chat Modal */}
      {chatOpen && selectedPersona && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-black border border-pink-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/20">
            <div className="p-4 border-b border-pink-500/20 flex items-center justify-between">
              <div>
                <p className="text-white font-bold">Chat with {getPersonaConfig(selectedPersona).displayName}</p>
                <p className="text-xs text-white/60">Education only. No medical advice.</p>
              </div>
              <button
                type="button"
                onClick={handleCloseChat}
                className="text-white/60 hover:text-white p-2"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-white/70 text-sm mb-4">
                Ask {getPersonaConfig(selectedPersona).displayName} about {getPersonaConfig(selectedPersona).role.toLowerCase()}.
              </p>
              <div className="space-y-3">
                {PERSONA_UI[selectedPersona].chatStarters.slice(0, 3).map((starter, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full text-left px-4 py-3 rounded-xl border border-pink-500/20 bg-pink-500/5 text-white/80 text-sm hover:bg-pink-500/10 hover:border-pink-500/40 transition"
                  >
                    {starter}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50"
                />
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
