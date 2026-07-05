/**
 * RE GEN medical weight loss — per-city local SEO (ship-to-home GLP-1).
 */

import { REGEN_LAUNCH_PRICING } from "@/lib/regen-brand";
import type { PrimaryCitySlug } from "@/lib/city-seo-tier";
import { PRIMARY_CITY_SLUGS } from "@/lib/city-seo-tier";

export const REGEN_WEIGHT_LOSS_HUB = "/rx/weight-loss" as const;

export type RegenWeightLossCitySeoContent = {
  slug: PrimaryCitySlug;
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
  faqs: Array<{ question: string; answer: string }>;
};

const CLINIC = "Hello Gorgeous Med Spa at 74 W. Washington Street, Oswego, IL";
const PRICE = REGEN_LAUNCH_PRICING.glp1;

function pathFor(slug: PrimaryCitySlug): string {
  return `/regen-weight-loss-${slug}-il`;
}

function baseFaqs(city: string, localAngle: string): RegenWeightLossCitySeoContent["faqs"] {
  return [
    {
      question: `Where can I get GLP-1 weight loss near ${city}, IL?`,
      answer: `${CLINIC} offers RE GEN medical weight loss — compounded semaglutide and tirzepatide with NP supervision. ${localAngle} Programs ship across Illinois with transparent pricing ${PRICE}.`,
    },
    {
      question: "Is RE GEN the same as Ozempic or Wegovy?",
      answer:
        "RE GEN offers compounded semaglutide and tirzepatide — the same active molecules as brand-name GLP-1 medications — with nurse-practitioner review. Brand-name products are not sold through RE GEN.",
    },
    {
      question: `How much does RE GEN weight loss cost near ${city}?`,
      answer: `Published pricing starts ${PRICE} for qualifying GLP-1 programs, plus flat $30 Illinois shipping. Your NP confirms dose tier and total during intake review.`,
    },
    {
      question: "Do I need to visit the clinic for RE GEN?",
      answer:
        "Most RE GEN weight-loss care is telehealth with medication shipped to your door. You can visit our Oswego clinic for in-person consults or labs when appropriate.",
    },
    {
      question: `How do I start RE GEN weight loss from ${city}?`,
      answer:
        "Visit hellogorgeousmedspa.com/rx/weight-loss, choose your program, and complete the online intake. Ryan Kent, FNP-BC reviews your information before any prescription ships.",
    },
  ];
}

const CITY_CONTENT: Record<
  PrimaryCitySlug,
  Omit<RegenWeightLossCitySeoContent, "slug" | "path">
> = {
  oswego: {
    cityLabel: "Oswego",
    metaTitle: "RE GEN Weight Loss Oswego IL | GLP-1 Shipped Illinois | Hello Gorgeous",
    metaDescription: `RE GEN GLP-1 medical weight loss in Oswego, IL — compounded semaglutide & tirzepatide, NP-supervised, shipped across Illinois. Transparent pricing ${PRICE}.`,
    keywords: [
      "RE GEN weight loss Oswego",
      "GLP-1 Oswego IL",
      "semaglutide Oswego",
      "tirzepatide Illinois telehealth",
      "medical weight loss Oswego",
    ],
    heroEyebrow: "RE GEN · Oswego, IL",
    heroAccent: "Oswego & Illinois",
    heroImageAlt: "RE GEN GLP-1 weight loss programs — Hello Gorgeous Med Spa Oswego",
    localLead:
      "Our clinic is in downtown Oswego — and RE GEN ships NP-supervised GLP-1 programs to your door anywhere in Illinois.",
    faqs: baseFaqs("Oswego", "We are located at 74 W. Washington Street in Oswego."),
  },
  naperville: {
    cityLabel: "Naperville",
    metaTitle: "RE GEN Weight Loss Near Naperville IL | GLP-1 Telehealth | Hello Gorgeous",
    metaDescription: `RE GEN GLP-1 weight loss near Naperville, IL — NP-supervised semaglutide & tirzepatide shipped to your door. Clinic 15 min away in Oswego. From ${PRICE}.`,
    keywords: [
      "GLP-1 weight loss Naperville",
      "semaglutide Naperville IL",
      "RE GEN Naperville",
      "medical weight loss near Naperville",
      "tirzepatide Illinois shipping",
    ],
    heroEyebrow: "15 min from Naperville · RE GEN",
    heroAccent: "Naperville & DuPage County",
    heroImageAlt: "RE GEN weight loss near Naperville IL — Hello Gorgeous Med Spa",
    localLead:
      "Naperville clients choose RE GEN for GLP-1 programs shipped home — with our Oswego clinic just 15 minutes away when you want in-person NP care.",
    driveNote: "📍 Oswego clinic ~15 min via Route 34 · RE GEN ships statewide",
    faqs: (() => {
      const all = baseFaqs(
        "Naperville",
        "We serve Naperville from our Oswego clinic and ship RE GEN statewide.",
      );
      return [
        all[0]!,
        {
          question: "How far is Hello Gorgeous from Naperville for weight loss care?",
          answer:
            "About 15 minutes to our Oswego clinic. RE GEN GLP-1 programs ship to your Naperville address after NP review — no weekly clinic visits required.",
        },
        ...all.slice(1),
      ];
    })(),
  },
  aurora: {
    cityLabel: "Aurora",
    metaTitle: "RE GEN Weight Loss Near Aurora IL | GLP-1 Programs | Hello Gorgeous",
    metaDescription: `RE GEN GLP-1 medical weight loss near Aurora, IL — semaglutide & tirzepatide with NP oversight, shipped across Illinois. Oswego clinic ~10 min away. ${PRICE}.`,
    keywords: [
      "GLP-1 Aurora IL",
      "weight loss telehealth Aurora",
      "RE GEN Aurora",
      "semaglutide near Aurora",
      "Hello Gorgeous weight loss",
    ],
    heroEyebrow: "~10 min from Aurora · RE GEN",
    heroAccent: "Aurora & Kane County",
    heroImageAlt: "RE GEN GLP-1 weight loss near Aurora IL",
    localLead:
      "Aurora residents use RE GEN for provider-guided GLP-1 programs delivered home — with fast access to our Oswego med spa when labs or in-person visits help.",
    driveNote: "📍 Oswego clinic ~10 min from Aurora · Illinois shipping",
    faqs: baseFaqs("Aurora", "We are approximately 10 minutes from Aurora to our Oswego location."),
  },
  plainfield: {
    cityLabel: "Plainfield",
    metaTitle: "RE GEN Weight Loss Near Plainfield IL | GLP-1 | Hello Gorgeous",
    metaDescription: `RE GEN GLP-1 weight loss near Plainfield, IL — NP-supervised programs shipped to your door. Compounded semaglutide & tirzepatide from ${PRICE}.`,
    keywords: [
      "GLP-1 Plainfield IL",
      "RE GEN Plainfield",
      "medical weight loss Plainfield",
      "semaglutide Will County",
    ],
    heroEyebrow: "Near Plainfield · RE GEN",
    heroAccent: "Plainfield & Will County",
    heroImageAlt: "RE GEN weight loss near Plainfield IL",
    localLead:
      "Plainfield and Will County clients start RE GEN online — GLP-1 programs with transparent pricing and NP review before anything ships.",
    driveNote: "📍 Serving Plainfield from Hello Gorgeous in Oswego",
    faqs: baseFaqs("Plainfield", "We serve Plainfield with Illinois-wide RE GEN shipping."),
  },
  yorkville: {
    cityLabel: "Yorkville",
    metaTitle: "RE GEN Weight Loss Near Yorkville IL | GLP-1 Telehealth",
    metaDescription: `RE GEN GLP-1 weight loss near Yorkville, IL — Kendall County telehealth with NP supervision. Shipped semaglutide & tirzepatide from ${PRICE}.`,
    keywords: [
      "GLP-1 Yorkville IL",
      "RE GEN Yorkville",
      "weight loss Kendall County",
      "semaglutide telehealth Illinois",
    ],
    heroEyebrow: "Kendall County · RE GEN",
    heroAccent: "Yorkville & Kendall County",
    heroImageAlt: "RE GEN GLP-1 weight loss near Yorkville IL",
    localLead:
      "Yorkville neighbors choose RE GEN for medical weight loss without driving to a chain clinic — NP-directed care from Hello Gorgeous in Oswego.",
    driveNote: "📍 Kendall County · RE GEN ships to Yorkville",
    faqs: baseFaqs("Yorkville", "We serve Yorkville and Kendall County with statewide RE GEN delivery."),
  },
  montgomery: {
    cityLabel: "Montgomery",
    metaTitle: "RE GEN Weight Loss Near Montgomery IL | GLP-1 Programs",
    metaDescription: `RE GEN GLP-1 weight loss near Montgomery, IL — compounded semaglutide & tirzepatide, NP-supervised, shipped across Illinois from ${PRICE}.`,
    keywords: [
      "GLP-1 Montgomery IL",
      "RE GEN Montgomery",
      "Fox Valley weight loss",
      "semaglutide Illinois",
    ],
    heroEyebrow: "Fox Valley · RE GEN",
    heroAccent: "Montgomery & Nearby",
    heroImageAlt: "RE GEN weight loss near Montgomery IL",
    localLead:
      "Montgomery and Fox Valley clients use RE GEN for GLP-1 programs with a real Oswego NP team — not an anonymous telehealth app.",
    driveNote: "📍 Fox Valley · Hello Gorgeous Oswego + Illinois shipping",
    faqs: baseFaqs("Montgomery", "We serve Montgomery from our Oswego clinic with RE GEN mail-order programs."),
  },
};

export function getRegenWeightLossCitySeo(slug: PrimaryCitySlug): RegenWeightLossCitySeoContent {
  return { slug, path: pathFor(slug), ...CITY_CONTENT[slug] };
}

export const REGEN_WEIGHT_LOSS_CITY_PAGES = PRIMARY_CITY_SLUGS.map(getRegenWeightLossCitySeo);

export function regenWeightLossCrossLinks(current: PrimaryCitySlug) {
  return REGEN_WEIGHT_LOSS_CITY_PAGES.filter((p) => p.slug !== current).map((p) => ({
    href: p.path,
    label: p.cityLabel,
  }));
}
