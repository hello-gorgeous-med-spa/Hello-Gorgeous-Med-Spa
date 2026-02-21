import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Solaria CO2 Fractional Laser | Coming Soon",
  description: "Something HUGE is coming to Hello Gorgeous Med Spa! The InMode Solaria CO2 Fractional Laser - the future of skin resurfacing. Join the waitlist for exclusive early access. Oswego, IL.",
  openGraph: {
    title: "Solaria CO2 Fractional Laser | Coming Soon to Hello Gorgeous Med Spa",
    description: "The future of skin resurfacing is almost here. Dramatic wrinkle reduction, acne scar transformation, and skin renewal with minimal downtime.",
    images: ["/images/promo/solaria-coming-soon-banner.jpg"],
  },
};

const benefits = [
  {
    icon: "✨",
    title: "Dramatic Wrinkle Reduction",
    description: "Smooth fine lines and deep wrinkles with precision CO2 technology",
  },
  {
    icon: "🎯",
    title: "Acne Scar Transformation",
    description: "Resurface and renew skin damaged by acne scars",
  },
  {
    icon: "☀️",
    title: "Sun Damage Reversal",
    description: "Correct years of sun damage, age spots, and hyperpigmentation",
  },
  {
    icon: "💎",
    title: "Skin Tightening & Renewal",
    description: "Stimulate collagen for firmer, more youthful skin",
  },
  {
    icon: "⚡",
    title: "Minimal Downtime",
    description: "Fractional technology means faster healing than traditional CO2",
  },
  {
    icon: "🔬",
    title: "Precision Technology",
    description: "Customizable treatments from light refresh to deep resurfacing",
  },
];

const treatsConditions = [
  "Fine Lines & Wrinkles",
  "Acne Scars",
  "Surgical Scars",
  "Sun Damage & Age Spots",
  "Uneven Skin Texture",
  "Enlarged Pores",
  "Skin Laxity",
  "Stretch Marks",
];

export default function SolariaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,45,142,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,142,0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500/20 to-teal-500/20 border border-pink-500/30 text-pink-400 text-sm font-medium animate-pulse">
              <span>🚀</span>
              <span>COMING SOON</span>
              <span>🚀</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Something</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500">
              HUGE
            </span>{" "}
            <span className="text-white">is Coming...</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light italic">
            The Future of Skin Resurfacing
          </p>

          <div className="my-12">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400">
                SOLARIA CO₂
              </span>
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-white mt-2">
              FRACTIONAL LASER
            </p>
            <p className="text-lg text-gray-400 mt-2">by InMode</p>
          </div>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Revolutionary CO₂ fractional laser technology that delivers dramatic results 
            with precision targeting and faster recovery. Transform your skin like never before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#waitlist"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-pink-500/25"
            >
              Join the Waitlist
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="https://www.instagram.com/reel/DOWwR-rD6WZ/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all border border-white/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Watch Video
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why <span className="text-pink-500">Solaria CO₂</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The most advanced fractional CO₂ laser technology for transformative skin rejuvenation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-pink-500/30 transition-all group"
              >
                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treats Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Conditions We&apos;ll <span className="text-teal-400">Treat</span>
            </h2>
            <p className="text-gray-400">
              The Solaria CO₂ laser addresses a wide range of skin concerns
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {treatsConditions.map((condition) => (
              <span
                key={condition}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30 text-teal-300 font-medium"
              >
                {condition}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Image Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-lg mx-auto">
          <Image
            src="/images/promo/solaria-coming-soon-promo.jpg"
            alt="Solaria CO2 Fractional Laser Coming Soon"
            width={540}
            height={675}
            className="w-full h-auto rounded-2xl shadow-2xl shadow-pink-500/20"
          />
          <div className="mt-6 flex justify-center gap-4">
            <a
              href="/images/promo/solaria-coming-soon-promo.jpg"
              download="HelloGorgeous-Solaria-ComingSoon.jpg"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-full transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download & Share
            </a>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 rounded-full bg-pink-500/20 text-pink-400 text-sm font-medium mb-4">
              EXCLUSIVE EARLY ACCESS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Be <span className="text-pink-500">First</span> on the Waitlist
            </h2>
            <p className="text-gray-400">
              Join our VIP waitlist to receive exclusive early access, special launch pricing, 
              and be among the first to experience the Solaria CO₂ laser at Hello Gorgeous Med Spa.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50">
            <form className="space-y-4" action="/api/subscribe" method="POST">
              <input type="hidden" name="source" value="solaria-waitlist" />
              
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-5 py-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-5 py-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
              
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (for SMS updates)"
                  className="w-full px-5 py-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-pink-500/25"
              >
                Join the VIP Waitlist
              </button>
            </form>

            <p className="text-gray-500 text-sm mt-4">
              We&apos;ll notify you when Solaria launches. No spam, unsubscribe anytime.
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center text-gray-400">
            <a href={`tel:${SITE.phone}`} className="flex items-center justify-center gap-2 hover:text-pink-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{SITE.phone}</span>
            </a>
            <span className="hidden sm:block">|</span>
            <a href="sms:630-881-3398" className="flex items-center justify-center gap-2 hover:text-pink-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Text: 630-881-3398</span>
            </a>
          </div>
        </div>
      </section>

      {/* Social Section */}
      <section className="py-12 px-4 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 mb-6">Follow us for launch updates</p>
          <div className="flex justify-center gap-4">
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white hover:scale-110 transition-transform"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href={SITE.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-black border border-white flex items-center justify-center text-white hover:scale-110 transition-transform"
              aria-label="TikTok"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
          
          <div className="mt-8">
            <p className="text-gray-500 text-sm">
              Hello Gorgeous Med Spa · 74 W. Washington Street, Oswego, IL 60543
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
