import Image from "next/image";
import Link from "next/link";

import {
  JOURNEY_SECTION_BG_A,
  JourneyCheckItem,
  JourneyDarkCard,
  JourneyEyebrow,
  JourneySectionHead,
  JourneyVideoFrame,
} from "@/components/marketing/JourneyPageUi";
import { PEPTIDE_SCIENCE_VIDEOS } from "@/lib/peptide-topic-media";
import { peptideTopicHref } from "@/lib/peptides-hub";

const FEATURED_PEPTIDES = [
  { slug: "bpc-157", label: "BPC-157 · recovery" },
  { slug: "tb-500", label: "TB-500 · mobility" },
  { slug: "cjc-1295-ipamorelin", label: "CJC / Ipamorelin · GH stack" },
  { slug: "sermorelin", label: "Sermorelin · sleep & GH" },
  { slug: "nad-plus", label: "NAD+ · cellular energy" },
  { slug: "semaglutide", label: "Semaglutide · GLP-1" },
] as const;

export function RxPeptideEducationSection() {
  return (
    <section className={`${JOURNEY_SECTION_BG_A} px-6 py-16 lg:py-24`}>
      <div className="mx-auto grid max-w-[1200px] items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <JourneySectionHead
            eyebrow="A smarter approach"
            title="What are"
            titleAccent="peptides?"
            description="Peptides are short chains of amino acids — molecular messengers that tell your cells to perform specific jobs. Different peptides target different pathways; the right one depends on your skin, goals, and clinical picture."
          />
          <div className="mt-8 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed text-white/85">
            <p>
              Think of them as precision signals, not blunt instruments.{" "}
              <strong className="text-white">Tissue repair</strong> (BPC-157, TB-500),{" "}
              <strong className="text-white">growth hormone axis</strong> (sermorelin, CJC /
              ipamorelin), <strong className="text-white">metabolic health</strong> (GLP-1 programs),
              and <strong className="text-white">cellular energy</strong> (NAD+, MOTS-c).
            </p>
            <p>
              At Hello Gorgeous in Oswego, every RE GEN protocol starts with your goals and an NP
              evaluation — Ryan Kent, FNP-BC reviews history, labs when indicated, and matches the
              right peptide or program. Prescription-only through licensed compounding pharmacies.
            </p>
          </div>

          <JourneyDarkCard className="mt-8">
            <h3 className="font-serif text-2xl font-bold text-white">Why we educate first</h3>
            <ul className="mt-4 space-y-3">
              <JourneyCheckItem>Understand the science before you shop by goal</JourneyCheckItem>
              <JourneyCheckItem>Every order NP-reviewed before anything ships</JourneyCheckItem>
              <JourneyCheckItem>Deep-dive guides for each peptide we prescribe</JourneyCheckItem>
              <JourneyCheckItem>Never gray-market &quot;research use only&quot; vials</JourneyCheckItem>
            </ul>
          </JourneyDarkCard>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {FEATURED_PEPTIDES.map((p) => (
              <Link
                key={p.slug}
                href={peptideTopicHref(p.slug)}
                className="rounded-full border border-white/30 px-4 py-1.5 text-[13px] font-semibold text-white transition hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
              >
                {p.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/peptides"
              className="text-sm font-bold text-[#FF2D8E] underline decoration-[#FF2D8E]/40 underline-offset-4 hover:text-white"
            >
              Full peptide education hub →
            </Link>
            <Link href="/rx/request" className="text-sm font-bold text-white/70 hover:text-[#FF2D8E]">
              Start RE GEN intake →
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <JourneyVideoFrame
            src={PEPTIDE_SCIENCE_VIDEOS.rxEducation}
            label="Peptide signaling animation"
            poster="/images/education/peptides-101-not-all-created-equal.webp"
          />
          <div className="overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)]">
            <Image
              src="/images/rx/peptide-vial-lineup-hello-gorgeous.png"
              alt="Hello Gorgeous Med Spa RE GEN peptide and wellness vials"
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 540px"
            />
            <p className="border-t border-[#FF2D8E]/35 bg-black px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white/55">
              NP-supervised · Hello Gorgeous RX™ · Oswego, IL
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
