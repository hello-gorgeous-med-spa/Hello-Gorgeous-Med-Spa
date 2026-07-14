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

/** FormuConnect / Formulation Compounding Center agreements (signed copies). */
export const RX_PORTAL_COMPLIANCE_DOCS = [
  {
    id: "formuconnect-msa",
    title: "FormuConnect Master Service Agreement",
    description:
      "MSA with Formulation Compounding Center, LLC — electronic prescribing portal services, HIPAA/security, LegitScript, term & liability. Signed by Ryan Kent (May 7, 2026).",
    href: "/rx-portal/compliance/formuconnect-msa.pdf",
    signedBy: "Ryan Kent",
    signedAt: "May 7, 2026",
  },
  {
    id: "formuconnect-privacy",
    title: "FormuConnect Privacy Policy",
    description:
      "Consumer privacy policy for FormuConnect / Formulation Compounding Center — data types, retention, security, CCPA notice. Signed by Ryan Kent (May 7, 2026).",
    href: "/rx-portal/compliance/formuconnect-privacy.pdf",
    signedBy: "Ryan Kent",
    signedAt: "May 7, 2026",
  },
  {
    id: "formuconnect-terms",
    title: "FormuConnect Terms & Conditions",
    description:
      "Website / portal terms of use — license, disclaimers, liability limits, Texas governing law. Signed by Ryan Kent (May 7, 2026).",
    href: "/rx-portal/compliance/formuconnect-terms.pdf",
    signedBy: "Ryan Kent",
    signedAt: "May 7, 2026",
  },
] as const;

/**
 * Ops safety checklist distilled from signed FormuConnect agreements.
 * Not legal advice — practice risk control for Hello Gorgeous / RE GEN.
 */
export const RX_PORTAL_FORMUCONNECT_SAFETY = {
  vendor: "Formulation Compounding Center, LLC (FormuConnect)",
  vendorContact: "info@formulationrx.com · 1511 Justin Rd, STE 106A, Lewisville, TX 75077",
  signedBy: "Ryan Kent",
  signedAt: "May 7, 2026",
  bullets: [
    {
      title: "Patient consents are on you",
      body: "MSA §II — Hello Gorgeous must obtain patient consents/authorizations before using/disclosing PHI through FormuConnect. Keep Charm + RE GEN consents current; never upload/enter PHI without a signed treatment + privacy path.",
    },
    {
      title: "HIPAA + HITECH both apply",
      body: "MSA §V–VII claim AES-256 at rest, TLS in transit, MFA, 6-year audit logs, LegitScript. Still treat FormuConnect as a BAA/vendor: least-privilege logins, no shared passwords, log who placed each compound order.",
    },
    {
      title: "They disclaim warranties & limit liability",
      body: "MSA §XI–XII — formulations/portal are largely “as is”; they exclude consequential damages. Clinical accountability for what you prescribe stays with Ryan / HG. Document NP approval in RE GEN before pharmacy submit.",
    },
    {
      title: "Renewal trap",
      body: "MSA auto-renews annually unless you give 60 days’ written notice before renewal. Calendar a 75-day-out review (contract + LegitScript status + IL shipping).",
    },
    {
      title: "Illinois practice gate",
      body: "Portal does not replace IL NP practice rules. Only eligible Illinois patients; telehealth cadence + chart stay in Charm/Fresha (or Square telehealth once migrated).",
    },
    {
      title: "Terms ≠ clinical SOP",
      body: "Terms are website license (TX law). Do not rely on them for compounding QA, recalls, or ADE reporting — keep FormuConnect + BoomRx pharmacy SOPs printed for desk.",
    },
  ],
} as const;

export type RxPortalTutorial = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  /** When set, Tutorials page embeds this video (mp4 under /public). */
  videoSrc?: string;
};

/** FormuConnect pharmacy portal how-tos (vendor training for staff). */
export const RX_PORTAL_FORMUCONNECT_VIDEOS: RxPortalTutorial[] = [
  {
    id: "formuconnect-place-submit",
    title: "Place & Submit Orders in FormuConnect",
    description:
      "How to place and submit compounding orders in the FormuConnect (Formulation) provider portal.",
    href: "/rx-portal/tutorials/formuconnect-place-and-submit-orders.mp4",
    videoSrc: "/rx-portal/tutorials/formuconnect-place-and-submit-orders.mp4",
    category: "FormuConnect",
  },
  {
    id: "formuconnect-navigate-dashboard",
    title: "Navigate Provider Dashboard in FormuConnect",
    description:
      "Tour of the FormuConnect provider dashboard — where to find orders, status, and account tools.",
    href: "/rx-portal/tutorials/formuconnect-navigate-provider-dashboard.mp4",
    videoSrc: "/rx-portal/tutorials/formuconnect-navigate-provider-dashboard.mp4",
    category: "FormuConnect",
  },
];

export function rxPortalTutorials(): RxPortalTutorial[] {
  const sheets = CLINICAL_CHEAT_SHEETS.slice(0, 24).map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    href: s.href,
    category: s.category,
  }));
  return [...RX_PORTAL_FORMUCONNECT_VIDEOS, ...sheets];
}
