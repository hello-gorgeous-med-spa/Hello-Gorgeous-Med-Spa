/**
 * HydraFacial / Rejuva Fresh — shared marketing content (Journey flagship).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

export const HYDRAFACIAL_PATH = "/hydrafacial-oswego-il" as const;

export const HYDRAFACIAL_IMAGES = {
  device: "/images/hydrafacial/rejuva-fresh-hydra-spa-device.jpg",
  treatment: "/images/hydrafacial/rejuva-fresh-treatment-chair.jpg",
  poster: "/images/hydrafacial/rejuva-fresh-treatment-chair.jpg",
} as const;

export const HYDRAFACIAL_MARKETING = {
  name: "HydraFacial",
  eyebrow: "Rejuva Fresh Hydra Spa Infusion · Oswego",
  tagline: "Cleanse. Extract. Infuse. Glow.",
  subhead:
    "Medical-grade hydro-dermabrasion on our Rejuva Fresh Hydra Spa Infusion platform — vortex cleanse, oxygen infusion, and customizable premium modalities in one glow session.",
  trustLine: `${PRIMARY_BOOKING_CTA.label} · Marissa’s Glow Special $129`,
  phoneDisplay: "(630) 636-6193",
  phoneHref: "tel:6306366193",
  bookHref: PRIMARY_BOOKING_CTA.href,
  appHref: "/app",
  scienceVideo: "/videos/hydrafacial/animated-science-visuals-hydrafacial.mp4",
  poster: HYDRAFACIAL_IMAGES.poster,
} as const;

export const HYDRAFACIAL_NAV = [
  { href: "#technology", label: "Technology" },
  { href: "#special", label: "$129 Special" },
  { href: "#add-ons", label: "Add-ons" },
  { href: "#artist", label: "Marissa" },
  { href: "#treats", label: "Results" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

/** Marissa Murray Glow Special — HydraFacial + dermaplaning + O2 + 2 add-ons */
export const HYDRAFACIAL_MARISSA_SPECIAL = {
  badge: "Book with Marissa",
  title: "HydraFacial + Dermaplaning Glow Special",
  price: "$129",
  priceNote: "limited-time",
  duration: "60–75 min",
  includes: [
    "Full Rejuva Fresh HydraFacial (vortex cleanse · extract · serum infusion)",
    "Dermaplaning for peach-fuzz removal + smoother serum absorption",
    "Hydrogen-oxygen spray included",
    "Choose any 2 premium machine add-ons (see list below)",
  ],
  note: "Performed by Marissa Murray, licensed esthetician. Mention the $129 Glow Special when you book.",
  ctaLabel: "Book Marissa’s $129 special",
  bookHref: `${PRIMARY_BOOKING_CTA.href}${PRIMARY_BOOKING_CTA.href.includes("?") ? "&" : "?"}ref=hydrafacial_129_marissa`,
} as const;

export const HYDRAFACIAL_MEMBERSHIP = {
  badge: "Glow Facial Membership",
  price: "$99",
  priceNote: "/ month",
  perks: [
    "1 HydraFacial + Dermaplaning/month",
    "1 Biotin injection/month",
    "Rollover facial credit",
    "Apply credit to upgrade treatments",
    "App-exclusive member perks",
  ],
  ctaLabel: "Join in the App",
} as const;

/**
 * Rejuva Fresh Hydra Spa Infusion — client-facing technology story.
 * Platform is a multi-modality hydro facial system (vortex fusion + premium handpieces).
 */
export const HYDRAFACIAL_TECH_STEPS = [
  {
    step: "01",
    title: "Vortex cleanse & extract",
    desc: "Aqua hydro-dermabrasion gently exfoliates while vacuum fusion lifts congestion from pores — deep clean without harsh scrubbing.",
  },
  {
    step: "02",
    title: "Serum infusion",
    desc: "Targeted nutrient solutions hydrate, brighten, and calm as the tip passes — customized to your skin’s needs that day.",
  },
  {
    step: "03",
    title: "Oxygen & premium modalities",
    desc: "Hydrogen-oxygen spray plus your choice of premium handpieces (RF, LED, high frequency, cold hammer, and more) finish the glow.",
  },
] as const;

/** Premium add-ons available on the Rejuva Fresh machine — clients pick 2 with the $129 special */
export const HYDRAFACIAL_PREMIUM_ADDONS = [
  {
    name: "High Frequency",
    desc: "Antibacterial ozone glow — great for congestion-prone or breakout-prone skin.",
  },
  {
    name: "Cold Hammer",
    desc: "Calms redness, tightens the look of pores, and seals in serums after extraction.",
  },
  {
    name: "Ultrasonic Scrubber",
    desc: "Sonic spatula lift for stubborn residue and a polished, glass-skin finish.",
  },
  {
    name: "Bipolar RF",
    desc: "Radiofrequency warmth to support firmness and a lifted, sculpted feel.",
  },
  {
    name: "LED Therapy Mask",
    desc: "Light therapy to calm, brighten, or revitalize — matched to your skin goals.",
  },
  {
    name: "Microcurrent / V-Lift",
    desc: "Gentle facial toning for jawline definition and a refreshed contour.",
  },
  {
    name: "Facial Ultrasound",
    desc: "Deep product push for hydration and plumper-looking skin.",
  },
  {
    name: "Oxygen Bubble Pen",
    desc: "Extra oxygen renewal for dull, stressed, or travel-tired skin.",
  },
] as const;

export const HYDRAFACIAL_PLATFORM = {
  brand: "Rejuva Fresh",
  product: "Hydra Spa Infusion",
  headline: "Not a basic spa facial — a multi-modality glow platform",
  body: "Our HydraFacial-style treatments run on the Rejuva Fresh Hydra Spa Infusion system: vortex hydro-dermabrasion for cleanse and extract, hydrogen-oxygen spray for radiance, plus a full suite of premium handpieces so Marissa can customize every visit — not a one-size-fits-all protocol.",
  highlights: [
    "Vortex aqua hydro-dermabrasion",
    "Hydrogen-oxygen spray",
    "Serum canister infusion (A–D solutions)",
    "18+ clinical handpiece modalities",
    "Zero downtime · walk-out glow",
  ],
} as const;

export const HYDRAFACIAL_ARTIST = {
  name: "Marissa Murray",
  role: "Licensed Esthetician · Facial & Lash Artist",
  image: "/images/team/marissa-murray-2026.jpg",
  quote: "Every client deserves to feel heard — never rushed, and never pressured.",
  bio: "Marissa customizes your Rejuva Fresh HydraFacial around your skin goals — dermaplaning, oxygen spray, and the two premium add-ons that make the most sense for you that day. Thoughtful, results-driven, and never a cookie-cutter facial.",
} as const;

export const HYDRAFACIAL_TREATS = [
  { concern: "Dull, Dehydrated Skin", desc: "Instantly hydrate and brighten for a lit-from-within glow." },
  { concern: "Enlarged Pores", desc: "Deep-cleanse and extract pore congestion, visibly refining texture." },
  { concern: "Fine Lines", desc: "Plump and smooth early signs of aging with peptide serums." },
  { concern: "Uneven Skin Tone", desc: "Brighten sun spots, redness, and hyperpigmentation over time." },
  { concern: "Oily / Acne-Prone Skin", desc: "Balance oil and clear congestion — high frequency is a favorite add-on." },
  { concern: "Rough Texture", desc: "Exfoliate dead skin for silky smooth, radiant skin." },
  { concern: "Sensitive Skin", desc: "Gentle enough for reactive skin — cold hammer helps calm." },
  { concern: "Peach Fuzz", desc: "Dermaplaning removes vellus hair and amplifies serum absorption." },
] as const;

export const HYDRAFACIAL_PRICING = [
  {
    name: "Marissa’s Glow Special",
    price: "$129",
    note: "HydraFacial + dermaplaning + O₂ + 2 add-ons",
    href: HYDRAFACIAL_MARISSA_SPECIAL.bookHref,
    featured: true,
  },
  {
    name: "Standard HydraFacial",
    price: "$199",
    note: "Vortex cleanse · extract · hydrate",
    href: PRIMARY_BOOKING_CTA.href,
  },
  {
    name: "HydraFacial + Dermaplaning",
    price: "Menu",
    note: "Ask for current à la carte pricing",
    href: PRIMARY_BOOKING_CTA.href,
  },
  {
    name: "Glow Facial Membership",
    price: "$99/mo",
    note: "1 Hydra + dermaplaning + biotin shot",
    href: "/monthly-memberships",
  },
] as const;

export const HYDRAFACIAL_FAQS = [
  {
    question: "Where can I get a HydraFacial in Oswego, IL?",
    answer:
      "Hello Gorgeous Med Spa at 74 W. Washington Street in Oswego. Book Marissa’s $129 Glow Special (HydraFacial + dermaplaning + oxygen spray + 2 premium add-ons) or join the Glow Facial Membership at $99/month.",
  },
  {
    question: "What machine do you use for HydraFacial?",
    answer:
      "We use the Rejuva Fresh Hydra Spa Infusion platform — vortex hydro-dermabrasion, hydrogen-oxygen spray, multi-serum infusion, and premium handpieces (high frequency, cold hammer, RF, LED, ultrasonic, microcurrent, and more) so every facial can be customized.",
  },
  {
    question: "What’s included in the $129 special with Marissa?",
    answer:
      "A full HydraFacial, dermaplaning, hydrogen-oxygen spray, and your choice of any two premium machine add-ons. Book with Marissa Murray and mention the Glow Special.",
  },
  {
    question: "What premium add-ons can I choose?",
    answer:
      "High frequency, cold hammer, ultrasonic scrubber, bipolar RF, LED therapy mask, microcurrent / V-lift, facial ultrasound, or oxygen bubble pen. Marissa helps you pick the two that best match your skin goals.",
  },
  {
    question: "What is dermaplaning and why pair it with HydraFacial?",
    answer:
      "Dermaplaning uses a surgical blade to remove dead skin and peach fuzz. Paired with HydraFacial, serums absorb more evenly for a smoother, glassier finish.",
  },
  {
    question: "Is there downtime?",
    answer:
      "No downtime. Skin may look lightly flushed for a few hours. Most clients walk out glowing and camera-ready the same day.",
  },
] as const;
