"use client";

import Link from "next/link";

const features = [
  { number: "01", title: "Precision Dose Planning" },
  { number: "02", title: "Visual Lip Simulation" },
  { number: "03", title: "Secure Digital Consult" },
  { number: "04", title: "Intelligent Charting" },
];

export function InnovationSection() {
  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Intelligence Behind{" "}
            <span className="text-[#E6007E]">Every Treatment</span>
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left - Visual Mockups */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#E6007E] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Botox Calculator</h3>
                  <p className="text-white/60 text-sm">Precision dose planning</p>
                </div>
              </div>
              <div className="h-px bg-white/10" />
              <p className="mt-4 text-white/70 text-sm">
                AI-powered unit calculation based on your unique facial anatomy and treatment goals.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#E6007E] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Lip Studio</h3>
                  <p className="text-white/60 text-sm">Visual lip simulation</p>
                </div>
              </div>
              <div className="h-px bg-white/10" />
              <p className="mt-4 text-white/70 text-sm">
                See your potential results before treatment with our advanced lip visualization technology.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#E6007E] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Virtual Consult</h3>
                  <p className="text-white/60 text-sm">Secure digital consultation</p>
                </div>
              </div>
              <div className="h-px bg-white/10" />
              <p className="mt-4 text-white/70 text-sm">
                Connect with our team from anywhere with HIPAA-compliant virtual consultations.
              </p>
            </div>
          </div>

          {/* Right - Features List */}
          <div className="space-y-8">
            {features.map((feature) => (
              <div key={feature.number} className="flex items-center gap-6">
                <span className="text-[#E6007E] text-2xl font-semibold w-12">
                  {feature.number}
                </span>
                <span className="text-white text-xl font-medium">
                  {feature.title}
                </span>
              </div>
            ))}

            <div className="pt-8">
              <Link
                href="/care-engine"
                className="inline-flex items-center justify-center bg-[#E6007E] text-white px-8 py-4 rounded-lg font-semibold uppercase tracking-wide hover:opacity-90 transition-all duration-300 hover:scale-[1.03]"
              >
                Explore Our Technology
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
