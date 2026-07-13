/**
 * Solaria CO₂ — flagship marketing content (InMode Trifecta).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

export const SOLARIA_CO2_PATH = "/services/solaria-co2" as const;

export const SOLARIA_MARKETING = {
  name: "Solaria CO₂",
  product: "InMode Solaria CO₂",
  tagline: "Fractional laser resurfacing",
  eyebrow: "InMode Trifecta · Exclusive in the western suburbs",
  headline: "Gold-standard skin resurfacing",
  subhead:
    "Solaria CO₂ fractional laser at Hello Gorgeous — dramatic improvement in wrinkles, acne scars, sun damage & texture with licensed providers and full medical oversight in Oswego.",
  trustLine:
    "The only Solaria CO₂ in the western Chicago suburbs — paired with Morpheus8 Burst & Quantum RF for the complete InMode Trifecta.",
  phoneDisplay: "(630) 636-6193",
  phoneHref: "tel:6306366193",
  bookHref: PRIMARY_BOOKING_CTA.href,
  careHref: "/pre-post-care/solaria-co2",
  compareMorpheusHref: "/services/morpheus8",
  trifectaHref: "/specials",
  images: {
    device: "/images/solaria/solaria-device.png",
    workstation: "/images/solaria/solaria-workstation.png",
    faceBa: "/images/solaria/solaria-co2-full-face-before-after.png",
    acneBa: "/images/solaria/solaria-co2-acne-scars-before-after.png",
    michelleBa: "/images/solaria/michelle-solaria-co2-one-treatment-facial-before-after.jpg",
    pigmentBa: "/images/solaria/solaria-co2-pigmentation-before-after-right.png",
  },
} as const;

export const SOLARIA_LAUNCH_SPECIAL = {
  badge: "$899 · BOGO area",
  title: "Full face Solaria CO₂",
  priceLabel: "$899",
  priceNote: "buy one get one free area · gold-standard fractional",
  description:
    "One powerful fractional resurfacing treatment — deep lines, acne scars, sun damage & tone. Free consult to confirm candidacy.",
  ctaLabel: "Claim launch pricing",
  href: SOLARIA_CO2_PATH,
} as const;

export const SOLARIA_NAV = [
  { href: "#why", label: "Why Solaria" },
  { href: "#results", label: "Results" },
  { href: "#treats", label: "What it treats" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export const SOLARIA_WHAT_IT_DOES = [
  {
    id: "resurface",
    title: "Deep resurfacing",
    body: "Fractional CO₂ creates controlled micro-zones — new skin emerges as damaged layers slough away.",
    stat: "CO₂",
    statLabel: "fractional",
  },
  {
    id: "collagen",
    title: "Collagen surge",
    body: "Heat triggers months of remodeling — skin keeps improving long after peeling finishes.",
    stat: "6 mo",
    statLabel: "peak rebuild",
  },
  {
    id: "one-treatment",
    title: "Dramatic in one",
    body: "Many clients see transformative results from a single session — we plan honestly at consult.",
    stat: "1×",
    statLabel: "often enough",
  },
  {
    id: "trifecta",
    title: "Trifecta partner",
    body: "Solaria resurfaces the surface; Morpheus8 remodels beneath — the complete InMode overhaul.",
    stat: "VIP",
    statLabel: "packages",
  },
] as const;

export const SOLARIA_STEPS = [
  {
    step: "1",
    title: "Free consult",
    body: "We review skin type, downtime tolerance, and goals — never recommend CO₂ if it's not the right tool.",
  },
  {
    step: "2",
    title: "Numbing",
    body: "Topical numbing 45–60 minutes for comfort throughout the treatment.",
  },
  {
    step: "3",
    title: "Fractional treatment",
    body: "20–45 minutes depending on area — face, neck, eyes, hands & more.",
  },
  {
    step: "4",
    title: "Peel & reveal",
    body: "5–7 days social downtime · post-care kit · day-14 check-in included.",
  },
] as const;

export const SOLARIA_TREATS = [
  "Deep wrinkles",
  "Acne scars",
  "Sun damage",
  "Age spots",
  "Uneven tone",
  "Enlarged pores",
  "Skin laxity (mild–moderate)",
  "Perioral lines",
] as const;

export const SOLARIA_PACKAGES = [
  {
    id: "launch",
    name: "Full face launch",
    price: "$899",
    detail: "limited time",
    bullets: ["Full face resurfacing", "Regularly $1,500+", "Free consult required"],
    highlight: true,
  },
  {
    id: "single",
    name: "Single session",
    price: "From $899",
    detail: "area dependent",
    bullets: ["Face, neck, eyes, hands", "Depth customized", "Honest candidacy screening"],
    highlight: false,
  },
  {
    id: "series",
    name: "Series (deep scars)",
    price: "Consult",
    detail: "2–3 sessions · 6–12 wks apart",
    bullets: ["Aggressive resurfacing plan", "Staged healing", "Package savings"],
    highlight: false,
  },
  {
    id: "trifecta",
    name: "VIP Trifecta",
    price: "Specials →",
    detail: "Solaria + Morpheus8 + Quantum",
    bullets: ["Complete transformation", "Exclusive bundle", "Priority booking"],
    highlight: false,
    href: "/specials",
  },
] as const;

export const SOLARIA_RESULTS = [
  {
    src: SOLARIA_MARKETING.images.faceBa,
    alt: "Solaria CO2 full face before and after — Hello Gorgeous Med Spa",
    label: "Full face",
  },
  {
    src: SOLARIA_MARKETING.images.acneBa,
    alt: "Solaria CO2 acne scars before and after",
    label: "Acne scars",
  },
  {
    src: SOLARIA_MARKETING.images.michelleBa,
    alt: "Solaria CO2 one treatment facial rejuvenation before and after",
    label: "One treatment",
  },
  {
    src: SOLARIA_MARKETING.images.pigmentBa,
    alt: "Solaria CO2 pigmentation before and after",
    label: "Pigmentation",
  },
] as const;

export const SOLARIA_FAQS = [
  {
    q: "What is Solaria CO₂?",
    a: "Solaria is InMode's advanced fractional ablative CO₂ laser — thousands of microscopic treatment columns stimulate deep collagen while leaving surrounding skin intact for faster healing than old full-field lasers.",
  },
  {
    q: "How long is downtime?",
    a: "Plan 5–7 days of social downtime. Skin will be red, swollen, then peel. Most clients take a week off work or events. Continued improvement over 3–6 months.",
  },
  {
    q: "How many treatments do I need?",
    a: "Many clients see dramatic results from one treatment. Deep scarring or significant sun damage may need 2–3 sessions spaced months apart — we'll plan at your free consult.",
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
    a: "Solaria CO₂ — the gold-standard fractional laser — is $899, with a buy-one-get-one-free area special. Exact areas and depth at your free consultation.",
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
  title: "Solaria CO₂ Laser Resurfacing | $899 + BOGO Area | Oswego IL",
  description:
    "InMode Solaria CO₂ fractional laser at Hello Gorgeous Med Spa, Oswego IL — wrinkles, acne scars & sun damage. Gold-standard resurfacing $899 with buy-one-get-one-free area. Free consult. Naperville, Aurora & Fox Valley.",
  ogAlt: "Solaria CO₂ laser skin resurfacing — Hello Gorgeous Med Spa Oswego IL",
} as const;
