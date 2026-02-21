import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { BOOKING_URL } from "@/lib/flows";
import { SITE, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Solaria CO₂ Fractional Laser | Advanced Skin Resurfacing",
  description:
    "Transform your skin with InMode Solaria CO₂ fractional laser at Hello Gorgeous Med Spa, Oswego IL. Treats acne scars, deep wrinkles, sun damage, skin laxity. VIP Early Access now open. Serving Naperville, Aurora, Plainfield.",
  path: "/services/solaria-co2",
});

const SOLARIA_FAQS = [
  {
    question: "What is Solaria CO₂ fractional laser?",
    answer:
      "Solaria CO₂ is an advanced fractional ablative laser by InMode that creates thousands of microscopic treatment zones in the skin. This stimulates deep collagen remodeling and dramatically improves texture, tone, scarring, and skin laxity. It's considered the gold standard for skin resurfacing.",
  },
  {
    question: "How long is the downtime?",
    answer:
      "Expect 5–7 days of social downtime. Your skin will be red, swollen, and will peel/flake as it heals. Most clients take a week off from work or social events. Full healing takes 2–4 weeks, with continued improvement over 3–6 months as collagen rebuilds.",
  },
  {
    question: "How many treatments do I need?",
    answer:
      "Many clients see dramatic improvement with just one treatment. For deep scarring or significant sun damage, 2–3 sessions spaced 6–12 weeks apart may be recommended. Your provider will create a personalized plan during your consultation.",
  },
  {
    question: "Does the treatment hurt?",
    answer:
      "We apply topical numbing cream for 45–60 minutes before treatment to maximize comfort. Most clients describe the sensation as heat and mild prickling. Post-treatment, you'll feel like you have a sunburn for a few days.",
  },
  {
    question: "Who is NOT a candidate for CO₂ laser?",
    answer:
      "CO₂ laser is not suitable for those with active acne or infections, pregnancy/breastfeeding, history of keloid scarring, recent isotretinoin (Accutane) use, very dark skin tones (higher risk of hyperpigmentation), or autoimmune conditions affecting healing.",
  },
  {
    question: "When will I see results?",
    answer:
      "Initial results are visible once peeling completes (7–10 days). However, the magic happens over 3–6 months as your body produces new collagen. Many clients report their skin continues improving for up to a year.",
  },
  {
    question: "How much does Solaria CO₂ cost?",
    answer:
      "Pricing depends on the treatment area and depth. Full face treatments typically start at $1,500+. VIP waitlist members receive a $100 credit. Schedule a consultation for personalized pricing.",
  },
  {
    question: "Can I combine CO₂ with other treatments?",
    answer:
      "Yes! Many clients combine CO₂ with PRP/PRF for enhanced healing, or schedule maintenance Botox and fillers once healed. We'll discuss optimal treatment sequencing during your consultation.",
  },
];

const TREATMENT_BENEFITS = [
  { icon: "✨", title: "Deep Wrinkle Reduction", desc: "Dramatically softens forehead lines, crow's feet, and perioral wrinkles" },
  { icon: "🎯", title: "Acne Scar Revision", desc: "Significantly improves texture and depth of acne scars" },
  { icon: "☀️", title: "Sun Damage Repair", desc: "Reverses years of sun damage, age spots, and hyperpigmentation" },
  { icon: "💎", title: "Skin Tightening", desc: "Stimulates collagen for firmer, more lifted skin" },
  { icon: "🔬", title: "Texture Refinement", desc: "Smooths rough texture and minimizes enlarged pores" },
  { icon: "🌟", title: "Overall Rejuvenation", desc: "Comprehensive anti-aging in a single powerful treatment" },
];

const IDEAL_CANDIDATES = [
  "Deep wrinkles and fine lines",
  "Acne scarring (ice pick, boxcar, rolling)",
  "Sun damage and age spots",
  "Uneven skin tone and texture",
  "Skin laxity and loss of firmness",
  "Enlarged pores",
  "Dull, tired-looking skin",
  "Previous treatments with limited results",
];

const PRE_CARE_INSTRUCTIONS = [
  { icon: "🚫", text: "Stop retinoids, AHAs, BHAs 7 days before treatment" },
  { icon: "☀️", text: "Avoid sun exposure and tanning 2 weeks before" },
  { icon: "💊", text: "Disclose all medications; some may need to be paused" },
  { icon: "💧", text: "Hydrate well in the days leading up to treatment" },
  { icon: "🧴", text: "Arrive with clean, makeup-free skin" },
  { icon: "📋", text: "Antiviral medication may be prescribed if history of cold sores" },
];

const POST_CARE_INSTRUCTIONS = [
  { icon: "🧊", text: "Apply cool compresses to reduce swelling (Days 1–3)" },
  { icon: "🧴", text: "Keep skin moist with recommended healing ointment" },
  { icon: "🚫", text: "Do NOT pick at peeling skin—let it slough naturally" },
  { icon: "☀️", text: "Avoid direct sun; wear SPF 50+ once healed" },
  { icon: "💧", text: "Stay hydrated and avoid alcohol" },
  { icon: "🛏️", text: "Sleep elevated to minimize swelling" },
  { icon: "💄", text: "No makeup until skin is fully healed (usually 7–10 days)" },
  { icon: "🏃", text: "Avoid strenuous exercise and sweating for 7 days" },
];

export default function SolariaCO2Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: "Solaria CO₂ Fractional Laser Treatment",
    description:
      "Advanced fractional CO₂ laser skin resurfacing treatment for wrinkles, acne scars, sun damage, and skin tightening at Hello Gorgeous Med Spa.",
    procedureType: "Cosmetic",
    bodyLocation: "Face, Neck, Chest, Hands",
    preparation: "Consultation required. Avoid sun exposure and retinoids before treatment.",
    followup: "5-7 days downtime. Full results in 3-6 months.",
    howPerformed:
      "Fractional ablative laser creates microscopic treatment zones to stimulate collagen remodeling.",
    status: "Available with consultation",
    provider: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.streetAddress,
        addressLocality: SITE.address.addressLocality,
        addressRegion: SITE.address.addressRegion,
        postalCode: SITE.address.postalCode,
      },
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SOLARIA_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Solaria CO₂ Fractional Laser Treatment at Hello Gorgeous Med Spa",
    description: "Learn about the transformative Solaria CO₂ laser treatment for skin resurfacing.",
    thumbnailUrl: `${SITE.url}/images/solaria/solaria-hero.jpg`,
    uploadDate: "2025-02-21",
    contentUrl: `${SITE.url}/videos/solaria-intro.mp4`,
    embedUrl: `${SITE.url}/services/solaria-co2`,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/images/logo.png`,
      },
    },
  };

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />

      {/* Hero Section */}
      <Section className="relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent" />
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
              <span className="text-pink-300 text-sm font-semibold uppercase tracking-wider">Now Available — VIP Early Access</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Solaria CO₂</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500">
                Fractional Laser
              </span>
            </h1>
            
            <p className="mt-6 text-xl md:text-2xl text-white/80 leading-relaxed">
              The gold standard in skin resurfacing. One treatment. Dramatic transformation.
            </p>
            
            <p className="mt-4 text-lg text-white/60">
              Advanced ablative laser technology by <strong className="text-white">InMode</strong> for deep wrinkles, acne scars, sun damage, and skin tightening.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href="/solaria-co2-vip" variant="gradient" className="text-lg px-8 py-4 shadow-xl shadow-pink-500/25">
                Join VIP Waitlist — $100 Off
              </CTA>
              <CTA href={BOOKING_URL} variant="outline" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10">
                Book Consultation
              </CTA>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                5-7 Days Downtime
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                Results in 3-6 Months
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                Consultation Required
              </span>
            </div>
          </FadeUp>

          <FadeUp delayMs={200}>
            <div className="relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <Image
                  src="/images/solaria/solaria-device-hero.png"
                  alt="InMode Solaria CO2 Fractional Laser device at Hello Gorgeous Med Spa Oswego IL"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
                InMode Technology
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Trust Badges */}
      <Section className="bg-white py-8 border-y border-gray-200">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {[
            { icon: "🏥", label: "FDA-Cleared Device" },
            { icon: "👩‍⚕️", label: "Licensed Providers" },
            { icon: "⭐", label: "4.9 Star Rated" },
            { icon: "🎓", label: "InMode Certified" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-3 text-gray-700">
              <span className="text-2xl">{badge.icon}</span>
              <span className="font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* What It Treats */}
      <Section className="bg-gradient-to-b from-white to-pink-50/30">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 border border-pink-200 mb-4">
              <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">Transformative Results</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What Solaria CO₂ <span className="text-pink-500">Treats</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              One powerful treatment addresses multiple concerns that other treatments can't match
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TREATMENT_BENEFITS.map((benefit, idx) => (
            <FadeUp key={benefit.title} delayMs={60 * idx}>
              <div className="group p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-pink-300 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Before & After Gallery */}
      <Section className="bg-gray-900 text-white">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 mb-4">
              <span className="text-pink-300 text-sm font-semibold uppercase tracking-wider">Real Results</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Before & After <span className="text-pink-400">Gallery</span>
            </h2>
            <p className="mt-4 text-xl text-white/70 max-w-2xl mx-auto">
              See the dramatic transformations achieved with Solaria CO₂ laser
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((num, idx) => (
            <FadeUp key={num} delayMs={60 * idx}>
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={`/images/solaria/before-after-${num}.jpg`}
                    alt={`Solaria CO2 laser before and after results ${num} - skin resurfacing at Hello Gorgeous Med Spa`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="text-white/60 text-sm">
                    {["Acne Scarring", "Deep Wrinkles", "Sun Damage", "Skin Texture", "Hyperpigmentation", "Full Rejuvenation"][idx]}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delayMs={400}>
          <p className="text-center text-white/50 text-sm mt-8">
            Results vary by individual. All treatments performed by licensed medical professionals. Client consent on file.
          </p>
        </FadeUp>
      </Section>

      {/* Who It's For */}
      <Section className="bg-white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 border border-pink-200 mb-4">
              <span className="text-pink-600 text-sm font-semibold uppercase tracking-wider">Ideal Candidates</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Is Solaria CO₂ <span className="text-pink-500">Right For You?</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              This treatment is perfect for clients who are ready for dramatic improvement and can commit to proper healing time.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {IDEAL_CANDIDATES.map((candidate, idx) => (
                <div key={candidate} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="text-gray-700">{candidate}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-xl bg-amber-50 border border-amber-200">
              <h4 className="font-bold text-amber-800 flex items-center gap-2">
                <span>⚠️</span> Important Considerations
              </h4>
              <p className="mt-2 text-amber-700 text-sm">
                CO₂ laser requires 5–7 days of social downtime. A consultation is required to determine if you're a good candidate. Not suitable for those with active acne, pregnancy, history of keloids, or very dark skin tones.
              </p>
            </div>
          </FadeUp>

          <FadeUp delayMs={200}>
            <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 shadow-xl">
              <Image
                src="/images/solaria/consultation-room.jpg"
                alt="Private consultation room at Hello Gorgeous Med Spa for Solaria CO2 laser treatment"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white font-semibold">Consultation Required</p>
                <p className="text-white/80 text-sm">We'll assess your skin and create a personalized treatment plan</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Pre-Care & Post-Care */}
      <Section className="bg-gradient-to-b from-pink-50/50 to-white">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Your Treatment <span className="text-pink-500">Journey</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Proper preparation and aftercare are essential for optimal results
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pre-Care */}
          <FadeUp delayMs={100}>
            <div className="p-8 rounded-2xl bg-white border-2 border-gray-200 h-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">📋</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Pre-Treatment Care</h3>
                  <p className="text-blue-600 text-sm font-medium">Before Your Appointment</p>
                </div>
              </div>
              <div className="space-y-4">
                {PRE_CARE_INSTRUCTIONS.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <span className="text-gray-700 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Post-Care */}
          <FadeUp delayMs={200}>
            <div className="p-8 rounded-2xl bg-white border-2 border-gray-200 h-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">✨</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Post-Treatment Care</h3>
                  <p className="text-green-600 text-sm font-medium">After Your Treatment</p>
                </div>
              </div>
              <div className="space-y-4">
                {POST_CARE_INSTRUCTIONS.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <span className="text-gray-700 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Healing Timeline */}
        <FadeUp delayMs={300}>
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Healing Timeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { day: "Days 1-3", status: "Redness & swelling", icon: "🔴" },
                { day: "Days 4-7", status: "Peeling begins", icon: "🔶" },
                { day: "Week 2", status: "New skin emerges", icon: "🟡" },
                { day: "Month 1-6", status: "Collagen rebuilds", icon: "🟢" },
              ].map((phase, idx) => (
                <div key={phase.day} className="text-center p-4 rounded-xl bg-white border border-pink-100">
                  <span className="text-2xl block mb-2">{phase.icon}</span>
                  <p className="font-bold text-gray-900">{phase.day}</p>
                  <p className="text-gray-600 text-sm">{phase.status}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Models Needed Section */}
      <Section className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white">
        <FadeUp>
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 mb-6">
              <span className="text-white text-sm font-semibold uppercase tracking-wider">✨ Special Opportunity</span>
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Models Needed for Solaria CO₂
            </h2>
            <p className="mt-6 text-xl text-white/90 max-w-2xl mx-auto">
              We're looking for models to help showcase our new Solaria CO₂ laser. 
              Receive <strong className="text-white">exclusive discounts</strong> in exchange for before/after photos and testimonials.
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { icon: "💰", text: "Significant savings on treatment" },
                { icon: "📸", text: "Professional before/after photos" },
                { icon: "⭐", text: "Be featured on our website" },
              ].map((perk) => (
                <div key={perk.text} className="flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur">
                  <span className="text-2xl">{perk.icon}</span>
                  <span className="text-sm text-left">{perk.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <CTA 
                href="/solaria-co2-vip?model=true" 
                variant="outline" 
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-pink-600"
              >
                Apply to Be a Model
              </CTA>
              <CTA 
                href={`tel:${SITE.phone}`} 
                variant="outline" 
                className="text-lg px-8 py-4 border-white/50 text-white hover:bg-white/10"
              >
                Call for Details
              </CTA>
            </div>

            <p className="mt-6 text-white/70 text-sm">
              Limited spots available. Must be willing to share photos and experience. Subject to consultation approval.
            </p>
          </div>
        </FadeUp>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-white">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked <span className="text-pink-500">Questions</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to know about Solaria CO₂ laser
            </p>
          </div>
        </FadeUp>

        <div className="max-w-3xl mx-auto space-y-4">
          {SOLARIA_FAQS.map((faq, idx) => (
            <FadeUp key={faq.question} delayMs={40 * idx}>
              <details className="group rounded-2xl border-2 border-gray-200 bg-white overflow-hidden hover:border-pink-200 transition-colors">
                <summary className="cursor-pointer p-6 flex items-center justify-between text-lg font-semibold text-gray-900 hover:text-pink-600 transition-colors">
                  <span>{faq.question}</span>
                  <span className="ml-4 flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center group-open:rotate-45 transition-transform">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* VIP Waitlist CTA */}
      <Section className="bg-gradient-to-b from-gray-900 to-black text-white">
        <FadeUp>
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
              </span>
              <span className="text-pink-300 text-sm font-semibold uppercase tracking-wider">VIP Early Access</span>
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Exclusive Waitlist</span>
            </h2>

            <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
              Be among the first to experience Solaria CO₂ at Hello Gorgeous. VIP members receive priority booking and a $100 credit toward treatment.
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { icon: "🎯", benefit: "Priority Booking" },
                { icon: "💰", benefit: "$100 VIP Credit" },
                { icon: "⏰", benefit: "First Access" },
              ].map((item) => (
                <div key={item.benefit} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <span className="text-white/90 font-medium">{item.benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <CTA href="/solaria-co2-vip" variant="gradient" className="text-lg px-10 py-5 shadow-xl shadow-pink-500/25">
                Join VIP Waitlist Now
              </CTA>
            </div>

            <p className="mt-8 text-white/50 text-sm">
              Questions? Call us at <a href={`tel:${SITE.phone}`} className="text-pink-400 hover:underline">{SITE.phone}</a> or text <a href="sms:630-881-3398" className="text-pink-400 hover:underline">630-881-3398</a>
            </p>
          </div>
        </FadeUp>
      </Section>

      {/* Final CTA with Booking */}
      <Section className="bg-white">
        <FadeUp>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ready to Transform Your Skin?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Schedule your consultation today and discover if Solaria CO₂ is right for you.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="gradient" className="text-lg px-10 py-4">
                Book Consultation
              </CTA>
              <CTA href="/contact" variant="outline" className="text-lg px-10 py-4">
                Contact Us First
              </CTA>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span>📍 74 W. Washington St, Oswego, IL</span>
              <span>📞 {SITE.phone}</span>
              <span>Serving Naperville, Aurora, Plainfield</span>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Medical Disclaimer */}
      <div className="bg-gray-100 border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            <strong>Disclaimer:</strong> Results vary by individual. All treatments performed by licensed medical professionals. 
            A consultation is required to determine candidacy. Solaria CO₂ laser treatment involves downtime and risks that will be discussed during your consultation.
            Before and after photos are from real patients with their consent.
          </p>
        </div>
      </div>
    </>
  );
}
