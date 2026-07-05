/**
 * Microblading / brow PMU — per-city local SEO (Fox Valley hubs).
 * Flagship experience: /microblading-brow-pmu-oswego-il (Your Brow Journey).
 */

import {
  BROW_JOURNEY_FAQS,
  BROW_JOURNEY_IMAGES,
  BROW_JOURNEY_PATH,
  BROW_JOURNEY_PRICING,
} from "@/lib/brow-journey-marketing";
import type { PrimaryCitySlug } from "@/lib/city-seo-tier";
import { PRIMARY_CITY_SLUGS } from "@/lib/city-seo-tier";

export type BrowMicrobladingCitySlug = Exclude<PrimaryCitySlug, "oswego">;

export type BrowMicrobladingCitySeoContent = {
  slug: BrowMicrobladingCitySlug;
  localSlug: string;
  path: string;
  cityLabel: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroEyebrow: string;
  heroAccent: string;
  heroImageAlt: string;
  localLead: string;
  driveNote?: string;
  pricingHeading: string;
  faqs: Array<{ question: string; answer: string }>;
};

const CLINIC = "Hello Gorgeous Med Spa at 74 W. Washington Street in Oswego, IL";
const SERVICE_AREAS =
  "Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery, and Kendall County";
const ARTIST = "Jen Vokoun";

export const BROW_MICROBLADING_CITY_SLUGS = PRIMARY_CITY_SLUGS.filter(
  (s): s is BrowMicrobladingCitySlug => s !== "oswego",
);

function pathFor(slug: BrowMicrobladingCitySlug): string {
  return `/microblading-${slug}-il`;
}

function baseFaqs(city: string, localAngle: string): BrowMicrobladingCitySeoContent["faqs"] {
  return [
    {
      question: `Where can I get microblading near ${city}, IL?`,
      answer: `${CLINIC} offers microblading, powder, combo, and nano brow PMU with ${ARTIST}. ${localAngle} We serve ${SERVICE_AREAS}. Explore our full Your Brow Journey guide online.`,
    },
    {
      question: `How much does microblading cost near ${city}?`,
      answer: `Microblading starts at ${BROW_JOURNEY_PRICING.microblading}; combo brows ${BROW_JOURNEY_PRICING.combo}. A perfecting touch-up is ${BROW_JOURNEY_PRICING.touchup.toLowerCase()} with your initial session. Meet Jen specials may apply — see our Oswego brow page for current pricing.`,
    },
    {
      question: "Who performs brow PMU at Hello Gorgeous?",
      answer: `${ARTIST} is our permanent makeup artist — known for custom brow mapping, natural healed results, and Tina Davies pigments. Every client is screened under NP-directed medical standards at our Oswego clinic.`,
    },
    {
      question: "How long does microblading last?",
      answer:
        "Depending on technique, skin type, and aftercare, brow PMU typically lasts 1–3 years. Microblading tends toward 1–2 years; ombré and combo can last longer. Annual refreshers help maintain color and shape.",
    },
    ...BROW_JOURNEY_FAQS.slice(0, 3).map((f) => ({ question: f.q, answer: f.a })),
  ];
}

const CITY_CONTENT: Record<
  BrowMicrobladingCitySlug,
  Omit<BrowMicrobladingCitySeoContent, "slug" | "localSlug" | "path">
> = {
  naperville: {
    cityLabel: "Naperville",
    metaTitle: "Microblading Near Naperville IL | Brow PMU | Hello Gorgeous Oswego",
    metaDescription:
      "Microblading, powder & combo brows 15 minutes from Naperville, IL — Jen Vokoun at Hello Gorgeous Med Spa in Oswego. Custom mapping, Tina Davies pigments, NP-directed. Free consult.",
    keywords: [
      "microblading Naperville IL",
      "microblading near Naperville",
      "brow PMU Naperville",
      "powder brows Naperville IL",
      "permanent makeup eyebrows Naperville",
      "combo brows near Naperville",
    ],
    heroEyebrow: "15 min from Naperville · Oswego, IL",
    heroAccent: "Naperville & the Western Suburbs",
    heroImageAlt: "Microblading and brow PMU near Naperville IL at Hello Gorgeous Med Spa Oswego",
    localLead:
      "Naperville clients choose Hello Gorgeous in Oswego for custom-mapped microblading and brow PMU — about 15 minutes via Route 34, with nurse practitioners on site and a full Your Brow Journey experience online.",
    driveNote: "📍 74 W. Washington Street, Oswego — ~15 min from Naperville via Route 34",
    pricingHeading: "Brow PMU pricing near Naperville",
    faqs: baseFaqs(
      "Naperville",
      "We are a short drive from Naperville — about 15 minutes via Route 34.",
    ),
  },
  aurora: {
    cityLabel: "Aurora",
    metaTitle: "Microblading Near Aurora IL | Brow PMU | Hello Gorgeous Oswego",
    metaDescription:
      "Microblading & brow PMU near Aurora, IL — hair-stroke, powder, combo & nano brows by Jen Vokoun at Hello Gorgeous Med Spa in Oswego. NP-directed, free consult.",
    keywords: [
      "microblading Aurora IL",
      "microblading near Aurora",
      "brow PMU Aurora",
      "powder brows Aurora IL",
      "permanent makeup eyebrows Aurora",
      "nano brows Fox Valley",
    ],
    heroEyebrow: "Fox Valley · Oswego, IL",
    heroAccent: "Aurora & the Fox Valley",
    heroImageAlt: "Microblading near Aurora IL at Hello Gorgeous Med Spa Oswego",
    localLead:
      "Aurora and Fox Valley clients book brow PMU at our downtown Oswego studio — custom mapping, premium pigments, and medical screening before every appointment.",
    driveNote: "📍 74 W. Washington Street, Oswego — serving Aurora & the Fox Valley",
    pricingHeading: "Brow PMU pricing near Aurora",
    faqs: baseFaqs("Aurora", "We serve Aurora and the Fox Valley from our Oswego clinic."),
  },
  plainfield: {
    cityLabel: "Plainfield",
    metaTitle: "Microblading Near Plainfield IL | Brow PMU | Hello Gorgeous Oswego",
    metaDescription:
      "Microblading near Plainfield, IL — microblading, ombré powder, combo & nano brows at Hello Gorgeous Med Spa in Oswego. Jen Vokoun · NP-directed · touch-up included.",
    keywords: [
      "microblading Plainfield IL",
      "microblading near Plainfield",
      "brow PMU Plainfield",
      "powder brows Plainfield IL",
      "permanent eyebrows Plainfield",
      "combo brows Kendall County",
    ],
    heroEyebrow: "Kendall & Will County · Oswego, IL",
    heroAccent: "Plainfield & Nearby",
    heroImageAlt: "Microblading near Plainfield IL at Hello Gorgeous Med Spa Oswego",
    localLead:
      "Plainfield neighbors visit Hello Gorgeous in Oswego for brow PMU that looks natural on day one and softer when healed — with a step-by-step Your Brow Journey guide before you ever sit in the chair.",
    driveNote: "📍 74 W. Washington Street, Oswego — convenient from Plainfield",
    pricingHeading: "Brow PMU pricing near Plainfield",
    faqs: baseFaqs("Plainfield", "We are an easy drive from Plainfield to our Oswego med spa."),
  },
  yorkville: {
    cityLabel: "Yorkville",
    metaTitle: "Microblading Near Yorkville IL | Brow PMU | Hello Gorgeous Oswego",
    metaDescription:
      "Microblading & brow PMU near Yorkville, IL — custom-mapped brows by Jen Vokoun at Hello Gorgeous Med Spa in Oswego. Kendall County · NP on site · free consult.",
    keywords: [
      "microblading Yorkville IL",
      "microblading near Yorkville",
      "brow PMU Yorkville",
      "powder brows Kendall County",
      "permanent makeup eyebrows Yorkville",
      "microblading Oswego Yorkville",
    ],
    heroEyebrow: "Kendall County · Oswego, IL",
    heroAccent: "Yorkville & Kendall County",
    heroImageAlt: "Microblading near Yorkville IL at Hello Gorgeous Med Spa Oswego",
    localLead:
      "Yorkville and Kendall County clients trust Hello Gorgeous for brow PMU with medical oversight, Tina Davies pigments, and an artist who maps every brow to your bone structure — not a stencil.",
    driveNote: "📍 74 W. Washington Street, Oswego — serving Yorkville & Kendall County",
    pricingHeading: "Brow PMU pricing near Yorkville",
    faqs: baseFaqs(
      "Yorkville",
      "We serve Yorkville and Kendall County from our Oswego clinic.",
    ),
  },
  montgomery: {
    cityLabel: "Montgomery",
    metaTitle: "Microblading Near Montgomery IL | Brow PMU | Hello Gorgeous Oswego",
    metaDescription:
      "Microblading near Montgomery, IL — microblading, powder, combo & nano brows at Hello Gorgeous Med Spa in Oswego. Jen Vokoun · NP-directed · financing available.",
    keywords: [
      "microblading Montgomery IL",
      "microblading near Montgomery",
      "brow PMU Montgomery",
      "powder brows Montgomery IL",
      "permanent eyebrows Fox Valley",
      "combo brows near Montgomery",
    ],
    heroEyebrow: "Fox Valley · Oswego, IL",
    heroAccent: "Montgomery & Nearby",
    heroImageAlt: "Microblading near Montgomery IL at Hello Gorgeous Med Spa Oswego",
    localLead:
      "Montgomery and Fox Valley clients book microblading at our Oswego location — free consultation, included perfecting touch-up, and 0% APR financing options through Cherry.",
    driveNote: "📍 74 W. Washington Street, Oswego — serving Montgomery & the Fox Valley",
    pricingHeading: "Brow PMU pricing near Montgomery",
    faqs: baseFaqs(
      "Montgomery",
      "We are a convenient drive from Montgomery to our Oswego med spa.",
    ),
  },
};

export function getBrowMicrobladingCitySeo(
  slug: BrowMicrobladingCitySlug,
): BrowMicrobladingCitySeoContent {
  const block = CITY_CONTENT[slug];
  return {
    slug,
    localSlug: `${slug}-il`,
    path: pathFor(slug),
    ...block,
  };
}

export const BROW_MICROBLADING_CITY_SEO_PAGES = BROW_MICROBLADING_CITY_SLUGS.map(
  getBrowMicrobladingCitySeo,
);

export function browMicrobladingCityCrossLinks(current: BrowMicrobladingCitySlug) {
  const oswego = { href: BROW_JOURNEY_PATH, label: "Oswego" };
  const others = BROW_MICROBLADING_CITY_SEO_PAGES.filter((p) => p.slug !== current).map((p) => ({
    href: p.path,
    label: p.cityLabel,
  }));
  return [oswego, ...others];
}

export const BROW_JOURNEY_TECHNIQUE_HIGHLIGHTS = [
  "Microblading (hair-stroke)",
  "Ombré / powder brows",
  "Combo (hybrid) brows",
  "Nano brows",
  "Custom brow mapping",
  "Tina Davies pigments",
] as const;

export const BROW_CITY_HERO_IMAGE = BROW_JOURNEY_IMAGES.artistJen;
