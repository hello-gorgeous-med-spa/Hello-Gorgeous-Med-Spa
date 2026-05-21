/** NAD+ injection landing — paths, pricing (edit here), FAQs. */

import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";

export const NAD_PLUS_INJECTIONS_PATH = "/services/nad-plus-injections-oswego-il";

/** NAD+ injection — single price (edit here). */
export const NAD_PLUS_INJECTION_PRICE = "$40";

export const NAD_PLUS_PRICING = [
  {
    id: "injection",
    name: "NAD+ Injection",
    price: NAD_PLUS_INJECTION_PRICE,
    description:
      "Quick in-office wellness injection. Screening required. Optional stacks (B12, glutathione, etc.) priced separately at consult.",
    highlight: true,
  },
] as const;

export const NAD_PLUS_ADDONS = [
  { name: "B12", note: "Energy & metabolism support" },
  { name: "Glutathione", note: "Antioxidant wellness support" },
  { name: "Vitamin D", note: "When levels are appropriate" },
  { name: "MIC injection", note: "Metabolic wellness add-on" },
  { name: "IV wellness drip", note: "When a longer visit fits your goals" },
] as const;

export const NAD_PLUS_BOOKING_URL = BOOKING_URL;

export const NAD_PLUS_FAQS = [
  {
    question: "Is NAD+ a vitamin?",
    answer:
      "No. NAD+ is a coenzyme involved in cellular metabolism. It is related to B3 vitamin pathways, but NAD+ itself is not the same as a standard vitamin shot.",
  },
  {
    question: "How much does a NAD+ injection cost?",
    answer:
      "NAD+ injections at Hello Gorgeous Med Spa in Oswego are $40 per visit. Add-ons and IV NAD+ are separate services with different pricing — your provider will confirm at consult.",
  },
  {
    question: "How fast will I feel it?",
    answer:
      "Some clients report feeling more alert or energized the same day, while others notice subtle changes after a series. Results vary.",
  },
  {
    question: "Is this the same as IV NAD+?",
    answer:
      "No. IV NAD+ is infused over a longer appointment. NAD+ injections are faster and easier to fit into a busy schedule. The right option depends on goals, dose, tolerance, and provider recommendation.",
  },
  {
    question: "Can I stack NAD+ with B12 or glutathione?",
    answer:
      "Yes, many clients combine NAD+ with other wellness injections. Our clinical team recommends the right stack based on goals and history.",
  },
  {
    question: "Does NAD+ reverse aging?",
    answer:
      "No treatment can honestly promise that. NAD+ is studied in aging biology and mitochondrial health, but this service should be positioned as wellness support, not age reversal.",
  },
  {
    question: "Who should avoid NAD+?",
    answer:
      "Clients who are pregnant, breastfeeding, undergoing cancer treatment, have complex medical conditions, or take certain medications should be cleared before treatment.",
  },
] as const;

export const NAD_PLUS_DISCLAIMER =
  "NAD+ injection therapy is a wellness service and is not intended to diagnose, treat, cure, or prevent any disease. Individual results vary. Clients should consult a qualified healthcare provider before starting any new injection, supplement, or wellness protocol, especially if pregnant, breastfeeding, undergoing cancer treatment, managing a chronic medical condition, or taking prescription medications.";

/** Hero collage (main + two tiles) and “Science, Made Beautiful” cards. */
export const NAD_PLUS_HERO_IMAGES = {
  main: {
    src: "/images/nad-plus/peptide-science-hero.png",
    alt: "Peptide and molecular science illustration for cellular wellness at Hello Gorgeous Med Spa",
  },
  vialSyringe: {
    src: "/images/nad-plus/nad-science-vial-syringe.png",
    alt: "NAD+ injection vial and syringe with DNA and molecular science visuals",
  },
  dnaSyringe: {
    src: "/images/nad-plus/nad-science-dna-syringe.png",
    alt: "DNA helix with syringe and flask for regenerative wellness science",
  },
} as const;

export const NAD_PLUS_SCIENCE_CARDS = [
  {
    title: "NAD+ & Molecular Science",
    src: "/images/nad-plus/nad-science-molecular-chain.png",
    alt: "Molecular structures with medical vial and syringe for NAD+ wellness therapy",
    caption: "Hello Gorgeous Med Spa — cellular wellness imagery",
  },
  {
    title: "DNA & Regenerative Pathways",
    src: "/images/nad-plus/nad-science-dna-syringe.png",
    alt: "DNA helix, syringe, and laboratory flask representing regenerative science",
    caption: "Hello Gorgeous Med Spa — science-forward wellness visuals",
  },
  {
    title: "Clinical NAD+ Injection",
    src: "/images/nad-plus/nad-science-vial-syringe.png",
    alt: "Premium NAD+ vial and syringe with DNA and energy-themed medical glam aesthetic",
    caption: "Hello Gorgeous Med Spa — in-office wellness injection",
  },
] as const;

export function nadPlusPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalBusiness",
        "@id": `${SITE.url}/#medicalbusiness`,
        name: SITE.name,
        url: SITE.url,
        telephone: SITE.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.streetAddress,
          addressLocality: SITE.address.addressLocality,
          addressRegion: SITE.address.addressRegion,
          postalCode: SITE.address.postalCode,
          addressCountry: SITE.address.addressCountry,
        },
      },
      {
        "@type": "Service",
        name: "NAD+ Injection Therapy",
        description:
          "NAD+ wellness injections at Hello Gorgeous Med Spa in Oswego, IL — supports cellular energy pathways, focus, and recovery. Results vary.",
        provider: { "@id": `${SITE.url}/#medicalbusiness` },
        areaServed: ["Oswego", "Naperville", "Aurora", "Plainfield", "Yorkville"],
        url: `${SITE.url}${NAD_PLUS_INJECTIONS_PATH}`,
      },
    ],
  };
}
