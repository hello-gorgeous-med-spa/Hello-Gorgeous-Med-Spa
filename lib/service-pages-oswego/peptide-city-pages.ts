import { bookingUrlFor } from "./build";
import type { ServicePageData } from "./types";

const PEPTIDE_CITIES = [
  {
    city: "Naperville",
    slug: "naperville-il",
    drive: "about 15 minutes via Route 59 south or Route 34 west through Plainfield",
    county: "DuPage & Will counties",
    routeNote: "Route 59 corridor · south Naperville · Riverwalk area",
  },
  {
    city: "Aurora",
    slug: "aurora-il",
    drive: "about 10–15 minutes south on Route 30 or west on Route 34",
    county: "Kane County",
    routeNote: "Fox Valley · east & west Aurora",
  },
  {
    city: "Plainfield",
    slug: "plainfield-il",
    drive: "about 12–15 minutes via Route 126 east to Route 34",
    county: "Will County",
    routeNote: "Plainfield–Oswego corridor",
  },
  {
    city: "Yorkville",
    slug: "yorkville-il",
    drive: "about 8–10 minutes north on Route 47",
    county: "Kendall County",
    routeNote: "north Yorkville · Kendall County",
  },
  {
    city: "Montgomery",
    slug: "montgomery-il",
    drive: "about 10 minutes south via Route 30",
    county: "Kendall & Kane counties",
    routeNote: "Montgomery · Oswego border",
  },
] as const;

function peptideCityPage(
  city: string,
  citySlug: string,
  drive: string,
  county: string,
  routeNote: string,
): ServicePageData {
  const slug = `peptide-therapy-${citySlug}`;
  const isNaperville = city === "Naperville";

  return {
    slug,
    serviceName: "Peptide Therapy",
    fullServiceName: "Medical Peptide Therapy",
    targetKeyword: `peptide therapy ${city.toLowerCase()} il`,
    metaTitle: isNaperville
      ? "Peptide Therapy Naperville IL | $49 Consult · From $149/mo | Hello Gorgeous"
      : `Peptide Therapy Near ${city}, IL | Hello Gorgeous Oswego`,
    metaDescription: isNaperville
      ? "Peptide therapy for Naperville, IL — BPC-157, Sermorelin, GHK-Cu, NAD+, PT-141 & blends. $49 NP consult in Oswego (~15 min). Ryan Kent, FNP-BC. Published pricing from $149/mo."
      : `Medical peptide therapy for ${city} & ${county} — BPC-157, Sermorelin, GHK-Cu, NAD+, PT-141 & more. $49 NP consult in downtown Oswego (${drive}).`,
    h1: isNaperville ? "Peptide Therapy Naperville, IL" : `Peptide Therapy Near ${city}, IL`,
    valueProp:
      "Full-authority NP-supervised peptide protocols — recovery, skin, sleep, libido, body composition & longevity.",
    bookingUrl: bookingUrlFor(),
    procedureType: "Wellness",
    bodyLocation: "Subcutaneous",
    tier: "uncontested",
    heroContent: isNaperville
      ? "Naperville clients choose Hello Gorgeous in downtown Oswego when they want clinical depth without the Riverwalk traffic or assembly-line telehealth feel. Ryan Kent, FNP-BC prescribes and supervises every peptide protocol — pharmacy-sourced through licensed 503A compounders, never gray-market vials. We offer BPC-157, Sermorelin, GHK-Cu, Tesamorelin, CJC-1295/Ipamorelin, PT-141, NAD+, recovery blends, and GLP-1 options when appropriate. Our clinic is about 15 minutes from south Naperville via Route 59 or Route 34 through Plainfield — close enough for lunch-hour consults and Saturday follow-ups."
      : `${city} clients choose Hello Gorgeous in downtown Oswego for peptide therapy because Ryan Kent, FNP-BC prescribes and supervises every protocol — pharmacy-sourced, never gray-market. We offer BPC-157, Sermorelin, GHK-Cu, Tesamorelin, PT-141, NAD+, glutathione, and GLP-1 options when appropriate. Our clinic is ${drive} from ${city} (${routeNote}).`,
    whyBullets: [
      "Ryan Kent, FNP-BC — full prescribing authority on site, not a remote medical director",
      "Licensed US compounding pharmacies only — no research-grade or internet vials",
      "Deep peptide menu: BPC-157, Sermorelin, GHK-Cu, Tesamorelin, PT-141, NAD+ & recovery blends",
      "$49 peptide consultation — personalized plan; medication priced separately with published starting rates",
      "Education hub at /peptides plus per-peptide guides so you understand options before you commit",
    ],
    howItWorksParagraphs: [
      "Peptides are short amino-acid chains that signal specific pathways — recovery, sleep, skin, metabolism, libido, and more. At Hello Gorgeous, peptide therapy is medical: $49 consult, screening, prescription, hands-on injection training, and follow-up to adjust your protocol. Most clients self-administer small subcutaneous injections several times per week on a cycle Ryan sets based on your goals and labs.",
      isNaperville
        ? "Many Naperville clients pair peptide therapy with Morpheus8, GLP-1 weight loss, or BioTE hormone programs at the same Oswego address — one NP team follows you from consult through refills."
        : `Clients from ${city} often combine peptides with GLP-1, hormone therapy, or IV wellness at our Oswego clinic — one team, one medical record.`,
    ],
    whatToExpectSteps: [
      "$49 peptide consultation — goals, history, medications, and whether peptides fit (or if something else would serve you better).",
      "Labs when indicated — baseline work to dose safely and track response.",
      "Custom protocol from Ryan — specific peptide(s), dose, frequency, and cycle in writing.",
      "Hands-on training — how to store, inject, and what to report between visits.",
      "Ongoing follow-up — dose tweaks and refreshes as your body responds; peptide therapy is iterative.",
    ],
    pricing:
      "Consultation is $49; peptide medications are priced separately. Published starting rates from $149/mo (Sermorelin injectable); BPC-157 from $169/mo; Recovery Blend from $229/mo. Full menu at hellogorgeousmedspa.com/peptides#peptide-pricing. Transparent numbers before you start.",
    faqs: [
      {
        q: isNaperville
          ? "Where do Naperville clients get peptide therapy?"
          : `How far is Hello Gorgeous from ${city}?`,
        a: isNaperville
          ? "Hello Gorgeous Med Spa is at 74 W Washington St in downtown Oswego — about 15 minutes from south Naperville via Route 59 south or Route 34 west through Plainfield. Same-day and next-day $49 consults are often available."
          : `Our Oswego clinic at 74 W Washington St is ${drive} from ${city}. Many ${city} clients book same-day or next-day consults.`,
      },
      {
        q: "Which peptides do you offer?",
        a: "BPC-157, TB-500, Sermorelin, GHK-Cu, Tesamorelin, CJC-1295/Ipamorelin, PT-141, NAD+, glutathione, recovery blends (BPC/GHK-Cu/KPV/TB-500), and GLP-1 weight-loss options when clinically appropriate — see hellogorgeousmedspa.com/peptides for education and pricing.",
      },
      {
        q: "How much does peptide therapy cost?",
        a: "The NP consult is $49. Monthly peptide protocols start at $149/mo (e.g. Sermorelin); BPC-157 from $169/mo; multi-peptide Recovery Blend from $229/mo. We quote your exact protocol before you commit — no hidden fees.",
      },
      {
        q: "What conditions or goals can peptide therapy support?",
        a: "Common goals include injury and workout recovery, gut support, sleep quality, growth-hormone axis support, skin and hair health, libido, body composition, and longevity. We match peptides to your goals at the consult — not a one-size menu.",
      },
      {
        q: "Is peptide therapy safe?",
        a: "When prescribed by an NP and sourced from licensed US compounding pharmacies, peptide therapy has a strong safety profile. We do not sell or recommend gray-market research peptides.",
      },
      {
        q: "Do I need a consultation first?",
        a: "Yes — every peptide protocol starts with a medical evaluation. Book the $49 consult online at hellogorgeousmedspa.com/book or call (630) 636-6193.",
      },
    ],
    relatedServices: [
      "peptide-therapy-oswego",
      "glp-1-weight-loss-oswego",
      "nad-iv-oswego",
      ...(isNaperville ? (["biote-hormone-therapy-oswego"] as const) : []),
    ],
    closingCta: isNaperville
      ? "Ready to explore peptide therapy from Naperville? Book your $49 consult — we'll map the right protocol for your goals."
      : `Ready to explore peptide therapy from ${city}? Book your $49 consult — we'll map the right protocol for your goals.`,
  };
}

/** Satellite local SEO pages — peptide therapy near Naperville, Aurora, etc. */
export const PEPTIDE_CITY_PAGES: ServicePageData[] = PEPTIDE_CITIES.map((c) =>
  peptideCityPage(c.city, c.slug, c.drive, c.county, c.routeNote),
);

export const PEPTIDE_CITY_SLUGS = PEPTIDE_CITY_PAGES.map((p) => p.slug);
