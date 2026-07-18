import type { InModeTreatmentLandingContent } from "@/lib/inmode-treatment-landing";
import { NEUROTOXIN_AREA_CARDS, NEUROTOXIN_TRUST } from "@/lib/neurotoxin-treatment-areas";

export const JEUVEAU_TREATMENT_LANDING: InModeTreatmentLandingContent = {
  slug: "jeuveau-oswego",
  path: "/jeuveau-oswego",
  metaTitle: "Jeuveau in Oswego, IL — $11/unit",
  metaDescription:
    "Jeuveau in Oswego from $11/unit. The newer, often-preferred alternative to Botox. NP-supervised, same-day available. Free consultations.",
  breadcrumbName: "Jeuveau Oswego",
  locality: "Jeuveau in Oswego, Illinois",
  productName: "Jeuveau",
  heroSubhead:
    "The modern neuromodulator option — natural smoothing at our most accessible per-unit price, placed by medical injectors.",
  heroImage: "/images/hg-botox-face-neck.webp",
  heroImageAlt: "Natural-looking Jeuveau results — Hello Gorgeous Med Spa Oswego IL",
  priceLine: "$11/unit",
  priceNote:
    "Dosing roughly 1:1 with Botox — often a lower total per visit at our pricing. You approve units before we inject.",
  trustItems: [...NEUROTOXIN_TRUST],
  whatTitle: "About Jeuveau at Hello Gorgeous",
  whatBody: [
    "Jeuveau is the newest of the three major neuromodulators we offer — FDA-approved in 2019 and often called “millennial Botox.” It works the same way: temporarily relaxing expression muscles so lines soften.",
    "Its manufacturing and purification differ slightly from Botox and Dysport. Some clients prefer how it feels, how it kicks in, or how it lasts. At $11/unit with Botox-like dosing, it’s also our most accessible per-unit option.",
  ],
  treatsIntro: "Jeuveau helps:",
  treats: [
    "Smooth fine lines and wrinkles",
    "Prevent new expression lines",
    "Maintain natural facial movement",
    "Forehead, 11s, and crow’s feet refinement",
    "A modern alternative if you’ve used Botox for years",
    "Deliver refreshed results within days",
  ],
  areaCardsTitle: "Areas we treat with Jeuveau",
  areaCardsIntro:
    "Same treatment map as our other neuromodulators — customized to your goals and muscle pattern at consult.",
  areaCards: NEUROTOXIN_AREA_CARDS,
  howTitle: "How Jeuveau works",
  howBody:
    "Jeuveau is botulinum toxin type A — the same molecule family as Botox and Dysport. It blocks the nerve signal that tells specific facial muscles to contract. When those muscles relax, lines soften while you still look like you.",
  howBullets: [
    "FDA-approved since 2019",
    "Dosing similar to Botox (roughly 1:1)",
    "Some clients prefer onset and feel",
    "Lasts about 3–4 months for most clients",
  ],
  before:
    "Avoid alcohol for 24 hours if bruise-prone. Arrive with clean skin. Tell us what you’ve tried before — Botox, Dysport, or neither — so we can recommend the best fit.",
  during:
    "Consult + mapping in motion, then 5–10 minutes of injections. Fine needle, small pinch. Ice or topical numbing available.",
  after:
    "Stay upright 4 hours. No exercise, lying flat, or heavy facial products that day. Complimentary day-14 assessment with touch-up if needed.",
  careGuideHref: "/pre-post-care/botox",
  faqs: [
    {
      q: "Why is Jeuveau cheaper than Botox per unit?",
      a: "Jeuveau’s manufacturer prices more competitively. It’s fully FDA-approved with potency roughly equivalent to Botox unit-for-unit — the lower price isn’t a quality shortcut.",
    },
    {
      q: "How is Jeuveau different from Botox?",
      a: "Same drug family, different purification/formulation. Some clients report a slightly more natural feel or marginally faster onset. What matters most is which your body responds to best.",
    },
    {
      q: "How long does Jeuveau last?",
      a: "About 3–4 months for most clients — similar to Botox.",
    },
    {
      q: "Can I switch between Botox, Dysport, and Jeuveau?",
      a: "Yes. We usually wait until your previous treatment has worn off so we can assess baseline muscle activity accurately.",
    },
    {
      q: "Is Jeuveau safe?",
      a: "Yes — FDA-approved since 2019 with a safety profile comparable to Botox and Dysport when injected by a licensed provider with authentic product.",
    },
    {
      q: "Should I try Jeuveau if I’ve used Botox for years?",
      a: "Worth a conversation. Occasional long-time users notice diminished response; switching brands can help. We’ll review your history at consult.",
    },
  ],
  consultTitle: "Curious about Jeuveau?",
  consultBody:
    "Book a free consultation. We’ll talk through what you’ve tried, what worked, and whether Jeuveau, Botox, or Dysport is the right next step — with clear pricing before we inject.",
  related: [
    {
      href: "/botox-oswego",
      eyebrow: "Neurotoxin",
      title: "Botox Cosmetic",
      blurb: "As low as $9/unit — authentic Allergan, natural placement.",
    },
    {
      href: "/dysport-oswego",
      eyebrow: "Neurotoxin",
      title: "Dysport",
      blurb: "$14/unit — often great for larger forehead zones.",
    },
    {
      href: "/botox-vs-dysport-vs-jeuveau",
      eyebrow: "Compare",
      title: "Botox vs Dysport vs Jeuveau",
      blurb: "Side-by-side guide before your consult.",
    },
  ],
};
