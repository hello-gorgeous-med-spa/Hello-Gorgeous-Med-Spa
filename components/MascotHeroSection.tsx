"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { PersonaId } from "@/lib/personas/types";
import { PERSONA_UI } from "@/lib/personas/ui";
import { getPersonaConfig } from "@/lib/personas/index";
import { BOOKING_URL } from "@/lib/flows";
// Video functions available if needed
// import { getMascotVideoSrc, pickMascotVideoIntentForContext } from "@/lib/media";

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
  /** Use object-cover for photos so they fill the frame */
  imageCover?: boolean;
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
    videoSrc: "/videos/mascots/founder/founder-vision.mp4", // Placeholder until filla-grace-intro.mp4 added
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
    characterImage: "/images/providers/ryan-kent-clinic.jpg",
    videoSrc: "/videos/mascots/ryan/ryan-intro.mp4",
    imageCover: true,
    features: [
      { icon: "🩺", title: "Clinical Authority", description: "Medical oversight and safety" },
      { icon: "⚠️", title: "Contraindications", description: "Who should avoid treatments" },
      { icon: "📊", title: "Evidence-Based", description: "Science-backed decisions" },
      { icon: "🏥", title: "When to Seek Care", description: "Knowing your limits" },
    ],
  },
];

const AVATAR_SIZE = 120; // Uniform size for face and full-body (portrait-style square)

function MascotHero({ data, onAskClick }: { data: MascotHeroData; onAskClick: (id: PersonaId) => void }) {
  const cfg = getPersonaConfig(data.id);
  const ui = PERSONA_UI[data.id];
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    setShowVideo(true);
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {});
    });
  };

  return (
    <div className="rounded-xl border-2 border-black bg-white shadow-md p-4 md:p-5 flex flex-col hover:shadow-xl hover:-translate-y-[2px] transition-all">
      <div className="flex gap-4 items-start flex-1 min-h-0">
        {/* Character Image - uniform portrait size (face + full-body same) */}
        <div className="flex-shrink-0">
          <div
            className="relative rounded-xl overflow-hidden border-2 border-black shadow-lg"
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
          >
            {showVideo && data.videoSrc ? (
              <video
                ref={videoRef}
                src={data.videoSrc}
                autoPlay
                controls
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <Image
                  src={data.characterImage}
                  alt={cfg.displayName}
                  fill
                  className={data.imageCover ? "object-cover" : "object-contain"}
                  sizes={`${AVATAR_SIZE}px`}
                />
                {data.videoSrc && (
                  <button
                    type="button"
                    onClick={handlePlayVideo}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-white transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FF2D8E] flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <span className="text-white text-sm ml-0.5">▶</span>
                    </div>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{ui.emoji}</span>
            <h3 className="text-lg font-bold text-[#FF2D8E] truncate">{cfg.displayName}</h3>
          </div>
          <p className="text-xs text-[#FF2D8E] mb-3">{cfg.role}</p>
          <p className="text-[#FF2D8E] text-sm leading-snug line-clamp-2 mb-3">{ui.tagline}</p>

          {/* Feature Pills - compact */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {data.features.slice(0, 2).map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FF2D8E]/10 border border-[#FF2D8E]/20 text-xs text-[#FF2D8E]"
              >
                {feature.icon} {feature.title}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {data.videoSrc && (
              <button
                type="button"
                onClick={handlePlayVideo}
                className="px-3 py-1.5 rounded-full bg-[#FF2D8E]/10 text-[#FF2D8E] font-medium text-xs border border-[#FF2D8E]/20 hover:bg-[#FF2D8E]/20 transition"
              >
                ▶ Video
              </button>
            )}
            <button
              type="button"
              onClick={() => onAskClick(data.id)}
                className="px-3 py-1.5 rounded-full bg-[#FF2D8E] text-white font-medium text-xs hover:bg-[#FF2D8E] transition"
            >
              💬 Ask
            </button>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#000000]/5 text-[#FF2D8E] font-medium text-xs hover:bg-[#000000]/10 transition border border-black"
            >
              Book
            </a>
          </div>
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <p className="text-[#FF2D8E] text-sm font-medium tracking-wide">MEET YOUR CARE TEAM</p>
        <h2 className="mt-2 text-2xl md:text-4xl font-bold text-[#FF2D8E]">Your experts, on demand</h2>
        <p className="mt-2 text-sm md:text-base text-[#FF2D8E] max-w-2xl mx-auto">
          Pick an expert to get clear, calm answers. Education only—book a consult for medical advice.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {mascotHeroData.map((mascot) => (
          <MascotHero key={mascot.id} data={mascot} onAskClick={handleAskClick} />
        ))}
      </div>

      {/* Chat Modal */}
      {chatOpen && selectedPersona && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border-2 border-black rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-black flex items-center justify-between">
              <div>
                <p className="text-[#FF2D8E] font-bold">Chat with {getPersonaConfig(selectedPersona).displayName}</p>
                <p className="text-xs text-[#FF2D8E]">Education only. No medical advice.</p>
              </div>
              <button
                type="button"
                onClick={handleCloseChat}
                className="text-[#FF2D8E] hover:text-[#FF2D8E] p-2"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
                <p className="text-[#FF2D8E] text-sm mb-4">
                Ask {getPersonaConfig(selectedPersona).displayName} about {getPersonaConfig(selectedPersona).role.toLowerCase()}.
              </p>
              <div className="space-y-3">
                {PERSONA_UI[selectedPersona].chatStarters.slice(0, 3).map((starter, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full text-left px-4 py-3 rounded-xl border border-[#FF2D8E]/20 bg-[#FF2D8E]/5 text-[#FF2D8E] text-sm hover:bg-[#FF2D8E]/10 hover:border-[#FF2D8E]/40 transition"
                  >
                    {starter}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-3 rounded-xl bg-[#000000]/5 border-2 border-black text-[#FF2D8E] placeholder:text-[#FF2D8E] focus:outline-none focus:border-[#FF2D8E]/50"
                />
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-[#FF2D8E] text-white font-semibold hover:bg-[#FF2D8E] transition"
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
