import Image from "next/image";
import Link from "next/link";

import { FAQAccordion } from "@/components/FAQAccordion";
import { LocalSeoConversionStrip } from "@/components/seo/LocalSeoConversionStrip";
import { REGEN_LAUNCH_PRICING, REGEN_MARKETING } from "@/lib/regen-brand";
import {
  REGEN_WEIGHT_LOSS_HUB,
  regenWeightLossCrossLinks,
  type RegenWeightLossCitySeoContent,
} from "@/lib/regen-weight-loss-city-seo";
import { RX_PATIENT_JOURNEY_STEPS } from "@/lib/rx-patient-journey";
import { SITE } from "@/lib/seo";

export function RegenWeightLossCitySeoPage({ content }: { content: RegenWeightLossCitySeoContent }) {
  const crossLinks = regenWeightLossCrossLinks(content.slug);

  return (
    <main className="bg-white">
      <section className="relative bg-gradient-to-br from-[#1a1216] via-[#2d1020] to-black text-white py-16 md:py-24">
        <div className="relative max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[#FFB8DC] text-xs font-bold uppercase tracking-widest mb-3">
              {content.heroEyebrow}
            </p>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              RE GEN Weight Loss in{" "}
              <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                {content.heroAccent}
              </span>
            </h1>
            <p className="text-lg text-white/90 max-w-xl mb-6">
              NP-supervised GLP-1 programs — compounded semaglutide & tirzepatide shipped to your door across
              Illinois. Transparent pricing {REGEN_LAUNCH_PRICING.glp1}.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={REGEN_WEIGHT_LOSS_HUB}
                className="inline-flex justify-center rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-8 py-3.5 font-bold text-white hover:opacity-90 transition"
              >
                Start RE GEN intake
              </Link>
              <Link
                href="/rx/learn/what-is-glp-1"
                className="inline-flex justify-center rounded-xl border-2 border-white px-8 py-3.5 font-bold text-white hover:bg-white hover:text-black transition"
              >
                What is GLP-1?
              </Link>
            </div>
          </div>
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border-4 border-[#E6007E]/40">
            <Image
              src="/brochure/assets/glp-weight-loss.png"
              alt={content.heroImageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {content.driveNote ? (
        <section className="py-8 bg-[#FFF0F7] border-y-2 border-black/10">
          <p className="text-center font-semibold text-black/85 px-4">{content.driveNote}</p>
        </section>
      ) : null}

      <section className="py-12 md:py-16 max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
          Why {content.cityLabel} chooses RE GEN
        </h2>
        <p className="text-lg text-gray-700 mb-6">{content.localLead}</p>
        <p className="text-lg text-gray-700">
          RE GEN is the prescription arm of Hello Gorgeous Med Spa — Ryan Kent, FNP-BC reviews every intake.
          Real clinic at {SITE.address.streetAddress}, {SITE.address.addressLocality}. Not a faceless online
          pharmacy.
        </p>
      </section>

      <section className="py-12 bg-neutral-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-black mb-8">How RE GEN weight loss works</h2>
          <ol className="space-y-6">
            {RX_PATIENT_JOURNEY_STEPS.map((step) => (
              <li key={step.step} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-white font-bold border-2 border-black">
                  {step.step}
                </span>
                <div>
                  <h3 className="font-bold text-black">{step.title}</h3>
                  <p className="text-gray-700 mt-1">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <LocalSeoConversionStrip />

      <section className="py-12 md:py-16 bg-neutral-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-black mb-6">RE GEN weight loss FAQ</h2>
          <FAQAccordion items={content.faqs} />
        </div>
      </section>

      <section className="py-10 border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#E6007E] mb-4">Also serving</p>
          <div className="flex flex-wrap justify-center gap-2">
            {crossLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border-2 border-black/15 px-4 py-2 text-sm font-semibold hover:border-[#E6007E] hover:text-[#E6007E] transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="mt-6">
            <Link href="/rx" className="font-semibold text-[#E6007E] hover:underline">
              Browse all RE GEN programs →
            </Link>
          </p>
        </div>
      </section>

      <section className="py-12 bg-black text-white text-center px-4">
        <Image
          src={REGEN_MARKETING.brandBanner}
          alt="RE GEN by Hello Gorgeous Med Spa"
          width={800}
          height={450}
          className="mx-auto mb-6 max-h-40 w-auto rounded-xl"
        />
        <Link
          href={REGEN_WEIGHT_LOSS_HUB}
          className="inline-flex rounded-xl bg-[#E6007E] px-8 py-3.5 font-bold text-white hover:bg-[#FF2D8E] transition"
        >
          Start weight loss intake
        </Link>
      </section>
    </main>
  );
}
