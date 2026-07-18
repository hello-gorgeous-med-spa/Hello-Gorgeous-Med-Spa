import type { InModeTreatmentLandingContent } from "@/lib/inmode-treatment-landing";
import { NEUROTOXIN_AREA_CARDS, NEUROTOXIN_TRUST } from "@/lib/neurotoxin-treatment-areas";

export const XEOMIN_TREATMENT_LANDING: InModeTreatmentLandingContent = {
  slug: "xeomin-oswego",
  path: "/xeomin-oswego",
  metaTitle: "Xeomin in Oswego, IL | Hello Gorgeous Med Spa",
  metaDescription:
    "Xeomin in Oswego — purified “naked” neurotoxin for natural smoothing. NP-supervised. Free consult — Naperville & Aurora.",
  breadcrumbName: "Xeomin Oswego",
  locality: "Xeomin in Oswego, Illinois",
  productName: "Xeomin",
  heroSubhead:
    "A purified neuromodulator option — natural smoothing with medical injectors who map every unit to your face in motion.",
  heroImage: "/images/injectables/hero-glam-portrait.png",
  heroImageAlt:
    "Smooth, glowing skin — Xeomin aesthetic results at Hello Gorgeous Med Spa Oswego IL",
  heroObjectPosition: "object-[center_35%]",
  heroPortraitFocus: true,
  priceLine: "Priced at consult",
  priceNote: "Custom units mapped to your goals — you approve dosing before we inject.",
  trustItems: [...NEUROTOXIN_TRUST],
  whatTitle: "About Xeomin at Hello Gorgeous",
  whatBody: [
    "Xeomin is an FDA-approved neuromodulator that softens expression lines by relaxing targeted facial muscles — similar family to Botox, with a uniquely purified formulation.",
    "Some clients prefer Xeomin when they want a “naked” toxin option. At Hello Gorgeous we carry all five brands so we can match product to your anatomy and history — not a one-size menu.",
  ],
  treatsIntro: "Xeomin helps:",
  treats: [
    "Smooth forehead lines, 11s, and crow’s feet",
    "Maintain natural facial movement",
    "Offer a purified formulation option",
    "Support preventative “baby tox” plans",
    "Complement filler and skin-tightening care",
  ],
  areaCardsTitle: "Areas we treat with Xeomin",
  areaCardsIntro:
    "Same treatment map as our other neuromodulators — customized at your free consult.",
  areaCards: NEUROTOXIN_AREA_CARDS,
  howTitle: "How Xeomin works",
  howBody:
    "Xeomin blocks nerve signals to targeted muscles. When those muscles rest, overlying lines soften while your expressions stay yours.",
  howBullets: [
    "FDA-approved neuromodulator",
    "Purified formulation",
    "Results typically build over several days",
    "Lasts about 3–4 months for most clients",
  ],
  before:
    "Avoid alcohol for 24 hours when possible. Arrive with clean skin. Share any prior neuromodulator brand and response so we can dose thoughtfully.",
  during:
    "Free consult first. Injections take about 5–10 minutes with a fine needle. You approve units before we start.",
  after:
    "Stay upright 4 hours. Skip heavy workouts that day. Follow-up window around day 7–14 when a touch-up is appropriate.",
  careGuideHref: "/pre-post-care/botox",
  faqs: [
    {
      q: "How is Xeomin different from Botox?",
      a: "Same treatment family — temporarily relaxing expression muscles. Xeomin’s formulation is uniquely purified. We’ll help you choose based on goals, history, and how your muscles respond.",
    },
    {
      q: "How much does Xeomin cost?",
      a: "Priced at consult after we map units to your face. We publish Botox, Dysport, and Jeuveau unit prices on our menu; Xeomin is quoted honestly before treatment.",
    },
    {
      q: "Will I look frozen?",
      a: "Not with conservative dosing. We preserve natural movement and offer a touch-up window when clinically appropriate.",
    },
    {
      q: "Can I switch from Botox to Xeomin?",
      a: "Yes. We usually wait until prior toxin has worn off so we can assess baseline muscle activity accurately.",
    },
  ],
  consultTitle: "Is Xeomin right for you?",
  consultBody:
    "Book a free consultation. We’ll compare Xeomin with Botox, Dysport, Jeuveau, and Daxxify — and recommend the best fit for your face.",
  related: [
    {
      href: "/botox-oswego",
      eyebrow: "Neurotoxin",
      title: "Botox Cosmetic",
      blurb: "From $10/unit — precise placement for natural results.",
    },
    {
      href: "/daxxify-oswego",
      eyebrow: "Neurotoxin",
      title: "Daxxify",
      blurb: "Longest-lasting option — ask at consult.",
    },
    {
      href: "/services/injectables",
      eyebrow: "Hub",
      title: "Botox & Fillers",
      blurb: "Full injectables menu, clinic video, and treatment goals.",
    },
  ],
};
