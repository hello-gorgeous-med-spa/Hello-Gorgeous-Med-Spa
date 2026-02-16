"use client";

import Link from "next/link";
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
    <div className="relative">
      {/* Hero */}
      <div className="text-center py-16 md:py-24">
        <FadeUp>
          <p className="text-[#FF2D8E] text-lg font-medium tracking-wide mb-4">CONDITIONS WE TREAT</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Skin Condition Treatments <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
              in Oswego, IL
            </span>
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto mb-8">
            Find treatments tailored to your concerns. From acne and wrinkles to weight loss and fatigue—we're here to help you look and feel your best.
          </p>
          <CTA href={BOOKING_URL}>Book Appointment</CTA>
        </FadeUp>
      </div>

      {/* Table of Contents */}
      <FadeUp delayMs={100}>
        <div className="mb-16 p-6 rounded-2xl border border-[#FF2D8E]/20 bg-pink-950/20">
          <p className="text-sm font-semibold text-[#FF2D8E] mb-4">Table of Contents</p>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="px-4 py-2 rounded-full border border-black text-black text-sm hover:border-[#FF2D8E]/40 hover:text-pink-300 transition-colors"
              >
                {c.title}
              </a>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Condition Cards */}
      <div className="space-y-12 md:space-y-16">
        {CONDITIONS.map((condition, idx) => (
          <FadeUp key={condition.id} delayMs={150 + idx * 30}>
            <div
              id={condition.id}
              className="scroll-mt-24 rounded-2xl border border-[#FF2D8E]/20 bg-gradient-to-br from-black/60 via-black/40 to-pink-950/20 p-8 md:p-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{condition.title}</h2>
              <p className="text-[#FF2D8E] text-lg font-medium mb-6">{condition.headline}</p>

              <ul className="space-y-2 mb-6">
                {condition.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-black">
                    <span className="text-[#FF2D8E] mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <p className="text-white/90 mb-8">{condition.description}</p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={condition.learnMoreHref}
                  className="px-6 py-3 rounded-full border border-black text-white font-semibold hover:bg-white transition-colors"
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

      {/* Bottom CTA */}
      <FadeUp delayMs={200}>
        <div className="mt-20 text-center p-12 md:p-16 rounded-3xl border border-[#FF2D8E]/30 bg-gradient-to-br from-pink-950/30 via-black to-pink-950/20">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Schedule a Consultation at Our Oswego Med Spa
          </h2>
          <p className="text-black text-lg max-w-2xl mx-auto mb-8">
            Begin your journey with a personalized consultation in our serene, boutique setting. Our
            expert team will listen, assess, and design a treatment plan tailored to your unique
            goals.
          </p>
          <CTA href={BOOKING_URL}>Book Your Consultation Today</CTA>
          <p className="text-black text-sm mt-6">74 W. Washington St, Oswego, IL</p>
        </div>
      </FadeUp>
    </div>
  );
}
