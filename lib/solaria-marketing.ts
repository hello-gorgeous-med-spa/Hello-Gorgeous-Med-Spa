/**
 * Solaria CO₂ — flagship Journey marketing (InMode Trifecta).
 * Canonical route: /services/solaria-co2 (peer to Morpheus8 Journey).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

export const SOLARIA_CO2_PATH = "/services/solaria-co2" as const;

export const SOLARIA_CONTACT = {
  bookHref: PRIMARY_BOOKING_CTA.href,
  phoneTel: `tel:${SITE.phone.replace(/\D/g, "")}`,
  phoneDisplay: SITE.phone,
  textTel: "sms:6302016867",
  textDisplay: "(630) 201-6867",
  financingHref: "https://withcherry.com/apply",
} as const;

export const SOLARIA_MARKETING = {
  name: "Solaria CO₂",
  product: "InMode Solaria CO₂",
  tagline: "Gold-standard fractional laser resurfacing",
  eyebrow: "InMode Verified Provider · Oswego, IL",
  headline: "Your Solaria Journey",
  subhead:
    "Solaria by InMode is fractional ablative CO₂ resurfacing — the workhorse for fine lines, sun damage, acne scars, and texture — with nurse practitioner oversight at Hello Gorgeous.",
  trustLine:
    "The only Solaria CO₂ in the western Chicago suburbs — paired with Morpheus8 Burst & Quantum RF for the complete InMode Trifecta.",
  phoneDisplay: SOLARIA_CONTACT.phoneDisplay,
  phoneHref: SOLARIA_CONTACT.phoneTel,
  bookHref: SOLARIA_CONTACT.bookHref,
  textTel: SOLARIA_CONTACT.textTel,
  textDisplay: SOLARIA_CONTACT.textDisplay,
  careHref: "/pre-post-care/solaria-co2",
  landerHref: "/solaria-co2-oswego",
  compareMorpheusHref: "/services/morpheus8",
  quantumHref: "/quantum-rf-oswego",
  trifectaHref: "/specials",
  inmodeUrl: "https://www.inmodemd.com/workstation/solaria/",
  /** Clinic marketing hero — Solaria re-edit (speaker outro trimmed) */
  heroVideo: "/videos/solaria/solaria-hero.mp4",
  /** Official InMode treatments social (portrait) */
  treatmentsSocialVideo: "/videos/solaria/solaria-treatments-social.mp4",
  treatmentsSocialPoster: "/images/solaria/solaria-treatments-social-poster.jpg",
  clinicVideo: "/videos/solaria/solaria-co2-clinic-reedit-oswego.mp4",
  images: {
    hero: "/images/solaria/solaria-hero.jpg",
    device: "/images/solaria/solaria-inmode-machine.jpg",
    workstation: "/images/solaria/solaria-workstation.png",
    overview: "/images/solaria/solaria-inmode-manufacturer-overview.jpg",
    introducing: "/images/solaria/solaria-inmode-introducing-best-version.jpg",
    founder: "/images/team/dani-ryan-founders-portrait.png",
    clinicDanielle: "/images/solaria/danielle-solaria-inmode-clinic.png",
    edu1: "/images/solaria/education/solaria-educational-1.png",
    edu2: "/images/solaria/education/solaria-educational-2.png",
    edu3: "/images/solaria/education/solaria-educational-3.png",
    faceBa: "/images/solaria/solaria-co2-full-face-before-after.png",
    acneBa: "/images/solaria/solaria-co2-acne-scars-before-after.png",
    michelleBa: "/images/solaria/michelle-solaria-co2-one-treatment-facial-before-after.jpg",
    pigmentBa: "/images/solaria/solaria-co2-pigmentation-before-after-right.png",
    inmodeResults: "/images/solaria/solaria-inmode-before-after-results.jpg",
  },
} as const;

export const SOLARIA_LAUNCH_SPECIAL = {
  badge: "$899 · BOGO area",
  title: "Full face Solaria CO₂",
  priceLabel: "$899",
  priceNote: "buy one get one free area · regularly $1,500+",
  description:
    "One powerful fractional resurfacing treatment — deep lines, acne scars, sun damage & tone. Free consult to confirm candidacy and depth.",
  ctaLabel: "Claim launch pricing",
  href: SOLARIA_CO2_PATH,
} as const;

/** Alias used by homepage band */
export const SOLARIA_INTRO_SPECIAL = SOLARIA_LAUNCH_SPECIAL;

export const SOLARIA_NAV = [
  { href: "#inmode", label: "InMode" },
  { href: "#why", label: "Why Solaria" },
  { href: "#treats", label: "Treats" },
  { href: "#results", label: "Results" },
  { href: "#recovery", label: "Recovery" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export const SOLARIA_INMODE_STORY = {
  eyebrow: "Why InMode Solaria",
  title: "The gold standard in",
  titleAccent: "CO₂ resurfacing",
  body: [
    "Solaria by InMode is carbon dioxide fractional ablative resurfacing — all the trusted benefits of traditional CO₂ with the advantages of fractional healing: precise microbeams, faster recovery, and natural-looking results.",
    "RF-excited CO₂ microbeam technology delivers deep ablation while leaving surrounding tissue untreated — so you get dramatic resurfacing with reduced downtime across a wide range of skin tones when performed correctly.",
  ],
  quote:
    "We brought Solaria home because surface texture, sun damage, and scars deserve a true CO₂ workhorse — not a compromise laser.",
  chips: ["Fractional ablative CO₂", "Custom millijoules & patterns", "Face · neck · chest · hands", "NP-directed"],
} as const;

export const SOLARIA_FOUNDER_NOTE = {
  eyebrow: "A Note From Our Founders",
  title: "Why Solaria completes the Trifecta",
  paragraphs: [
    "Morpheus8 rebuilds beneath the skin. Quantum contours. Solaria resurfaces — wrinkles, pigment, acne scars, and texture that only a true CO₂ can rewrite.",
    "We invested in the full InMode stack so we can be honest: sometimes you need depth, sometimes surface, sometimes both. Solaria is the surface chapter of that story.",
    "Ryan leads medical direction. Danielle owns the client experience and InMode training. Together we plan your downtime and your reveal — like family, with clinical standards.",
  ],
  signOff: "xoxo, Danielle & Ryan",
  role: "Founders · Hello Gorgeous Med Spa",
} as const;

export const SOLARIA_WHAT_IT_DOES = [
  {
    id: "resurface",
    title: "Deep resurfacing",
    body: "Fractional CO₂ creates controlled micro-zones — new skin emerges as damaged layers renew.",
    stat: "CO₂",
    statLabel: "fractional",
  },
  {
    id: "healing",
    title: "Faster healing",
    body: "Treated columns with intact bridges mean deep ablation with quicker recovery than old full-field lasers.",
    stat: "5–7",
    statLabel: "day social DT",
  },
  {
    id: "collagen",
    title: "Collagen surge",
    body: "Heat triggers months of remodeling — skin keeps improving long after peeling finishes.",
    stat: "3–6",
    statLabel: "mo. peak",
  },
  {
    id: "custom",
    title: "Fully customized",
    body: "Exact millijoules, scan patterns, and ablation zones — light, moderate, or aggressive depth mapped to you.",
    stat: "360°",
    statLabel: "control",
  },
] as const;

export const SOLARIA_STEPS = [
  {
    step: "1",
    title: "Free consult",
    body: "We review skin type, downtime tolerance, and goals — never recommend CO₂ if it is not the right tool.",
  },
  {
    step: "2",
    title: "Numbing (30–60 min)",
    body: "Topical numbing typically 30–45 minutes. Deeper plans may add local comfort measures.",
  },
  {
    step: "3",
    title: "Fractional treatment",
    body: "Mild: ~30–45 min. Deeper coverage can run longer. Total clinic visit often 1.5–3 hours with prep & aftercare.",
  },
  {
    step: "4",
    title: "Peel & reveal",
    body: "Social downtime by depth · ointment & SPF plan · check-in as you heal · results build for months.",
  },
] as const;

export const SOLARIA_TREATS = [
  "Fine lines & wrinkles",
  "Acne scars",
  "Sun damage",
  "Age spots / pigment",
  "Uneven tone & texture",
  "Enlarged pores",
  "Perioral lines",
  "Mild–moderate laxity",
] as const;

export const SOLARIA_TREATMENT_AREAS = [
  "Full face",
  "Face + neck",
  "Eyes / periocular",
  "Perioral",
  "Décolleté / chest",
  "Hands",
  "Neck (add-on)",
  "Scar zones",
] as const;

export const SOLARIA_RECOVERY = [
  {
    level: "Light fractional",
    redness: "2–3 days",
    peeling: "3–5 days",
    healing: "7–10 days",
    makeup: "5–7 days",
  },
  {
    level: "Moderate fractional",
    redness: "3–5 days",
    peeling: "5–7 days",
    healing: "10–14 days",
    makeup: "7–10 days",
  },
  {
    level: "Deeper ablative",
    redness: "5–7 days",
    peeling: "7–14 days",
    healing: "2–3+ weeks",
    makeup: "2+ weeks",
  },
] as const;

export const SOLARIA_PACKAGES = [
  {
    id: "launch",
    name: "Full face launch",
    price: "$899",
    detail: "BOGO free area · limited time",
    bullets: ["Full face resurfacing", "Regularly $1,500+", "Free consult required"],
    highlight: true,
  },
  {
    id: "face-neck",
    name: "Face + neck",
    price: "Consult",
    detail: "quoted by depth",
    bullets: ["Comprehensive resurfacing", "Custom light → moderate plans", "Honest candidacy screen"],
    highlight: false,
  },
  {
    id: "addon",
    name: "Add-on area",
    price: "Consult",
    detail: "hands · chest · neck",
    bullets: ["Pair with full face", "BOGO special may apply", "Depth matched to area"],
    highlight: false,
  },
  {
    id: "trifecta",
    name: "VIP Trifecta",
    price: "Specials →",
    detail: "Solaria + Morpheus8 + Quantum",
    bullets: ["Complete InMode overhaul", "Exclusive bundle", "Priority booking"],
    highlight: false,
    href: "/specials",
  },
] as const;

/** Manufacturer-style depth guide (education) — HG quotes final price at consult. */
export const SOLARIA_DEPTH_GUIDE = [
  {
    area: "Full face",
    light: "Light depth · series available",
    moderate: "Moderate depth · series available",
    note: "Aggressive depth sold as single treatment when indicated",
  },
  {
    area: "Face + neck",
    light: "Light combined plan",
    moderate: "Moderate combined plan",
    note: "Mapped at consult for downtime & goals",
  },
  {
    area: "Add-ons",
    light: "Hands / chest / neck light",
    moderate: "Moderate add-on depth",
    note: "Often paired with full-face launch special",
  },
] as const;

const BA = "/images/solaria/inmode-ba";

export type SolariaResult = {
  src: string;
  alt: string;
  label: string;
  source: "clinic" | "inmode";
};

export const SOLARIA_RESULTS: SolariaResult[] = [
  {
    src: SOLARIA_MARKETING.images.michelleBa,
    alt: "Solaria CO2 one treatment facial rejuvenation before and after — Hello Gorgeous",
    label: "One treatment · Hello Gorgeous",
    source: "clinic",
  },
  {
    src: SOLARIA_MARKETING.images.faceBa,
    alt: "Solaria CO2 full face before and after — Hello Gorgeous Med Spa",
    label: "Full face · Hello Gorgeous",
    source: "clinic",
  },
  {
    src: SOLARIA_MARKETING.images.acneBa,
    alt: "Solaria CO2 acne scars before and after",
    label: "Acne scars · Hello Gorgeous",
    source: "clinic",
  },
  {
    src: SOLARIA_MARKETING.images.pigmentBa,
    alt: "Solaria CO2 pigmentation before and after",
    label: "Pigmentation · Hello Gorgeous",
    source: "clinic",
  },
  {
    src: `${BA}/face-ls.jpg`,
    alt: "Solaria face before and after left side — InMode clinical result",
    label: "Face profile",
    source: "inmode",
  },
  {
    src: `${BA}/face-rs.jpg`,
    alt: "Solaria face before and after right side — InMode clinical result",
    label: "Face profile",
    source: "inmode",
  },
  {
    src: `${BA}/face-ba0110.jpg`,
    alt: "Solaria before and after clinical result",
    label: "Resurfacing result",
    source: "inmode",
  },
  {
    src: `${BA}/face-front-zoom.jpg`,
    alt: "Solaria face front before and after — InMode clinical result",
    label: "Full face",
    source: "inmode",
  },
  {
    src: SOLARIA_MARKETING.images.inmodeResults,
    alt: "Solaria InMode before and after results collage",
    label: "InMode results",
    source: "inmode",
  },
];

export const SOLARIA_FAQS = [
  {
    q: "What is Solaria CO₂?",
    a: "Solaria is InMode's advanced fractional ablative CO₂ laser — thousands of microscopic treatment columns stimulate deep collagen while leaving surrounding skin intact for faster healing than old full-field lasers.",
  },
  {
    q: "How long is downtime?",
    a: "Light plans often need about a week of social downtime. Moderate runs longer. Skin is red, then peels. We map your calendar honestly at consult — see our recovery guide on this page.",
  },
  {
    q: "How many treatments do I need?",
    a: "Many clients see dramatic results from one treatment. Deep scarring or significant sun damage may need 2–3 sessions spaced months apart — we plan at your free consult.",
  },
  {
    q: "Does it hurt?",
    a: "We numb thoroughly beforehand. Most describe heat and mild prickling during treatment, then a sunburn sensation for a few days after.",
  },
  {
    q: "Solaria vs Morpheus8 — which is right for me?",
    a: "Solaria resurfaces the surface for tone, lines & sun damage. Morpheus8 remodels deeper tissue for laxity & scars. Together they're our most complete skin overhaul — ask about VIP Trifecta packages.",
  },
  {
    q: "How much does Solaria cost?",
    a: "Full-face Solaria launch pricing is $899 with a buy-one-get-one-free area special (regularly $1,500+). Face + neck, add-ons, and aggressive depths are quoted at your free consultation.",
  },
] as const;

export const SOLARIA_NAV_ACTIVE_PREFIXES = [
  SOLARIA_CO2_PATH,
  "/solaria",
  "/pre-post-care/solaria",
  "/aftercare/solaria",
] as const;

export function isSolariaNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return SOLARIA_NAV_ACTIVE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}-`),
  );
}

export const SOLARIA_SEO = {
  title: "Solaria CO₂ Laser Journey | $899 + BOGO Area | Oswego IL",
  description:
    "Your Solaria Journey at Hello Gorgeous Med Spa, Oswego IL — verified InMode CO₂ fractional laser for wrinkles, acne scars & sun damage. $899 launch with BOGO free area. Free consult.",
  ogAlt: "Solaria CO₂ laser skin resurfacing — Hello Gorgeous Med Spa Oswego IL",
} as const;
