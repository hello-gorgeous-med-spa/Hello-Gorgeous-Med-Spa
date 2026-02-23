import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Solaria CO₂ Fractional Laser | Advanced Skin Resurfacing | Oswego IL",
  description:
    "InMode Solaria CO₂ fractional laser at Hello Gorgeous Med Spa Oswego IL. Treat deep wrinkles, acne scars, sun damage, skin tightening. Gold standard skin resurfacing. Consultation required.",
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
      "Pricing depends on the treatment area and depth. Full face treatments typically start at $1,500+. Schedule a consultation for personalized pricing.",
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

export default function SolariaCO2Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <main className="bg-white">
        {/* Hero */}
        <section className="relative bg-black text-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
            <p className="text-pink-300 text-sm font-semibold uppercase tracking-wider mb-4">
              Now Available
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Solaria CO₂
              <br />
              Fractional Laser
            </h1>
            <p className="text-xl text-white/90 max-w-xl mb-8">
              The gold standard in skin resurfacing. One treatment. Dramatic transformation.
            </p>
            <p className="text-white/80 mb-10">
              Advanced ablative laser technology by <strong>InMode</strong> for deep wrinkles, acne scars, sun damage, and skin tightening.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/solaria-co2-vip"
                className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white hover:bg-[#c9006e] transition"
              >
                Join VIP Waitlist — $100 Off
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-black transition"
              >
                Book Consultation
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
              <span>5-7 Days Downtime</span>
              <span>Results in 3-6 Months</span>
              <span>Consultation Required</span>
            </div>
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

        {/* Before & After placeholder + disclaimer */}
        <section className="py-16 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-black mb-4">Before & After Gallery</h2>
            <p className="text-gray-600 mb-8">
              See the dramatic transformations achieved with Solaria CO₂ laser.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Acne Scarring", "Deep Wrinkles", "Sun Damage", "Skin Texture", "Hyperpigmentation", "Full Rejuvenation"].map((label) => (
                <div
                  key={label}
                  className="aspect-[3/4] rounded-lg bg-zinc-200 flex items-end p-4"
                >
                  <span className="text-sm font-medium text-zinc-600">{label}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-zinc-500">
              Results vary by individual. All treatments performed by licensed medical professionals. Client consent on file.
            </p>
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
              <Link href="/aftercare/solaria-co2" className="text-[#E6007E] font-semibold hover:underline">
                View Complete Pre & Post Care Instructions
              </Link>
            </p>
          </div>
        </section>

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
            <p className="text-gray-600 mb-8">
              Schedule your consultation today and discover if Solaria CO₂ is right for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/book"
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
      </main>
    </>
  );
}
