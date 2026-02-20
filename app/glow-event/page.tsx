import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "The Glow-Up Event | Limited-Time Beauty & Wellness Specials",
  description: "Join the Glow-Up Event at Hello Gorgeous Med Spa! FREE vitamin injection, $10/unit Botox, $499 lip filler, and GLP-1 weight loss starting at $600. Oswego, IL.",
  openGraph: {
    title: "The Glow-Up Event | Hello Gorgeous Med Spa",
    description: "Limited-Time Beauty & Wellness Specials - FREE Vitamin Injection, Botox $10/unit, Lip Filler $499, Weight Loss from $600",
    images: ["/images/promo/glow-up-event-facebook.jpg"],
  },
};

const offers = [
  {
    title: "FREE Vitamin Injection",
    subtitle: "When You Book Your Consultation",
    details: "B12 • Vitamin D • Biotin • Glutathione",
    note: "For New Clients Only • Limited Time",
    icon: "💉",
  },
  {
    title: "$10 Per Unit Botox",
    subtitle: "BOTOX SPECIALS",
    details: "40 Units = 10 Units FREE! (50 Units Total)",
    note: "Limited Bonus Available",
    icon: "✨",
  },
  {
    title: "$499 Per Syringe",
    subtitle: "LIP FILLER EVENT",
    details: "Plump • Natural • Beautiful",
    note: "Premium Dermal Fillers",
    icon: "💋",
  },
  {
    title: "As Low as $600 for 10 Weeks",
    subtitle: "MEDICAL WEIGHT LOSS",
    details: "GLP-1 Programs (Semaglutide & Tirzepatide)",
    note: "Physician-Supervised",
    icon: "⚖️",
  },
];

const benefits = [
  "Advanced Aesthetic Injectables",
  "Medical Weight Loss",
  "PRF Hair Restoration",
  "Hormone Optimization",
];

export default function GlowEventPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/promo/glow-up-event-facebook.jpg')] bg-cover bg-center opacity-5" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-6">
              <span className="animate-pulse">✨</span>
              <span>Limited-Time Event</span>
              <span className="animate-pulse">✨</span>
            </span>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              The <span className="text-pink-500">Glow-Up</span> Event is HERE
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Limited-Time Beauty & Wellness Specials at Hello Gorgeous Med Spa
            </p>
          </div>

          {/* Promo Image with Download */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/promo/glow-up-event-facebook.jpg"
                alt="Glow-Up Event Promotional Flyer"
                width={540}
                height={675}
                className="w-full h-auto"
                priority
              />
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/images/promo/glow-up-event-facebook.jpg"
                download="HelloGorgeous-GlowUpEvent.jpg"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Flyer
              </a>
              
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Follow on Facebook
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Event Specials
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.title}
                className="p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-white border border-pink-100 hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">{offer.icon}</span>
                <p className="text-sm font-medium text-pink-500 uppercase tracking-wider mb-1">
                  {offer.subtitle}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {offer.title}
                </h3>
                <p className="text-gray-600 mb-2">{offer.details}</p>
                <p className="text-sm text-gray-500">{offer.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Hello Gorgeous */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Hello Gorgeous?
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm"
              >
                <span className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm">
                  ✓
                </span>
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Claim */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How to Claim Your Offer
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Follow Our Page", desc: "Connect with us on Facebook for updates" },
              { step: "2", title: "Book Online", desc: "Schedule at HelloGorgeousMedSpa.com" },
              { step: "3", title: "Mention \"Glow Event\"", desc: "Tell us when you arrive" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-pink-500 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Glow Up?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Book your appointment today and mention "Glow Event" to claim your specials!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-pink-600 font-bold rounded-full transition-all text-lg"
            >
              Book Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center text-white">
            <a href="tel:630-636-6193" className="flex items-center justify-center gap-2 hover:text-pink-200 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-semibold">Call: 630-636-6193</span>
            </a>
            <a href="sms:630-881-3398" className="flex items-center justify-center gap-2 hover:text-pink-200 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-semibold">Text: 630-881-3398</span>
            </a>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 mb-2">Visit us at</p>
          <p className="text-xl font-bold text-pink-400">Hello Gorgeous Med Spa</p>
          <p className="text-gray-300">74 W. Washington Street, Oswego, IL 60543</p>
          
          <div className="mt-6 flex justify-center gap-4">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href={SITE.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
