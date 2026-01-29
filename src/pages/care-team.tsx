import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPlay, FiPause, FiMessageCircle, FiX } from "react-icons/fi";

// Care team mascots with local video files
const mascots = [
  {
    id: "founder",
    name: "Founder",
    specialty: "Provider Translator",
    description: "I built this platform because patients deserve clarity - not confusion. I explain how providers think - without defending bad medicine.",
    image: "/images/mascots/founder.png",
    video: "/videos/mascots/founder.mp4",
    credentials: "OWNER | RN-S | CMAA",
    personality: "Trust anchor, straight shooter",
    chatPrompt: "Get the founder's perspective on navigating healthcare"
  },
  {
    id: "beau-tox",
    name: "Beau-Tox™",
    specialty: "Botox & Injectables",
    description: "Hey - I'm Beau-Tox. I say what injectors think - but won't say to your face. No sugar-coating here.",
    image: "/images/mascots/beau-tox.png",
    video: "/videos/mascots/beau-tox.mp4",
    credentials: "Injectables Authority",
    personality: "Sassy, honest, tells it like it is",
    chatPrompt: "Get real talk about injectables and cosmetic procedures"
  },
  {
    id: "filla-grace",
    name: "Grace",
    specialty: "Fillers & Facial Anatomy",
    description: "I explain fillers, facial anatomy, and why 'natural' is usually just good marketing. Fillers are about restoring harmony.",
    image: "/images/mascots/filla-grace.png",
    video: "/videos/mascots/filla-grace.mp4",
    credentials: "Filler Expert",
    personality: "Graceful, detailed, anatomy-focused",
    chatPrompt: "Learn about fillers, facial anatomy, and realistic expectations"
  },
  {
    id: "slim-t",
    name: "Slim-T",
    specialty: "Weight Loss & Metabolism",
    description: "Hormones and weight loss aren't magic. I'll tell you what actually moves the needle. No BS - just real talk.",
    image: "/images/mascots/slim-t.png",
    video: "/videos/mascots/slim-t.mp4",
    credentials: "Metabolism Coach",
    personality: "No BS, results-focused",
    chatPrompt: "Discuss weight loss, metabolism, and sustainable change"
  },
  {
    id: "peppi",
    name: "Peppi",
    specialty: "Peptides & Wellness",
    description: "I break down peptides in simple terms - short chains of amino acids that signal processes in the body. I separate hype from science.",
    image: "/images/mascots/peppi.png",
    video: "/videos/mascots/peppi.mp4",
    credentials: "Peptide Specialist",
    personality: "Friendly, science-based, clear",
    chatPrompt: "Understand peptides, research, and what's actually proven"
  },
  {
    id: "harmony",
    name: "Harmony",
    specialty: "Hormone Balance",
    description: "Hormone balance is about symptoms, patterns, and overall wellbeing - not a single number. I help you understand what's really going on.",
    image: "/images/mascots/harmony.png",
    video: "/videos/mascots/harmony.mp4",
    credentials: "Hormone Guide",
    personality: "Caring, holistic, patient-focused",
    chatPrompt: "Explore hormone health and what balance really means"
  },
  {
    id: "decode",
    name: "Decode",
    specialty: "Lab Results & Testing",
    description: "I translate complex lab results into plain English. Understanding your numbers is the first step to taking control of your health.",
    image: "/images/mascots/decode.png",
    video: "/videos/mascots/decode.mp4",
    credentials: "Lab Decoder",
    personality: "Analytical, clear, educational",
    chatPrompt: "Understand your lab results and what they mean"
  },
  {
    id: "roots",
    name: "Roots",
    specialty: "Family Health & Genetics",
    description: "Your health story starts with your family tree. I help you understand how genetics and family history shape your wellness journey.",
    image: "/images/mascots/roots.png",
    video: "/videos/mascots/roots.mp4",
    credentials: "Family Health Guide",
    personality: "Thoughtful, connected, big-picture",
    chatPrompt: "Explore your family health history and genetic factors"
  }
];

interface Mascot {
  id: string;
  name: string;
  specialty: string;
  description: string;
  image: string;
  video: string;
  credentials: string;
  personality: string;
  chatPrompt: string;
}

export default function CareTeamPage() {
  const [selectedMascot, setSelectedMascot] = useState<Mascot | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [loadingChat, setLoadingChat] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleVideoPlay = (mascotId: string) => {
    const videoElement = videoRefs.current[mascotId];
    if (!videoElement) return;

    // Stop all other videos
    Object.keys(videoRefs.current).forEach((id) => {
      if (id !== mascotId && videoRefs.current[id]) {
        videoRefs.current[id]!.pause();
        videoRefs.current[id]!.currentTime = 0;
      }
    });

    if (playingVideo === mascotId) {
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      videoElement.play();
      setPlayingVideo(mascotId);
    }
  };

  const startChat = (mascot: Mascot) => {
    setLoadingChat(mascot.id);
    setTimeout(() => {
      window.location.href = `/chat?mascot=${mascot.id}`;
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-pink-400 hover:text-pink-300 transition">
            ← Back Home
          </Link>
          <h1 className="text-xl font-bold">Hello Gorgeous Med Spa</h1>
          <Link href="/contact" className="text-pink-400 hover:text-pink-300 transition">
            Contact
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-pink-500 uppercase tracking-wider text-sm font-semibold mb-4">
            Meet the Experts
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your care team, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">on demand</span>
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Pick an expert to switch chat tone + scope instantly. Watch short credibility clips. 
            Education only—book a consult for medical advice.
          </p>
        </div>
      </section>

      {/* Mascots Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mascots.map((mascot) => (
              <div
                key={mascot.id}
                className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-pink-500/30 transition-all group"
              >
                {/* Video/Image Section */}
                <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-800">
                  <div className="aspect-video relative">
                    {/* Placeholder gradient when no image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-pink-300/20" />
                    
                    {/* Play Button Overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${playingVideo === mascot.id ? 'opacity-0' : 'opacity-100'}`}>
                      <button
                        onClick={() => handleVideoPlay(mascot.id)}
                        className="bg-pink-500/90 hover:bg-pink-500 text-white p-4 rounded-full transition-all transform hover:scale-110 shadow-lg"
                      >
                        <FiPlay className="w-6 h-6 ml-0.5" />
                      </button>
                    </div>

                    {/* Video Element */}
                    <video
                      ref={(el) => { videoRefs.current[mascot.id] = el; }}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
                        playingVideo === mascot.id ? 'opacity-100' : 'opacity-0'
                      }`}
                      src={mascot.video}
                      onEnded={() => setPlayingVideo(null)}
                      playsInline
                      controls={playingVideo === mascot.id}
                      preload="metadata"
                    />

                    {/* Pause overlay when playing */}
                    {playingVideo === mascot.id && (
                      <button
                        onClick={() => handleVideoPlay(mascot.id)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                      >
                        <FiPause className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mascot Info */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold">{mascot.name}</h3>
                      <p className="text-pink-400 text-sm font-medium">{mascot.specialty}</p>
                    </div>
                  </div>
                  
                  {mascot.credentials && (
                    <p className="text-xs text-white/50 mb-2">{mascot.credentials}</p>
                  )}
                  
                  <p className="text-white/70 text-sm leading-relaxed mb-3 line-clamp-2">
                    {mascot.description}
                  </p>

                  {/* Personality Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-full text-xs">
                      {mascot.personality}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => startChat(mascot)}
                      disabled={loadingChat === mascot.id}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                    >
                      {loadingChat === mascot.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <FiMessageCircle className="w-4 h-4" />
                          Chat
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedMascot(mascot)}
                      className="px-4 py-2.5 border border-white/20 text-white hover:bg-white/10 rounded-xl transition text-sm"
                    >
                      Info
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-white/70 mb-8">
            Connect with any of our expert guides for personalized wellness education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Mascot Detail Modal */}
      {selectedMascot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{selectedMascot.name}</h3>
                  <p className="text-pink-400">{selectedMascot.specialty}</p>
                  <p className="text-white/50 text-sm">{selectedMascot.credentials}</p>
                </div>
                <button
                  onClick={() => setSelectedMascot(null)}
                  className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">About</h4>
                  <p className="text-white/70">{selectedMascot.description}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2">Personality</h4>
                  <p className="text-white/70">{selectedMascot.personality}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-2">What You Can Ask</h4>
                  <p className="text-white/70">{selectedMascot.chatPrompt}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    startChat(selectedMascot);
                    setSelectedMascot(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition"
                >
                  Start Chat with {selectedMascot.name}
                </button>
                <button
                  onClick={() => setSelectedMascot(null)}
                  className="px-6 py-3 border border-white/30 text-white hover:bg-white/10 rounded-xl transition"
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
