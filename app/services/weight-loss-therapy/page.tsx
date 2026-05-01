import type { Metadata } from "next";

import { WeightLossTherapyPageContent } from "@/components/services/WeightLossTherapyPageContent";
import {
  SITE,
  SITE_OG_IMAGE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
} from "@/lib/seo";

const PAGE_PATH = "/services/weight-loss-therapy";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

export const WEIGHT_LOSS_FAQS = [
  {
    question: "What weight-loss medications do you offer in Oswego?",
    answer:
      "We offer medically supervised GLP-1 therapy programs including semaglutide and tirzepatide (the same molecules in Wegovy, Ozempic, Zepbound, and Mounjaro). Programs are dispensed through licensed compounding pharmacies and supervised by our medical team. Pricing and protocols are reviewed at your first consult.",
  },
  {
    question: "How is your program different from buying it online?",
    answer:
      "You see a real medical provider before, during, and after — not a chatbot. You get an in-person body composition scan, a labs panel before injection, side-effect coaching, and a check-in cadence built around your dose. Online-only programs skip all of that and ship vials. We don't.",
  },
  {
    question: "How much weight will I lose?",
    answer:
      "Published clinical data shows 15–22% total body weight loss over 12–18 months on tirzepatide and 12–17% on semaglutide. Real-world results depend on dose adherence, protein intake, sleep, and activity. We track and adjust monthly. We do not promise a number — we promise consistent supervision.",
  },
  {
    question: "How much does the program cost?",
    answer:
      "GLP-1 programs typically run $300–$500 per month all-in (medication + visit + labs at intake). We don't bill insurance for compounded therapy, so the price you see is the price you pay — no surprise pharmacy bills. Some patients are eligible for branded coverage and we'll route you correctly at consult.",
  },
  {
    question: "What does my first visit look like?",
    answer:
      "60-minute new-patient visit: medical history, vitals, body composition scan, screening labs ordered if not on file, conversation about your goals, and a clinical decision on starting dose. We send the prescription that day if appropriate. First injection happens at visit 2 (about a week later) so we can demonstrate the technique in person.",
  },
  {
    question: "Do I need labs before starting?",
    answer:
      "Yes. Standard panel includes A1C, fasting glucose, lipid panel, thyroid (TSH), kidney + liver function, lipase, and pregnancy test where applicable. We accept recent labs from your PCP if drawn within 90 days; otherwise we order. Labs are reviewed before any prescription.",
  },
  {
    question: "What are the side effects?",
    answer:
      "Most common: nausea, fatigue, mild constipation, occasional reflux — almost all resolve as your body adjusts to the dose. Less common: gallbladder symptoms, pancreatitis (rare), injection-site reaction. We coach every patient on how to dose-step to minimize side effects, and we adjust the protocol if anything is not tolerable.",
  },
  {
    question: "Who is not a candidate?",
    answer:
      "Pregnancy, breastfeeding, personal/family history of medullary thyroid carcinoma or MEN2 syndrome, active pancreatitis, type 1 diabetes (not formally contraindicated but better managed by endocrinology), and a few medication interactions. We screen at consult — never assume disqualification before talking to us.",
  },
  {
    question: "How are injections given?",
    answer:
      "Once-weekly subcutaneous injection (abdomen, thigh, or upper arm) using a fine-gauge insulin-style needle. The actual injection is faster than a flu shot and most patients describe it as a small pinch. We teach you in person and send a step-by-step video with your kit.",
  },
  {
    question: "What if I plateau or stop losing?",
    answer:
      "Plateaus are normal around 6–9 months and 12–14 months. We respond by reviewing protein intake, resistance training, sleep, dose timing, and — if appropriate — dose adjustment. We do not just keep raising the dose. The goal is sustainable weight loss with the lowest effective amount.",
  },
  {
    question: "What happens when I stop?",
    answer:
      "Some weight regain is expected if no maintenance plan is in place — the medication is treating a chronic condition. We taper, transition to a maintenance dose, or move you to a non-GLP-1 maintenance protocol depending on your goals. Many patients stay on a low maintenance dose long-term; some come off entirely. Either is okay — we plan it together.",
  },
  {
    question: "Can I combine GLP-1 with other treatments here?",
    answer:
      "Yes — a lot of patients do. Common combos: GLP-1 + Morpheus8 to tighten the skin during fat loss (prevents the loose-skin look), GLP-1 + B12 / lipotropic injections to support energy, GLP-1 + biote hormone optimization for women in perimenopause. We coordinate the schedule so nothing competes.",
  },
];

const baseMeta = pageMetadata({
  title: "Medical Weight Loss Oswego IL | Semaglutide & Tirzepatide | Hello Gorgeous Med Spa",
  description:
    "Medically supervised GLP-1 weight-loss therapy in Oswego, IL — semaglutide & tirzepatide programs from $300/mo with real provider visits, labs, and body composition scans. Serving Naperville, Aurora, Plainfield, Yorkville.",
  path: PAGE_PATH,
  keywords: [
    "weight loss Oswego IL",
    "semaglutide Oswego",
    "tirzepatide Oswego",
    "GLP-1 weight loss Naperville",
    "weight loss injection near me",
    "medical weight loss Aurora IL",
    "Ozempic alternative Oswego",
    "Wegovy Oswego",
    "Zepbound Oswego",
    "Mounjaro Oswego",
    "weight loss clinic Plainfield",
    "best weight loss program Illinois",
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
        alt: "Hello Gorgeous Med Spa — Medical Weight Loss Oswego IL",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [SITE_OG_IMAGE],
  },
};

export default function WeightLossTherapyServicePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "Weight Loss Therapy", url: PAGE_URL },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(WEIGHT_LOSS_FAQS, PAGE_URL)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalTherapy",
            name: "Medically Supervised Weight Loss Therapy (GLP-1)",
            relevantSpecialty: "https://schema.org/MedicalSpecialty",
            indication: [
              "Obesity (BMI ≥ 30)",
              "Overweight (BMI ≥ 27) with weight-related condition",
            ],
            adverseOutcome: [
              "Nausea",
              "Fatigue",
              "Constipation",
              "Reflux",
              "Gallbladder symptoms (less common)",
            ],
            contraindication: [
              "Pregnancy or breastfeeding",
              "Personal or family history of medullary thyroid carcinoma",
              "MEN2 syndrome",
              "Active pancreatitis",
            ],
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

      <WeightLossTherapyPageContent />
    </>
  );
}
