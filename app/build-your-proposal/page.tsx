import type { Metadata } from "next";
import Link from "next/link";
import { PublicProposalBuilder } from "@/components/proposals/PublicProposalBuilder";
import {
  BUILD_YOUR_PROPOSAL_MARKETING,
  BUILD_YOUR_PROPOSAL_PATH,
} from "@/lib/build-your-proposal-marketing";
import { breadcrumbJsonLd, pageMetadata, SITE } from "@/lib/seo";
import { CHERRY_PAY_URL } from "@/lib/flows";

const M = BUILD_YOUR_PROPOSAL_MARKETING;

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
            "radial-gradient(ellipse 80% 50% at 10% 0%, rgba(230,0,126,0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(255,45,142,0.1), transparent 50%), linear-gradient(180deg, #FFF0F7 0%, #ffffff 45%, #f5f5f5 100%)",
        }}
        aria-hidden
      />

      <header className="relative overflow-hidden border-b-4 border-black bg-[#0a0a0a] text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 20% 40%, rgba(230,0,126,0.45), transparent 55%), radial-gradient(ellipse 50% 60% at 85% 20%, rgba(255,45,142,0.35), transparent 50%), linear-gradient(135deg, #0a0a0a 0%, #2d1020 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#FFB8DC]">{M.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
            Build your treatment{" "}
            <span
              className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              {M.accent}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">{M.subhead}</p>
          <p className="mt-3 text-sm text-[#FFB8DC]">{M.trustLine}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#builder"
              className="rounded-full bg-[#E6007E] px-6 py-3 text-sm font-bold text-white"
            >
              Start building
            </a>
            <a
              href={CHERRY_PAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black"
            >
              Apply now with Cherry
            </a>
            <Link
              href="/book"
              className="rounded-full border-2 border-white/40 px-6 py-3 text-sm font-bold text-white"
            >
              Book consult
            </Link>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-20 border-b-4 border-black bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-3">
          <a
            href="#builder"
            className="rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-1.5 text-xs font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
          >
            Builder
          </a>
          <Link
            href="/financing"
            className="rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-1.5 text-xs font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
          >
            Financing
          </Link>
          <Link
            href="/help-me-choose"
            className="rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-1.5 text-xs font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
          >
            Help me choose
          </Link>
          <Link
            href="/specials"
            className="rounded-full border-2 border-black/10 bg-gradient-to-b from-white to-rose-50 px-4 py-1.5 text-xs font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
          >
            Specials
          </Link>
        </div>
      </nav>

      <main id="builder" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10 md:py-14">
        <PublicProposalBuilder />
      </main>

      <section
        className="border-t-4 border-black px-4 py-14 text-white"
        style={{
          background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-black">Ready when you are</h2>
          <p className="mt-2 max-w-xl text-white/90">
            Save your proposal above, apply for Cherry financing, or book a free consult with our Oswego team.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={CHERRY_PAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
            >
              Apply now with Cherry
            </a>
            <Link href="/book" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#E6007E]">
              Book consult
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
