import { Metadata } from "next";
import RegenStaffProtocolsContent from "@/components/staff/RegenStaffProtocolsContent";
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
    "Protocol guides, social media templates, and quick-use RX invoice templates for Hello Gorgeous staff.",
  robots: "noindex, nofollow",
};

export default function StaffProtocolsPage() {
  return (
    <RegenStaffProtocolsContent
      coreGuides={REGEN_CORE_PROTOCOL_GUIDES}
      peptideGuides={REGEN_PEPTIDE_DOSING_GUIDES}
      socialJuly={getRegenStaffSocialJuly2026()}
      socialWeek1={getRegenStaffSocialWeek1()}
      invoiceQuickPicks={getRegenInvoiceQuickPicks()}
      allInvoices={getRegenAllInvoiceTemplates()}
      invoiceTracks={rxInvoiceTracks()}
    />
  );
}
