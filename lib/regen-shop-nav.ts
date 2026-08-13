/**
 * Sticky section nav for /rx (RE GEN shop) — mirrors Brow Journey top tabs.
 */

import { BOOKING_URL } from "@/lib/flows";
import { FIND_YOUR_PEPTIDE_PATH } from "@/lib/rx-patient-journey";

export interface RegenNavItem {
  href: string;
  label: string;
  dropdown?: { href: string; label: string; sub?: string }[];
}

export const REGEN_SCIENCE_DROPDOWN: RegenNavItem["dropdown"] = [
  { href: "/regen-science", label: "Science Hub", sub: "Peptide briefs & evidence library" },
  { href: "/regen-science/education", label: "Peptide Education", sub: "Free learning modules" },
  { href: FIND_YOUR_PEPTIDE_PATH, label: "Find your peptide", sub: "Goal-based peptide quiz" },
];

export const REGEN_SHOP_NAV: RegenNavItem[] = [
  { href: "#shop-by-goal", label: "Goals" },
  { href: FIND_YOUR_PEPTIDE_PATH, label: "Peptide finder" },
  { href: "#popular", label: "Popular" },
  { href: "#stacks", label: "Stacks" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#science", label: "Science", dropdown: REGEN_SCIENCE_DROPDOWN },
  { href: "#faq", label: "FAQ" },
  { href: "/rx?browse=all", label: "All products" },
];

/**
 * Client storefront nav. The long version above is a symptom of a 15-screen page —
 * the shop only needs the goal grid, the process, the FAQ, and the full catalog.
 * Every href here must resolve to a section the client shop still renders.
 */
export const REGEN_SHOP_NAV_CLIENT: RegenNavItem[] = [
  { href: "#shop-by-goal", label: "Goals" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
  { href: "/rx?browse=all", label: "All products" },
];

export const REGEN_SHOP_BOOK_HREF = BOOKING_URL;

export const REGEN_SHOP_FAQS = [
  {
    q: "What is RE GEN by Hello Gorgeous Med Spa?",
    a: "RE GEN is the telehealth and prescription arm of Hello Gorgeous Med Spa in Oswego, Illinois. Browse by goal — GLP-1 weight loss, peptides, hormones, sexual health, and more — then request a consult. Every plan is set by Ryan Kent, FNP-BC before anything is dispensed; nothing here is sold over the counter.",
  },
  {
    q: "Which peptide is right for me?",
    a: "Start with our free educational peptide finder at hellogorgeousmedspa.com/skin-101/find-your-peptide — match goals like recovery, skin, energy, or weight to protocols we discuss. Your NP confirms what’s medically appropriate before any prescription.",
  },
  {
    q: "Who oversees RE GEN treatment plans?",
    a: "Every RE GEN protocol is supervised in Illinois by Ryan Kent, FNP-BC, a board-certified family nurse practitioner — not an out-of-state medical director. Provider review is required before fulfillment.",
  },
  {
    q: "How does RE GEN work?",
    a: "Browse by goal (or take the peptide finder first), then start intake on the protocol you want — free to submit. A $49 consult fee reserves your visit with Ryan Kent, FNP-BC. He reviews your history, sets your protocol, and only then are you invoiced for the medication — which you can pick up in Oswego or have shipped for a flat $30.",
  },
  {
    q: "Where is RE GEN available?",
    a: "RE GEN serves patients across Illinois, including Oswego, Naperville, Aurora, Plainfield, Yorkville, and Montgomery. In-person care is available at Hello Gorgeous Med Spa in Oswego.",
  },
] as const;
