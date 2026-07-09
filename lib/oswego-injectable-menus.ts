import type { ServiceMenuConfig, ServiceMenuPriceRow } from "@/lib/service-menu-types";
import { BOOKING_URL } from "@/lib/flows";
import { getServicePageOswego } from "@/lib/service-pages-oswego";

export type OswegoMenuCustom = {
  eyebrow: string;
  titleBefore: string;
  titleAccent: string;
  pricingTitle: string;
  pricingHighlights: string[];
  pricingRows: ServiceMenuPriceRow[];
  pricingBadge?: string;
  howItWorksHighlights: string[];
  howItWorksLinks: ServiceMenuPriceRow[];
  howItWorksLearnMore: string;
  careGuideHref: string;
  treatmentTime: string;
  relatedDescription: string;
  relatedHighlights: string[];
  /** Defaults to the injectables menu. */
  secondaryCta?: { label: string; href: string };
  /** Defaults to the injectables menu. */
  pricingLearnMore?: string;
  /** Overrides the standard consult/touch-up/same-day rows in section 02. */
  whyRows?: ServiceMenuPriceRow[];
  /** Overrides the injectable-flavored section 04 description. */
  whatToExpectDescription?: string;
  /** Overrides default "Book Free Consultation" hero CTA. */
  primaryCta?: { label: string; href: string };
  /** Overrides section 05 title (default: Related treatments in Oswego). */
  relatedSectionTitle?: string;
};

/** Builds the standard 5-section dark menu config from Oswego landing copy. */
export function buildOswegoMenu(slug: string, custom: OswegoMenuCustom): ServiceMenuConfig {
  const page = getServicePageOswego(slug)!;
  const secondaryCta = custom.secondaryCta ?? { label: "Full injectables menu", href: "/services/injectables" };

  return {
    path: `/${slug}`,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    hero: {
      eyebrow: custom.eyebrow,
      titleBefore: custom.titleBefore,
      titleAccent: custom.titleAccent,
      subtitle: page.valueProp,
      primaryCta: custom.primaryCta ?? {
        label: "Book Free Consultation",
        href: page.bookingUrl ?? BOOKING_URL,
      },
      secondaryCta,
    },
    sections: [
      {
        id: "pricing",
        number: "01",
        title: custom.pricingTitle,
        description: page.pricing ?? page.heroContent ?? "",
        highlights: custom.pricingHighlights,
        pricing: custom.pricingRows,
        learnMoreHref: custom.pricingLearnMore ?? secondaryCta.href,
        badge: custom.pricingBadge,
      },
      {
        id: "why",
        number: "02",
        title: `Why Hello Gorgeous for ${page.serviceName}`,
        description:
          "Family-owned, NP-directed, and here longer than most competitors have been open — same experienced hands, authentic product, honest pricing.",
        highlights: page.whyBullets,
        pricing: custom.whyRows ?? [
          { label: "Free consultation", price: "Always", note: "Every visit — no pressure to commit" },
          { label: "2-week follow-up", price: "Included", note: "Complimentary touch-up for true asymmetry" },
          { label: "Same-day appointments", price: "Often yes", note: "Call before noon — 630-636-6193" },
        ],
        learnMoreHref: "/why-choose-us",
      },
      {
        id: "how-it-works",
        number: "03",
        title: `What is ${page.serviceName}? How it works`,
        description: page.howItWorksParagraphs[0] ?? "",
        highlights: custom.howItWorksHighlights,
        pricing: custom.howItWorksLinks,
        learnMoreHref: custom.howItWorksLearnMore,
      },
      {
        id: "what-to-expect",
        number: "04",
        title: "What to expect at your appointment",
        description:
          custom.whatToExpectDescription ??
          "From free consult to 2-week follow-up — clear steps, written aftercare, and a complimentary touch-up window when clinically appropriate.",
        highlights: page.whatToExpectSteps,
        pricing: [
          { label: "Typical treatment time", price: custom.treatmentTime, note: "After consult & numbing" },
          { label: "Pre & post care guide", price: "Free", href: custom.careGuideHref },
        ],
        learnMoreHref: custom.careGuideHref,
      },
      {
        id: "related",
        number: "05",
        title: custom.relatedSectionTitle ?? "Related treatments in Oswego",
        description: custom.relatedDescription,
        highlights: custom.relatedHighlights,
        pricing: page.relatedServices.map((rel) => {
          const relPage = getServicePageOswego(rel);
          return { label: relPage?.serviceName ?? rel, price: "Learn →", href: `/${rel}` };
        }),
        learnMoreHref: secondaryCta.href,
      },
    ],
    faqs: page.faqs.map((f) => ({ question: f.q, answer: f.a })),
  };
}

export const DYSPORT_OSWEGO_MENU = buildOswegoMenu("dysport-oswego", {
  eyebrow: "Oswego, IL · Kendall County · All 5 neurotoxin brands",
  titleBefore: "Dysport in Oswego, IL —",
  titleAccent: "From $14/unit",
  pricingTitle: "Dysport pricing",
  pricingHighlights: [
    "Dysport $14/unit — published openly, no hidden fees",
    "Typically 2–3 Dysport units = 1 Botox unit",
    "Total cost per area often similar to Botox",
    "Faster onset — full effect in 5–7 days",
    "Often the best choice for forehead smoothing",
  ],
  pricingRows: [
    { label: "Dysport", price: "$14/unit", note: "Doses run 2–3× Botox units" },
    { label: "Botox", price: "$10/unit", href: "/botox-oswego" },
    { label: "Jeuveau", price: "$11/unit", href: "/jeuveau-oswego" },
    { label: "Xeomin", price: "Consult", href: "/xeomin-oswego-il" },
    { label: "Daxxify — 6-month neurotoxin", price: "Consult", href: "/daxxify-oswego-il" },
  ],
  pricingBadge: "$14/UNIT",
  howItWorksHighlights: [
    "Same mechanism as Botox — relaxes targeted muscles",
    "Spreads slightly more — great for larger zones",
    "Full effect typically 5–7 days vs 10–14 for Botox",
    "Lasts about 3–4 months for most clients",
    "FDA-approved for cosmetic use since 2009",
  ],
  howItWorksLinks: [
    { label: "Botox vs Dysport vs Jeuveau guide", price: "Compare →", href: "/botox-vs-dysport-vs-jeuveau" },
    { label: "Full injectables menu", price: "Menu →", href: "/services/injectables" },
  ],
  howItWorksLearnMore: "/botox-vs-dysport-vs-jeuveau",
  careGuideHref: "/pre-post-care/botox",
  treatmentTime: "5–10 min",
  relatedDescription:
    "We carry Botox, Dysport, AND Jeuveau — if one brand stops responding or doesn't fit your face, we switch, not upsell.",
  relatedHighlights: [
    "Botox for precise, targeted dosing",
    "Jeuveau at our most accessible per-unit price",
    "Dermal fillers for volume Botox can't reach",
    "No waiting period required between brands",
  ],
});

export const JEUVEAU_OSWEGO_MENU = buildOswegoMenu("jeuveau-oswego", {
  eyebrow: "Oswego, IL · Kendall County · All 5 neurotoxin brands",
  titleBefore: "Jeuveau in Oswego, IL —",
  titleAccent: "From $11/unit",
  pricingTitle: "Jeuveau pricing",
  pricingHighlights: [
    "Jeuveau $11/unit — our most accessible neurotoxin price",
    "Dosing roughly 1:1 with Botox",
    "Total visit cost typically lower than Botox",
    "FDA-approved 2019 — the newest of the big three",
    "No membership required for published pricing",
  ],
  pricingRows: [
    { label: "Jeuveau", price: "$11/unit", note: "Dosing ~1:1 with Botox" },
    { label: "Botox", price: "$10/unit", href: "/botox-oswego" },
    { label: "Dysport", price: "$14/unit", href: "/dysport-oswego", note: "2–3× Botox units" },
    { label: "Xeomin", price: "Consult", href: "/xeomin-oswego-il" },
    { label: "Daxxify — 6-month neurotoxin", price: "Consult", href: "/daxxify-oswego-il" },
  ],
  pricingBadge: "$11/UNIT",
  howItWorksHighlights: [
    "Botulinum toxin type A — same family as Botox & Dysport",
    "The 'millennial Botox' — first new neurotoxin in a generation",
    "Some clients prefer its onset and feel",
    "Lasts about 3–4 months for most clients",
    "Can restore response for long-time Botox users",
  ],
  howItWorksLinks: [
    { label: "Botox vs Dysport vs Jeuveau guide", price: "Compare →", href: "/botox-vs-dysport-vs-jeuveau" },
    { label: "Full injectables menu", price: "Menu →", href: "/services/injectables" },
  ],
  howItWorksLearnMore: "/botox-vs-dysport-vs-jeuveau",
  careGuideHref: "/pre-post-care/botox",
  treatmentTime: "5–10 min",
  relatedDescription:
    "Every face responds differently — we carry all five FDA-approved neurotoxins and help you find the one that fits yours.",
  relatedHighlights: [
    "Botox — the original, most studied",
    "Dysport — faster onset, great forehead spread",
    "Dermal fillers for volume neurotoxins can't reach",
    "Switching brands is easy — no waiting period",
  ],
});

export const DERMAL_FILLERS_OSWEGO_MENU = buildOswegoMenu("dermal-fillers-oswego", {
  eyebrow: "Oswego, IL · Juvederm & Restylane portfolio",
  titleBefore: "Dermal Fillers in Oswego, IL —",
  titleAccent: "From $650/syringe",
  pricingTitle: "Dermal filler pricing",
  pricingHighlights: [
    "From $650 per syringe — exact quote before we inject",
    "Cheeks · jawline · under-eye · chin · temples · smile lines",
    "Most clients use 1–2 syringes per area",
    "Full Juvederm & Restylane portfolio carried",
    "Hyaluronidase dissolver on site for safety",
  ],
  pricingRows: [
    { label: "Dermal filler (per syringe)", price: "From $650", note: "Product varies by area" },
    { label: "2-syringe package", price: "$898", note: "Save vs two singles" },
    { label: "Lip filler — 1 syringe", price: "$450", href: "/lip-filler-oswego" },
    { label: "Lip filler — 2 syringes", price: "$399 each", href: "/lip-filler-oswego" },
    { label: "Hyaluronidase (dissolver)", price: "From $250", note: "When medically appropriate" },
  ],
  pricingBadge: "PER SYRINGE",
  howItWorksHighlights: [
    "Hyaluronic acid gels — a substance your body makes naturally",
    "Immediate volume · settles over 2–4 weeks",
    "Different products for different areas — choosing right is the art",
    "Most fillers last 12–18 months",
    "Restores volume Botox can't — they solve different problems",
  ],
  howItWorksLinks: [
    { label: "Lip filler details", price: "Learn →", href: "/lip-filler-oswego" },
    { label: "Full injectables menu", price: "Menu →", href: "/services/injectables" },
  ],
  howItWorksLearnMore: "/services/injectables",
  careGuideHref: "/pre-post-care/filler",
  treatmentTime: "20–45 min",
  relatedDescription:
    "Filler restores volume; Botox softens movement; Morpheus8 tightens tissue. A full-face plan often combines tools — mapped honestly at consult.",
  relatedHighlights: [
    "Lip filler — our most-requested filler area",
    "Botox for the dynamic lines filler can't fix",
    "Morpheus8 Burst when laxity is the real issue",
    "Conservative dosing — build over time, never overfill",
  ],
});

export const LIP_FILLER_OSWEGO_MENU = buildOswegoMenu("lip-filler-oswego", {
  eyebrow: "Oswego, IL · Conservative, natural lip enhancement",
  titleBefore: "Lip Filler in Oswego, IL —",
  titleAccent: "$450 per syringe",
  pricingTitle: "Lip filler pricing",
  pricingHighlights: [
    "$450 for 1 syringe · $399 each when you book 2",
    "Half-syringe options for subtle starts",
    "Conservative dosing — never two syringes at once",
    "Numbing cream + lidocaine in the filler itself",
    "Free consultation with photos for comparison",
  ],
  pricingRows: [
    { label: "Lip filler — 1 syringe", price: "$450" },
    { label: "Lip filler — 2 syringes", price: "$399 each", note: "$798 total" },
    { label: "Half-syringe option", price: "Consult", note: "Subtle starts & maintenance" },
    { label: "Lip flip (neurotoxin)", price: "From $99", href: "/lip-flip-oswego-il", note: "~4 units" },
    { label: "Lip Studio AI preview", price: "Free", href: "/lip-studio" },
  ],
  pricingBadge: "$399–$450",
  howItWorksHighlights: [
    "HA gel adds volume, definition & shape",
    "Cupid's bow · vermillion border · symmetry work",
    "Swelling peaks 24–72 hours — final look at 2 weeks",
    "Lasts 9–15 months — lips metabolize filler faster",
    "Dissolvable with hyaluronidase if ever needed",
  ],
  howItWorksLinks: [
    { label: "Lip Studio AI preview", price: "Try →", href: "/lip-studio" },
    { label: "Full dermal fillers page", price: "Learn →", href: "/dermal-fillers-oswego" },
  ],
  howItWorksLearnMore: "/lip-studio",
  careGuideHref: "/pre-post-care/filler",
  treatmentTime: "20–30 min",
  relatedDescription:
    "Lips rarely exist in isolation — balance with surrounding structure often makes the result. We map it honestly at consult.",
  relatedHighlights: [
    "Dermal fillers for cheeks, chin & jawline balance",
    "Botox lip flip as a lighter-touch alternative",
    "Plan 3–4 weeks ahead of weddings & events",
    "Cold sore history? We prescribe antiviral prophylaxis",
  ],
});
