import { Metadata } from "next";
import { Suspense } from "react";
import RegenStaffProtocolsContent from "@/components/staff/RegenStaffProtocolsContent";
import { CLINICAL_CHEAT_SHEETS } from "@/lib/clinical-cheat-sheets";
import {
  REGEN_CORE_PROTOCOL_GUIDES,
  REGEN_PEPTIDE_DOSING_GUIDES,
  getRegenAllInvoiceTemplates,
  getRegenInvoiceQuickPicks,
  getRegenStaffSocialJuly2026,
  getRegenStaffSocialWeek1,
} from "@/lib/regen-staff-protocols";
import { rxInvoiceTracks } from "@/lib/rx-invoice-templates";

export const metadata: Metadata = {
  title: "RE GEN Protocols | Staff",
  description:
    "Protocol guides, clinical cheat sheets, social templates, and RX invoice templates for Hello Gorgeous staff.",
  robots: "noindex, nofollow",
};

export default function StaffProtocolsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-black flex items-center justify-center text-pink-300 text-sm">
          Loading protocols…
        </div>
      }
    >
      <RegenStaffProtocolsContent
        coreGuides={REGEN_CORE_PROTOCOL_GUIDES}
        peptideGuides={REGEN_PEPTIDE_DOSING_GUIDES}
        cheatSheets={CLINICAL_CHEAT_SHEETS}
        socialJuly={getRegenStaffSocialJuly2026()}
        socialWeek1={getRegenStaffSocialWeek1()}
        invoiceQuickPicks={getRegenInvoiceQuickPicks()}
        allInvoices={getRegenAllInvoiceTemplates()}
        invoiceTracks={rxInvoiceTracks()}
      />
    </Suspense>
  );
}
