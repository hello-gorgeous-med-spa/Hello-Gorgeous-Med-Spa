/** Homepage atelier look — beige, pink, one slogan, real doors. */

import { FACIALS_PEELS_PATH } from "@/lib/facials-peels-marketing";
import { DANI_CREDENTIALS_PUBLIC, DANI_FULL_NAME } from "@/lib/founder-credentials";
import { INJECTABLES_PATH } from "@/lib/injectables-marketing";
import { IV_THERAPY_PATH } from "@/lib/iv-therapy-marketing";
import { MEDICAL_DIRECTOR } from "@/lib/medical-authority";
import { MORPHEUS8_PATH } from "@/lib/morpheus8-marketing";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { REGEN_REFILL_PATH } from "@/lib/flows";
import { QUANTUM_RF_PATH } from "@/lib/quantum-rf-marketing";
import { REGEN_RX_PUBLIC_URL } from "@/lib/regen-partnership";
import { SOLARIA_CO2_PATH } from "@/lib/solaria-marketing";

export const ATELIER = {
  beige: "#fdf8f4",
  pink: "#ff00a1",
  ink: "#0a0a0a",
} as const;

export const ATELIER_SLOGAN = "We screen you like a medical practice because we are one.";

export const ATELIER_INTRO_VIDEO = "/videos/website-hero/hello-gorgeous-intro.mp4" as const;
export const ATELIER_INTRO_POSTER = "/images/website-hero/hello-gorgeous-intro-poster.jpg" as const;
export const ATELIER_INTRO_SESSION_KEY = "hg-atelier-intro-played";

export const ATELIER_DANI_IMAGE = "/images/team/danielle-heart-hands.jpg" as const;
export const ATELIER_DANI_ALT =
  "Danielle Alcala-Glazier, owner of Hello Gorgeous Med Spa — medical aesthetic care in Oswego, IL.";

export const ATELIER_JUMP = [
  { href: "#services", label: "Services" },
  { href: "#devices", label: "Devices" },
  { href: "#about", label: "About" },
  { href: "#gallery", label: "Gallery" },
  { href: PRIMARY_BOOKING_CTA.href, label: "Book Now" },
] as const;

export const ATELIER_SERVICES = [
  {
    id: "injectables",
    title: "Injectables",
    note: "Botox, Xeomin, Dysport, Jeuveau · filler",
    href: INJECTABLES_PATH,
    image: "/images/injectables/hero-lip-injection.png",
    alt: "Injectable treatment at Hello Gorgeous Med Spa",
  },
  {
    id: "skin",
    title: "Skin",
    note: "Facials, peels, HydraFacial, acne protocols",
    href: FACIALS_PEELS_PATH,
    image: "/images/services-hub/editorial/glow-molecule.jpg",
    alt: "Clinical facial glow at Hello Gorgeous",
  },
  {
    id: "weight",
    title: "Weight loss",
    note: "GLP-1 care after a licensed clinician reviews you",
    href: "/glp-1-weight-loss-oswego",
    image: "/images/homepage-atelier/weight-loss.jpg",
    alt: "Medical weight loss at Hello Gorgeous Med Spa",
  },
  {
    id: "compound-shop",
    title: "Compound shop",
    note: "Peptides & RX protocols · see price · request review",
    href: REGEN_REFILL_PATH,
    image: "/images/regen/catalog/sermorelin.png",
    alt: "REGEN RX compounded sermorelin vial — Hello Gorgeous compound shop",
  },
  {
    id: "iv",
    title: "IV & wellness",
    note: "IV Hour $150 — pick a bag or build your own",
    href: IV_THERAPY_PATH,
    image: "/images/homepage-atelier/iv-therapy.jpg",
    alt: "IV therapy drips at Hello Gorgeous Med Spa",
  },
] as const;

export const ATELIER_DEVICES = [
  {
    id: "solaria",
    eyebrow: "CO₂ fractional",
    title: "Solaria",
    note: "Texture, scars, pigment, neck and chest",
    href: SOLARIA_CO2_PATH,
  },
  {
    id: "morpheus8",
    eyebrow: "RF microneedling",
    title: "Morpheus8 Burst",
    note: "Jawline, laxity, scars, contour",
    href: MORPHEUS8_PATH,
  },
  {
    id: "quantum",
    eyebrow: "Body remodeling",
    title: "Quantum RF",
    note: "Face and body tightening — InMode",
    href: QUANTUM_RF_PATH,
  },
  {
    id: "lumecca",
    eyebrow: "IPL",
    title: "Lumecca",
    note: "Photofacials and hair — redness, pigment",
    href: "/services/ipl-photofacial",
  },
] as const;

export const ATELIER_GALLERY = [
  {
    src: "/images/studio/waiting-lounge-2026.jpg",
    alt: "Hello Gorgeous waiting lounge in downtown Oswego",
  },
  {
    src: "/images/studio/team-circle-2026.jpg",
    alt: "Hello Gorgeous studio team",
  },
  {
    src: "/images/solaria/hg-clinic-solaria-treatment.jpg",
    alt: "Solaria CO₂ treatment at Hello Gorgeous",
  },
  {
    src: "/images/website-hero/hello-gorgeous-medical-spa-hero.jpg",
    alt: "Hello Gorgeous Medical Spa lounge",
  },
] as const;

export const ATELIER_ABOUT = {
  name: DANI_FULL_NAME,
  role: "Owner & Founder",
  lede: `${ATELIER_SLOGAN} Medically directed care in downtown Oswego — not a trend menu.`,
  body: `Danielle is a ${DANI_CREDENTIALS_PUBLIC}. She is in the studio. Medical Director ${MEDICAL_DIRECTOR.displayName}. Prescriptions are written by a licensed Illinois clinician after review.`,
  href: "/about#dani",
};

export const ATELIER_DOORS = [
  { label: "Med spa", href: "/services", detail: "In-office aesthetics" },
  { label: "REGEN RX", href: REGEN_RX_PUBLIC_URL, detail: "Peptides, hormones, GLP-1" },
] as const;
