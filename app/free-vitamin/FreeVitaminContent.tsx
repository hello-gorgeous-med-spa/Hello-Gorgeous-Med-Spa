"use client";

import { useState } from "react";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

const GOOGLE_REVIEW_URL = "https://g.page/r/CYQOWmT_HcwQEBM/review";

const vitaminOptions = [
  {
    name: "B12 Injection",
    value: "$35",
    icon: "💉",
    benefit: "Energy & metabolism boost",
    description: "Increases energy levels, supports brain function, and helps with red blood cell formation.",
  },
  {
    name: "Vitamin D Injection",
    value: "$45",
    icon: "☀️",
    benefit: "Immune & bone health",
    description: "Essential for immune function, bone health, and mood regulation. Most adults are deficient!",
  },
  {
    name: "Biotin Injection",
    value: "$40",
    icon: "💅",
    benefit: "Hair, skin & nails",
    description: "Promotes healthy hair growth, stronger nails, and glowing skin from within.",
  },
  {
    name: "Glutathione Injection",
    value: "$65",
    icon: "✨",
    benefit: "Detox & skin brightening",
    description: "Master antioxidant that detoxifies, brightens skin, and supports overall wellness.",
    popular: true,
  },
];

const urgencyReasons = [
  { icon: "⏰", text: "Limited spots available each week" },
  { icon: "🎯", text: "One per person - first visit only" },
  { icon: "📅", text: "Must redeem within 30 days" },
];

const socialProof = [
  { stat: "2,500+", label: "Happy Clients" },
  { stat: "4.9★", label: "Google Rating" },
  { stat: "5+ Years", label: "Experience" },
];

export function FreeVitaminContent() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedVitamin, setSelectedVitamin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          phone,
          source: "free-vitamin",
          selectedVitamin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      // Generate a promo code for them
      const code = `VITFREE-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      setPromoCode(code);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-24">
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-black to-teal-900/30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative max-w-5xl mx-auto">
          {/* Urgency Banner */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium animate-pulse">
              <span>🔥</span>
              <span>LIMITED TIME OFFER - While Supplies Last!</span>
            </span>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Get a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                FREE
              </span>{" "}
              Vitamin Injection
              <br />
              <span className="text-2xl md:text-4xl text-gray-300">
                (Up to $65 Value)
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
              Subscribe to our wellness list and claim your{" "}
              <span className="text-white font-semibold">complimentary vitamin shot</span> at
              Hello Gorgeous Med Spa. No catch, no obligation.
            </p>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {socialProof.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{item.stat}</div>
                  <div className="text-sm text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Vitamin Options */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>💉</span> Choose Your FREE Vitamin:
              </h2>
              {vitaminOptions.map((vitamin) => (
                <button
                  key={vitamin.name}
                  type="button"
                  onClick={() => setSelectedVitamin(vitamin.name)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    selectedVitamin === vitamin.name
                      ? "border-emerald-500 bg-emerald-500/20"
                      : "border-white/10 bg-white/5 hover:border-emerald-500/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{vitamin.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">{vitamin.name}</span>
                        <div className="flex items-center gap-2">
                          {vitamin.popular && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-xs">
                              Most Popular
                            </span>
                          )}
                          <span className="text-gray-400 line-through text-sm">{vitamin.value}</span>
                          <span className="text-emerald-400 font-bold">FREE</span>
                        </div>
                      </div>
                      <p className="text-emerald-400 text-sm mt-1">{vitamin.benefit}</p>
                      <p className="text-gray-500 text-sm mt-1">{vitamin.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Signup Form */}
            <div className="lg:sticky lg:top-24">
              {!submitted ? (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30">
                  <div className="text-center mb-6">
                    <span className="text-4xl mb-2 block">🎁</span>
                    <h3 className="text-2xl font-bold text-white">Claim Your FREE Vitamin</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Enter your details to get your exclusive offer
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name *"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address *"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number (optional)"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {selectedVitamin && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-sm text-emerald-400">
                          Selected: <span className="font-bold">{selectedVitamin}</span>
                        </p>
                      </div>
                    )}

                    {error && (
                      <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-emerald-500/25"
                    >
                      {isSubmitting ? "Claiming..." : "🎁 Claim My FREE Vitamin →"}
                    </button>
                  </form>

                  <div className="mt-4 space-y-2">
                    {urgencyReasons.map((reason) => (
                      <div key={reason.text} className="flex items-center gap-2 text-gray-400 text-sm">
                        <span>{reason.icon}</span>
                        <span>{reason.text}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-gray-500 text-xs mt-4">
                    By subscribing, you agree to receive wellness tips and exclusive offers.
                    Unsubscribe anytime.
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-center">
                  <span className="text-5xl mb-4 block">🎉</span>
                  <h3 className="text-2xl font-bold text-white mb-2">You&apos;re All Set!</h3>
                  <p className="text-gray-300 mb-4">
                    Your FREE vitamin injection is waiting for you!
                  </p>

                  {promoCode && (
                    <div className="p-4 rounded-xl bg-black/30 border border-emerald-500/30 mb-4">
                      <p className="text-gray-400 text-sm mb-1">Your Promo Code:</p>
                      <p className="text-2xl font-mono font-bold text-emerald-400">{promoCode}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        Mention this code when booking
                      </p>
                    </div>
                  )}

                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:opacity-90 transition mb-4"
                  >
                    📅 Book Your Appointment Now
                  </a>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-gray-400 text-sm mb-2">
                      Love your experience? We&apos;d appreciate a review!
                    </p>
                    <a
                      href={GOOGLE_REVIEW_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      <span>⭐</span>
                      <span>Leave us a Google Review</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-emerald-950/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How to Claim Your{" "}
            <span className="text-emerald-400">FREE</span> Vitamin
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: "📝",
                title: "Subscribe",
                description: "Enter your email above to join our wellness list",
              },
              {
                step: "2",
                icon: "📅",
                title: "Book",
                description: "Schedule your appointment at Hello Gorgeous Med Spa",
              },
              {
                step: "3",
                icon: "💉",
                title: "Enjoy",
                description: "Get your FREE vitamin injection - no strings attached!",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center">
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Why Vitamin Injections?
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Unlike oral supplements that lose potency through digestion, injections deliver 
            100% absorption directly into your bloodstream for maximum benefit.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "⚡", title: "Instant Energy", desc: "Feel the boost within hours" },
              { icon: "🎯", title: "100% Absorption", desc: "Bypasses digestive system" },
              { icon: "🩺", title: "Medical Grade", desc: "Administered by professionals" },
              { icon: "⏱️", title: "Quick & Easy", desc: "Just 5 minutes, minimal discomfort" },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-emerald-500/30 transition"
              >
                <span className="text-3xl mb-3 block">{benefit.icon}</span>
                <h3 className="text-white font-bold mb-1">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-emerald-950/10 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium mb-4">
            💝 Referral Program
          </span>
          <h2 className="text-3xl font-bold text-white mb-4">
            Give $25, Get $25
          </h2>
          <p className="text-gray-400 mb-8">
            Love your experience? Refer a friend and you&apos;ll BOTH get $25 off your next service!
          </p>
          <Link
            href="/referral"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-bold hover:opacity-90 transition"
          >
            Learn About Our Referral Program →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Don&apos;t Miss Out on Your{" "}
            <span className="text-emerald-400">FREE</span> Vitamin!
          </h2>
          <p className="text-gray-400 mb-8">
            This offer won&apos;t last forever. Claim yours now and experience the Hello Gorgeous difference.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-10 py-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg hover:opacity-90 transition shadow-lg shadow-emerald-500/25"
          >
            🎁 Claim My FREE Vitamin Now →
          </button>
        </div>
      </section>

      {/* Location Info */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm mb-4">Redeem your free vitamin at</p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-2xl">💋</span>
            </div>
            <div className="text-left">
              <p className="text-white font-bold">Hello Gorgeous Med Spa</p>
              <p className="text-gray-400 text-sm">74 W. Washington St, Oswego, IL 60543</p>
            </div>
          </div>
          <a
            href="tel:630-636-6193"
            className="inline-flex items-center gap-2 mt-4 text-emerald-400 hover:text-emerald-300"
          >
            <span>📞</span>
            <span>630-636-6193</span>
          </a>
        </div>
      </section>
    </main>
  );
}
