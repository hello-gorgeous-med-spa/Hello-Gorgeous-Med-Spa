import type { Metadata } from "next";

import { MicroneedlingRfPageContent } from "@/components/services/MicroneedlingRfPageContent";
import {
  SITE,
  SITE_OG_IMAGE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
} from "@/lib/seo";

const PAGE_PATH = "/services/microneedling-rf";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

export const MICRONEEDLING_RF_FAQS = [
  {
    question: "What is RF microneedling?",
    answer:
      "RF (radiofrequency) microneedling combines ultra-fine needles with heat energy. The needles create thousands of microchannels in the skin, while the RF heats the deeper layers — triggering the strongest collagen and elastin response any non-surgical device can produce. Translation: real skin tightening, lifting, and texture without a knife.",
  },
  {
    question: "How is RF microneedling different from regular microneedling?",
    answer:
      "Traditional microneedling only goes 1–2mm deep with no heat. RF microneedling reaches up to 8mm and adds bipolar heat — that's where actual lifting and fat-pad shrinking happen. Standard microneedling improves texture; RF microneedling reshapes the face and body.",
  },
  {
    question: "Which RF microneedling device do you use in Oswego?",
    answer:
      "We run Morpheus8 by InMode — the gold standard, plus the deeper Morpheus8 Burst for body contouring at up to 8mm. We're the only med spa in the area with the full Burst configuration. If you want details specifically on Morpheus8, our deep-dive page covers depths, probes, and Burst settings.",
  },
  {
    question: "What can RF microneedling treat?",
    answer:
      "Acne scars, fine lines, deep wrinkles, sagging jowls, neck laxity, double chin, stretch marks, sun damage, large pores, hormonal melasma (carefully selected), arms, knees, abdomen — face and body. It's one of the few treatments that can both tighten and dissolve unwanted fat in the right zones.",
  },
  {
    question: "How many treatments do I need to see results?",
    answer:
      "Most patients book a series of 3 sessions, 4–6 weeks apart. You'll notice texture improvements after one session; full collagen remodeling continues for 3–6 months after your last treatment. We re-photograph at every visit so the progress is visible, not vibes.",
  },
  {
    question: "How much does RF microneedling cost in Oswego?",
    answer:
      "Single-area sessions typically run $600–$1,200 depending on size and depth. Full-face packages of 3 are $1,800–$2,800. Body areas (abdomen, arms, neck) are quoted at consult. We never discount our Morpheus8 — but we do bundle it with PRP/PRF, peels, and Botox at preferred pricing.",
  },
  {
    question: "Does RF microneedling hurt?",
    answer:
      "We numb you for a full 45–60 minutes with medical-grade topical numbing before treatment. Most patients describe a feeling of warmth and pressure. Body areas can feel more intense; we never push past your tolerance. After the session, we apply cool compresses and post-care.",
  },
  {
    question: "What is the downtime?",
    answer:
      "Expect 2–5 days of redness and pinpoint marks (looks like a sunburn). Mild swelling is normal day 1–2. Most clients are back to work in 24–48 hours and can wear makeup at 24h. Body treatments are usually back to gym after 5 days.",
  },
  {
    question: "Is RF microneedling safe for darker skin tones?",
    answer:
      "Yes — that's one of the biggest advantages over lasers. Because RF energy bypasses melanin, RF microneedling is safe for Fitzpatrick types I through VI. We adjust depth and energy based on your skin, not on the chart.",
  },
  {
    question: "Can I combine RF microneedling with other treatments?",
    answer:
      "Yes — and we usually do. Most popular combos: Morpheus8 + PRP/PRF for hair regrowth and fast healing, Morpheus8 + Botox for full facial rejuvenation, Morpheus8 + chemical peel for tone correction, Morpheus8 + CO₂ laser (in stages) for the maximum non-surgical reset.",
  },
  {
    question: "Who shouldn't get RF microneedling?",
    answer:
      "Active pregnancy, active herpes outbreak in the treatment area, active acne breakout we haven't cleared, certain electronic implants, recent isotretinoin use within 6 months, or active infection. We screen everyone at consult — no surprises at the chair.",
  },
  {
    question: "How long do RF microneedling results last?",
    answer:
      "1–2 years on the face with healthy skincare. Body results last as long as your weight stays stable. Most clients book a single maintenance session every 12–18 months. Aging continues — but RF microneedling resets the clock you're aging from.",
  },
];

const baseMeta = pageMetadata({
  title: "RF Microneedling Oswego IL | Morpheus8 Skin Tightening | Hello Gorgeous Med Spa",
  description:
    "RF microneedling in Oswego, IL with Morpheus8 by InMode — up to 8mm deep for real skin tightening, acne scars, jowls, neck, body. Safe for all skin tones. Same-week booking. Serving Naperville, Aurora, Plainfield, Yorkville.",
  path: PAGE_PATH,
  keywords: [
    "RF microneedling Oswego IL",
    "RF microneedling near me",
    "Morpheus8 Oswego",
    "Morpheus8 Naperville",
    "skin tightening Oswego",
    "acne scar treatment Oswego",
    "non-surgical facelift Oswego",
    "Morpheus8 Aurora IL",
    "radiofrequency microneedling Plainfield",
    "best Morpheus8 Illinois",
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
        alt: "Hello Gorgeous Med Spa — RF Microneedling Oswego IL",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [SITE_OG_IMAGE],
  },
};

export default function MicroneedlingRfServicePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "RF Microneedling", url: PAGE_URL },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(MICRONEEDLING_RF_FAQS, PAGE_URL)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: "Radiofrequency Microneedling (Morpheus8)",
            procedureType: "https://schema.org/NoninvasiveProcedure",
            bodyLocation: ["Face", "Neck", "Abdomen", "Arms", "Knees"],
            preparation:
              "Avoid retinols and acids 5–7 days prior. Discontinue blood thinners (with MD approval) 48 hours prior. No active herpes outbreak in treatment area. Arrive with clean skin, no makeup.",
            followup:
              "3-session series spaced 4–6 weeks apart. Sun protection mandatory between sessions. Results photographed at every visit.",
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

      <MicroneedlingRfPageContent />
    </>
  );
}
