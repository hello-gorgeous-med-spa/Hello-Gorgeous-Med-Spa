/**
 * Quantum RF — flagship Journey marketing (InMode Luxora / Trifecta).
 * Canonical route: /services/quantum-rf (peer to Morpheus8 + Solaria Journeys).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { QUANTUM_RF_LAUNCH_PACKAGES } from "@/lib/quantum-rf-launch-promo";
import { SITE } from "@/lib/seo";

export const QUANTUM_RF_PATH = "/services/quantum-rf" as const;

export const QUANTUM_RF_CONTACT = {
  bookHref: PRIMARY_BOOKING_CTA.href,
  phoneTel: `tel:${SITE.phone.replace(/\D/g, "")}`,
  phoneDisplay: SITE.phone,
  textTel: "sms:6302016867",
  textDisplay: "(630) 201-6867",
  financingHref: "https://pay.withcherry.com/hellogorgeous",
} as const;

export const QUANTUM_RF_MARKETING = {
  name: "Quantum RF",
  product: "InMode QuantumRF",
  tagline: "Subdermal fat reduction + skin tightening — no surgery",
  eyebrow: "InMode Luxora · Verified Provider · Oswego, IL",
  headline: "Your Quantum RF Journey",
  subhead:
    "QuantumRF by InMode delivers precise fat reduction and skin tightening with a small probe under local anesthesia — up to ~25% fat reduction potential in one treatment, without liposuction or an OR.",
  trustLine:
    "Only practice in the western Chicago suburbs with Quantum RF + full InMode Luxora Trifecta (Quantum + Morpheus8 Burst + Solaria CO₂).",
  phoneDisplay: QUANTUM_RF_CONTACT.phoneDisplay,
  phoneHref: QUANTUM_RF_CONTACT.phoneTel,
  bookHref: QUANTUM_RF_CONTACT.bookHref,
  textTel: QUANTUM_RF_CONTACT.textTel,
  textDisplay: QUANTUM_RF_CONTACT.textDisplay,
  careHref: "/pre-post-care/quantum-rf",
  landerHref: "/quantum-rf-oswego",
  compareMorpheusHref: "/services/morpheus8",
  compareSolariaHref: "/services/solaria-co2",
  trifectaHref: "/specials",
  inmodeUrl: "https://www.inmodemd.com/technologies/quantumrf/",
  /** Luxora / InMode platform hero */
  heroVideo: "/videos/quantum-rf/luxora-inmode-hero.mp4",
  clinicVideo: "/videos/quantum/quantum-rf-clinic-reedit-oswego.mp4",
  ryanVideo: "/videos/quantum-rf/ryan-quantum-rf-action-1.mp4",
  images: {
    hero: "/images/quantum-rf/quantum-hero.jpg",
    overview: "/images/quantum-rf/quantum-rf-technology-inmode-overview.png",
    handpieces: "/images/quantum-rf/quantum-rf-inmode-handpieces-ba.jpg",
    procedure: "/images/quantum-rf/quantum-rf-procedure-may-4.jpg",
    room: "/images/quantum-rf/quantum-rf-treatment-room-may-4.jpg",
    flyer: "/images/promo/quantum-rf-launch-flyer.png",
    founder: "/images/team/dani-ryan-founders-portrait.png",
    ryanPoster: "/images/quantum-rf/ryan-quantum-rf-action-poster.png",
    jawlineClinic: "/images/quantum-rf/quantum-rf10-jawline-before-after.jpg",
    clinicalNeck: "/images/quantum-rf/clinical-ba-jawline-neck-tightening.png",
    clinicalAbdomen: "/images/quantum-rf/clinical-ba-abdomen-skin-tightening.png",
    clinicalArm: "/images/quantum-rf/clinical-ba-upper-arm-tightening.png",
    clinicalKnee: "/images/quantum-rf/clinical-ba-knee-skin-tightening.png",
    clinicalProfile: "/images/quantum-rf/clinical-ba-profile-jawline-submental.png",
    clinicalLowerFace: "/images/quantum-rf/clinical-ba-lower-face-jawline.png",
  },
} as const;

export const QUANTUM_RF_INTRO_SPECIAL = {
  badge: "Launch packages · FREE Morpheus8 Burst",
  title: "Neck $2,499 · Abdomen $3,999",
  priceLabel: "From $2,499",
  priceNote: "each package includes complimentary Morpheus8 Burst · Cherry financing",
  description:
    "One treatment session · local anesthesia · fat reduction + skin contraction. Results continue building up to 6 months.",
  ctaLabel: "Book free consult",
  href: QUANTUM_RF_PATH,
} as const;

export const QUANTUM_RF_NAV = [
  { href: "#inmode", label: "InMode" },
  { href: "#why", label: "Why Quantum" },
  { href: "#treats", label: "Treats" },
  { href: "#results", label: "Results" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export const QUANTUM_RF_INMODE_STORY = {
  eyebrow: "Why QuantumRF / Luxora",
  title: "Lipo-level contour",
  titleAccent: "without the OR",
  body: [
    "QuantumRF uses bipolar radiofrequency through a small probe to deliver precise fat reduction and skin tightening — no liposuction, no general anesthesia, in-office under numbing.",
    "Unlike multi-session fat freezes, QuantumRF is designed for significant change in a single treatment — up to ~25% fat reduction potential with concurrent skin contraction — then collagen keeps remodeling for months.",
  ],
  quote:
    "We brought Luxora home so you can choose real contour change with medical oversight — Quantum for volume, Morpheus8 for texture, Solaria for surface.",
  chips: ["QuantumRF 10 · face & small zones", "QuantumRF · body contour", "1 treatment typical", "Local anesthesia"],
} as const;

export const QUANTUM_RF_FOUNDER_NOTE = {
  eyebrow: "A Note From Our Founders",
  title: "Why Quantum completes Contour",
  paragraphs: [
    "Stubborn fat and soft laxity don’t always need a scalpel — and they don’t always respond to surface treatments alone. QuantumRF works in the fat layer while contracting tissue above it.",
    "Ryan performs QuantumRF with full-authority NP oversight. Danielle owns the Luxora client experience and InMode training journey. Together we map honest expectations — neck, abdomen, arms, or a Trifecta plan.",
    "Welcome to Contour at Hello Gorgeous — medical standards, boutique care.",
  ],
  signOff: "xoxo, Danielle & Ryan",
  role: "Founders · Hello Gorgeous Med Spa",
} as const;

export const QUANTUM_RF_WHAT_IT_DOES = [
  {
    id: "fat",
    title: "Fat reduction",
    body: "Controlled RF coagulates subcutaneous fat — targeted volume change without suction cannulas.",
    stat: "~25%",
    statLabel: "fat potential*",
  },
  {
    id: "tighten",
    title: "Skin contraction",
    body: "Same session heat stimulates collagen — contour plus firmer tissue over 3–6 months.",
    stat: "1×",
    statLabel: "typical session",
  },
  {
    id: "probe",
    title: "Tiny entry points",
    body: "Small probe + local numbing — no general anesthesia, no operating room.",
    stat: "In-office",
    statLabel: "procedure",
  },
  {
    id: "luxora",
    title: "Luxora platform",
    body: "Pairs with Morpheus8 Burst & Solaria CO₂ for complete face + body rebuilds.",
    stat: "Trifecta",
    statLabel: "ready",
  },
] as const;

export const QUANTUM_RF_STEPS = [
  {
    step: "1",
    title: "Free consult",
    body: "We measure areas, review photos, and tell you honestly if Quantum, Morpheus8 Body, or both fit best.",
  },
  {
    step: "2",
    title: "Prep & numbing",
    body: "Marking, photos, and local anesthesia protocol for comfort before the probe.",
  },
  {
    step: "3",
    title: "QuantumRF session",
    body: "Typically one treatment per planned zone — deep warmth, controlled passes, no OR.",
  },
  {
    step: "4",
    title: "Heal & remodel",
    body: "Usually 5–7 day social recovery · contour builds weeks 4+ · peak tightening up to 6 months.",
  },
] as const;

export const QUANTUM_RF_TREATS = [
  "Neck & jawline fullness",
  "Submental (under-chin)",
  "Abdomen / stubborn fat",
  "Flanks · love handles",
  "Upper arms",
  "Inner thighs",
  "Post-GLP-1 soft laxity",
  "Mild–moderate skin laxity with fat",
] as const;

export const QUANTUM_RF_AREAS_10 = [
  "Face",
  "Neck",
  "Love handles",
  "Inner thighs",
] as const;

export const QUANTUM_RF_PACKAGES = [
  ...QUANTUM_RF_LAUNCH_PACKAGES.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    price: pkg.price,
    detail: pkg.financing,
    bullets: [...pkg.highlights.slice(0, 3), pkg.bonus],
    highlight: Boolean(pkg.badge),
    badge: pkg.badge,
  })),
  {
    id: "arms-knees",
    name: "Arms · knees · custom",
    price: "Consult",
    detail: "quoted by zone",
    bullets: ["QuantumRF 10 / body mapping", "Often paired with Morpheus8", "Honest candidacy screen"],
    highlight: false,
  },
  {
    id: "trifecta",
    name: "VIP Trifecta",
    price: "Specials →",
    detail: "Quantum + Morpheus8 + Solaria",
    bullets: ["Complete InMode overhaul", "Exclusive bundle pricing", "Priority booking"],
    highlight: false,
    href: "/specials",
  },
] as const;

const BA = "/images/quantum-rf/inmode-ba";

export type QuantumRfResult = {
  src: string;
  alt: string;
  label: string;
  area: "face" | "body";
  source: "clinic" | "inmode";
};

export const QUANTUM_RF_RESULTS: QuantumRfResult[] = [
  {
    src: QUANTUM_RF_MARKETING.images.clinicalNeck,
    alt: "Quantum RF jawline and neck tightening before and after — Hello Gorgeous",
    label: "Jawline & neck · HG",
    area: "face",
    source: "clinic",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicalProfile,
    alt: "Quantum RF profile jawline submental before and after",
    label: "Profile · HG",
    area: "face",
    source: "clinic",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicalLowerFace,
    alt: "Quantum RF lower face jawline before and after",
    label: "Lower face · HG",
    area: "face",
    source: "clinic",
  },
  {
    src: QUANTUM_RF_MARKETING.images.jawlineClinic,
    alt: "QuantumRF 10 jawline before and after",
    label: "QuantumRF 10 jawline",
    area: "face",
    source: "clinic",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicalAbdomen,
    alt: "Quantum RF abdomen skin tightening before and after",
    label: "Abdomen · HG",
    area: "body",
    source: "clinic",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicalArm,
    alt: "Quantum RF upper arm tightening before and after",
    label: "Arms · HG",
    area: "body",
    source: "clinic",
  },
  {
    src: QUANTUM_RF_MARKETING.images.clinicalKnee,
    alt: "Quantum RF knee skin tightening before and after",
    label: "Knees · HG",
    area: "body",
    source: "clinic",
  },
  {
    src: `${BA}/face-lside.jpg`,
    alt: "QuantumRF 10 face left side before and after — InMode clinical",
    label: "Face L · InMode",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/face-rside.jpg`,
    alt: "QuantumRF 10 face right side before and after — InMode clinical",
    label: "Face R · InMode",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/face-ba-collage.jpg`,
    alt: "QuantumRF face before and after collage — InMode",
    label: "Face collage · InMode",
    area: "face",
    source: "inmode",
  },
  {
    src: `${BA}/arm-l-front.jpg`,
    alt: "QuantumRF arms left front before and after — InMode clinical",
    label: "Arm · InMode",
    area: "body",
    source: "inmode",
  },
  {
    src: `${BA}/arm-r-front-pr.jpg`,
    alt: "QuantumRF arms right front before and after — InMode clinical",
    label: "Arm · InMode",
    area: "body",
    source: "inmode",
  },
];

export const QUANTUM_RF_FAQS = [
  {
    q: "What is QuantumRF?",
    a: "QuantumRF by InMode uses bipolar radiofrequency through a small probe to reduce fat and tighten skin in one in-office treatment — without liposuction or general anesthesia.",
  },
  {
    q: "How is it different from CoolSculpting?",
    a: "CoolSculpting freezes fat over multiple sessions. QuantumRF heats fat and contracts tissue in a single treatment — often preferred when mild laxity accompanies stubborn fullness.",
  },
  {
    q: "QuantumRF vs Morpheus8?",
    a: "Morpheus8 is RF microneedling for skin texture, scars, and collagen. QuantumRF works deeper in the fat layer for volume reduction plus tightening. Many clients combine both — our launch packages include FREE Morpheus8 Burst.",
  },
  {
    q: "How much does it cost?",
    a: "Launch packages: Neck $2,499 and Abdomen $3,999 — each includes complimentary Morpheus8 Burst. Arms, knees, and custom zones are quoted at consult. Cherry financing available.",
  },
  {
    q: "Is there downtime?",
    a: "Plan about 5–7 days of social recovery for most body plans. Face/neck protocols vary. No hospital stay, no OR.",
  },
  {
    q: "Are results permanent?",
    a: "Destroyed fat cells do not return, but weight stability and lifestyle matter. Skin tightening continues to improve for months as collagen rebuilds.",
  },
] as const;

export const QUANTUM_RF_NAV_ACTIVE_PREFIXES = [
  QUANTUM_RF_PATH,
  "/quantum-rf",
  "/pre-post-care/quantum",
  "/aftercare/quantum",
] as const;

export function isQuantumRfNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return QUANTUM_RF_NAV_ACTIVE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}-`),
  );
}

export const QUANTUM_RF_SEO = {
  title: "Quantum RF Journey | Neck $2,499 · Abdomen $3,999 | Oswego IL",
  description:
    "Your Quantum RF Journey at Hello Gorgeous Med Spa, Oswego IL — InMode Luxora subdermal fat reduction + skin tightening. Neck $2,499 · Abdomen $3,999 with FREE Morpheus8 Burst. Free consult.",
  ogAlt: "Quantum RF body contouring — Hello Gorgeous Med Spa Oswego IL",
} as const;
