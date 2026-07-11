/**
 * Morpheus8 Burst + Deep — flagship marketing content (InMode Trifecta).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

export const MORPHEUS8_PATH = "/services/morpheus8" as const;

export const MORPHEUS8_MARKETING = {
  name: "Morpheus8",
  product: "Morpheus8 Burst + Deep",
  tagline: "Deepest RF microneedling — face & body",
  eyebrow: "InMode Trifecta · Verified Provider",
  headline: "Remodel skin up to 8mm deep",
  subhead:
    "The newest Morpheus8 Burst at Hello Gorgeous — RF microneedling that tightens lax skin, smooths scars, and contours face & body with nurse practitioner oversight in Oswego.",
  trustLine:
    "Only med spa in Oswego, Naperville, Aurora & Plainfield with Morpheus8 Burst + our full InMode Trifecta on site.",
  phoneDisplay: "(630) 636-6193",
  phoneHref: "tel:6306366193",
  bookHref: PRIMARY_BOOKING_CTA.href,
  careHref: "/pre-post-care/morpheus8-burst",
  compareSolariaHref: "/services/solaria-co2",
  trifectaHref: "/specials",
  /** Animated Science Visuals (1) — journey hero */
  scienceVideo: "/videos/morpheus8/animated-science-visuals-morpheus8.mp4",
  introVideo: "/videos/morpheus8-clinical-highlight.mp4",
  images: {
    hero: "/images/morpheus8/morpheus8-hero.jpg",
    verified: "/images/home/morpheus8-burst-verified-provider-inmode.png",
    bodyTech: "/images/home/morpheus8-body-burst-technology-inmode.png",
    neckBa: "/images/morpheus8/morpheus8-burst-deep-neck-tightening-before-after.png",
    kneeBa: "/images/morpheus8/morpheus8-burst-deep-knee-crepey-skin-before-after.png",
    jowlsBa: "/images/morpheus8/morpheus8-burst-deep-jowls-profile-before-after.png",
    armsBa: "/images/morpheus8/morpheus8-burst-deep-bat-wing-arms-before-after.png",
    abdomenBa: "/images/morpheus8/morpheus8-burst-deep-abdomen-skin-tightening-before-after.png",
  },
} as const;

export const MORPHEUS8_INTRO_SPECIAL = {
  badge: "From $850 / session",
  title: "Morpheus8 Burst — face & body",
  priceLabel: "$850+",
  priceNote: "face · packages available · free consult",
  description:
    "Series of 3 typical · collagen rebuilds 3–6 months · customizable depth for laxity, scars & texture.",
  ctaLabel: "Book free consult",
  href: MORPHEUS8_PATH,
} as const;

export const MORPHEUS8_NAV = [
  { href: "#why", label: "Why Morpheus8" },
  { href: "#results", label: "Results" },
  { href: "#areas", label: "Areas" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

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
    price: "From $850",
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

export const MORPHEUS8_RESULTS = [
  {
    src: MORPHEUS8_MARKETING.images.neckBa,
    alt: "Morpheus8 Burst neck tightening before and after — Hello Gorgeous Med Spa Oswego IL",
    label: "Neck tightening",
  },
  {
    src: MORPHEUS8_MARKETING.images.kneeBa,
    alt: "Morpheus8 knee and elbow crepey skin before and after",
    label: "Knees & elbows",
  },
  {
    src: MORPHEUS8_MARKETING.images.jowlsBa,
    alt: "Morpheus8 jowls and jawline before and after",
    label: "Jowls & jawline",
  },
  {
    src: MORPHEUS8_MARKETING.images.armsBa,
    alt: "Morpheus8 bat wing arms skin tightening before and after",
    label: "Arms",
  },
  {
    src: MORPHEUS8_MARKETING.images.abdomenBa,
    alt: "Morpheus8 abdomen skin tightening before and after",
    label: "Abdomen",
  },
] as const;

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
    a: "Face sessions start from $850. Face + neck and body areas are quoted at your free consultation. Series packages reduce per-session cost — we'll map honest pricing with no upsell pressure.",
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
  title: "Morpheus8 Burst + Deep | RF Microneedling Face & Body | Oswego IL",
  description:
    "Morpheus8 Burst + Deep at Hello Gorgeous Med Spa, Oswego IL — newest InMode RF microneedling to 8mm for skin tightening, scars & body contouring. Real before/afters. Free consult.",
  ogAlt: "Morpheus8 Burst RF microneedling — Hello Gorgeous Med Spa Oswego IL",
} as const;
