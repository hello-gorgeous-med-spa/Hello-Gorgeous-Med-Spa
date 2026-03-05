"use client";

import { useState, useEffect } from "react";
import { CHERRY_PAY_URL } from "@/lib/flows";
import Image from "next/image";

// Countdown target – launch through March 31; scheduling opens April 1
const COUNTDOWN_TARGET = new Date("2026-04-01T00:00:00");
const SCHEDULING_AVAILABLE_FROM = new Date("2026-04-01T00:00:00");

const QUANTUM_TREATMENTS = [
  { id: "chin-neck", name: "Chin & Neck", price: 2800 },
  { id: "lower-abdomen", name: "Lower Abdomen", price: 3900 },
  { id: "full-abdomen", name: "Full Abdomen", price: 4250 },
  { id: "sagging-arms", name: "Sagging Arms", price: 2950 },
  { id: "butt-tightening", name: "Butt Tightening", price: 3900 },
];

const CARD_BULLETS = [
  "Minimally invasive subdermal RF tightening",
  "Local anesthesia",
  "Post-procedure care protocol",
];

export function VIPSkinTighteningContent() {
  const [section, setSection] = useState<"quantum" | "morpheus8">("quantum");
  const [treatmentId, setTreatmentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [schedulingOpen, setSchedulingOpen] = useState(false);

  useEffect(() => {
    setSchedulingOpen(Date.now() >= SCHEDULING_AVAILABLE_FROM.getTime());
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, COUNTDOWN_TARGET.getTime() - Date.now());
      setCountdown({
        days: Math.floor(d / 86400000),
        hours: Math.floor((d % 86400000) / 3600000),
        mins: Math.floor((d % 3600000) / 60000),
        secs: Math.floor((d % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vip-waitlist-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          treatmentId: section === "quantum" ? treatmentId : "morpheus8-package",
          firstName,
          lastName,
          email,
          phone,
          crmTag: "VIP Waitlist 2026",
        }),
      });
      if (res.ok) setSubmitted(true);
      else throw new Error("Submit failed");
    } catch {
      alert("Something went wrong. Please call us to secure your spot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* After March 31: scheduling is open; before: show countdown */}
      {schedulingOpen ? (
        <section className="border-b border-green-500/40 bg-green-950/30 py-4">
          <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="text-green-400 font-semibold uppercase tracking-wider">Booking now open</span>
            <a
              href="/book"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-pink-500 text-white hover:bg-pink-600 transition-colors"
            >
              Schedule your appointment →
            </a>
          </div>
        </section>
      ) : (
        <section className="border-b border-pink-500/30 bg-zinc-900/50 py-3">
          <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="text-pink-400 font-semibold uppercase tracking-wider">Launch countdown — scheduling from April 1st</span>
            <div className="flex gap-4">
              <span className="bg-black/50 px-3 py-1 rounded font-mono">{countdown.days}d</span>
              <span className="bg-black/50 px-3 py-1 rounded font-mono">{countdown.hours}h</span>
              <span className="bg-black/50 px-3 py-1 rounded font-mono">{countdown.mins}m</span>
              <span className="bg-black/50 px-3 py-1 rounded font-mono">{countdown.secs}s</span>
            </div>
          </div>
        </section>
      )}

      {/* Section 1: Quantum RF VIP Waitlist */}
      <section className="px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-pink-500/30 bg-zinc-900/50 mb-10 h-48 md:h-64">
            <Image src="/images/trifecta/quantum-rf.png" alt="Quantum RF" fill className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Quantum RF Minimally Invasive Skin Tightening
              <span className="block mt-2 text-pink-400">VIP Launch Access</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Secure introductory pricing before public launch. Limited priority placements available.
            </p>
          </div>

          {/* Urgency banner */}
          <div className="relative rounded-2xl bg-gradient-to-r from-pink-600/30 to-pink-500/20 border-2 border-pink-500 p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xl font-bold text-white text-center sm:text-left">
              First 10 Quantum RF Clients Receive FREE Full Face CO₂ ($1,800 Value)
            </p>
            <span className="flex-shrink-0 px-4 py-2 bg-pink-500 text-white text-sm font-bold rounded-full uppercase tracking-wider">
              Limited Spots Available
            </span>
          </div>

          {/* Treatment pricing cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
            {QUANTUM_TREATMENTS.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-pink-500/40 bg-zinc-900/80 p-6 flex flex-col"
              >
                <h3 className="text-lg font-bold text-white mb-1">{t.name}</h3>
                <p className="text-2xl font-bold text-pink-400 mb-4">${t.price.toLocaleString()}</p>
                <ul className="space-y-2 text-sm text-white/70 mb-6 flex-1">
                  {CARD_BULLETS.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="text-pink-400 mt-0.5">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setSection("quantum");
                    setTreatmentId(t.id);
                    document.getElementById("secure-spot")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-2.5 rounded-xl font-semibold bg-pink-500 text-white hover:bg-pink-600 transition-colors"
                >
                  Select
                </button>
              </div>
            ))}
          </div>

          {/* Deposit requirement */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 mb-10">
            <h3 className="text-lg font-bold text-white mb-3">Deposit requirement</h3>
            <p className="text-white/80 mb-2">$500 refundable deposit required to join waitlist.</p>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• Applied toward treatment</li>
              <li>• Refundable within 14 days</li>
              <li>• Non-refundable after procedure date confirmed</li>
            </ul>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={() => document.getElementById("secure-spot")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-xl font-bold bg-pink-500 text-white hover:bg-pink-600 transition-colors"
            >
              Secure My VIP Spot
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Morpheus8 Priority Waitlist */}
      <section className="px-4 py-12 md:py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-pink-500/30 bg-zinc-900/50 mb-8 h-48 md:h-56">
            <Image src="/images/trifecta/morpheus8.png" alt="Morpheus8" fill className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Morpheus8 Priority Skin Tightening Access
            </h2>
            <div className="inline-block rounded-2xl border-2 border-pink-500/50 bg-zinc-900/80 p-8 mb-6">
              <p className="text-2xl md:text-3xl font-bold text-pink-400 mb-2">Package of 3 – $2,100</p>
              <p className="text-white/80">First 20 clients who leave deposit receive:</p>
              <p className="text-xl font-bold text-white mt-2">FREE Full Face CO₂ ($1,800 Value)</p>
            </div>
            <p className="text-white/70">$500 refundable deposit (applied toward package)</p>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setSection("morpheus8");
                document.getElementById("secure-spot")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 rounded-xl font-bold bg-pink-500 text-white hover:bg-pink-600 transition-colors"
            >
              Secure My VIP Spot – Morpheus8
            </button>
          </div>
        </div>
      </section>

      {/* Before/After placeholder */}
      <section className="px-4 py-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Results</h2>
          <div className="aspect-video rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-white/50">
            Before / After slider placeholder
          </div>
        </div>
      </section>

      {/* Financing */}
      <section className="px-4 py-8 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/70 mb-2">Financing available</p>
          <a
            href={CHERRY_PAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 font-semibold hover:text-pink-300 underline"
          >
            Pay over time with Cherry →
          </a>
        </div>
      </section>

      {/* CTA form */}
      <section id="secure-spot" className="px-4 py-16 md:py-20 border-t border-pink-500/30">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Secure My VIP Spot</h2>
          {schedulingOpen && (
            <div className="mb-6 rounded-xl bg-green-900/40 border border-green-500/40 p-4 text-center">
              <p className="text-green-300 font-semibold mb-2">Scheduling is now open.</p>
              <a href="/book" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold bg-pink-500 text-white hover:bg-pink-600 transition-colors">
                Book your appointment →
              </a>
            </div>
          )}
          <p className="text-white/70 text-center mb-8">
            Submit your details. We&apos;ll contact you to complete your $500 deposit and confirm your placement.
          </p>

          {submitted ? (
            <div className="rounded-2xl bg-zinc-900 border border-pink-500/30 p-8 text-center">
              <p className="text-xl font-bold text-pink-400 mb-2">You&apos;re on the list.</p>
              <p className="text-white/80">
                Check your email for confirmation. We&apos;ll reach out shortly to complete your deposit.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="First name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-white/20 text-white placeholder-white/50 focus:border-pink-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-white/20 text-white placeholder-white/50 focus:border-pink-500 outline-none"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/20 text-white placeholder-white/50 focus:border-pink-500 outline-none"
              />
              <input
                type="tel"
                placeholder="Phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/20 text-white placeholder-white/50 focus:border-pink-500 outline-none"
              />
              <div>
                <label className="block text-sm text-white/70 mb-2">I&apos;m interested in</label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="section"
                      checked={section === "quantum"}
                      onChange={() => setSection("quantum")}
                      className="text-pink-500"
                    />
                    <span>Quantum RF</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="section"
                      checked={section === "morpheus8"}
                      onChange={() => setSection("morpheus8")}
                      className="text-pink-500"
                    />
                    <span>Morpheus8 Package</span>
                  </label>
                </div>
              </div>
              {section === "quantum" && (
                <div>
                  <label className="block text-sm text-white/70 mb-2">Treatment area</label>
                  <select
                    value={treatmentId}
                    onChange={(e) => setTreatmentId(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/20 text-white focus:border-pink-500 outline-none"
                  >
                    <option value="">Select area...</option>
                    {QUANTUM_TREATMENTS.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} – ${t.price.toLocaleString()}</option>
                    ))}
                  </select>
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Secure My VIP Spot"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
