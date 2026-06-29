/**
 * Phase 2 — primary site navigation (5 hubs).
 * Services · Shop RX · Specials · About · Book
 */

import { BOOKING_URL, RX_PATIENT_CARE_PATH } from "@/lib/flows";
import { LABS_NAV } from "@/lib/labs-nav";
import { GENTLEMENS_CLUB_PATH } from "@/lib/gentlemens-club";
import { LADIES_CLUB_PATH } from "@/lib/ladies-club";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { QUIZ_NAV } from "@/lib/quiz-nav";
import { SKIN_101_NAV } from "@/lib/skin-101-nav";
import { SPECIALS_PATH } from "@/lib/specials";
import { SHOP_RX_NAV } from "@/lib/medical-mega-menu";

export const PRIMARY_NAV_HUBS = [
  { id: "services", label: "Services", href: "/services", hasDropdown: true },
  { id: "shop-rx", label: SHOP_RX_NAV.label, href: SHOP_RX_NAV.href, hasDropdown: true },
  { id: "labs", label: LABS_NAV.label, href: LABS_NAV.href, hasDropdown: true },
  { id: "specials", label: "Specials", href: SPECIALS_PATH, hasDropdown: true },
  { id: "about", label: "About", href: "/about", hasDropdown: true },
  {
    id: "book",
    label: PRIMARY_BOOKING_CTA.shortLabel,
    href: PRIMARY_BOOKING_CTA.href,
    hasDropdown: false,
  },
] as const;

export type PrimaryNavHubId = (typeof PRIMARY_NAV_HUBS)[number]["id"];

/** Paths that highlight the About nav tab (patient resources + education folded in). */
export const ABOUT_NAV_ACTIVE_PREFIXES = [
  "/about",
  "/faq",
  "/blog",
  "/why-choose-us",
  "/locations",
  "/contact",
  "/pre-post-care",
  "/forms",
  "/patient-documents",
  "/app",
  "/get-app",
  SKIN_101_NAV.href,
  QUIZ_NAV.href,
  "/help-me-choose",
] as const;

export function isAboutNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return ABOUT_NAV_ACTIVE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/** Folded into About dropdown — patient, education, quizzes. */
export const ABOUT_NAV_EXTRA_LINKS = [
  { label: "Skin 101 Education", href: SKIN_101_NAV.href, sub: "Peptides, skin science & treatment guides" },
  { label: "Quizzes & Screeners", href: QUIZ_NAV.href, sub: "GLP-1, TRT, perimenopause & treatment finders" },
  { label: "Pre & Post Care", href: "/pre-post-care", sub: "Treatment care guides" },
  { label: "Patient Documents", href: "/patient-documents", sub: "Forms, PDFs & consent" },
  { label: "Hello Gorgeous App", href: "/app", sub: "Book, Vitamin Bar & My RX on your phone", badge: "APP" as const },
  { label: "Contact Us", href: "/contact", sub: "Hours, location & phone" },
] as const;

/** Folded into Specials dropdown. */
export const SPECIALS_NAV_EXTRA_LINKS = [
  { label: "Gift Cards", href: "/gift-cards", sub: "Give the gift of gorgeous" },
  { label: "0% Financing", href: "/financing", sub: "Cherry & CareCredit options" },
  { label: "Gentlemen's Club", href: GENTLEMENS_CLUB_PATH, sub: "Men's TRT, Brotox & peptides" },
  { label: "Ladies' Club", href: LADIES_CLUB_PATH, sub: "Women's BHRT, GLP-1 & peptides" },
] as const;

/** In-office Services — prescription programs live under Shop RX only. */
export const SERVICES_RX_BRIDGE_LINKS = [
  {
    label: "Shop RX — medical programs",
    href: SHOP_RX_NAV.href,
    sub: "GLP-1 · peptides · hormones · ship to home",
    badge: "Rx" as const,
  },
  {
    label: "Hello Gorgeous Labs",
    href: LABS_NAV.href,
    sub: "Cash-pay panels · in-house draws Oswego",
    badge: "NEW" as const,
  },
  {
    label: "RX refills & patient care",
    href: RX_PATIENT_CARE_PATH,
    sub: "Existing patients — refills, pay & guides",
  },
] as const;

export const SERVICES_EXPLORE_LINKS = [
  { label: "Before & After Gallery", href: "/gallery", sub: "Real client results" },
  { label: "Help Me Choose", href: "/help-me-choose", sub: "Goal-based treatment finder" },
] as const;

/** Mobile accordion — matches desktop hubs (no duplicate top-level items). */
export const MOBILE_PRIMARY_NAV_SECTIONS = [
  { id: "services", label: "Services" },
  { id: "shop-rx", label: "Shop RX", highlight: true },
  { id: "labs", label: "Labs", highlight: true },
  { id: "specials", label: "Specials", highlight: true },
  { id: "about", label: "About" },
] as const;

/** @deprecated Booking uses Fresha externally from patient dropdown legacy */
export const LEGACY_BOOK_ONLINE_LINK = {
  label: "Book Online (Fresha)",
  href: BOOKING_URL,
  sub: "Opens Fresha scheduler",
  external: true as const,
};
