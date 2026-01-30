"use client";

import { useState } from "react";
import { FadeUp } from "./Section";

type TreatmentArea = {
  id: string;
  name: string;
  units: { min: number; max: number };
  position: { top: string; left: string };
  description: string;
};

const PRICE_PER_UNIT = 10;

const treatmentAreas: TreatmentArea[] = [
  {
    id: "forehead",
    name: "Forehead Lines",
    units: { min: 10, max: 20 },
    position: { top: "12%", left: "50%" },
    description: "Smooth horizontal forehead lines",
  },
  {
    id: "glabella",
    name: "Frown Lines (11s)",
    units: { min: 15, max: 25 },
    position: { top: "22%", left: "50%" },
    description: "Between the eyebrows",
  },
  {
    id: "brow-lift-left",
    name: "Brow Lift (Left)",
    units: { min: 2, max: 5 },
    position: { top: "20%", left: "30%" },
    description: "Subtle lift to outer brow",
  },
  {
    id: "brow-lift-right",
    name: "Brow Lift (Right)",
    units: { min: 2, max: 5 },
    position: { top: "20%", left: "70%" },
    description: "Subtle lift to outer brow",
  },
  {
    id: "crows-feet-left",
    name: "Crow's Feet (Left)",
    units: { min: 8, max: 12 },
    position: { top: "32%", left: "18%" },
    description: "Lines around outer eye",
  },
  {
    id: "crows-feet-right",
    name: "Crow's Feet (Right)",
    units: { min: 8, max: 12 },
    position: { top: "32%", left: "82%" },
    description: "Lines around outer eye",
  },
  {
    id: "bunny-lines",
    name: "Bunny Lines",
    units: { min: 4, max: 8 },
    position: { top: "42%", left: "50%" },
    description: "Lines on the nose bridge",
  },
  {
    id: "lip-flip",
    name: "Lip Flip",
    units: { min: 4, max: 6 },
    position: { top: "62%", left: "50%" },
    description: "Subtle upper lip enhancement",
  },
  {
    id: "lip-lines",
    name: "Lip Lines (Smoker's Lines)",
    units: { min: 4, max: 8 },
    position: { top: "68%", left: "50%" },
    description: "Vertical lines around lips",
  },
  {
    id: "chin",
    name: "Chin Dimpling",
    units: { min: 4, max: 8 },
    position: { top: "78%", left: "50%" },
    description: "Smooth orange peel texture",
  },
  {
    id: "masseter-left",
    name: "Masseter (Left)",
    units: { min: 20, max: 30 },
    position: { top: "55%", left: "22%" },
    description: "Jaw slimming / TMJ relief",
  },
  {
    id: "masseter-right",
    name: "Masseter (Right)",
    units: { min: 20, max: 30 },
    position: { top: "55%", left: "78%" },
    description: "Jaw slimming / TMJ relief",
  },
  {
    id: "neck-bands",
    name: "Neck Bands",
    units: { min: 20, max: 40 },
    position: { top: "92%", left: "50%" },
    description: "Platysmal bands on neck",
  },
];

export function BotoxCalculator() {
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set());
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const toggleArea = (areaId: string) => {
    const newSelected = new Set(selectedAreas);
    if (newSelected.has(areaId)) {
      newSelected.delete(areaId);
    } else {
      newSelected.add(areaId);
    }
    setSelectedAreas(newSelected);
  };

  const calculateTotal = () => {
    let minUnits = 0;
    let maxUnits = 0;

    selectedAreas.forEach((areaId) => {
      const area = treatmentAreas.find((a) => a.id === areaId);
      if (area) {
        minUnits += area.units.min;
        maxUnits += area.units.max;
      }
    });

    return {
      minUnits,
      maxUnits,
      minPrice: minUnits * PRICE_PER_UNIT,
      maxPrice: maxUnits * PRICE_PER_UNIT,
    };
  };

  const totals = calculateTotal();
  const hoveredAreaData = hoveredArea
    ? treatmentAreas.find((a) => a.id === hoveredArea)
    : null;

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-black via-pink-950/10 to-black">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium mb-4">
              💉 Interactive Tool
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Botox{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                Price Calculator
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Tap the areas you&apos;d like to treat and get an instant estimate.
              Final pricing determined during consultation.
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Face Diagram */}
          <FadeUp delayMs={60}>
            <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-3xl p-6 border border-pink-500/20">
              <div className="relative w-full max-w-sm mx-auto aspect-[3/4]">
                {/* Face outline SVG */}
                <svg
                  viewBox="0 0 200 280"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Face shape */}
                  <ellipse
                    cx="100"
                    cy="120"
                    rx="70"
                    ry="90"
                    stroke="rgba(236, 72, 153, 0.3)"
                    strokeWidth="2"
                    fill="rgba(236, 72, 153, 0.05)"
                  />
                  {/* Hairline */}
                  <path
                    d="M30 90 Q100 20 170 90"
                    stroke="rgba(236, 72, 153, 0.2)"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Left eyebrow */}
                  <path
                    d="M50 85 Q70 75 90 85"
                    stroke="rgba(236, 72, 153, 0.4)"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Right eyebrow */}
                  <path
                    d="M110 85 Q130 75 150 85"
                    stroke="rgba(236, 72, 153, 0.4)"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Left eye */}
                  <ellipse
                    cx="70"
                    cy="100"
                    rx="15"
                    ry="8"
                    stroke="rgba(236, 72, 153, 0.3)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  {/* Right eye */}
                  <ellipse
                    cx="130"
                    cy="100"
                    rx="15"
                    ry="8"
                    stroke="rgba(236, 72, 153, 0.3)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  {/* Nose */}
                  <path
                    d="M100 105 L100 140 L90 145 Q100 150 110 145 L100 140"
                    stroke="rgba(236, 72, 153, 0.3)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  {/* Lips */}
                  <path
                    d="M80 170 Q100 165 120 170"
                    stroke="rgba(236, 72, 153, 0.4)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M80 170 Q100 180 120 170"
                    stroke="rgba(236, 72, 153, 0.4)"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Chin line */}
                  <path
                    d="M70 195 Q100 220 130 195"
                    stroke="rgba(236, 72, 153, 0.2)"
                    strokeWidth="1"
                    fill="none"
                  />
                  {/* Neck */}
                  <path
                    d="M70 210 L70 260 M130 210 L130 260"
                    stroke="rgba(236, 72, 153, 0.2)"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Clickable treatment points */}
                {treatmentAreas.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggleArea(area.id)}
                    onMouseEnter={() => setHoveredArea(area.id)}
                    onMouseLeave={() => setHoveredArea(null)}
                    className={`absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300 flex items-center justify-center text-xs font-bold ${
                      selectedAreas.has(area.id)
                        ? "bg-pink-500 border-pink-400 text-white scale-110 shadow-lg shadow-pink-500/50"
                        : "bg-black/50 border-pink-500/50 text-pink-400 hover:bg-pink-500/20 hover:scale-110"
                    }`}
                    style={{ top: area.position.top, left: area.position.left }}
                    aria-label={area.name}
                  >
                    {selectedAreas.has(area.id) ? "✓" : "+"}
                  </button>
                ))}
              </div>

              {/* Hover tooltip */}
              {hoveredAreaData && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/90 rounded-xl p-4 border border-pink-500/30">
                  <p className="text-white font-semibold">{hoveredAreaData.name}</p>
                  <p className="text-gray-400 text-sm">{hoveredAreaData.description}</p>
                  <p className="text-pink-400 text-sm mt-1">
                    {hoveredAreaData.units.min}-{hoveredAreaData.units.max} units •{" "}
                    ${hoveredAreaData.units.min * PRICE_PER_UNIT}-$
                    {hoveredAreaData.units.max * PRICE_PER_UNIT}
                  </p>
                </div>
              )}
            </div>
          </FadeUp>

          {/* Summary Panel */}
          <FadeUp delayMs={120}>
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-3xl p-6 border border-pink-500/20 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">
                Your Estimate
              </h3>

              {/* Selected areas list */}
              <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                {selectedAreas.size === 0 ? (
                  <p className="text-gray-500 text-sm italic">
                    Tap areas on the face to add treatments
                  </p>
                ) : (
                  Array.from(selectedAreas).map((areaId) => {
                    const area = treatmentAreas.find((a) => a.id === areaId);
                    if (!area) return null;
                    return (
                      <div
                        key={area.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-pink-500/10 border border-pink-500/20"
                      >
                        <div>
                          <p className="text-white text-sm font-medium">
                            {area.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {area.units.min}-{area.units.max} units
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-pink-400 font-semibold">
                            ${area.units.min * PRICE_PER_UNIT}-$
                            {area.units.max * PRICE_PER_UNIT}
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleArea(area.id)}
                            className="text-gray-500 text-xs hover:text-red-400 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 my-4" />

              {/* Total */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Total Units</span>
                  <span>
                    {totals.minUnits === totals.maxUnits
                      ? totals.minUnits
                      : `${totals.minUnits}-${totals.maxUnits}`}{" "}
                    units
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Price per Unit</span>
                  <span>${PRICE_PER_UNIT}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-white">Estimated Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                    {selectedAreas.size === 0
                      ? "$0"
                      : totals.minPrice === totals.maxPrice
                      ? `$${totals.minPrice}`
                      : `$${totals.minPrice} - $${totals.maxPrice}`}
                  </span>
                </div>
              </div>

              {/* Savings callout */}
              {selectedAreas.size >= 3 && (
                <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-green-400 text-sm font-medium">
                    💡 Tip: Ask about our multi-area discount!
                  </p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3">
                <a
                  href="https://fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold text-center hover:opacity-90 transition"
                >
                  Book Free Consultation →
                </a>
                <a
                  href="tel:630-636-6193"
                  className="block w-full py-3 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-center hover:bg-white/10 transition"
                >
                  📞 Call 630-636-6193
                </a>
              </div>

              {/* Disclaimer */}
              <p className="mt-4 text-gray-500 text-xs text-center">
                * Estimates based on average units. Final pricing determined by
                provider based on your unique anatomy and goals.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* Popular packages */}
        <FadeUp delayMs={180}>
          <div className="mt-12">
            <h3 className="text-xl font-bold text-white text-center mb-6">
              Popular Treatment Packages
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  name: "The Refresher",
                  areas: ["forehead", "glabella"],
                  description: "Forehead + Frown Lines",
                  popular: false,
                },
                {
                  name: "The Full Face",
                  areas: ["forehead", "glabella", "crows-feet-left", "crows-feet-right"],
                  description: "Forehead + Frown + Crow's Feet",
                  popular: true,
                },
                {
                  name: "The Jaw Slimmer",
                  areas: ["masseter-left", "masseter-right"],
                  description: "Both Masseters for V-line",
                  popular: false,
                },
              ].map((pkg) => {
                const pkgTotal = pkg.areas.reduce((acc, areaId) => {
                  const area = treatmentAreas.find((a) => a.id === areaId);
                  return acc + (area ? area.units.min * PRICE_PER_UNIT : 0);
                }, 0);

                return (
                  <button
                    key={pkg.name}
                    type="button"
                    onClick={() => setSelectedAreas(new Set(pkg.areas))}
                    className={`relative p-4 rounded-xl border text-left transition hover:scale-[1.02] ${
                      pkg.popular
                        ? "bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/30"
                        : "bg-white/5 border-white/10 hover:border-pink-500/30"
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-pink-500 text-white text-xs font-medium">
                        Popular
                      </span>
                    )}
                    <h4 className="text-white font-semibold">{pkg.name}</h4>
                    <p className="text-gray-400 text-sm">{pkg.description}</p>
                    <p className="text-pink-400 font-bold mt-2">
                      Starting at ${pkgTotal}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
