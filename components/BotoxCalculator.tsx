"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeUp } from "./Section";
import { BOOKING_URL } from "@/lib/flows";

type TreatmentArea = {
  id: string;
  name: string;
  units: { min: number; max: number };
  position: { top: string; left: string };
  description: string;
};

const PRICE_PER_UNIT = 10;

// Positions aligned with circles in hg-botox-face-neck.png
const treatmentAreas: TreatmentArea[] = [
  { id: "forehead", name: "Forehead Lines", units: { min: 10, max: 20 }, position: { top: "14%", left: "50%" }, description: "Smooth horizontal forehead lines" },
  { id: "glabella", name: "Frown Lines (11s)", units: { min: 15, max: 25 }, position: { top: "24%", left: "50%" }, description: "Between the eyebrows" },
  { id: "brow-lift-left", name: "Brow Lift (Left)", units: { min: 2, max: 5 }, position: { top: "20%", left: "32%" }, description: "Subtle lift to outer brow" },
  { id: "brow-lift-right", name: "Brow Lift (Right)", units: { min: 2, max: 5 }, position: { top: "20%", left: "68%" }, description: "Subtle lift to outer brow" },
  { id: "crows-feet-left", name: "Crow's Feet (Left)", units: { min: 8, max: 12 }, position: { top: "30%", left: "24%" }, description: "Lines around outer eye" },
  { id: "crows-feet-right", name: "Crow's Feet (Right)", units: { min: 8, max: 12 }, position: { top: "30%", left: "76%" }, description: "Lines around outer eye" },
  { id: "bunny-lines", name: "Bunny Lines", units: { min: 4, max: 8 }, position: { top: "40%", left: "50%" }, description: "Lines on the nose bridge" },
  { id: "lip-flip", name: "Lip Flip", units: { min: 4, max: 6 }, position: { top: "52%", left: "50%" }, description: "Subtle upper lip enhancement" },
  { id: "lip-lines", name: "Lip Lines (Smoker's Lines)", units: { min: 4, max: 8 }, position: { top: "56%", left: "50%" }, description: "Vertical lines around lips" },
  { id: "dao", name: "DAO (Mouth Corners)", units: { min: 4, max: 8 }, position: { top: "54%", left: "50%" }, description: "Lift downturned mouth corners" },
  { id: "chin", name: "Chin Dimpling", units: { min: 4, max: 8 }, position: { top: "62%", left: "50%" }, description: "Smooth orange peel texture" },
  { id: "masseter-left", name: "Masseter (Left)", units: { min: 20, max: 30 }, position: { top: "58%", left: "28%" }, description: "Jaw slimming / TMJ relief" },
  { id: "masseter-right", name: "Masseter (Right)", units: { min: 20, max: 30 }, position: { top: "58%", left: "72%" }, description: "Jaw slimming / TMJ relief" },
  { id: "platysma-left", name: "Platysma Bands (Left)", units: { min: 10, max: 20 }, position: { top: "80%", left: "38%" }, description: "Neck bands left side" },
  { id: "platysma-right", name: "Platysma Bands (Right)", units: { min: 10, max: 20 }, position: { top: "80%", left: "62%" }, description: "Neck bands right side" },
];

export function BotoxCalculator({ embedded = false }: { embedded?: boolean }) {
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

  const gridClass = embedded ? "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full min-h-0" : "grid lg:grid-cols-2 gap-8 items-start";
  const panelClass = "bg-white rounded-xl p-6 md:p-8 shadow-md border border-[#EAE4E8] flex-1";

  const innerContent = (
    <div className={gridClass}>
      {/* Face + Neck Image */}
      <FadeUp delayMs={embedded ? 0 : 60}>
        <div className="relative rounded-xl overflow-hidden bg-[#FDF7FA]">
          <div className="relative w-full max-w-sm mx-auto aspect-[3/4] min-h-[320px] md:min-h-[400px]">
            <Image
              src="/images/hg-botox-face-neck.png"
              alt="Select Botox treatment areas"
              fill
              sizes="(max-width: 768px) 320px, 400px"
              className="object-contain"
            />
            {treatmentAreas.map((area) => (
              <button
                key={area.id}
                type="button"
                onClick={() => toggleArea(area.id)}
                onMouseEnter={() => setHoveredArea(area.id)}
                onMouseLeave={() => setHoveredArea(null)}
                className="absolute w-[14%] h-[14%] min-w-[36px] min-h-[36px] -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer border-0 bg-transparent"
                style={{ top: area.position.top, left: area.position.left }}
                aria-label={`Select ${area.name}`}
                title={area.name}
              />
            ))}
          </div>
          {hoveredAreaData && (
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg border border-[#EAE4E8]">
              <p className="text-[#111111] font-semibold">{hoveredAreaData.name}</p>
              <p className="text-[#5E5E66] text-sm">{hoveredAreaData.description}</p>
              <p className="text-[#E6007E] text-sm mt-1">
                {hoveredAreaData.units.min}-{hoveredAreaData.units.max} units • $
                {hoveredAreaData.units.min * PRICE_PER_UNIT}-${hoveredAreaData.units.max * PRICE_PER_UNIT}
              </p>
            </div>
          )}
        </div>
      </FadeUp>

      {/* Estimate Panel */}
      <FadeUp delayMs={embedded ? 0 : 120}>
        <div className={`${panelClass} ${!embedded ? "lg:sticky lg:top-24" : ""}`}>
          <h3 className="text-xl font-bold text-[#111111] mb-4">Your Estimate</h3>

          <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
            {selectedAreas.size === 0 ? (
              <p className="text-[#5E5E66] text-sm italic">Tap areas on the face to add treatments</p>
            ) : (
              Array.from(selectedAreas).map((areaId) => {
                const area = treatmentAreas.find((a) => a.id === areaId);
                if (!area) return null;
                return (
                  <div
                    key={area.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#FDF7FA] border border-[#E6007E]/20"
                  >
                    <div>
                      <p className="text-[#111111] text-sm font-medium">{area.name}</p>
                      <p className="text-[#5E5E66] text-xs">{area.units.min}-{area.units.max} units</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#E6007E] font-semibold">
                        ${area.units.min * PRICE_PER_UNIT}-${area.units.max * PRICE_PER_UNIT}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleArea(area.id)}
                        className="text-[#5E5E66] text-xs hover:text-[#E6007E] transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-[#EAE4E8] my-4" />

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-[#5E5E66]">
              <span>Total Units</span>
              <span>
                {totals.minUnits === totals.maxUnits ? totals.minUnits : `${totals.minUnits}-${totals.maxUnits}`} units
              </span>
            </div>
            <div className="flex justify-between text-[#5E5E66]">
              <span>Price per Unit</span>
              <span>${PRICE_PER_UNIT}</span>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span className="text-[#111111]">Estimated Total</span>
              <span className="text-[#E6007E]">
                {selectedAreas.size === 0 ? "$0" : totals.minPrice === totals.maxPrice ? `$${totals.minPrice}` : `$${totals.minPrice} - $${totals.maxPrice}`}
              </span>
            </div>
          </div>

          {selectedAreas.size >= 3 && (
            <div className="mb-6 p-3 rounded-lg bg-[#E6007E]/10 border border-[#E6007E]/20">
              <p className="text-[#E6007E] text-sm font-medium">💡 Tip: Ask about our multi-area discount!</p>
            </div>
          )}

          <div className="space-y-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 px-6 rounded-md bg-[#E6007E] hover:bg-[#B0005F] text-white font-semibold text-center uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get My Botox Consultation
            </a>
            <a
              href="tel:630-636-6193"
              className="block w-full py-3 px-6 rounded-md bg-white border border-[#EAE4E8] text-[#111111] font-medium text-center hover:bg-[#FDF7FA] transition"
            >
              📞 Call 630-636-6193
            </a>
          </div>

          <p className="mt-4 text-[#5E5E66] text-xs text-center">
            * Estimates based on average units. Final pricing determined by provider based on your unique anatomy and goals.
          </p>
        </div>
      </FadeUp>
    </div>
  );

  if (embedded) {
    return (
      <div className="h-full min-h-[420px] flex flex-col rounded-2xl border border-[#E6007E]/15 bg-white p-6 overflow-hidden shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">💉</span>
          <h3 className="text-xl font-bold text-[#111111]">Botox Price Calculator</h3>
        </div>
        <p className="text-[#5E5E66] text-sm mb-4">
          Tap the areas you&apos;d like to treat and get an instant estimate.
        </p>
        <div className="flex-1 min-h-0 overflow-auto">
          {innerContent}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 md:px-6 bg-[#FDF7FA]">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full bg-[#E6007E]/15 text-[#E6007E] text-sm font-medium mb-4">
              💉 Interactive Tool
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#111111] mb-3">
              Botox{" "}
              <span className="text-[#E6007E]">Price Calculator</span>
            </h2>
            <p className="text-[#5E5E66] max-w-xl mx-auto">
              Tap the areas you&apos;d like to treat and get an instant estimate.
              Final pricing determined during consultation.
            </p>
          </div>
        </FadeUp>
        {innerContent}
        <FadeUp delayMs={180}>
          <div className="mt-12">
            <h3 className="text-xl font-bold text-[#111111] text-center mb-6">
              Popular Treatment Packages
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: "The Refresher", areas: ["forehead", "glabella"], description: "Forehead + Frown Lines", popular: false },
                { name: "The Full Face", areas: ["forehead", "glabella", "crows-feet-left", "crows-feet-right"], description: "Forehead + Frown + Crow's Feet", popular: true },
                { name: "The Jaw Slimmer", areas: ["masseter-left", "masseter-right"], description: "Both Masseters for V-line", popular: false },
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
                      pkg.popular ? "bg-[#E6007E]/10 border-[#E6007E]/30" : "bg-white border-[#EAE4E8] hover:border-[#E6007E]/30"
                    }`}
                  >
                    {pkg.popular && <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#E6007E] text-white text-xs font-medium">Popular</span>}
                    <h4 className="text-[#111111] font-semibold">{pkg.name}</h4>
                    <p className="text-[#5E5E66] text-sm">{pkg.description}</p>
                    <p className="text-[#E6007E] font-bold mt-2">Starting at ${pkgTotal}</p>
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
