/**
 * Botox & Fillers — per-city local SEO (Fox Valley hubs).
 * Flagship experience: /services/injectables
 */

import { INJECTABLES_MENU } from "@/lib/injectables-menu";
import { INJECTABLES_FAQS, INJECTABLES_MARKETING, INJECTABLES_PATH } from "@/lib/injectables-marketing";
import type { PrimaryCitySlug } from "@/lib/city-seo-tier";
import { PRIMARY_CITY_SLUGS } from "@/lib/city-seo-tier";

export type InjectablesCitySlug = Exclude<PrimaryCitySlug, "oswego">;

export type InjectablesCitySeoContent = {
  slug: InjectablesCitySlug;
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

const neuroPricing = INJECTABLES_MENU.sections[0].pricing;
const botoxPrice = neuroPricing.find((p) => p.label === "Botox")?.price ?? "$10/unit";
const lipPrice = INJECTABLES_MENU.sections[1].pricing[0]?.price ?? "$450";
const dermalPrice = INJECTABLES_MENU.sections[2].pricing[0]?.price ?? "From $650";

export const INJECTABLES_CITY_SLUGS = PRIMARY_CITY_SLUGS.filter(
  (s): s is InjectablesCitySlug => s !== "oswego",
);

function pathFor(slug: InjectablesCitySlug): string {
  return `/injectables-${slug}-il`;
}

function baseFaqs(city: string, localAngle: string): InjectablesCitySeoContent["faqs"] {
  return [
    {
      question: `Where can I get Botox and fillers near ${city}, IL?`,
      answer: `${CLINIC} offers Botox, Dysport, Jeuveau, Xeomin, Daxxify, lip filler, and dermal fillers with nurse practitioner oversight. ${localAngle} We serve ${SERVICE_AREAS}. See our full injectables menu online.`,
    },
    {
      question: `How much does Botox cost near ${city}?`,
      answer: `First-time Botox is ${botoxPrice} at Hello Gorgeous. Most upper-face treatments use 20–40 units — typically $200–$400 per visit. Exact dosing is mapped at your free consultation in Oswego.`,
    },
    {
      question: `How much is lip filler near ${city}?`,
      answer: `Lip filler starts at ${lipPrice} for one syringe at Hello Gorgeous Oswego. Two-syringe packages are available at consult. Lip Studio AI preview helps you visualize shape before treatment.`,
    },
    {
      question: "Which neurotoxin brands do you carry?",
      answer:
        "All five FDA-approved neurotoxins — Botox, Dysport, Jeuveau, Xeomin, and Daxxify. We recommend based on your anatomy and goals, not a one-brand menu.",
    },
    ...INJECTABLES_FAQS.slice(0, 2).map((f) => ({ question: f.q, answer: f.a })),
  ];
}

const CITY_CONTENT: Record<
  InjectablesCitySlug,
  Omit<InjectablesCitySeoContent, "slug" | "localSlug" | "path">
> = {
  naperville: {
    cityLabel: "Naperville",
    metaTitle: "Botox & Fillers Near Naperville IL | $10/unit Botox | Hello Gorgeous Oswego",
    metaDescription:
      "Botox $10/unit, lip filler $450, dermal fillers from $650 — 15 minutes from Naperville, IL at Hello Gorgeous Med Spa in Oswego. All 5 neurotoxins · NP-led · free consult.",
    keywords: [
      "Botox Naperville IL",
      "Botox near Naperville",
      "lip filler Naperville IL",
      "dermal fillers Naperville",
      "injectables near Naperville",
      "neurotoxin Naperville IL",
    ],
    heroEyebrow: "15 min from Naperville · Oswego, IL",
    heroAccent: "Naperville & the Western Suburbs",
    heroImageAlt: "Botox and dermal fillers near Naperville IL at Hello Gorgeous Med Spa Oswego",
    localLead:
      "Naperville clients choose Hello Gorgeous in Oswego for NP-led Botox and fillers — about 15 minutes via Route 34, with all five neurotoxin brands and Lip Studio AI preview on site.",
    driveNote: "📍 74 W. Washington Street, Oswego — ~15 min from Naperville via Route 34",
    pricingHeading: "Injectables pricing near Naperville",
    faqs: baseFaqs(
      "Naperville",
      "We are a short drive from Naperville — about 15 minutes via Route 34.",
    ),
  },
  aurora: {
    cityLabel: "Aurora",
    metaTitle: "Botox & Fillers Near Aurora IL | Lip Filler $450 | Hello Gorgeous Oswego",
    metaDescription:
      "Botox, lip filler & dermal fillers near Aurora, IL — all 5 neurotoxins at Hello Gorgeous Med Spa in Oswego. NP-led injectors · natural results · free consult.",
    keywords: [
      "Botox Aurora IL",
      "Botox near Aurora",
      "lip filler Aurora IL",
      "dermal fillers Aurora",
      "injectables Fox Valley",
      "Daxxify Aurora IL",
    ],
    heroEyebrow: "Fox Valley · Oswego, IL",
    heroAccent: "Aurora & the Fox Valley",
    heroImageAlt: "Botox and fillers near Aurora IL at Hello Gorgeous Med Spa Oswego",
    localLead:
      "Aurora and Fox Valley clients book injectables at our downtown Oswego studio — honest unit mapping, premium HA fillers, and medical oversight on every visit.",
    driveNote: "📍 74 W. Washington Street, Oswego — serving Aurora & the Fox Valley",
    pricingHeading: "Injectables pricing near Aurora",
    faqs: baseFaqs("Aurora", "We serve Aurora and the Fox Valley from our Oswego clinic."),
  },
  plainfield: {
    cityLabel: "Plainfield",
    metaTitle: "Botox & Fillers Near Plainfield IL | Hello Gorgeous Oswego",
    metaDescription:
      "Botox $10/unit, lip filler $450 near Plainfield, IL at Hello Gorgeous Med Spa in Oswego. Dermal fillers, all 5 neurotoxins · NP on site · Cherry financing.",
    keywords: [
      "Botox Plainfield IL",
      "Botox near Plainfield",
      "lip filler Plainfield IL",
      "dermal fillers Plainfield",
      "injectables Kendall County",
      "neurotoxin Plainfield IL",
    ],
    heroEyebrow: "Kendall & Will County · Oswego, IL",
    heroAccent: "Plainfield & Nearby",
    heroImageAlt: "Botox and fillers near Plainfield IL at Hello Gorgeous Med Spa Oswego",
    localLead:
      "Plainfield neighbors visit Hello Gorgeous in Oswego for natural Botox and filler results — conservative baby tox, full-face mapping, and membership discounts on every brand.",
    driveNote: "📍 74 W. Washington Street, Oswego — convenient from Plainfield (~12 min)",
    pricingHeading: "Injectables pricing near Plainfield",
    faqs: baseFaqs("Plainfield", "We are an easy drive from Plainfield to our Oswego med spa."),
  },
  yorkville: {
    cityLabel: "Yorkville",
    metaTitle: "Botox & Fillers Near Yorkville IL | Hello Gorgeous Oswego",
    metaDescription:
      "Botox & dermal fillers near Yorkville, IL — Hello Gorgeous Med Spa in Oswego. Lip filler $450 · all 5 neurotoxins · NP-directed · free consult.",
    keywords: [
      "Botox Yorkville IL",
      "Botox near Yorkville",
      "lip filler Yorkville IL",
      "dermal fillers Kendall County",
      "injectables Yorkville",
      "fillers Oswego Yorkville",
    ],
    heroEyebrow: "Kendall County · Oswego, IL",
    heroAccent: "Yorkville & Kendall County",
    heroImageAlt: "Botox and fillers near Yorkville IL at Hello Gorgeous Med Spa Oswego",
    localLead:
      "Yorkville and Kendall County clients trust Hello Gorgeous for injectables with NP oversight — from lip filler and cheek volume to preventative baby tox and masseter slimming.",
    driveNote: "📍 74 W. Washington Street, Oswego — serving Yorkville & Kendall County (~8 min)",
    pricingHeading: "Injectables pricing near Yorkville",
    faqs: baseFaqs("Yorkville", "We serve Yorkville and Kendall County from our Oswego clinic."),
  },
  montgomery: {
    cityLabel: "Montgomery",
    metaTitle: "Botox & Fillers Near Montgomery IL | Hello Gorgeous Oswego",
    metaDescription:
      "Botox, lip filler & dermal fillers near Montgomery, IL at Hello Gorgeous Med Spa in Oswego. All 5 neurotoxins · NP-led · Alle rewards · free consult.",
    keywords: [
      "Botox Montgomery IL",
      "Botox near Montgomery",
      "lip filler Montgomery IL",
      "dermal fillers Montgomery",
      "injectables Fox Valley",
      "neurotoxin Montgomery IL",
    ],
    heroEyebrow: "Fox Valley · Oswego, IL",
    heroAccent: "Montgomery & Nearby",
    heroImageAlt: "Botox and fillers near Montgomery IL at Hello Gorgeous Med Spa Oswego",
    localLead:
      "Montgomery and Fox Valley clients book Botox and fillers at our Oswego location — free consultation, hyaluronidase on hand, and 0% APR financing through Cherry.",
    driveNote: "📍 74 W. Washington Street, Oswego — serving Montgomery & the Fox Valley (~10 min)",
    pricingHeading: "Injectables pricing near Montgomery",
    faqs: baseFaqs(
      "Montgomery",
      "We are a convenient drive from Montgomery to our Oswego med spa.",
    ),
  },
};

export function getInjectablesCitySeo(slug: InjectablesCitySlug): InjectablesCitySeoContent {
  const block = CITY_CONTENT[slug];
  return {
    slug,
    localSlug: `${slug}-il`,
    path: pathFor(slug),
    ...block,
  };
}

export const INJECTABLES_CITY_SEO_PAGES = INJECTABLES_CITY_SLUGS.map(getInjectablesCitySeo);

export function injectablesCityCrossLinks(current: InjectablesCitySlug) {
  const oswego = { href: INJECTABLES_PATH, label: "Oswego menu" };
  const others = INJECTABLES_CITY_SEO_PAGES.filter((p) => p.slug !== current).map((p) => ({
    href: p.path,
    label: p.cityLabel,
  }));
  return [oswego, ...others];
}

export const INJECTABLES_CITY_HERO_IMAGE = INJECTABLES_MARKETING.images.hero;

export const INJECTABLES_CITY_PRICING = {
  botox: botoxPrice,
  lipFiller: lipPrice,
  dermalFiller: dermalPrice,
  neurotoxinBrands: "All 5 brands",
} as const;

export const INJECTABLES_CITY_SERVICE_HIGHLIGHTS = [
  "Botox · Dysport · Jeuveau · Xeomin · Daxxify",
  "Lip filler & Lip Studio AI preview",
  "Cheek · jawline · chin · temple fillers",
  "Baby Botox & lip flip",
  "Masseter / jaw slimming",
  "NP-led · dissolver on hand",
] as const;
