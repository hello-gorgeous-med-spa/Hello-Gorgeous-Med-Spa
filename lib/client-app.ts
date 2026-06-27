/**
 * HELLO GORGEOUS CLIENT APP — installable PWA for clients.
 * The Vitamin Bar is one section inside this app, not a separate product.
 */

import { BOOKING_URL, GLP1_INTAKE_PATH, GLP1_REFILL_PATH, HELLO_GORGEOUS_RX_START_PATH, PEPTIDE_REQUEST_PATH, RX_PATIENT_CARE_PATH } from "@/lib/flows";

export const CLIENT_APP = {
  name: "Hello Gorgeous Med Spa",
  shortName: "Hello Gorgeous",
  tagline: "Your med spa, in your pocket · Oswego, IL",
  path: "/app",
  phone: "630-636-6193",
  phoneHref: "tel:+16306366193",
  address: "74 W. Washington St, Oswego, IL",
  hoursNote: "Mon–Fri 10–8 · Sat 10–5 · Sun by appointment",
} as const;

export type ClientAppTab = "home" | "vitamin" | "deals" | "membership" | "forhim" | "me";

export const CLIENT_APP_TABS: { id: ClientAppTab; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "vitamin", label: "Vitamin Bar", icon: "💉" },
  { id: "deals", label: "Deals", icon: "🎁" },
  { id: "membership", label: "Membership", icon: "⭐" },
  { id: "forhim", label: "For Him", icon: "👑" },
  { id: "me", label: "Me", icon: "👤" },
];

/** Home screen quick actions — core Hello Gorgeous services. */
export const CLIENT_APP_QUICK_ACTIONS = [
  {
    id: "book",
    label: "Book Now",
    blurb: "Botox, facials, Morpheus8 & more",
    href: BOOKING_URL,
    external: true,
    icon: "✨",
    accent: true,
  },
  {
    id: "vitamin",
    label: "Vitamin Bar",
    blurb: "Drive-thru shots & pre-pay",
    tab: "vitamin" as ClientAppTab,
    icon: "💉",
  },
  {
    id: "membership",
    label: "Memberships",
    blurb: "Monthly wellness plans",
    tab: "membership" as ClientAppTab,
    icon: "⭐",
  },
  {
    id: "deals",
    label: "Deals",
    blurb: "Specials & gift cards",
    tab: "deals" as ClientAppTab,
    icon: "🎁",
  },
  {
    id: "rx-care-hub",
    label: "RX Refills & Care",
    blurb: "GLP-1 · peptides · add-ons · guides",
    href: RX_PATIENT_CARE_PATH,
    icon: "💊",
    accent: true,
  },
  {
    id: "glp1-refill",
    label: "Renew GLP-1",
    blurb: "Tirzepatide / sema refill",
    href: GLP1_REFILL_PATH,
    icon: "⚖️",
  },
  {
    id: "glp1-intake",
    label: "GLP-1 Screening",
    blurb: "Start weight loss intake",
    href: GLP1_INTAKE_PATH,
    icon: "📋",
  },
  {
    id: "peptide-start",
    label: "RX Start Here",
    blurb: "Pick peptide & get started",
    href: HELLO_GORGEOUS_RX_START_PATH,
    icon: "🧬",
  },
  {
    id: "peptide-request",
    label: "Peptide Request",
    blurb: "New protocol or refill",
    href: PEPTIDE_REQUEST_PATH,
    icon: "📋",
  },
  {
    id: "forhim",
    label: "For Him 👑",
    blurb: "Brotox · Hormones · Peptides",
    tab: "forhim" as ClientAppTab,
    icon: "👑",
  },
] as const;

export const CLIENT_APP_SERVICES = [
  { label: "Botox & Injectables", href: "/botox-oswego" },
  { label: "Morpheus8 & Body Contouring", href: "/body-contouring-oswego-il" },
  { label: "Non-Surgical Facelift", href: "/non-surgical-facelift-oswego-il" },
  { label: "Weight Loss & GLP-1", href: "/glp1-weight-loss" },
  { label: "Peptide Therapy", href: "/peptides" },
  { label: "Facials & HydraFacial", href: "/facials-oswego" },
  { label: "IV Therapy", href: "/iv-therapy" },
] as const;

/** Wellness program cards shown on the Home tab. */
export const CLIENT_APP_WELLNESS_PROGRAMS = [
  {
    id: "peptides",
    label: "Peptide Therapy",
    subtitle: "Regenerative Medicine",
    blurb: "Science-backed peptides for recovery, longevity, skin, and performance. BPC-157, Sermorelin, NAD+, GHK-Cu & more.",
    badge: "NEW",
    accentIndex: 1, // blue
    href: "/peptides",
    learnHref: "/peptides",
    bookHref: "/app?rx=1",
    highlights: ["BPC-157 — tissue & gut repair", "Sermorelin — natural GH release", "NAD+ — cellular energy & longevity", "GHK-Cu — skin & hair renewal"],
  },
  {
    id: "hormones",
    label: "Hormone Optimization",
    subtitle: "Bio-Identical HRT",
    blurb: "Feel like yourself again. Physician-supervised testosterone, estrogen, progesterone & BioTE® pellet therapy.",
    badge: "RX",
    accentIndex: 2, // orange
    href: "/rx/hormones",
    learnHref: "/rx/hormones",
    bookHref: BOOKING_URL,
    highlights: ["Testosterone Replacement (men & women)", "Estrogen & Progesterone Therapy", "BioTE® Pellets — 3–6 month delivery", "Thyroid & DHEA Optimization"],
  },
  {
    id: "glp1",
    label: "Weight Loss & GLP-1",
    subtitle: "Metabolic Wellness",
    blurb: "Semaglutide & Tirzepatide programs supervised by our clinical team. Real results, real support.",
    badge: "POPULAR",
    accentIndex: 0, // pink
    href: "/glp1-weight-loss",
    learnHref: "/glp1-weight-loss",
    bookHref: BOOKING_URL,
    highlights: ["Semaglutide (Ozempic-class)", "Tirzepatide (Mounjaro-class)", "Medical supervision & check-ins", "Nutrition & lifestyle support"],
  },
  {
    id: "fullscript",
    label: "Shop Supplements",
    subtitle: "Fullscript Dispensary",
    blurb: "Practitioner-grade supplements hand-picked by our clinical team. Shipped directly to you — 10% off retail.",
    badge: "SHOP",
    accentIndex: 1, // blue
    href: "https://us.fullscript.com/welcome/hellogorgeousmedspa",
    learnHref: "https://us.fullscript.com/welcome/hellogorgeousmedspa",
    bookHref: "https://us.fullscript.com/welcome/hellogorgeousmedspa",
    highlights: ["Practitioner-grade quality", "10% off retail pricing", "Curated by our clinical team", "Ships directly to your door"],
  },
] as const;

export const CLIENT_APP_PORTAL_LINKS = [
  { label: "My Portal", href: "/portal", icon: "🏠" },
  { label: "RX Refills & Care Hub", href: RX_PATIENT_CARE_PATH, icon: "💊" },
  { label: "GLP-1 Refill", href: GLP1_REFILL_PATH, icon: "💊" },
  { label: "GLP-1 Screening", href: GLP1_INTAKE_PATH, icon: "⚖️" },
  { label: "Hello Gorgeous RX", href: "/app?rx=1", icon: "🧬" },
  { label: "Peptide Request / Refill", href: PEPTIDE_REQUEST_PATH, icon: "📋" },
  { label: "Appointments", href: "/portal/appointments", icon: "📅" },
  { label: "Book a Service", href: BOOKING_URL, icon: "✨" },
  { label: "Rewards", href: "/portal/rewards", icon: "🎁" },
  { label: "Shop Supplements", href: "https://us.fullscript.com/welcome/hellogorgeousmedspa", icon: "💊" },
  { label: "Buy a Gift Card", href: "/app?tab=me&gc=buy", icon: "🎁" },
  { label: "Documents & Consents", href: "/portal/documents", icon: "📁" },
  { label: "Account", href: "/portal/account", icon: "⚙️" },
] as const;
