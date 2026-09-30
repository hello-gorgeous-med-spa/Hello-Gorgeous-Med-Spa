/**
 * Hello Gorgeous — Luxury Homepage Content (Cream + Gold Palette)
 * Clinical-first messaging, InMode Trifecta, safety-forward
 */

export const LUXURY = {
  gold: "#D4AF37",
  cream: "#FFFAF5",
  warmCream: "#F6EFE6",
  sand: "#EDE6DA",
  gradient: {
    from: "#F8F1E6",
    to: "#E9DDC6",
  },
  dark: "#0A0A0A",
  darker: "#0F0F0F",
} as const;

export const LUXURY_HERO = {
  eyebrow: "Medical Spa · Oswego, IL",
  headline: "We screen you like a medical practice because we are one.",
  subhead:
    "Luxe, clinical, safety-first — not a facial factory.",
  cta: "Book Free Consult",
  ctaSecondary: "Call 630-636-6193",
  trustBadges: [
    { label: "10+ Year Owner", icon: "shield" },
    { label: "4.6 ★ Google", icon: "star" },
    { label: "1,931 verified visits", icon: "check" },
  ],
} as const;

export const LUXURY_INTRO = {
  eyebrow: "Built clinical-first",
  headline: "You are in a medical practice that happens to be gorgeous.",
  body: "Safety-first menu. Licensed Illinois clinicians. InMode Trifecta in downtown Oswego — not a trend menu. Every treatment starts with a medical screening, not a sales script.",
  bullets: [
    "We turn away 1 in 12 consults if not clinically appropriate.",
    "We review 20+ contraindications before touching a device.",
    "Vascular occlusion kit, emergency protocol, MD on call.",
  ],
} as const;

export const LUXURY_PHILOSOPHY = {
  eyebrow: "Our philosophy",
  headline: "We inject like clinicians, not injectors.",
  body: "Anatomy first, dose second, photo documentation always. Conservative philosophy — you will look like you, rested.",
  bullets: [
    "We say no if labs, meds, or skin barrier say no.",
    "Aftercare is written, printed, and reviewed — not verbal.",
    "We curated the InMode Trifecta + Lumecca because they have peer-reviewed data and long-term safety.",
  ],
} as const;

export const LUXURY_SERVICES: {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  downtime?: string;
  image?: string;
  href: string;
}[] = [
  {
    id: "botox",
    title: "Botox® Cosmetic",
    subtitle: "Wrinkle relaxer",
    description:
      "Precise neuromodulator placement for natural movement. Anatomy mapping, dose rationale, photo documentation.",
    href: "/services/botox",
  },
  {
    id: "dysport",
    title: "Dysport®",
    subtitle: "Wrinkle relaxer",
    description:
      "Faster onset, natural spread. Great for forehead and crow's feet.",
    href: "/services/dysport",
  },
  {
    id: "fillers",
    title: "Dermal Fillers",
    subtitle: "Volume restoration",
    description:
      "Hyaluronic acid fillers for lips, cheeks, jawline. Conservative approach — you will look like you.",
    href: "/services/dermal-fillers",
  },
  {
    id: "morpheus8",
    title: "RF Microneedling",
    subtitle: "Morpheus8 · InMode",
    description:
      "Deeper remodeling for face, neck, body. Dual-depth radiofrequency + microneedling.",
    downtime: "2-4 day redness",
    href: "/services/morpheus8",
  },
  {
    id: "solaria",
    title: "Fractional Resurfacing",
    subtitle: "Solaria CO₂",
    description:
      "For texture, tone, acne scars, fine lines. Ablative precision with medical aftercare.",
    downtime: "5-7 day downtime",
    href: "/services/solaria-co2",
  },
  {
    id: "lumecca",
    title: "Lumecca IPL",
    subtitle: "Face / hands / chest",
    description:
      "Sun damage, age spots, redness, rosacea vessels. High-peak IPL, fewer sessions.",
    downtime: "24-48h pigment darkening",
    href: "/services/lumecca",
  },
  {
    id: "morpheus8-body",
    title: "Tighten + Debulk",
    subtitle: "Morpheus8 Body",
    description:
      "Fat reduction + skin tightening without surgery. For lower face, bra fat, knees.",
    href: "/services/morpheus8-body",
  },
  {
    id: "weight-loss",
    title: "Weight Loss",
    subtitle: "Tirzepatide / Semaglutide",
    description:
      "Medical weight loss with GLP-1 medications. Screening required. Delivered to your door.",
    href: "/rx/weight-loss",
  },
];

export const LUXURY_OWNER = {
  eyebrow: "Meet the owner",
  name: "Danielle Alcala-Glazier",
  credentials: "Licensed · 10+ Years · RN Student Waubonsee",
  headline: "10+ Year Owner",
  body: "Owner on site. I built Hello Gorgeous to be the practice I wanted as a patient — safety first, results second, never oversold.",
  image: "/images/team/danielle-owner-portrait.jpg",
} as const;

export const LUXURY_MD = {
  eyebrow: "Medical Director",
  name: "Dr. Mukesh Arora, MD",
  credentials: "Internal Medicine · 30+ Years",
  body: "Board-certified physician oversight. Every treatment protocol is physician-approved.",
  image: "/images/team/dr-arora-portrait.jpg",
} as const;

export const LUXURY_REGEN = {
  eyebrow: "Hello Gorgeous RX",
  headline: "Weight Loss + REGEN RX",
  subhead: "Delivered to your door.",
  body: "Tirzepatide, semaglutide, peptides, hormone support — screened and shipped by licensed Illinois clinicians.",
  cta: "Start REGEN RX Request",
  ctaHref: "/rx/request",
  exploreHref: "/rx",
  exploreLabel: "Explore REGEN RX",
  promo: "20% off first REGEN RX medication order",
  legal: "Illinois patients 21+ · Licensed clinician decides",
} as const;

export const LUXURY_FAQ: { q: string; a: string }[] = [
  {
    q: "Are consultations really free?",
    a: "Yes — free consults, actually free. No deposit, no catch. Medical screening is required before any treatment.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes — we offer Cherry and CareCredit for device packages. REGEN RX uses Charm for invoicing. Ask during your free consult for options.",
  },
  {
    q: "What is your philosophy on Botox & filler?",
    a: "We inject like clinicians, not injectors. Anatomy first, dose second, photo documentation always. Conservative philosophy — you will look like you, rested.",
  },
  {
    q: "Why don't you offer every trending treatment?",
    a: "We curated the InMode Trifecta + Lumecca because they have peer-reviewed data and long-term safety. We don't add a menu item because it's trending on TikTok.",
  },
  {
    q: "Who performs injections and advanced treatments?",
    a: "Licensed Illinois clinicians only. Owner on site. Medical Director Dr. Arora, MD provides physician oversight.",
  },
  {
    q: "Where are you located and is parking free?",
    a: "74 W Washington St, downtown Oswego IL 60543. Free street + lot parking. Free consult.",
  },
];

export const LUXURY_CONTACT = {
  phone: "630-636-6193",
  phoneHref: "tel:6306366193",
  regenPhone: "833-474-3998",
  regenPhoneHref: "tel:8334743998",
  address: "74 W Washington St, Oswego IL 60543",
  addressHref: "https://maps.google.com/?q=74+W+Washington+St+Oswego+IL+60543",
  hours: [
    { day: "Mon–Fri", time: "By appointment" },
    { day: "Sat", time: "10am–5pm" },
    { day: "Sun", time: "Closed" },
  ],
  parking: "Free street + lot · Downtown Oswego",
} as const;

export const LUXURY_FOOTER_LEGAL = {
  screening: "Screening Required · Results Vary · IL Licensed",
  privacy: "Notice of Privacy Practices",
  terms: "Terms · Illinois 21+ Only",
} as const;
