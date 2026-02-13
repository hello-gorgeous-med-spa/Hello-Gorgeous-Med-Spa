"use client";

import { useState } from "react";
import Link from "next/link";
import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

type Zone = {
  id: string;
  label: string;
  icon: string;
  tags: string[];
};

type Recommendation = {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  matchCount: number;
};

const ZONES: Zone[] = [
  { id: "forehead", label: "Forehead", icon: "〰️", tags: ["botox", "lines", "wrinkles"] },
  { id: "eyes", label: "Eyes / Crow's Feet", icon: "👁️", tags: ["botox", "lines", "anti-aging"] },
  { id: "brows", label: "Brows / Glabella", icon: "↗️", tags: ["botox", "11-lines", "frown"] },
  { id: "cheeks", label: "Cheeks", icon: "✨", tags: ["filler", "volume", "contour"] },
  { id: "lips", label: "Lips", icon: "💋", tags: ["filler", "lip", "volume"] },
  { id: "nasolabial", label: "Smile Lines", icon: "〰️", tags: ["filler", "lines", "volume"] },
  { id: "jawline", label: "Jawline", icon: "💎", tags: ["filler", "kybella", "contour"] },
  { id: "chin", label: "Chin / Neck", icon: "📐", tags: ["kybella", "filler", "contour"] },
  { id: "skin", label: "Skin Texture", icon: "🌟", tags: ["facial", "peel", "microneedling"] },
  { id: "body", label: "Weight / Body", icon: "⚡", tags: ["weight-loss", "glp-1"] },
  { id: "energy", label: "Energy / Wellness", icon: "💧", tags: ["iv", "vitamins", "hormones"] },
];

const TREATMENTS: { id: string; name: string; description: string; href: string; icon: string; tags: string[] }[] = [
  { id: "botox", name: "Botox, Dysport & Jeuveau", description: "Smooth lines, natural expression", href: "/services/botox-dysport-jeuveau", icon: "💉", tags: ["botox", "lines", "wrinkles", "11-lines", "frown", "anti-aging"] },
  { id: "fillers", name: "Dermal Fillers", description: "Volume, contour, natural enhancement", href: "/services/dermal-fillers", icon: "💎", tags: ["filler", "volume", "contour", "cheeks", "nasolabial"] },
  { id: "lip-filler", name: "Lip Enhancement", description: "Fuller, defined lips", href: "/services/lip-filler", icon: "💋", tags: ["filler", "lip", "volume"] },
  { id: "kybella", name: "Kybella", description: "Reduce submental fat", href: "/services/kybella", icon: "✨", tags: ["kybella", "chin", "contour"] },
  { id: "weight", name: "Medical Weight Loss", description: "GLP-1 support", href: "/services/weight-loss-therapy", icon: "⚡", tags: ["weight-loss", "glp-1", "body"] },
  { id: "hydrafacial", name: "HydraFacial", description: "Deep cleanse, glow", href: "/services/hydra-facial", icon: "💆", tags: ["facial", "skin", "texture"] },
  { id: "microneedling", name: "RF Microneedling", description: "Texture, scars, firmness", href: "/services/rf-microneedling", icon: "🎯", tags: ["microneedling", "skin", "texture", "peel"] },
  { id: "peels", name: "Chemical Peels", description: "Tone, clarity, radiance", href: "/services/chemical-peels", icon: "🧴", tags: ["peel", "skin", "texture"] },
  { id: "iv", name: "IV Therapy", description: "Energy, hydration, wellness", href: "/services/iv-therapy", icon: "💧", tags: ["iv", "energy", "vitamins", "wellness"] },
  { id: "hormones", name: "Hormone Therapy", description: "Energy, mood, vitality", href: "/services/biote-hormone-therapy", icon: "⚖️", tags: ["hormones", "energy", "wellness"] },
];

export function VirtualConsultation() {
  const [selectedZones, setSelectedZones] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const toggleZone = (id: string) => {
    setSelectedZones((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getRecommendations = (): Recommendation[] => {
    const tags = new Set<string>();
    selectedZones.forEach((zoneId) => {
      const zone = ZONES.find((z) => z.id === zoneId);
      if (zone) zone.tags.forEach((t) => tags.add(t));
    });

    const scored = TREATMENTS.map((t) => ({
      ...t,
      matchCount: t.tags.filter((tag) => tags.has(tag)).length,
    }));

    return scored
      .filter((t) => t.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 5)
      .map(({ matchCount, ...rest }) => ({ ...rest, matchCount }));
  };

  const recommendations = getRecommendations();
  const hasRecommendations = recommendations.length > 0;


  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Your Personalized Recommendations</h2>
            <p className="text-gray-400">
              {hasRecommendations
                ? "Based on your areas of concern, here are treatments that may help:"
                : "Book a free consultation and our team will create a personalized plan for you."}
            </p>
          </div>

          {hasRecommendations ? (
            <div className="space-y-4 mb-12">
              {recommendations.map((rec, i) => (
                <Link
                  key={rec.id}
                  href={rec.href}
                  className="block p-6 rounded-2xl border border-pink-500/20 bg-white/5 hover:bg-white/10 hover:border-pink-500/40 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{rec.icon}</span>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-white group-hover:text-pink-300">{rec.name}</h3>
                      <p className="text-sm text-gray-400">{rec.description}</p>
                    </div>
                    <span className="text-pink-500">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}

          <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-950/40 to-black p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Next Step: Book Your Consultation</h3>
            <p className="text-gray-400 mb-6">
              Our specialists will review your goals and create a treatment plan tailored to you. No pressure—just clarity.
            </p>
            <CTA href={BOOKING_URL}>Book Free Consultation</CTA>
            <p className="text-gray-500 text-sm mt-6">74 W. Washington St, Oswego, IL</p>
          </div>

          {submitted && (
            <p className="text-center text-pink-400 text-sm mt-6">We&apos;ll be in touch soon with more personalized options.</p>
          )}

          <button
            onClick={() => {
              setShowResults(false);
              setSubmitted(false);
            }}
            className="mt-8 text-gray-500 hover:text-white text-sm"
          >
            ← Start over
          </button>
        </FadeUp>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        <FadeUp>
          <p className="text-pink-400 text-sm font-medium tracking-widest uppercase mb-4">Save time</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Virtual Consultation
          </h1>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            Select your areas of concern. We&apos;ll recommend treatments tailored to you—then our team will follow up to create your personalized plan.
          </p>
        </FadeUp>
      </div>

      {/* Zone selector */}
      <FadeUp delayMs={100}>
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-400 mb-4">Tap areas you&apos;d like to address:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {ZONES.map((zone) => {
              const isSelected = selectedZones.has(zone.id);
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => toggleZone(zone.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-pink-500 bg-pink-500/20 text-white"
                      : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="text-2xl block mb-2">{zone.icon}</span>
                  <span className="text-sm font-medium">{zone.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </FadeUp>

      {/* Optional email */}
      <FadeUp delayMs={150}>
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-3">Get your results by email (optional):</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
        </div>
      </FadeUp>

      {/* Finish CTA */}
      <FadeUp delayMs={200}>
        <button
          onClick={() => {
            if (email.trim()) setSubmitted(true);
            setShowResults(true);
          }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all"
        >
          {hasRecommendations ? "See My Recommendations" : "Get Personalized Options"}
        </button>
        <p className="text-center text-gray-500 text-xs mt-4">
          We&apos;ll contact you quickly to discuss your options. No spam—ever.
        </p>
      </FadeUp>
    </div>
  );
}
