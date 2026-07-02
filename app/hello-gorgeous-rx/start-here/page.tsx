import type { Metadata } from "next";

import { StartHereFlow } from "@/components/hello-gorgeous-rx/StartHereFlow";
import { HELLO_GORGEOUS_RX_START_PATH } from "@/lib/flows";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Start Here | RE GEN™ Peptide Therapy | Oswego, IL",
  description:
    "Start your RE GEN™ peptide journey — pick your peptide, quick verification, and a clear path to NP telehealth, protocol approval, and easy refills. Oswego, IL.",
  path: HELLO_GORGEOUS_RX_START_PATH,
});

type PageProps = {
  searchParams: Promise<{ peptide?: string }>;
};

export default async function HelloGorgeousRxStartHerePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialPeptideId = params.peptide?.trim();

  return <StartHereFlow initialPeptideId={initialPeptideId} />;
}
