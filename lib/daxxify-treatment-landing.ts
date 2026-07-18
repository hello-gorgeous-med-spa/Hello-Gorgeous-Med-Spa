import type { InModeTreatmentLandingContent } from "@/lib/inmode-treatment-landing";
import { NEUROTOXIN_AREA_CARDS, NEUROTOXIN_TRUST } from "@/lib/neurotoxin-treatment-areas";

export const DAXXIFY_TREATMENT_LANDING: InModeTreatmentLandingContent = {
  slug: "daxxify-oswego",
  path: "/daxxify-oswego",
  metaTitle: "Daxxify in Oswego, IL | Longest-Lasting Neurotoxin",
  metaDescription:
    "Daxxify in Oswego — peptide-powered neuromodulator with longer-lasting results for many clients. NP-supervised. Free consult.",
  breadcrumbName: "Daxxify Oswego",
  locality: "Daxxify in Oswego, Illinois",
  productName: "Daxxify",
  heroSubhead:
    "The longest-lasting neuromodulator option on our menu — smooth lines with fewer touch-up cycles when it’s the right fit.",
  heroImage: "/images/injectables/hero-chin-glove.png",
  heroImageAlt:
    "Medical aesthetics consult — Daxxify at Hello Gorgeous Med Spa Oswego IL",
  heroObjectPosition: "object-[center_40%]",
  heroPortraitFocus: true,
  priceLine: "Priced at consult",
  priceNote: "Longest-lasting neurotoxin option — custom plan before we inject.",
  trustItems: [...NEUROTOXIN_TRUST],
  whatTitle: "About Daxxify at Hello Gorgeous",
  whatBody: [
    "Daxxify is an FDA-approved peptide-powered neuromodulator designed for longer duration than traditional toxins for many patients.",
    "It’s one of five brands we offer. At consult we’ll tell you honestly whether Daxxify, Botox, Dysport, Jeuveau, or Xeomin is the smarter investment for your goals and calendar.",
  ],
  treatsIntro: "Daxxify helps:",
  treats: [
    "Smooth forehead lines, 11s, and crow’s feet",
    "Extend time between visits for many clients",
    "Maintain natural expression with careful dosing",
    "Support busy schedules that prefer fewer appointments",
  ],
  areaCardsTitle: "Areas we treat with Daxxify",
  areaCardsIntro: "Mapped like our other neuromodulators — customized at your free consult.",
  areaCards: NEUROTOXIN_AREA_CARDS,
  howTitle: "How Daxxify works",
  howBody:
    "Daxxify relaxes targeted expression muscles with a peptide formulation engineered for longer-lasting effect. Results still look natural when dosing is conservative.",
  howBullets: [
    "FDA-approved peptide-powered toxin",
    "Often longer duration than classic brands",
    "Results build over several days",
    "Ideal when fewer touch-ups matter",
  ],
  before:
    "Avoid alcohol for 24 hours when possible. Bring your neuromodulator history — prior brands and how long they lasted for you.",
  during:
    "Free consult first. We map units, quote pricing, and inject only after you approve the plan.",
  after:
    "Stay upright 4 hours. Skip heavy workouts that day. We’ll schedule follow-up based on how you respond.",
  careGuideHref: "/pre-post-care/botox",
  faqs: [
    {
      q: "How long does Daxxify last?",
      a: "Many clients see longer duration than classic neurotoxins — sometimes approaching 6 months. Individual results vary; we set expectations at consult based on your history.",
    },
    {
      q: "Is Daxxify more expensive?",
      a: "It’s priced at consult. Longer duration can mean fewer visits per year — we’ll help you compare total cost versus Botox or Dysport.",
    },
    {
      q: "Who is a good candidate?",
      a: "Clients who want fewer touch-up cycles and have responded well to neuromodulators. First-timers may start with a classic brand so we learn your dosing map.",
    },
    {
      q: "Will I look frozen?",
      a: "Not with thoughtful dosing. Longevity doesn’t mean over-treatment — we still preserve natural movement.",
    },
  ],
  consultTitle: "Is Daxxify right for you?",
  consultBody:
    "Book a free consultation. We’ll compare duration, cost, and feel across all five brands — then recommend what’s worth it for you.",
  related: [
    {
      href: "/botox-oswego",
      eyebrow: "Neurotoxin",
      title: "Botox Cosmetic",
      blurb: "From $10/unit — our most requested brand.",
    },
    {
      href: "/xeomin-oswego",
      eyebrow: "Neurotoxin",
      title: "Xeomin",
      blurb: "Purified option — priced at consult.",
    },
    {
      href: "/services/injectables",
      eyebrow: "Hub",
      title: "Botox & Fillers",
      blurb: "Full injectables menu, clinic video, and treatment goals.",
    },
  ],
};