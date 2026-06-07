/**
 * HELLO GORGEOUS CLIENT APP — installable PWA for clients.
 * The Vitamin Bar is one section inside this app, not a separate product.
 */

import { BOOKING_URL, GLP1_INTAKE_PATH } from "@/lib/flows";

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

export type ClientAppTab = "home" | "vitamin" | "membership" | "visit" | "me";

export const CLIENT_APP_TABS: { id: ClientAppTab; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "vitamin", label: "Vitamin Bar", icon: "💉" },
  { id: "membership", label: "Membership", icon: "⭐" },
  { id: "visit", label: "Visit", icon: "🚗" },
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
    id: "checkin",
    label: "I'm Here",
    blurb: "Curbside check-in",
    tab: "visit" as ClientAppTab,
    icon: "📍",
  },
  {
    id: "glp1-intake",
    label: "GLP-1 Screening",
    blurb: "Start weight loss intake",
    href: GLP1_INTAKE_PATH,
    icon: "⚖️",
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

export const CLIENT_APP_PORTAL_LINKS = [
  { label: "My Portal", href: "/portal", icon: "🏠" },
  { label: "GLP-1 Screening", href: GLP1_INTAKE_PATH, icon: "⚖️" },
  { label: "Appointments", href: "/portal/appointments", icon: "📅" },
  { label: "Book a Service", href: "/portal/book", icon: "✨" },
  { label: "Rewards", href: "/portal/rewards", icon: "🎁" },
  { label: "Documents & Consents", href: "/portal/documents", icon: "📁" },
  { label: "Account", href: "/portal/account", icon: "⚙️" },
] as const;
