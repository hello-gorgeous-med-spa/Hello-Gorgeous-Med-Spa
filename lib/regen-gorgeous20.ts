/**
 * REGEN RX launch promo — GORGEOUS20.
 * Stripe Checkout already accepts promotion codes (`allow_promotion_codes`).
 * The 20% coupon must exist in the REGEN Stripe account as code GORGEOUS20.
 */

export const GORGEOUS20_CODE = "GORGEOUS20" as const;
export const GORGEOUS20_PERCENT = 20;
export const GORGEOUS20_START_HREF = `/start?promo=${GORGEOUS20_CODE}` as const;

/** Repeating ticker copy — no dedicated landing page. */
export const GORGEOUS20_MARQUEE = [
  `GORGEOUS20 · ${GORGEOUS20_PERCENT}% off your first order`,
  "Enter the code on the payment screen",
  "Illinois patients · Ryan decides",
] as const;

export const GORGEOUS20_HERO =
  "/images/regen/marketing/dani-ryan-syringes-hero.png" as const;
export const GORGEOUS20_PORTRAIT =
  "/images/regen/marketing/dani-ryan-syringes-portrait.png" as const;

export const REGEN_VIAL_LINEUP =
  "/images/regen/marketing/cell-peptide.png" as const;
export const REGEN_VIAL_ART = {
  lineup: REGEN_VIAL_LINEUP,
  recovery: "/images/regen/marketing/cell-peptide.png",
  fullRecovery: "/images/regen/marketing/cell-peptide.png",
  peak: "/images/regen/marketing/cell-peptide.png",
  tesamorelinIpa: "/images/regen/marketing/cell-peptide.png",
} as const;

export const GORGEOUS20_LEGAL =
  "Illinois patients only. One use on your first REGEN RX medication order. Enter the code on the payment screen. Shipping is not discounted. Ryan Kent, FNP-BC prescribes only when clinically appropriate, including off-label use when indicated. Compounded medications are not FDA-approved. Requesting a visit is a consult — not a guaranteed prescription.";

export type Gorgeous20Example = {
  name: string;
  detail: string;
  from: string;
  href: string;
};

export const GORGEOUS20_EXAMPLES: Gorgeous20Example[] = [
  {
    name: "Weight loss",
    detail: "Tirzepatide & semaglutide — NP-guided GLP-1",
    from: "from $100",
    href: "/start?goal=weight-loss&promo=GORGEOUS20",
  },
  {
    name: "Hormones",
    detail: "Women’s HRT & men’s TRT",
    from: "from $149",
    href: "/start?goal=hormones&promo=GORGEOUS20",
  },
  {
    name: "Vitamins",
    detail: "B12, biotin, glutathione, NAD+",
    from: "from $73",
    href: "/start?goal=vitamins&promo=GORGEOUS20",
  },
  {
    name: "The Radiance Pair",
    detail: "Glutathione + NAD+",
    from: "$250 + $35 ship",
    href: "/start?goal=energy&program=radiance&promo=GORGEOUS20",
  },
  {
    name: "Hair",
    detail: "Prescription hair support when appropriate",
    from: "consult",
    href: "/start?goal=hair&promo=GORGEOUS20",
  },
  {
    name: "Rx skincare",
    detail: "Tretinoin, GHK-Cu, custom compounds",
    from: "from $125",
    href: "/start?goal=skincare&promo=GORGEOUS20",
  },
];

export const GORGEOUS20_COPY = {
  sms: `Same Danielle. Same Ryan. New door — REGEN RX. First order 20% off with GORGEOUS20. Illinois only, Ryan decides. Start free: tryregenrx.com/start?promo=GORGEOUS20`,
  emailSubject: `GORGEOUS20 — 20% off your first REGEN RX order`,
  instagram: `Same team you already trust. New prescription door.

Danielle + Ryan Kent, FNP-BC. Black scrubs. REGEN RX.

First order 20% off with code GORGEOUS20.

Weight loss · hormones · vitamins · NAD+ · hair · Rx skincare.

Ryan prescribes only when it is clinically right for you. Illinois patients. Compounded medications are not FDA-approved.

tryregenrx.com/start

#REGENRX #HelloGorgeous #OswegoIL`,
  facebook: `We opened a prescription door for Hello Gorgeous clients.

Danielle and Ryan Kent, FNP-BC — REGEN RX. Weight loss, hormones, vitamins, and NAD+ support Ryan can prescribe when it is appropriate.

First order 20% off. Code GORGEOUS20 on the payment screen.

Illinois only. Compounded medications are not FDA-approved. A request is a consult — not a guaranteed prescription.

Start free: tryregenrx.com/start`,
  gbp: `REGEN RX is live from Hello Gorgeous in Oswego.

Danielle + Ryan Kent, FNP-BC. First order 20% off with GORGEOUS20.

Weight loss, hormones, vitamins, NAD+ — prescribed only when clinically appropriate. Illinois patients.

tryregenrx.com/start`,
} as const;
