"use client";

import { FadeUp } from "./Section";

const IMMEDIATE_CARE_URL = "https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&eid=4566698&oiid=sv%3A22845867&share=true&pId=95245";

const services = [
  { icon: "⚖️", name: "Weight Loss", desc: "Same-day GLP-1 starts" },
  { icon: "🧬", name: "Hormone Therapy", desc: "Labs & treatment ASAP" },
  { icon: "💉", name: "Vitamin Injections", desc: "Walk-ins welcome" },
  { icon: "💧", name: "IV Therapy", desc: "Feel better today" },
];

export function ImmediateCareBanner() {
  return (
    <section className="py-12 px-4 bg-gradient-to-r from-fuchsia-950/40 via-pink-950/30 to-fuchsia-950/40 border-y border-pink-500/20">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
              <span className="text-pink-400 font-semibold text-sm">Appointments Available NOW</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Can&apos;t Get In With Your Doctor?
            </h2>
            <p className="text-xl text-gray-300 mb-2">
              Need Immediate Care With <span className="text-pink-400 font-semibold">No Waiting?</span>
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
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
                className="p-4 rounded-xl bg-black/30 border border-pink-500/20 text-center hover:border-pink-500/40 transition"
              >
                <span className="text-3xl mb-2 block">{service.icon}</span>
                <p className="text-white font-semibold text-sm">{service.name}</p>
                <p className="text-pink-400 text-xs">{service.desc}</p>
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
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-lg hover:opacity-90 transition transform hover:scale-105 shadow-lg shadow-pink-500/25 flex items-center gap-3"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              Book Immediate Appointment
            </a>
            <a
              href="tel:630-636-6193"
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition flex items-center gap-2"
            >
              📞 Call Now: 630-636-6193
            </a>
          </div>
        </FadeUp>

        <FadeUp delayMs={300}>
          <div className="mt-8 text-center">
            <div className="inline-flex flex-wrap justify-center gap-4 text-sm text-gray-400">
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
