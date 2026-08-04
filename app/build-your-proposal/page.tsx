import type { Metadata } from "next";
import Link from "next/link";
import { ProposalBuilderWizard } from "@/components/proposals/ProposalBuilderWizard";
import {
  BUILD_YOUR_PROPOSAL_MARKETING,
  BUILD_YOUR_PROPOSAL_PATH,
} from "@/lib/build-your-proposal-marketing";
import { breadcrumbJsonLd, pageMetadata, SITE } from "@/lib/seo";
import { CHERRY_PAY_URL } from "@/lib/flows";

const M = BUILD_YOUR_PROPOSAL_MARKETING;
const SERIF = "var(--font-playfair), Georgia, serif";

export const metadata: Metadata = pageMetadata({
  title: "Build Your Treatment Proposal | Hello Gorgeous Med Spa Oswego IL",
  description:
    "Build a personalized treatment proposal online at Hello Gorgeous Med Spa in Oswego, IL — packages, Botox units, Morpheus8, peptides, GLP-1 weight loss, and Cherry financing. Get a live estimate and share it with our team.",
  path: BUILD_YOUR_PROPOSAL_PATH,
  keywords: [
    "treatment proposal med spa",
    "Botox quote Oswego",
    "Morpheus8 package estimate",
    "peptide pricing Oswego IL",
    "build treatment plan Hello Gorgeous",
  ],
});

export default function BuildYourProposalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Build your proposal", url: `${SITE.url}${BUILD_YOUR_PROPOSAL_PATH}` },
            ])
          ),
        }}
      />

      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 10% 0%, rgba(230,0,126,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 10%, rgba(255,45,142,0.1), transparent 50%), linear-gradient(180deg, #FFF0F7 0%, #ffffff 45%, #f5f5f5 100%)",
        }}
        aria-hidden
      />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6 md:pt-14">
        {/* Editorial hero (Boots-inspired) */}
        <header className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end mb-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#E6007E]">
              {M.eyebrow}
            </p>
            <h1
              className="mt-3 max-w-xl text-4xl font-medium leading-[1.08] text-black md:text-5xl"
              style={{ fontFamily: SERIF }}
            >
              Build your treatment{" "}
              <span
                className="bg-gradient-to-r from-[#9b0a4d] via-[#E6007E] to-[#FF2D8E] bg-clip-text italic text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                proposal
              </span>
            </h1>
          </div>
          <div className="lg:pb-1">
            <p className="text-sm leading-relaxed text-black/70 md:text-base">{M.subhead}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="#builder"
                className="inline-flex rounded-full border-2 border-black px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#000]"
                style={{ background: "linear-gradient(125deg, #FF2D8E, #E6007E)" }}
              >
                Start building
              </a>
              <a
                href={CHERRY_PAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold uppercase tracking-widest text-black/55 underline-offset-4 hover:text-black hover:underline"
              >
                Apply for financing →
              </a>
            </div>
          </div>
        </header>

        <div className="mb-6 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3">
          <p className="text-xs leading-relaxed text-amber-950/90 md:text-sm">{M.trustLine}</p>
        </div>

        <section id="builder" className="scroll-mt-24">
          <ProposalBuilderWizard />
        </section>

        {/* Closing CTA band */}
        <section
          className="mt-16 overflow-hidden rounded-[1.75rem] border-4 border-black px-6 py-12 text-white md:px-10"
          style={{ background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)" }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-medium md:text-4xl" style={{ fontFamily: SERIF }}>
              Ready when you are
            </h2>
            <p className="mt-4 font-medium text-white/90">
              Save your proposal above, apply for Cherry financing, or book a free consult with our Oswego team.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={CHERRY_PAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
              >
                Apply with Cherry
              </a>
              <Link href="/book" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#E6007E]">
                Book consult
              </Link>
              <a href={M.phoneHref} className="rounded-full border-2 border-white/40 px-6 py-3 text-sm font-bold text-white">
                Call {M.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
