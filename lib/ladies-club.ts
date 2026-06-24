/**
 * The Ladies' Club — women's wellness hub (mirror of Gentlemen's Club).
 */

import type { FAQ } from "@/lib/seo";
import { SITE } from "@/lib/seo";
import { GLP1_RETAIL_PROGRAM, PEPTIDE_RETAIL_FROM_MONTHLY_USD } from "@/lib/peptide-retail-pricing";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";

export const LADIES_CLUB_PATH = "/ladies-club" as const;
export const LADIES_CLUB_URL = `${SITE.url}${LADIES_CLUB_PATH}`;

export const LADIES_CLUB_HERO_IMAGE = "/images/ladies-club/ladies-club-hero.png";
export const LADIES_CLUB_HERO_IMAGE_ALT =
  "The Ladies' Club — BHRT, weight loss, peptide therapy and wellness for women at Hello Gorgeous Med Spa Oswego IL";
export const LADIES_CLUB_WEIGHT_HORMONES_IMAGE = "/images/ladies-club/weight-loss-hormones-women.png";
export const LADIES_CLUB_PT141_IMAGE = "/images/ladies-club/pt-141.png";

export type ClubPeptideFlyer = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  bullets: string[];
  fromMonthlyUsd: number;
  image: string;
  imageAlt: string;
  learnMoreHref: string;
};

export const LADIES_CLUB_PT141_FLYER: ClubPeptideFlyer = {
  id: "pt-141",
  name: "PT-141",
  tagline: "Intimacy, arousal & libido support",
  description:
    "Bremelanotide (PT-141) supports desire and arousal through central pathways — not estrogen or testosterone. A common add-on for women on BioTE or GLP-1 when clinically appropriate.",
  bullets: ["Libido & arousal support", "Non-hormonal option", "Pairs with BioTE & GLP-1 plans"],
  fromMonthlyUsd: 209,
  image: LADIES_CLUB_PT141_IMAGE,
  imageAlt:
    "PT-141 peptide therapy for women's intimacy and libido — Hello Gorgeous Med Spa Oswego IL",
  learnMoreHref: "/peptides/pt-141",
};

export const LADIES_CLUB_PILLS = ["HORMONES", "GLP-1", "PEPTIDES", "IV", "SKIN", "MEMBERSHIP"] as const;

export const LADIES_CLUB_JUMP_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Hormones / BioTE", href: "#hormones" },
  { label: "GLP-1", href: "#glp1" },
  { label: "Peptides", href: "#peptides" },
  { label: "Screeners", href: "#screeners" },
  { label: "Membership", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export type LadiesClubService = {
  id: string;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
  external?: boolean;
  badge?: string;
  anchor?: boolean;
};

export const LADIES_CLUB_SERVICES: LadiesClubService[] = [
  {
    id: "hormones",
    icon: "🌸",
    eyebrow: "Women's Health",
    title: "BioTE & Hormone Optimization",
    description:
      "Bio-identical pellet therapy for perimenopause, menopause, and cycle-related symptoms — lab-guided dosing with Ryan Kent, FNP-BC.",
    bullets: [
      "BioTE® certified provider",
      "Pellet insertion $400–650 typical",
      "Baseline labs ~$250–450",
      "Hot flashes, sleep, mood & libido",
    ],
    href: "#hormones",
    cta: "Women's hormones →",
    badge: "RX",
    anchor: true,
    image: LADIES_CLUB_WEIGHT_HORMONES_IMAGE,
    imageAlt: "Weight loss and hormone optimization for women — Hello Gorgeous Med Spa Oswego IL",
  },
  {
    id: "glp1",
    icon: "⚡",
    eyebrow: "Weight Loss",
    title: "Medical Weight Loss (GLP-1)",
    description:
      "NP-supervised tirzepatide programs with monthly check-ins — medication and oversight included, not mail-order.",
    bullets: [
      `Tirzepatide from $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo`,
      "Same-day visits when available",
      "Baseline & monitoring labs",
      "Stack with BioTE when clinically appropriate",
    ],
    href: "#glp1",
    cta: "GLP-1 program →",
    badge: "RX",
    anchor: true,
    image: LADIES_CLUB_WEIGHT_HORMONES_IMAGE,
    imageAlt: "GLP-1 weight loss for women — Hello Gorgeous Med Spa Oswego IL",
  },
  {
    id: "peptides",
    icon: "💎",
    eyebrow: "Hello Gorgeous RX™",
    title: "Peptide Therapy",
    description:
      "Sermorelin, BPC-157, GHK-Cu, PT-141 & more — recovery, skin, metabolism, and intimacy support when prescribed.",
    bullets: [
      `Protocols from $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo`,
      `$${PEPTIDE_CONSULT_FEE_USD} consult · NP protocol review`,
      "Cold-chain pharmacy sourcing",
      "Pairs with hormone & GLP-1 plans",
    ],
    href: "/peptides",
    cta: "Peptide menu →",
    badge: "RX",
    image: LADIES_CLUB_PT141_IMAGE,
    imageAlt: "PT-141 peptide therapy for women — intimacy and libido support at Hello Gorgeous Med Spa Oswego IL",
  },
  {
    id: "iv",
    icon: "💧",
    eyebrow: "Wellness",
    title: "IV Therapy & Vitamin Bar",
    description:
      "NAD+, glutathione, beauty drips, and drive-thru vitamin shots — member pricing with Vitamin Bar plans from $49/mo.",
    bullets: [
      "IV drips from signature menu",
      "Vitamin Bar drive-thru shots",
      "Member pricing on add-ons",
      "Stack with hormone programs",
    ],
    href: "/iv-shots",
    cta: "IV & shots menu →",
    image: "/images/memberships/vip-wellness.png",
    imageAlt: "IV therapy and Vitamin Bar for women — Hello Gorgeous Med Spa Oswego IL",
  },
  {
    id: "skin",
    icon: "✨",
    eyebrow: "Aesthetics",
    title: "Skin & Injectables",
    description:
      "Botox, fillers, Morpheus8, HydraFacial & more — the same flagship results Hello Gorgeous is known for, with medical oversight.",
    bullets: [
      "Botox from $10/unit",
      "Morpheus8 & RF microneedling",
      "HydraFacial & advanced facials",
      "Membership savings on Glow/Luxe/Platinum",
    ],
    href: "/services",
    cta: "Explore aesthetics →",
    image: "/images/homepage-buyer-paths/injectables.png",
    imageAlt: "Med spa injectables and skin treatments — Hello Gorgeous Oswego IL",
  },
  {
    id: "membership",
    icon: "👑",
    eyebrow: "Membership",
    title: "Wellness Memberships",
    description:
      "Women's Hormone Member plan, Vitamin Bar shots, and Glow/Luxe/Platinum aesthetic tiers — month-to-month through Square.",
    bullets: [
      "Women's Hormone Member $99/mo",
      "Vitamin Bar from $49/mo",
      "Glow membership from $79/mo",
      "No long-term contracts",
    ],
    href: "#pricing",
    cta: "View plans →",
    badge: "NEW",
    anchor: true,
    image: "/images/memberships/glow-pass.png",
    imageAlt: "Hello Gorgeous women's wellness memberships — Oswego IL",
  },
];

export type LadiesClubSymptom = {
  title: string;
  description: string;
  icon: string;
};

export const LADIES_CLUB_HORMONE_SYMPTOMS: LadiesClubSymptom[] = [
  { icon: "🔥", title: "Hot flashes", description: "Sudden warmth, flushing, and night sweats" },
  { icon: "😴", title: "Sleep disruption", description: "Trouble falling asleep or staying asleep" },
  { icon: "🌫️", title: "Brain fog", description: "Memory lapses and difficulty concentrating" },
  { icon: "💫", title: "Low libido", description: "Decreased desire or discomfort with intimacy" },
  { icon: "😔", title: "Mood changes", description: "Irritability, anxiety, or feeling flat" },
  { icon: "⚖️", title: "Weight shifts", description: "Stubborn midsection weight despite diet & exercise" },
  { icon: "💪", title: "Fatigue", description: "Dragging through the day even after rest" },
  { icon: "🔄", title: "Cycle changes", description: "Irregular periods or perimenopause patterns" },
];

export const LADIES_CLUB_BIOTE_QUICK_FACTS = [
  { label: "Pellet insertion", value: "$400–650", note: "Typical women's BioTE visit" },
  { label: "Baseline labs", value: "$250–450", note: "Before any pellet therapy" },
  { label: "Duration", value: "3–5 mo", note: "Steady hormone release per pellet" },
  { label: "Provider", value: "FNP-BC", note: "Ryan Kent on site 7 days" },
] as const;

export const LADIES_CLUB_BIOTE_INCLUDED = {
  oversight: {
    title: "Clinical oversight",
    bullets: [
      "Ryan Kent, FNP-BC — BioTE certified",
      "Comprehensive baseline hormone panel",
      "Follow-up labs at 6–8 weeks, then quarterly",
      "Secure messaging between visits",
    ],
  },
  program: {
    title: "Program includes",
    bullets: [
      "Personalized pellet dosing — not one-size-fits-all",
      "Estrogen, progesterone & testosterone balance",
      "FullScript supplement integration",
      "HSA/FSA-compatible receipts on request",
      "Women's Hormone Member pricing available",
    ],
  },
} as const;

export const LADIES_CLUB_GLP1_STACK = {
  tirzepatideFrom: GLP1_RETAIL_PROGRAM.tirzepatideFromUsd,
  semaglutideFrom: GLP1_RETAIL_PROGRAM.semaglutideFromUsd,
};

export const LADIES_CLUB_MEMBERSHIP_TIERS = [
  {
    id: "womens-hormone-member",
    name: "Women's Hormone Member",
    pricePerMonth: 99,
    highlight: true,
    summary: "Member pricing on BioTE, priority labs, and quarterly NP check-ins.",
    perks: [
      "Member pricing on BioTE pellet insertion",
      "Priority booking for hormone consults",
      "Quarterly lab review with Ryan Kent, FNP-BC",
      "10% off IV therapy & vitamin shots",
      "FullScript supplement integration",
    ],
    footnote: "Pellet insertion & labs quoted separately at consult.",
  },
  {
    id: "glow-membership",
    name: "Glow Membership",
    pricePerMonth: 79,
    summary: "Monthly vitamin shot + $1/unit off all neurotoxins + HG Rewards.",
    perks: [
      "1 standard vitamin shot monthly",
      "$1/unit off Botox, Dysport, Jeuveau & more",
      "10% off retail products",
      "Priority booking",
    ],
    footnote: "See full Glow/Luxe/Platinum tiers on our memberships page.",
    href: "/memberships",
  },
] as const;

export const LADIES_CLUB_SCREENERS = [
  {
    id: "perimenopause",
    title: "Perimenopause Readiness",
    sub: "2 min · cycle pattern, symptoms & safety flags",
    href: "/quiz/perimenopause-readiness",
    badge: "NEW",
  },
  {
    id: "glp1",
    title: "GLP-1 Readiness Screener",
    sub: "2 min · medical weight loss candidacy",
    href: "/quiz/glp-1-readiness",
    badge: "NEW",
  },
  {
    id: "hair",
    title: "Hair Restoration Screener",
    sub: "2 min · thinning pattern & treatment options",
    href: "/quiz/hair-readiness",
  },
] as const;

export const LADIES_CLUB_PILLARS = [
  {
    title: "Judgment-free women's care",
    description:
      "Hormones, weight loss, peptides, and aesthetics in one NP-led home — no dismissive \"it's just aging\" answers.",
  },
  {
    title: "BioTE certified provider",
    description:
      "Lab-guided bioidentical hormone therapy with personalized pellet dosing and ongoing monitoring.",
  },
  {
    title: "Science-backed protocols",
    description: "Blood work, evidence-based treatments, and transparent pricing — not guesswork or fads.",
  },
] as const;

export const LADIES_CLUB_FAQS: FAQ[] = [
  {
    question: "What is The Ladies' Club?",
    answer:
      "The Ladies' Club is Hello Gorgeous's women's wellness hub — BioTE hormone therapy, GLP-1 weight loss, peptides, IV therapy, and aesthetic memberships in one place. Ryan Kent, FNP-BC oversees every medical protocol on site.",
  },
  {
    question: "Am I a candidate for BioTE?",
    answer:
      "Women with perimenopause or menopause symptoms — hot flashes, sleep issues, brain fog, low libido, mood changes — often benefit from evaluation. We start with labs and history; hormone therapy isn't right for everyone, and we'll tell you honestly.",
  },
  {
    question: "Can I combine BioTE with GLP-1 weight loss?",
    answer:
      "Yes — many women stack hormone optimization with tirzepatide when clinically appropriate. One NP team coordinates labs, dosing, and follow-ups so nothing falls through the cracks.",
  },
  {
    question: "What do peptides do for women?",
    answer:
      "Peptides can support recovery, skin, metabolism, sleep, and intimacy depending on the protocol — sermorelin, BPC-157, GHK-Cu, and PT-141 are common. All require NP evaluation; medication is billed separately from membership fees.",
  },
  {
    question: "How much does women's hormone therapy cost?",
    answer:
      "BioTE pellet insertion typically runs $400–650 with baseline labs ~$250–450. Women's Hormone Member is $99/mo for member pricing and quarterly check-ins — pellet and lab fees are quoted at consult.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a complimentary consult online or call (630) 636-6193. Try our Perimenopause or GLP-1 readiness screeners first if you're unsure where to start.",
  },
];

export function appForHerUrl(options?: {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): string {
  const url = new URL("/app", SITE.url);
  url.searchParams.set("tab", "membership");
  url.searchParams.set("utm_source", options?.utmSource ?? "website");
  url.searchParams.set("utm_medium", options?.utmMedium ?? "ladies_club");
  url.searchParams.set("utm_campaign", options?.utmCampaign ?? "for_her");
  return url.toString();
}
