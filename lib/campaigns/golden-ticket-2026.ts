/**
 * VIP Golden Ticket — Mommy Makeover Collection (HG-VIP-001 / HG-VIP-002).
 * Flyer inclusions and advertised values are published as the owner supplied them.
 * Medication-containing packages do not use Square checkout until clinical + Square
 * acceptable-use approval for that exact sale structure.
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

export const GOLDEN_TICKET_PATH = "/golden-ticket" as const;
export const GOLDEN_TICKET_CAMPAIGN = "golden_ticket_mommy_makeover_2026";
export const GOLDEN_TICKET_CRM_TAG = "GOLDEN_TICKET";

export const GOLDEN_TICKET_CONTACT = {
  phoneDisplay: SITE.phone,
  phoneTel: `tel:${SITE.phone.replace(/\D/g, "")}`,
  textDisplay: "630-881-3398",
  textSms: "sms:6308813398?&body=GOLDEN",
  bookHref: `${PRIMARY_BOOKING_CTA.href}?utm_source=website&utm_medium=golden_ticket&utm_campaign=${GOLDEN_TICKET_CAMPAIGN}`,
  squareServicesHref:
    "https://book.squareup.com/appointments/pf2o75yphk7vw6/location/L3QDRS4DX9ZE4/services",
  financingHref: "/financing",
  policyHref: "/package-policy",
} as const;

/** Owner flyer — cream VIP invitation, hours confirmed 5:00–8:00 PM. */
export const GOLDEN_TICKET_EVENT = {
  title: "VIP Golden Ticket Night",
  kicker: "A VIP invitation",
  intro:
    "Join us for an evening of celebration, beauty, and exclusive event pricing.",
  limit: 20,
  dateLabel: "Friday, October 23, 2026",
  timeLabel: "5:00 PM – 8:00 PM",
  timePendingConfirmation: false,
  addressShort: "74 W Washington St · Oswego, IL",
  addressLine: "74 W Washington St, Oswego, IL",
  textKeyword: "GOLDEN",
  expirationMonths: 12,
  collectionsTitle: "Three exclusive Mommy Makeover collections",
  collectionsSub: "Advanced aesthetics · Wellness · Physician-led care",
  reserveLabel: "Reserve with Danielle",
  flyerDisclaimer:
    "Event-night pricing. Limited availability. Treatments subject to clinical eligibility. Individual results vary.",
  inviteImage: "/images/marketing/golden-ticket-vip-invitation-oct2026.jpg",
} as const;

/** Hospitality perks on the approved VIP invitation — not treatment packages. */
export const GOLDEN_TICKET_VIP_INCLUDES = [
  "Each invited VIP may bring one friend",
  "Complimentary shockwave treatment for every guest",
  "VIPs & friends receive vendor goodie bags and raffle tickets for gift baskets",
  "Drinks & appetizers will be served",
] as const;

/**
 * Advertised collection values from the owner flyer are not independently
 * confirmed by published à la carte math (Face reconstructs ~$3,895–$4,445 vs
 * $4,580; Body $7,500 and Wellness $1,900 were flyer totals, not line-item sums).
 * Do not render crossed-out compare-at prices until those sums are confirmed.
 */
export const GOLDEN_TICKET_SHOW_COMPARE_AT_PRICE = false;

export const GOLDEN_TICKET_IMAGES = {
  invite: GOLDEN_TICKET_EVENT.inviteImage,
  flyer: "/images/marketing/golden-ticket-vip-invitation-oct2026.jpg",
  portrait: "/images/marketing/gt-hero-portrait.jpg",
  portraitAlt: "VIP Golden Ticket Night — Hello Gorgeous Med Spa, Oswego",
  body: "/images/marketing/gt-body-card.jpg",
  bodyAlt: "Body collection — Quantum RF and Morpheus8 Body Burst at Hello Gorgeous Med Spa",
  face: "/images/marketing/gt-face-card.jpg",
  faceAlt: "Face collection — Morpheus8, Solaria CO₂, and injectables at Hello Gorgeous Med Spa",
  wellness: "/images/marketing/gt-wellness-card.jpg",
  wellnessAlt: "Wellness collection — IV lounge care at Hello Gorgeous Med Spa",
} as const;

/** Collection intros from the approved Night flyer. */
export const GOLDEN_TICKET_WAYS = [
  {
    id: "body" as const,
    kicker: "Body",
    title: "Contour · Tighten · Rejuvenate",
    body: "Quantum RF Lipo with Dr. Mukesh Arora, MD, plus Morpheus8 Body Burst. Prescription items in this ticket are reviewed in consult first. A request is not a prescription. Individual results vary.",
    image: GOLDEN_TICKET_IMAGES.body,
    imageAlt: GOLDEN_TICKET_IMAGES.bodyAlt,
  },
  {
    id: "face" as const,
    kicker: "Face",
    title: "Smooth · Refine · Glow",
    body: "Three Morpheus8 sessions, Solaria CO₂, listed neurotoxin and filler, and the leave-with glow set. Depth and product are set at consult. Individual results vary. Consultation required.",
    image: GOLDEN_TICKET_IMAGES.face,
    imageAlt: GOLDEN_TICKET_IMAGES.faceAlt,
  },
  {
    id: "wellness" as const,
    kicker: "Wellness",
    title: "Recharge · Restore · Renew",
    body: "A 10-week program, peptides and wellness vials if appropriate, and two IV NAD+ lounge visits. Medication-containing items need clinical review. Individual results vary.",
    image: GOLDEN_TICKET_IMAGES.wellness,
    imageAlt: GOLDEN_TICKET_IMAGES.wellnessAlt,
  },
] as const;

/** Event-night à la carte — owner invitation 2026-10-18. */
export const GOLDEN_TICKET_ALACARTE = [
  { name: "Botox", price: "$7/unit" },
  { name: "Solaria CO₂", price: "$450" },
  { name: "Morpheus8", price: "$399" },
  { name: "Dermal Filler", price: "$399" },
  { name: "IV Therapy", price: "$79" },
  { name: "Vitamin Injection", price: "$15" },
  { name: "Microblading", price: "$399", note: "Includes 6-week touch-up" },
] as const;

/** Live Square catalog — Face package only (HG-VIP-002). */
export const GOLDEN_TICKET_FACE_SQUARE = {
  itemName: "VIP Golden Ticket — Mommy Makeover Face, Neck & Under-Eye",
  priceUsd: 2799,
  itemId: "2W6Y5M5KUXRNUPXCPLZ3AQ45",
  variationId: "VXDXS23OB2UHPO62VSQXZBVV",
  paymentLinkUrl:
    "https://checkout.square.site/merchant/MLK7PBDE336M4/order/7qiC7idh2r9Tcjn215ulrfrqocBZY",
} as const;

export type GoldenTicketPackageId = "body" | "face" | "wellness";

export type GoldenTicketInclusion = {
  label: string;
  note?: string;
};

export type GoldenTicketPackage = {
  id: GoldenTicketPackageId;
  flyerName: string;
  shortName: string;
  cardTitle: string;
  tagline: string;
  ticketPriceUsd: number;
  advertisedValueUsd: number;
  founderPriceUsd?: number;
  /** First-five inventory must be verified before any founder-price checkout. */
  founderInventoryVerified?: boolean;
  containsMedication: boolean;
  checkoutEnabled: boolean;
  inclusions: GoldenTicketInclusion[];
  ctaLabel: string;
};

/**
 * Exact flyer packages. Advertised values are not recalculated on the page.
 * Reconstructed retail lives in GOLDEN_TICKET_VALUE_NOTES for staff review only.
 */
export const GOLDEN_TICKET_PACKAGES: GoldenTicketPackage[] = [
  {
    id: "body",
    flyerName: "Mommy Makeover: Body",
    shortName: "Body",
    cardTitle: "Body",
    tagline: "Contour · Tighten · Rejuvenate",
    ticketPriceUsd: 4999,
    advertisedValueUsd: 7500,
    founderPriceUsd: 4499,
    containsMedication: true,
    checkoutEnabled: false,
    founderInventoryVerified: false,
    ctaLabel: "Request Body package",
    inclusions: [
      { label: "Quantum RF Lipo by Dr. Mukesh Arora, MD" },
      { label: "Morpheus8 Body Burst 8cm" },
      { label: "10-week Tirz program" },
      { label: "Vitamin support" },
      { label: "2 peptides" },
    ],
  },
  {
    id: "face",
    flyerName: "Mommy Makeover: Face, Neck & Under-Eye",
    shortName: "Face",
    cardTitle: "Face, Neck & Under-Eye",
    tagline: "Smooth · Refine · Glow",
    ticketPriceUsd: 2799,
    advertisedValueUsd: 4580,
    containsMedication: false,
    checkoutEnabled: true,
    ctaLabel: "Purchase Face package",
    inclusions: [
      { label: "3 Morpheus8 sessions" },
      { label: "1 Solaria CO2 treatment" },
      { label: "40 units Tox" },
      { label: "1/2 syringe filler" },
      { label: "GHK-Cu" },
      { label: "Biotin" },
      { label: "Glutathione" },
    ],
  },
  {
    id: "wellness",
    flyerName: "Mommy Makeover: Wellness",
    shortName: "Wellness",
    cardTitle: "Wellness",
    tagline: "Recharge · Restore · Renew",
    ticketPriceUsd: 1199,
    advertisedValueUsd: 1900,
    containsMedication: true,
    checkoutEnabled: false,
    ctaLabel: "Request Wellness package",
    inclusions: [
      { label: "10-week Tirz" },
      { label: "2 peptides" },
      { label: "2 wellness vials" },
      { label: "2x IV NAD+" },
    ],
  },
];

export const GOLDEN_TICKET_TRUST = [
  { label: "Physician-led care", detail: "Dr. Mukesh Arora, MD · Medical Director" },
  { label: "Personalized treatment plans", detail: "Mapped in consult — not from a template" },
  { label: "Real results. Real people.", detail: "Individual results vary. Consultation required." },
] as const;

export const GOLDEN_TICKET_TERMS = {
  expirationMonths: 12,
  scheduleWindowMonths: 12,
  physician: "Dr. Mukesh Arora, MD — Medical Director",
  refunds: "Unused value follows the published package policy.",
  transfer: "Packages are for the purchasing patient unless the owner approves a written transfer.",
  substitutions:
    "Listed items are a promotional description of the intended collection. A licensed clinician confirms candidacy. Medications, peptides, and injectables are dispensed only when medically appropriate. Equivalent current-menu value may be substituted; a purchase is not a guaranteed prescription.",
} as const;

export const GOLDEN_TICKET_FAQS = [
  {
    q: "Can I buy the Body or Wellness Golden Ticket online?",
    a: "Request the collection online, then pay in person at 74 W Washington, Oswego after a licensed clinician reviews candidacy. Face tickets can be purchased online. A payment is not a prescription.",
  },
  {
    q: "Is the 40 units of neurotoxin extra, or included in a Morpheus8 add-on?",
    a: "The Face ticket lists three Morpheus8 sessions and, separately, 40 units of neurotoxin. The 40 units are their own line — not assumed to be the same toxin that may be used as a Morpheus8 add-on.",
  },
  {
    q: "How long do I have to redeem treatments?",
    a: "Treatments purchased at Golden Ticket Night are valid for one year from purchase. Event-night pricing. Limited appointments. Treatments are subject to clinical eligibility.",
  },
  {
    q: "Do advertised values change if à la carte prices change?",
    a: "No. The Golden Ticket price and the advertised collection value on the flyer are what we publish. Individual à la carte prices are reference only and can change.",
  },
  {
    q: "Who performs Quantum RF?",
    a: "Quantum RF in the Body collection is performed by Dr. Mukesh Arora, MD, Medical Director, when you are a candidate. Area — face/neck, arms, or abdomen — is confirmed at consult.",
  },
] as const;

/**
 * Internal COGS — owner 2026-10-18. Do not publish these numbers on the landing page.
 * Body ticket raised so abdomen Quantum ($2,740 COGS) can be included.
 */
export const GOLDEN_TICKET_QUANTUM_ABDOMEN_COGS_USD = {
  probe: 640,
  aestheticConsumables: 300,
  physicianArora: 1800,
  total: 640 + 300 + 1800, // $2,740
  bodyTicketUsd: 4999,
  leftoverAfterAbdomenUsd: 4999 - (640 + 300 + 1800), // $2,259 at $4,999 ticket
} as const;

/** Staff-only reconstruction — not shown as a revised flyer total. */
export const GOLDEN_TICKET_VALUE_NOTES = {
  body: [
    "Owner flyer 2026-10-18: Body Golden Ticket $4,999, Founder's 5 $4,499, advertised value $7,500. Abdomen Quantum COGS remains $2,740.",
    "À la carte Quantum abdomen remains $3,999; neck $2,499.",
    "Morpheus8 Body Burst from $799 / session (body quoted at consult).",
    "10-week tirzepatide: retired Square 10-week SKU was $600; current monthly fills are $299–$499 per 4 weeks (~2.5 months for 10 weeks).",
    "Tesamorelin (visceral-fat peptide) from $229/mo retail; formulation vial $320. Flyer does not name the SKU.",
    "Eight-week vitamin course has no published bundled SKU.",
    "Flyer advertised value $7,500 is published as-is from the owner Night flyer.",
  ],
  face: [
    "Morpheus8 Burst 3-session package $1,999 (Square item EX6WAEMAH5DKLNPQ6I46JQRO).",
    "Solaria CO₂ full face $899.",
    "40 units neurotoxin at $10/unit Botox = $400 (brand chosen at visit).",
    "Half-syringe filler $300.",
    "GHK-Cu topical $195 (leave-with menu).",
    "Biotin 10 mL high-concentration $57 (formulation catalog) — kiosk list $207; flyer does not specify which.",
    "Glutathione Glow vitamin shot $45.",
    "Sum of those published lines ≈ $3,895–$4,445 vs flyer $4,580. Gap is Morpheus8 add-ons (not itemized on the ticket) and/or the biotin list price. Flyer $4,580 is not changed.",
  ],
  wellness: [
    "10-week tirzepatide as above ($600 retired SKU or ~2.5 monthly fills).",
    "Peptide vials from $149–$229/mo depending on product; flyer does not name them.",
    "Wellness vials unpublished on the flyer.",
    "NAD+ PLUS IV: IV Hour $150 + NAD+ add-on $25 = $175 each if that is the named drip; NAD+ Boost is consult-priced. Flyer $1,900 is not changed.",
  ],
} as const;

export function goldenTicketInvoiceNotes(pkg: GoldenTicketPackage): string {
  return [
    GOLDEN_TICKET_EVENT.flyerDisclaimer,
    pkg.containsMedication
      ? "A payment is not a prescription. A licensed clinician confirms candidacy before any medication-related item is dispensed."
      : "Consult required. Individual results vary.",
    `${GOLDEN_TICKET_EVENT.title} — ${GOLDEN_TICKET_EVENT.dateLabel}, ${GOLDEN_TICKET_EVENT.timeLabel}, ${GOLDEN_TICKET_EVENT.addressLine}.`,
  ].join(" ");
}

export function goldenTicketPackage(id: GoldenTicketPackageId): GoldenTicketPackage {
  const found = GOLDEN_TICKET_PACKAGES.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown Golden Ticket package: ${id}`);
  return found;
}

export const GOLDEN_TICKET_SEO = {
  title: "VIP Golden Ticket Night | Friday Oct 23 | Oswego IL",
  description:
    "VIP Golden Ticket Night Friday, October 23, 2026, 5:00–8:00 p.m. at Hello Gorgeous Med Spa in Oswego. Three Mommy Makeover collections from $1,199. Consult required. Results vary.",
  ogAlt: "VIP Golden Ticket Night invitation — Hello Gorgeous Med Spa, Oswego, Illinois",
} as const;
