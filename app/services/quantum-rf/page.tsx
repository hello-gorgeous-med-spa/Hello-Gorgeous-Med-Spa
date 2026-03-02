import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "QuantumRF Skin Tightening | Subdermal RF Contouring | Oswego IL",
  description:
    "QuantumRF by InMode at Hello Gorgeous Med Spa Oswego IL. Minimally invasive subdermal radiofrequency for skin tightening, fat reduction, jawline contouring. 10 & 25 pin probes. Book consultation.",
  path: "/services/quantum-rf",
});

const QUANTUM_FAQS = [
  {
    question: "What is QuantumRF?",
    answer:
      "QuantumRF is a minimally invasive radiofrequency treatment by InMode that uses a thin cannula placed beneath the skin to deliver controlled RF energy directly to deeper tissue layers. Unlike surface-level treatments, it works at greater depth for more dramatic skin tightening and fat reduction results.",
  },
  {
    question: "How is QuantumRF different from Morpheus8?",
    answer:
      "While Morpheus8 uses microneedles to deliver RF energy through the skin surface, QuantumRF delivers RF energy subdermally (beneath the skin) via a thin cannula. This allows QuantumRF to target deeper fat and tissue for more significant contouring, especially in areas like the jawline, neck, and body.",
  },
  {
    question: "What are the QuantumRF 10 and 25 probes?",
    answer:
      "The QuantumRF 10 is a precision probe ideal for smaller, delicate areas like the jawline, jowls, and under the chin. The QuantumRF 25 is designed for larger treatment areas like the abdomen, arms, thighs, and back, providing efficient coverage for body contouring.",
  },
  {
    question: "What areas can QuantumRF treat?",
    answer:
      "QuantumRF effectively treats the jawline, jowls, neck, under the chin (submental fullness), arms, abdomen, knees, inner and outer thighs, back, and any area with loose skin or small pockets of fat that would benefit from tightening and contouring.",
  },
  {
    question: "How many treatments will I need?",
    answer:
      "Many patients achieve their goals with just one QuantumRF session. Some may benefit from additional treatments depending on the area and desired results. Your provider will create a personalized plan during your consultation.",
  },
  {
    question: "What is the recovery like?",
    answer:
      "QuantumRF requires only local anesthesia. You may experience temporary swelling, bruising, or tenderness that typically resolves within a few days. Most patients return to normal routines within a week. Compression garments may be recommended for body treatments.",
  },
  {
    question: "When will I see results?",
    answer:
      "Early visible improvement begins within weeks as swelling subsides. Full results develop over 3-6 months as collagen production continues and the skin tightens. Results are natural-looking and long-lasting.",
  },
  {
    question: "Is QuantumRF painful?",
    answer:
      "QuantumRF is performed under local anesthesia, so you will be comfortable during the procedure. Some patients describe feeling warmth or pressure. Post-procedure discomfort is typically mild and manageable with over-the-counter pain relievers.",
  },
  {
    question: "How does QuantumRF compare to liposuction?",
    answer:
      "QuantumRF is far less invasive than traditional liposuction with significantly less downtime. While it is not designed for large-volume fat removal, it excels at skin tightening and contouring smaller areas of stubborn fat—often achieving results that liposuction alone cannot (tighter skin).",
  },
  {
    question: "How much does QuantumRF cost?",
    answer:
      "Pricing depends on the treatment area and extent of treatment. Consultations are complimentary, and we will provide personalized pricing based on your goals. Financing options are available.",
  },
];

const TREATMENT_AREAS = [
  { area: "Jawline & Jowls", icon: "👤", treatments: ["Sagging jowls", "Jawline definition", "Lower face laxity", "Pre-jowl sulcus"] },
  { area: "Neck & Submental", icon: "🦢", treatments: ["Double chin", "Turkey neck", "Neck bands", "Submental fullness"] },
  { area: "Arms", icon: "💪", treatments: ["Bat wings", "Upper arm laxity", "Crepey skin", "Arm contouring"] },
  { area: "Abdomen", icon: "🎯", treatments: ["Loose belly skin", "Post-weight loss", "Mommy makeover", "Love handles"] },
  { area: "Thighs", icon: "🦵", treatments: ["Inner thigh laxity", "Outer thigh", "Above the knee", "Cellulite improvement"] },
  { area: "Back & Bra Area", icon: "✨", treatments: ["Bra bulge", "Back fat", "Flanks", "Skin tightening"] },
];

const BENEFITS = [
  { icon: "🔬", title: "Subdermal RF Energy", desc: "Delivers RF beneath the skin for deeper, more dramatic tissue remodeling than surface treatments" },
  { icon: "💎", title: "Skin Tightening", desc: "Stimulates collagen production for firmer, lifted skin that continues improving for months" },
  { icon: "🎯", title: "Targeted Fat Reduction", desc: "Precisely targets and reduces small pockets of stubborn fat in treated areas" },
  { icon: "⚡", title: "Single Treatment Results", desc: "Many patients achieve their goals with just one session—no series required" },
  { icon: "🧬", title: "Precision Probes", desc: "10 & 25 pin options allow customized treatment for face and body areas" },
  { icon: "✨", title: "Minimal Downtime", desc: "Return to normal activities within days—far less invasive than surgical options" },
];

const BADGES = [
  { label: "FDA-Cleared", emoji: "🏥" },
  { label: "InMode Technology", emoji: "🎓" },
  { label: "Minimally Invasive", emoji: "💉" },
  { label: "Single Treatment", emoji: "⚡" },
];

function QuantumJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${SITE.url}/services/quantum-rf#procedure`,
    name: "QuantumRF Skin Tightening",
    alternateName: ["QuantumRF 10", "QuantumRF 25", "Subdermal RF", "Radiofrequency Skin Tightening", "InMode QuantumRF"],
    description: "QuantumRF minimally invasive subdermal radiofrequency treatment for skin tightening, fat reduction, and body contouring. Features 10 and 25 pin probes for customized face and body treatments.",
    procedureType: "NoninvasiveProcedure",
    bodyLocation: ["Face", "Jawline", "Neck", "Arms", "Abdomen", "Thighs", "Back"],
    howPerformed: "QuantumRF uses a thin cannula placed beneath the skin to deliver controlled radiofrequency energy directly to deeper tissue layers, stimulating collagen production and reducing fat.",
    preparation: "Local anesthesia applied to treatment area. Avoid blood thinners and anti-inflammatory medications prior to treatment.",
    followup: "Temporary swelling and bruising for a few days. Results develop over 3-6 months as collagen rebuilds. Most patients return to normal activities within a week.",
    status: "EventScheduled",
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
        name: "QuantumRF Consultation",
      },
    },
  };
}

function FAQJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUANTUM_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export default function QuantumRFPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(QuantumJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQJsonLd()) }}
      />
      <main className="bg-white">
        {/* Hero */}
        <section className="relative bg-black text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-blue-950/30" />
          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <span className="animate-pulse">⚡</span>
              <span>NOW AVAILABLE — Advanced Subdermal RF Technology</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              QuantumRF
              <br />
              <span className="text-blue-400">Subdermal Contouring</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-4">
              Minimally invasive radiofrequency that works beneath the skin for dramatic skin tightening and fat reduction—without surgery.
            </p>
            <p className="text-white/70 mb-6 max-w-xl">
              Featuring <strong>QuantumRF 10</strong> for precise facial contouring and <strong>QuantumRF 25</strong> for efficient body treatments.
            </p>
            
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
              <span>✓ Local Anesthesia Only</span>
              <span>✓ Single Treatment Option</span>
              <span>✓ Results in 3-6 Months</span>
              <span>✓ Face + Body</span>
            </div>
          </div>
        </section>

        {/* What is QuantumRF */}
        <section className="py-16 md:py-20 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                  What is QuantumRF?
                </h2>
                <p className="text-lg text-black/80 mb-4">
                  QuantumRF is a <strong>minimally invasive radiofrequency treatment</strong> that delivers controlled RF energy directly beneath the skin using a thin cannula. Unlike surface-level treatments, it works at <strong>deeper tissue layers</strong> for more dramatic results.
                </p>
                <p className="text-black/70 mb-4">
                  This subdermal approach allows QuantumRF to:
                </p>
                <ul className="space-y-2 text-black/80 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span>Tighten and lift loose, sagging skin from within</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span>Reduce small, targeted areas of stubborn fat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span>Stimulate deep collagen production for lasting results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span>Achieve surgical-like results without the surgery</span>
                  </li>
                </ul>
                <p className="text-black/70">
                  Results develop over <strong>3-6 months</strong> as collagen rebuilds and skin continues to tighten—with many patients achieving their goals in just <strong>one treatment</strong>.
                </p>
              </div>
              <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
                <div style={{ position: "relative", paddingTop: "56.25%", width: "100%" }}>
                  <iframe
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    src="https://www.youtube-nocookie.com/embed/skWe-Z-5m_k?rel=0&modestbranding=1"
                    title="InMode QuantumRF - Subdermal RF Technology"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
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
                QuantumRF is an ideal solution for these common aesthetic concerns.
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

        {/* Probe Options */}
        <section className="py-16 md:py-20 bg-black text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                QuantumRF 10 & 25 Probes
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Two specialized probes allow us to customize your treatment for optimal results in any area.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-3xl font-bold">
                    10
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-400">QuantumRF 10</h3>
                    <p className="text-white/60">Precision Facial Probe</p>
                  </div>
                </div>
                <p className="text-white/80 mb-4">
                  The QuantumRF 10 is designed for <strong>smaller, delicate treatment areas</strong> where precision is critical. Its compact size allows for detailed contouring and tightening.
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-white/60">Ideal Treatment Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Jawline", "Jowls", "Under Chin", "Neck", "Brow Area"].map((area) => (
                      <span key={area} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  Perfect for facial rejuvenation and defining the lower face contour.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-3xl font-bold">
                    25
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-400">QuantumRF 25</h3>
                    <p className="text-white/60">Body Contouring Probe</p>
                  </div>
                </div>
                <p className="text-white/80 mb-4">
                  The QuantumRF 25 is engineered for <strong>larger body treatment areas</strong>, providing efficient coverage for significant skin tightening and fat reduction.
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-white/60">Ideal Treatment Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Abdomen", "Arms", "Thighs", "Back", "Flanks", "Knees"].map((area) => (
                      <span key={area} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  Ideal for body contouring, post-weight loss skin tightening, and mommy makeovers.
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
                Why QuantumRF?
              </h2>
              <p className="text-black/70 max-w-2xl mx-auto">
                Subdermal RF delivers results that surface treatments simply cannot match—without the risks and downtime of surgery.
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

        {/* Before & After Results Gallery */}
        <section className="py-16 md:py-20 bg-black text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Real Results
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                See the transformative power of QuantumRF subdermal radiofrequency. Results from actual InMode patients.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group relative rounded-xl overflow-hidden bg-zinc-900">
                <Image
                  src="/images/morpheus8/quantumrf-10-jawline.png"
                  alt="QuantumRF 10 before and after - jawline tightening and contouring"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <p className="text-white font-medium">Jawline Definition</p>
                  <p className="text-white/60 text-sm">QuantumRF 10</p>
                </div>
              </div>

              <div className="group relative rounded-xl overflow-hidden bg-zinc-900">
                <Image
                  src="/images/morpheus8/quantumrf-10-face.png"
                  alt="QuantumRF 10 before and after - facial contouring"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <p className="text-white font-medium">Facial Contouring</p>
                  <p className="text-white/60 text-sm">QuantumRF 10</p>
                </div>
              </div>

              <div className="group relative rounded-xl overflow-hidden bg-zinc-900">
                <Image
                  src="/images/morpheus8/facetite-chin.png"
                  alt="Submental before and after - double chin reduction"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <p className="text-white font-medium">Double Chin Reduction</p>
                  <p className="text-white/60 text-sm">Subdermal RF</p>
                </div>
              </div>

              <div className="group relative rounded-xl overflow-hidden bg-zinc-900">
                <Image
                  src="/images/morpheus8/quantumrf-25-abdomen-skin.png"
                  alt="QuantumRF 25 before and after - abdomen skin tightening"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <p className="text-white font-medium">Abdomen Tightening</p>
                  <p className="text-white/60 text-sm">QuantumRF 25</p>
                </div>
              </div>

              <div className="group relative rounded-xl overflow-hidden bg-zinc-900">
                <Image
                  src="/images/morpheus8/quantumrf-25-abdomen.png"
                  alt="QuantumRF 25 before and after - body contouring"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <p className="text-white font-medium">Body Contouring</p>
                  <p className="text-white/60 text-sm">QuantumRF 25</p>
                </div>
              </div>

              <div className="group relative rounded-xl overflow-hidden bg-zinc-900">
                <Image
                  src="/images/morpheus8/bodytite-arm.png"
                  alt="Arm skin tightening before and after"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <p className="text-white font-medium">Arm Tightening</p>
                  <p className="text-white/60 text-sm">Subdermal RF</p>
                </div>
              </div>
            </div>
            <p className="text-center text-white/50 text-sm mt-8">
              Results may vary. Images courtesy of InMode. Individual results depend on treatment area and patient factors.
            </p>
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
                QuantumRF effectively treats areas where skin laxity and stubborn fat are concerns.
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
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
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
                QuantumRF vs. Other Treatments
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-left font-semibold">Surface RF</th>
                    <th className="px-6 py-4 text-left font-semibold">Liposuction</th>
                    <th className="px-6 py-4 text-left font-semibold text-blue-400">QuantumRF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <td className="px-6 py-4 font-medium text-black">Treatment Depth</td>
                    <td className="px-6 py-4 text-black/70">Surface only</td>
                    <td className="px-6 py-4 text-black/70">Deep (invasive)</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">Subdermal (minimally invasive)</td>
                  </tr>
                  <tr className="bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-black">Skin Tightening</td>
                    <td className="px-6 py-4 text-black/70">Mild</td>
                    <td className="px-6 py-4 text-black/70">None (may worsen)</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">Significant</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-black">Fat Reduction</td>
                    <td className="px-6 py-4 text-black/70">Minimal</td>
                    <td className="px-6 py-4 text-black/70">Significant</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">Moderate + tightening</td>
                  </tr>
                  <tr className="bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-black">Anesthesia</td>
                    <td className="px-6 py-4 text-black/70">None/topical</td>
                    <td className="px-6 py-4 text-black/70">General</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">Local only</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-black">Downtime</td>
                    <td className="px-6 py-4 text-black/70">None</td>
                    <td className="px-6 py-4 text-black/70">2-4 weeks</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">Few days to 1 week</td>
                  </tr>
                  <tr className="bg-zinc-50">
                    <td className="px-6 py-4 font-medium text-black">Sessions Needed</td>
                    <td className="px-6 py-4 text-black/70">Multiple (4-6+)</td>
                    <td className="px-6 py-4 text-black/70">Usually 1</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">Often 1</td>
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
              {QUANTUM_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white rounded-xl border border-zinc-200 overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-zinc-50 transition-colors">
                    <span className="font-medium text-black pr-4">{faq.question}</span>
                    <span className="text-blue-500 group-open:rotate-180 transition-transform">
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
              Ready for Dramatic Results?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Schedule your QuantumRF consultation and discover how subdermal RF can transform your face and body—without surgery.
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
              Related Treatments
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Link
                href="/services/morpheus8"
                className="block bg-zinc-50 rounded-xl p-6 hover:shadow-lg transition group"
              >
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold text-black group-hover:text-pink-600 transition mb-2">
                  Morpheus8 RF
                </h3>
                <p className="text-black/70 text-sm">
                  RF microneedling for skin texture, scars, and collagen stimulation.
                </p>
              </Link>
              <Link
                href="/services/solaria-co2"
                className="block bg-zinc-50 rounded-xl p-6 hover:shadow-lg transition group"
              >
                <div className="text-3xl mb-3">✨</div>
                <h3 className="text-lg font-semibold text-black group-hover:text-pink-600 transition mb-2">
                  Solaria CO₂ Laser
                </h3>
                <p className="text-black/70 text-sm">
                  Gold standard skin resurfacing for wrinkles, scars, and sun damage.
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
          </div>
        </section>
      </main>
    </>
  );
}
