/**
 * REGEN RX launch promo — GORGEOUS20.
 * Stripe Checkout already accepts promotion codes (`allow_promotion_codes`).
 * The 20% coupon must exist in the REGEN Stripe account as code GORGEOUS20.
 */

export const GORGEOUS20_CODE = "GORGEOUS20" as const;
export const GORGEOUS20_PERCENT = 20;
export const GORGEOUS20_PATH = "/regen/gorgeous20" as const;
export const GORGEOUS20_PUBLIC_PATH = "/gorgeous20" as const;
export const GORGEOUS20_START_HREF = `/start?promo=${GORGEOUS20_CODE}` as const;

export const GORGEOUS20_HERO =
  "/images/regen/marketing/dani-ryan-syringes-hero.png" as const;
export const GORGEOUS20_PORTRAIT =
  "/images/regen/marketing/dani-ryan-syringes-portrait.png" as const;

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
    name: "Recovery Blend",
    detail: "BPC-157 / TB-500",
    from: "$200 + $35 ship",
    href: "/start?goal=bundles&program=recovery&promo=GORGEOUS20",
  },
  {
    name: "Skin Repair",
    detail: "GLOW — BPC / TB / GHK-Cu",
    from: "$200 + $35 ship",
    href: "/start?goal=bundles&program=skin-repair&promo=GORGEOUS20",
  },
  {
    name: "Peak Performance",
    detail: "CJC-1295 / Ipamorelin + NAD+",
    from: "$350 + $35 ship",
    href: "/start?goal=bundles&program=peak&promo=GORGEOUS20",
  },
  {
    name: "Focus Blend",
    detail: "Semax / Selank",
    from: "$200 + $35 ship",
    href: "/start?goal=bundles&program=neuro&promo=GORGEOUS20",
  },
  {
    name: "The Radiance Pair",
    detail: "Glutathione + NAD+",
    from: "$250 + $35 ship",
    href: "/start?goal=bundles&program=radiance&promo=GORGEOUS20",
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

Weight loss · hormones · vitamins · recovery stacks · hair · Rx skincare.

Ryan prescribes only when it is clinically right for you. Illinois patients. Compounded medications are not FDA-approved.

tryregenrx.com/start

#REGENRX #HelloGorgeous #OswegoIL`,
  facebook: `We opened a prescription door for Hello Gorgeous clients.

Danielle and Ryan Kent, FNP-BC — REGEN RX. Weight loss, hormones, vitamins, and stacks Ryan can prescribe when it is appropriate.

First order 20% off. Code GORGEOUS20 on the payment screen.

Illinois only. Compounded medications are not FDA-approved. A request is a consult — not a guaranteed prescription.

Start free: tryregenrx.com/start`,
  gbp: `REGEN RX is live from Hello Gorgeous in Oswego.

Danielle + Ryan Kent, FNP-BC. First order 20% off with GORGEOUS20.

Weight loss, hormones, vitamins, recovery stacks — prescribed only when clinically appropriate. Illinois patients.

tryregenrx.com/start`,
} as const;
