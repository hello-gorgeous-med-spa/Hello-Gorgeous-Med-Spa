"use client";

import Image from "next/image";
import Link from "next/link";
import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

const INVESTMENT_STATS = [
  { value: "$1M+", label: "Invested in Equipment" },
  { value: "Class IV", label: "Medical-Grade Lasers" },
  { value: "100%", label: "Authentic Products" },
  { value: "FDA", label: "Cleared Devices" },
];

const TECHNOLOGY_PARTNERS = [
  {
    name: "InMode",
    category: "Class IV Medical Lasers",
    investment: "$500,000+",
    description:
      "We own the complete InMode Trifecta — Morpheus8 Burst, QuantumRF, and Solaria CO₂. These are Class IV FDA-cleared medical lasers, not the consumer-grade devices you see at chain spas. Morpheus8 Burst reaches 8mm deep for real fat destruction and skin tightening. Only certified providers can purchase and operate these systems.",
    products: ["Morpheus8 Burst (Face & Body)", "QuantumRF", "Solaria CO₂ Fractional Laser", "Lumecca IPL"],
    certifications: ["InMode Certified Provider", "Advanced Training Certified"],
  },
];

const PHARMACEUTICAL_PARTNERS = [
  {
    name: "Allergan Aesthetics",
    logo: "/images/partners/allergan-logo.png",
    category: "Neuromodulators & Fillers",
    description:
      "Direct purchasing through Allergan's authorized medical channel. Every vial of Botox and Juvéderm is tracked, temperature-controlled, and verified authentic. No gray market. No third-party resellers. No exceptions.",
    products: ["BOTOX® Cosmetic", "Juvéderm Ultra", "Juvéderm Voluma XC", "Juvéderm Vollure XC", "Juvéderm Volbella XC", "SkinMedica"],
    verification: "Alle® Rewards Authorized Provider",
  },
  {
    name: "Evolus / Jeuveau",
    logo: "/images/partners/evolus-logo.png",
    category: "Neuromodulators",
    description:
      "Jeuveau (#NEWTOX) purchased directly from Evolus. Same FDA-cleared botulinum toxin, competitive pricing for our patients. Every unit traceable to manufacturing lot.",
    products: ["Jeuveau® (prabotulinumtoxinA-xvfs)"],
    verification: "Evolus Direct Account",
  },
  {
    name: "Galderma / Dysport",
    logo: "/images/partners/galderma-logo.png",
    category: "Neuromodulators & Fillers",
    description:
      "Dysport and Restylane family products sourced directly from Galderma. Fast-acting, natural-looking results with full manufacturer traceability.",
    products: ["Dysport®", "Restylane®", "Restylane Lyft", "Restylane Kysse", "Restylane Contour"],
    verification: "ASPIRE Galderma Rewards Provider",
  },
  {
    name: "Revance / RHA",
    logo: "/images/partners/revance-logo.png",
    category: "Resilient Hyaluronic Acid Fillers",
    description:
      "RHA Collection — the only FDA-approved fillers designed specifically for dynamic facial movement. Purchased direct from Revance for guaranteed authenticity.",
    products: ["RHA® 2", "RHA® 3", "RHA® 4", "RHA® Redensity"],
    verification: "Revance Direct Account",
  },
];

const MEDICAL_SUPPLIERS = [
  {
    name: "McKesson Medical-Surgical",
    category: "Primary Medical Distributor",
    description:
      "America's largest healthcare distributor. Every syringe, needle, IV line, and medical supply comes through McKesson's verified supply chain. Full cold-chain compliance for temperature-sensitive products.",
  },
  {
    name: "Olympia Pharmacy",
    category: "503A/503B Compounding Pharmacy",
    description:
      "Licensed compounding pharmacy for GLP-1 medications, peptides, and custom formulations. Ryan's NP prescriptive authority allows us to work directly with pharmaceutical-grade compounders — no middlemen, no mystery sources.",
  },
  {
    name: "AnteAGE",
    category: "Regenerative Skincare",
    description:
      "Bone marrow stem cell technology for professional skincare. Purchased direct from AnteAGE for use in our clinical protocols and patient home care.",
  },
];

const CREDENTIALS = [
  {
    icon: "🏥",
    title: "Full Prescriptive Authority",
    description:
      "Ryan Kent, FNP-BC holds full prescriptive authority as a Family Nurse Practitioner in Illinois. This means we can prescribe, compound, and administer medications that many med spas legally cannot.",
  },
  {
    icon: "🔬",
    title: "Direct Manufacturer Accounts",
    description:
      "We purchase directly from Allergan, Evolus, Galderma, Revance, and InMode — not through brokers, not from other providers, not from 'discount' sources. Every product is tracked from factory to your face.",
  },
  {
    icon: "❄️",
    title: "Cold-Chain Compliance",
    description:
      "Temperature-sensitive products like Botox, fillers, and GLP-1 medications require strict cold storage. Our facility maintains pharmaceutical-grade refrigeration with temperature monitoring.",
  },
  {
    icon: "📋",
    title: "Lot Tracking & Documentation",
    description:
      "Every injectable product is logged with manufacturer lot numbers, expiration dates, and patient administration records. If there's ever a recall or quality concern, we can trace exactly what was used.",
  },
];

const FAKE_VS_REAL = [
  {
    fake: "\"Medical-grade\" lasers from Amazon",
    real: "FDA-cleared Class IV InMode systems ($150K+ each)",
  },
  {
    fake: "\"Botox\" from overseas or gray market",
    real: "Allergan Botox with Alle® verification codes",
  },
  {
    fake: "Unlicensed \"injectors\" at Groupon prices",
    real: "Board-certified NP with prescriptive authority",
  },
  {
    fake: "Fillers from unverified sources",
    real: "Direct accounts with Allergan, Galderma, Revance",
  },
  {
    fake: "\"Compounded semaglutide\" from TikTok",
    real: "503A/503B pharmacy with NP oversight",
  },
];

export function OurPromiseContent() {
  return (
    <div className="relative min-h-[100dvh]">
      {/* Ambient brand wash */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 0% 70%, ${BRAND.pink}18 0%, transparent 45%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      <main className="min-w-0">
        {/* Hero */}
        <Section className="relative border-b-4 border-black py-16 lg:py-24 !px-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${BRAND.pink} 0%, transparent 45%),
                radial-gradient(circle at 85% 20%, ${BRAND.pinkHot} 0%, transparent 40%),
                radial-gradient(circle at 70% 80%, ${BRAND.pink}33 0%, transparent 35%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 md:px-6">
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-[#E6007E] animate-pulse" aria-hidden />
                100% Authentic
              </div>
              <p className="text-sm md:text-base uppercase tracking-widest text-[#FFB8DC] font-semibold mb-4">
                Oswego · Naperville · Aurora · Plainfield
              </p>
              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 text-white drop-shadow-lg">
                Our{" "}
                <span
                  className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  Promise
                </span>{" "}
                to You
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-4">
                Over <strong className="text-[#FFB8DC]">$1 million invested</strong> in Class IV medical lasers, 
                FDA-cleared devices, and authentic pharmaceutical products.
              </p>
              <p className="text-base text-white/70 max-w-xl mx-auto">
                No fakes. No shortcuts. No gray market. That's our promise.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book a Consultation
                </CTA>
                <CTA href="#vendors" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  See Our Partners ↓
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Stats Bar */}
        <Section className="bg-black border-b-4 border-black py-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {INVESTMENT_STATS.map((stat, idx) => (
                <FadeUp key={stat.label} delayMs={idx * 100}>
                  <div>
                    <div className="text-3xl md:text-4xl font-black text-[#FF2D8E]">{stat.value}</div>
                    <div className="text-sm text-white/70 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* Why This Matters */}
        <Section className="bg-gradient-to-b from-rose-50 to-white py-16">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div className="rounded-3xl border-4 border-black bg-white p-8 md:p-12 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                  Why We're Telling You This
                </h2>
                <div className="space-y-4 text-black/80 leading-relaxed">
                  <p>
                    <strong className="text-[#E6007E]">The med spa industry has a dirty secret:</strong> Many providers 
                    cut corners. They buy "Botox" from overseas. They use consumer-grade devices and call them "medical lasers." 
                    They hire unlicensed injectors and hope nobody notices.
                  </p>
                  <p>
                    We've had competitors try to convince our patients that we use fake products. That our lasers aren't real. 
                    That we're somehow cutting corners.
                  </p>
                  <p>
                    <strong>The opposite is true.</strong> We've invested over $1 million in authentic, FDA-cleared equipment 
                    and maintain direct purchasing accounts with every major pharmaceutical manufacturer. Ryan's full prescriptive 
                    authority as an NP means we can legally prescribe and compound medications that many med spas cannot.
                  </p>
                  <p className="text-lg font-semibold text-black">
                    This page exists so you never have to wonder. Every product. Every device. Every vendor. Verified.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Fake vs Real Comparison */}
        <Section className="bg-black py-16 border-t-4 border-b-4 border-black">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
                What Others Do vs. What <span className="text-[#FF2D8E]">We</span> Do
              </h2>
              <div className="space-y-4">
                {FAKE_VS_REAL.map((item, idx) => (
                  <FadeUp key={idx} delayMs={idx * 80}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-xl bg-red-950/50 border border-red-500/30 p-4 flex items-center gap-3">
                        <span className="text-2xl">❌</span>
                        <span className="text-red-200 text-sm">{item.fake}</span>
                      </div>
                      <div className="rounded-xl bg-emerald-950/50 border border-emerald-500/30 p-4 flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <span className="text-emerald-200 text-sm">{item.real}</span>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>

        {/* Technology Partners - InMode */}
        <Section id="vendors" className="bg-gradient-to-b from-white to-rose-50 py-16 scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#E6007E]/10 text-[#E6007E] text-xs font-bold uppercase tracking-wider mb-4">
                  Technology Partner
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-black">
                  InMode — Class IV Medical Lasers
                </h2>
                <p className="text-lg text-black/60 mt-4 max-w-2xl mx-auto">
                  $500,000+ invested in the complete InMode Trifecta system
                </p>
              </div>
            </FadeUp>

            {TECHNOLOGY_PARTNERS.map((partner, idx) => (
              <FadeUp key={partner.name} delayMs={idx * 100}>
                <div className="rounded-3xl border-4 border-black bg-white p-8 md:p-10 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="aspect-video bg-gradient-to-br from-[#E6007E] to-[#FF2D8E] rounded-2xl flex items-center justify-center">
                        <span className="text-white text-4xl font-black">InMode</span>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="inline-block px-3 py-1 rounded-full bg-[#E6007E] text-white text-xs font-bold">
                          Investment: {partner.investment}
                        </div>
                        {partner.certifications.map((cert) => (
                          <div key={cert} className="flex items-center gap-2 text-sm text-black/70">
                            <span className="text-[#E6007E]">✓</span> {cert}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h3 className="text-xl font-bold text-[#E6007E] mb-2">{partner.category}</h3>
                      <p className="text-black/80 leading-relaxed mb-6">{partner.description}</p>
                      <div>
                        <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-3">Devices We Own:</h4>
                        <div className="flex flex-wrap gap-2">
                          {partner.products.map((product) => (
                            <span
                              key={product}
                              className="px-3 py-1.5 rounded-full bg-black text-white text-sm font-medium"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </Section>

        {/* Pharmaceutical Partners */}
        <Section className="bg-white py-16 border-t-4 border-black">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#E6007E]/10 text-[#E6007E] text-xs font-bold uppercase tracking-wider mb-4">
                  Pharmaceutical Partners
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-black">
                  100% Authentic Injectables
                </h2>
                <p className="text-lg text-black/60 mt-4 max-w-2xl mx-auto">
                  Direct accounts with every major aesthetic pharmaceutical company
                </p>
              </div>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-6">
              {PHARMACEUTICAL_PARTNERS.map((partner, idx) => (
                <FadeUp key={partner.name} delayMs={idx * 80}>
                  <div className="rounded-3xl border-4 border-black bg-gradient-to-br from-rose-50 to-white p-6 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-white border-2 border-black flex items-center justify-center text-2xl font-bold text-[#E6007E]">
                        {partner.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black">{partner.name}</h3>
                        <p className="text-sm text-[#E6007E]">{partner.category}</p>
                      </div>
                    </div>
                    <p className="text-sm text-black/70 leading-relaxed mb-4">{partner.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {partner.products.map((product) => (
                        <span
                          key={product}
                          className="px-2 py-1 rounded-md bg-black/5 text-black/80 text-xs"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#E6007E] font-semibold">
                      <span>✓</span> {partner.verification}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* Medical Suppliers */}
        <Section className="bg-gradient-to-b from-rose-50 to-white py-16 border-t-4 border-black">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#E6007E]/10 text-[#E6007E] text-xs font-bold uppercase tracking-wider mb-4">
                  Medical Supply Chain
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-black">
                  Verified Distribution
                </h2>
                <p className="text-lg text-black/60 mt-4 max-w-2xl mx-auto">
                  Every supply traceable from manufacturer to patient
                </p>
              </div>
            </FadeUp>

            <div className="grid md:grid-cols-3 gap-6">
              {MEDICAL_SUPPLIERS.map((supplier, idx) => (
                <FadeUp key={supplier.name} delayMs={idx * 80}>
                  <div className="rounded-2xl border-4 border-black bg-white p-6 h-full">
                    <h3 className="text-lg font-bold text-[#E6007E] mb-1">{supplier.name}</h3>
                    <p className="text-xs text-black/50 uppercase tracking-wider mb-4">{supplier.category}</p>
                    <p className="text-sm text-black/70 leading-relaxed">{supplier.description}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* Partner Badges */}
        <Section className="bg-gradient-to-b from-white to-rose-50 py-12 border-t-4 border-black">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div className="text-center mb-8">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#E6007E]/10 text-[#E6007E] text-xs font-bold uppercase tracking-wider mb-4">
                  Official Partner Status
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-black">
                  Verified Authorized Provider
                </h2>
              </div>
            </FadeUp>
            
            <div className="flex flex-wrap justify-center items-center gap-8">
              <FadeUp delayMs={100}>
                <div className="flex flex-col items-center">
                  <img
                    src="/images/badges/allergan-partner-privileges-2026.png"
                    alt="Allergan Partner Privileges Proud Member 2026 — Hello Gorgeous Med Spa Oswego IL"
                    className="h-48 w-auto"
                  />
                  <p className="text-sm text-black/60 mt-2 font-medium">Allergan Aesthetics</p>
                </div>
              </FadeUp>
              <FadeUp delayMs={200}>
                <div className="flex flex-col items-center">
                  <div className="h-48 w-48 rounded-2xl bg-gradient-to-br from-[#E6007E] to-[#FF2D8E] flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-3xl font-black">InMode</div>
                      <div className="text-xs uppercase tracking-wider mt-1 opacity-80">Verified Provider</div>
                      <div className="text-sm font-bold mt-2">2026</div>
                    </div>
                  </div>
                  <p className="text-sm text-black/60 mt-2 font-medium">InMode Certified</p>
                </div>
              </FadeUp>
            </div>
          </div>
        </Section>

        {/* Training Certificates */}
        <Section className="bg-white py-16 border-t-4 border-black">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#E6007E]/10 text-[#E6007E] text-xs font-bold uppercase tracking-wider mb-4">
                  Verified Training
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-black">
                  InMode Certified Providers
                </h2>
                <p className="text-lg text-black/60 mt-4 max-w-2xl mx-auto">
                  Official training certificates from InMode — click to view
                </p>
              </div>
            </FadeUp>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Danielle Alcala, RN", cert: "Morpheus8 (Luxora)", date: "March 20, 2026", file: "/images/certificates/danielle-morpheus8-inmode-cert.pdf" },
                { name: "Danielle Alcala, RN", cert: "Solaria CO₂", date: "March 17, 2026", file: "/images/certificates/danielle-solaria-inmode-cert.pdf" },
                { name: "Ryan Kent, FNP-BC", cert: "Morpheus8 (Luxora)", date: "March 20, 2026", file: "/images/certificates/ryan-morpheus8-inmode-cert.pdf" },
                { name: "Ryan Kent, FNP-BC", cert: "Solaria CO₂", date: "March 17, 2026", file: "/images/certificates/ryan-solaria-inmode-cert.pdf" },
              ].map((item, idx) => (
                <FadeUp key={`${item.name}-${item.cert}`} delayMs={idx * 60}>
                  <a
                    href={item.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-2xl border-4 border-black bg-gradient-to-br from-rose-50 to-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.25)] hover:shadow-[6px_6px_0_0_rgba(230,0,126,0.35)] hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E6007E] flex items-center justify-center text-white font-bold text-lg">
                        📜
                      </div>
                      <div className="text-xs text-[#E6007E] font-bold uppercase tracking-wider">
                        InMode Certificate
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-black group-hover:text-[#E6007E] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-black/70 mt-1">{item.cert}</p>
                    <p className="text-xs text-black/50 mt-2">{item.date}</p>
                    <div className="mt-3 text-xs text-[#E6007E] font-semibold flex items-center gap-1">
                      View Certificate →
                    </div>
                  </a>
                </FadeUp>
              ))}
            </div>

            <FadeUp delayMs={300}>
              <p className="text-center text-sm text-black/50 mt-8">
                Training conducted by Wanda Cummings, RN BSN — VP Clinical Operations, InMode
              </p>
            </FadeUp>
          </div>
        </Section>

        {/* Credentials */}
        <Section className="bg-black py-16 border-t-4 border-black">
          <div className="max-w-5xl mx-auto">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
                Why We Can Do What Others <span className="text-[#FF2D8E]">Can't</span>
              </h2>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-6">
              {CREDENTIALS.map((cred, idx) => (
                <FadeUp key={cred.title} delayMs={idx * 80}>
                  <div className="rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-sm p-6">
                    <div className="text-3xl mb-3">{cred.icon}</div>
                    <h3 className="text-lg font-bold text-[#FF2D8E] mb-2">{cred.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{cred.description}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] py-16 border-t-4 border-black">
          <div className="max-w-3xl mx-auto text-center">
            <FadeUp>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready for the Real Thing?
              </h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                No pressure, no upselling. Just an honest conversation about what's right for you — 
                using only authentic, verified products and Class IV medical technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOKING_URL} variant="outline" className="border-white text-white hover:bg-white hover:text-[#E6007E]">
                  Book Your Consultation
                </CTA>
                <CTA href="/providers" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  Meet Ryan & Danielle
                </CTA>
              </div>
              <p className="mt-8 text-sm text-white/60">
                Questions? Call us at{" "}
                <a href="tel:+16306366193" className="underline hover:text-white">
                  (630) 636-6193
                </a>{" "}
                — we're happy to verify any product or device.
              </p>
            </FadeUp>
          </div>
        </Section>
      </main>
    </div>
  );
}
