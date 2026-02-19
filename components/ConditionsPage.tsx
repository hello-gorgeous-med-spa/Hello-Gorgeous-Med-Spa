"use client";

import Link from "next/link";
import Image from "next/image";
import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";

type Condition = {
  id: string;
  title: string;
  headline: string;
  bullets: string[];
  description: string;
  learnMoreHref: string;
};

const CONDITIONS: Condition[] = [
  {
    id: "acne",
    title: "Acne",
    headline: "Breakouts that won't let you breathe",
    bullets: [
      "Red, inflamed pimples and painful cysts",
      "Constant flare-ups that feel out of control",
      "Skin that reacts to everything",
    ],
    description:
      "Our chemical peels, HydraFacial, and RF microneedling calm inflammation and restore balance. You'll feel clearer, more confident, and finally in control.",
    learnMoreHref: "/services/chemical-peels",
  },
  {
    id: "acne-scars",
    title: "Acne Scars",
    headline: "Visible reminders that won't fade",
    bullets: [
      "Pitted texture across cheeks or temples",
      "Shadows that distort light and smoothness",
      "Skin that feels uneven no matter what you try",
    ],
    description:
      "We treat acne scars with RF microneedling and PRP facials to restore smoothness and clarity. You'll finally see your skin—not your past.",
    learnMoreHref: "/services/rf-microneedling",
  },
  {
    id: "dull-skin",
    title: "Dull Skin",
    headline: "Tired skin that doesn't reflect you",
    bullets: [
      "Lack of glow or natural radiance",
      "Uneven tone and rough texture",
      "Skin that looks older than it feels",
    ],
    description:
      "We revive dull skin with HydraFacial, chemical peels, and microneedling. Your glow is waiting—let's bring it back.",
    learnMoreHref: "/services/hydra-facial",
  },
  {
    id: "fatigue",
    title: "Fatigue / Low Energy",
    headline: "Dragging through days that should feel easy",
    bullets: [
      "Constant tiredness and low motivation",
      "Brain fog and slow recovery",
      "Feeling run down, inside and out",
    ],
    description:
      "Our IV therapy and vitamin injections restore energy and hydration from within. You'll feel stronger, clearer, and ready to move again.",
    learnMoreHref: "/services/iv-therapy",
  },
  {
    id: "fine-lines",
    title: "Fine Lines / Wrinkles",
    headline: "Creases that deepen with every smile",
    bullets: [
      "Lines around eyes, mouth, and forehead",
      "Skin that's losing elasticity",
      "Makeup settling into folds",
    ],
    description:
      "We soften lines with Botox, Dysport, and Jeuveau—and restore volume with dermal fillers. You'll look refreshed without losing expression.",
    learnMoreHref: "/services/botox-dysport-jeuveau",
  },
  {
    id: "high-bmi",
    title: "High BMI",
    headline: "Weight that feels stuck and unshifting",
    bullets: [
      "Goals that feel out of reach",
      "Frustration with slow progress",
      "Discomfort in your own body",
    ],
    description:
      "Our medical weight loss program offers GLP-1 options, clinical guidance, and real support. You'll move forward with clarity and control.",
    learnMoreHref: "/services/weight-loss-therapy",
  },
  {
    id: "hyperpigmentation",
    title: "Hyperpigmentation",
    headline: "Dark spots that won't go away",
    bullets: [
      "Uneven patches across cheeks or forehead",
      "Skin that looks blotchy or stained",
      "Tone that feels inconsistent",
    ],
    description:
      "We treat pigmentation with chemical peels, IPL photofacial, and microneedling. Your skin will look smoother, brighter, and more even.",
    learnMoreHref: "/services/ipl-photofacial",
  },
  {
    id: "saggy-skin",
    title: "Saggy Skin",
    headline: "Skin that feels loose or deflated",
    bullets: [
      "Loss of contour around jawline or neck",
      "Drooping cheeks or eyelids",
      "A face that no longer reflects your energy",
    ],
    description:
      "We tighten and lift with dermal fillers, RF microneedling, and Kybella. You'll feel sculpted, supported, and more like yourself.",
    learnMoreHref: "/services/dermal-fillers",
  },
  {
    id: "uneven-tone",
    title: "Uneven Skin Tone",
    headline: "Color that shifts across your face",
    bullets: [
      "Redness, blotchiness, or dull patches",
      "Tone that lacks harmony",
      "Skin that feels unpredictable",
    ],
    description:
      "We rebalance tone with customized facials, chemical peels, and IPL. Your complexion will feel calm, clear, and beautifully even.",
    learnMoreHref: "/services/chemical-peels",
  },
];

export function ConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — black, white text, brand pink */}
      <div className="bg-black py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <p className="text-[#E6007E] text-lg md:text-xl font-semibold mb-4 tracking-wide uppercase">
                Conditions We Treat
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Skin condition treatments{" "}
                <span className="text-[#E6007E]">in Oswego, IL</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
                Find treatments tailored to your concerns. From acne and wrinkles to weight loss and fatigue—we&apos;re here to help you look and feel your best.
              </p>
              <div className="mt-8">
                <CTA href={BOOKING_URL} variant="gradient" className="inline-flex">
                  Book Appointment
                </CTA>
              </div>
            </FadeUp>
            <FadeUp delayMs={100}>
              <div className="relative">
                <Image
                  src="/images/services/hg-prp-gold-tubes.png"
                  alt="Hello Gorgeous Med Spa clinical treatments for skin conditions - PRP, facials, injectables"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl object-cover"
                  priority
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </div>

      {/* Table of Contents — white card, black text */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <FadeUp>
          <div className="rounded-2xl border-2 border-black bg-white p-6 md:p-8 shadow-sm">
            <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wide mb-4">
              Jump to a condition
            </p>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="px-4 py-2 rounded-full border-2 border-black/20 text-black text-sm font-medium hover:border-[#E6007E] hover:bg-[#E6007E]/5 hover:text-[#E6007E] transition-colors"
                >
                  {c.title}
                </a>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>

      {/* Condition Cards — white section, clean cards */}
      <div className="bg-white border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="space-y-8 md:space-y-10">
            {CONDITIONS.map((condition, idx) => (
              <FadeUp key={condition.id} delayMs={idx * 20}>
                <div
                  id={condition.id}
                  className="scroll-mt-24 rounded-2xl border-2 border-black/10 bg-white p-8 md:p-10 hover:border-[#E6007E]/30 transition-colors shadow-sm"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
                    {condition.title}
                  </h2>
                  <p className="text-[#E6007E] text-lg font-semibold mb-6">
                    {condition.headline}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {condition.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2 text-black/80">
                        <span className="text-[#E6007E] mt-1 font-bold">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-black/80 mb-8 leading-relaxed">
                    {condition.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={condition.learnMoreHref}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-colors"
                    >
                      Learn More
                    </Link>
                    <CTA href={BOOKING_URL} variant="gradient">
                      Book now
                    </CTA>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA — black strip, white text */}
      <div className="bg-black py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <FadeUp>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Schedule a Consultation at Our Oswego Med Spa
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Begin your journey with a personalized consultation in our serene, boutique setting. Our
              expert team will listen, assess, and design a treatment plan tailored to your unique
              goals.
            </p>
            <CTA href={BOOKING_URL} variant="gradient" className="inline-flex">
              Book Your Consultation Today
            </CTA>
            <p className="text-white/60 text-sm mt-6">
              74 W. Washington St, Oswego, IL · (630) 636-6193
            </p>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
