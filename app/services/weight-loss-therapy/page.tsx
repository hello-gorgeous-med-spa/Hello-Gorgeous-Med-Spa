import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { ServiceExpertWidget } from "@/components/ServiceExpertWidget";
import { BOOKING_URL } from "@/lib/flows";
import { SITE, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Medical Weight Loss Oswego IL | Semaglutide & Tirzepatide | Hello Gorgeous Med Spa",
  description:
    "Medical weight loss with Semaglutide (Ozempic/Wegovy) and Tirzepatide (Mounjaro/Zepbound) at Hello Gorgeous Med Spa in Oswego, IL. GLP-1 weight loss program supervised by nurse practitioners. Serving Naperville, Aurora, Plainfield. Book your consultation!",
  keywords: [
    "medical weight loss Oswego IL",
    "semaglutide weight loss",
    "tirzepatide weight loss",
    "ozempic near me",
    "wegovy near me",
    "mounjaro near me",
    "zepbound near me",
    "GLP-1 weight loss",
    "weight loss clinic Naperville",
    "medical weight loss Aurora",
    "weight loss shots",
    "weight loss injections",
    "Hello Gorgeous Med Spa",
    "weight loss Plainfield IL",
    "semaglutide Oswego",
    "tirzepatide Oswego",
    "weight loss doctor near me",
    "weight loss clinic near me",
  ],
  alternates: {
    canonical: "https://www.hellogorgeousmedspa.com/services/weight-loss-therapy",
  },
  openGraph: {
    type: "website",
    url: "https://www.hellogorgeousmedspa.com/services/weight-loss-therapy",
    title: "Medical Weight Loss | Semaglutide & Tirzepatide | Hello Gorgeous Med Spa",
    description: "GLP-1 weight loss with Semaglutide and Tirzepatide. Medical supervision, weekly injections, proven results. Oswego IL.",
    siteName: "Hello Gorgeous Med Spa",
    locale: "en_US",
    images: [
      {
        url: "https://www.hellogorgeousmedspa.com/images/services/hg-weight-loss.png",
        width: 1200,
        height: 630,
        alt: "Medical Weight Loss Program at Hello Gorgeous Med Spa Oswego IL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Medical Weight Loss | Semaglutide & Tirzepatide",
    description: "GLP-1 weight loss program at Hello Gorgeous Med Spa. Semaglutide, Tirzepatide. Oswego IL.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const WEIGHT_LOSS_FAQS = [
  {
    question: "What is GLP-1 weight loss therapy?",
    answer:
      "GLP-1 (glucagon-like peptide-1) agonists like Semaglutide and Tirzepatide are FDA-approved medications that help reduce appetite, slow gastric emptying, and promote satiety. Originally developed for diabetes, they've proven highly effective for weight loss when combined with diet and lifestyle changes.",
  },
  {
    question: "What's the difference between Semaglutide and Tirzepatide?",
    answer:
      "Semaglutide (brand names Ozempic, Wegovy) is a GLP-1 receptor agonist. Tirzepatide (brand names Mounjaro, Zepbound) is a dual GIP/GLP-1 agonist, targeting two hormone receptors for potentially greater weight loss. Both are weekly injections. Your provider will recommend the best option based on your health history and goals.",
  },
  {
    question: "How much weight can I expect to lose?",
    answer:
      "Clinical trials show average weight loss of 15-20% of body weight with Semaglutide and up to 22% with Tirzepatide over 68-72 weeks. Individual results vary based on starting weight, diet, exercise, and compliance with the program.",
  },
  {
    question: "What are the side effects?",
    answer:
      "Common side effects include nausea, constipation, diarrhea, and decreased appetite—especially when starting or increasing dosage. We start with a low dose and gradually increase to minimize side effects. Most people find side effects decrease over time.",
  },
  {
    question: "Who is a candidate for GLP-1 weight loss?",
    answer:
      "Generally, candidates have a BMI of 27+ with weight-related health conditions (like high blood pressure, type 2 diabetes) or BMI of 30+. A medical evaluation is required to determine if you're a good candidate and rule out contraindications.",
  },
  {
    question: "How long do I need to take the medication?",
    answer:
      "GLP-1 medications work while you're taking them. Many patients use them for 6-12+ months to reach their goal weight, then work with their provider on a maintenance plan. Lifestyle changes during treatment help maintain results.",
  },
  {
    question: "Do I need labs?",
    answer:
      "We may recommend baseline labs (metabolic panel, A1C if diabetic) before starting. Regular check-ins monitor your progress, tolerance, and any adjustments needed.",
  },
  {
    question: "How much does the weight loss program cost?",
    answer:
      "Pricing varies based on the medication, dosage, and program length. We offer compounded Semaglutide and Tirzepatide at competitive prices. Schedule a consultation for personalized pricing and payment options.",
  },
];

const BENEFITS = [
  { icon: "📉", title: "Proven Results", description: "Clinical trials show 15-22% body weight loss with GLP-1 medications" },
  { icon: "👩‍⚕️", title: "Medical Supervision", description: "Nurse practitioner-guided program with regular check-ins and monitoring" },
  { icon: "💉", title: "Weekly Injections", description: "Simple once-weekly self-injection at home—we teach you how" },
  { icon: "🎯", title: "Appetite Control", description: "Feel full faster and longer, naturally reducing calorie intake" },
];

const PROCESS = [
  { step: 1, title: "Consultation", description: "Medical evaluation, health history review, and goal setting" },
  { step: 2, title: "Lab Work", description: "Baseline labs if needed to ensure safety and eligibility" },
  { step: 3, title: "Start Treatment", description: "Begin with a low dose, learn self-injection technique" },
  { step: 4, title: "Monthly Follow-ups", description: "Regular check-ins, dose adjustments, and progress tracking" },
];

export default function WeightLossTherapyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: "GLP-1 Medical Weight Loss Therapy",
    alternateName: ["Semaglutide Weight Loss", "Tirzepatide Weight Loss", "Ozempic Weight Loss", "Wegovy Treatment"],
    description:
      "Medical weight loss program using GLP-1 receptor agonists (Semaglutide, Tirzepatide) for sustainable weight loss under nurse practitioner supervision.",
    procedureType: "Medical",
    bodyLocation: "Subcutaneous injection",
    preparation: "Medical consultation and evaluation required. Labs may be recommended.",
    followup: "Weekly injections, monthly provider check-ins, ongoing monitoring.",
    howPerformed:
      "Once-weekly self-administered subcutaneous injection with gradual dose titration.",
    status: "Available",
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
    availableService: [
      { "@type": "MedicalTherapy", name: "Semaglutide (Ozempic/Wegovy)" },
      { "@type": "MedicalTherapy", name: "Tirzepatide (Mounjaro/Zepbound)" },
    ],
    areaServed: [
      { "@type": "City", name: "Oswego, IL" },
      { "@type": "City", name: "Naperville, IL" },
      { "@type": "City", name: "Aurora, IL" },
      { "@type": "City", name: "Plainfield, IL" },
      { "@type": "City", name: "Yorkville, IL" },
    ],
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Hello Gorgeous Med Spa - Weight Loss",
    description: "Medical weight loss clinic offering Semaglutide and Tirzepatide GLP-1 therapy in Oswego, IL",
    url: "https://www.hellogorgeousmedspa.com/services/weight-loss-therapy",
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: ["Oswego", "Naperville", "Aurora", "Plainfield", "Yorkville", "Montgomery", "Kendall County"],
    medicalSpecialty: "Weight Loss Medicine",
    availableService: {
      "@type": "MedicalTherapy",
      name: "GLP-1 Weight Loss Program",
      description: "Semaglutide and Tirzepatide medical weight loss",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(WEIGHT_LOSS_FAQS)) }}
      />

      {/* Hero Section */}
      <Section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-950 to-black min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-300 text-sm font-semibold uppercase tracking-wider">Now Accepting New Patients</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Medical</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500">
                Weight Loss
              </span>
            </h1>
            
            <p className="mt-6 text-xl md:text-2xl text-white/80 leading-relaxed">
              Lose weight and keep it off with FDA-approved GLP-1 medications.
            </p>
            
            <p className="mt-4 text-lg text-white/60">
              <strong className="text-white">Semaglutide</strong> (Ozempic®/Wegovy®) and <strong className="text-white">Tirzepatide</strong> (Mounjaro®/Zepbound®) — medically supervised, proven results.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient" className="text-lg px-8 py-4 shadow-xl shadow-emerald-500/25 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                Book Weight Loss Consultation
              </CTA>
              <CTA href="tel:630-636-6193" variant="outline" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10">
                Call Us: 630-636-6193
              </CTA>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Weekly Injections
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Medical Supervision
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Proven 15-22% Weight Loss
              </span>
            </div>
          </FadeUp>

          <FadeUp delayMs={200}>
            <div className="relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <Image
                  src="/images/services/hg-weight-loss.png"
                  alt="Medical weight loss with Semaglutide and Tirzepatide at Hello Gorgeous Med Spa Oswego IL"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg">
                GLP-1 Therapy
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* Trust Badges */}
      <Section className="bg-white py-8 border-y border-gray-200">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {[
            { icon: "🏥", label: "FDA-Approved Medications" },
            { icon: "👩‍⚕️", label: "NP Supervised" },
            { icon: "⭐", label: "4.9 Star Rated" },
            { icon: "📍", label: "Oswego, IL" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-3 text-gray-700">
              <span className="text-2xl">{badge.icon}</span>
              <span className="font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Benefits Section */}
      <Section className="bg-gradient-to-b from-white to-emerald-50/30">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 mb-4">
              <span className="text-emerald-600 text-sm font-semibold uppercase tracking-wider">Why GLP-1 Works</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              A <span className="text-emerald-600">Medical Approach</span> to Weight Loss
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Stop the endless cycle of dieting. GLP-1 medications target the root cause—your appetite hormones.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit, idx) => (
            <FadeUp key={benefit.title} delayMs={60 * idx}>
              <div className="group p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Medications Section */}
      <Section className="bg-white">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Medications We <span className="text-emerald-600">Offer</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Both are weekly injections with proven weight loss results
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <FadeUp delayMs={60}>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💊</span>
                <h3 className="text-2xl font-bold text-blue-900">Semaglutide</h3>
              </div>
              <p className="text-sm text-blue-700 mb-4">Brand names: Ozempic®, Wegovy®</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>GLP-1 receptor agonist</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Average 15-17% weight loss in trials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Gradual dose increase over 16-20 weeks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Well-studied, long track record</span>
                </li>
              </ul>
            </div>
          </FadeUp>

          <FadeUp delayMs={120}>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💉</span>
                <h3 className="text-2xl font-bold text-purple-900">Tirzepatide</h3>
              </div>
              <p className="text-sm text-purple-700 mb-4">Brand names: Mounjaro®, Zepbound®</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Dual GIP/GLP-1 receptor agonist</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Average 20-22% weight loss in trials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Targets two hormone pathways</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Newer medication with strong results</span>
                </li>
              </ul>
            </div>
          </FadeUp>
        </div>

        <FadeUp delayMs={180}>
          <p className="text-center text-gray-500 text-sm mt-8 max-w-2xl mx-auto">
            We use compounded versions of these medications from licensed pharmacies. Your provider will recommend the best option for you.
          </p>
        </FadeUp>
      </Section>

      {/* Process Section */}
      <Section className="bg-gradient-to-b from-emerald-50/50 to-white">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Your Weight Loss <span className="text-emerald-600">Journey</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600">Simple, supportive, medically supervised</p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-4 gap-6">
          {PROCESS.map((p, idx) => (
            <FadeUp key={p.step} delayMs={80 * idx}>
              <div className="relative p-6 rounded-2xl bg-white border-2 border-gray-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg mb-4">
                  {p.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-600 text-sm">{p.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Section>

      {/* Testimonial + Expert Widget */}
      <Section className="bg-white">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <FadeUp>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200">
                <div className="flex items-center gap-1 text-emerald-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-2xl text-gray-800 font-medium italic leading-relaxed">
                  "Down 35 lbs and feeling incredible. The team at Hello Gorgeous made everything so easy—the weekly injections, the check-ins, the support. This is the first thing that's actually worked for me."
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">Michelle R.</p>
                    <p className="text-gray-500 text-sm">Aurora, IL</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          <div className="lg:col-span-5">
            <FadeUp delayMs={120}>
              <ServiceExpertWidget serviceName="Weight Loss Therapy" slug="weight-loss-therapy" category="Wellness" />
            </FadeUp>
          </div>
        </div>
      </Section>

      {/* Clinical Info */}
      <Section className="bg-gradient-to-b from-white to-emerald-50/50">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 mb-4">
              <span className="text-emerald-600 text-sm font-semibold uppercase tracking-wider">Clinical Info</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              GLP-1 Medications & <span className="text-emerald-600">Safety</span>
            </h2>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <FadeUp delayMs={60}>
            <div className="p-6 rounded-2xl border-2 border-gray-200 bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>⚠️</span> Contraindications
              </h3>
              <p className="text-gray-600 text-sm mb-2">We do not prescribe GLP-1 therapy if you have:</p>
              <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                <li>Personal or family history of medullary thyroid cancer</li>
                <li>Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)</li>
                <li>Pregnancy or planning pregnancy</li>
                <li>History of pancreatitis</li>
                <li>Severe gastroparesis</li>
              </ul>
            </div>
          </FadeUp>
          <FadeUp delayMs={80}>
            <div className="p-6 rounded-2xl border-2 border-gray-200 bg-white">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>💊</span> Common Side Effects
              </h3>
              <p className="text-gray-600 text-sm mb-2">Most common, especially when starting:</p>
              <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                <li>Nausea (usually temporary)</li>
                <li>Constipation or diarrhea</li>
                <li>Decreased appetite (this is how it works!)</li>
                <li>Fatigue initially</li>
              </ul>
              <p className="text-gray-500 text-xs mt-3">Side effects typically improve as your body adjusts.</p>
            </div>
          </FadeUp>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-white">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked <span className="text-emerald-600">Questions</span>
            </h2>
          </div>
        </FadeUp>

        <div className="max-w-3xl mx-auto space-y-4">
          {WEIGHT_LOSS_FAQS.map((faq, idx) => (
            <FadeUp key={faq.question} delayMs={40 * idx}>
              <details className="group rounded-2xl border-2 border-gray-200 bg-white overflow-hidden hover:border-emerald-200 transition-colors">
                <summary className="cursor-pointer p-6 flex items-center justify-between text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                  <span>{faq.question}</span>
                  <span className="ml-4 flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-open:rotate-45 transition-transform">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Location SEO Section */}
      <Section className="bg-gradient-to-b from-emerald-50/50 to-white">
        <FadeUp>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Medical Weight Loss Near <span className="text-emerald-600">Oswego, IL</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Looking for medical weight loss in <strong>Oswego, Aurora, Naperville, or Plainfield</strong>? Hello Gorgeous Med Spa offers Semaglutide and Tirzepatide GLP-1 weight loss programs supervised by licensed nurse practitioners. We're conveniently located in downtown Oswego, serving all of Kendall County and the western suburbs.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/weight-loss-oswego-il" className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition">
                Weight Loss Oswego
              </Link>
              <Link href="/weight-loss-naperville-il" className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition">
                Weight Loss Naperville
              </Link>
              <Link href="/weight-loss-aurora-il" className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition">
                Weight Loss Aurora
              </Link>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* Final CTA */}
      <Section className="bg-gradient-to-b from-emerald-900 to-black text-white">
        <FadeUp>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Ready to Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Weight Loss Journey</span>?
            </h2>

            <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
              Schedule your consultation today. We'll evaluate your health history, discuss your goals, and create a personalized plan.
            </p>

            <div className="mt-8">
              <CTA href={BOOKING_URL} variant="gradient" className="text-lg px-10 py-5 shadow-xl shadow-emerald-500/25 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                Book Weight Loss Consultation
              </CTA>
            </div>

            <p className="mt-8 text-white/50 text-sm">
              Questions? Call us at <a href="tel:630-636-6193" className="text-emerald-400 hover:underline">{SITE.phone}</a> or text <a href="sms:630-881-3398" className="text-emerald-400 hover:underline">630-881-3398</a>
            </p>
          </div>
        </FadeUp>
      </Section>

      {/* Medical Disclaimer */}
      <div className="bg-gray-100 border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            <strong>Disclaimer:</strong> Results vary by individual. GLP-1 medications require a medical evaluation to determine candidacy.
            All treatments supervised by licensed nurse practitioners. Not intended to diagnose, treat, cure, or prevent any disease.
            See provider for details and to discuss risks and benefits.
          </p>
        </div>
      </div>
    </>
  );
}
