import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE, siteJsonLd } from "@/lib/seo";
import { FAQAccordion } from "@/components/FAQAccordion";

export const metadata: Metadata = pageMetadata({
  title: "Stretch Mark Treatment Oswego IL | Solaria CO₂ Body Resurfacing | Hello Gorgeous",
  description:
    "Advanced body resurfacing & postpartum stretch mark treatment in Oswego, IL. Solaria CO₂ fractional laser for fitness, weight loss, and pregnancy skin. 40–70% visible improvement. Book consultation.",
  path: "/stretch-mark-treatment-oswego-il",
});

const STRETCH_MARK_FAQS = [
  {
    question: "Does CO₂ completely remove stretch marks?",
    answer:
      "No treatment can erase stretch marks 100%, but most patients see significant improvement in texture and tone.",
  },
  {
    question: "How many treatments are needed?",
    answer: "Typically 2–4 sessions spaced 6–8 weeks apart.",
  },
  {
    question: "Is there downtime?",
    answer:
      "Mild redness and healing for 5–10 days depending on intensity.",
  },
];

export default function StretchMarkTreatmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <main className="bg-white">
        {/* Section 1: Premium Body Resurfacing — black / luxury */}
        <section className="bg-black text-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-pink-300 text-sm font-semibold uppercase tracking-wider mb-4">
              Premium Body Resurfacing
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Advanced Body Resurfacing with Solaria CO₂
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Refine. Tighten. Restore.
            </p>
            <div className="prose prose-invert prose-lg max-w-none text-white/85 space-y-4 mb-10">
              <p>
                Stretch marks are a structural change in the skin — not a surface flaw.
                That&apos;s why creams alone rarely work.
              </p>
              <p>
                Solaria CO₂ fractional resurfacing penetrates deep into the dermis to stimulate
                collagen remodeling, improve skin thickness, and refine overall texture.
              </p>
              <p className="font-semibold text-white">
                This is not camouflage.
                <br />
                This is collagen reconstruction.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-pink-200 mb-2">Ideal for:</h3>
                <ul className="space-y-1 text-white/90">
                  <li>• Fitness competitors</li>
                  <li>• Post-weight loss transformation</li>
                  <li>• Body contouring patients</li>
                  <li>• Clients seeking luxury skin refinement</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-pink-200 mb-2">Expected Results:</h3>
                <p className="text-white/90">
                  40–70% visible improvement after a treatment series.
                </p>
              </div>
            </div>
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-8 py-4 font-semibold text-white hover:bg-[#c9006e] transition"
            >
              Schedule Body Resurfacing Consultation
            </Link>
          </div>
        </section>

        {/* Section 2: Postpartum — white / empowering */}
        <section className="bg-white py-16 md:py-24 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-[#E6007E] text-sm font-semibold uppercase tracking-wider mb-4">
              Postpartum Confidence Restoration
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-4">
              Restore Confidence After Pregnancy
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your body created life. Let us help restore your skin.
            </p>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4 mb-8">
              <p>
                Pregnancy changes everything — including your skin.
              </p>
              <p>
                If stretch marks on the abdomen, hips, or breasts make you feel self-conscious,
                Solaria CO₂ offers a safe and effective way to improve their appearance.
              </p>
              <p>
                By stimulating new collagen production, this advanced treatment helps:
              </p>
              <ul className="list-none pl-0 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-[#E6007E]">•</span>
                  Smooth textured areas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#E6007E]">•</span>
                  Blend discoloration
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#E6007E]">•</span>
                  Improve skin firmness
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#E6007E]">•</span>
                  Restore confidence
                </li>
              </ul>
              <p>
                We customize every treatment to your comfort level and healing timeline.
              </p>
              <p className="font-semibold text-black">
                You deserve to feel confident in your body again.
              </p>
            </div>
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-lg border-2 border-black px-8 py-4 font-semibold text-black hover:bg-black hover:text-white transition"
            >
              Book Postpartum Skin Consultation
            </Link>
          </div>
        </section>

        {/* Before/After placeholder carousel */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-black mb-4">Visual Results</h2>
            <p className="text-gray-600 mb-6">
              Before &amp; after results from Solaria CO₂ body resurfacing. Results vary by individual.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-sm"
                >
                  Before / After {i}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Results vary by individual. Client consent on file. Add your own before/after images when available.
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-16 md:py-20 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-black mb-8">Stretch Mark &amp; CO₂ FAQ</h2>
            <FAQAccordion items={STRETCH_MARK_FAQS} />
          </div>
        </section>

        {/* Bundle upsell + final CTA */}
        <section className="py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Enhance Your Results</h2>
            <p className="text-white/90 mb-6">
              Ask about bundle options: CO₂ + PRF package, CO₂ + microneedling combo, or a 3-treatment stretch mark series.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-lg bg-[#E6007E] px-8 py-4 font-semibold text-white hover:bg-[#c9006e] transition"
            >
              Book Consultation
            </Link>
            <p className="mt-6 text-sm text-white/70">
              {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion} · {SITE.phone} · Toll-free {SITE.tollFree}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
