/**
 * Sticky section nav for /rx (RE GEN shop) — mirrors Brow Journey top tabs.
 */

import { BOOKING_URL } from "@/lib/flows";

export const REGEN_SHOP_NAV = [
  { href: "#science", label: "Science" },
  { href: "#shop-by-goal", label: "Goals" },
  { href: "#popular", label: "Popular" },
  { href: "#stacks", label: "Stacks" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
  { href: "/rx/request", label: "Start intake" },
] as const;

export const REGEN_SHOP_BOOK_HREF = BOOKING_URL;

export const REGEN_SHOP_FAQS = [
  {
    q: "What is RE GEN by Hello Gorgeous Med Spa?",
    a: "RE GEN is the telehealth and prescription arm of Hello Gorgeous Med Spa in Oswego, Illinois. Shop by goal — GLP-1 weight loss, peptides, hormones, sexual health, and more — with plans reviewed by Ryan Kent, FNP-BC and eligible medications shipped to your home.",
  },
  {
    q: "Who oversees RE GEN treatment plans?",
    a: "Every RE GEN protocol is supervised in Illinois by Ryan Kent, FNP-BC, a board-certified family nurse practitioner — not an out-of-state medical director. Provider review is required before fulfillment.",
  },
  {
    q: "How does RE GEN work?",
    a: "Browse by goal, add items to cart, complete checkout, then finish your health intake. An NP reviews your information (with telehealth when required) before pharmacy fulfillment. Shipping is a flat $30 per order.",
  },
  {
    q: "Where is RE GEN available?",
    a: "RE GEN serves patients across Illinois, including Oswego, Naperville, Aurora, Plainfield, Yorkville, and Montgomery. In-person care is available at Hello Gorgeous Med Spa in Oswego.",
  },
] as const;
