"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

const HG_PINK = "#E6007E";

type Zone = {
  id: string;
  label: string;
  top: string;
  left: string;
  tags: string[];
};

// Positions aligned with circles in hg-consult-body.png (full body)
const ZONES: Zone[] = [
  { id: "forehead", label: "Forehead", top: "10%", left: "50%", tags: ["botox", "lines", "wrinkles"] },
  { id: "temple-left", label: "Temple (Left)", top: "14%", left: "28%", tags: ["botox", "lines"] },
  { id: "temple-right", label: "Temple (Right)", top: "14%", left: "72%", tags: ["botox", "lines"] },
  { id: "lips", label: "Lips / Philtrum", top: "32%", left: "50%", tags: ["filler", "lip", "volume"] },
  { id: "chest", label: "Chest", top: "42%", left: "50%", tags: ["body", "skin"] },
  { id: "shoulder-left", label: "Shoulder (Left)", top: "38%", left: "22%", tags: ["skin", "body"] },
  { id: "shoulder-right", label: "Shoulder (Right)", top: "38%", left: "78%", tags: ["skin", "body"] },
  { id: "abdomen", label: "Abdomen", top: "52%", left: "50%", tags: ["weight-loss", "glp-1"] },
  { id: "thigh-left", label: "Thigh (Left)", top: "68%", left: "42%", tags: ["weight-loss", "body"] },
  { id: "thigh-right", label: "Thigh (Right)", top: "68%", left: "58%", tags: ["weight-loss", "body"] },
  { id: "knee-left", label: "Knee (Left)", top: "82%", left: "45%", tags: ["body"] },
  { id: "knee-right", label: "Knee (Right)", top: "82%", left: "55%", tags: ["body"] },
];

const TREATMENTS: { id: string; name: string; description: string; href: string; bookSlug: string; icon: string; tags: string[] }[] = [
  { id: "botox", name: "Botox, Dysport & Jeuveau", description: "Smooth lines", href: "/services/botox-dysport-jeuveau", bookSlug: "botox-dysport-jeuveau", icon: "💉", tags: ["botox", "lines", "wrinkles", "anti-aging"] },
  { id: "fillers", name: "Dermal Fillers", description: "Volume, contour", href: "/services/dermal-fillers", bookSlug: "dermal-fillers", icon: "💎", tags: ["filler", "volume", "contour"] },
  { id: "lip-filler", name: "Lip Enhancement", description: "Fuller lips", href: "/services/lip-filler", bookSlug: "lip-filler", icon: "💋", tags: ["filler", "lip"] },
  { id: "kybella", name: "Kybella", description: "Reduce submental fat", href: "/services/kybella", bookSlug: "kybella", icon: "✨", tags: ["kybella", "chin", "contour"] },
  { id: "weight", name: "Medical Weight Loss", description: "GLP-1 support", href: "/services/weight-loss-therapy", bookSlug: "weight-loss-therapy", icon: "⚡", tags: ["weight-loss", "glp-1", "body"] },
  { id: "microneedling", name: "RF Microneedling", description: "Texture, firmness", href: "/services/rf-microneedling", bookSlug: "rf-microneedling", icon: "🎯", tags: ["skin"] },
  { id: "iv", name: "IV Therapy", description: "Energy, wellness", href: "/services/iv-therapy", bookSlug: "iv-therapy", icon: "💧", tags: ["body"] },
  { id: "hormones", name: "Hormone Therapy", description: "Energy, vitality", href: "/services/biote-hormone-therapy", bookSlug: "biote-hormone-therapy", icon: "⚖️", tags: ["body"] },
];

type Recommendation = { id: string; name: string; description: string; href: string; bookSlug: string; icon: string; matchCount: number };

export function BodyConsultationTool({
  onScrollToBotox,
  embedded = false,
}: {
  onScrollToBotox?: () => void;
  embedded?: boolean;
}) {
  const [selectedZones, setSelectedZones] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);

  const toggleZone = (id: string) => {
    setSelectedZones((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeZone = (id: string) => {
    setSelectedZones((prev) => {
      const next = new Set(prev);
      next.delete(id);
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
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#111111] mb-2">Your Personalized Plan</h2>
            <p className="text-[#5E5E66]">
              {hasRecommendations
                ? "Based on your areas of concern, here are treatments that may help:"
                : "Book a free consultation and we'll create your plan together."}
            </p>
          </div>
          {hasRecommendations ? (
            <div className="space-y-4 mb-8">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 rounded-xl border border-[#E6007E]/20 bg-white hover:border-[#E6007E]/40 transition-all group shadow-md"
                >
                  <Link href={rec.href} className="flex flex-1 items-center gap-4 min-w-0">
                    <span className="text-3xl flex-shrink-0">{rec.icon}</span>
                    <div className="flex-1 text-left min-w-0">
                      <h3 className="text-lg font-semibold text-[#111111] group-hover:text-[#E6007E]">{rec.name}</h3>
                      <p className="text-sm text-[#5E5E66]">{rec.description}</p>
                    </div>
                    <span className="text-[#E6007E] hidden sm:inline">→</span>
                  </Link>
                  <Link
                    href={`/book/${rec.bookSlug}`}
                    className="flex-shrink-0 w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-hg-pink hover:bg-hg-pinkDeep text-white text-sm font-semibold uppercase tracking-widest rounded-md transition-all duration-300 ease-out hover:-translate-y-[2px] hover:shadow-lg"
                  >
                    Book
                  </Link>
                </div>
              ))}
            </div>
          ) : null}
          <div className="rounded-xl bg-white p-8 text-center shadow-md border border-[#E6007E]/10">
            <h3 className="text-xl font-bold text-[#111111] mb-2">Next Step: Book Your Consultation</h3>
            <p className="text-[#5E5E66] mb-6">Our specialists will create a treatment plan tailored to you.</p>
            <CTA href={BOOKING_URL}>Book Free Consultation</CTA>
          </div>
          {onScrollToBotox && hasRecommendations && (
            <button
              type="button"
              onClick={onScrollToBotox}
              className="mt-4 w-full py-3 rounded-xl border border-[#E6007E]/30 text-[#E6007E] text-sm font-medium hover:bg-[#E6007E]/5 transition"
            >
              💉 Or estimate your Botox cost →
            </button>
          )}
          <button
            onClick={() => { setShowResults(false); }}
            className="mt-6 text-[#5E5E66] hover:text-[#111111] text-sm"
          >
            ← Start over
          </button>
        </FadeUp>
      </div>
    );
  }

  const panel = (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-md h-full flex flex-col">
      <h3 className="text-lg font-bold text-[#111111] mb-4">Your Selections</h3>
      {selectedZones.size === 0 ? (
        <p className="text-[#5E5E66] text-sm mb-6">Click areas on the body to select your concerns.</p>
      ) : (
        <div className="space-y-2 mb-6 flex-1 overflow-auto max-h-48">
          {Array.from(selectedZones).map((id) => {
            const zone = ZONES.find((z) => z.id === id);
            return (
              <div
                key={id}
                className="flex items-center justify-between px-4 py-2 rounded-lg bg-[#FDF7FA] border border-[#E6007E]/20"
              >
                <span className="text-sm font-medium text-[#111111]">{zone?.label ?? id}</span>
                <button
                  type="button"
                  onClick={() => removeZone(id)}
                  className="text-[#5E5E66] hover:text-[#E6007E] text-lg leading-none"
                  aria-label={`Remove ${zone?.label}`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
      <button
        onClick={() => setShowResults(true)}
        disabled={selectedZones.size === 0}
        className="w-full py-4 rounded-md bg-[#E6007E] hover:bg-[#B0005F] disabled:bg-[#5E5E66]/40 disabled:cursor-not-allowed text-white uppercase tracking-widest text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        Get My Personalized Plan
      </button>
    </div>
  );

  const bodySection = (
    <div className="relative flex-1 min-h-[400px] md:min-h-[500px] flex items-center justify-center">
      <div className="relative w-full max-w-[280px] md:max-w-[360px] aspect-[3/5]">
        <Image
          src="/images/hg-consult-body.png"
          alt="Select areas you'd like to improve"
          fill
          sizes="(max-width: 768px) 280px, 360px"
          className="object-contain drop-shadow-lg"
        />
        {ZONES.map((zone) => (
          <button
            key={zone.id}
            type="button"
            onClick={() => toggleZone(zone.id)}
            className="absolute w-[12%] h-[12%] min-w-[32px] min-h-[32px] -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer border-0 bg-transparent"
            style={{ top: zone.top, left: zone.left }}
            aria-label={`Select ${zone.label}`}
            title={zone.label}
          />
        ))}
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch min-h-[420px]">
        <FadeUp delayMs={0} className="flex-1 min-h-[400px]">
          {bodySection}
        </FadeUp>
        <FadeUp delayMs={100} className="w-full lg:w-[340px] flex-shrink-0">
          {panel}
        </FadeUp>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col">
      <FadeUp delayMs={0}>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111] mb-2 text-center md:text-left">
          Virtual Consultation
        </h1>
        <p className="text-[#5E5E66] mb-8 text-center md:text-left">
          Click the areas you&apos;d like to improve. Your personalized treatment plan is one tap away.
        </p>
      </FadeUp>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch flex-1">
        <FadeUp delayMs={50} className="flex-1">
          {bodySection}
        </FadeUp>
        <FadeUp delayMs={100} className="w-full lg:w-[380px] flex-shrink-0">
          {panel}
        </FadeUp>
      </div>
    </div>
  );
}
