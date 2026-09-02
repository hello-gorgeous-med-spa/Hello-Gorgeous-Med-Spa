import Link from "next/link";
import QRCode from "qrcode";

import { PrintButton } from "@/components/partner-network/PrintButton";
import { getPartnerDashboard } from "@/lib/partner-network-server";
import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import { PARTNER_CONSULT_USD, PARTNER_FEES, partnerDoorUrl } from "@/lib/partner-network";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function PartnerNetworkPrintPage() {
  const dashboard = await getPartnerDashboard();
  if (!dashboard) {
    return (
      <div className="p-8">
        <p>Partner network not seeded.</p>
        <Link href="/admin/rx/partner-network" className="font-bold text-[#E6007E] underline">
          Back
        </Link>
      </div>
    );
  }

  const cards = await Promise.all(
    dashboard.locations
      .filter((l) => l.status !== "paused")
      .map(async (loc) => {
        const url = partnerDoorUrl(loc.slug, SITE.url);
        const svg = await QRCode.toString(url, {
          type: "svg",
          width: 240,
          margin: 1,
          errorCorrectionLevel: "M",
          color: { dark: "#0a0a0a", light: "#ffffff" },
        });
        return { loc, url, svg };
      }),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 print:max-w-none print:px-0 print:py-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-black">QR tent cards</h1>
          <p className="text-sm text-black/60">Print, cut, leave at each front desk. One code per spa.</p>
        </div>
        <div className="flex gap-3 text-sm">
          <PrintButton className="font-bold text-[#E6007E] underline" />
          <Link href="/admin/rx/partner-network" className="font-bold text-[#E6007E] underline">
            Back
          </Link>
        </div>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 print:grid-cols-2">
        {cards.map(({ loc, url, svg }) => (
          <li
            key={loc.id}
            className="print:break-inside-avoid flex flex-col items-center rounded-3xl border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0_0_rgba(230,0,126,0.25)]"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E6007E]">
              Hello Gorgeous RE GEN
            </p>
            <h2 className="mt-1 text-xl font-black">{loc.name}</h2>
            <p className="text-xs text-black/55">{loc.city || "Fox Valley"}</p>
            <div
              className="mt-4 rounded-xl border-2 border-black bg-white p-2 [&>svg]:h-auto [&>svg]:w-full [&>svg]:max-w-[200px]"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            <p className="mt-3 text-sm font-bold">Scan for medical peptides &amp; weight loss</p>
            <p className="mt-2 max-w-[32ch] text-[11px] leading-snug text-black/70">
              You become a Hello Gorgeous patient. {PRESCRIBING_NP.displayName} reviews every chart.
              We do not leave vials here. ${PARTNER_CONSULT_USD} consult · meds after approval.
            </p>
            <p className="mt-3 font-mono text-[10px] text-black/40">{url}</p>
            <p className="mt-2 text-[10px] text-black/45">
              Referring spa earns ${PARTNER_FEES.spaFirstOrderUsd} when the first medication order is
              paid. Oversight: {MEDICAL_DIRECTOR.displayName}.
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
