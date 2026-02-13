"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { CTA } from "@/components/CTA";
import { BOOKING_URL } from "@/lib/flows";

type BodyZone = {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  concerns: { id: string; label: string; tags: string[] }[];
};

const BODY_ZONES: BodyZone[] = [
  { id: "forehead", label: "Forehead", x: 50, y: 18, r: 12, concerns: [{ id: "forehead-lines", label: "Forehead Lines", tags: ["botox"] }, { id: "frown", label: "Frown Lines (11s)", tags: ["botox"] }] },
  { id: "eyes", label: "Eyes", x: 50, y: 35, r: 14, concerns: [{ id: "crows", label: "Crow's Feet", tags: ["botox"] }, { id: "hooded", label: "Hooded Eyelids", tags: ["botox"] }, { id: "dark-circles", label: "Dark Circles", tags: ["filler"] }] },
  { id: "cheeks", label: "Cheeks", x: 50, y: 52, r: 12, concerns: [{ id: "volume", label: "Loss of Volume", tags: ["filler"] }, { id: "contour", label: "Want More Contour", tags: ["filler"] }] },
  { id: "lips", label: "Lips", x: 50, y: 65, r: 10, concerns: [{ id: "thin-lips", label: "Thin / Uneven Lips", tags: ["filler"] }, { id: "lip-lines", label: "Lip Lines", tags: ["botox", "filler"] }] },
  { id: "jaw", label: "Jawline", x: 50, y: 78, r: 11, concerns: [{ id: "jaw-definition", label: "Want Definition", tags: ["filler", "kybella"] }, { id: "jowls", label: "Jowls / Laxity", tags: ["filler"] }] },
  { id: "chin", label: "Chin / Neck", x: 50, y: 92, r: 10, concerns: [{ id: "double-chin", label: "Double Chin", tags: ["kybella"] }, { id: "neck-bands", label: "Neck Bands", tags: ["botox"] }] },
  { id: "skin", label: "Skin", x: 82, y: 52, r: 8, concerns: [{ id: "texture", label: "Texture / Pores", tags: ["microneedling", "peel"] }, { id: "acne", label: "Acne / Scars", tags: ["microneedling", "peel"] }, { id: "dull", label: "Dull / Uneven Tone", tags: ["facial", "peel"] }] },
  { id: "body", label: "Body", x: 18, y: 65, r: 8, concerns: [{ id: "weight", label: "Weight Goals", tags: ["weight-loss"] }, { id: "energy", label: "Low Energy", tags: ["iv", "hormones"] }] },
];

const CONCERN_TO_TREATMENT: Record<string, { name: string; href: string; icon: string }[]> = {
  "forehead-lines": [{ name: "Botox, Dysport & Jeuveau", href: "/services/botox-dysport-jeuveau", icon: "💉" }],
  frown: [{ name: "Botox, Dysport & Jeuveau", href: "/services/botox-dysport-jeuveau", icon: "💉" }],
  crows: [{ name: "Botox, Dysport & Jeuveau", href: "/services/botox-dysport-jeuveau", icon: "💉" }],
  hooded: [{ name: "Botox Brow Lift", href: "/services/botox-dysport-jeuveau", icon: "💉" }],
  "dark-circles": [{ name: "Dermal Fillers", href: "/services/dermal-fillers", icon: "💎" }],
  volume: [{ name: "Dermal Fillers", href: "/services/dermal-fillers", icon: "💎" }],
  contour: [{ name: "Dermal Fillers", href: "/services/dermal-fillers", icon: "💎" }],
  "thin-lips": [{ name: "Lip Enhancement", href: "/services/lip-filler", icon: "💋" }],
  "lip-lines": [{ name: "Botox Lip Flip + Fillers", href: "/services/lip-filler", icon: "💋" }],
  "jaw-definition": [{ name: "Kybella / Fillers", href: "/services/kybella", icon: "✨" }],
  jowls: [{ name: "Dermal Fillers", href: "/services/dermal-fillers", icon: "💎" }],
  "double-chin": [{ name: "Kybella", href: "/services/kybella", icon: "✨" }],
  "neck-bands": [{ name: "Botox", href: "/services/botox-dysport-jeuveau", icon: "💉" }],
  texture: [{ name: "RF Microneedling", href: "/services/rf-microneedling", icon: "🎯" }],
  acne: [{ name: "Chemical Peels / PRP Facial", href: "/services/rf-microneedling", icon: "🎯" }],
  dull: [{ name: "HydraFacial / Chemical Peel", href: "/services/hydra-facial", icon: "💆" }],
  weight: [{ name: "Medical Weight Loss", href: "/services/weight-loss-therapy", icon: "⚡" }],
  energy: [{ name: "IV Therapy / Hormones", href: "/services/iv-therapy", icon: "💧" }],
};

export function InteractiveConsultationWidget({ onScrollToBotox }: { onScrollToBotox?: () => void }) {
  const [activeZone, setActiveZone] = useState<BodyZone | null>(null);
  const [selectedConcerns, setSelectedConcerns] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const botoxRef = useRef<HTMLDivElement>(null);

  const toggleConcern = (id: string) => {
    setSelectedConcerns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeConcern = (id: string) => {
    setSelectedConcerns((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const getRecommendations = () => {
    const recs: { name: string; href: string; icon: string }[] = [];
    const seen = new Set<string>();
    selectedConcerns.forEach((cid) => {
      const treatments = CONCERN_TO_TREATMENT[cid];
      treatments?.forEach((t) => {
        if (!seen.has(t.name)) {
          seen.add(t.name);
          recs.push(t);
        }
      });
    });
    return recs;
  };

  const recommendations = getRecommendations();

  if (showResults) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto">
          <h3 className="text-lg font-bold text-white mb-4">Your Personalized Plan</h3>
          {recommendations.length > 0 ? (
            <div className="space-y-3 mb-4">
              {recommendations.map((r) => (
                <Link
                  key={r.name}
                  href={r.href}
                  className="block p-4 rounded-xl border border-pink-500/20 bg-white/5 hover:bg-pink-500/10 hover:border-pink-500/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{r.icon}</span>
                    <span className="text-white font-medium group-hover:text-pink-300">{r.name}</span>
                    <span className="ml-auto text-pink-500">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mb-4">Book a free consultation and we&apos;ll create your plan together.</p>
          )}
          <div className="space-y-3">
            <CTA href={BOOKING_URL} variant="gradient" className="w-full justify-center">Book Free Consultation</CTA>
            {onScrollToBotox && (
              <button
                type="button"
                onClick={onScrollToBotox}
                className="w-full py-3 rounded-xl border border-white/20 text-white/80 text-sm font-medium hover:bg-white/5 hover:text-white transition"
              >
                💉 Or estimate your Botox cost →
              </button>
            )}
          </div>
        </div>
        <button onClick={() => setShowResults(false)} className="mt-4 text-gray-500 hover:text-white text-sm">← Start over</button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Instructions */}
      <p className="text-xs text-gray-400 mb-4">
        Click a body part → select your concerns → get your plan
      </p>

      {/* Body map + Panel */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Face/Body diagram */}
        <div className="flex-shrink-0 w-36 md:w-44">
          <svg viewBox="0 0 100 100" className="w-full h-auto aspect-square">
            <ellipse cx="50" cy="50" rx="38" ry="45" fill="rgba(236,72,153,0.08)" stroke="rgba(236,72,153,0.25)" strokeWidth="1.5" />
            <path d="M18 35 Q50 12 82 35" stroke="rgba(236,72,153,0.2)" strokeWidth="1" fill="none" />
            <ellipse cx="35" cy="38" rx="8" ry="5" stroke="rgba(236,72,153,0.3)" strokeWidth="1" fill="none" />
            <ellipse cx="65" cy="38" rx="8" ry="5" stroke="rgba(236,72,153,0.3)" strokeWidth="1" fill="none" />
            <path d="M50 42 L50 58 M45 62 Q50 65 55 62" stroke="rgba(236,72,153,0.3)" strokeWidth="1" fill="none" />
            {BODY_ZONES.map((zone) => {
              const isActive = activeZone?.id === zone.id;
              return (
                <g key={zone.id}>
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={zone.r}
                    fill={isActive ? "rgba(236,72,153,0.4)" : "rgba(236,72,153,0.15)"}
                    stroke={isActive ? "rgb(236,72,153)" : "rgba(236,72,153,0.4)"}
                    strokeWidth={isActive ? 2 : 1}
                    className="cursor-pointer hover:fill-pink-500/30 transition-colors"
                    onClick={() => setActiveZone(zone)}
                  />
                  {isActive && <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />}
                </g>
              );
            })}
          </svg>
          <p className="text-center text-gray-500 text-xs mt-2">Tap an area</p>
        </div>

        {/* Right panel - Concerns or Selections */}
        <div className="flex-1 min-w-0 flex flex-col">
          {activeZone ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold text-sm">{activeZone.label} Concerns</h4>
                <button onClick={() => setActiveZone(null)} className="text-gray-500 hover:text-white text-xs">✕</button>
              </div>
              <div className="space-y-2 mb-4 flex-1 overflow-auto">
                {activeZone.concerns.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleConcern(c.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedConcerns.has(c.id)
                        ? "bg-pink-500/30 border border-pink-500/50 text-white"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {selectedConcerns.has(c.id) ? "✓ " : ""}{c.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-gray-500 text-sm mb-3">Your selections ({selectedConcerns.size})</p>
              {selectedConcerns.size === 0 ? (
                <p className="text-gray-600 text-xs">Click a body part to get started</p>
              ) : (
                <div className="space-y-1 max-h-32 overflow-auto">
                  {Array.from(selectedConcerns).map((cid) => {
                    const label = BODY_ZONES.flatMap((z) => z.concerns).find((c) => c.id === cid)?.label || cid;
                    return (
                      <div key={cid} className="flex items-center justify-between px-3 py-1.5 rounded bg-white/5 text-white text-xs">
                        <span>{label}</span>
                        <button type="button" onClick={() => removeConcern(cid)} className="text-gray-500 hover:text-red-400">×</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setShowResults(true)}
            disabled={selectedConcerns.size === 0}
            className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-pink-500/25 transition"
          >
            Get My Treatment Plan
          </button>
        </div>
      </div>
    </div>
  );
}
