/**
 * Staff docs + tutorials for RX Provider Portal (no PHI).
 */

import { CLINICAL_CHEAT_SHEETS } from "@/lib/clinical-cheat-sheets";

export const RX_PORTAL_DOCUMENTS = [
  {
    id: "order-qa",
    title: "Front Desk Order Q&A",
    description:
      "Most-asked questions when a client is placing or tracking an RX order. Print from repo: docs/internal/front-desk-order-qa.html (or Desktop PDF).",
    href: "/staff/protocols",
    note: "Ask owner for latest printed PDF · npm run generate-front-desk-order-qa",
  },
  {
    id: "pricing-sheet",
    title: "Front Desk RX Pricing Sheet",
    description: "Talk tracks + from-pricing for peptides and GLP-1.",
    href: "/staff/protocols",
    note: "Regenerate via npm run generate-front-desk-sheet",
  },
  {
    id: "rx-guide",
    title: "Patient RX Online Guide",
    description: "Public client-facing refill & status guide.",
    href: "/rx/guide",
  },
  {
    id: "staff-protocols",
    title: "Staff Protocols Hub",
    description: "In-spa protocol sheets and pharmacy helpers.",
    href: "/staff/protocols",
  },
  {
    id: "staff-pharmacy",
    title: "Staff Pharmacy Catalog",
    description: "Pharmacy catalog helpers for desk and clinical staff.",
    href: "/staff/pharmacy",
  },
] as const;

export function rxPortalTutorials() {
  return CLINICAL_CHEAT_SHEETS.slice(0, 24).map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    href: s.href,
    category: s.category,
  }));
}
