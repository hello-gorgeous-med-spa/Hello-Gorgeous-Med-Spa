import type { Metadata } from "next";

import { BotoxPageContent } from "@/components/services/BotoxPageContent";
import {
  SITE,
  SITE_OG_IMAGE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
} from "@/lib/seo";

const BOTOX_PATH = "/services/botox";
const PAGE_URL = `${SITE.url}${BOTOX_PATH}`;

export const BOTOX_FAQS = [
  {
    question: "How much does Botox cost in Oswego, IL?",
    answer:
      "At Hello Gorgeous Med Spa we price Botox per unit so you only pay for what you actually need. Most clients use 20–40 units per session. New patients often ask for a complimentary 15-minute consult so we can quote you exactly before any needle moves.",
  },
  {
    question: "How long does Botox last?",
    answer:
      "Typically 3–4 months for first-time clients, longer with consistent maintenance. Active expressions (forehead, frown lines, crow's feet) and how much you exercise both shorten duration. We'll book you a 12-week follow-up so we never let your last results fade fully.",
  },
  {
    question: "Will Botox make me look frozen or fake?",
    answer:
      "Not when it's dosed correctly. Our injectors at Hello Gorgeous train for nuance — softening dynamic lines while keeping every expression natural. The 'frozen' look comes from too many units in too few muscles. We do the opposite: precise mapping, conservative dosing, real movement.",
  },
  {
    question: "Does Botox hurt?",
    answer:
      "Most clients describe it as a few quick pinches that take 5–10 minutes total. We use ultra-fine 32-gauge needles, ice for sensitive areas, and a topical option for first-timers. Numbing isn't usually necessary.",
  },
  {
    question: "How long until I see results?",
    answer:
      "Subtle softening starts around day 3–4. Full results land at day 10–14. We follow up at two weeks; if anything needs a touch-up to even out, it's free during that window.",
  },
  {
    question: "Can I exercise after Botox?",
    answer:
      "We ask you to skip strenuous workouts, hot yoga, and lying flat for 4 hours after your appointment. Walks and normal activity are fine. After 24 hours: back to anything.",
  },
  {
    question: "Is Botox safe?",
    answer:
      "Yes — Botox has been FDA-approved for cosmetic use since 2002 and millions of treatments are performed every year. The biggest safety variable is who's injecting. Every injection at Hello Gorgeous is performed by a licensed Illinois medical professional.",
  },
  {
    question: "What does Botox treat besides forehead lines?",
    answer:
      "Forehead lines, '11s' between the brows, crow's feet, bunny lines on the nose, gummy smiles, lip flips, jaw slimming (masseter), neck bands, and underarm sweating (hyperhidrosis). We also do preventative Botox for clients in their 20s and early 30s who want to delay etched-in lines.",
  },
  {
    question: "What's the difference between Botox, Dysport, and Xeomin?",
    answer:
      "All three are neuromodulators that relax targeted muscles. Botox is the most widely studied. Dysport tends to spread slightly more (great for forehead) and may onset 1–2 days faster. Xeomin has no carrier protein, which can help patients who've developed resistance to Botox. We carry all three at Hello Gorgeous and pick based on your face — not the brand.",
  },
  {
    question: "Can I get Botox while breastfeeding or pregnant?",
    answer:
      "We don't inject Botox during pregnancy or while nursing. There isn't enough safety data, so we err on the side of caution. We'll happily book you for after — and most clients say returning post-baby is the best gift to themselves.",
  },
  {
    question: "How is Hello Gorgeous different from a chain med spa for Botox?",
    answer:
      "We're locally owned in Oswego, every injector is in-house and licensed in Illinois, and we never up-sell. You get the dose your face actually needs — not the biggest invoice. Plus same-week appointments, evening hours, and a real follow-up call after your first visit.",
  },
  {
    question: "Do you offer Botox specials or memberships?",
    answer:
      "Yes — ask about our preferred-pricing tier for clients on a 12-week maintenance schedule, plus seasonal promos via our Square mailing list. New clients can sign up at checkout.",
  },
];

const baseMeta = pageMetadata({
  title: "Botox Oswego IL | Hello Gorgeous Med Spa — Natural Results, Same-Week Booking",
  description:
    "Botox in Oswego, IL by licensed injectors at Hello Gorgeous Med Spa. Per-unit pricing, free 15-minute consults, same-week appointments. Serving Naperville, Aurora, Plainfield, Yorkville and Kendall County.",
  path: BOTOX_PATH,
  keywords: [
    "Botox Oswego IL",
    "Botox near me",
    "Botox Naperville",
    "Botox Aurora IL",
    "Botox Plainfield",
    "preventative Botox Oswego",
    "Dysport Oswego",
    "Xeomin Oswego",
    "med spa Botox Kendall County",
    "best Botox Illinois",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Hello Gorgeous Med Spa — Botox Oswego IL",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [SITE_OG_IMAGE],
  },
};

export default function BotoxServicePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "Botox", url: PAGE_URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(BOTOX_FAQS, PAGE_URL)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: "Botox Cosmetic Injections",
            procedureType: "https://schema.org/NoninvasiveProcedure",
            bodyLocation: "Face",
            preparation:
              "Avoid blood thinners (aspirin, ibuprofen, fish oil) 48 hours before treatment. Skip alcohol the night before. Eat before your appointment to reduce bruising.",
            followup:
              "Two-week follow-up included. Free touch-ups within 14 days if asymmetry is observed.",
            performer: {
              "@type": "MedicalBusiness",
              name: SITE.name,
              url: SITE.url,
              telephone: SITE.phone,
            },
            url: PAGE_URL,
          }),
        }}
      />

      <BotoxPageContent />
    </>
  );
}
