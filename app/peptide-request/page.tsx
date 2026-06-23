import type { Metadata } from "next";
import Link from "next/link";

import { PeptideRequestForm } from "@/components/forms/PeptideRequestForm";
import { HELLO_GORGEOUS_RX_START_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import {
  PEPTIDE_CONSULT_FEE_USD,
  PEPTIDE_REQUEST_DISCLAIMER,
  PEPTIDE_TELEHEALTH_NOTE,
} from "@/lib/peptide-request-menu";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Peptide Request & Refill | Hello Gorgeous RX™ | Oswego, IL",
  description:
    "Request a new Hello Gorgeous RX™ peptide protocol or submit a refill request. NP telehealth with Ryan Kent, FNP-BC is required before approval. Oswego, IL — serving Naperville, Aurora & Plainfield.",
  path: PEPTIDE_REQUEST_PATH,
});

type PageProps = {
  searchParams: Promise<{ peptide?: string; paid?: string; type?: string; from?: string }>;
};

export default async function PeptideRequestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const preselectedPeptideId = params.peptide?.trim();
  const paid = params.paid === "1";
  const initialRequestType =
    params.type === "refill" ? ("refill" as const) : params.type === "new" ? ("new" as const) : undefined;

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50/80 via-white to-white text-black">
      <div className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="font-serif text-lg font-semibold text-black hover:text-[#E6007E]">
            <span className="text-[#E6007E]">Hello Gorgeous</span>
            <span className="text-black/70 text-sm font-sans font-medium ml-2">RX™</span>
          </Link>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/peptides" className="text-[#E6007E] font-medium hover:underline">
              Peptide therapy
            </Link>
            <span className="text-black/30">|</span>
            <Link href="/skin-101/find-your-peptide" className="text-black/70 hover:text-[#E6007E]">
              Find your peptide
            </Link>
            <span className="text-black/30">|</span>
            <Link href={HELLO_GORGEOUS_RX_START_PATH} className="text-[#E6007E] font-semibold hover:underline">
              Start Here
            </Link>
            <span className="text-black/30">|</span>
            <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="text-black/70 hover:text-[#E6007E]">
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        {paid && (
          <div className="mb-8 rounded-2xl border-2 border-green-600 bg-green-50 px-5 py-4 text-center text-sm text-green-900">
            Consult payment received — thank you! Book your Video Consult in Charm if you haven&apos;t already.
          </div>
        )}

        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E] mb-2">
            Hello Gorgeous RX™
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-black leading-tight mb-3">
            Peptide request &amp; refill
          </h1>
          <p className="text-black/70 text-sm md:text-base leading-relaxed max-w-2xl mb-4">
            Submit a new protocol request or ask for a refill on your existing Hello Gorgeous RX™ peptides.
            Every submission is reviewed by our NP — telehealth is required before approval. This form is not a
            prescription.
          </p>
          <ul className="text-sm text-black/65 space-y-1 max-w-2xl">
            <li>
              <strong className="text-black">${PEPTIDE_CONSULT_FEE_USD} consult</strong> for new protocols
              (medication priced separately after your plan)
            </li>
            <li>{PEPTIDE_TELEHEALTH_NOTE}</li>
          </ul>
        </div>

        <PeptideRequestForm
          preselectedPeptideId={preselectedPeptideId}
          initialRequestType={initialRequestType}
        />

        <p className="mt-10 text-xs text-black/50 text-center max-w-2xl mx-auto leading-relaxed">
          {PEPTIDE_REQUEST_DISCLAIMER} Questions? Call{" "}
          <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="text-[#E6007E] font-medium">
            {SITE.phone}
          </a>
          . See our{" "}
          <Link href="/privacy" className="text-[#E6007E] underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
