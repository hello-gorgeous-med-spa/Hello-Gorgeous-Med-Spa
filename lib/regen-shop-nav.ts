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
  { href: "/rx/request", label: "Start intake" },
];

export const REGEN_SHOP_BOOK_HREF = BOOKING_URL;

export const REGEN_SHOP_FAQS = [
  {
    q: "What is RE GEN by Hello Gorgeous Med Spa?",
    a: "RE GEN is the telehealth and prescription arm of Hello Gorgeous Med Spa in Oswego, Illinois. Shop by goal — GLP-1 weight loss, peptides, hormones, sexual health, and more — with plans reviewed by Ryan Kent, FNP-BC and eligible medications shipped to your home.",
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
    a: "Browse by goal (or take the peptide finder first), add items to cart, complete checkout, then finish your health intake. An NP reviews your information (with telehealth when required) before pharmacy fulfillment. Shipping is a flat $30 per order.",
  },
  {
    q: "Where is RE GEN available?",
    a: "RE GEN serves patients across Illinois, including Oswego, Naperville, Aurora, Plainfield, Yorkville, and Montgomery. In-person care is available at Hello Gorgeous Med Spa in Oswego.",
  },
] as const;
