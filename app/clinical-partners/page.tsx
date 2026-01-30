import type { Metadata } from "next";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BOOKING_URL } from "@/lib/flows";
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
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              OUR CLINICAL PARTNERS & STANDARDS
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Quiet confidence in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                safety
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              We choose partners who meet the same standards we expect for our patients. This page isn’t about
              bragging—it’s about helping you feel safe, informed, and respected.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <CTA href={BOOKING_URL} variant="gradient">
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
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <CTA href="/explore-care" variant="outline">
                  Explore Care (Services Atlas™)
                </CTA>
                <CTA href="/meet-the-team" variant="outline">
                  Meet Your Care Team
                </CTA>
              </div>
            </div>
          </FadeUp>

          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Aesthetics & Injectable Pharmaceuticals",
                  items: ["Allergan", "Evolus"],
                  body: [
                    "These brands are associated with FDA‑approved neuromodulators (where applicable).",
                    "Why sourcing matters: authenticity, proper handling, and consistent standards support safety and predictability.",
                    "Injectables are medical procedures—not cosmetic retail—so education, screening, and technique matter more than hype.",
                  ],
                  links: [
                    { href: "/services/botox-dysport-jeuveau", label: "Injectables education" },
                    { href: "/services/dermal-fillers", label: "Fillers overview" },
                    { href: "/explore-care", label: "Explore Care" },
                  ],
                },
                {
                  title: "Hormone Optimization & Metabolic Care",
                  items: ["BioTE", "ANTEAGE"],
                  body: [
                    "Lab‑guided hormone optimization starts with evaluation and monitoring—not guessing.",
                    "Pellet therapy (where offered) requires protocols, informed consent, and follow‑up for safety.",
                    "Compounded medications require pharmacy‑grade standards and clinician oversight; decisions are made in person.",
                  ],
                  links: [
                    { href: "/services/biote-hormone-therapy", label: "Hormone therapy education" },
                    { href: "/services/weight-loss-therapy", label: "Weight loss therapy education" },
                    { href: "/services/trt-replacement-therapy", label: "TRT education" },
                  ],
                },
              ].map((c, idx) => (
                <FadeUp key={c.title} delayMs={60 * idx}>
                  <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6">
                    <h3 className="text-xl font-bold text-white">{c.title}</h3>
                    <ul className="mt-4 space-y-2 text-sm text-gray-300">
                      {c.items.map((i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-pink-400">•</span>
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 space-y-2 text-sm text-gray-300">
                      {c.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {c.links.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="text-sm font-semibold text-white/90 underline hover:text-white"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Skincare & Dermatology‑Grade Products",
                  items: ["SkinMedica", "Dermalogica", "EltaMD"],
                  body: [
                    "“Medical‑grade” is often used loosely. What matters is evidence‑informed formulation, ingredient integrity, and how products fit your skin barrier needs.",
                    "Skin barrier science matters—over‑treating or mixing incompatible products can increase irritation and slow progress.",
                    "Product selection can support treatment outcomes by reducing inflammation and improving consistency (without making promises).",
                  ],
                  links: [
                    { href: "/services/rf-microneedling", label: "Skin health: microneedling" },
                    { href: "/services/chemical-peels", label: "Skin health: chemical peels" },
                    { href: "/services/hydra-facial", label: "Skin health: facials" },
                  ],
                },
                {
                  title: "IV Therapy & Peptide Standards",
                  items: ["Olympia Pharmaceuticals"],
                  body: [
                    "Sterility, sourcing, storage, and formulation integrity matter for IV therapy and peptide‑adjacent protocols.",
                    "Pharmaceutical‑grade compounding standards help reduce risk—screening and clinical oversight still matter.",
                    "We keep this educational online; individual eligibility and protocols are handled in consultation.",
                  ],
                  links: [
                    { href: "/services/iv-therapy", label: "IV therapy education" },
                    { href: "/services/sermorelin-growth-peptide", label: "Peptide education (Sermorelin)" },
                    { href: "/care-and-support", label: "Care & Support" },
                  ],
                },
              ].map((c, idx) => (
                <FadeUp key={c.title} delayMs={60 * idx}>
                  <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6">
                    <h3 className="text-xl font-bold text-white">{c.title}</h3>
                    <ul className="mt-4 space-y-2 text-sm text-gray-300">
                      {c.items.map((i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-pink-400">•</span>
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 space-y-2 text-sm text-gray-300">
                      {c.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {c.links.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="text-sm font-semibold text-white/90 underline hover:text-white"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Supplements & Continuity of Care",
                  items: ["Fullscript"],
                  body: [
                    "Practitioner‑recommended supplementation can support a long‑term wellness plan when appropriate.",
                    "The goal is personalization and safety—especially for people on medications or with medical considerations.",
                    "We don’t recommend supplements online for you specifically; that requires context and clinician guidance.",
                  ],
                  links: [
                    { href: "/understand-your-body", label: "Understand Your Body" },
                    { href: "/care-engine", label: "Care Engine™" },
                    { href: "/contact", label: "Ask a question" },
                  ],
                },
                {
                  title: "Supply Chain & Medical Distribution",
                  items: ["McKesson", "High‑quality compounded pharmacies (non‑promotional)"],
                  body: [
                    "Medical supply chains matter for product authenticity, traceability, and proper storage.",
                    "We avoid gray‑market sourcing because authenticity and handling standards are a safety issue.",
                    "For compounded medications, we focus on pharmacy‑grade standards and clinician‑led decision‑making.",
                  ],
                  links: [
                    { href: "/clinical-partners", label: "Back to top" },
                    { href: "/explore-care", label: "Explore Care" },
                    { href: "/meet-the-team", label: "Meet Your Care Team" },
                  ],
                },
              ].map((c, idx) => (
                <FadeUp key={c.title} delayMs={60 * idx}>
                  <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6">
                    <h3 className="text-xl font-bold text-white">{c.title}</h3>
                    <ul className="mt-4 space-y-2 text-sm text-gray-300">
                      {c.items.map((i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-pink-400">•</span>
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 space-y-2 text-sm text-gray-300">
                      {c.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {c.links.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="text-sm font-semibold text-white/90 underline hover:text-white"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
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
                . If you already have questions, Explore Care and the Care Engine can help you ask them safely.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <CTA href="/explore-care" variant="outline">
                  Explore Care (Services Atlas™)
                </CTA>
                <CTA href="/care-engine" variant="gradient">
                  Open the Care Engine™
                </CTA>
                <CTA href="/meet-the-team" variant="outline">
                  Meet Your Care Team
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

