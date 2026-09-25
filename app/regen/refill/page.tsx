import type { Metadata } from "next";
import Link from "next/link";

import { BPC157_REFILL_PATH, REGEN_REFILL_HUB_PATH } from "@/lib/regen/bpc-157-refill-screening";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "REGEN RX Refill Request",
    description: "Existing REGEN RX patients — request a refill screening for provider review. BPC-157 is live.",
    path: REGEN_REFILL_HUB_PATH,
  }),
  robots: { index: false, follow: false },
};

export default function RegenRefillHubPage() {
  return (
    <div className="min-h-screen bg-[#050507] px-6 py-16 text-white">
      <div className="mx-auto max-w-xl">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#f5c2c7]">REGEN RX · Existing patients</p>
        <h1 className="mt-3 font-serif text-[42px] leading-tight">Refill request</h1>
        <p className="mt-3 text-[14px] text-white/55">
          A refill is another clinical review — not an automatic fill. Pick your protocol, complete screening, and Ryan
          reviews before any clinic invoice.
        </p>
        <Link
          href={BPC157_REFILL_PATH}
          className="mt-8 block rounded-[20px] border border-[#f5c2c7]/30 bg-[#0d0d11] p-6 transition hover:border-[#f5c2c7]"
        >
          <p className="text-[10px] uppercase tracking-widest text-[#f5c2c7]">Live now</p>
          <p className="mt-2 text-[24px]">BPC-157</p>
          <p className="mt-1 text-[13px] text-white/50">Approved-patient refill screening · capsule, SubQ, or nasal</p>
        </Link>
        <p className="mt-8 text-[12px] text-white/35">
          GLP-1 patients use{" "}
          <Link href="/glp1-refill" className="text-[#f5c2c7] underline">
            /glp1-refill
          </Link>
          . Other peptides are added next from this same screening.
        </p>
      </div>
    </div>
  );
}
