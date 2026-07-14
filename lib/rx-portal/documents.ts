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
