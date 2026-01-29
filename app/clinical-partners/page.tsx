import type { Metadata } from "next";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Clinical Partners & Standards",
  description:
    "Quiet confidence in what we use, how we source, and why standards matter—built for safety, ethics, and outcomes.",
  path: "/clinical-partners",
});

export default function ClinicalPartnersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              OUR CLINICAL PARTNERS & STANDARDS
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Quiet confidence in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                safety
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              We choose partners who meet the same standards we expect for our patients. This page isn’t about
              bragging—it’s about helping you feel safe, informed, and respected.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href="/book" variant="gradient">
                Book a Consultation (optional)
              </CTA>
              <CTA href="/your-journey" variant="outline">
                Start with Your Journey
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10">
          <FadeUp>
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-8">
              <h2 className="text-2xl font-bold text-white">Why partnerships matter</h2>
              <p className="mt-4 text-gray-300 leading-relaxed">
                In medical aesthetics, quality and outcomes aren’t just about technique—they’re also about what’s used,
                how it’s sourced, how it’s stored, and how protocols are followed. Partnerships help protect safety,
                consistency, and integrity.
              </p>
            </div>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Aesthetics & Injectables",
                items: ["Allergan", "Evolus"],
                body:
                  "Trusted manufacturers and consistent supply standards matter for safety, predictability, and education you can trust.",
              },
              {
                title: "Hormone Optimization",
                items: ["BioTE"],
                body:
                  "Programs with structured education and clinician oversight support a safety-first, evaluation-driven approach.",
              },
              {
                title: "Skincare",
                items: ["Dermalogica", "EltaMD", "Fullscript"],
                body:
                  "Skin health is long-term. Reputable skincare systems support consistency, ingredient integrity, and education.",
              },
              {
                title: "Pharmacy & Supply Chain",
                items: ["McKesson", "High-quality compounded pharmacies (non-promotional)"],
                body:
                  "Responsible sourcing and traceability support safety. For compounded medications, we prioritize quality standards and clinician-led decision-making.",
              },
            ].map((c, idx) => (
              <FadeUp key={c.title} delayMs={60 * idx}>
                <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6">
                  <h3 className="text-xl font-bold text-white">{c.title}</h3>
                  <p className="mt-3 text-gray-300">{c.body}</p>
                  <ul className="mt-5 space-y-2 text-sm text-gray-300">
                    {c.items.map((i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-pink-400">•</span>
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <div className="rounded-2xl border border-gray-800 bg-black/40 p-8">
              <h2 className="text-2xl font-bold text-white">How this protects you</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Consistency",
                    body: "Clear sourcing and reputable standards reduce surprises and improve predictability.",
                  },
                  {
                    title: "Safety-first protocols",
                    body: "Clinical standards mean we prioritize screening, education, and appropriate escalation.",
                  },
                  {
                    title: "Ethics",
                    body: "No pressure, no hype. If something isn’t right for you, the right answer is ‘not yet’ or ‘not this.’",
                  },
                ].map((b) => (
                  <div key={b.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-lg font-semibold text-white">{b.title}</h3>
                    <p className="mt-3 text-gray-300 text-sm leading-relaxed">{b.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-white/60">
                Note: Partner names are provided for transparency and education only. This page is not a promotional
                endorsement and does not imply guarantees of outcomes.
              </p>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-8">
              <h2 className="text-2xl font-bold text-white">Want to start with clarity?</h2>
              <p className="mt-4 text-gray-300 leading-relaxed">
                If you’re not sure what you want yet, start with{" "}
                <Link className="underline" href="/your-journey">
                  Your Journey
                </Link>
                . If you already have questions, the Care Engine can help you ask them safely.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <CTA href="/care-engine" variant="gradient">
                  Open the Care Engine™
                </CTA>
                <CTA href="/contact" variant="outline">
                  Contact us
                </CTA>
              </div>
            </div>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}

