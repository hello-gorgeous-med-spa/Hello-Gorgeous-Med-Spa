"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CHERRY_PAY_URL } from "@/lib/flows";

// Square payment link for the VIP $500 deposit (from your Square event)
const SQUARE_DEPOSIT_LINK = process.env.NEXT_PUBLIC_VIP_SQUARE_DEPOSIT_LINK || "https://square.link/u/k5rX264z";

const QUANTUM_OPTIONS = [
  { id: "chin_neck", name: "Chin & Neck", price: 2800 },
  { id: "lower_abdomen", name: "Lower Abdomen", price: 3900 },
  { id: "full_abdomen", name: "Full Abdomen", price: 4250 },
  { id: "sagging_arms", name: "Sagging Arms", price: 2950 },
  { id: "butt_tightening", name: "Butt Tightening", price: 3900 },
] as const;

const COUNTDOWN_END = process.env.NEXT_PUBLIC_VIP_LAUNCH_END || "2026-04-30";

export function VIPSkinTighteningContent() {
  const [section, setSection] = useState<"quantum" | "morpheus8">("quantum");
  const [treatment, setTreatment] = useState<string>(QUANTUM_OPTIONS[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [depositAgree, setDepositAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number } | null>(null);
  const [depositLinkLoading, setDepositLinkLoading] = useState(false);
  const [depositLinkError, setDepositLinkError] = useState<string | null>(null);

  useEffect(() => {
    const end = new Date(COUNTDOWN_END).getTime();
    const tick = () => {
      const now = Date.now();
      if (now >= end) {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      const d = Math.floor((end - now) / (24 * 60 * 60 * 1000));
      const h = Math.floor(((end - now) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const m = Math.floor(((end - now) % (60 * 60 * 1000)) / (60 * 1000));
      setCountdown({ days: d, hours: h, minutes: m });
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!depositAgree) {
      setError("Please confirm the $500 deposit requirement.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/vip-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign: "2026",
          name,
          email,
          phone,
          qualification_data: {
            section,
            treatment_option: section === "quantum" ? treatment : "morpheus8_package_3",
            deposit_ready: true,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayDeposit = () => {
    window.location.href = SQUARE_DEPOSIT_LINK;
  };

  if (done) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF2D8E] text-white text-2xl mb-6">✓</div>
          <h1 className="text-3xl font-bold mb-4">You're on the VIP List</h1>
          <p className="text-white/80 mb-6">
            We'll send a confirmation email shortly. Pay your $500 refundable deposit below to secure your spot—or we can contact you to complete it.
          </p>
          <div className="space-y-3">
            <a
              href={SQUARE_DEPOSIT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 rounded-xl font-bold text-lg bg-[#FF2D8E] text-white hover:bg-[#E6007E] transition-colors text-center"
            >
              Pay $500 deposit now (Square)
            </a>
            <Link href="/" className="block text-white/70 hover:text-white text-sm">
              I'll pay later — return home
            </Link>
          </div>

          <p className="mt-8 text-sm text-white/60">Tag: VIP Waitlist 2026</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] bg-[#FF2D8E]/10" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] bg-[#FF2D8E]/5" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
        {countdown && (
          <div className="text-center mb-10">
            <p className="text-[#FF2D8E] font-semibold uppercase tracking-wider text-sm mb-2">Launch countdown</p>
            <div className="flex justify-center gap-6 md:gap-10">
              <div>
                <span className="block text-3xl md:text-4xl font-bold text-white">{countdown.days}</span>
                <span className="text-xs text-white/60 uppercase">Days</span>
              </div>
              <div>
                <span className="block text-3xl md:text-4xl font-bold text-white">{countdown.hours}</span>
                <span className="text-xs text-white/60 uppercase">Hours</span>
              </div>
              <div>
                <span className="block text-3xl md:text-4xl font-bold text-white">{countdown.minutes}</span>
                <span className="text-xs text-white/60 uppercase">Min</span>
              </div>
            </div>
          </div>
        )}

        <section className="mb-20">
          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image src="/images/trifecta/quantum-rf.png" alt="Quantum RF device" width={100} height={60} className="object-contain rounded-lg" />
                  <span className="text-[#FF2D8E] font-semibold uppercase tracking-wider text-sm">VIP Launch</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Quantum RF Minimally Invasive Skin Tightening – VIP Launch Access
                </h1>
                <p className="text-lg text-white/80 mb-4">
                  Secure introductory pricing before public launch. Limited priority placements available.
                </p>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image 
                  src="/images/morpheus8/facetite-chin.png" 
                  alt="Quantum RF chin and neck treatment results" 
                  fill 
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-4 left-4 text-white/90 text-sm font-medium">Chin & Neck Tightening Results</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-[#FF2D8E] bg-[#FF2D8E]/10 p-4 md:p-6 mb-6">
            <p className="text-lg font-semibold text-white">
              All VIP list members receive <span className="text-[#FF2D8E]">FREE Full Face CO₂</span> ($1,800 value).
            </p>
            <p className="text-white/90 text-sm mt-2">VIP list closes March 31st.</p>
          </div>

          <h3 className="text-xl font-bold text-white mb-4">Select the service you&apos;re interested in</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            {QUANTUM_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setSection("quantum");
                  setTreatment(opt.id);
                }}
                className={`text-left rounded-xl border-2 p-5 transition-all ${
                  section === "quantum" && treatment === opt.id
                    ? "border-[#FF2D8E] bg-[#FF2D8E]/10"
                    : "border-white/20 bg-white/5 hover:border-white/40"
                }`}
              >
                <p className="font-bold text-white text-lg">{opt.name}</p>
                <p className="text-[#FF2D8E] text-xl font-bold mt-1">${opt.price.toLocaleString()}</p>
                <ul className="mt-3 text-sm text-white/70 space-y-1">
                  <li>• Minimally invasive subdermal RF</li>
                  <li>• Local anesthesia</li>
                  <li>• Post-procedure care protocol</li>
                </ul>
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setSection("morpheus8"); setTreatment("morpheus8_package_3"); }}
              className={`text-left rounded-xl border-2 p-5 transition-all ${
                section === "morpheus8"
                  ? "border-[#FF2D8E] bg-[#FF2D8E]/10"
                  : "border-white/20 bg-white/5 hover:border-white/40"
              }`}
            >
              <p className="font-bold text-white text-lg">Morpheus8 – Package of 3</p>
              <p className="text-[#FF2D8E] text-xl font-bold mt-1">$2,100</p>
              <ul className="mt-3 text-sm text-white/70 space-y-1">
                <li>• RF microneedling face & body</li>
                <li>• 3 treatment sessions</li>
                <li>• $500 deposit applied toward package</li>
              </ul>
            </button>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-6 mb-10 max-w-2xl">
            <h3 className="font-bold text-white mb-3">$500 Refundable Deposit Required</h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Applied toward your treatment</li>
              <li>• Refundable within 14 days</li>
              <li>• Non-refundable after procedure date is confirmed</li>
            </ul>
            <p className="text-[#FF2D8E] font-semibold text-sm mt-3">VIP list closes March 31st.</p>
          </div>
        </section>

        {/* Treatment Areas Gallery */}
        <div className="mb-20">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Treatment Areas We Target</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <div className="relative aspect-square">
                <Image src="/images/morpheus8/concern-jowls-cheeks.png" alt="Jowls and cheeks skin tightening" fill className="object-cover" />
              </div>
              <p className="text-center text-sm text-white/80 py-2">Jowls & Cheeks</p>
            </div>
            <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <div className="relative aspect-square">
                <Image src="/images/morpheus8/concern-tech-neck.png" alt="Tech neck skin tightening" fill className="object-cover" />
              </div>
              <p className="text-center text-sm text-white/80 py-2">Neck & Chin</p>
            </div>
            <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <div className="relative aspect-square">
                <Image src="/images/morpheus8/concern-bat-wings.png" alt="Arm skin tightening for bat wings" fill className="object-cover" />
              </div>
              <p className="text-center text-sm text-white/80 py-2">Sagging Arms</p>
            </div>
            <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <div className="relative aspect-square">
                <Image src="/images/morpheus8/concern-loose-belly.png" alt="Abdomen skin tightening" fill className="object-cover" />
              </div>
              <p className="text-center text-sm text-white/80 py-2">Abdomen</p>
            </div>
            <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <div className="relative aspect-square">
                <Image src="/images/morpheus8/concern-ozempic-butt.png" alt="Butt skin tightening" fill className="object-cover" />
              </div>
              <p className="text-center text-sm text-white/80 py-2">Butt Tightening</p>
            </div>
          </div>
        </div>

        {/* Quantum RF Device Gallery */}
        <div className="mb-20">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Quantum RF Technology</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <div className="relative aspect-[4/3]">
                <Image src="/images/morpheus8/quantumrf-10-face.png" alt="Quantum RF face treatment" fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="text-white font-semibold">Quantum RF 10</p>
                <p className="text-white/60 text-sm">Precision facial contouring</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <div className="relative aspect-[4/3]">
                <Image src="/images/morpheus8/quantumrf-10-jawline.png" alt="Quantum RF jawline treatment" fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="text-white font-semibold">Jawline Definition</p>
                <p className="text-white/60 text-sm">Chin & neck tightening</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
              <div className="relative aspect-[4/3]">
                <Image src="/images/morpheus8/quantumrf-25-abdomen.png" alt="Quantum RF abdomen treatment" fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="text-white font-semibold">Quantum RF 25</p>
                <p className="text-white/60 text-sm">Body contouring & skin tightening</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/images/trifecta/morpheus8.png" alt="Morpheus8 device" width={100} height={60} className="object-contain rounded-lg" />
                <span className="text-[#FF2D8E] font-semibold uppercase tracking-wider text-sm">Priority Access</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Morpheus8 Priority Skin Tightening Access</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src="/images/morpheus8/morpheus8-face-front.png" alt="Morpheus8 facial treatment" fill className="object-cover" />
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src="/images/morpheus8/morpheus8-burst-buttocks.png" alt="Morpheus8 body treatment" fill className="object-cover" />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="rounded-xl border-2 border-[#FF2D8E] bg-[#FF2D8E]/10 p-6 inline-flex flex-col max-w-sm">
              <p className="text-white font-bold text-2xl">Package of 3 – $2,100</p>
              <p className="text-white/80 text-sm mt-2">$500 refundable deposit applied toward package</p>
            </div>
            <div className="rounded-xl border border-[#FF2D8E] bg-[#FF2D8E]/5 p-4">
              <p className="text-white font-semibold">All VIP list members receive FREE Full Face CO₂ ($1,800 value).</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSection("morpheus8")}
            className={`rounded-xl border-2 px-6 py-3 font-semibold transition-all ${
              section === "morpheus8"
                ? "border-[#FF2D8E] bg-[#FF2D8E] text-white"
                : "border-white/30 text-white hover:border-[#FF2D8E]"
            }`}
          >
            I want Morpheus8 Package of 3
          </button>
        </section>

        <div className="rounded-xl bg-white/5 border border-white/10 p-6 mb-12 max-w-xl">
          <p className="text-white font-semibold mb-2">Financing available</p>
          <p className="text-white/70 text-sm mb-4">Pay over time with Cherry. No interest if paid in full within the promotional period.</p>
          <Link
            href={CHERRY_PAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#FF2D8E] font-semibold hover:underline"
          >
            Check eligibility with Cherry
            <span aria-hidden>→</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
          <h3 className="text-2xl font-bold text-white">Secure My VIP Spot</h3>
          <p className="text-white/80 text-sm">
            {section === "morpheus8" ? "Morpheus8 Package of 3 — $2,100" : `${QUANTUM_OPTIONS.find((o) => o.id === treatment)?.name ?? treatment} — $${QUANTUM_OPTIONS.find((o) => o.id === treatment)?.price.toLocaleString() ?? ""}`}
          </p>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF2D8E] focus:ring-1 focus:ring-[#FF2D8E]"
              placeholder="Jane Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF2D8E] focus:ring-1 focus:ring-[#FF2D8E]"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Phone *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-[#FF2D8E] focus:ring-1 focus:ring-[#FF2D8E]"
              placeholder="(630) 555-1234"
            />
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={depositAgree}
              onChange={(e) => setDepositAgree(e.target.checked)}
              className="mt-1 rounded border-white/30 text-[#FF2D8E] focus:ring-[#FF2D8E]"
            />
            <span className="text-sm text-white/80">
              I understand a $500 refundable deposit is required to join the waitlist. It will be applied toward my treatment, refundable within 14 days, and non-refundable after my procedure date is confirmed.
            </span>
          </label>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl font-bold text-lg bg-[#FF2D8E] text-white hover:bg-[#E6007E] disabled:opacity-50 transition-colors"
          >
            {submitting ? "Submitting…" : "Secure My VIP Spot"}
          </button>
          <p className="text-xs text-white/50">
            By submitting, you'll be added to our VIP Waitlist 2026. We'll send a confirmation email and contact you to complete your deposit.
          </p>
        </form>
      </div>
    </div>
  );
}
