import Image from "next/image";
import Link from "next/link";

import { PeptideScienceVideo } from "@/components/peptides/PeptideScienceVideo";
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
    <section className="border-b-4 border-black bg-gradient-to-b from-white to-[#FFF0F7] px-6 py-14 md:py-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E6007E]">
            A smarter approach
          </p>
          <h2 className="mt-3 text-3xl font-black text-black md:text-4xl">
            What are peptides?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-black/80 md:text-lg">
            Peptides are short chains of amino acids — molecular messengers that tell your
            cells to perform specific jobs. Think of them as precision signals, not blunt
            instruments. Different peptides target different pathways:{" "}
            <strong>tissue repair</strong> (BPC-157, TB-500),{" "}
            <strong>growth hormone axis</strong> (sermorelin, CJC / ipamorelin),{" "}
            <strong>metabolic health</strong> (GLP-1 programs), and{" "}
            <strong>cellular energy</strong> (NAD+, MOTS-c).
          </p>
          <p className="mt-4 text-base leading-relaxed text-black/75">
            At Hello Gorgeous in Oswego, every RE GEN protocol starts with your goals and an
            NP evaluation — Ryan Kent, FNP-BC reviews history, labs when indicated, and
            matches the right peptide or program. Prescription-only through licensed
            compounding pharmacies; never gray-market research vials.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {FEATURED_PEPTIDES.map((p) => (
              <Link
                key={p.slug}
                href={peptideTopicHref(p.slug)}
                className="rounded-full border-2 border-black/15 bg-white px-3 py-1.5 text-xs font-semibold text-black/80 transition hover:border-[#E6007E] hover:text-[#E6007E]"
              >
                {p.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/peptides"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#E6007E] underline decoration-[#E6007E]/40 underline-offset-4 hover:decoration-[#E6007E]"
            >
              Full peptide education hub →
            </Link>
            <Link
              href="/rx/request"
              className="inline-flex items-center gap-2 text-sm font-bold text-black/70 hover:text-[#E6007E]"
            >
              Start RE GEN intake →
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <PeptideScienceVideo
            src={PEPTIDE_SCIENCE_VIDEOS.alternate}
            label="Peptide signaling animation"
            caption="Cellular messaging · recovery · hormone pathways"
          />
          <div className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.3)]">
            <Image
              src="/images/rx/peptide-vial-lineup-hello-gorgeous.png"
              alt="Hello Gorgeous Med Spa RE GEN peptide and wellness vials — BPC-157, TB-500, NAD+, glutathione, semaglutide, CJC-1295, and GLP-1 programs"
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 540px"
            />
            <p className="border-t-4 border-black px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-black/55">
              NP-supervised · Hello Gorgeous RX™ · Oswego, IL
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
