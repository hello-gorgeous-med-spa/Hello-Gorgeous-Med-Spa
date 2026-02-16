"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeUp } from "./Section";
import { BOOKING_URL } from "@/lib/flows";

const symptoms = [
  "Lack of energy and fatigue",
  "Difficulty sleeping at night",
  "Reduced mental focus and memory",
  "Feeling down, mood swings, on edge",
  "Weight gain around mid-section",
  "Inability to lose weight despite diet/exercise",
  "Decreased muscle strength",
  "Muscle and/or joint discomfort",
  "Reduced sexual desire and performance",
];

const benefits = [
  { icon: "⚡", title: "Increased Energy", description: "Strength and weight loss" },
  { icon: "🌟", title: "Feel Younger", description: "Healthier and happier" },
  { icon: "🧠", title: "Better Moods", description: "Memory and mental clarity" },
  { icon: "❤️", title: "Restored Libido", description: "Improved relationships" },
];

const labPanels = [
  "Complete Metabolic Panel",
  "Thyroid Function (TSH, T3, T4)",
  "Hormone Levels (Testosterone, Estrogen)",
  "Vitamin D & B12",
  "Lipid Panel",
  "A1C & Glucose",
];

export function BioteSection() {
  const [showFlyer, setShowFlyer] = useState(false);

  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            {/* Certified Badge */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 md:w-32 md:h-32">
                <Image
                  src="/images/biote/certified-seal.png"
                  alt="Biote Certified Provider"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-amber-400 text-lg font-medium tracking-wide">CERTIFIED BIOTE PROVIDER</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">
              Hormone{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">
                Optimization
              </span>
            </h2>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto text-lg">
              Age healthier & live happier. It starts with a simple test.
              Find out how optimized hormones may improve your energy, sleep, weight, and libido.
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Info & Benefits */}
          <FadeUp delayMs={60}>
            <div className="space-y-6">
              {/* What We Offer Card */}
              <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-black p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-amber-400">🏥</span> What We Offer
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                    <span className="text-2xl">🧪</span>
                    <div>
                      <p className="text-white font-semibold">In-Office Lab Panels</p>
                      <p className="text-white/60 text-sm">Results within 36 hours - no waiting!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                    <span className="text-2xl">💊</span>
                    <div>
                      <p className="text-white font-semibold">Biote Pellet Therapy</p>
                      <p className="text-white/60 text-sm">Bio-identical hormone replacement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                    <span className="text-2xl">📋</span>
                    <div>
                      <p className="text-white font-semibold">Prescriptions with Diagnosis</p>
                      <p className="text-white/60 text-sm">Complete care from testing to treatment</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="rounded-xl border border-amber-500/20 bg-black/50 p-4 text-center hover:border-amber-500/40 transition"
                  >
                    <span className="text-3xl block mb-2">{benefit.icon}</span>
                    <p className="text-white font-semibold text-sm">{benefit.title}</p>
                    <p className="text-white/50 text-xs">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Right Column - Pricing & Labs */}
          <FadeUp delayMs={120}>
            <div className="space-y-6">
              {/* Pricing Card */}
              <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-black p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-amber-400">💰</span> Affordable Pricing
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-black/50 border border-amber-500/20">
                    <p className="text-amber-400 font-semibold text-sm mb-1">INITIAL PACKAGE</p>
                    <p className="text-white/70 text-xs mb-2">(Consultation, Labs, First Pellet)</p>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Male</span>
                      <span className="text-2xl font-bold text-white">$900</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-white">Female</span>
                      <span className="text-2xl font-bold text-white">$650</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-amber-500/20">
                    <p className="text-amber-400 font-semibold text-sm mb-1">MAINTENANCE PELLET THERAPY</p>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Male</span>
                      <span className="text-2xl font-bold text-white">$700</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-white">Female</span>
                      <span className="text-2xl font-bold text-white">$400</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Panels */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-amber-400 font-semibold text-sm mb-3">
                  🧪 IN-OFFICE LAB PANELS INCLUDE:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {labPanels.map((panel) => (
                    <div key={panel} className="flex items-center gap-2">
                      <span className="text-amber-400 text-xs">✓</span>
                      <span className="text-white/70 text-xs">{panel}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-amber-400/80 text-xs font-medium">
                  ⚡ Results in 36 hours or less!
                </p>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Symptoms Section */}
        <FadeUp delayMs={180}>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-amber-950/20 via-black to-amber-950/20 p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-white text-center mb-6">
              Before Being Optimized, Patients Often Complain Of:
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="px-4 py-2 rounded-full bg-black/50 border border-white/10 text-white/70 text-sm"
                >
                  • {symptom}
                </span>
              ))}
            </div>
            <p className="text-center mt-6 text-white/60 text-sm">
              Sound familiar? Hormone optimization may help.
            </p>
          </div>
        </FadeUp>

        {/* CTAs */}
        <FadeUp delayMs={240}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-full hover:opacity-90 transition shadow-lg shadow-amber-500/25"
            >
              Schedule Hormone Consultation
            </a>
            <a
              href="tel:630-636-6193"
              className="px-8 py-4 border border-amber-500/30 text-white font-semibold rounded-full hover:bg-amber-500/10 transition"
            >
              📞 Call 630-636-6193
            </a>
            <button
              type="button"
              onClick={() => setShowFlyer(true)}
              className="px-8 py-4 border border-white/20 text-white/70 font-semibold rounded-full hover:bg-white/5 transition"
            >
              📄 View Info Sheet
            </button>
          </div>
        </FadeUp>

        {/* Disclaimer */}
        <FadeUp delayMs={300}>
          <p className="mt-8 text-center text-xs text-black max-w-2xl mx-auto">
            *These statements have not been evaluated by the Food and Drug Administration. 
            This product is not intended to diagnose, treat, cure, or prevent any disease. 
            Results may vary by individual.
          </p>
        </FadeUp>
      </div>

      {/* Flyer Modal */}
      {showFlyer && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowFlyer(false)}
        >
          <button
            type="button"
            onClick={() => setShowFlyer(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 text-white text-2xl flex items-center justify-center hover:bg-white/20 transition z-10"
          >
            ✕
          </button>
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src="/images/biote/info-flyer.png"
              alt="Biote Hormone Therapy Information"
              width={800}
              height={1400}
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
