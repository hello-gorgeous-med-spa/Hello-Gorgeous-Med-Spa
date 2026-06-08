import Image from "next/image";
import Link from "next/link";

import { RealPatientReviews } from "@/components/RealPatientReviews";
import { BOOKING_URL } from "@/lib/flows";
import {
  appForHimUrl,
  FOR_HIM_SERVICES,
  GENTLEMENS_CLUB_BENEFITS,
  GENTLEMENS_CLUB_FATHERS_DAY_IMAGE,
  GENTLEMENS_CLUB_FAQS,
  GENTLEMENS_CLUB_HERO_IMAGE,
  GENTLEMENS_CLUB_PILLARS,
  GENTLEMENS_CLUB_TIERS,
} from "@/lib/gentlemens-club";
import { SITE } from "@/lib/seo";

export function GentlemensClubPageContent() {
  const appUrl = appForHimUrl();

  return (
    <main className="bg-[#030712] text-white">
      {/* Hero flyer — matches app creative */}
      <section className="border-b-4 border-black bg-black py-6 md:py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="sr-only">
            The Gentlemen&apos;s Club — Men&apos;s Wellness Membership at Hello Gorgeous Med Spa, Oswego IL
          </h1>
          <div className="relative overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(255,45,142,0.35)]">
            <div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
              <Image
                src={GENTLEMENS_CLUB_HERO_IMAGE}
                alt="The Gentlemen's Club — Brotox, hormones, peptide therapy and recovery for men at Hello Gorgeous Med Spa Oswego IL"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 1152px"
                priority
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
            >
              Book Your Consult
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-xl hover:border-blue-400 hover:text-blue-300 transition-all text-lg"
            >
              View Membership Tiers
            </a>
            <Link
              href={appUrl}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-500/50 bg-blue-500/10 text-blue-200 font-semibold rounded-xl hover:bg-blue-500/20 transition-all text-lg"
            >
              Open in App — For Him 👑
            </Link>
          </div>
        </div>
      </section>

      {/* Father's Day / gift Brotox promo */}
      <section className="border-b-4 border-black bg-gray-950 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(59,130,246,0.35)]">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={GENTLEMENS_CLUB_FATHERS_DAY_IMAGE}
                  alt="Happy Father's Day — Gift Brotox at Hello Gorgeous Med Spa Oswego IL"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF2D8E]">Father&apos;s Day · Any day</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-black leading-tight">
                Because you love him…{" "}
                <span className="text-gray-400">but his frown lines had to go.</span>
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Gift Brotox, a Gentlemen&apos;s Club membership, or a consult — instant eGift delivery through Square.
                Oswego · Naperville · Aurora · Plainfield.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={FOR_HIM_SERVICES[3].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all"
                >
                  🎁 Buy eGift Card
                </a>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-600 text-white font-semibold rounded-xl hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition-all"
                >
                  Book Brotox for Dad
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Men's services — app For Him tab parity */}
      <section className="py-16 lg:py-20 bg-[#030712] border-b border-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-400">Men&apos;s services</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold">Built for how men actually show up</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {FOR_HIM_SERVICES.map((svc) => (
              <div
                key={svc.id}
                className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{svc.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{svc.label}</h3>
                      <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-blue-300">
                        {svc.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{svc.blurb}</p>
                  </div>
                </div>
                {"external" in svc && svc.external ? (
                  <a
                    href={svc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block text-center rounded-xl bg-[#FF2D8E] py-2.5 text-sm font-bold text-white hover:bg-[#e0267d] transition-all"
                  >
                    {svc.cta} →
                  </a>
                ) : (
                  <Link
                    href={svc.href}
                    className="mt-4 block text-center rounded-xl bg-[#FF2D8E] py-2.5 text-sm font-bold text-white hover:bg-[#e0267d] transition-all"
                  >
                    {svc.cta} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 lg:py-28 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What&apos;s Included</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Membership benefits built around how men actually want to feel — not how they&apos;re told they should look.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GENTLEMENS_CLUB_BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-gray-900 border border-gray-800 hover:border-blue-500/40 rounded-2xl p-6 transition-all"
              >
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership tiers */}
      <section id="pricing" className="py-20 lg:py-28 bg-[#030712]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Tier</h2>
            <p className="text-gray-400 text-lg">No contracts. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {GENTLEMENS_CLUB_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-2xl p-8 ${
                  tier.highlight
                    ? "bg-gray-900 border border-blue-500/40"
                    : "bg-gray-900 border border-gray-700"
                }`}
              >
                {tier.highlight ? (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-[#FF2D8E] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      Most Popular
                    </span>
                  </div>
                ) : null}
                <h3 className="text-2xl font-bold mb-1 mt-2">{tier.name}</h3>
                <p
                  className="text-5xl font-black mb-4"
                  style={{
                    background: tier.highlight
                      ? "linear-gradient(135deg, #e8e8e8 0%, #ffffff 50%, #b0b8c8 100%)"
                      : "linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ${tier.pricePerMonth}
                  <span className="text-2xl text-gray-400">/mo</span>
                </p>
                <p className="text-gray-400 mb-4">{tier.summary}</p>
                <ul className="space-y-3 mb-8">
                  {tier.perks.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-300">
                      <span className={tier.highlight ? "text-[#FF2D8E] mt-0.5" : "text-blue-400 mt-0.5"}>
                        {tier.highlight ? "♥" : "★"}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                {tier.footnote ? <p className="text-sm text-gray-500 mb-6">{tier.footnote}</p> : null}
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center px-6 py-3 font-bold rounded-xl transition-all ${
                    tier.highlight
                      ? "bg-[#FF2D8E] text-white hover:bg-[#e0267d]"
                      : "border-2 border-blue-500 text-blue-300 hover:bg-blue-500/10"
                  }`}
                >
                  Join {tier.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Couples promo — from app */}
      <section className="py-12 bg-gray-950 border-y border-gray-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xl font-bold text-white mb-2">Couples that glow together… 💗</p>
          <p className="text-gray-400 mb-6">
            Botox for her. Brotox for him. Book together and make it a date.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF2D8E] px-6 py-3 text-sm font-bold text-white hover:bg-[#e0267d] transition-all"
          >
            Book Together →
          </Link>
        </div>
      </section>

      {/* Why men choose */}
      <section className="py-20 lg:py-28 bg-[#030712]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Men Choose This</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GENTLEMENS_CLUB_PILLARS.map((pillar, i) => (
              <div key={pillar.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
                  <span className="text-blue-400 font-bold text-lg">{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">{pillar.title}</h3>
                <p className="text-gray-400 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Questions</h2>
          <div className="space-y-6">
            {GENTLEMENS_CLUB_FAQS.map((faq) => (
              <div key={faq.question} className="border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3 text-white">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-24 lg:py-32 border-t border-gray-900"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 60%), #030712",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 text-3xl" aria-hidden="true">
            👑
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Join?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Book your complimentary consult — or open the Hello Gorgeous app For Him tab for the same experience on your phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#FF2D8E] text-white font-bold rounded-xl hover:bg-[#e0267d] transition-all text-lg"
            >
              Book Your Consult
            </a>
            <Link
              href={appUrl}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-500 text-blue-300 font-semibold rounded-xl hover:bg-blue-500/10 transition-all text-lg"
            >
              Open App — For Him
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-xl hover:border-[#FF2D8E] hover:text-[#FF2D8E] transition-all text-lg"
            >
              Call {SITE.phone}
            </a>
          </div>
        </div>
      </section>

      <RealPatientReviews />
    </main>
  );
}
