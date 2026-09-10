import type { Metadata } from "next";
import Link from "next/link";

import { RegenToolsShell } from "@/components/regen/RegenToolsShell";
import { REGEN_PUBLIC_TOOLS } from "@/lib/regen/public-tools";
import { TOOLS_BRAND as BRAND } from "@/lib/regen/tools-brand";

export const metadata: Metadata = {
  title: "Free Tools",
  description:
    "Free REGEN RX tools: protein and BMI calculators, GLP-1 titration tracker, peptide matcher, hormone symptom checker, IV finder, injection site rotation, and savings estimator.",
};

const TAGS: Record<string, string> = {
  protein: "Fuel",
  bmi: "Body",
  "glp1-titration": "GLP-1",
  "peptide-matcher": "Peptides",
  "hormone-symptoms": "Hormones",
  "iv-finder": "IV",
  "injection-sites": "Care",
  savings: "Pricing",
};

export default function ToolsHubPage() {
  return (
    <RegenToolsShell>
      <section className="px-6 pb-10 pt-28 text-center">
        <span
          className="mb-4 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
          style={{
            backgroundColor: `${BRAND.pink}22`,
            color: BRAND.blush,
            border: `1px solid ${BRAND.pink}55`,
          }}
        >
          Free Tools
        </span>
        <h1 className="mx-auto mb-4 max-w-3xl font-serif text-4xl font-black md:text-5xl">
          Plan your protocol{" "}
          <span
            className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#0D9488] bg-clip-text text-transparent"
            style={{ WebkitBackgroundClip: "text" }}
          >
            before you book
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg" style={{ color: BRAND.blush }}>
          Eight quick tools to understand your numbers, find the right conversation, and see
          what to expect — built by the same Illinois team that treats you.
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-6 pb-16 sm:grid-cols-2">
        {REGEN_PUBLIC_TOOLS.map((tool, i) => {
          const accent = i % 2 === 0 ? BRAND.pink : BRAND.teal;
          return (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group rounded-3xl border-4 border-black bg-white p-6 text-left shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] transition-transform hover:-translate-y-0.5"
            >
              <span
                className="inline-block rounded-xl border-2 border-black px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white"
                style={{ background: `linear-gradient(135deg, ${accent}, ${i % 2 === 0 ? BRAND.hot : BRAND.tealDark})` }}
              >
                {TAGS[tool.slug] ?? "Tool"}
              </span>
              <h2 className="mt-3 font-serif text-2xl font-black text-black">{tool.title}</h2>
              <p className="mt-2 text-sm font-medium text-black/70">{tool.blurb}</p>
              <span className="mt-4 inline-flex text-sm font-black transition-transform group-hover:translate-x-1" style={{ color: accent }}>
                Open tool →
              </span>
            </Link>
          );
        })}
      </section>

      <section
        className="mx-6 mb-16 rounded-3xl px-6 py-12 text-center"
        style={{
          background: "linear-gradient(125deg, #FF2D8E 0%, #E91E8C 45%, #0D9488 100%)",
        }}
      >
        <h2 className="font-serif text-3xl font-black text-white">Ready for a real plan?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-white/90">
          These tools are educational. a licensed Illinois clinician reviews every request and prescribes
          only if it is clinically appropriate.
        </p>
        <Link
          href="/start"
          className="mt-6 inline-flex rounded-full border-2 border-black bg-white px-8 py-3 text-sm font-black text-black"
        >
          Start your visit — free
        </Link>
      </section>

      <p className="px-6 pb-16 text-center text-xs" style={{ color: BRAND.blush }}>
        Educational only — not a diagnosis, prescription, or guarantee.
      </p>
    </RegenToolsShell>
  );
}
