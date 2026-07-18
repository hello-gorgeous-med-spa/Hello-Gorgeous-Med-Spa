import type { InModeTreatmentLandingContent } from "@/lib/inmode-treatment-landing";
import { NEUROTOXIN_AREA_CARDS, NEUROTOXIN_TRUST } from "@/lib/neurotoxin-treatment-areas";

export const DYSPORT_TREATMENT_LANDING: InModeTreatmentLandingContent = {
  slug: "dysport-oswego",
  path: "/dysport-oswego",
  metaTitle: "Dysport in Oswego, IL — $14/unit",
  metaDescription:
    "Dysport in Oswego from $14/unit. NP-supervised, same-day available. Often spreads more evenly than Botox for larger areas. Free consultations.",
  breadcrumbName: "Dysport Oswego",
  locality: "Dysport in Oswego, Illinois",
  productName: "Dysport",
  heroSubhead:
    "Botox’s faster cousin — often the right call for forehead and larger zones, with published per-unit pricing and natural results.",
  heroImage: "/images/botox/botox-hero-glow.jpg",
  heroImageAlt:
    "Glowing, smooth skin — natural Dysport results aesthetic at Hello Gorgeous Med Spa Oswego IL",
  heroObjectPosition: "object-[center_42%]",
  heroPortraitFocus: true,
  priceLine: "$14/unit",
  priceNote:
    "Typically 2–3 Dysport units ≈ 1 Botox unit — total area cost often similar. You approve units before we inject.",
  trustItems: [...NEUROTOXIN_TRUST],
  whatTitle: "About Dysport at Hello Gorgeous",
  whatBody: [
    "Dysport is a neuromodulator in the same family as Botox — it temporarily relaxes the muscles that cause expression lines so the skin above them smooths out.",
    "The differences are subtle but real: Dysport often kicks in a day or two faster, and tends to spread slightly more from each injection point — which can make it ideal for larger areas like the forehead. We carry Botox, Dysport, and Jeuveau so you get the right tool for your face.",
  ],
  treatsIntro: "Dysport helps:",
  treats: [
    "Smooth fine lines and wrinkles",
    "Diffuse forehead softening",
    "Faster onset for many clients (often 5–7 days to full effect)",
    "Maintain natural facial movement",
    "Prevent new expression lines with consistent care",
    "Deliver refreshed results without a frozen look",
  ],
  areaCardsTitle: "Areas we treat with Dysport",
  areaCardsIntro:
    "Especially popular for the forehead, where a slightly wider spread pattern can work in your favor. We’ll map what’s right at your consult.",
  areaCards: NEUROTOXIN_AREA_CARDS,
  howTitle: "How Dysport works",
  howBody:
    "Dysport blocks nerve signals to targeted facial muscles — the same family of treatment as Botox, with a formulation that spreads a bit more from the injection point. When those muscles relax, lines soften while your expressions stay yours.",
  howBullets: [
    "Same neuromodulator family as Botox",
    "Often preferred for larger zones like forehead",
    "Full effect typically in 5–7 days",
    "Lasts about 3–4 months for most clients",
  ],
  before:
    "Avoid alcohol for 24 hours to reduce bruising. Arrive with clean skin. Share your neuromodulator history so we can decide whether Dysport, Botox, or Jeuveau fits best.",
  during:
    "Free consult first — we watch your face in motion. Injections take about 5–10 minutes. Fine needle, small pinch at each site. Topical numbing available if you prefer.",
  after:
    "Stay upright 4 hours. Skip workouts, lying flat, and heavy makeup that day. Complimentary follow-up around day 7–14 with touch-up per policy when needed.",
  careGuideHref: "/pre-post-care/botox",
  faqs: [
    {
      q: "What’s the difference between Dysport and Botox?",
      a: "Same family, slightly different formulation. Dysport often kicks in 1–2 days faster and spreads slightly more — great for diffuse forehead smoothing. For very targeted deep 11s, Botox may feel more precise. We carry both and help you choose.",
    },
    {
      q: "How is Dysport priced?",
      a: "$14 per unit. Doses run higher than Botox (typically 2–3 Dysport units ≈ 1 Botox unit), so total cost per area is often similar. We calculate your full cost at consult.",
    },
    {
      q: "How long does Dysport last?",
      a: "About 3–4 months for most clients — similar to Botox. Individual metabolism matters more than the brand.",
    },
    {
      q: "Will I look frozen?",
      a: "Not with conservative dosing. Frozen looks come from over-treatment, not from choosing Dysport. We dose thoughtfully and offer a touch-up window.",
    },
    {
      q: "Can I switch from Botox to Dysport?",
      a: "Yes. We usually wait until prior Botox has worn off (~3–4 months) so we can assess baseline muscle activity accurately.",
    },
    {
      q: "Is Dysport safe?",
      a: "Yes — FDA-approved for cosmetic use since 2009. Same risk profile as Botox when injected by a licensed provider with authentic product.",
    },
  ],
  consultTitle: "Is Dysport or Botox right for you?",
  consultBody:
    "Book a free consultation. We’ll see your face in motion and tell you honestly which neuromodulator fits your goals — with clear unit pricing before anything begins.",
  related: [
    {
      href: "/botox-oswego",
      eyebrow: "Neurotoxin",
      title: "Botox Cosmetic",
      blurb: "The original — from $10/unit. Precise placement for natural results.",
    },
    {
      href: "/jeuveau-oswego",
      eyebrow: "Neurotoxin",
      title: "Jeuveau",
      blurb: "Newer option at $11/unit — dosing similar to Botox.",
    },
    {
      href: "/botox-vs-dysport-vs-jeuveau",
      eyebrow: "Compare",
      title: "Botox vs Dysport vs Jeuveau",
      blurb: "Side-by-side guide to help you choose before your consult.",
    },
  ],
};
