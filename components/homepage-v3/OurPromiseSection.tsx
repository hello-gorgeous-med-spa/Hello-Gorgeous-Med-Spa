"use client";

import Link from "next/link";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";

const VENDORS = [
  { name: "InMode", type: "Class IV Lasers", investment: "$500K+" },
  { name: "Allergan", type: "Botox & Juvéderm", investment: "Direct Account" },
  { name: "Galderma", type: "Dysport & Restylane", investment: "Direct Account" },
  { name: "Evolus", type: "Jeuveau", investment: "Direct Account" },
  { name: "McKesson", type: "Medical Supplies", investment: "Verified" },
  { name: "Olympia", type: "Rx Pharmacy", investment: "503A/503B" },
];

export function OurPromiseSection() {
  return (
    <Section className="relative overflow-hidden border-t-4 border-b-4 border-black bg-black py-16 lg:py-20">
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 30%, #E6007E 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 80% 70%, #FF2D8E 0%, transparent 45%)
          `,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Message */}
          <FadeUp>
            <div className="text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#E6007E]/20 text-[#FF2D8E] text-xs font-bold uppercase tracking-wider mb-4">
                100% Authentic
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                Our Promise:{" "}
                <span className="text-[#FF2D8E]">No Fakes.</span>{" "}
                <span className="text-[#FFB8DC]">No Shortcuts.</span>
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Over <strong className="text-[#FFB8DC]">$1 million invested</strong> in FDA-cleared 
                Class IV medical lasers, authentic pharmaceutical products, and direct manufacturer accounts. 
                Every product verified. Every device certified.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <CTA href="/our-promise" variant="gradient">
                  See Our Vendors & Partners
                </CTA>
                <Link
                  href="/providers"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Meet Ryan & Danielle
                </Link>
              </div>
            </div>
          </FadeUp>

          {/* Right: Vendor Grid */}
          <FadeUp delayMs={150}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {VENDORS.map((vendor, idx) => (
                <div
                  key={vendor.name}
                  className="group relative rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm p-4 hover:border-[#FF2D8E]/50 hover:bg-white/10 transition-all"
                >
                  <div className="text-lg font-bold text-white group-hover:text-[#FF2D8E] transition-colors">
                    {vendor.name}
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">{vendor.type}</div>
                  <div className="text-[10px] text-[#FF2D8E] font-semibold mt-2 uppercase tracking-wider">
                    {vendor.investment}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-white/40 mt-4">
              + Revance, AnteAGE, SkinMedica, and more →{" "}
              <Link href="/our-promise" className="underline hover:text-white/60">
                See full list
              </Link>
            </p>
          </FadeUp>
        </div>

        {/* Bottom: Key differentiators */}
        <FadeUp delayMs={200}>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: "🏥", label: "NP Prescriptive Authority" },
              { icon: "❄️", label: "Cold-Chain Compliance" },
              { icon: "📋", label: "Lot Tracking & Docs" },
              { icon: "🔬", label: "Direct Manufacturer" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs text-white/60 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </Section>
  );
}
