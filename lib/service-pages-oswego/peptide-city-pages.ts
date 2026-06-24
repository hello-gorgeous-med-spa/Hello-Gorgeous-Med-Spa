import { bookingUrlFor } from "./build";
import type { ServicePageData } from "./types";

const PEPTIDE_CITIES = [
  { city: "Naperville", slug: "naperville-il", drive: "about 15 minutes west on Route 34" },
  { city: "Aurora", slug: "aurora-il", drive: "about 10 minutes south on Route 30" },
  { city: "Plainfield", slug: "plainfield-il", drive: "about 12 minutes via Route 126" },
  { city: "Yorkville", slug: "yorkville-il", drive: "about 8 minutes north on Route 47" },
  { city: "Montgomery", slug: "montgomery-il", drive: "about 10 minutes south via Route 30" },
] as const;

function peptideCityPage(city: string, citySlug: string, drive: string): ServicePageData {
  const slug = `peptide-therapy-${citySlug}`;
  return {
    slug,
    serviceName: "Peptide Therapy",
    fullServiceName: "Medical Peptide Therapy",
    targetKeyword: `peptide therapy ${city.toLowerCase()}`,
    metaTitle: `Peptide Therapy Near ${city}, IL | Hello Gorgeous Oswego`,
    metaDescription:
      `Medical peptide therapy for ${city} & Kendall County — BPC-157, Sermorelin, GHK-Cu, NAD+, PT-141 & more. $49 NP consult in downtown Oswego (${drive}).`,
    h1: `Peptide Therapy Near ${city}, IL`,
    valueProp:
      "Full-authority NP-supervised peptide protocols — recovery, skin, sleep, libido, body composition & longevity.",
    bookingUrl: bookingUrlFor(),
    procedureType: "Wellness",
    bodyLocation: "Subcutaneous",
    tier: "uncontested",
    heroContent:
      `${city} clients choose Hello Gorgeous in downtown Oswego for peptide therapy because Ryan Kent, FNP-BC prescribes and supervises every protocol — pharmacy-sourced, never gray-market. We offer BPC-157, Sermorelin, GHK-Cu, Tesamorelin, PT-141, NAD+, glutathione, and GLP-1 options when appropriate. Our clinic is ${drive} from ${city}.`,
    whyBullets: [
      "Ryan Kent, FNP-BC — full prescribing authority on site every week",
      "Licensed US compounding pharmacies only — no research-grade or internet vials",
      "Deep peptide menu: BPC-157, Sermorelin, GHK-Cu, Tesamorelin, PT-141, NAD+ & more",
      "$49 peptide consultation — personalized plan; medication priced separately",
      "Education hub + injection menu so you understand options before you commit",
    ],
    howItWorksParagraphs: [
      "Peptides are short amino-acid chains that signal specific pathways in your body — recovery, sleep, skin, metabolism, libido, and more. At Hello Gorgeous, peptide therapy is medical: consult, screening, prescription, teaching you safe self-administration, and follow-up to adjust your protocol.",
    ],
    whatToExpectSteps: [
      `$49 peptide consultation — goals, history, and whether peptides fit (or if something else would serve you better).`,
      "Labs when indicated — baseline work to dose safely and track response.",
      "Custom protocol from Ryan — specific peptide(s), dose, frequency, and cycle.",
      "Hands-on training — how to store, inject, and what to report between visits.",
      "Ongoing follow-up — dose tweaks and refreshes as your body responds.",
    ],
    pricing:
      "Consultation is $49; peptide medications are priced separately. Published starting rates from $149/mo — Recovery Blend from $229/mo. See hellogorgeousmedspa.com/peptides#peptide-pricing. Transparent numbers before you start.",
    faqs: [
      {
        q: `How far is Hello Gorgeous from ${city}?`,
        a: `Our Oswego clinic at 74 W Washington St is ${drive} from ${city}. Many ${city} clients book same-day or next-day consults.`,
      },
      {
        q: "Which peptides do you offer?",
        a: "BPC-157, Sermorelin, GHK-Cu, Tesamorelin, PT-141, NAD+, glutathione, and GLP-1 weight-loss options when clinically appropriate — see our injection menu and education hub for details.",
      },
      {
        q: "Is peptide therapy safe?",
        a: "When prescribed by an NP and sourced from licensed US pharmacies, peptide therapy has a strong safety profile. We do not sell or recommend gray-market research peptides.",
      },
      {
        q: "Do I need a consultation first?",
        a: "Yes — every peptide protocol starts with a medical evaluation. Book the $49 consult online; we'll tell you honestly if peptides fit your goals.",
      },
    ],
    relatedServices: ["peptide-therapy-oswego", "glp-1-weight-loss-oswego", "nad-iv-oswego"],
    closingCta: `Ready to explore peptide therapy from ${city}? Book your $49 consult — we'll map the right protocol for your goals.`,
  };
}

/** Satellite local SEO pages — peptide therapy near Naperville, Aurora, etc. */
export const PEPTIDE_CITY_PAGES: ServicePageData[] = PEPTIDE_CITIES.map((c) =>
  peptideCityPage(c.city, c.slug, c.drive),
);

export const PEPTIDE_CITY_SLUGS = PEPTIDE_CITY_PAGES.map((p) => p.slug);
