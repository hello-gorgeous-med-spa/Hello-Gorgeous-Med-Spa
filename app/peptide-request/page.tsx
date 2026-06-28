import type { Metadata } from "next";

import { PeptideRequestForm } from "@/components/forms/PeptideRequestForm";
import {
  RxIntakeLegalFooter,
  RxIntakeShell,
  RxIntakeTrustStrip,
} from "@/components/rx/intake/RxIntakeShell";
import { RxIntakePricingAccordion } from "@/components/rx/intake/RxIntakePricingAccordion";
import { HELLO_GORGEOUS_RX_START_PATH, PEPTIDE_REQUEST_PATH, RX_PATIENT_CARE_PATH } from "@/lib/flows";
import {
  PEPTIDE_CONSULT_FEE_USD,
  PEPTIDE_REQUEST_DISCLAIMER,
  PEPTIDE_TELEHEALTH_NOTE,
} from "@/lib/peptide-request-menu";
import { RX_INTAKE_NAV_PEPTIDE } from "@/lib/rx-intake-nav";
import { pageMetadata } from "@/lib/seo";

const HERO_IMAGE = "/images/rx-care/bpc-157.png";

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
    <RxIntakeShell
      maxWidthClass="max-w-4xl"
      navLinks={RX_INTAKE_NAV_PEPTIDE}
      hero={{
        pill: "New protocol or refill",
        locality: "Hello Gorgeous RX™ · Oswego, IL",
        title: "Peptide",
        titleAccent: "request",
        imageSrc: HERO_IMAGE,
        imageAlt: "Hello Gorgeous peptide therapy — BPC-157 and recovery protocols",
        body: (
          <>
            Submit a new protocol or refill in a guided flow. Ryan Kent, FNP-BC reviews every request —
            telehealth is required before approval. This form is not a prescription.
          </>
        ),
      }}
    >
      {paid && (
        <div className="rounded-2xl border-2 border-green-600 bg-green-50 px-5 py-4 text-center text-sm text-green-900">
          Consult payment received — thank you! Book your Video Consult on Fresha if you haven&apos;t already.
        </div>
      )}

      <RxIntakeTrustStrip />

      <RxIntakePricingAccordion title="Peptide consult & refills">
        <p>
          <strong className="text-black">${PEPTIDE_CONSULT_FEE_USD} consult</strong> for new protocols (medication
          priced separately after your plan)
        </p>
        <p>{PEPTIDE_TELEHEALTH_NOTE}</p>
        <p>Refills: pay at checkout after Ryan approves your protocol · 90-day supply options available</p>
        <p className="text-black/55">{PEPTIDE_REQUEST_DISCLAIMER}</p>
        <p>
          Not sure which peptide?{" "}
          <a href="/skin-101/find-your-peptide" className="font-semibold text-[#E6007E] underline">
            Find your peptide
          </a>{" "}
          ·{" "}
          <a href={HELLO_GORGEOUS_RX_START_PATH} className="font-semibold text-[#E6007E] underline">
            Start here
          </a>{" "}
          ·{" "}
          <a href={RX_PATIENT_CARE_PATH} className="font-semibold text-[#E6007E] underline">
            Care hub
          </a>
        </p>
      </RxIntakePricingAccordion>

      <PeptideRequestForm
        preselectedPeptideId={preselectedPeptideId}
        initialRequestType={initialRequestType}
      />

      <RxIntakeLegalFooter />
    </RxIntakeShell>
  );
}
