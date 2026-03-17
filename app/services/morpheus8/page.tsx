import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TechBlogPromo } from "@/components/TechBlogPromo";
import { pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Morpheus8 RF Microneedling | Face & Body Contouring | Oswego IL",
  description:
    "Morpheus8 with Burst & Quantum technology at Hello Gorgeous Med Spa Oswego IL. Deep RF microneedling for skin tightening, fat reduction, acne scars, wrinkles. Face & body treatments. Book consultation.",
  path: "/services/morpheus8",
});

const MORPHEUS8_FAQS = [
  {
    question: "What is Morpheus8?",
    answer:
      "Morpheus8 is an FDA-cleared fractional RF microneedling device by InMode that combines ultra-fine, gold-coated microneedles with radiofrequency energy. It penetrates up to 8mm deep—far deeper than traditional microneedling—to remodel collagen, tighten skin, and reduce fat in both face and body areas.",
  },
  {
    question: "What is Morpheus8 Burst?",
    answer:
      "Morpheus8 Burst delivers bipolar RF energy at multiple tissue depths in a single pulse. At a 7mm setting, energy deploys at 7mm, 5mm, and 3mm simultaneously. This multi-depth approach creates comprehensive collagen remodeling and is ideal for body contouring and skin tightening on larger areas.",
  },
  {
    question: "What is Quantum technology?",
    answer:
      "Quantum refers to our suite of specialized probes (10, 17, and 25 pins) that allow us to customize treatment depth and intensity for different areas. The 10-pin probe is precise for delicate areas, while larger probes treat body areas more efficiently with exceptional fat reduction and skin tightening.",
  },
  {
    question: "What can Morpheus8 treat?",
    answer:
      "Morpheus8 treats fine lines and wrinkles, acne scars, stretch marks, skin laxity, enlarged pores, uneven texture, jowls and submental fullness (double chin), body contouring (abdomen, thighs, arms), cellulite, and overall skin rejuvenation on virtually any body area.",
  },
  {
    question: "How many treatments will I need?",
    answer:
      "Most clients see optimal results with 3 treatments spaced 4-6 weeks apart. Some areas or concerns may require additional sessions. Results continue improving for 3-6 months as collagen rebuilds. Maintenance treatments every 6-12 months help sustain results.",
  },
  {
    question: "What is the downtime?",
    answer:
      "Expect 2-5 days of redness, mild swelling, and pinpoint marks. Most clients return to normal activities within 3-4 days. Makeup can typically be applied after 24-48 hours. Body treatments may have slightly longer recovery. We'll provide detailed aftercare instructions.",
  },
  {
    question: "Does Morpheus8 hurt?",
    answer:
      "We apply medical-grade topical numbing cream for 45-60 minutes before treatment to maximize comfort. Most clients describe the sensation as warmth and mild pressure. Face treatments are very tolerable; body treatments may feel more intense but remain manageable.",
  },
  {
    question: "How does Morpheus8 compare to traditional microneedling?",
    answer:
      "Morpheus8 goes far beyond traditional microneedling. The addition of radiofrequency energy at depths up to 8mm (vs 1-2mm for standard microneedling) creates dramatically more collagen remodeling, skin tightening, and fat reduction. Results are typically more significant and longer-lasting.",
  },
  {
    question: "Can Morpheus8 be combined with other treatments?",
    answer:
      "Yes! Many clients combine Morpheus8 with PRP/PRF for enhanced results, Botox and fillers for comprehensive facial rejuvenation, or our Solaria CO₂ laser for maximum transformation. We'll create a customized treatment plan during your consultation.",
  },
  {
    question: "How much does Morpheus8 cost?",
    answer:
      "Pricing depends on treatment area and whether you're treating face, body, or both. Face treatments start around $800-1,200 per session. Body areas vary based on size. Package pricing available. Schedule a consultation for personalized pricing.",
  },
];

const TREATMENT_AREAS = [
  { area: "Face & Neck", icon: "👤", treatments: ["Fine lines & wrinkles", "Acne scars", "Enlarged pores", "Skin laxity", "Jowls"] },
  { area: "Under Eyes & Periorbital", icon: "👁️", treatments: ["Dark circles", "Crepey skin", "Fine lines", "Hollow appearance"] },
  { area: "Abdomen", icon: "🎯", treatments: ["Loose skin", "Stretch marks", "Fat reduction", "Post-pregnancy laxity"] },
  { area: "Arms", icon: "💪", treatments: ["Crepey skin", "Skin laxity", "Bat wings", "Texture improvement"] },
  { area: "Thighs & Buttocks", icon: "🦵", treatments: ["Cellulite", "Skin tightening", "Stretch marks", "Dimpling"] },
  { area: "Chest & Décolletage", icon: "✨", treatments: ["Sun damage", "Crepey skin", "Wrinkles", "Texture"] },
];

const BENEFITS = [
  { icon: "🔬", title: "Deepest RF Penetration", desc: "Up to 8mm depth reaches tissue that other devices can't—true subdermal remodeling" },
  { icon: "💎", title: "Collagen & Elastin Boost", desc: "Dual-action heat triggers immediate tightening + long-term collagen production" },
  { icon: "🎯", title: "Fat Reduction", desc: "RF energy at depth targets and reduces subcutaneous fat for body contouring" },
  { icon: "⚡", title: "Burst Technology", desc: "Multi-depth energy delivery in a single pulse for comprehensive treatment" },
  { icon: "🧬", title: "Customizable Probes", desc: "10, 17 & 25 pin Quantum probes for precision treatment of any area" },
  { icon: "✨", title: "Minimal Downtime", desc: "Return to normal activities in 2-4 days—far less than surgical alternatives" },
];

const BADGES = [
  { label: "FDA-Cleared Device", emoji: "🏥" },
  { label: "InMode Certified", emoji: "🎓" },
  { label: "All Skin Types", emoji: "🌈" },
  { label: "Face + Body", emoji: "✨" },
];

function MorpheusJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${SITE.url}/services/morpheus8#procedure`,
    name: "Morpheus8 RF Microneedling",
    alternateName: ["Morpheus8 Burst", "Morpheus8 Quantum", "RF Microneedling", "Radiofrequency Microneedling"],
    description: "Morpheus8 fractional RF microneedling treatment for skin tightening, fat reduction, acne scars, and body contouring. Features Burst and Quantum technology with 10, 17, and 25 pin probes for customized face and body treatments.",
    procedureType: "NoninvasiveProcedure",
    bodyLocation: ["Face", "Neck", "Abdomen", "Arms", "Thighs", "Buttocks", "Chest"],
    howPerformed: "Morpheus8 combines microneedling with radiofrequency energy delivered at multiple depths up to 8mm. The device creates controlled micro-injuries while delivering heat to stimulate collagen production and fat reduction.",
    preparation: "Topical numbing cream applied 45-60 minutes before treatment. Avoid sun exposure, retinoids, and blood thinners prior to treatment.",
    followup: "2-5 days mild redness and swelling. Results improve over 3-6 months as collagen rebuilds. Typically 3 treatments recommended.",
    status: "EventScheduled",
    image: `${SITE.url}/images/morpheus8/morpheus8-hero.jpg`,
    provider: {
      "@type": "MedicalBusiness",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/book`,
        actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
      },
      result: {
        "@type": "Reservation",
        name: "Morpheus8 Consultation",
      },
    },
  };
}

function FAQJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MORPHEUS8_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export default function Morpheus8Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(MorpheusJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQJsonLd()) }}
      />
      <main className="bg-white">
        {/* Hero */}
        <section className="relative bg-black text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-pink-950/30" />
          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <span className="animate-pulse">🔥</span>
              <span>NOW AVAILABLE — Just Added from InMode Convention!</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Morpheus8
              <br />
              <span className="text-pink-400">RF Microneedling</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-4">
              The deepest RF microneedling technology available. Face and body contouring, skin tightening, and fat reduction in one powerful treatment.
            </p>
            <p className="text-white/70 mb-6 max-w-xl">
              Featuring <strong>Burst</strong> multi-depth technology and <strong>Quantum</strong> precision probes (10, 17, 25 pins) for customized treatment of any area.
            </p>
            
            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {BADGES.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white/90"
                >
                  <span>{badge.emoji}</span>
                  <span>{badge.label}</span>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white hover:bg-[#c9006e] transition"
              >
                Book Consultation
              </Link>
              <Link
                href="#treatment-areas"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-black transition"
              >
                View Treatment Areas
              </Link>
              <Link
                href="tel:6306366193"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/50 px-6 py-3 font-semibold text-white/90 hover:bg-white hover:text-black transition"
              >
                Call (630) 636-6193
              </Link>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
              <span>✓ 2-5 Days Downtime</span>
              <span>✓ Results in 3-6 Months</span>
              <span>✓ All Skin Types</span>
              <span>✓ Face + Body</span>
            </div>
          </div>
        </section>

        {/* Morpheus8 Pricing — own category */}
        <section className="py-16 md:py-20 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-black mb-2 text-center">Morpheus8 Pricing</h2>
            <p className="text-black/70 text-center mb-10 max-w-xl mx-auto">
              RF microneedling for face and body. Single session or save with a package of 3.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="rounded-2xl border-2 border-pink-200 bg-white p-8 text-center shadow-sm">
                <h3 className="text-xl font-bold text-black mb-1">Single Session</h3>
                <p className="text-3xl font-bold text-[#E6007E] mb-4">From $800</p>
                <p className="text-sm text-black/70 mb-6">One Morpheus8 treatment. Price varies by area (face, neck, body).</p>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white hover:bg-[#c9006e] transition"
                >
                  Book consultation
                </Link>
              </div>
              <div className="rounded-2xl border-2 border-pink-400 bg-pink-50/50 p-8 text-center shadow-sm">
                <h3 className="text-xl font-bold text-black mb-1">Package of 3</h3>
                <p className="text-3xl font-bold text-[#E6007E] mb-4">$2,100</p>
                <p className="text-sm text-black/70 mb-6">Three sessions (recommended for optimal results). Applied to face or body.</p>
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white hover:bg-[#c9006e] transition"
                >
                  Book consultation
                </Link>
              </div>
            </div>
            <p className="text-center text-sm text-black/60 mt-6">Financing available. Consultation required for personalized pricing by area.</p>
          </div>
        </section>

        {/* What is Morpheus8 */}
        <section className="py-16 md:py-20 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                  What is Morpheus8?
                </h2>
                <p className="text-lg text-black/80 mb-4">
                  Morpheus8 is an FDA-cleared fractional RF microneedling device that combines <strong>ultra-fine gold-coated microneedles</strong> with <strong>radiofrequency energy</strong> to penetrate up to <strong>8mm deep</strong>—far deeper than any traditional microneedling treatment.
                </p>
                <p className="text-black/70 mb-4">
                  This dual-action approach creates thousands of precise microchannels while delivering controlled heat (65-75°C) that:
                </p>
                <ul className="space-y-2 text-black/80 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">✓</span>
                    <span>Causes existing collagen fibers to contract for immediate tightening</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">✓</span>
                    <span>Triggers your body's natural wound-healing cascade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">✓</span>
                    <span>Stimulates fibroblasts to produce fresh collagen and elastin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">✓</span>
                    <span>Targets and reduces subcutaneous fat for body contouring</span>
                  </li>
                </ul>
                <p className="text-black/70">
                  Results continue improving for <strong>up to 6 months</strong> as your body produces new collagen—delivering medical-grade skin tightening without surgery.
                </p>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/skWe-Z-5m_k?si=HiL-3BRzaFfDBcjC"
                  title="Morpheus8 RF Microneedling - How It Works"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* Common Concerns We Treat */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Common Concerns We Treat
              </h2>
              <p className="text-black/70 max-w-2xl mx-auto">
                Morpheus8 and QuantumRF are ideal solutions for these common aesthetic concerns.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="relative rounded-xl overflow-hidden group">
                <Image
                  src="/images/morpheus8/concern-ozempic-butt.png"
                  alt="Ozempic butt and breasts - skin laxity after weight loss"
                  width={300}
                  height={350}
                  className="w-full h-auto"
                />
              </div>
              <div className="relative rounded-xl overflow-hidden group">
                <Image
                  src="/images/morpheus8/concern-loose-belly.png"
                  alt="Loose belly skin treatment"
                  width={300}
                  height={350}
                  className="w-full h-auto"
                />
              </div>
              <div className="relative rounded-xl overflow-hidden group">
                <Image
                  src="/images/morpheus8/concern-tech-neck.png"
                  alt="Tech neck treatment"
                  width={300}
                  height={350}
                  className="w-full h-auto"
                />
              </div>
              <div className="relative rounded-xl overflow-hidden group">
                <Image
                  src="/images/morpheus8/concern-jowls-cheeks.png"
                  alt="Sagging jowls and hollow cheeks treatment"
                  width={300}
                  height={350}
                  className="w-full h-auto"
                />
              </div>
              <div className="relative rounded-xl overflow-hidden group">
                <Image
                  src="/images/morpheus8/concern-bat-wings.png"
                  alt="Bat wings arm skin tightening"
                  width={300}
                  height={350}
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="text-center mt-8">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white hover:bg-[#c9006e] transition"
              >
                Book Your Consultation
              </Link>
            </div>
          </div>
        </section>

        {/* Our Technology - Burst & Quantum */}
        <section className="py-16 md:py-20 bg-black text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Technology: Burst + Quantum
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                We invested in the most advanced Morpheus8 configuration available—Burst mode with the complete Quantum probe suite.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Burst Technology */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-pink-400 mb-4">Morpheus8 Burst</h3>
                <p className="text-white/80 mb-4">
                  Burst technology delivers bipolar RF energy at <strong>multiple tissue depths in a single pulse</strong>. Unlike standard single-depth treatments, Burst creates comprehensive collagen remodeling throughout the dermis and subdermis.
                </p>
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <p className="text-sm text-white/70 mb-2">Example: 7mm Burst Setting</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                        <span className="text-sm">7mm depth</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-pink-400 rounded-full"></div>
                        <span className="text-sm">5mm depth</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                        <span className="text-sm">3mm depth</span>
                      </div>
                    </div>
                    <div className="text-3xl">→</div>
                    <div className="text-sm text-white/80">
                      All layers treated simultaneously
                    </div>
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  Ideal for body contouring, fat reduction, and treating larger areas efficiently.
                </p>
              </div>

              {/* Quantum Probes */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-pink-400 mb-4">Quantum Probes</h3>
                <p className="text-white/80 mb-4">
                  Our Quantum probe suite includes <strong>10, 17, and 25 pin configurations</strong> that allow precise customization for every treatment area and skin concern.
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">10 Pin</span>
                      <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">Precision</span>
                    </div>
                    <span className="text-sm text-white/60">Delicate areas, periorbital</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">17 Pin</span>
                      <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">Versatile</span>
                    </div>
                    <span className="text-sm text-white/60">Face, neck, smaller body areas</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">25 Pin</span>
                      <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">Coverage</span>
                    </div>
                    <span className="text-sm text-white/60">Body contouring, large areas</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  The right probe ensures optimal results for your specific goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Why Morpheus8?
              </h2>
              <p className="text-black/70 max-w-2xl mx-auto">
                The most advanced RF microneedling technology delivers results other treatments simply can't match.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-zinc-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="text-3xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-black mb-2">{benefit.title}</h3>
                  <p className="text-black/70 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Treatment Areas */}
        <section id="treatment-areas" className="py-16 md:py-20 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Treatment Areas
              </h2>
              <p className="text-black/70 max-w-2xl mx-auto">
                Morpheus8 can treat virtually any area of the face and body. Here's what we commonly address.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TREATMENT_AREAS.map((area) => (
                <div
                  key={area.area}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-zinc-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{area.icon}</span>
                    <h3 className="text-xl font-semibold text-black">{area.area}</h3>
                  </div>
                  <ul className="space-y-2">
                    {area.treatments.map((treatment) => (
                      <li key={treatment} className="flex items-center gap-2 text-black/70 text-sm">
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full flex-shrink-0"></span>
                        {treatment}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Morpheus8 vs. Traditional Microneedling
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-left font-semibold">Traditional Microneedling</th>
                    <th className="px-6 py-4 text-left font-semibold text-pink-400">Morpheus8</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <td className="px-6 py-4 font-medium text-black">Penetration Depth</td>
                    <td className="px-6 py-4 text-black/70">1-2mm</td>
                    <td className="px-6 py-4 text-pink-600 font-medium">Up to 8mm</td>
                  </tr>
                  <tr className="bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-black">RF Energy</td>
                    <td className="px-6 py-4 text-black/70">None</td>
                    <td className="px-6 py-4 text-pink-600 font-medium">Yes — bipolar RF</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-black">Skin Tightening</td>
                    <td className="px-6 py-4 text-black/70">Minimal</td>
                    <td className="px-6 py-4 text-pink-600 font-medium">Significant</td>
                  </tr>
                  <tr className="bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-black">Fat Reduction</td>
                    <td className="px-6 py-4 text-black/70">No</td>
                    <td className="px-6 py-4 text-pink-600 font-medium">Yes — targets subcutaneous fat</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-black">Body Treatment</td>
                    <td className="px-6 py-4 text-black/70">Limited effectiveness</td>
                    <td className="px-6 py-4 text-pink-600 font-medium">Highly effective</td>
                  </tr>
                  <tr className="bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-black">Collagen Remodeling</td>
                    <td className="px-6 py-4 text-black/70">Surface-level</td>
                    <td className="px-6 py-4 text-pink-600 font-medium">Deep dermal + subdermal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20 bg-zinc-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {MORPHEUS8_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white rounded-xl border border-zinc-200 overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-zinc-50 transition-colors">
                    <span className="font-medium text-black pr-4">{faq.question}</span>
                    <span className="text-pink-500 group-open:rotate-180 transition-transform">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 8l4 4 4-4" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-4 text-black/70 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Skin?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Schedule your Morpheus8 consultation and discover what our advanced RF microneedling technology can do for your face and body.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-8 py-4 text-lg font-semibold text-white hover:bg-[#c9006e] transition"
              >
                Book Consultation
              </Link>
              <Link
                href="tel:6306366193"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-black transition"
              >
                Call (630) 636-6193
              </Link>
            </div>
            <p className="mt-6 text-white/60 text-sm">
              Free consultation · No obligation · {SITE.reviewRating}★ ({SITE.reviewCount} reviews)
            </p>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-black mb-8 text-center">
              Enhance Your Results
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Link
                href="/services/solaria-co2"
                className="block bg-zinc-50 rounded-xl p-6 hover:shadow-lg transition group"
              >
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold text-black group-hover:text-pink-600 transition mb-2">
                  Solaria CO₂ Laser
                </h3>
                <p className="text-black/70 text-sm">
                  Combine with CO₂ for maximum skin resurfacing and rejuvenation.
                </p>
              </Link>
              <Link
                href="/services/prf-prp"
                className="block bg-zinc-50 rounded-xl p-6 hover:shadow-lg transition group"
              >
                <div className="text-3xl mb-3">🧬</div>
                <h3 className="text-lg font-semibold text-black group-hover:text-pink-600 transition mb-2">
                  PRP/PRF Therapy
                </h3>
                <p className="text-black/70 text-sm">
                  Add your own growth factors to enhance healing and results.
                </p>
              </Link>
              <Link
                href="/services/botox-dysport-jeuveau"
                className="block bg-zinc-50 rounded-xl p-6 hover:shadow-lg transition group"
              >
                <div className="text-3xl mb-3">💉</div>
                <h3 className="text-lg font-semibold text-black group-hover:text-pink-600 transition mb-2">
                  Botox & Fillers
                </h3>
                <p className="text-black/70 text-sm">
                  Complete your rejuvenation with strategic injectables.
                </p>
              </Link>
            </div>
            <div className="text-center mt-8">
              <p className="text-black/50 text-sm mb-3">Learn more about our advanced technologies:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/morpheus8-burst-oswego-il" className="px-4 py-2 rounded-full border border-[#E91E8C]/30 text-[#E91E8C] text-sm hover:bg-[#E91E8C]/10 transition-colors font-medium">
                  Morpheus8 Burst Details
                </Link>
                <Link href="/quantum-rf-oswego-il" className="px-4 py-2 rounded-full border border-black/20 text-black/70 text-sm hover:bg-black/5 transition-colors font-medium">
                  QuantumRF Details
                </Link>
                <Link href="/solaria-vs-morpheus8-burst" className="px-4 py-2 rounded-full border border-black/20 text-black/70 text-sm hover:bg-black/5 transition-colors font-medium">
                  Solaria vs Morpheus8
                </Link>
              </div>
            </div>
          </div>
        </section>

        <TechBlogPromo
          title="Morpheus8 Burst, Quantum RF & Solaria — Expert Guides"
          subtitle="Read our blog articles on Burst vs regular Morpheus8, Quantum RF skin tightening, and InMode Solaria CO₂. Serving Oswego, Naperville, Aurora, Plainfield & the Fox Valley."
        />
      </main>
    </>
  );
}
