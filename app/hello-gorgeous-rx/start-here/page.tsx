import type { Metadata } from "next";
import Link from "next/link";

import { StartHereFlow } from "@/components/hello-gorgeous-rx/StartHereFlow";
import { HELLO_GORGEOUS_RX_START_PATH } from "@/lib/flows";
import { HELLO_GORGEOUS_RX } from "@/lib/hello-gorgeous-rx";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Start Here | Hello Gorgeous RX™ Peptide Therapy | Oswego, IL",
  description:
    "Start your Hello Gorgeous RX™ peptide journey — pick your peptide, quick verification, and a clear path to NP telehealth, protocol approval, and easy refills. Oswego, IL.",
  path: HELLO_GORGEOUS_RX_START_PATH,
});

type PageProps = {
  searchParams: Promise<{ peptide?: string }>;
};

export default async function HelloGorgeousRxStartHerePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialPeptideId = params.peptide?.trim();

  return (
    <>
      <div className="border-b-2 border-black bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link href="/" className="font-serif font-semibold hover:text-[#E6007E]">
            <span className="text-[#E6007E]">Hello Gorgeous</span>
            <span className="text-black/60 ml-2">{HELLO_GORGEOUS_RX.name}</span>
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link href="/peptides" className="text-black/70 hover:text-[#E6007E]">
              Peptide hub
            </Link>
            <Link href="/app?rx=1" className="text-[#E6007E] font-semibold hover:underline">
              Open in app
            </Link>
            <a href={`tel:${SITE.phone.replace(/\D/g, "")}`} className="text-black/70 hover:text-[#E6007E]">
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>
      <StartHereFlow initialPeptideId={initialPeptideId} />
    </>
  );
}
