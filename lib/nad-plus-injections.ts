/** NAD+ injection landing — paths, pricing (edit here), FAQs. */

import { BOOKING_URL } from "@/lib/flows";
import { SITE } from "@/lib/seo";

export const NAD_PLUS_INJECTIONS_PATH = "/services/nad-plus-injections-oswego-il";

/** Update pricing here; mirrored on the landing page. */
export const NAD_PLUS_PRICING = [
  {
    id: "single",
    name: "Single NAD+ Injection",
    price: "$95",
    description: "Best for first-time clients or occasional wellness support.",
  },
  {
    id: "series-4",
    name: "4-Week NAD+ Series",
    price: "$340",
    description: "Weekly injections for clients who want consistency.",
    highlight: true,
  },
  {
    id: "series-8",
    name: "8-Week NAD+ Reset",
    price: "$640",
    description: "Structured cellular wellness routine over two months.",
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

export const NAD_PLUS_SCIENCE_ATTRIBUTION = [
  {
    label: "NAD+ structure",
    source: "Wikimedia Commons — public domain structural formula",
    path: "/images/nad-plus/nad-molecule-structure.png",
  },
  {
    label: "Cellular energy diagram",
    source: "Hello Gorgeous — original educational graphic",
    path: "/images/nad-plus/cellular-energy-pathway.svg",
  },
  {
    label: "Mitochondria illustration",
    source: "Hello Gorgeous — branded educational graphic",
    path: "/images/nad-plus/mitochondria-energy.svg",
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
