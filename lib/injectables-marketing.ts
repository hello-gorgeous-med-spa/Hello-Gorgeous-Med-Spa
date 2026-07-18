/**
 * Botox & Fillers — flagship injectables marketing (Hello Gorgeous Oswego).
 * Pricing sourced from lib/injectables-menu.ts — do not hardcode elsewhere.
 */

import { INJECTABLES_MENU, INJECTABLES_MENU_PATH } from "@/lib/injectables-menu";
import { PRIMARY_CITY_SLUGS } from "@/lib/city-seo-tier";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

export const INJECTABLES_PATH = INJECTABLES_MENU_PATH;

export const INJECTABLES_NAV = {
  label: "Botox & Fillers",
  href: INJECTABLES_PATH,
  sub: "Botox $10/unit · lip filler · dermal fillers · all 5 neurotoxins",
} as const;

export const INJECTABLES_MARKETING = {
  name: "Injectables",
  product: "Botox & Fillers",
  tagline: "NP-led neurotoxins & dermal fillers",
  eyebrow: "All 5 neurotoxin brands · NP on site",
  headline: "Natural injectables, medical oversight",
  subhead:
    "Botox from $10/unit (Allergan & US distributors only), half syringe $300, filler $599 (buy 2 save $100) — all five FDA-approved neurotoxins with nurse practitioner oversight and honest dosing at Hello Gorgeous in Oswego.",
  trustLine:
    "Only Fox Valley med spa with Botox, Dysport, Jeuveau, Xeomin & Daxxify on one menu — plus Lip Studio AI preview and full-face filler mapping.",
  phoneDisplay: "(630) 636-6193",
  phoneHref: "tel:6306366193",
  bookHref: PRIMARY_BOOKING_CTA.href,
  lipStudioHref: "/lip-studio",
  compareNeurotoxinsHref: "/botox-vs-dysport-vs-jeuveau",
  botoxOswegoHref: "/botox-oswego",
  lipFillerHref: "/lip-filler-oswego",
  dermalFillersHref: "/dermal-fillers-oswego",
  morpheus8Href: "/services/morpheus8",
  images: {
    hero: "/images/injectables/hero-lip-injection.png",
    lipPromo: "/images/injectables/promo-half-syringe.png",
    glamPortrait: "/images/injectables/hero-glam-portrait.png",
    chinGlove: "/images/injectables/hero-chin-glove.png",
    menuPoster: "/images/promo/injection-menu-poster.png",
    buyerPath: "/images/homepage-buyer-paths/injectables.png",
    depthRef: "/images/skin-layers-injection-depth-reference.png",
    hylenex: "/images/square-appointments/hylenex-4-pack-carton.jpg",
  },
} as const;

export const INJECTABLES_INTRO_SPECIAL = {
  badge: "Botox from $10/unit",
  title: "Neurotoxins — all 5 brands",
  priceLabel: "$10",
  priceNote: "per unit · Botox · free consult",
  description:
    "Upper face, masseter, lip flip & preventative baby tox — we map honest units at consult so you never pay for more than you need.",
  ctaLabel: "Book free consult",
  href: INJECTABLES_PATH,
} as const;

export const INJECTABLES_PAGE_NAV = [
  { href: "#clinic", label: "Clinic video" },
  { href: "#why", label: "Why HG" },
  { href: "#brands", label: "Brands" },
  { href: "#fillers", label: "Fillers" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export const INJECTABLES_WHAT_IT_DOES = [
  {
    id: "five-brands",
    title: "All 5 neurotoxins",
    body: "Botox, Dysport, Jeuveau, Xeomin & Daxxify — we match brand to your anatomy, not a one-size menu.",
    stat: "5",
    statLabel: "brands",
  },
  {
    id: "np-led",
    title: "NP-led injectors",
    body: "Medical oversight on every visit — anatomical mapping, dissolver on hand, and conservative baby tox options.",
    stat: "NP",
    statLabel: "on site",
  },
  {
    id: "natural",
    title: "Natural movement",
    body: "We treat dynamic lines while preserving expression — no frozen forehead unless you ask for it.",
    stat: "100%",
    statLabel: "custom dose",
  },
  {
    id: "full-menu",
    title: "Full filler menu",
    body: "Lips, cheeks, jawline, temples & biostimulators — Juvederm, Restylane, RHA & Sculptra protocols.",
    stat: "$300+",
    statLabel: "half syringe",
  },
] as const;

export const INJECTABLES_STEPS = [
  {
    step: "1",
    title: "Free consult",
    body: "We discuss goals, review photos, and map units or syringes — Lip Studio AI preview available for lips.",
  },
  {
    step: "2",
    title: "Treatment plan",
    body: "Honest pricing from our menu — no upsell pressure. Alle rewards on Botox & Juvederm when eligible.",
  },
  {
    step: "3",
    title: "Comfortable visit",
    body: "Topical numbing for fillers · quick neurotoxin sessions · same-day touch-up scheduling when needed.",
  },
  {
    step: "4",
    title: "Follow-up care",
    body: "2-week filler check included in plan · written aftercare · membership discounts on every brand.",
  },
] as const;

export const INJECTABLES_TREATMENT_AREAS = [
  "Forehead lines",
  "Crow's feet",
  "Frown lines (11s)",
  "Lip flip",
  "Masseter / jaw slimming",
  "Lip volume & definition",
  "Cheeks & midface",
  "Jawline & chin",
  "Nasolabial folds",
  "Under-eye hollows",
  "Temples",
  "Neck bands",
] as const;

export const INJECTABLES_NEUROTOXIN_PACKAGES = INJECTABLES_MENU.sections[0].pricing.map((p) => ({
  id: p.label.toLowerCase().replace(/\s+/g, "-"),
  name: p.label,
  price: p.price,
  detail: "note" in p ? p.note : undefined,
  href: "href" in p ? p.href : undefined,
}));

export const INJECTABLES_FILLER_PACKAGES = [
  {
    id: "half",
    name: "Half syringe",
    price: "$300",
    detail: "Lips or targeted touch-ups",
    bullets: ["Perfect for first-timers", "Lip Studio AI preview", "2-week touch-up in plan"],
    href: "/lip-filler-oswego",
    highlight: true,
    image: "/images/injectables/promo-half-syringe.png",
    imageAlt: "½ syringe lip filler — Hello Gorgeous Med Spa Oswego",
    imagePosition: "object-[center_35%]",
  },
  {
    id: "filler-1",
    name: "Filler — 1 syringe",
    price: "$599",
    detail: "Lip or dermal · Juvederm & Restylane",
    bullets: ["Volume + definition", "Natural facial balance", "Swelling typically 24–48 hr"],
    href: "/lip-filler-oswego",
    image: "/images/injectables/hero-lip-injection.png",
    imageAlt: "Filler treatment with medical injector — Hello Gorgeous Oswego",
    imagePosition: "object-[center_30%]",
  },
  {
    id: "filler-2",
    name: "Filler — 2 syringes",
    price: "$1,098",
    detail: "Save $100 vs two singles",
    bullets: ["Full-face mapping", "Juvederm · Restylane · RHA", "Quoted at consult"],
    href: "/dermal-fillers-oswego",
    image: "/images/injectables/hero-glam-portrait.png",
    imageAlt: "Glowing skin after dermal filler mapping — Hello Gorgeous Med Spa",
    imagePosition: "object-[center_25%]",
  },
  {
    id: "dermal-areas",
    name: "Dermal filler areas",
    price: "$599",
    detail: "per syringe · cheeks · jaw · chin",
    bullets: ["Cheeks · jaw · chin · temples", "Hyaluronidase available", "Cherry financing"],
    href: "/dermal-fillers-oswego",
    image: "/images/injectables/hero-chin-glove.png",
    imageAlt: "Dermal filler consult — medical aesthetics at Hello Gorgeous",
    imagePosition: "object-[center_40%]",
  },
] as const;

export const INJECTABLES_FAQS = [
  ...INJECTABLES_MENU.faqs.map((f) => ({ q: f.question, a: f.answer })),
  {
    q: "How long do neurotoxin results last?",
    a: "Most clients see 3–4 months from Botox, Dysport, and Jeuveau. Daxxify can last up to 6 months. Timing varies by metabolism, dose, and treatment area.",
  },
  {
    q: "What should I expect after lip filler?",
    a: "Swelling and tenderness are normal for 24–48 hours. We schedule a 2-week check to assess shape and discuss touch-ups if needed — included in your treatment plan.",
  },
  {
    q: "Do you offer financing for fillers?",
    a: "Yes — Cherry and CareCredit are available for qualifying clients. Ask at booking or your consult.",
  },
  {
    q: "Can I combine Botox with Morpheus8 or Solaria?",
    a: "Yes — many clients pair injectables with our InMode Trifecta for surface + volume + tightening. We map an honest sequence at consult so treatments complement each other.",
  },
] as const;

export const INJECTABLES_NAV_ACTIVE_PREFIXES = [
  INJECTABLES_PATH,
  "/injectables",
  ...PRIMARY_CITY_SLUGS.filter((s) => s !== "oswego").map((slug) => `/injectables-${slug}-il`),
  "/services/botox",
  "/services/dermal-fillers",
  "/botox",
  "/dermal-fillers",
  "/lip-filler",
  "/lip-studio",
  "/lip-flip",
  "/daxxify",
  "/dysport",
  "/jeuveau",
  "/xeomin",
  "/botox-vs-dysport",
  "/hyperhidrosis-botox",
] as const;

export function isInjectablesNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return INJECTABLES_NAV_ACTIVE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}-`),
  );
}

export const INJECTABLES_SEO = {
  title: "Botox & Fillers | Half Syringe $300 · Filler $599 | Hello Gorgeous Oswego",
  description:
    "Botox from $10/unit, half syringe $300, filler $599 (buy 2 save $100) at Hello Gorgeous Med Spa Oswego IL — all 5 neurotoxins, NP-led injectors, Lip Studio preview. Free consult.",
  ogAlt: "Botox and dermal fillers — Hello Gorgeous Med Spa Oswego IL",
} as const;
