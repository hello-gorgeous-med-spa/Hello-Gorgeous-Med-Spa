/**
 * Sticky section nav for /rx (RE GEN shop) — mirrors Brow Journey top tabs.
 */

import { BOOKING_URL } from "@/lib/flows";
import { goalSlug } from "@/lib/regen/catalog/helpers";

export interface RegenNavItem {
  href: string;
  label: string;
  dropdown?: { href: string; label: string; sub?: string }[];
}

export const REGEN_SCIENCE_DROPDOWN: RegenNavItem["dropdown"] = [
  { href: "/regen-science", label: "Science Hub", sub: "Education library" },
  { href: "/regen-science/education", label: "Peptide Education", sub: "What peptides are" },
  { href: "/rx/request", label: "Medical intake", sub: "Consult first" },
];

export const REGEN_SHOP_NAV: RegenNavItem[] = [
  { href: "#shop-by-goal", label: "Goals" },
  { href: "/rx/request", label: "Intake" },
  { href: "#popular", label: "Popular" },
  { href: "#stacks", label: "Stacks" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#science", label: "Science", dropdown: REGEN_SCIENCE_DROPDOWN },
  { href: "#faq", label: "FAQ" },
  { href: "/rx/request", label: "Start intake" },
];

/** Short aisle names for the public shop — store departments, not catalog goals. */
export const STORE_AISLE_LABEL: Record<string, string> = {
  "Lose Weight": "Weight Loss",
  "Recovery & Performance": "Recovery",
  Intimacy: "Intimacy",
  Hormones: "Hormones",
  "Skin & Hair": "Skin & Hair",
  "Energy & Longevity": "Energy",
};

/** Department chips + Shop all. Built from the goals the public shop actually lists. */
export function regenClientShopNav(goals: readonly string[]): RegenNavItem[] {
  return [
    ...goals.map((goal) => ({
      href: `/rx?goal=${goalSlug(goal)}`,
      label: STORE_AISLE_LABEL[goal] ?? goal,
    })),
    { href: "/rx/request", label: "Start intake" },
  ];
}

/**
 * Fallback client nav if a caller has not passed live goals. Prefer
 * `regenClientShopNav(CLIENT_SHOP_GOALS)` so unpublished aisles drop off.
 */
export const REGEN_SHOP_NAV_CLIENT: RegenNavItem[] = regenClientShopNav([
  "Lose Weight",
  "Hormones",
]);

export const REGEN_SHOP_BOOK_HREF = BOOKING_URL;

export const REGEN_SHOP_FAQS = [
  {
    q: "What is RE GEN by Hello Gorgeous Med Spa?",
    a: "RE GEN is the telehealth and prescription arm of Hello Gorgeous Med Spa in Oswego, Illinois. We advertise medical consultations — not a public compounded-peptide catalog. Every plan is set by Ryan Kent, FNP-BC before anything is dispensed.",
  },
  {
    q: "How do I know which treatment is right for me?",
    a: "Start a medical intake. Ryan Kent, FNP-BC reviews your history and labs and decides whether a prescription is clinically appropriate. We do not publish a public peptide menu.",
  },
  {
    q: "Who oversees RE GEN treatment plans?",
    a: "Every RE GEN protocol is supervised in Illinois by Ryan Kent, FNP-BC, a board-certified family nurse practitioner, with medical-director oversight. Provider review is required before fulfillment.",
  },
  {
    q: "How does RE GEN work?",
    a: "Start intake — free to submit. A $49 consult fee reserves your visit with Ryan Kent, FNP-BC. Fees for routine professional services may be adjusted. He reviews your history and only then are you invoiced for medication, if prescribed — pickup in Oswego or Illinois shipping.",
  },
  {
    q: "Where is RE GEN available?",
    a: "RE GEN serves patients across Illinois, including Oswego, Naperville, Aurora, Plainfield, Yorkville, and Montgomery. In-person care is available at Hello Gorgeous Med Spa in Oswego.",
  },
] as const;
