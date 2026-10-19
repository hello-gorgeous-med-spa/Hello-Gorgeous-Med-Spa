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

/** Owner flyer — Golden Ticket Night event. */
export const GOLDEN_TICKET_EVENT = {
  title: "VIP Golden Ticket Night",
  limit: 20,
  dateLabel: "Friday, October 23, 2026",
  timeLabel: "4–10 p.m.",
  addressShort: "74 W. Washington Street · Oswego, IL",
  textKeyword: "GOLDEN",
  expirationMonths: 12,
  inviteImage: "/images/marketing/golden-ticket-invitation.jpg",
} as const;

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
  ticketPriceUsd: number;
  advertisedValueUsd: number;
  founderPriceUsd?: number;
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
    ticketPriceUsd: 4999,
    advertisedValueUsd: 7500,
    founderPriceUsd: 4499,
    containsMedication: true,
    checkoutEnabled: false,
    ctaLabel: "Request Body package",
    inclusions: [
      { label: "10-Week Tirzepatide + Guided Consult" },
      {
        label: "Quantum RF Lipo by Dr. Arora (Face/Neck, Arms, or Abdomen)",
      },
      { label: "Morpheus8 Body Burst 8cm Deep / 8-Week Vitamins / 2 Visceral Fat Peptides" },
    ],
  },
  {
    id: "face",
    flyerName: "Mommy Makeover: Face, Neck & Under-Eye",
    shortName: "Face",
    ticketPriceUsd: 2799,
    advertisedValueUsd: 4580,
    containsMedication: false,
    checkoutEnabled: true,
    ctaLabel: "Purchase Face package",
    inclusions: [
      { label: "GHK-Cu Cream / Biotin Hair Skin Nails 10ml / Glutathione Glow" },
      { label: "3x Morpheus8 (1 Exosomes, 1 Tox, 1 PDRN) / 1x Solaria CO2" },
      { label: "40 Units Tox / 1/2 Syringe Filler" },
    ],
  },
  {
    id: "wellness",
    flyerName: "Mommy Makeover: Wellness",
    shortName: "Wellness",
    ticketPriceUsd: 1199,
    advertisedValueUsd: 1900,
    containsMedication: true,
    checkoutEnabled: false,
    ctaLabel: "Request Wellness package",
    inclusions: [
      { label: "10 Weeks Tirzepatide" },
      { label: "2 Peptide Vials (if appropriate) / 2 Wellness Vials" },
      { label: "2x IV NAD+ PLUS Lounge Sessions" },
    ],
  },
];

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
    a: "Not yet. Those collections include prescription-related items (tirzepatide and/or peptides). Request the package and book a consult. Checkout opens only after clinical review and Square’s acceptable-use approval for that exact sale. A request is not a prescription.",
  },
  {
    q: "Is the 40 units of neurotoxin extra, or included in a Morpheus8 add-on?",
    a: "The Face ticket lists both “three Morpheus8 sessions with listed add-ons” and “40 units of neurotoxin.” Until the owner confirms otherwise, the 40 units are a separate line on the ticket—not assumed to be the same toxin that may appear as a Morpheus8 add-on.",
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

export function goldenTicketPackage(id: GoldenTicketPackageId): GoldenTicketPackage {
  const found = GOLDEN_TICKET_PACKAGES.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown Golden Ticket package: ${id}`);
  return found;
}

export const GOLDEN_TICKET_SEO = {
  title: "VIP Golden Ticket Night | Friday Oct 23, 4–10pm | Oswego IL",
  description:
    "VIP Golden Ticket Night Friday, October 23, 4–10 p.m. in Oswego. Event prices: Botox $7/unit, Solaria $450, Morpheus8 $399, filler $399, IV $79. Mommy Makeover tickets available. Consult required. Results vary.",
  ogAlt: "VIP Golden Ticket — Mommy Makeover Collection, Hello Gorgeous Med Spa Oswego",
} as const;
