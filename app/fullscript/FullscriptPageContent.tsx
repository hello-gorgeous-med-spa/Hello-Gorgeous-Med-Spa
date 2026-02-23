"use client";

import Link from "next/link";
import { useChatOpen } from "@/components/ChatOpenContext";
import { FULLSCRIPT_DISPENSARY_URL } from "@/lib/flows";
import { getActiveCollections } from "@/lib/fullscript/collections";
import { useState } from "react";

const FULLSCRIPT_INTAKE_URL = `${FULLSCRIPT_DISPENSARY_URL}/intake?requestedPractitionerId=UHJhY3RpdGlvbmVyLTM3MjYzMw==`;

const COLLECTION_ICONS: Record<string, string> = {
  "sleep-support": "😴",
  "gut-health": "🦠",
  "energy-metabolism": "⚡",
  "skin-hair-nails": "✨",
  immunity: "🛡️",
  "stress-adaptogens": "🌿",
};

export function FullscriptPageContent() {
  const collections = getActiveCollections();
  const [navOpen, setNavOpen] = useState(false);

  const { openChat } = useChatOpen();
  const openPeppiSupplements = () => {
    openChat("peppi", {
      source: "homepage_supplements",
      topics: ["Vitamin D", "Omega-3", "Probiotics", "Magnesium", "Collagen", "Multivitamins", "Adaptogens", "Digestive Enzymes"],
      fulfillment: "fullscript",
    });
  };

  const navSections = [
    { id: "shop-all", label: "Shop full dispensary", icon: "🛒" },
    ...collections.map((c) => ({ id: c.id, label: c.title, icon: COLLECTION_ICONS[c.id] ?? "💊" })),
    { id: "chat-peppi", label: "Chat with Peppi", icon: "💬" },
    { id: "share-supplements", label: "Share your supplements", icon: "📋" },
    { id: "shop-skincare", label: "Shop skincare & more", icon: "🧴" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <p className="text-[#FF2D8E] text-sm font-semibold uppercase tracking-wider mb-2">
            Supplement dispensary
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Professional-grade supplements, curated for you
          </h1>
          <p className="mt-4 text-white/90 text-lg max-w-2xl">
            Practitioner-only quality, third-party tested. Browse by goal or chat with Peppi for personalized recommendations.
          </p>
        </div>
      </section>

      {/* Sticky nav: dropdown to guide clients */}
      <nav className="sticky top-16 z-30 bg-white border-b border-black/10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="relative">
            <button
              type="button"
              onClick={() => setNavOpen(!navOpen)}
              className="w-full flex items-center justify-between py-4 text-left font-semibold text-black"
              aria-expanded={navOpen}
              aria-controls="fullscript-nav-menu"
            >
              <span className="flex items-center gap-2">
                <span>📍</span> Where do you want to go?
              </span>
              <svg
                className={`w-5 h-5 transition-transform ${navOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              id="fullscript-nav-menu"
              className={`overflow-hidden transition-all duration-200 ${navOpen ? "max-h-[80vh]" : "max-h-0"}`}
            >
              <ul className="pb-4 space-y-1">
                {navSections.map((item) => (
                  <li key={item.id}>
                    {item.id === "shop-skincare" ? (
                      <Link
                        href="/shop"
                        className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-black hover:bg-[#FF2D8E]/10 hover:text-[#FF2D8E] transition-colors"
                        onClick={() => setNavOpen(false)}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                        <span className="text-xs text-black/50 ml-auto">Skincare, etc.</span>
                      </Link>
                    ) : item.id === "chat-peppi" ? (
                      <button
                        type="button"
                        onClick={() => { openPeppiSupplements(); setNavOpen(false); }}
                        className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-left text-black hover:bg-[#FF2D8E]/10 hover:text-[#FF2D8E] transition-colors"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                        <span className="text-xs text-black/50 ml-auto">Get recommendations</span>
                      </button>
                    ) : item.id === "share-supplements" ? (
                      <a
                        href={FULLSCRIPT_INTAKE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-black hover:bg-[#FF2D8E]/10 hover:text-[#FF2D8E] transition-colors"
                        onClick={() => setNavOpen(false)}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                        <span className="text-xs text-black/50 ml-auto">Intake form</span>
                      </a>
                    ) : (
                      <a
                        href={`#${item.id}`}
                        className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-black hover:bg-[#FF2D8E]/10 hover:text-[#FF2D8E] transition-colors"
                        onClick={() => setNavOpen(false)}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 space-y-16">
        {/* Shop all */}
        <section id="shop-all" className="scroll-mt-24">
          <div className="rounded-2xl border-2 border-[#FF2D8E]/30 bg-white p-8 md:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-black">Shop full dispensary</h2>
                <p className="mt-2 text-black/80">
                  Browse our entire selection of practitioner-grade supplements. Free shipping on orders $50+, auto-ship discounts available.
                </p>
              </div>
              <a
                href={FULLSCRIPT_DISPENSARY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF2D8E] text-white font-semibold px-8 py-4 hover:bg-[#E6007E] transition-colors"
              >
                Open dispensary
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Collection sections */}
        {collections.map((col) => (
          <section key={col.id} id={col.id} className="scroll-mt-24">
            <div className="rounded-2xl border border-black/10 bg-white p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <span className="text-2xl" aria-hidden>{COLLECTION_ICONS[col.id] ?? "💊"}</span>
                  <h2 className="text-xl font-bold text-black mt-2">{col.title}</h2>
                  <p className="mt-2 text-black/80 text-sm">{col.description}</p>
                  {col.example_supplements?.length > 0 && (
                    <p className="mt-2 text-black/60 text-xs">
                      Examples: {col.example_supplements.join(", ")}
                    </p>
                  )}
                </div>
                <a
                  href={col.fullscript_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#FF2D8E] text-[#FF2D8E] font-semibold px-6 py-3 hover:bg-[#FF2D8E]/10 transition-colors"
                >
                  View collection
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </section>
        ))}

        {/* Chat with Peppi */}
        <section id="chat-peppi" className="scroll-mt-24">
          <div className="rounded-2xl border-2 border-black/10 bg-pink-50/50 p-8">
            <h2 className="text-xl font-bold text-black flex items-center gap-2">
              <span>💬</span> Chat with Peppi
            </h2>
            <p className="mt-2 text-black/80">
              Not sure what you need? Peppi can help you find supplements that match your goals—sleep, energy, gut health, skin, immunity, stress, and more.
            </p>
            <button
              type="button"
              onClick={openPeppiSupplements}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black text-white font-semibold px-6 py-3 hover:bg-black/80 transition-colors"
            >
              Ask Peppi what’s right for me
            </button>
          </div>
        </section>

        {/* Share your supplements (intake) */}
        <section id="share-supplements" className="scroll-mt-24">
          <div className="rounded-2xl border border-black/10 bg-white p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-black flex items-center gap-2">
                  <span>📋</span> Share your supplements
                </h2>
                <p className="mt-2 text-black/80">
                  Already taking supplements? Submit your current regimen so we can review for interactions and optimize your care.
                </p>
              </div>
              <a
                href={FULLSCRIPT_INTAKE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black text-black font-semibold px-6 py-3 hover:bg-black/5 transition-colors"
              >
                Complete intake form
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Shop skincare & more */}
        <section id="shop-skincare" className="scroll-mt-24">
          <div className="rounded-2xl border border-black/10 bg-white p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-black flex items-center gap-2">
                  <span>🧴</span> Shop skincare & more
                </h2>
                <p className="mt-2 text-black/80">
                  Skinscript RX, in-office products, and wellness items. One place for supplements and skincare.
                </p>
              </div>
              <Link
                href="/shop"
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#FF2D8E] text-[#FF2D8E] font-semibold px-6 py-3 hover:bg-[#FF2D8E]/10 transition-colors"
              >
                Go to shop
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust & disclaimer */}
        <section className="pt-8 border-t border-black/10">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-black/70">
            <span className="flex items-center gap-2">🔒 Secure checkout</span>
            <span className="flex items-center gap-2">🏥 Practitioner-grade</span>
            <span className="flex items-center gap-2">🚚 Fast shipping</span>
          </div>
          <p className="mt-6 text-xs text-black/50 text-center max-w-2xl mx-auto">
            Supplements are for general wellness support only. They are not a substitute for medical advice. Always check with your provider before starting new supplements.
          </p>
        </section>
      </div>
    </div>
  );
}
