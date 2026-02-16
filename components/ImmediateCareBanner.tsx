"use client";

import { FadeUp } from "./Section";

import { BOOKING_URL } from "@/lib/flows";
const IMMEDIATE_CARE_URL = BOOKING_URL;

const services = [
  { icon: "⚖️", name: "Weight Loss", desc: "Same-day GLP-1 starts" },
  { icon: "🧬", name: "Hormone Therapy", desc: "Labs & treatment ASAP" },
  { icon: "💉", name: "Vitamin Injections", desc: "Walk-ins welcome" },
  { icon: "💧", name: "IV Therapy", desc: "Feel better today" },
];

export function ImmediateCareBanner() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-[#FDF7FA] border-y border-black">
      <div className="max-w-6xl mx-auto min-w-0">
        <FadeUp>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF2D8E]/10 border border-[#FF2D8E]/20 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D8E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF2D8E]"></span>
              </span>
              <span className="text-[#FF2D8E] font-semibold text-sm">Appointments Available NOW</span>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#FF2D8E] mb-3">
              Can&apos;t Get In With Your Doctor?
            </h2>
            <p className="text-xl text-[#FF2D8E] mb-2">
              Need Immediate Care With <span className="text-[#FF2D8E] font-semibold">No Waiting?</span>
            </p>
            <p className="text-[#FF2D8E] max-w-2xl mx-auto">
              Skip the 6-week wait. Our nurse practitioner Ryan Kent, FNP-BC can see you 
              this week—often same-day or next-day appointments available.
            </p>
          </div>
        </FadeUp>

        <FadeUp delayMs={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {services.map((service) => (
              <div
                key={service.name}
                className="p-4 rounded-xl bg-white shadow-md border border-black text-center hover:border-[#FF2D8E]/30 hover:shadow-xl transition"
              >
                <span className="text-3xl mb-2 block">{service.icon}</span>
                <p className="text-[#FF2D8E] font-semibold text-sm">{service.name}</p>
                <p className="text-[#FF2D8E] text-xs">{service.desc}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delayMs={200}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={IMMEDIATE_CARE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto min-h-[48px] px-8 py-4 rounded-xl bg-[#FF2D8E] text-white font-bold text-base md:text-lg hover:bg-[#FF2D8E] transition hover:-translate-y-[2px] shadow-lg flex items-center justify-center gap-3"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              Book Immediate Appointment
            </a>
            <a
              href="tel:630-636-6193"
              className="w-full sm:w-auto min-h-[48px] px-8 py-4 rounded-xl bg-white border border-black text-[#FF2D8E] font-medium hover:bg-[#000000]/5 transition flex items-center justify-center gap-2"
            >
              📞 Call Now: 630-636-6193
            </a>
          </div>
        </FadeUp>

        <FadeUp delayMs={300}>
          <div className="mt-8 text-center">
            <div className="inline-flex flex-wrap justify-center gap-4 text-sm text-black">
              <span className="flex items-center gap-1">
                <span className="text-pink-400">✓</span> No referral needed
              </span>
              <span className="flex items-center gap-1">
                <span className="text-pink-400">✓</span> Same-day available
              </span>
              <span className="flex items-center gap-1">
                <span className="text-pink-400">✓</span> Telehealth option
              </span>
              <span className="flex items-center gap-1">
                <span className="text-pink-400">✓</span> Evening hours
              </span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// Compact version for other pages
export function ImmediateCareStrip() {
  return (
    <a
      href={IMMEDIATE_CARE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-fuchsia-600 py-3 px-4 text-center hover:opacity-90 transition"
    >
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span className="text-white font-semibold text-sm">
          Can&apos;t get in with your doctor? We have same-day appointments!
        </span>
        <span className="text-white/80 text-sm hidden sm:inline">
          Book Now →
        </span>
      </div>
    </a>
  );
}
