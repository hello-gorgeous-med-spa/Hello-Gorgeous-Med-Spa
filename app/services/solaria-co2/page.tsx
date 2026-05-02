import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TechBlogPromo } from "@/components/TechBlogPromo";
import { RealPatientReviews } from "@/components/RealPatientReviews";
import { pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title:
    "Solaria CO₂ Laser in Oswego, IL — $899 Full Face Launch Special | Hello Gorgeous Med Spa",
  description:
    "InMode Solaria CO₂ fractional laser at Hello Gorgeous Med Spa in Oswego, IL. Full face skin resurfacing for $899 (limited launch pricing). Treat deep wrinkles, acne scars, and sun damage in Oswego, Naperville, Aurora, Plainfield. Book your free consultation.",
  path: "/services/solaria-co2",
});

export const revalidate = 3600;

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
      "Right now we're running an exclusive launch special: $899 for a full face Solaria CO₂ treatment (regularly $1,500+). Other treatment areas (neck, eyes, hands, body) are priced separately — schedule a free consultation for a personalized plan.",
  },
  {
    question: "Can I combine CO₂ with other treatments?",
    answer:
      "Yes! Many clients combine CO₂ with PRP/PRF for enhanced healing, or schedule maintenance Botox and fillers once healed. We'll discuss optimal treatment sequencing during your consultation.",
  },
];

const BENEFITS = [
  { icon: "✨", title: "Deep Wrinkle Reduction", desc: "Dramatically softens forehead lines, crow's feet, and perioral wrinkles" },
  { icon: "🎯", title: "Acne Scar Revision", desc: "Significantly improves texture and depth of acne scars" },
  { icon: "☀️", title: "Sun Damage Repair", desc: "Reverses years of sun damage, age spots, and hyperpigmentation" },
  { icon: "💎", title: "Skin Tightening", desc: "Stimulates collagen for firmer, more lifted skin" },
  { icon: "🔬", title: "Texture Refinement", desc: "Smooths rough texture and minimizes enlarged pores" },
  { icon: "🌟", title: "Overall Rejuvenation", desc: "Comprehensive anti-aging in a single powerful treatment" },
];

const BADGES = [
  { label: "FDA-Cleared Device", emoji: "🏥" },
  { label: "Licensed Providers", emoji: "👩‍⚕️" },
  { label: "4.9 Star Rated", emoji: "⭐" },
  { label: "InMode Certified", emoji: "🎓" },
];

const SOLARIA_PROCEDURE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "Solaria CO₂ Fractional Laser Skin Resurfacing",
  alternateName: [
    "CO2 Laser Resurfacing",
    "Fractional CO2 Laser",
    "InMode Solaria CO2",
    "CO2 Laser Oswego",
    "CO2 Laser Naperville",
  ],
  description:
    "Fractional ablative CO₂ laser treatment using the InMode Solaria platform. Treats deep wrinkles, acne scars, sun damage, hyperpigmentation, and skin laxity in a single session.",
  procedureType: "Cosmetic",
  bodyLocation: ["Face", "Neck", "Décolleté", "Hands"],
  preparation: "Stop retinoids/AHAs/BHAs 7 days prior, avoid sun exposure 2 weeks prior, arrive with clean makeup-free skin.",
  followup: "5–7 days social downtime, SPF 50+ once healed, avoid picking peeling skin, stay hydrated.",
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
    areaServed: ["Oswego, IL", "Naperville, IL", "Aurora, IL", "Plainfield, IL", "Yorkville, IL"],
  },
  offers: {
    "@type": "Offer",
    name: "Solaria CO₂ Full Face Launch Special",
    description: "Full-face Solaria CO₂ fractional laser treatment — limited launch pricing.",
    price: "899",
    priceCurrency: "USD",
    availability: "https://schema.org/LimitedAvailability",
    url: `${SITE.url}/services/solaria-co2`,
    seller: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      telephone: SITE.phone,
    },
  },
};

const SOLARIA_FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SOLARIA_FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function SolariaCO2Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOLARIA_PROCEDURE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOLARIA_FAQ_JSONLD) }}
      />
      <main className="bg-white">
        {/* Hero — launch hero with $899 anchor + InMode Solaria positioning */}
        <section className="relative bg-black text-white overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 -z-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(80% 50% at 90% 0%, rgba(230,0,126,0.35) 0%, rgba(0,0,0,0) 60%), radial-gradient(60% 50% at 10% 100%, rgba(255,45,142,0.25) 0%, rgba(0,0,0,0) 60%)",
            }}
          />
          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-5">
              <span className="h-2 w-2 rounded-full bg-[#E6007E] animate-pulse" />
              Launch Special · Limited Spots
            </span>
            <p className="text-[#FFB8DC] text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-3">
              Oswego · Naperville · Aurora · Plainfield
            </p>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-5">
              Solaria CO₂ Laser
              <br />
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Full Face for $899
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-2xl mb-3 font-semibold">
              InMode Solaria CO₂ — gold-standard skin resurfacing, right here in Oswego.
            </p>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mb-8">
              CO₂ fractional resurfacing typically runs{" "}
              <span className="line-through opacity-60">$1,500+</span> at plastic surgery offices.
              We're running a launch special at <span className="font-bold text-white">$899 full face</span>{" "}
              to introduce Solaria to our community. One treatment. Dramatic transformation.
            </p>
            <p className="text-white/70 mb-10 max-w-2xl text-sm">
              Powered by{" "}
              <a
                href="https://www.inmodemd.com/workstation/solaria/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#FFB8DC] hover:text-white underline underline-offset-2"
              >
                InMode Solaria
              </a>{" "}
              — fractional ablative laser for deep wrinkles, acne scars, sun damage, hyperpigmentation,
              and skin tightening.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book?service=solaria-co2"
                className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white hover:bg-[#c9006e] transition shadow-[0_8px_24px_rgba(230,0,126,0.45)]"
              >
                Book Free Consultation →
              </Link>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-black transition"
              >
                Call {SITE.phone}
              </a>
              <Link
                href="/solaria-co2-vip"
                className="inline-flex items-center justify-center rounded-lg border-2 border-[#FFB8DC] px-6 py-3 font-semibold text-[#FFB8DC] hover:bg-[#FFB8DC] hover:text-black transition"
              >
                VIP Waitlist — $100 Credit
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
              <span>✓ FDA-cleared InMode device</span>
              <span>✓ 5–7 days downtime</span>
              <span>✓ Results visible 7–10 days, peak at 3–6 months</span>
              <span>✓ Free consultation required</span>
            </div>
          </div>
        </section>

        <section className="bg-[#E6007E]/10 border-y border-[#E6007E]/25 py-4">
          <div className="max-w-6xl mx-auto px-4 text-center sm:text-left">
            <p className="text-black text-sm md:text-base">
              <span className="font-semibold text-black">Acne-prone or treating acne with laser?</span>{" "}
              Follow our{" "}
              <Link href="/care/laser-acne-protocol" className="text-[#E6007E] font-semibold underline underline-offset-2">
                Morpheus8 &amp; Solaria acne protocol &amp; aftercare
              </Link>{" "}
              — pre-care, post-care, breakout prevention, and prescription options when appropriate.
            </p>
          </div>
        </section>

        {/* InMode device images - your provided assets */}
        <section className="bg-zinc-100 py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-black mb-8 text-center">InMode Technology</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black">
                <Image
                  src="/images/solaria/solaria-device.png"
                  alt="SOLARIA by INMODE — CO2 Fractional Skin Resurfacing device at Hello Gorgeous Med Spa Oswego IL"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="relative aspect-[3/4] max-h-[480px] rounded-xl overflow-hidden bg-white border border-zinc-200">
                <Image
                  src="/images/solaria/solaria-workstation.png"
                  alt="Solaria CO₂ Fractional Laser workstation by InMode at Hello Gorgeous Med Spa Oswego IL"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {BADGES.map((b) => (
                <span key={b.label} className="flex items-center gap-2 text-black font-medium">
                  <span>{b.emoji}</span>
                  <span>{b.label}</span>
                </span>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-black/70">
              <a
                href="https://www.inmodemd.com/workstation/solaria/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E6007E] font-semibold hover:underline"
              >
                More info
              </a>
              <span> — official InMode Solaria workstation (opens in a new tab) →</span>
            </p>
          </div>
        </section>

        {/* Pricing — launch special $899 full face is the lead */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-rose-50/40 via-white to-white">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-[#FF2D8E] text-xs md:text-sm font-bold uppercase tracking-[0.25em] mb-2 text-center">
              Launch pricing
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-black mb-3 text-center">
              Solaria CO₂ — full face for{" "}
              <span className="bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                $899
              </span>
            </h2>
            <p className="text-gray-700 text-center mb-10 max-w-2xl mx-auto">
              Limited launch pricing — typically <span className="line-through">$1,500+</span> at plastic surgery
              offices. We&apos;re introducing Solaria CO₂ with this special so our community can access
              gold-standard CO₂ resurfacing without driving into the city.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="relative rounded-2xl border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[#E6007E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white border-2 border-black">
                  ★ Launch Special
                </span>
                <h3 className="text-lg font-bold text-black mb-1 mt-2">Full Face</h3>
                <p className="text-4xl font-black text-[#E6007E] mb-1">$899</p>
                <p className="text-sm text-gray-500 line-through mb-3">Reg. $1,500+</p>
                <p className="text-sm text-gray-700 mb-6">
                  One full-face Solaria CO₂ treatment. Wrinkles, acne scars, sun damage, texture — in one session.
                </p>
                <Link
                  href="/book?service=solaria-co2"
                  className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-4 py-2.5 font-semibold text-white hover:bg-[#c9006e] transition text-sm w-full"
                >
                  Book free consult
                </Link>
              </div>
              <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6 text-center">
                <h3 className="text-lg font-bold text-black mb-1">Package of 3</h3>
                <p className="text-3xl font-black text-[#E6007E] mb-3">$2,397</p>
                <p className="text-sm text-gray-700 mb-6">
                  Three full-face sessions for maximum collagen remodeling. Best value for deep scarring or significant aging.
                </p>
                <Link
                  href="/book?service=solaria-co2"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-[#E6007E] text-[#E6007E] px-4 py-2.5 font-semibold hover:bg-[#E6007E] hover:text-white transition text-sm w-full"
                >
                  Book free consult
                </Link>
              </div>
              <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6 text-center">
                <h3 className="text-lg font-bold text-black mb-1">Trifecta Bundle</h3>
                <p className="text-base font-semibold text-black mb-1">Solaria + Morpheus8 + Quantum</p>
                <p className="text-sm text-gray-500 mb-3">Custom pricing</p>
                <p className="text-sm text-gray-700 mb-6">
                  Resurfacing + RF microneedling + skin tightening. The most complete face transformation we offer.
                </p>
                <Link
                  href="/book?service=solaria-co2"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-black text-black px-4 py-2.5 font-semibold hover:bg-black hover:text-white transition text-sm w-full"
                >
                  Book free consult
                </Link>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-8">
              Free consultation required. Financing available via Cherry. Add-on areas (neck, hands, eyes) priced separately.
            </p>
          </div>
        </section>

        {/* What it treats */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-black mb-4">What Solaria CO₂ Treats</h2>
            <p className="text-gray-600 mb-12 max-w-2xl">
              One powerful treatment addresses multiple concerns that other treatments can't match.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {BENEFITS.map((item) => (
                <div key={item.title} className="border border-zinc-200 rounded-xl p-6">
                  <span className="text-2xl mb-3 block">{item.icon}</span>
                  <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before & After Gallery — InMode Solaria CO2 reference results */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-white via-rose-50 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#E6007E] bg-[#E6007E]/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E6007E] mb-4">
                <span className="h-2 w-2 rounded-full bg-[#E6007E] animate-pulse" />
                Live & Booking · $899 Launch Special
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-black">
                Before &amp; After ·{" "}
                <span className="bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                  Real Solaria Results
                </span>
              </h2>
              <p className="text-black/70 max-w-2xl mx-auto mt-4 text-lg">
                Real Hello Gorgeous patients first — then reference imagery from InMode (same
                Solaria CO₂ device we use in Oswego).
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  src: "/images/solaria/michelle-solaria-co2-one-treatment-facial-before-after.jpg",
                  alt: "Michelle before and after one InMode Solaria CO₂ fractional laser treatment at Hello Gorgeous Med Spa, Oswego IL — skin texture, tone, and rejuvenation",
                  label: "Michelle — one Solaria treatment · our patient",
                  patient: true,
                  width: 472,
                  height: 1024,
                },
                {
                  src: "/images/solaria/solaria-co2-full-face-before-after.png",
                  alt: "Solaria CO2 full face before and after — fine lines, deep wrinkles, and skin laxity dramatically improved after one treatment with InMode Solaria fractional laser",
                  label: "Full face — fine lines + laxity (InMode reference)",
                },
                {
                  src: "/images/solaria/solaria-co2-acne-scars-before-after.png",
                  alt: "Solaria CO2 acne scar before and after — ice pick and boxcar acne scars smoothed with InMode Solaria fractional CO2 resurfacing",
                  label: "Cheek — acne scarring (InMode reference)",
                },
                {
                  src: "/images/solaria/solaria-co2-pigmentation-before-after-right.png",
                  alt: "Solaria CO2 pigmentation before and after right cheek — sun damage, age spots and hyperpigmentation cleared after one InMode Solaria treatment",
                  label: "Pigmentation + sun damage (InMode reference)",
                },
                {
                  src: "/images/solaria/solaria-co2-pigmentation-before-after-left.png",
                  alt: "Solaria CO2 pigmentation before and after left cheek — uneven skin tone and brown spots resolved after a single InMode Solaria fractional laser session",
                  label: "Pigmentation + tone (InMode reference)",
                },
              ].map((photo) => (
                <figure
                  key={photo.src}
                  className="group rounded-2xl overflow-hidden border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative bg-gray-50">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={"width" in photo && photo.width ? photo.width : 1024}
                      height={"height" in photo && photo.height ? photo.height : 409}
                      className="w-full h-auto"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-black text-white rounded-lg text-xs font-bold tracking-wider">
                        BEFORE / AFTER
                      </span>
                      {"patient" in photo && photo.patient && (
                        <span className="px-3 py-1 bg-[#E6007E] text-white rounded-lg text-xs font-bold tracking-wider">
                          OUR PATIENT
                        </span>
                      )}
                    </div>
                  </div>
                  <figcaption className="p-4">
                    <p className="font-bold text-black">{photo.label}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-black/60 max-w-2xl mx-auto">
              Michelle’s photos: Hello Gorgeous patient, consent on file. Additional panels:
              reference imagery courtesy of InMode (Solaria CO₂ manufacturer). We operate the
              same FDA-cleared device. Individual results vary. Free consultation required.
            </p>
            <div className="text-center mt-8">
              <Link
                href="/book?service=solaria-co2"
                className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-8 py-4 font-bold text-white hover:bg-[#c9006e] transition shadow-[0_8px_24px_rgba(230,0,126,0.45)]"
              >
                Book My Free Solaria Consultation →
              </Link>
            </div>
          </div>
        </section>

        {/* Ideal candidates */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-black mb-6">Is Solaria CO₂ Right For You?</h2>
            <p className="text-gray-600 mb-6">
              This treatment is perfect for clients who are ready for dramatic improvement and can commit to proper healing time.
            </p>
            <ul className="space-y-2 text-gray-700 mb-8">
              {[
                "Deep wrinkles and fine lines",
                "Acne scarring (ice pick, boxcar, rolling)",
                "Sun damage and age spots",
                "Uneven skin tone and texture",
                "Skin laxity and loss of firmness",
                "Enlarged pores",
                "Dull, tired-looking skin",
                "Previous treatments with limited results",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-[#E6007E]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-900 mb-1">Important Considerations</p>
              <p className="text-sm text-amber-800">
                CO₂ laser requires 5–7 days of social downtime. A consultation is required to determine if you're a good candidate. Not suitable for those with active acne, pregnancy, history of keloids, or very dark skin tones.
              </p>
            </div>
            <p className="mt-6 text-sm">
              <Link href="/stretch-mark-treatment-oswego-il" className="text-[#E6007E] font-semibold hover:underline">
                Stretch marks? Body resurfacing &amp; postpartum confidence →
              </Link>
            </p>
          </div>
        </section>

        {/* Pre/Post care */}
        <section className="py-16 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-black mb-8">Your Treatment Journey</h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-bold text-black mb-4">Pre-Treatment Care</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>Stop retinoids, AHAs, BHAs 7 days before treatment</li>
                  <li>Avoid sun exposure and tanning 2 weeks before</li>
                  <li>Disclose all medications; some may need to be paused</li>
                  <li>Hydrate well in the days leading up to treatment</li>
                  <li>Arrive with clean, makeup-free skin</li>
                  <li>Antiviral medication may be prescribed if history of cold sores</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-black mb-4">Post-Treatment Care</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>Apply cool compresses to reduce swelling (Days 1–3)</li>
                  <li>Keep skin moist with recommended healing ointment</li>
                  <li>Do NOT pick at peeling skin—let it slough naturally</li>
                  <li>Avoid direct sun; wear SPF 50+ once healed</li>
                  <li>Stay hydrated and avoid alcohol</li>
                  <li>Sleep elevated to minimize swelling</li>
                  <li>No makeup until skin is fully healed (usually 7–10 days)</li>
                  <li>Avoid strenuous exercise and sweating for 7 days</li>
                </ul>
              </div>
            </div>
            <p className="mt-6">
              <Link href="/solaria" className="text-[#E6007E] font-semibold hover:underline">
                View Complete Pre & Post Care Instructions
              </Link>
            </p>
          </div>
        </section>

        {/* Real Patient Reviews — pulls 5-star Google reviews mentioning Solaria/CO2 */}
        <RealPatientReviews
          service="solaria-co2"
          serviceLabel="Solaria CO₂ Laser Oswego"
          heading="Real clients on our Solaria CO₂ laser at Hello Gorgeous"
        />

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-black mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {SOLARIA_FAQS.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-bold text-black mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VIP Waitlist CTA */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Join the Exclusive Waitlist</h2>
            <p className="text-white/90 mb-8">
              Be among the first to experience Solaria CO₂ at Hello Gorgeous. VIP members receive priority booking and a $100 credit toward treatment.
            </p>
            <Link
              href="/solaria-co2-vip"
              className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white hover:bg-[#c9006e] transition"
            >
              Join VIP Waitlist Now
            </Link>
            <p className="mt-6 text-sm text-white/70">
              Questions? Call {SITE.phone} or text 630-881-3398
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-zinc-100">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Ready to Transform Your Skin?</h2>
            <p className="text-gray-600 mb-4">
              Schedule your consultation today and discover if Solaria CO₂ is right for you.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              See our detailed{" "}
              <Link href="/solaria-co2-laser-oswego-il" className="text-[#E6007E] hover:underline font-semibold">
                Solaria CO₂ Laser Resurfacing
              </Link>{" "}
              page for full treatment details and VIP launch pricing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/book?service=solaria-co2"
                className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white hover:bg-[#c9006e] transition"
              >
                Book Consultation
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-black px-6 py-3 font-semibold text-black hover:bg-black hover:text-white transition"
              >
                Contact Us
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode} · {SITE.phone} · Serving Naperville, Aurora, Plainfield
            </p>
          </div>
        </section>

        <TechBlogPromo
          title="Solaria CO₂, Morpheus8 Burst & Quantum RF — Expert Guides"
          subtitle="Read our blog articles on InMode Solaria CO₂ laser, Morpheus8 Burst vs regular, and Quantum RF skin tightening. Serving Oswego, Naperville, Aurora, Plainfield & the Fox Valley."
        />
      </main>
    </>
  );
}
