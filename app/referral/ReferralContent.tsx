"use client";

import { useState } from "react";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/flows";

const howItWorks = [
  {
    step: "1",
    icon: "💝",
    title: "Share Your Love",
    description: "Tell your friends and family about Hello Gorgeous Med Spa",
  },
  {
    step: "2",
    icon: "📅",
    title: "They Book & Visit",
    description: "Your friend books their first appointment and mentions your name",
  },
  {
    step: "3",
    icon: "🎉",
    title: "You Both Save!",
    description: "After their visit, you BOTH receive $25 off your next service",
  },
];

const benefits = [
  { icon: "💰", title: "No Limit", desc: "Refer as many friends as you want - earn $25 each time!" },
  { icon: "👥", title: "Everyone Wins", desc: "Your friend saves too, making it easy to share" },
  { icon: "⚡", title: "Easy to Redeem", desc: "Credits automatically applied to your account" },
  { icon: "🎁", title: "Stackable", desc: "Combine with other offers and promotions" },
];

const popularServices = [
  { name: "Botox", price: "From $12/unit", icon: "💉" },
  { name: "Lip Filler", price: "From $650", icon: "💋" },
  { name: "Vitamin Injections", price: "From $35", icon: "✨" },
  { name: "IV Therapy", price: "From $150", icon: "💧" },
  { name: "Chemical Peels", price: "From $125", icon: "🌟" },
  { name: "Microneedling", price: "From $300", icon: "🎯" },
];

export function ReferralContent() {
  const [referrerName, setReferrerName] = useState("");
  const [referrerEmail, setReferrerEmail] = useState("");
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referrerEmail || !friendEmail || !referrerName || !friendName) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Submit both the referrer and friend to the subscribe API
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: friendEmail,
          name: friendName,
          phone: friendPhone,
          source: "referral",
          referredBy: {
            name: referrerName,
            email: referrerEmail,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit referral");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareMessage = encodeURIComponent(
    "I love Hello Gorgeous Med Spa! Use my referral and we'll BOTH get $25 off. Book here: https://hellogorgeousmedspa.com/free-vitamin"
  );

  return (
    <main className="min-h-screen bg-black pt-24">
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-black to-fuchsia-900/30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 text-sm font-medium mb-6">
            <span>💝</span>
            <span>Referral Program</span>
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Give{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-400">
              $25
            </span>
            , Get{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">
              $25
            </span>
          </h1>

          <p className="text-xl text-black max-w-2xl mx-auto mb-8">
            Share the glow! Refer a friend to Hello Gorgeous Med Spa and you&apos;ll{" "}
            <span className="text-white font-semibold">BOTH</span> receive $25 off your next service.
          </p>

          {/* Quick Share Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <a
              href={`sms:?body=${shareMessage}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition"
            >
              <span>💬</span>
              <span>Text a Friend</span>
            </a>
            <a
              href={`mailto:?subject=You'll love Hello Gorgeous Med Spa!&body=${shareMessage}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition"
            >
              <span>📧</span>
              <span>Email a Friend</span>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?quote=${shareMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/20 border border-blue-600/30 text-blue-400 hover:bg-blue-600/30 transition"
            >
              <span>📘</span>
              <span>Share on Facebook</span>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-pink-950/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative text-center">
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-pink-500 to-fuchsia-500" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-black text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Form */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Refer a Friend Now
            </h2>
            <p className="text-black">
              Fill out the form below and we&apos;ll send your friend an invitation with the referral offer.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-gradient-to-br from-pink-500/10 to-fuchsia-500/10 border border-pink-500/30">
              {/* Your Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>👤</span> Your Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={referrerName}
                    onChange={(e) => setReferrerName(e.target.value)}
                    placeholder="Your Name *"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                  <input
                    type="email"
                    value={referrerEmail}
                    onChange={(e) => setReferrerEmail(e.target.value)}
                    placeholder="Your Email *"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Friend's Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>💝</span> Friend&apos;s Information
                </h3>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                      placeholder="Friend's Name *"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    />
                    <input
                      type="email"
                      value={friendEmail}
                      onChange={(e) => setFriendEmail(e.target.value)}
                      placeholder="Friend's Email *"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <input
                    type="tel"
                    value={friendPhone}
                    onChange={(e) => setFriendPhone(e.target.value)}
                    placeholder="Friend's Phone (optional)"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-pink-500/25"
              >
                {isSubmitting ? "Sending..." : "💝 Send Referral Invite"}
              </button>

              <p className="text-center text-black text-xs mt-4">
                Your friend will receive an email with the referral offer. 
                $25 credits are applied after their first visit.
              </p>
            </form>
          ) : (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/30 text-center">
              <span className="text-5xl mb-4 block">🎉</span>
              <h3 className="text-2xl font-bold text-white mb-2">Referral Sent!</h3>
              <p className="text-black mb-6">
                We&apos;ve sent an invitation to <span className="text-pink-400 font-semibold">{friendName}</span>. 
                You&apos;ll both receive $25 off after their first visit!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFriendName("");
                    setFriendEmail("");
                    setFriendPhone("");
                  }}
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
                >
                  Refer Another Friend
                </button>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-bold hover:opacity-90 transition"
                >
                  Book Your Next Visit
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-gradient-to-b from-pink-950/10 to-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Share the Love?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-pink-500/30 transition"
              >
                <span className="text-3xl mb-3 block">{benefit.icon}</span>
                <h3 className="text-white font-bold mb-1">{benefit.title}</h3>
                <p className="text-black text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Popular Services to Try
            </h2>
            <p className="text-black">
              Use your $25 credit toward any of these amazing treatments
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularServices.map((service) => (
              <div
                key={service.name}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:border-pink-500/30 transition"
              >
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <p className="text-white font-medium">{service.name}</p>
                  <p className="text-pink-400 text-sm">{service.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/services"
              className="text-pink-400 hover:text-pink-300 font-medium"
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-t from-pink-950/20 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Sharing, Start Saving!
          </h2>
          <p className="text-black mb-8">
            There&apos;s no limit to how many friends you can refer. The more you share, the more you save!
          </p>
          <button
            onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
            className="px-10 py-5 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-bold text-lg hover:opacity-90 transition shadow-lg shadow-pink-500/25"
          >
            💝 Refer a Friend Now →
          </button>
        </div>
      </section>

      {/* New Client Promo */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              New to Hello Gorgeous?
            </h3>
            <p className="text-black mb-4">
              Get a FREE vitamin injection (up to $65 value) just for subscribing!
            </p>
            <Link
              href="/free-vitamin"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:opacity-90 transition"
            >
              <span>🎁</span>
              <span>Claim Your FREE Vitamin</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
