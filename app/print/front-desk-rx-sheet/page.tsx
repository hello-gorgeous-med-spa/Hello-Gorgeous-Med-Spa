import type { Metadata } from "next";

import { FrontDeskPrintBar } from "@/components/print/FrontDeskPrintBar";
import { FrontDeskRxPricingSheet } from "@/components/print/FrontDeskRxPricingSheet";

export const metadata: Metadata = {
  title: "Front Desk RX Pricing Sheet | Hello Gorgeous",
  robots: { index: false, follow: false },
};

export default function FrontDeskRxSheetPage() {
  return (
    <>
      <style>{`
        @media print {
          @page {
            size: letter;
            margin: 0.35in;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .front-desk-rx-sheet {
            max-width: 100% !important;
          }
        }
      `}</style>
      <FrontDeskPrintBar />
      <main className="min-h-screen bg-neutral-100 py-6 print:bg-white print:py-0">
        <FrontDeskRxPricingSheet />
      </main>
    </>
  );
}
