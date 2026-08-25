import { ABOUT_DANI_IMAGE, DANI_FULL_NAME } from "@/lib/founder-credentials";
import { SQUARE_XEOMIN_BOOKING_URL } from "@/lib/flows";
import { HG_MEMBERSHIPS } from "@/lib/hg-memberships";
import { MEDICAL_DIRECTOR, PRESCRIBING_NP } from "@/lib/medical-authority";
import { NEUROTOXIN_AREA_CARDS } from "@/lib/neurotoxin-treatment-areas";
import type { FAQ } from "@/lib/seo";
import { SITE } from "@/lib/seo";

/** Canonical Xeomin introduction — also reached via `/xeomin` and `/xeomin-oswego-il`. */
export const XEOMIN_INTRO_PATH = "/xeomin-oswego";

export const XEOMIN_UNIT_PRICE_USD = 12;
export const XEOMIN_PRICE_LINE = `$${XEOMIN_UNIT_PRICE_USD}/unit`;

const glow = HG_MEMBERSHIPS.find((m) => m.id === "glow") ?? HG_MEMBERSHIPS[0];

export const XEOMIN_INTRO = {
  path: XEOMIN_INTRO_PATH,
  bookHref: SQUARE_XEOMIN_BOOKING_URL,
  xperienceUrl: "https://www.xperiencemerz.com/",
  manufacturerHowItWorksUrl: "https://www.xeominaesthetic.com/how-xeomin-works/",
  manufacturerRewardsUrl: "https://www.xeominaesthetic.com/rewards/",
  vialImage: "/images/injectables/brands/xeomin.webp",
  vialAlt: "Xeomin purified neurotoxin vial",
  heroImage: "/images/injectables/hero-glam-portrait.png",
  heroImageAlt: "Natural, glowing skin — Xeomin at Hello Gorgeous Med Spa in Oswego, IL",
  teamImage: "/images/team/dani-ryan-about-neon.png",
  metaTitle: "Xeomin in Oswego, IL — Double-Purified Neurotoxin",
  metaDescription:
    "Xeomin in Oswego — double-filtered with XTRACT Technology. FDA-approved for frown lines, forehead, and crow’s feet. $12/unit, NP-administered. Free consult.",
  keywords: [
    "Xeomin Oswego IL",
    "Xeomin near me",
    "XTRACT Technology",
    "naked neurotoxin Oswego",
    "Xeomin vs Botox Oswego",
    "incobotulinumtoxinA Oswego",
    "Xeomin crow’s feet forehead",
    "Xeomin $12/unit",
  ],
} as const;

export const XEOMIN_HOW_STEPS = [
  {
    title: "Dynamic wrinkles",
    body: "Upper-face lines show up when you smile, frown, or squint — that’s muscle movement under the skin, not “old skin.”",
  },
  {
    title: "Muscles take a pause",
    body: "Xeomin works beneath the surface to temporarily keep those targeted muscles from contracting.",
  },
  {
    title: "You still look like you",
    body: "Frown lines, forehead lines, and crow’s feet soften. The goal is a refreshed look — enhance it, don’t change it. Individual results vary.",
  },
] as const;

export const XEOMIN_PERKS = [
  {
    title: "XTRACT Technology™",
    body: "Xeomin is the first and only double-purified neuromodulator. Proprietary XTRACT filtering removes unnecessary complexing proteins, leaving the active 150 kDa toxin.",
  },
  {
    title: "Built for repeat treatments",
    body: "Leftover inactive proteins in some toxins can be seen as foreign over time, which may blunt results. Merz reports zero toxin resistance in its clinical studies. Ryan will still dose from your history.",
  },
  {
    title: "FDA-approved upper face",
    body: "Approved to temporarily improve moderate to severe frown lines, forehead lines, and crow’s feet — treated together or one area at a time.",
  },
  {
    title: "Room-temp vial before mixing",
    body: "Unreconstituted Xeomin does not need refrigeration. After mixing, we handle it per manufacturer and clinic protocol.",
  },
  {
    title: "Natural movement, not frozen",
    body: "Mapped, conservative dosing is designed to soften lines while you still look like you. Individual results vary.",
  },
  {
    title: "NP-administered, every visit",
    body: `${PRESCRIBING_NP.displayName} directs the consult and injects. Medical Director ${MEDICAL_DIRECTOR.displayName} oversees the protocol. Units are mapped at the visit — Xeomin doses are not interchangeable with other botulinum toxins.`,
  },
] as const;

export const XEOMIN_COMPARE_ROWS = [
  {
    label: "Formula",
    xeomin: "Double-purified with XTRACT Technology — complexing proteins removed",
    others: "Typically include accessory / complexing proteins",
  },
  {
    label: "Resistance",
    xeomin: "Merz reports zero toxin resistance in clinical studies",
    others: "Accessory proteins may trigger neutralizing antibodies over years",
  },
  {
    label: "FDA upper-face indication",
    xeomin: "Frown, forehead, and crow’s feet — together or separately",
    others: "Indications vary by brand; ask at consult",
  },
  {
    label: "Storage (unmixed)",
    xeomin: "No refrigeration needed before mixing",
    others: "Typically refrigerated",
  },
  {
    label: "Onset",
    xeomin: "Typically 3–7 days",
    others: "Typically 3–7 days",
  },
  {
    label: "Duration",
    xeomin: "About 3–4 months for most clients",
    others: "About 3–4 months for most clients",
  },
  {
    label: "Units",
    xeomin: "Mapped at your visit — not interchangeable with other toxins",
    others: "Each brand uses its own unit scale",
  },
] as const;

export const XEOMIN_PLANS = [
  {
    name: "Xeomin",
    detail: "FDA-approved frown lines, forehead, and crow’s feet — plus other areas Ryan maps at your visit.",
    price: XEOMIN_PRICE_LINE,
    note: "You approve units before we start.",
  },
  {
    name: `${glow.name} membership`,
    detail: `$${glow.botoxDiscount}/unit off every neurotoxin, including Xeomin — plus a monthly vitamin shot.`,
    price: `$${glow.pricePerMonth}/mo`,
    note: `Member Xeomin = $${XEOMIN_UNIT_PRICE_USD - glow.botoxDiscount}/unit.`,
    href: "/monthly-memberships",
  },
  {
    name: "Xperience+",
    detail: "Merz loyalty: $50 off a qualifying Xeomin treatment when you join, plus points toward up to $240 in annual Xeomin savings.",
    price: "$50 to join",
    note: "100 points per treatment. We’ll enroll you at the visit.",
    href: "https://www.xeominaesthetic.com/rewards/",
  },
] as const;

export const XEOMIN_TEAM = [
  {
    name: MEDICAL_DIRECTOR.displayName,
    role: MEDICAL_DIRECTOR.jobTitle,
    body: "Physician oversight for every injectable protocol at Hello Gorgeous.",
    image: MEDICAL_DIRECTOR.image,
    imageAlt: MEDICAL_DIRECTOR.imageAlt,
    href: MEDICAL_DIRECTOR.profilePath,
  },
  {
    name: DANI_FULL_NAME,
    role: "Owner & Founder",
    body: "On site every day — the standards, the products, and the experience are hers.",
    image: ABOUT_DANI_IMAGE,
    imageAlt: `${DANI_FULL_NAME}, Owner & Founder of Hello Gorgeous Med Spa`,
    href: "/about",
  },
  {
    name: PRESCRIBING_NP.displayName,
    role: "Nurse Practitioner · Injector",
    body: "Directs every Xeomin consult and administers your treatment.",
    image: PRESCRIBING_NP.image,
    imageAlt: PRESCRIBING_NP.imageAlt,
    href: PRESCRIBING_NP.profilePath,
  },
] as const;

export const XEOMIN_VISIT_STEPS = [
  {
    n: "01",
    title: "Free consult",
    body: "Ryan maps your face in motion, reviews toxin history, and quotes units before anything is injected.",
  },
  {
    n: "02",
    title: "10-minute treatment",
    body: "Fine-needle injections. Most people feel a brief pinch. Stay upright 4 hours; skip heavy workouts that day.",
  },
  {
    n: "03",
    title: "Results + touch-up",
    body: "Softening typically builds over 3–7 days. Follow-up around day 7–14 when a touch-up is appropriate.",
  },
] as const;

export const XEOMIN_AREAS = NEUROTOXIN_AREA_CARDS;

export const XEOMIN_INTRO_FAQS: FAQ[] = [
  {
    question: "How does Xeomin work?",
    answer:
      "Xeomin works beneath the skin to temporarily relax the muscles that cause dynamic wrinkles — the lines that appear when you smile, frown, or squint. When those muscles rest, frown lines, forehead lines, and crow’s feet look smoother, while your expressions stay yours. Individual results vary.",
  },
  {
    question: "What is XTRACT Technology?",
    answer:
      "XTRACT Technology is Merz’s double-filtration process. It removes unnecessary complexing proteins so Xeomin contains the active neurotoxin molecule. Merz positions Xeomin as the first and only double-purified neuromodulator and reports zero toxin resistance in its clinical studies.",
  },
  {
    question: "What is Xeomin FDA-approved for?",
    answer:
      "Xeomin is FDA-approved to temporarily improve the look of moderate to severe upper facial lines in adults: frown lines (glabella), forehead lines, and crow’s feet (lateral canthal lines) — treated simultaneously or individually. At Hello Gorgeous, Ryan Kent, FNP-BC may also map other expression lines when it is clinically appropriate.",
  },
  {
    question: "How is Xeomin different from Botox?",
    answer:
      "Both temporarily relax targeted facial muscles. Xeomin is double-purified with XTRACT Technology so accessory complexing proteins are removed. Xeomin units are not interchangeable with other botulinum toxins — Ryan maps your dose at the visit. We’ll help you choose based on goals, history, and how your muscles respond.",
  },
  {
    question: "How much does Xeomin cost in Oswego?",
    answer: `$${XEOMIN_UNIT_PRICE_USD} per unit. Ryan maps the number of units to your face at the visit, and you approve the total before we inject. Glow members save $1/unit. Xperience+ members can save $50 on a qualifying Xeomin treatment when they join, earn 100 points per treatment, and unlock up to $240 in annual Xeomin savings (Merz terms apply).`,
  },
  {
    question: "Does it hurt, and how long does it last?",
    answer:
      "Most clients feel only a tiny pinch. Treatment takes about 10 minutes. Results typically last 3–4 months; individual duration varies. Retreatment is generally no sooner than every three months.",
  },
  {
    question: "Will I look frozen?",
    answer:
      "The manufacturer designed Xeomin to enhance your look, not change it. We use conservative dosing to preserve natural movement and offer a touch-up window when clinically appropriate. Individual results vary.",
  },
  {
    question: "Can I switch from Botox to Xeomin?",
    answer:
      "Yes. Tell Ryan exactly which toxin you had and when. We usually wait until prior toxin has worn off so we can assess baseline muscle activity. Doses are not interchangeable between brands.",
  },
  {
    question: "How does Xperience+ work at Hello Gorgeous?",
    answer:
      "Xperience+ is Merz’s loyalty program. Join for free, then save $50 on a qualifying Xeomin treatment, earn 100 points per treatment (every 100 points = $10 off), and unlock up to $240 in annual Xeomin savings. Create your account at XperienceMerz.com before your visit — or we’ll help you at the desk. After treatment we look you up by phone or email and apply eligible savings. Instant $50 savings and points can be awarded once every 90 days and are at the provider’s discretion. Points expire 12 months from the date earned.",
  },
  {
    question: "Is there a consultation fee?",
    answer: "No — Xeomin consultations with our nurse practitioner are free.",
  },
  {
    question: "Who injects Xeomin at Hello Gorgeous?",
    answer: `${PRESCRIBING_NP.displayName} administers Xeomin under Medical Director ${MEDICAL_DIRECTOR.displayName}. We are at ${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}. Call ${SITE.phone}.`,
  },
];

export const XEOMIN_REWARDS_PERKS = [
  {
    title: "$50 just for joining",
    body: "Save $50 on your next qualifying Xeomin treatment when you enroll in Xperience+.",
  },
  {
    title: "Up to $240 a year",
    body: "Keep your routine going — Merz members can unlock up to $240 in annual Xeomin savings.",
  },
  {
    title: "100 points per treatment",
    body: "Every 100 points = $10 off. Redeem on future visits or other Merz Aesthetics products and treatments.",
  },
] as const;

export const XEOMIN_NAV = [
  { href: "#what", label: "What it is" },
  { href: "#how", label: "How it works" },
  { href: "#compare", label: "Compare" },
  { href: "#areas", label: "Areas" },
  { href: "#pricing", label: "Pricing" },
  { href: "#team", label: "Team" },
  { href: "#rewards", label: "Xperience+" },
  { href: "#faq", label: "FAQ" },
] as const;

/** Condensed consumer ISI — full PI and Medication Guide live on Merz’s site. */
export const XEOMIN_ISI = {
  uses:
    "XEOMIN® (incobotulinumtoxinA) is a prescription medicine injected into muscles to temporarily improve the look of moderate to severe upper facial lines (frown lines, forehead lines, and crow’s feet) in adults.",
  warning:
    "XEOMIN may cause serious side effects that can be life-threatening, including problems swallowing, speaking, or breathing, and spread of toxin effects hours to weeks after injection. Call your provider or get emergency help for those symptoms. Do not use Xeomin if you are allergic to it or another botulinum toxin, or if you have a skin infection at the planned injection site.",
  common: "The most common side effect in upper-facial treatment is injection-site bruising. Other effects can include headache, eyelid or brow drooping, and allergic reactions.",
  doses: "Doses of Xeomin are not the same as other botulinum toxins. Tell Ryan every toxin, medicine, and muscle or nerve condition in your history.",
} as const;
