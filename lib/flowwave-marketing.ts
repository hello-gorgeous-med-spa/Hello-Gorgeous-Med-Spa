/**
 * FlowWave FOCUS — public marketing content (shockwave therapy).
 * Clinical intake/screening lives in lib/flowwave-focus.ts.
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

export const FLOWWAVE_PATH = "/services/flowwave" as const;
export const FLOWWAVE_LEARN_PATH = "/services/flowwave/learn" as const;
export const FLOWWAVE_START_PATH = "/services/flowwave/start" as const;

/** Introductory first-session special (any area). */
export const FLOWWAVE_INTRO_PRICE = "$49";

export const FLOWWAVE_MARKETING = {
  name: "FlowWave",
  product: "FlowWave FOCUS",
  tagline: "Focused shockwave therapy",
  eyebrow: "New at Hello Gorgeous",
  headline: "Shockwave therapy for deep-tissue pain & recovery",
  subhead:
    "Focused acoustic-wave treatment for deep-tissue pain, faster recovery, and men's wellness — non-invasive, drug-free, and just 3–10 minutes per area.",
  trustLine:
    "Every session is directed by a full-authority nurse practitioner. We screen you like a medical practice, because we are one.",
  phoneDisplay: "(630) 636-6193",
  phoneHref: "tel:6306366193",
  bookHref: PRIMARY_BOOKING_CTA.href,
  /** Animated Science Visuals (3) — hero + science sections */
  scienceVideo: "/videos/flowwave/animated-science-visuals-flowwave.mp4",
  introVideo: "/videos/flowwave/flowwave-intro.mp4",
  images: {
    providerHero: "/images/flowwave/flowwave-provider-hero.png",
    recoveryBanner: "/images/flowwave/flowwave-recovery-banner.png",
    mensBanner: "/images/flowwave/flowwave-mens-banner.png",
    deviceBanner: "/images/flowwave/flowwave-device-banner.png",
    zonesBanner: "/images/flowwave/flowwave-zones-banner.png",
    devicePortrait: "/images/flowwave/flowwave-device-portrait.png",
  },
} as const;

/** Homepage + page intro special */
export const FLOWWAVE_INTRO_SPECIAL = {
  badge: "Intro special",
  title: "First session — any area",
  priceLabel: FLOWWAVE_INTRO_PRICE,
  priceNote: "per area · includes free NP screening",
  description:
    "Try focused shockwave on whatever is bothering you most — no commitment, fully screened by our NP.",
  ctaLabel: "Claim intro offer",
  href: FLOWWAVE_PATH,
} as const;

/** Four-column “what it does” grid */
export const FLOWWAVE_WHAT_IT_DOES = [
  {
    id: "deep",
    title: "Deep targeted relief",
    body: "Penetrates up to 12 cm to reach the root of the problem — not just the surface.",
    stat: "12 cm",
    statLabel: "depth",
  },
  {
    id: "fast",
    title: "Fast sessions",
    body: "Most treatments take only 3–10 minutes per area. Walk in, treat, walk out.",
    stat: "3–10",
    statLabel: "minutes",
  },
  {
    id: "cellular",
    title: "Cellular response",
    body: "Supports blood flow and your body’s own repair response in muscle, tendon, and joint tissue.",
    stat: "CRT",
    statLabel: "technology",
  },
  {
    id: "easy",
    title: "No downtime",
    body: "Non-invasive, drug-free, and needle-free. Resume your day right after treatment.",
    stat: "0",
    statLabel: "downtime",
  },
] as const;

export const FLOWWAVE_PACKAGES = [
  {
    id: "single",
    name: "Single session",
    price: "$175",
    detail: "per area",
    bullets: ["One focused session", "Any single area", "NP-directed care"],
    highlight: false,
  },
  {
    id: "six",
    name: "6-Session",
    price: "$870",
    detail: "$145 / session · save 17%",
    bullets: ["6 focused sessions", "Mix & match areas", "Save $180 vs. single"],
    highlight: false,
  },
  {
    id: "twelve",
    name: "12-Session",
    price: "$1,500",
    detail: "$125 / session · save 29%",
    bullets: ["12 focused sessions", "Priority booking", "Save $600 vs. single"],
    highlight: true,
  },
  {
    id: "twentyfour",
    name: "24-Session",
    price: "$2,376",
    detail: "as low as $99 / session · save 43%",
    bullets: ["24 focused sessions", "Whole-body coverage", "Lowest per-session rate"],
    highlight: false,
  },
] as const;

export const FLOWWAVE_MENS_PACKAGES = [
  {
    id: "mens-6",
    name: "6-Session Program",
    price: "$1,800",
    detail: "$300 / session",
    bullets: ["Private, provider-directed", "Discreet men’s wellness track", "Full confidentiality"],
  },
  {
    id: "mens-12",
    name: "12-Session Program",
    price: "$3,000",
    detail: "$250 / session · best value",
    bullets: ["Private, provider-directed", "Extended course", "Full confidentiality"],
  },
] as const;

export const FLOWWAVE_TREATS = [
  "Knees",
  "Shoulders",
  "Elbows",
  "Hips",
  "Low back",
  "Feet & ankles",
  "Hands & wrists",
  "Men’s wellness",
] as const;

export const FLOWWAVE_STEPS = [
  {
    step: "1",
    title: "Free consult",
    body: "Your NP reviews your history and screens you for candidacy — no cost, no pressure.",
  },
  {
    step: "2",
    title: "Target the area",
    body: "We map the treatment zone and set the device to your comfort level.",
  },
  {
    step: "3",
    title: "3–10 min session",
    body: "Focused waves are delivered directly to the tissue. Most clients find it very tolerable.",
  },
  {
    step: "4",
    title: "Back to your day",
    body: "No downtime — walk out and carry on. Courses are typically spaced weekly.",
  },
] as const;

export const FLOWWAVE_FAQS = [
  {
    q: "Does shockwave therapy hurt?",
    a: "Most clients describe it as a firm tapping sensation that's very tolerable. Your provider adjusts intensity to your comfort throughout the session.",
  },
  {
    q: "How many sessions will I need?",
    a: "It depends on the area and your goals. Many clients follow a short weekly course; your nurse practitioner will map out a plan at your free consultation.",
  },
  {
    q: "Is there any downtime?",
    a: "No. Sessions run about 3–10 minutes per area and you can return to your normal day right afterward.",
  },
  {
    q: "Am I a candidate?",
    a: "We screen every client first. Certain conditions — such as pregnancy, pacemakers, or metal implants in the treatment area — mean shockwave isn't appropriate. That's exactly what your free medical screening is for.",
  },
  {
    q: "Is the men's treatment confidential?",
    a: "Absolutely. Men's wellness treatments are provider-directed, private, and handled with full discretion.",
  },
] as const;
