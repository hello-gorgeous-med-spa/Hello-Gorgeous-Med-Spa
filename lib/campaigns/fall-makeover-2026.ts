/**
 * Fall Makeover 2026 — inside + out packages: Repair · Prevent · Lose.
 * Menu anchors come from live libs. Package totals lock at consult (Rx + area mapping).
 * Separate from Fall into Facials ($129 / $199).
 */

import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";
import { HYDRAFACIAL_GLOW_SPECIAL } from "@/lib/hydrafacial-marketing";
import { IPL_79_SPECIAL } from "@/lib/oswego-specials";
import { SQUARE_FALL_MAKEOVER_VARIATIONS, squareAppointmentServiceUrl } from "@/lib/flows";
import { SITE } from "@/lib/seo";
import {
  FORMULATION_COLD_SHIP_USD,
  FORMULATION_GHK_CU_MED_USD,
  FORMULATION_GHK_CU_TOTAL_USD,
} from "@/lib/proposals/packages";
import { XEOMIN_UNIT_PRICE_USD } from "@/lib/xeomin-intro";

export const FALL_MAKEOVER_PATH = "/fall-makeover" as const;

export const FALL_MAKEOVER_SOLARIA_SESSION_USD = 899;
export const FALL_MAKEOVER_MORPHEUS_FROM_USD = 799;
export const FALL_MAKEOVER_IPL_COUNT = 3;
export const FALL_MAKEOVER_MORPHEUS_LOSE_COUNT = 2;
export const FALL_MAKEOVER_HYDRA_PREVENT_COUNT = 2;

export const FALL_MAKEOVER_CAMPAIGN = {
  name: "HG Fall Makeover — 2026",
  seasonLabel: "Fall Makeover",
  path: FALL_MAKEOVER_PATH,
  imagePath: "/images/marketing/fall-makeover/social-v2.png" as const,
  ogImagePath: "/images/marketing/fall-makeover/og.png" as const,
  storyImagePath: "/images/marketing/fall-makeover/story.png" as const,
  gbpImagePath: "/images/marketing/fall-makeover/og.png" as const,
  giftCardImagePath: "/images/marketing/fall-makeover/gift-card.png" as const,
  bookPath: squareAppointmentServiceUrl(SQUARE_FALL_MAKEOVER_VARIATIONS.consult),
  socialPath: `${FALL_MAKEOVER_PATH}?utm_source=social&utm_medium=page_post&utm_campaign=fall_makeover_2026`,
  gbpPath: `${FALL_MAKEOVER_PATH}?utm_source=google&utm_medium=gbp_post&utm_campaign=fall_makeover_2026` as const,
  squareAudience: "HG All Opt-In",
  squareObjective: "Send a newsletter / promote a service",
  sendWhen: "Wednesday 11:00 AM America/Chicago",
  phoneDisplay: "(630) 636-6193",
} as const;

export const FALL_MAKEOVER_CONTACT = {
  bookHref: FALL_MAKEOVER_CAMPAIGN.bookPath,
  phoneTel: `tel:${SITE.phone.replace(/\D/g, "")}`,
  phoneDisplay: FALL_MAKEOVER_CAMPAIGN.phoneDisplay,
  textTel: "sms:6302016867",
  textDisplay: "(630) 201-6867",
  financingHref: "https://withcherry.com/apply",
} as const;

export const FALL_MAKEOVER_NAV = [
  { href: "#who-we-are", label: "This is us" },
  { href: "#packages", label: "Packages" },
  { href: "#gift-card", label: "Gift card" },
  { href: "#squares", label: "Squares" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

const EVENT = "/images/studio/event-party";

export const FALL_MAKEOVER_EVENT_PHOTOS = [
  {
    src: `${EVENT}/party-01.jpg`,
    alt: "Danielle celebrating in the downtown Oswego studio with a rose-gold balloon",
    caption: "This is us",
    span: "wide" as const,
    focus: "center 38%",
  },
  {
    src: `${EVENT}/party-portrait-01.jpg`,
    alt: "Ryan Kent, FNP-BC treating a guest at a Hello Gorgeous studio event",
    caption: "Ryan, FNP-BC",
    span: "tall" as const,
    focus: "center 22%",
  },
  {
    src: `${EVENT}/party-05.jpg`,
    alt: "Guests together on the lounge sofa at a Hello Gorgeous event night",
    caption: "Our people",
    span: "square" as const,
    focus: "center 40%",
  },
  {
    src: `${EVENT}/party-04.jpg`,
    alt: "Event night in the new Washington Street studio — lounge, treatment chair, and friends",
    caption: "Event night",
    span: "wide" as const,
    focus: "center 48%",
  },
  {
    src: `${EVENT}/party-portrait-02.jpg`,
    alt: "Close-up of a guest during a treatment at Hello Gorgeous Med Spa",
    caption: "In the chair",
    span: "half" as const,
    focus: "center 22%",
  },
  {
    src: `${EVENT}/party-portrait-04.jpg`,
    alt: "Ryan Kent reviewing a treatment with a guest in the studio chair",
    caption: "Mapped in real time",
    span: "half" as const,
    focus: "center 28%",
  },
] as const;

/** Four lifestyle frames for the homepage — skip the tight clinical close-ups. */
export const HOME_THIS_IS_US_PHOTOS = FALL_MAKEOVER_EVENT_PHOTOS.slice(0, 4);

export type FallMakeoverLane = "inside" | "outside";

export type FallMakeoverLine = {
  name: string;
  detail: string;
  priceLabel: string;
  href: string;
  lane: FallMakeoverLane;
};

export type FallMakeoverPackageId = "repair" | "prevent" | "lose";

export type FallMakeoverPackage = {
  id: FallMakeoverPackageId;
  number: string;
  name: string;
  concern: string;
  tagline: string;
  why: string;
  image: string;
  imageAlt: string;
  bookHref: string;
  /** Launch savings applied at consult — not a published bundle total. */
  savingsUsd: number;
  savingsLabel: string;
  lines: FallMakeoverLine[];
};

function bookPkg(id: FallMakeoverPackageId): string {
  return squareAppointmentServiceUrl(SQUARE_FALL_MAKEOVER_VARIATIONS[id]);
}

export const FALL_MAKEOVER_PACKAGES: FallMakeoverPackage[] = [
  {
    id: "repair",
    number: "01",
    name: "Repair",
    concern: "Hyperpigmentation",
    tagline: "Fade what’s already there — light, laser, and a 90-day peptide.",
    why: "Sun, heat, and leftover summer pigment show up in fall. Repair hits the mark from the surface and from the inside so the fade has something to hold.",
    image: "/images/marketing/fall-makeover/repair-v2.png",
    imageAlt: "Fall Makeover Repair — pigment package at Hello Gorgeous Med Spa",
    bookHref: bookPkg("repair"),
    savingsUsd: 100,
    savingsLabel: "$100 off + complimentary gift card",
    lines: [
      {
        name: "IPL photofacial ×3",
        detail: "Zemits DuoCratus series — pigment, redness, and dull tone, mapped at consult.",
        priceLabel: `${IPL_79_SPECIAL.price} each`,
        href: IPL_79_SPECIAL.detailsHref,
        lane: "outside",
      },
      {
        name: "Solaria CO₂ ×1",
        detail: "One fractional resurfacing session for texture, sun damage, and stubborn spots.",
        priceLabel: `$${FALL_MAKEOVER_SOLARIA_SESSION_USD}`,
        href: "/solaria-co2-oswego",
        lane: "outside",
      },
      {
        name: "Compounded medical-grade lightener",
        detail: "Miracle Cream when prescribed — hydroquinone with a retinoic blend. Ryan clears it first.",
        priceLabel: "Priced at consult",
        href: "/rx?goal=hair-skin",
        lane: "inside",
      },
      {
        name: "GHK-Cu 90-day + biotin",
        detail: "Compounded copper peptide with biotin — collagen and skin-support protocol, not a retail serum.",
        priceLabel: `$${FORMULATION_GHK_CU_TOTAL_USD} ($${FORMULATION_GHK_CU_MED_USD} + $${FORMULATION_COLD_SHIP_USD} ship)`,
        href: "/peptides",
        lane: "inside",
      },
    ],
  },
  {
    id: "prevent",
    number: "02",
    name: "Prevent",
    concern: "Anti-aging",
    tagline: "Keep fall from etching summer into next year.",
    why: "Prevent is not another pigment protocol. K-Glow plus a retinoid work inside; Xeomin, one Morpheus8, and two Glow facials hold the surface through the season.",
    image: "/images/marketing/fall-makeover/prevent-v2.png",
    imageAlt: "Fall Makeover Prevent — anti-aging package at Hello Gorgeous Med Spa",
    bookHref: bookPkg("prevent"),
    savingsUsd: 200,
    savingsLabel: "$200 off Morpheus8 Prevent",
    lines: [
      {
        name: "K-Glow peptide — 90 days",
        detail: "Our Glow peptide. Radiance and skin-wellness blend, prescribed after NP screening.",
        priceLabel: "Priced at consult",
        href: "/rx/request",
        lane: "inside",
      },
      {
        name: "Compounded anti-aging cream",
        detail: "Tretinoin / retinoid protocol — not the hydroquinone lightener. That’s Repair.",
        priceLabel: "Priced at consult",
        href: "/rx?goal=hair-skin",
        lane: "inside",
      },
      {
        name: "Xeomin — prevent lines",
        detail: "Double-purified neuromodulator. Units mapped at the visit — not a set package dose.",
        priceLabel: `$${XEOMIN_UNIT_PRICE_USD}/unit`,
        href: "/xeomin-oswego",
        lane: "outside",
      },
      {
        name: "Morpheus8 Burst ×1",
        detail: "One collagen-remodeling session. Lose already includes two — Prevent stays at one.",
        priceLabel: `From $${FALL_MAKEOVER_MORPHEUS_FROM_USD}`,
        href: "/services/morpheus8",
        lane: "outside",
      },
      {
        name: "HydraFacial Glow ×2",
        detail: "Monthly glow through fall — HydraFacial + dermaplaning + O₂ + 2 add-ons.",
        priceLabel: `${HYDRAFACIAL_GLOW_SPECIAL.price} each`,
        href: "/hydrafacial-oswego-il#special",
        lane: "outside",
      },
    ],
  },
  {
    id: "lose",
    number: "03",
    name: "Lose",
    concern: "Weight + tightening",
    tagline: "Drop the weight. Keep the skin in the conversation.",
    why: "GLP-1 changes the body. Morpheus8 keeps pace where skin is loosening. Monthly MIC + B12 and one Glow facial so the face doesn’t lag the scale.",
    image: "/images/marketing/fall-makeover/lose-v2.png",
    imageAlt: "Fall Makeover Lose — GLP-1 and tightening package at Hello Gorgeous Med Spa",
    bookHref: bookPkg("lose"),
    savingsUsd: 150,
    savingsLabel: "$150 off Lose",
    lines: [
      {
        name: "GLP-1 weight loss — 90 days",
        detail: "Compounded injectable program after NP clearance. Dose and molecule mapped at consult.",
        priceLabel: `From $${GLP1_PROGRAM.injectable.threeMonthFromUsd}`,
        href: "/weight-loss",
        lane: "inside",
      },
      {
        name: "MIC + B12 shots ×3",
        detail: "One metabolic / energy shot visit per month while you’re on the 90-day plan.",
        priceLabel: "Priced at consult",
        href: "/injection-menu",
        lane: "inside",
      },
      {
        name: "Morpheus8 ×2",
        detail: "Face, abdomen, or arms — wherever skin is changing. Area quoted before you start.",
        priceLabel: `From $${FALL_MAKEOVER_MORPHEUS_FROM_USD} / session`,
        href: "/services/morpheus8",
        lane: "outside",
      },
      {
        name: "HydraFacial Glow ×1",
        detail: "One facial so tone and glow keep up while the body is in motion.",
        priceLabel: HYDRAFACIAL_GLOW_SPECIAL.price,
        href: "/hydrafacial-oswego-il#special",
        lane: "outside",
      },
    ],
  },
];

/** Homepage launch row — cover, gift card, Repair, Prevent, Lose. */
export const HOME_FALL_SQUARES = [
  {
    src: FALL_MAKEOVER_CAMPAIGN.imagePath,
    alt: "Fall Makeover cover — Repair, Prevent, Lose",
    caption: "Cover",
    href: FALL_MAKEOVER_PATH,
  },
  {
    src: FALL_MAKEOVER_CAMPAIGN.giftCardImagePath,
    alt: "Complimentary $100 Fall Makeover gift card",
    caption: "$100 gift card",
    href: `${FALL_MAKEOVER_PATH}#gift-card`,
  },
  ...FALL_MAKEOVER_PACKAGES.map((pkg) => ({
    src: pkg.image,
    alt: pkg.imageAlt,
    caption: `${pkg.name} · $${pkg.savingsUsd} off`,
    href: `${FALL_MAKEOVER_PATH}#packages`,
  })),
] as const;

export const FALL_MAKEOVER_FAQS: { question: string; answer: string }[] = [
  {
    question: "Do I pick one package or mix them?",
    answer:
      "Most clients pick one lane — Repair, Prevent, or Lose — so the inside and outside work on the same goal. Ryan can stage a second lane later. We do not stack Repair’s hydroquinone lightener on top of Prevent’s retinoid without a written plan.",
  },
  {
    question: "Is everything included at a set package price?",
    answer:
      "No published bundle total. IPL, Solaria, GHK-Cu 90-day, Xeomin per unit, Morpheus8 from $799, HydraFacial Glow $129, and GLP-1 90-day from $825 are menu anchors. Creams, K-Glow, MIC/B12, and Morpheus8 area are locked at consult after candidacy and Rx clearance. Fall launch savings: $100 off Repair with a complimentary gift card, $200 off Prevent (Morpheus8), $150 off Lose — applied at consult when you book that lane.",
  },
  {
    question: "Do I need a consult before peptides, lightener, or GLP-1?",
    answer:
      "Yes. Compounded lightener, GHK-Cu, K-Glow, and GLP-1 are prescribed only after NP review. IPL, Solaria, and Morpheus8 also need skin typing and a downtime plan. Booking the Fall Makeover consult is the first step — not a checkout cart.",
  },
  {
    question: "What downtime should I plan for?",
    answer:
      "IPL and HydraFacial are typically same-week social. Xeomin is usually back-to-desk the same day. Morpheus8 is often 2–3 days of redness. Solaria CO₂ needs real downtime — we schedule it on your calendar, not the week of a wedding. Individual recovery varies.",
  },
  {
    question: "Will this fade my spots or take off a set number of pounds?",
    answer:
      "No. We do not promise a shade, a pound number, or a wrinkle count. These packages combine in-office treatments with prescription support when you qualify. Results vary. If you are not a candidate, we say so and map a different plan.",
  },
  {
    question: "Can I finance a Fall Makeover?",
    answer:
      "Yes. Cherry financing is available, including 6 months 0% interest for qualifying clients. Apply at consult or on our financing page — approval and terms depend on Cherry.",
  },
  {
    question: "What are the Fall Makeover savings?",
    answer:
      "Launch savings at consult: Repair includes a complimentary $100-off gift card. Prevent (the Morpheus8 anti-aging lane) is $200 off. Lose is $150 off. One lane per client. Savings apply after Ryan maps candidacy — not a checkout coupon.",
  },
];

export const FALL_MAKEOVER_FACEBOOK = `🍂 FALL MAKEOVER — inside + out
Hello Gorgeous Med Spa · downtown Oswego

Summer is on your skin. Fall is when we treat it from both sides.

Three packages. Pick your lane:

REPAIR — hyperpigmentation · $100 off + complimentary gift card
IPL photofacial ×3 · compounded medical-grade lightener · GHK-Cu 90-day + biotin · 1 Solaria CO₂

PREVENT — anti-aging · $200 off
K-Glow peptide 90 days · retinoid cream · Xeomin · Morpheus8 ×1 · HydraFacial Glow ×2

LOSE — weight + skin · $150 off
GLP-1 90 days · MIC + B12 monthly · Morpheus8 ×2 · 1 HydraFacial Glow

We screen you like a medical practice, because we are one.

Cherry financing available · 6 months 0% interest for qualifying clients.

Ryan Kent, FNP-BC maps every plan. Rx items need clearance. Individual results vary.

Book your Fall Makeover consult 👇`;

export const FALL_MAKEOVER_GBP = `🍂 Fall Makeover — inside + out
Hello Gorgeous Med Spa · Oswego IL

Three packages for fall:

• Repair — pigment · $100 off + complimentary gift card
• Prevent — anti-aging / Morpheus8 · $200 off
• Lose — GLP-1 + Morpheus8 ×2 · $150 off

We screen you like a medical practice, because we are one.
Cherry financing available · 6 months 0% interest for qualifying clients.

NP-directed. Consult first. Individual results vary.

74 W Washington St · (630) 636-6193
Tap Learn more to pick your lane`;

export const FALL_MAKEOVER_SQUARE = {
  campaignName: FALL_MAKEOVER_CAMPAIGN.name,
  subject: "{{first_name}}, your Fall Makeover — Repair, Prevent, or Lose",
  subjectAlt: "Inside + out this fall, {{first_name}}",
  previewText: "$100 off Repair · $200 off Prevent · $150 off Lose. Consult to lock your plan.",
  header: "FALL MAKEOVER",
  buttonLabel: "Pick your Fall Makeover",
  buttonUrl: `https://www.hellogorgeousmedspa.com${FALL_MAKEOVER_CAMPAIGN.bookPath}`,
  body: `Hi {{first_name}},

Fall is when we treat summer — from the inside and the outside.

Three packages at Hello Gorgeous. Pick one lane:

REPAIR (pigment) — $100 off + complimentary gift card
3 IPL photofacials · compounded medical-grade lightener · 90-day GHK-Cu with biotin · 1 Solaria CO₂

PREVENT (anti-aging / Morpheus8) — $200 off
90-day K-Glow · retinoid cream · Xeomin · 1 Morpheus8 · 2 HydraFacial Glow specials

LOSE (weight + skin) — $150 off
90-day GLP-1 · monthly MIC + B12 · Morpheus8 ×2 · 1 HydraFacial Glow

Ryan Kent, FNP-BC maps the plan. Prescription pieces need clearance. We do not quote a fake bundle total — menu prices are on the page, and your package locks at consult.

See the packages: https://www.hellogorgeousmedspa.com${FALL_MAKEOVER_PATH}?ref=fall_makeover_2026
Or call (630) 636-6193 · 74 W Washington St, Oswego

xo,
Danielle & the Hello Gorgeous team`,
  sms: `Hello Gorgeous: Fall Makeover — $100 off Repair · $200 off Prevent · $150 off Lose. Book: hellogorgeousmedspa.com/fall-makeover Reply STOP to opt out.`,
} as const;

export const FALL_MAKEOVER_WEBSITE_BLURB = {
  eyebrow: "FALL MAKEOVER",
  headline: "Treat it from the inside and the outside.",
  body: "Repair $100 off + gift card · Prevent $200 off · Lose $150 off. Consult to lock your plan.",
  cta: "See Fall Makeover packages ›",
} as const;
