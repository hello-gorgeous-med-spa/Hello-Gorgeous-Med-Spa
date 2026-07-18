/**
 * Morpheus8 Burst + Deep — flagship Journey marketing (InMode Trifecta).
 * Canonical route: /services/morpheus8 (peer to Brow Journey / microblading).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

export const MORPHEUS8_PATH = "/services/morpheus8" as const;

export const MORPHEUS8_CONTACT = {
  bookHref: PRIMARY_BOOKING_CTA.href,
  phoneTel: `tel:${SITE.phone.replace(/\D/g, "")}`,
  phoneDisplay: SITE.phone,
  textTel: "sms:6302016867",
  textDisplay: "(630) 201-6867",
  financingHref: "https://withcherry.com/apply",
} as const;

export const MORPHEUS8_MARKETING = {
  name: "Morpheus8",
  product: "Morpheus8 Burst + Deep",
  tagline: "Deepest RF microneedling — face & body",
  eyebrow: "InMode Verified Provider · Oswego, IL",
  headline: "Your Morpheus8 Journey",
  subhead:
    "The deepest RF microneedling on the market — Morpheus8 Burst + Deep tightens lax skin, smooths scars, and contours face & body under nurse practitioner oversight at Hello Gorgeous.",
  trustLine:
    "Only med spa in Oswego, Naperville, Aurora & Plainfield with Morpheus8 Burst + our full InMode Trifecta on site.",
  phoneDisplay: MORPHEUS8_CONTACT.phoneDisplay,
  phoneHref: MORPHEUS8_CONTACT.phoneTel,
  bookHref: MORPHEUS8_CONTACT.bookHref,
  textTel: MORPHEUS8_CONTACT.textTel,
  textDisplay: MORPHEUS8_CONTACT.textDisplay,
  careHref: "/pre-post-care/morpheus8-burst",
  burstHref: "/morpheus8-burst-oswego",
  bodyHref: "/morpheus8-body-oswego",
  compareSolariaHref: "/solaria-co2-oswego",
  quantumHref: "/quantum-rf-oswego",
  trifectaHref: "/specials",
  /** Clinic marketing hero — MBurst re-edit */
  heroVideo: "/videos/morpheus8/morpheus8-hero.mp4",
  /** Official InMode workstation animation */
  workstationVideo: "/videos/morpheus8/morpheus8-workstation.mp4",
  workstationPoster: "/images/morpheus8/morpheus8-workstation-poster.jpg",
  /** Official InMode Morpheus8 Body 3D animation */
  body3dVideo: "/videos/morpheus8/morpheus8-body-3d.mp4",
  body3dPoster: "/images/morpheus8/morpheus8-body-3d-poster.jpg",
  scienceVideo: "/videos/morpheus8/animated-science-visuals-morpheus8.mp4",
  introVideo: "/videos/morpheus8-clinical-highlight.mp4",
  treatmentVideo: "/videos/morpheus8/morpheus8-burst-deep-treatment-oswego.mp4",
  images: {
    hero: "/images/morpheus8/morpheus8-hero.jpg",
    verified: "/images/home/morpheus8-burst-verified-provider-inmode.png",
    bodyTech: "/images/home/morpheus8-body-burst-technology-inmode.png",
    founder: "/images/team/dani-ryan-founders-portrait.png",
    faceTreats: "/images/morpheus8/education/morpheus8-face-treats.jpg",
    bodyBenefits: "/images/morpheus8/education/morpheus8-body-benefits.jpg",
    neckBa: "/images/morpheus8/morpheus8-burst-deep-neck-tightening-before-after.png",
    kneeBa: "/images/morpheus8/morpheus8-burst-deep-knee-crepey-skin-before-after.png",
    jowlsBa: "/images/morpheus8/morpheus8-burst-deep-jowls-profile-before-after.png",
    armsBa: "/images/morpheus8/morpheus8-burst-deep-bat-wing-arms-before-after.png",
    abdomenBa: "/images/morpheus8/morpheus8-burst-deep-abdomen-skin-tightening-before-after.png",
  },
} as const;

export const MORPHEUS8_INTRO_SPECIAL = {
  badge: "From $799 / session",
  title: "Morpheus8 Burst — face & body",
  priceLabel: "$799+",
  priceNote: "starts at $799 · packages available · free consult",
  description:
    "Series of 3 typical · collagen rebuilds 3–6 months · customizable depth for laxity, scars & texture.",
  ctaLabel: "Book free consult",
  href: MORPHEUS8_PATH,
} as const;

export const MORPHEUS8_NAV = [
  { href: "#inmode", label: "InMode" },
  { href: "#why", label: "Why Morpheus8" },
  { href: "#treats", label: "Treats" },
  { href: "#results", label: "Results" },
  { href: "#areas", label: "Areas" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export const MORPHEUS8_FACE_TREATS = [
  "Dull texture",
  "Fine lines",
  "Acne scars",
  "Collagen loss",
] as const;

export const MORPHEUS8_BODY_BENEFITS = [
  "Improve skin appearance",
  "Remodel fat",
  "Treat skin irregularities",
  "Build collagen",
] as const;

export const MORPHEUS8_INMODE_STORY = {
  eyebrow: "Why InMode Matters",
  title: "InMode is the gold standard",
  titleAccent: "for RF remodeling",
  body: [
    "InMode builds the devices elite med spas trust worldwide — Morpheus8, Solaria CO₂, and Quantum RF. Hello Gorgeous is a verified InMode provider with the full Trifecta on site in Oswego.",
    "That means you get Burst + Deep technology (up to 8mm), official training certifications, and NP-directed protocols — not a watered-down copycat platform.",
  ],
  quote:
    "We invested in the real InMode stack because your skin deserves the deepest, most proven remodel — not a compromise.",
  chips: ["Verified InMode provider", "Burst + Deep to 8mm", "Face + body probes", "NP on site"],
} as const;

export const MORPHEUS8_FOUNDER_NOTE = {
  eyebrow: "A Note From Our Founders",
  title: "Why we brought Morpheus8 Burst home",
  paragraphs: [
    "When we set out to offer skin tightening that actually moves the needle, we didn’t want another surface treatment — we wanted the platform InMode is known for worldwide.",
    "Morpheus8 Burst + Deep, Solaria CO₂, and Quantum RF live together at Hello Gorgeous so we can be honest about what you need: depth, surface, or contour — or the full Trifecta when you’re ready for a complete rebuild.",
    "Ryan leads medical direction as our full-authority NP. Danielle owns the client experience and InMode training journey. Together we treat you like family — with clinical standards to match.",
  ],
  signOff: "xoxo, Danielle & Ryan",
  role: "Founders · Hello Gorgeous Med Spa",
} as const;

export const MORPHEUS8_WHAT_IT_DOES = [
  {
    id: "depth",
    title: "Deepest RF reach",
    body: "Up to 8mm — reaches tissue standard microneedling cannot for true subdermal remodeling.",
    stat: "8mm",
    statLabel: "max depth",
  },
  {
    id: "burst",
    title: "Burst technology",
    body: "Multi-depth RF in one pulse — comprehensive tightening with less downtime than older platforms.",
    stat: "Burst",
    statLabel: "multi-depth",
  },
  {
    id: "collagen",
    title: "Collagen rebuild",
    body: "Heat + micro-injury triggers new collagen & elastin — results keep improving for months.",
    stat: "3–6",
    statLabel: "mo. peak",
  },
  {
    id: "face-body",
    title: "Face + body",
    body: "Neck, jowls, abdomen, arms, thighs — one platform for laxity, scars & texture.",
    stat: "360°",
    statLabel: "treatment",
  },
] as const;

export const MORPHEUS8_STEPS = [
  {
    step: "1",
    title: "Free consult",
    body: "We assess laxity, scars, or body goals — honestly tell you if Morpheus8, Solaria, or Trifecta fits best.",
  },
  {
    step: "2",
    title: "Numbing & prep",
    body: "Medical-grade topical numbing 45–60 minutes for comfort before treatment.",
  },
  {
    step: "3",
    title: "Burst + Deep session",
    body: "Custom depth & probe for your area — face 30–45 min, body areas may run longer.",
  },
  {
    step: "4",
    title: "Heal & rebuild",
    body: "2–5 days social downtime · written aftercare · collagen continues building for months.",
  },
] as const;

export const MORPHEUS8_TREATMENT_AREAS = [
  "Face & neck",
  "Jowls & jawline",
  "Under-eyes",
  "Abdomen",
  "Arms (bat wings)",
  "Thighs & knees",
  "Acne scars",
  "Stretch marks",
] as const;

export const MORPHEUS8_PACKAGES = [
  {
    id: "face",
    name: "Face session",
    price: "From $799",
    detail: "per session",
    bullets: ["Custom depth mapping", "Burst + Deep RF", "NP oversight"],
    highlight: false,
  },
  {
    id: "face-neck",
    name: "Face + neck",
    price: "Consult",
    detail: "quoted at visit",
    bullets: ["Comprehensive tightening", "Ideal for jowls & neck laxity", "Package savings"],
    highlight: true,
  },
  {
    id: "body",
    name: "Body area",
    price: "Consult",
    detail: "abdomen · arms · thighs",
    bullets: ["Larger probe efficiency", "Skin tightening + contouring", "Series of 3 typical"],
    highlight: false,
  },
  {
    id: "trifecta",
    name: "VIP Trifecta",
    price: "Specials →",
    detail: "Morpheus8 + Solaria + Quantum",
    bullets: ["Complete InMode overhaul", "Exclusive bundle pricing", "Priority booking"],
    highlight: false,
    href: "/specials",
  },
] as const;

const BA = "/images/morpheus8/inmode-ba";

export type Morpheus8Result = {
  src: string;
  alt: string;
  label: string;
  area: "face" | "body";
  source: "clinic" | "inmode";
};

/** Clinic cases first, then curated InMode Burst BA pack. */
export const MORPHEUS8_RESULTS: Morpheus8Result[] = [
  {
    src: MORPHEUS8_MARKETING.images.neckBa,
    alt: "Morpheus8 Burst neck tightening before and after — Hello Gorgeous Med Spa Oswego IL",
    label: "Neck · Hello Gorgeous",
    area: "face",
    source: "clinic",
  },
  {
    src: MORPHEUS8_MARKETING.images.jowlsBa,
    alt: "Morpheus8 jowls and jawline before and after — Hello Gorgeous",
    label: "Jowls · Hello Gorgeous",
    area: "face",
    source: "clinic",
  },
  {
    src: MORPHEUS8_MARKETING.images.armsBa,
    alt: "Morpheus8 bat wing arms skin tightening before and after",
    label: "Arms · Hello Gorgeous",
    area: "body",
    source: "clinic",
  },
  {
    src: MORPHEUS8_MARKETING.images.abdomenBa,
    alt: "Morpheus8 abdomen skin tightening before and after",
    label: "Abdomen · Hello Gorgeous",
    area: "body",
    source: "clinic",
  },
  {
    src: MORPHEUS8_MARKETING.images.kneeBa,
    alt: "Morpheus8 knee and elbow crepey skin before and after",
    label: "Knees · Hello Gorgeous",
    area: "body",
    source: "clinic",
  },
  {
    src: `${BA}/face-3months.jpg`,
    alt: "Morpheus8 before and after at 3 months — InMode clinical result",
    label: "Face · 3 months",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/neck-inmode.jpg`,
    alt: "Morpheus8 neck before and after — InMode clinical result",
    label: "Neck",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/jawline-1.jpg`,
    alt: "Morpheus8 jawline before and after — InMode clinical result",
    label: "Jawline",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/acne-front.jpg`,
    alt: "Morpheus8 acne scar before and after — InMode clinical result",
    label: "Acne scars",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/face-neck-1.jpg`,
    alt: "Morpheus8 face and neck before and after — InMode clinical result",
    label: "Face + neck",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/submental.jpg`,
    alt: "Morpheus8 submental before and after — InMode clinical result",
    label: "Under-chin",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/esme-front.jpg`,
    alt: "Morpheus8 face before and after after 4 treatments",
    label: "Face · 4 treatments",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/abdomen-ak.jpg`,
    alt: "Morpheus8 abdomen before and after — InMode clinical result",
    label: "Abdomen",
    area: "body",
    source: "inmode",
  },
  {
    src: `${BA}/thighs.jpg`,
    alt: "Morpheus8 thighs before and after — InMode clinical result",
    label: "Thighs",
    area: "body",
    source: "inmode",
  },
  {
    src: `${BA}/cellulite-b.jpg`,
    alt: "Morpheus8 cellulite before and after — InMode clinical result",
    label: "Cellulite",
    area: "body",
    source: "inmode",
  },
  {
    src: `${BA}/body-front.jpg`,
    alt: "Morpheus8 body before and after front view — InMode clinical result",
    label: "Body contour",
    area: "body",
    source: "inmode",
  },
];

export const MORPHEUS8_FAQS = [
  {
    q: "What is Morpheus8 Burst?",
    a: "Morpheus8 Burst delivers RF energy at multiple tissue depths in a single pulse — up to 8mm — for comprehensive collagen remodeling. It's the upgraded InMode platform for dramatic skin tightening on face and body.",
  },
  {
    q: "How is Morpheus8 different from regular microneedling?",
    a: "Standard microneedling reaches 1–2mm without RF heat. Morpheus8 combines gold-coated needles with radiofrequency up to 8mm deep — dramatically more tightening, scar revision, and fat reduction.",
  },
  {
    q: "What is the downtime?",
    a: "Expect 2–5 days of redness and pinpoint marks. Most clients resume normal activities in 3–4 days. Body areas may take slightly longer. We send a full aftercare plan.",
  },
  {
    q: "How many treatments do I need?",
    a: "Most clients see optimal results with 3 sessions spaced 4–6 weeks apart. Results continue improving for 3–6 months as collagen rebuilds.",
  },
  {
    q: "Morpheus8 vs Solaria CO₂ — which do I need?",
    a: "Morpheus8 remodels deep tissue for laxity and scars beneath the surface. Solaria CO₂ resurfaces the skin for tone, sun damage, and surface lines. Many clients combine both in our InMode Trifecta for a complete transformation.",
  },
  {
    q: "How much does Morpheus8 cost?",
    a: "Morpheus8 treatments start at $799. Face + neck and body areas are quoted at your free consultation. Series packages reduce per-session cost — we'll map honest pricing with no upsell pressure.",
  },
] as const;

export const MORPHEUS8_NAV_ACTIVE_PREFIXES = [
  MORPHEUS8_PATH,
  "/morpheus8",
  "/pre-post-care/morpheus8",
  "/aftercare/morpheus8",
] as const;

export function isMorpheus8NavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return MORPHEUS8_NAV_ACTIVE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}-`),
  );
}

export const MORPHEUS8_SEO = {
  title: "Morpheus8 Burst + Deep | InMode RF Microneedling | Oswego IL",
  description:
    "Your Morpheus8 Journey at Hello Gorgeous Med Spa, Oswego IL — verified InMode provider. Burst + Deep RF microneedling to 8mm for skin tightening, scars & body. From $799. Free consult.",
  ogAlt: "Morpheus8 Burst RF microneedling — Hello Gorgeous Med Spa Oswego IL",
} as const;
