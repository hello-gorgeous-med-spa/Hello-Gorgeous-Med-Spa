"use client";

import Link from "next/link";
import {
  BROW_CONSULTATION_PACKET_PDF,
  BROW_INTAKE_PATH,
  MICROBLADING_PREPOST_PATH,
} from "@/data/brow-microblading-care";
import { BROW_MAPPING_PATH } from "@/data/brow-mapping-intelligence";
import { MICROBLADING_STUDY_GUIDE_PATH } from "@/data/microblading-study-guide";
import { PMU_PRACTICE_PATH } from "@/data/pmu-practice";

const CARDS = [
  {
    href: BROW_MAPPING_PATH,
    icon: "✏️",
    title: "Brow Mapping Intelligence",
    description: "Upload client photo, map head/arch/tail, preview 7 shapes, pigment & technique — export PNG/PDF.",
    internal: true,
  },
  {
    href: BROW_INTAKE_PATH,
    icon: "📋",
    title: "Brow consultation intake",
    description: "Client-facing 6-step digital intake — health history, shapes, technique, consent & PDF download.",
    internal: false,
  },
  {
    href: MICROBLADING_PREPOST_PATH,
    icon: "📄",
    title: "Microblading pre & post care",
    description: "Printable pre-care, healing timeline, do's & don'ts — send before/after appointments.",
    internal: false,
  },
  {
    href: BROW_CONSULTATION_PACKET_PDF,
    icon: "📑",
    title: "Consultation packet (PDF)",
    description: "Full printable packet — intake, technique guide, contraindications, consent.",
    internal: false,
  },
  {
    href: MICROBLADING_STUDY_GUIDE_PATH,
    icon: "📖",
    title: "Microblading study guide",
    description: "Provider training — mapping, spine strokes, procedure flow & aftercare standards.",
    internal: false,
  },
  {
    href: PMU_PRACTICE_PATH,
    icon: "🎨",
    title: "PMU practice studio",
    description: "Digital stroke practice on iPad — microblading, nano, shading.",
    internal: false,
  },
  {
    href: "/handouts/education/brow-mapping-intelligence.html",
    icon: "📱",
    title: "Offline brow mapping (iPad)",
    description: "AirDrop HTML to iPad — works without login when Wi‑Fi is limited.",
    internal: false,
  },
];

export default function PmuBrowsHubPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">PMU &amp; brows</p>
      <h1 className="text-2xl font-bold text-black mt-1">Brow &amp; microblading hub</h1>
      <p className="text-black/70 mt-2 mb-6 text-sm">
        Consultation tools, client intake, pre/post care, and training — one place for chairside and front desk.
      </p>

      <div className="space-y-3">
        {CARDS.map((card) => {
          const className =
            "block p-4 rounded-xl border border-gray-200 bg-white hover:border-[#E6007E]/40 hover:bg-[#FFF0F7]/50 transition-colors";
          const inner = (
            <>
              <span className="text-xl">{card.icon}</span>
              <h2 className="font-semibold text-black mt-2">{card.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{card.description}</p>
              {!card.internal ? (
                <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wide text-[#E6007E]">
                  Opens in new tab
                </span>
              ) : null}
            </>
          );

          if (card.internal) {
            return (
              <Link key={card.href} href={card.href} className={className}>
                {inner}
              </Link>
            );
          }

          return (
            <a
              key={card.href}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {inner}
            </a>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-black/50">
        Tip: Add this hub to your iPad home screen via Safari — or use the offline mapping HTML when the admin tool is unavailable.
      </p>
    </div>
  );
}
