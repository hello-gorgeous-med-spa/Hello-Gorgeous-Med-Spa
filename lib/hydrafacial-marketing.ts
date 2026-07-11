/**
 * HydraFacial — shared marketing content.
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

export const HYDRAFACIAL_PATH = "/hydrafacial-oswego-il" as const;

export const HYDRAFACIAL_MARKETING = {
  name: "HydraFacial",
  eyebrow: "Medical-grade facial · Zero downtime",
  tagline: "Cleanse. Extract. Hydrate. Glow.",
  subhead:
    "Medical-grade HydraFacial with optional dermaplaning at Hello Gorgeous Med Spa. Immediate glow, all skin types, no recovery time.",
  trustLine: `${PRIMARY_BOOKING_CTA.label} · Glow Facial Membership from $99/month`,
  phoneDisplay: "(630) 636-6193",
  phoneHref: "tel:6306366193",
  bookHref: PRIMARY_BOOKING_CTA.href,
  appHref: "/app",
  /** Animated Science Visuals (2) — hero */
  scienceVideo: "/videos/hydrafacial/animated-science-visuals-hydrafacial.mp4",
  poster: "/images/specials/hydrafacial-99-glow-up.png",
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

export const HYDRAFACIAL_TREATS = [
  { concern: "Dull, Dehydrated Skin", desc: "Instantly hydrate and brighten for a lit-from-within glow." },
  { concern: "Enlarged Pores", desc: "Deep-cleanse and extract pore congestion, visibly refining texture." },
  { concern: "Fine Lines", desc: "Plump and smooth early signs of aging with peptide serums." },
  { concern: "Uneven Skin Tone", desc: "Brighten sun spots, redness, and hyperpigmentation over time." },
  { concern: "Oily / Acne-Prone Skin", desc: "Balance oil production and clear breakouts without irritation." },
  { concern: "Rough Texture", desc: "Exfoliate dead skin cells for silky smooth, radiant skin." },
  { concern: "Sensitive Skin", desc: "Gentle enough for rosacea and reactive skin types." },
  { concern: "Peach Fuzz", desc: "Add dermaplaning to remove vellus hair and amplify serum absorption." },
] as const;

export const HYDRAFACIAL_FAQS = [
  {
    question: "Where can I get a HydraFacial in Oswego, IL?",
    answer:
      "Hello Gorgeous Med Spa at 74 W. Washington Street in Oswego offers HydraFacial treatments with optional dermaplaning. We also offer our Glow Facial Membership at $99/month for regular clients.",
  },
  {
    question: "What is a HydraFacial?",
    answer:
      "HydraFacial is a medical-grade facial treatment that cleanses, exfoliates, extracts impurities, and infuses hydrating serums in one session. It's suitable for all skin types and delivers immediate, visible results with zero downtime.",
  },
  {
    question: "What is dermaplaning and can it be added to my HydraFacial?",
    answer:
      "Dermaplaning is a gentle exfoliation treatment using a surgical blade to remove dead skin cells and peach fuzz, leaving skin silky smooth. When combined with HydraFacial, serums penetrate deeper for enhanced results.",
  },
  {
    question: "What is the Glow Facial Membership at Hello Gorgeous?",
    answer:
      "Our Glow Facial Membership is $99/month and includes 1 HydraFacial with dermaplaning + 1 biotin injection per month. Unused facial credit rolls over so you can apply it toward more advanced treatments anytime.",
  },
  {
    question: "How often should I get a HydraFacial?",
    answer:
      "Monthly treatments are ideal for maintaining results. Our $99/month Glow Facial Membership makes this easy and affordable.",
  },
  {
    question: "Is there downtime after a HydraFacial?",
    answer:
      "No downtime! Your skin may be slightly pink for a few hours but you can return to normal activities immediately. Most clients walk out visibly glowing.",
  },
] as const;
