import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE, siteJsonLd, faqJsonLd, SERVICES } from "@/lib/seo";
import { HarmonyAI } from "@/components/HarmonyAI";
import { FAQAccordion } from "@/components/FAQAccordion";
import { BOOKING_URL } from "@/lib/flows";

const slug = "biote-hormone-therapy";

function getService() {
  return SERVICES.find((s) => s.slug === slug);
}

export async function generateMetadata(): Promise<Metadata> {
  const service = getService();
  return pageMetadata({
    title: service?.name ?? "BioTE Hormone Therapy",
    description: service?.short ?? "Personalized hormone optimization designed around your symptoms and labs.",
    path: `/services/${slug}`,
  });
}

const BENEFITS = [
  { icon: "⚡", title: "Energy & vitality", desc: "Support for fatigue and low energy so you can feel like yourself again." },
  { icon: "😴", title: "Sleep & mood", desc: "Better sleep and mood balance with personalized hormone optimization." },
  { icon: "📊", title: "Lab-guided", desc: "In-office labs guide safe, individualized dosing. Results in ~36 hours." },
  { icon: "💊", title: "BioTE & compounded", desc: "BioTE pellets plus Olympia compounded options when appropriate." },
];

export default function BioteHormoneTherapyPage() {
  const service = getService();
  const faqs = (service?.faqs ?? []).map((f: { question: string; answer: string }) => ({
    question: f.question,
    answer: f.answer,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        />
      )}
      <main className="bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-b from-pink-50 to-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <p className="text-[#FF2D8E] text-sm font-semibold uppercase tracking-wider mb-3">
              {service?.category ?? "Wellness"}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-4">
              {service?.heroTitle ?? "BioTE Hormone Therapy in Oswego, IL"}
            </h1>
            <p className="text-xl text-black/80 max-w-2xl">
              {service?.heroSubtitle ?? "Feel like yourself again—energy, mood, sleep, and overall wellbeing support."}
            </p>
            <div className="mt-8">
              <Link
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#FF2D8E] px-6 py-3 font-semibold text-white hover:bg-[#FF2D8E]/90 transition"
              >
                Book a consultation
              </Link>
            </div>
          </div>
        </section>

        {/* Short intro */}
        <section className="py-10 max-w-4xl mx-auto px-6 md:px-12">
          <p className="text-lg text-black/80 leading-relaxed">
            {service?.short ?? "Personalized hormone optimization designed around your symptoms and labs."}
          </p>
        </section>

        {/* Harmony AI™ – hormone assessment + blueprint */}
        <section className="py-10 bg-pink-50/30">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#FF2D8E] mb-2">
              Get your personalized hormone blueprint
            </h2>
            <p className="text-black/80 mb-6">
              Answer a few questions to receive an AI-generated educational blueprint: likely patterns, recommended labs, and optimization pathway. Not a diagnosis—a starting point for your consultation.
            </p>
            <HarmonyAI />
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 max-w-5xl mx-auto px-6 md:px-12">
          <h2 className="text-2xl font-bold text-black mb-8 text-center">
            Why choose hormone therapy at Hello Gorgeous
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="p-6 rounded-2xl border-2 border-black/10 bg-white hover:border-[#FF2D8E]/30 transition-colors"
              >
                <span className="text-3xl mb-3 block">{b.icon}</span>
                <h3 className="font-bold text-black mb-1">{b.title}</h3>
                <p className="text-sm text-black/70">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 max-w-3xl mx-auto px-6 md:px-12">
          <h2 className="text-2xl font-bold text-black mb-6">Frequently asked questions</h2>
          <FAQAccordion items={faqs} />
        </section>

        {/* CTA */}
        <section className="py-12 bg-pink-50/50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Ready to feel like yourself again?</h2>
            <p className="text-black/80 mb-6">
              Book a consultation and we&apos;ll review your symptoms, goals, and any labs together.
            </p>
            <Link
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-[#FF2D8E] px-8 py-4 font-bold text-white hover:bg-[#FF2D8E]/90 transition"
            >
              Book consultation
            </Link>
            <p className="mt-6 text-sm text-black/60">
              {SITE.name} · {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion} ·{" "}
              <a href={`tel:${SITE.phone}`} className="text-[#FF2D8E] hover:underline">{SITE.phone}</a>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
