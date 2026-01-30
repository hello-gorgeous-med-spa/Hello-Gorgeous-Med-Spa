"use client";

import { useState, useRef, useEffect } from "react";

type ServiceRecommendation = {
  id: string;
  name: string;
  price: string;
  description: string;
  freshaUrl: string;
  isUpsell?: boolean;
};

// Fresha booking URLs for different services
const FRESHA_BASE = "https://fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245";

const serviceDatabase: Record<string, ServiceRecommendation & { upsells: string[] }> = {
  botox: {
    id: "botox",
    name: "Botox",
    price: "$10/unit",
    description: "Smooth wrinkles and prevent new ones. Results in 3-7 days.",
    freshaUrl: FRESHA_BASE,
    upsells: ["lip-flip", "vitamin-b12"],
  },
  "lip-flip": {
    id: "lip-flip",
    name: "Botox Lip Flip",
    price: "$99",
    description: "Subtle lip enhancement without filler. Quick 10-min treatment.",
    freshaUrl: FRESHA_BASE,
    upsells: ["fillers", "vitamin-b12"],
  },
  fillers: {
    id: "fillers",
    name: "Dermal Fillers",
    price: "$500/syringe",
    description: "Restore volume, enhance lips, or contour your face naturally.",
    freshaUrl: FRESHA_BASE,
    upsells: ["botox", "prp"],
  },
  "weight-loss": {
    id: "weight-loss",
    name: "GLP-1 Weight Loss",
    price: "1st Month FREE",
    description: "Semaglutide or Tirzepatide. Medical weight loss that works.",
    freshaUrl: FRESHA_BASE,
    upsells: ["vitamin-b12", "lipo-shot"],
  },
  semaglutide: {
    id: "semaglutide",
    name: "Semaglutide",
    price: "Starting at $299/mo",
    description: "The #1 GLP-1 for weight loss. Average 15-20% body weight loss.",
    freshaUrl: FRESHA_BASE,
    upsells: ["vitamin-b12", "lipo-shot"],
  },
  tirzepatide: {
    id: "tirzepatide",
    name: "Tirzepatide",
    price: "Starting at $399/mo",
    description: "Dual-action GLP-1/GIP. Up to 25% weight loss.",
    freshaUrl: FRESHA_BASE,
    upsells: ["vitamin-b12", "lipo-shot"],
  },
  "vitamin-b12": {
    id: "vitamin-b12",
    name: "Vitamin B12 Injection",
    price: "$25",
    description: "Instant energy boost. Great add-on to any treatment.",
    freshaUrl: FRESHA_BASE,
    upsells: ["glutathione", "biotin"],
  },
  "lipo-shot": {
    id: "lipo-shot",
    name: "MIC Lipo Shot",
    price: "$35",
    description: "Fat-burning vitamin cocktail. Boosts metabolism.",
    freshaUrl: FRESHA_BASE,
    upsells: ["vitamin-b12", "weight-loss"],
  },
  glutathione: {
    id: "glutathione",
    name: "Glutathione Injection",
    price: "$35",
    description: "Master antioxidant. Skin brightening and detox.",
    freshaUrl: FRESHA_BASE,
    upsells: ["vitamin-b12", "biotin"],
  },
  biotin: {
    id: "biotin",
    name: "Biotin Injection",
    price: "$25",
    description: "Hair, skin, and nail support. See results in weeks.",
    freshaUrl: FRESHA_BASE,
    upsells: ["glutathione", "vitamin-b12"],
  },
  hormones: {
    id: "hormones",
    name: "Biote Hormone Therapy",
    price: "Starting at $650",
    description: "Bio-identical pellet therapy. Feel younger and more energized.",
    freshaUrl: FRESHA_BASE,
    upsells: ["lab-panel", "vitamin-b12"],
  },
  "lab-panel": {
    id: "lab-panel",
    name: "In-Office Lab Panel",
    price: "$199",
    description: "Comprehensive labs with results in 36 hours.",
    freshaUrl: FRESHA_BASE,
    upsells: ["hormones", "weight-loss"],
  },
  prp: {
    id: "prp",
    name: "PRP/PRF Treatment",
    price: "Starting at $600",
    description: "Regenerative therapy using your own platelets.",
    freshaUrl: FRESHA_BASE,
    upsells: ["fillers", "botox"],
  },
  consultation: {
    id: "consultation",
    name: "Free Consultation",
    price: "FREE",
    description: "Meet with our team to discuss your goals. No pressure.",
    freshaUrl: FRESHA_BASE,
    upsells: [],
  },
};

// Keywords to service mapping
const keywordMap: Record<string, string> = {
  botox: "botox",
  dysport: "botox",
  jeuveau: "botox",
  wrinkle: "botox",
  wrinkles: "botox",
  forehead: "botox",
  "crows feet": "botox",
  frown: "botox",
  "lip flip": "lip-flip",
  lipflip: "lip-flip",
  filler: "fillers",
  fillers: "fillers",
  lips: "fillers",
  cheeks: "fillers",
  jawline: "fillers",
  chin: "fillers",
  volume: "fillers",
  weight: "weight-loss",
  "weight loss": "weight-loss",
  weightloss: "weight-loss",
  lose: "weight-loss",
  fat: "weight-loss",
  semaglutide: "semaglutide",
  ozempic: "semaglutide",
  wegovy: "semaglutide",
  tirzepatide: "tirzepatide",
  mounjaro: "tirzepatide",
  zepbound: "tirzepatide",
  b12: "vitamin-b12",
  energy: "vitamin-b12",
  tired: "vitamin-b12",
  fatigue: "vitamin-b12",
  lipo: "lipo-shot",
  "lipo shot": "lipo-shot",
  glutathione: "glutathione",
  glow: "glutathione",
  brightening: "glutathione",
  detox: "glutathione",
  biotin: "biotin",
  hair: "biotin",
  nails: "biotin",
  hormone: "hormones",
  hormones: "hormones",
  biote: "hormones",
  pellet: "hormones",
  testosterone: "hormones",
  menopause: "hormones",
  lab: "lab-panel",
  labs: "lab-panel",
  "blood work": "lab-panel",
  bloodwork: "lab-panel",
  prp: "prp",
  prf: "prp",
  vampire: "prp",
  consultation: "consultation",
  consult: "consultation",
  appointment: "consultation",
  book: "consultation",
  "first time": "consultation",
  new: "consultation",
};

function detectService(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [keyword, serviceId] of Object.entries(keywordMap)) {
    if (lower.includes(keyword)) {
      return serviceId;
    }
  }
  return null;
}

function getRecommendations(serviceId: string): ServiceRecommendation[] {
  const main = serviceDatabase[serviceId];
  if (!main) return [];

  const recommendations: ServiceRecommendation[] = [
    { ...main, isUpsell: false },
  ];

  // Add upsells
  for (const upsellId of main.upsells.slice(0, 2)) {
    const upsell = serviceDatabase[upsellId];
    if (upsell) {
      recommendations.push({ ...upsell, isUpsell: true });
    }
  }

  return recommendations;
}

function generateVoiceResponse(serviceId: string, serviceName: string, upsells: ServiceRecommendation[]): string {
  let response = `Great choice! ${serviceName} is one of our most popular services. `;
  
  if (upsells.length > 0) {
    response += `Many clients also add ${upsells[0].name} for just ${upsells[0].price}. `;
  }
  
  response += `Would you like me to help you book a consultation? Just click the Book Now button below.`;
  
  return response;
}

export function VoiceConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [recommendations, setRecommendations] = useState<ServiceRecommendation[]>([]);
  const [error, setError] = useState("");
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const startListening = () => {
    setError("");
    setTranscript("");
    setResponse("");
    setRecommendations([]);

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setError("Voice recognition is not supported in your browser. Please try Chrome.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      processTranscript();
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else {
        setError("Error occurred. Please try again.");
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const processTranscript = () => {
    const text = transcript || "";
    if (!text.trim()) {
      setResponse("I didn't catch that. Please try again or tell me what service you're interested in.");
      speak("I didn't catch that. Please try again or tell me what service you're interested in.");
      return;
    }

    const serviceId = detectService(text);
    
    if (serviceId) {
      const recs = getRecommendations(serviceId);
      setRecommendations(recs);
      
      const main = recs[0];
      const upsells = recs.filter(r => r.isUpsell);
      const voiceResponse = generateVoiceResponse(serviceId, main.name, upsells);
      
      setResponse(voiceResponse);
      speak(voiceResponse);
    } else {
      const fallback = "I'd love to help you find the perfect service! Are you interested in Botox, fillers, weight loss, vitamins, or hormone therapy? Or would you like to book a free consultation?";
      setResponse(fallback);
      speak(fallback);
      
      // Show consultation as default
      setRecommendations([
        serviceDatabase.consultation,
        serviceDatabase.botox,
        serviceDatabase["weight-loss"],
      ].map((s, i) => ({ ...s, isUpsell: i > 0 })));
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to use a female voice
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(v => 
      v.name.includes("Samantha") || 
      v.name.includes("Victoria") || 
      v.name.includes("Female") ||
      v.name.includes("Google US English")
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <>
      {/* Floating Voice Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-6 left-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30 flex items-center justify-center hover:scale-110 transition-transform group"
        aria-label="Open voice assistant"
      >
        <span className="text-2xl group-hover:scale-110 transition-transform">🎤</span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Voice Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 via-purple-950/30 to-gray-900 border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-2xl">👩‍⚕️</span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Hello Gorgeous Concierge</h2>
                  <p className="text-white/70 text-sm">Voice-powered booking assistant</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setIsOpen(false); stopSpeaking(); }}
                className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Voice Control */}
              <div className="text-center mb-6">
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isSpeaking}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? "bg-red-500 animate-pulse scale-110"
                      : "bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-105"
                  } ${isSpeaking ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="text-4xl">{isListening ? "🔴" : "🎤"}</span>
                </button>
                <p className="mt-4 text-white/70">
                  {isListening 
                    ? "Listening... speak now" 
                    : isSpeaking 
                      ? "Speaking..." 
                      : "Tap to speak"}
                </p>
                {isSpeaking && (
                  <button
                    type="button"
                    onClick={stopSpeaking}
                    className="mt-2 text-pink-400 text-sm hover:underline"
                  >
                    Stop speaking
                  </button>
                )}
              </div>

              {/* Transcript */}
              {transcript && (
                <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/50 text-xs mb-1">You said:</p>
                  <p className="text-white">&ldquo;{transcript}&rdquo;</p>
                </div>
              )}

              {/* Response */}
              {response && (
                <div className="mb-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <p className="text-purple-300 text-xs mb-1">Concierge:</p>
                  <p className="text-white">{response}</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {/* Service Recommendations */}
              {recommendations.length > 0 && (
                <div className="space-y-3">
                  <p className="text-white/50 text-sm">Recommended for you:</p>
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className={`p-4 rounded-xl border ${
                        rec.isUpsell
                          ? "bg-white/5 border-white/10"
                          : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-semibold">{rec.name}</h3>
                            {rec.isUpsell && (
                              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs">
                                Add-on
                              </span>
                            )}
                          </div>
                          <p className="text-purple-400 font-bold">{rec.price}</p>
                          <p className="text-white/60 text-sm mt-1">{rec.description}</p>
                        </div>
                        <a
                          href={rec.freshaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition ${
                            rec.isUpsell
                              ? "bg-white/10 text-white hover:bg-white/20"
                              : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                          }`}
                        >
                          {rec.isUpsell ? "Add" : "Book Now"}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              {!transcript && !response && (
                <div className="mt-6">
                  <p className="text-white/50 text-sm mb-3 text-center">Or try saying:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["I want Botox", "Weight loss options", "Book a consultation", "What are your specials?"].map((phrase) => (
                      <button
                        key={phrase}
                        type="button"
                        onClick={() => {
                          setTranscript(phrase);
                          setTimeout(() => {
                            const serviceId = detectService(phrase);
                            if (serviceId) {
                              const recs = getRecommendations(serviceId);
                              setRecommendations(recs);
                              const main = recs[0];
                              const upsells = recs.filter(r => r.isUpsell);
                              const voiceResponse = generateVoiceResponse(serviceId, main.name, upsells);
                              setResponse(voiceResponse);
                              speak(voiceResponse);
                            }
                          }, 100);
                        }}
                        className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 hover:text-white transition"
                      >
                        &ldquo;{phrase}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Call Option */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-white/50 text-sm mb-2">Prefer to talk to a human?</p>
                <a
                  href="tel:630-636-6193"
                  className="inline-flex items-center gap-2 text-pink-400 font-semibold hover:text-pink-300 transition"
                >
                  📞 Call 630-636-6193
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
