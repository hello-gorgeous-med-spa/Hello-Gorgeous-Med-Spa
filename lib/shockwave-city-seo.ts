/**
 * FlowWave shockwave — per-city local SEO content (primary Fox Valley hubs).
 * Clinic address is always Oswego; city pages target "near me" searches.
 */

import { FLOWWAVE_FAQS } from "@/lib/flowwave-marketing";
import type { PrimaryCitySlug } from "@/lib/city-seo-tier";
import { PRIMARY_CITY_SLUGS } from "@/lib/city-seo-tier";

export type ShockwaveCitySeoContent = {
  slug: PrimaryCitySlug;
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

const CLINIC =
  "Hello Gorgeous Med Spa at 74 W. Washington Street in Oswego, IL";
const SERVICE_AREAS =
  "Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery, and Kendall County";

function pathFor(slug: PrimaryCitySlug): string {
  return `/shockwave-therapy-${slug}-il`;
}

function baseFaqs(city: string, localAngle: string): ShockwaveCitySeoContent["faqs"] {
  return [
    {
      question: `Where can I get shockwave therapy near ${city}, IL?`,
      answer: `${CLINIC} offers FlowWave FOCUS focused shockwave therapy. ${localAngle} We serve ${SERVICE_AREAS}.`,
    },
    {
      question: "What is FlowWave shockwave therapy?",
      answer:
        "FlowWave FOCUS uses focused acoustic waves to reach deep tissue — up to 12 cm — for musculoskeletal pain, recovery, and men's wellness. Sessions are non-invasive, drug-free, and typically 3–10 minutes per area.",
    },
    {
      question: `How much does shockwave therapy cost near ${city}?`,
      answer:
        "Intro sessions start at $175 per area and include NP screening. Package pricing is available — 6 sessions from $870 and 12 sessions from $1,500. Your provider maps a plan at your free consultation.",
    },
    {
      question: "Does shockwave therapy hurt?",
      answer:
        "Most clients describe a firm tapping sensation that is very tolerable. Your nurse practitioner adjusts intensity throughout the session.",
    },
    {
      question: "Is there downtime after shockwave?",
      answer:
        "No. You can return to normal activities immediately after treatment. Many clients follow a short weekly course depending on the area and goals.",
    },
    ...FLOWWAVE_FAQS.map((f) => ({ question: f.q, answer: f.a })),
  ];
}

const CITY_CONTENT: Record<PrimaryCitySlug, Omit<ShockwaveCitySeoContent, "slug" | "localSlug" | "path">> = {
  oswego: {
    cityLabel: "Oswego",
    metaTitle: "Shockwave Therapy Oswego IL | FlowWave FOCUS Pain Relief | Hello Gorgeous",
    metaDescription:
      "FlowWave FOCUS shockwave therapy in Oswego, IL — focused acoustic-wave treatment for knee, shoulder, back pain, sports recovery, and men's wellness. Non-invasive, 3–10 minute sessions. NP-directed.",
    keywords: [
      "shockwave therapy Oswego IL",
      "shockwave therapy near me",
      "focused shockwave Oswego",
      "FlowWave FOCUS Illinois",
      "acoustic wave therapy Oswego",
      "men's shockwave therapy Oswego",
      "knee pain shockwave Oswego",
    ],
    heroEyebrow: "FlowWave FOCUS · Oswego, IL",
    heroAccent: "Oswego & the Fox Valley",
    heroImageAlt: "FlowWave shockwave therapy for pain relief and recovery in Oswego IL",
    localLead:
      "Our clinic is in downtown Oswego — focused shockwave with full-authority nurse practitioners on site every day.",
    pricingHeading: "FlowWave pricing in Oswego",
    faqs: baseFaqs(
      "Oswego",
      "We are located in downtown Oswego at 74 W. Washington Street.",
    ),
  },
  naperville: {
    cityLabel: "Naperville",
    metaTitle: "Shockwave Therapy Near Naperville IL | FlowWave FOCUS | Hello Gorgeous",
    metaDescription:
      "FlowWave FOCUS shockwave therapy 15 minutes from Naperville, IL — deep-tissue pain relief, sports recovery, and men's wellness at Hello Gorgeous Med Spa in Oswego. NP-directed, intro $175.",
    keywords: [
      "shockwave therapy Naperville IL",
      "shockwave therapy near Naperville",
      "focused shockwave Naperville",
      "pain relief shockwave DuPage County",
      "FlowWave Naperville",
      "acoustic wave therapy near Naperville",
      "sports recovery shockwave Naperville",
    ],
    heroEyebrow: "15 min from Naperville · Oswego, IL",
    heroAccent: "Naperville & the Western Suburbs",
    heroImageAlt: "FlowWave shockwave therapy near Naperville IL at Hello Gorgeous Med Spa Oswego",
    localLead:
      "Many Naperville clients choose us for focused shockwave — about 15 minutes via Route 34 to our Oswego clinic, with NP-directed care and transparent pricing.",
    driveNote: "📍 74 W. Washington Street, Oswego — ~15 min from Naperville via Route 34",
    pricingHeading: "FlowWave pricing near Naperville",
    faqs: (() => {
      const all = baseFaqs(
        "Naperville",
        "We are a short drive from Naperville — about 15 minutes via Route 34.",
      );
      return [
        all[0]!,
        {
          question: "How far is Hello Gorgeous from Naperville for shockwave therapy?",
          answer:
            "About 15 minutes from downtown Naperville via Route 34 to our Oswego clinic. Many Naperville clients book same-week screening appointments.",
        },
        ...all.slice(1),
      ];
    })(),
  },
  aurora: {
    cityLabel: "Aurora",
    metaTitle: "Shockwave Therapy Near Aurora IL | FlowWave FOCUS | Hello Gorgeous",
    metaDescription:
      "FlowWave FOCUS shockwave therapy near Aurora, IL — focused acoustic-wave treatment for knee, shoulder, back pain, and recovery at Hello Gorgeous Med Spa in Oswego. ~10 min drive. NP-directed.",
    keywords: [
      "shockwave therapy Aurora IL",
      "shockwave therapy near Aurora",
      "focused shockwave Aurora",
      "FlowWave Aurora Illinois",
      "pain relief shockwave Kane County",
      "acoustic wave therapy Aurora",
      "men's shockwave Aurora IL",
    ],
    heroEyebrow: "~10 min from Aurora · Oswego, IL",
    heroAccent: "Aurora & the Fox Valley",
    heroImageAlt: "FlowWave shockwave therapy near Aurora IL at Hello Gorgeous Med Spa",
    localLead:
      "Aurora residents often visit our Oswego clinic for FlowWave FOCUS — a quick drive across the Fox Valley for NP-supervised shockwave without the downtown wait.",
    driveNote: "📍 74 W. Washington Street, Oswego — ~10 minutes from Aurora",
    pricingHeading: "FlowWave pricing near Aurora",
    faqs: (() => {
      const all = baseFaqs(
        "Aurora",
        "We are approximately 10 minutes from Aurora to our Oswego location.",
      );
      return [
        all[0]!,
        {
          question: "How far is the drive from Aurora to Hello Gorgeous for shockwave?",
          answer:
            "About 10 minutes from much of Aurora to our Oswego clinic at 74 W. Washington Street. Free NP screening is included with your intro session.",
        },
        ...all.slice(1),
      ];
    })(),
  },
  plainfield: {
    cityLabel: "Plainfield",
    metaTitle: "Shockwave Therapy Near Plainfield IL | FlowWave FOCUS | Hello Gorgeous",
    metaDescription:
      "FlowWave FOCUS shockwave therapy near Plainfield, IL — non-invasive pain relief and recovery at Hello Gorgeous Med Spa in Oswego. Short drive, NP-directed sessions from $175.",
    keywords: [
      "shockwave therapy Plainfield IL",
      "shockwave therapy near Plainfield",
      "focused shockwave Plainfield",
      "FlowWave Plainfield Illinois",
      "pain relief shockwave Will County",
      "acoustic wave therapy Plainfield",
      "knee pain shockwave Plainfield",
    ],
    heroEyebrow: "Near Plainfield · Oswego, IL",
    heroAccent: "Plainfield & Kendall County",
    heroImageAlt: "FlowWave shockwave therapy near Plainfield IL at Hello Gorgeous Med Spa",
    localLead:
      "Plainfield clients visit us in Oswego for focused shockwave — convenient for Kendall and Will County residents who want medical-grade screening and fast 3–10 minute sessions.",
    driveNote: "📍 74 W. Washington Street, Oswego — easy drive from Plainfield",
    pricingHeading: "FlowWave pricing near Plainfield",
    faqs: baseFaqs(
      "Plainfield",
      "We are a short drive from Plainfield to our Oswego med spa.",
    ),
  },
  yorkville: {
    cityLabel: "Yorkville",
    metaTitle: "Shockwave Therapy Near Yorkville IL | FlowWave FOCUS | Hello Gorgeous",
    metaDescription:
      "FlowWave FOCUS shockwave therapy near Yorkville, IL — deep-tissue pain relief, sports recovery, and men's wellness at Hello Gorgeous Med Spa in Oswego. Kendall County. NP-directed care.",
    keywords: [
      "shockwave therapy Yorkville IL",
      "shockwave therapy near Yorkville",
      "focused shockwave Yorkville",
      "FlowWave Yorkville Illinois",
      "pain relief shockwave Kendall County",
      "acoustic wave therapy Yorkville",
      "sports recovery shockwave Yorkville",
    ],
    heroEyebrow: "Kendall County · Oswego, IL",
    heroAccent: "Yorkville & Kendall County",
    heroImageAlt: "FlowWave shockwave therapy near Yorkville IL at Hello Gorgeous Med Spa",
    localLead:
      "Yorkville and Kendall County neighbors choose Hello Gorgeous in Oswego for FlowWave — focused shockwave with nurse practitioners who screen you like a medical practice.",
    driveNote: "📍 74 W. Washington Street, Oswego — serving Yorkville & Kendall County",
    pricingHeading: "FlowWave pricing near Yorkville",
    faqs: baseFaqs(
      "Yorkville",
      "We serve Yorkville and Kendall County from our Oswego clinic.",
    ),
  },
  montgomery: {
    cityLabel: "Montgomery",
    metaTitle: "Shockwave Therapy Near Montgomery IL | FlowWave FOCUS | Hello Gorgeous",
    metaDescription:
      "FlowWave FOCUS shockwave therapy near Montgomery, IL — focused acoustic-wave treatment for pain and recovery at Hello Gorgeous Med Spa in Oswego. Non-invasive, NP-directed, intro $175.",
    keywords: [
      "shockwave therapy Montgomery IL",
      "shockwave therapy near Montgomery",
      "focused shockwave Montgomery",
      "FlowWave Montgomery Illinois",
      "pain relief shockwave Fox Valley",
      "acoustic wave therapy Montgomery",
      "men's shockwave Montgomery IL",
    ],
    heroEyebrow: "Fox Valley · Oswego, IL",
    heroAccent: "Montgomery & Nearby",
    heroImageAlt: "FlowWave shockwave therapy near Montgomery IL at Hello Gorgeous Med Spa",
    localLead:
      "Montgomery and Fox Valley clients book FlowWave at our Oswego location — focused deep-tissue treatment with no downtime and free NP screening on your first visit.",
    driveNote: "📍 74 W. Washington Street, Oswego — serving Montgomery & the Fox Valley",
    pricingHeading: "FlowWave pricing near Montgomery",
    faqs: baseFaqs(
      "Montgomery",
      "We are a convenient drive from Montgomery to our Oswego med spa.",
    ),
  },
};

export function getShockwaveCitySeo(slug: PrimaryCitySlug): ShockwaveCitySeoContent {
  const block = CITY_CONTENT[slug];
  return {
    slug,
    localSlug: `${slug}-il`,
    path: pathFor(slug),
    ...block,
  };
}

export function parseShockwaveLocalSlug(localSlug: string): PrimaryCitySlug | null {
  const match = localSlug.match(/^([a-z-]+)-il$/);
  if (!match) return null;
  const slug = match[1] as PrimaryCitySlug;
  return PRIMARY_CITY_SLUGS.includes(slug) ? slug : null;
}

export const SHOCKWAVE_CITY_SEO_PAGES = PRIMARY_CITY_SLUGS.map(getShockwaveCitySeo);

/** Other primary hubs — for cross-links on each city page */
export function shockwaveCityCrossLinks(current: PrimaryCitySlug) {
  return SHOCKWAVE_CITY_SEO_PAGES.filter((p) => p.slug !== current).map((p) => ({
    href: p.path,
    label: p.cityLabel,
  }));
}
