/**
 * Intent-first CTAs for Ladies' & Gentlemen's Club — screen before book/call.
 */

import { PROGRAM_CONSULT_BOOKING_URL } from "@/lib/flows";

export type ClubStartPath = {
  id: string;
  icon: string;
  title: string;
  sub: string;
  href: string;
  cta: string;
  badge?: string;
};

export type ClubStickyCtaConfig = {
  screenerHref: string;
  screenerLabel: string;
  bookHref: string;
  bookLabel: string;
  textLabel: string;
};

export const LADIES_CLUB_START_PATHS: ClubStartPath[] = [
  {
    id: "hormones",
    icon: "🌸",
    title: "Hormones & BioTE",
    sub: "Perimenopause, menopause, sleep, libido",
    href: "/quiz/perimenopause-readiness",
    cta: "2-min screener →",
    badge: "START HERE",
  },
  {
    id: "glp1",
    icon: "⚡",
    title: "Medical weight loss",
    sub: "GLP-1 readiness & candidacy",
    href: "/quiz/glp-1-readiness",
    cta: "GLP-1 screener →",
  },
  {
    id: "explore",
    icon: "💎",
    title: "Peptides, IV & more",
    sub: "Pricing guides & full menus",
    href: "/peptides",
    cta: "Explore RX menu →",
  },
];

export const GENTLEMENS_CLUB_START_PATHS: ClubStartPath[] = [
  {
    id: "trt",
    icon: "🧬",
    title: "TRT & hormones",
    sub: "Low T symptoms, labs & safety flags",
    href: "/quiz/trt-readiness",
    cta: "TRT screener →",
    badge: "START HERE",
  },
  {
    id: "glp1",
    icon: "⚖️",
    title: "Medical weight loss",
    sub: "Semaglutide & tirzepatide fit",
    href: "/quiz/glp-1-readiness",
    cta: "GLP-1 screener →",
  },
  {
    id: "hair",
    icon: "💈",
    title: "Hair restoration",
    sub: "Pattern, Rx & AnteAGE readiness",
    href: "/quiz/hair-readiness",
    cta: "Hair screener →",
  },
];

export const LADIES_CLUB_STICKY_CTA: ClubStickyCtaConfig = {
  screenerHref: "/quiz/perimenopause-readiness",
  screenerLabel: "Screener",
  bookHref: PROGRAM_CONSULT_BOOKING_URL,
  bookLabel: "$49 consult",
  textLabel: "Text us",
};

export const GENTLEMENS_CLUB_STICKY_CTA: ClubStickyCtaConfig = {
  screenerHref: "/quiz/trt-readiness",
  screenerLabel: "TRT quiz",
  bookHref: PROGRAM_CONSULT_BOOKING_URL,
  bookLabel: "$49 consult",
  textLabel: "Text us",
};

export const CLUB_BEFORE_YOU_CALL = {
  headline: "Busy? Start online — we'll meet you where you are.",
  bullets: [
    "2-minute screeners sort your path before you book",
    "$49 consult on Fresha 24/7 — same NP team, correct visit type every time",
    "Text us for quick questions · call when you're ready to talk",
  ],
} as const;
