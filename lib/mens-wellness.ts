/**
 * /mens-wellness hub — men's aesthetics, hormones, peptides & membership.
 */

import type { FAQ } from "@/lib/seo";
import { GLP1_RETAIL_PROGRAM, PEPTIDE_RETAIL_FROM_MONTHLY_USD } from "@/lib/peptide-retail-pricing";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { squareGiftCardUrl } from "@/lib/gift-cards";
import { GENTLEMENS_CLUB_PATH, GENTLEMENS_CLUB_TIERS } from "@/lib/gentlemens-club";

export const MENS_WELLNESS_PATH = "/mens-wellness";

export type MensWellnessService = {
  id: string;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
  external?: boolean;
  badge?: string;
};

export const MENS_WELLNESS_JUMP_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Screeners", href: "#screeners" },
  { label: "Why Us", href: "#why-us" },
  { label: "Membership", href: "#membership" },
  { label: "FAQ", href: "#faq" },
] as const;

export const MENS_WELLNESS_SERVICES: MensWellnessService[] = [
  {
    id: "brotox",
    icon: "💉",
    eyebrow: "Aesthetics",
    title: "Brotox",
    description:
      "Botox dosed for male facial anatomy — stronger muscles, natural results. Look rested and sharp, not frozen.",
    bullets: [
      "Conservative NP dosing",
      "Forehead, crow's feet & frown lines",
      "~15-minute treatment",
      "Member pricing via Gentlemen's Club",
    ],
    href: "/brotox",
    cta: "Brotox for men →",
    badge: "POPULAR",
  },
  {
    id: "hormones",
    icon: "🧬",
    eyebrow: "Men's Health",
    title: "Hormone Optimization & TRT",
    description:
      "Lab-guided testosterone replacement when clinically appropriate — injections, BioTE pellets, or topical protocols.",
    bullets: [
      "Baseline panels ~$250–450",
      "TRT from $200–350/mo (protocol-dependent)",
      "Energy, libido, mood & body comp",
      "Ryan Kent, FNP-BC on site 7 days",
    ],
    href: "/mens-hormones",
    cta: "Men's hormone program →",
    badge: "RX",
  },
  {
    id: "peptides",
    icon: "⚡",
    eyebrow: "Performance",
    title: "Peptide Therapy",
    description:
      "BPC-157, Sermorelin, NAD+, Recovery Blend & more — prescribed after NP evaluation, not mail-order guesswork.",
    bullets: [
      `$${PEPTIDE_CONSULT_FEE_USD} peptide consult`,
      `Protocols from $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo`,
      "Recovery, sleep & longevity support",
      "Licensed US compounding pharmacies",
    ],
    href: "/peptides",
    cta: "Peptides for men →",
  },
  {
    id: "glp1",
    icon: "⚖️",
    eyebrow: "Weight Loss",
    title: "Medical Weight Loss (GLP-1)",
    description:
      "NP-supervised semaglutide and tirzepatide with monthly check-ins — built for men who want metabolic results with oversight.",
    bullets: [
      `Semaglutide from $${GLP1_RETAIL_PROGRAM.semaglutideFromUsd}/mo`,
      `Tirzepatide from $${GLP1_RETAIL_PROGRAM.tirzepatideFromUsd}/mo`,
      "Free candidacy consult",
      "Medication + NP titration included",
    ],
    href: "/glp-1-weight-loss-oswego",
    cta: "GLP-1 program →",
  },
  {
    id: "gift",
    icon: "🎁",
    eyebrow: "Gifts",
    title: "Brotox Gift Card",
    description:
      "Skip the tie — gift cards for Brotox, consults, and men's wellness. Delivered instantly via Square.",
    bullets: [
      "Father's Day, birthdays & just because",
      "Redeem for Brotox or services",
      "Digital delivery",
    ],
    href: squareGiftCardUrl({ utmMedium: "mens_wellness", utmCampaign: "gift_brotox" }),
    cta: "Buy gift card →",
    external: true,
  },
];

export const MENS_WELLNESS_SCREENERS = [
  {
    id: "trt",
    title: "TRT Readiness Screener",
    sub: "2 min · symptoms, labs & safety flags",
    href: "/quiz/trt-readiness",
    badge: "NEW",
  },
  {
    id: "glp1",
    title: "GLP-1 Readiness Screener",
    sub: "2 min · medical weight loss candidacy",
    href: "/quiz/glp-1-readiness",
    badge: "NEW",
  },
] as const;

export const MENS_WELLNESS_PILLARS = [
  {
    title: "Private & judgment-free",
    description:
      "Men's wellness shouldn't feel awkward. We see guys regularly — results-focused care in a comfortable, confidential setting.",
  },
  {
    title: "Licensed NP oversight",
    description:
      "Ryan Kent, FNP-BC writes and supervises every prescription. Injectors know male anatomy, dosing, and natural-looking Brotox.",
  },
  {
    title: "Lab-guided protocols",
    description:
      "Hormones and peptides are built on your actual labs — not guesswork, not influencer stacks. Ongoing monitoring when you're on therapy.",
  },
] as const;

export const MENS_WELLNESS_MEMBERSHIP = {
  href: GENTLEMENS_CLUB_PATH,
  fromPrice: GENTLEMENS_CLUB_TIERS[0]?.pricePerMonth ?? 99,
  tierName: GENTLEMENS_CLUB_TIERS[0]?.name ?? "The Gentleman",
};

export const MENS_WELLNESS_FAQS: FAQ[] = [
  {
    question: "What is Brotox?",
    answer:
      "Brotox is Botox designed and dosed specifically for men. Men typically have stronger facial muscles and may need more units than women. Our NPs aim for natural results — rested and sharp, not frozen.",
  },
  {
    question: "Does Botox for men look natural?",
    answer:
      "Yes — when dosed correctly for male anatomy. Most people will just think you look well-rested. Our licensed NPs use conservative strategies tailored to how men express and move their faces.",
  },
  {
    question: "What is hormone optimization for men?",
    answer:
      "Hormone optimization (including TRT) addresses low testosterone and related imbalances that cause fatigue, low libido, weight gain, mood changes, and reduced performance. We start with comprehensive labs and build a personalized protocol only when clinically appropriate.",
  },
  {
    question: "How do I know if TRT is right for me?",
    answer:
      "Start with our free TRT Readiness Screener at hellogorgeousmedspa.com/quiz/trt-readiness — then book a hormone consult. Ryan Kent, FNP-BC reviews symptoms, history, and labs before any prescription.",
  },
  {
    question: "What are peptides and what can they do for men?",
    answer:
      "Peptides are short chains of amino acids that signal specific functions — recovery, growth hormone support, sleep, fat metabolism, and more. They're prescribed after an NP evaluation; popular options include BPC-157, Sermorelin, and NAD+.",
  },
  {
    question: "Is it awkward for men at a med spa?",
    answer:
      "Not here. We treat men regularly and our team is professional and judgment-free. You'll be treated like any other patient focused on looking and feeling their best.",
  },
  {
    question: "What is The Gentlemen's Club membership?",
    answer:
      `The Gentlemen's Club is our men's wellness membership from $${MENS_WELLNESS_MEMBERSHIP.fromPrice}/mo — member pricing on Brotox, monthly wellness shots (B12, Lipo-C, or NAD+), priority booking, and optional hormone/peptide support tiers.`,
  },
  {
    question: "How do I get started with men's wellness at Hello Gorgeous?",
    answer:
      "Book a men's wellness consultation online or call (630) 636-6193. We'll review your goals, health history, and recommend the right starting point — Brotox, a hormone panel, peptides, GLP-1, or membership.",
  },
];
