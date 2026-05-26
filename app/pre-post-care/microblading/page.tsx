import type { Metadata } from "next";
import Link from "next/link";
import { CareGuideLayout, CareGuideHeader, CareGuideFooter } from "@/components/CareGuideLayout";
import { BrowNaturalLightStrokeBeforeAfter } from "@/components/brow/BrowNaturalLightStrokeBeforeAfter";
import { BrowPmuPortfolioShowcase } from "@/components/brow/BrowPmuPortfolioShowcase";
import { BrowPowderBeforeAfter } from "@/components/brow/BrowPowderBeforeAfter";
import { BROW_PMU_OSWEGO_PATH } from "@/data/brow-pmu-seo";
import {
  BROW_CONSULTATION_PACKET_PDF,
  BROW_INTAKE_PATH,
  YOUR_BROW_JOURNEY_PATH,
  YOUR_BROW_JOURNEY_PDF,
  MICROBLADING_DO_LIST,
  MICROBLADING_DONT_LIST,
  MICROBLADING_HEALING_NOTE,
  MICROBLADING_HEALING_TIMELINE,
  MICROBLADING_INFECTION_WARNING,
  MICROBLADING_PRE_CARE,
  MICROBLADING_PREPOST_PATH,
  MICROBLADING_RESCHEDULE_IF,
} from "@/data/brow-microblading-care";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Microblading & Brow PMU Pre & Post Care | Hello Gorgeous Med Spa",
  description:
    "Official microblading, powder brows, combo & nano brow PMU pre-care and healing instructions from Hello Gorgeous Med Spa in Oswego, IL. Before & after portfolio by Danielle Alcala.",
  path: MICROBLADING_PREPOST_PATH,
  keywords: [
    "microblading pre care",
    "brow PMU aftercare Oswego",
    "powder brows healing",
    "combo brows aftercare",
    "nano brows healing timeline",
    "permanent makeup brows Illinois",
  ],
});

export default function MicrobladingCareGuidePage() {
  return (
    <CareGuideLayout>
      <CareGuideHeader />

      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">Pre + Post Care Guide</p>
        <h2 className="text-3xl font-bold text-black mt-1">MICROBLADING &amp; BROW PMU</h2>
        <p className="mt-3 text-sm text-black/75 max-w-xl mx-auto">
          Hair-stroke brows, ombré powder, combo/hybrid, and nano strokes — follow these steps for your best heal.
        </p>
      </div>

      <BrowPmuPortfolioShowcase className="mb-6" />
      <p className="text-center text-sm mb-6 print:hidden">
        <Link href={BROW_PMU_OSWEGO_PATH} className="font-bold text-[#E6007E] hover:underline">
          Full brow PMU results &amp; technique guide (Oswego) →
        </Link>
      </p>
      <BrowNaturalLightStrokeBeforeAfter className="mb-6" />
      <BrowPowderBeforeAfter className="mb-8" />

      <section className="mb-8 rounded-xl border-2 border-[#E6007E]/30 bg-rose-50 p-5 print:border-black">
        <h3 className="text-lg font-bold text-[#E6007E] mb-2">Related documents</h3>
        <ul className="text-sm text-black/80 space-y-2">
          <li>
            <Link href={BROW_INTAKE_PATH} className="font-semibold text-[#E6007E] hover:underline">
              Brow consultation &amp; intake form
            </Link>
            {" "}
            — complete before your visit (health history, shape &amp; technique, consent).
          </li>
          <li>
            <Link href={YOUR_BROW_JOURNEY_PATH} className="font-semibold text-[#E6007E] hover:underline">
              Your Brow Journey
            </Link>
            {" "}
            — step-by-step consult guide (what to expect, healing, aftercare).
            {" "}
            <a href={YOUR_BROW_JOURNEY_PDF} className="text-[#E6007E] hover:underline" target="_blank" rel="noopener noreferrer">
              PDF
            </a>
          </li>
          <li>
            <a href={BROW_CONSULTATION_PACKET_PDF} className="font-semibold text-[#E6007E] hover:underline" target="_blank" rel="noopener noreferrer">
              Full consultation packet (PDF)
            </a>
            {" "}
            — intake, technique guide, and printable copies.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">
          BEFORE YOUR BROW APPOINTMENT
        </h3>
        <p className="text-sm text-black/80 mb-4">
          A little prep makes a big difference. Following these steps helps your skin take pigment evenly and heal beautifully.
        </p>
        {MICROBLADING_PRE_CARE.map((block) => (
          <div key={block.title} className="mb-4">
            <p className="text-sm font-semibold text-black mb-2">{block.title}</p>
            <ul className="text-sm text-black/80 space-y-1.5 ml-4 list-disc">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-sm font-semibold text-black">Please reschedule if:</p>
          <ul className="text-sm text-black/80 mt-2 ml-4 list-disc space-y-1">
            {MICROBLADING_RESCHEDULE_IF.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm text-black/80 mt-2">Your safety always comes first — we&apos;ll happily find you a new date.</p>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">
          YOUR HEALING TIMELINE
        </h3>
        <div className="space-y-3">
          {MICROBLADING_HEALING_TIMELINE.map((phase) => (
            <div key={phase.days} className="p-3 rounded-lg border border-black/10 bg-white">
              <p className="text-xs font-bold uppercase tracking-wide text-[#E6007E]">
                {phase.days} · {phase.label}
              </p>
              <p className="text-sm text-black/80 mt-1">{phase.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">Please DO</h3>
          <ul className="text-sm text-black/80 space-y-1 ml-4 list-disc">
            {MICROBLADING_DO_LIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#E6007E] border-b-2 border-[#E6007E] pb-1 mb-3">Please DON&apos;T</h3>
          <ul className="text-sm text-black/80 space-y-1 ml-4 list-disc">
            {MICROBLADING_DONT_LIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-6 p-4 rounded-lg bg-pink-50 border border-[#E6007E]/20">
        <p className="text-sm text-black/85 font-medium">{MICROBLADING_HEALING_NOTE}</p>
        <p className="text-sm text-black/80 mt-3">{MICROBLADING_INFECTION_WARNING}</p>
      </section>

      <CareGuideFooter />
    </CareGuideLayout>
  );
}
