"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { FiPlay, FiPause, FiX, FiHeart, FiDroplet, FiActivity, FiStar, FiZap, FiUsers, FiSun } from "react-icons/fi";

const mascots = [
  {
    id: "beau-tox",
    name: "Beau-Tox™",
    specialty: "Botox & Neuromodulators",
    tagline: "The No-BS Injectable Expert",
    description: "Your straight-talking guide to cosmetic injectables. Beau-Tox cuts through the marketing hype to give you real information about Botox, Dysport, and other neuromodulators.",
    video: "/videos/mascots/beau-tox.mp4",
    icon: FiZap,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    expertise: ["Botox", "Dysport", "Xeomin", "Expression Lines", "Preventive Care"],
    personality: "Sassy, honest, tells it like it is"
  },
  {
    id: "filla-grace",
    name: "Filla-Grace",
    specialty: "Dermal Fillers",
    tagline: "The Art of Facial Harmony",
    description: "Master of facial balance and volume restoration. Filla-Grace helps you understand fillers with an anatomy-first approach, focusing on natural-looking results.",
    video: "/videos/mascots/filla-grace.mp4",
    icon: FiHeart,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    expertise: ["Lip Fillers", "Cheek Enhancement", "Jawline Contouring", "Under-Eye Treatment"],
    personality: "Graceful, detailed, anatomy-focused"
  },
  {
    id: "slim-t",
    name: "Slim-T",
    specialty: "Weight Management",
    tagline: "Your Metabolic Coach",
    description: "Science-based guidance for sustainable weight management. Slim-T covers GLP-1 medications, metabolic health, and long-term wellness strategies.",
    video: "/videos/mascots/slim-t.mp4",
    icon: FiActivity,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    expertise: ["Semaglutide", "Tirzepatide", "Metabolic Health", "Nutrition Guidance"],
    personality: "Motivating, science-driven, supportive"
  },
  {
    id: "peppi",
    name: "Peppi",
    specialty: "Peptides & Regenerative",
    tagline: "The Regeneration Specialist",
    description: "Your guide to cutting-edge peptide therapies and regenerative medicine. Peppi breaks down complex science into actionable wellness insights.",
    video: "/videos/mascots/peppi.mp4",
    icon: FiStar,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    expertise: ["Peptide Therapy", "Growth Factors", "Cellular Health", "Anti-Aging"],
    personality: "Enthusiastic, cutting-edge, data-driven"
  },
  {
    id: "harmony",
    name: "Harmony",
    specialty: "Holistic Wellness",
    tagline: "Balance Mind & Body",
    description: "Integrating aesthetics with overall wellness. Harmony guides you through the connection between inner health and outer beauty.",
    video: "/videos/mascots/harmony.mp4",
    icon: FiSun,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    expertise: ["Stress Management", "Skin Health", "Hormonal Balance", "Lifestyle Integration"],
    personality: "Calm, holistic, nurturing"
  },
  {
    id: "founder",
    name: "The Founder",
    specialty: "Med Spa Leadership",
    tagline: "Vision & Experience",
    description: "Meet the visionary behind Hello Gorgeous Med Spa. Learn about our philosophy, standards, and commitment to exceptional care.",
    video: "/videos/mascots/founder.mp4",
    icon: FiUsers,
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    expertise: ["Industry Experience", "Patient Care Philosophy", "Safety Standards"],
    personality: "Visionary, experienced, caring"
  }
];

export default function MascotsPage() {
  const [selectedMascot, setSelectedMascot] = useState<typeof mascots[0] | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleVideoToggle = (mascotId: string) => {
    const video = videoRefs.current[mascotId];
    if (!video) return;

    // Stop all other videos first
    Object.entries(videoRefs.current).forEach(([id, v]) => {
      if (id !== mascotId && v) {
        v.pause();
        v.currentTime = 0;
      }
    });

    if (playingVideo === mascotId) {
      video.pause();
      setPlayingVideo(null);
    } else {
      video.play();
      setPlayingVideo(mascotId);
    }
  };

  const handleVideoEnd = (mascotId: string) => {
    if (playingVideo === mascotId) {
      setPlayingVideo(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-4 py-4 backdrop-blur-sm bg-black/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-pink-400 hover:text-pink-300 transition-colors">
            ← Back Home
          </Link>
          <h1 className="text-xl font-semibold tracking-tight">Hello Gorgeous Med Spa</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-full text-sm font-medium mb-6">
            Meet Your Expert Team
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">AI-Powered</span>
            <br />Beauty Guides
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Meet our team of specialized mascots, each bringing unique expertise to guide your aesthetic journey at Hello Gorgeous Med Spa.
          </p>
        </div>
      </section>

      {/* Mascots Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mascots.map((mascot) => {
              const IconComponent = mascot.icon;
              return (
                <div
                  key={mascot.id}
                  className={`group relative bg-white/5 rounded-2xl overflow-hidden border ${mascot.borderColor} hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10`}
                >
                  {/* Video Section */}
                  <div className="relative aspect-video bg-gray-900">
                    <video
                      ref={(el) => { videoRefs.current[mascot.id] = el; }}
                      src={mascot.video}
                      className="w-full h-full object-cover"
                      onEnded={() => handleVideoEnd(mascot.id)}
                      playsInline
                      preload="metadata"
                    />
                    
                    {/* Play/Pause Overlay */}
                    <div 
                      className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${playingVideo === mascot.id ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                    >
                      <button
                        onClick={() => handleVideoToggle(mascot.id)}
                        className={`bg-gradient-to-r ${mascot.color} text-white p-4 rounded-full transition-transform hover:scale-110 shadow-lg`}
                      >
                        {playingVideo === mascot.id ? (
                          <FiPause className="w-6 h-6" />
                        ) : (
                          <FiPlay className="w-6 h-6 ml-0.5" />
                        )}
                      </button>
                    </div>

                    {/* Icon Badge */}
                    <div className={`absolute top-3 right-3 p-2 rounded-full bg-gradient-to-r ${mascot.color} shadow-lg`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-1">{mascot.name}</h3>
                      <p className={`text-sm font-medium bg-gradient-to-r ${mascot.color} bg-clip-text text-transparent`}>
                        {mascot.specialty}
                      </p>
                      <p className="text-white/50 text-sm mt-1 italic">&quot;{mascot.tagline}&quot;</p>
                    </div>
                    
                    <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">
                      {mascot.description}
                    </p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {mascot.expertise.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-0.5 ${mascot.bgColor} ${mascot.borderColor} border rounded-full text-xs text-white/80`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setSelectedMascot(mascot)}
                      className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium text-sm transition-colors"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Book a consultation with our expert team and discover personalized treatments tailored to your unique beauty goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+1234567890"
              className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              Book Consultation
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Mascot Detail Modal */}
      {selectedMascot && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMascot(null)}
        >
          <div 
            className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Video */}
            <div className="relative aspect-video bg-black">
              <video
                src={selectedMascot.video}
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
              />
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{selectedMascot.name}</h3>
                  <p className={`font-medium bg-gradient-to-r ${selectedMascot.color} bg-clip-text text-transparent`}>
                    {selectedMascot.specialty}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMascot(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">About</h4>
                  <p className="text-white/80 leading-relaxed">{selectedMascot.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Personality</h4>
                  <p className="text-white/80">{selectedMascot.personality}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Areas of Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMascot.expertise.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1.5 ${selectedMascot.bgColor} ${selectedMascot.borderColor} border rounded-full text-sm text-white/90`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => setSelectedMascot(null)}
                  className={`w-full py-3 px-6 bg-gradient-to-r ${selectedMascot.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
