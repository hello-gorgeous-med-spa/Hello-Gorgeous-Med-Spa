import type { Metadata } from "next";

export type FAQ = { question: string; answer: string };

export type Service = {
  slug: string;
  name: string;
  category: string;
  short: string;
  heroTitle: string;
  heroSubtitle: string;
  faqs: FAQ[];
};

export const SITE = {
  name: "Hello Gorgeous Med Spa",
  url: "https://hellogorgeousmedspa.com",
  description:
    "Luxury medical aesthetics in Oswego, IL. Botox/Dysport, dermal fillers, weight loss (GLP‑1), hormone therapy, PRF/PRP, and more.",
  phone: "+1-630-636-6193",
  email: "info@hellogorgeousmedspa.com",
  address: {
    streetAddress: "74 W. Washington St.",
    addressLocality: "Oswego",
    addressRegion: "IL",
    postalCode: "60543",
    addressCountry: "US",
  },
  // TODO: replace with precise coordinates for the address above
  geo: { latitude: 41.6828, longitude: -88.3515 },
  serviceAreas: ["Oswego, IL", "Naperville, IL", "Aurora, IL", "Plainfield, IL"],
} as const;

export const HOME_FAQS: readonly FAQ[] = [
  {
    question: "Where are you located?",
    answer:
      "Hello Gorgeous Med Spa is based in Oswego, IL and serves clients from nearby areas including Naperville, Aurora, and Plainfield.",
  },
  {
    question: "Do you offer consultations?",
    answer:
      "Yes. We recommend starting with a consultation so we can personalize your treatment plan, timing, and expected results.",
  },
  {
    question: "How do I book an appointment?",
    answer:
      "You can schedule from our Book page. If you have questions first, contact us and we’ll help you choose the right service.",
  },
] as const;

export const SERVICES: readonly Service[] = [
  {
    slug: "botox-dysport-jeuveau",
    name: "Botox, Dysport & Jeuveau",
    category: "Injectables",
    short:
      "Smooth fine lines and soften expression wrinkles with natural-looking results.",
    heroTitle: "Botox, Dysport & Jeuveau in Oswego, IL",
    heroSubtitle:
      "A precision approach to a refreshed look—subtle, balanced, and tailored to your face.",
    faqs: [
      {
        question: "How long does Botox/Dysport last?",
        answer:
          "Most clients see results for about 3–4 months, depending on metabolism, dosage, and treatment area.",
      },
      {
        question: "When will I see results?",
        answer:
          "You may start noticing changes in a few days, with full results typically visible around 10–14 days.",
      },
      {
        question: "Will I look frozen?",
        answer:
          "Our goal is natural movement and a refreshed look. Dosing and placement are customized to you.",
      },
    ],
  },
  {
    slug: "dermal-fillers",
    name: "Dermal Fillers",
    category: "Injectables",
    short: "Restore volume, refine contours, and enhance facial harmony.",
    heroTitle: "Dermal Fillers in Oswego, IL",
    heroSubtitle:
      "Strategic volume where you need it—cheeks, lips, jawline, and beyond.",
    faqs: [
      {
        question: "How long do fillers last?",
        answer: "Longevity varies by product and area, commonly 6–18 months.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Many people return to normal activities quickly. Swelling or bruising can occur and usually resolves within days.",
      },
      {
        question: "Can fillers be reversed?",
        answer:
          "Some hyaluronic acid fillers can be dissolved if needed. We’ll discuss options during your consult.",
      },
    ],
  },
  {
    slug: "lip-filler",
    name: "Lip Filler",
    category: "Injectables",
    short: "Soft, balanced lip enhancement designed for your facial harmony.",
    heroTitle: "Lip Filler in Oswego, IL",
    heroSubtitle:
      "A tailored approach to shape, hydration, and proportion—subtle and refined.",
    faqs: [
      {
        question: "How long does lip filler last?",
        answer: "Longevity varies by product and metabolism, often 6–12+ months.",
      },
      {
        question: "How much swelling should I expect?",
        answer:
          "Swelling is common for the first 24–72 hours and gradually improves over the first week.",
      },
      {
        question: "Can lips look natural?",
        answer:
          "Yes—natural results come from conservative dosing, thoughtful technique, and facial balance.",
      },
    ],
  },
  {
    slug: "weight-loss-therapy",
    name: "Weight Loss Therapy",
    category: "Wellness",
    short:
      "Provider-guided weight management with GLP‑1 support and lifestyle coaching.",
    heroTitle: "Weight Loss Therapy in Oswego, IL",
    heroSubtitle:
      "A medical approach to sustainable weight loss—progress tracking, guidance, and support.",
    faqs: [
      {
        question: "Who is a candidate for GLP‑1 therapy?",
        answer:
          "Eligibility depends on your health history and goals. We’ll evaluate candidacy during a medical consult.",
      },
      {
        question: "How quickly will I lose weight?",
        answer:
          "Results vary. Safe, sustainable progress is the goal—your plan is individualized.",
      },
      {
        question: "Do I need labs?",
        answer:
          "Often yes. We may recommend baseline labs and periodic monitoring depending on your plan.",
      },
    ],
  },
  {
    slug: "biote-hormone-therapy",
    name: "BioTE Hormone Therapy",
    category: "Wellness",
    short:
      "Personalized hormone optimization designed around your symptoms and labs.",
    heroTitle: "BioTE Hormone Therapy in Oswego, IL",
    heroSubtitle:
      "Feel like yourself again—energy, mood, sleep, and overall wellbeing support.",
    faqs: [
      {
        question: "What symptoms can hormone therapy help?",
        answer:
          "Common concerns include fatigue, sleep issues, mood changes, and weight changes. We’ll assess your situation in depth.",
      },
      {
        question: "Is lab work required?",
        answer:
          "Typically yes. Labs help guide safe, personalized dosing and monitoring.",
      },
      {
        question: "How long until I feel results?",
        answer:
          "Some people notice improvements within weeks, though timelines vary by individual and protocol.",
      },
    ],
  },
  {
    slug: "trt-replacement-therapy",
    name: "TRT Replacement Therapy",
    category: "Wellness",
    short:
      "Clinician-guided TRT evaluation and ongoing monitoring with a safety-first approach.",
    heroTitle: "TRT Replacement Therapy in Oswego, IL",
    heroSubtitle:
      "Focused on symptoms, lab data, and conservative, clinician-led decision-making.",
    faqs: [
      {
        question: "Is TRT right for me?",
        answer:
          "Eligibility depends on medical history, symptoms, and lab evaluation. A consultation is required for individualized guidance.",
      },
      {
        question: "Do I need labs?",
        answer:
          "Yes—lab work is typically required to evaluate candidacy and for ongoing monitoring.",
      },
      {
        question: "How often are follow-ups?",
        answer:
          "Follow-up cadence varies by plan and response; monitoring is part of a safe protocol.",
      },
    ],
  },
  {
    slug: "sermorelin-growth-peptide",
    name: "Sermorelin Growth Peptide",
    category: "Wellness",
    short:
      "Educational overview and clinician-guided evaluation for peptide-based wellness support.",
    heroTitle: "Sermorelin Growth Peptide in Oswego, IL",
    heroSubtitle:
      "Discuss goals, safety considerations, and next steps with a clinician.",
    faqs: [
      {
        question: "Is this a prescription therapy?",
        answer:
          "Peptide therapies may require medical evaluation and may be prescription-based depending on your plan and jurisdiction.",
      },
      {
        question: "Can you tell me what dose I need?",
        answer:
          "No—dosing is individualized and requires clinician oversight and monitoring.",
      },
      {
        question: "What’s the first step?",
        answer:
          "Book a consultation to discuss goals, history, and whether labs are needed.",
      },
    ],
  },
  {
    slug: "iv-therapy",
    name: "IV Therapy",
    category: "Wellness",
    short: "Hydration and wellness support with clinician-guided IV options.",
    heroTitle: "IV Therapy in Oswego, IL",
    heroSubtitle:
      "Support energy, hydration, and recovery with a safety-first approach.",
    faqs: [
      {
        question: "Is IV therapy safe?",
        answer:
          "IV therapy is generally well-tolerated but requires screening and oversight. We’ll review your history before treatment.",
      },
      {
        question: "How long does it take?",
        answer:
          "Many IV sessions take around 30–60 minutes, depending on the formulation and plan.",
      },
      {
        question: "Do I need to prepare?",
        answer:
          "Hydration and a light meal can help. We’ll provide individualized pre-visit guidance.",
      },
    ],
  },
  {
    slug: "vitamin-injections",
    name: "Vitamin Injections",
    category: "Wellness",
    short: "Wellness support injections with clinician screening and guidance.",
    heroTitle: "Vitamin Injections in Oswego, IL",
    heroSubtitle:
      "A quick, clinician-guided option for targeted wellness support.",
    faqs: [
      {
        question: "Which injection should I choose?",
        answer:
          "Selection depends on goals and medical history. We’ll review options during your visit.",
      },
      {
        question: "How often can I get injections?",
        answer:
          "Frequency varies based on the specific injection and your plan.",
      },
      {
        question: "Is screening required?",
        answer:
          "Yes—screening helps ensure safety and appropriate use.",
      },
    ],
  },
  {
    slug: "rf-microneedling",
    name: "RF Microneedling",
    category: "Aesthetics",
    short: "Texture, pores, and firmness support with RF-assisted microneedling.",
    heroTitle: "RF Microneedling in Oswego, IL",
    heroSubtitle:
      "A modern collagen-stimulating treatment designed for smoother, firmer-looking skin.",
    faqs: [
      {
        question: "How many sessions do I need?",
        answer:
          "Many protocols recommend a series; exact timing depends on goals and skin response.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Redness and mild swelling are common. Downtime varies, often a few days depending on settings and skin sensitivity.",
      },
      {
        question: "Who is a good candidate?",
        answer:
          "Candidacy depends on skin type, goals, and history. A consult helps personalize a plan.",
      },
    ],
  },
  {
    slug: "chemical-peels",
    name: "Chemical Peels",
    category: "Aesthetics",
    short: "Brighten, refine texture, and support clearer-looking skin.",
    heroTitle: "Chemical Peels in Oswego, IL",
    heroSubtitle:
      "A controlled exfoliation approach to support glow, tone, and texture.",
    faqs: [
      {
        question: "Will I peel?",
        answer:
          "It depends on the peel depth. Some peels cause little to no visible peeling; others do.",
      },
      {
        question: "How should I prepare?",
        answer:
          "We’ll advise on skincare prep and any products to pause ahead of time based on your plan.",
      },
      {
        question: "How often can I do peels?",
        answer:
          "Frequency varies by peel type and goals. Your provider will recommend a schedule.",
      },
    ],
  },
  {
    slug: "hydra-facial",
    name: "Hydra Facial",
    category: "Aesthetics",
    short: "Hydration-forward facial treatment to support glow and clarity.",
    heroTitle: "Hydra Facial in Oswego, IL",
    heroSubtitle:
      "A premium facial experience designed for refreshed, radiant-looking skin.",
    faqs: [
      {
        question: "Is there downtime?",
        answer:
          "Most people return to normal activities right away. Mild redness can occur.",
      },
      {
        question: "How often should I get facials?",
        answer:
          "Many clients choose monthly maintenance, but schedules vary by goals and skin needs.",
      },
      {
        question: "Can I combine this with other treatments?",
        answer:
          "Often yes—timing depends on your plan. We’ll recommend a safe sequence.",
      },
    ],
  },
  {
    slug: "geneo-facial",
    name: "Geneo Facial",
    category: "Aesthetics",
    short: "Facial technology designed to support glow, tone, and skin quality.",
    heroTitle: "Geneo Facial in Oswego, IL",
    heroSubtitle:
      "A modern facial approach for refreshed-looking skin with a luxury experience.",
    faqs: [
      {
        question: "What results can I expect?",
        answer:
          "Many people notice a glow and refreshed look quickly; longer-term improvement depends on maintenance and skincare plan.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Typically minimal. Mild redness can occur depending on sensitivity.",
      },
      {
        question: "How many treatments do I need?",
        answer:
          "Some clients do one for an event; others follow a series for ongoing goals.",
      },
    ],
  },
  {
    slug: "ipl-photofacial",
    name: "IPL Photofacial",
    category: "Aesthetics",
    short: "Target sun damage and redness with light-based skin support.",
    heroTitle: "IPL Photofacial in Oswego, IL",
    heroSubtitle:
      "A light-based approach designed to support clearer, more even-looking skin.",
    faqs: [
      {
        question: "How many sessions are typical?",
        answer:
          "Many people do a series for best results. Your provider will recommend based on goals and skin response.",
      },
      {
        question: "Do I need to avoid sun exposure?",
        answer:
          "Yes—sun avoidance and sunscreen are important before and after treatment.",
      },
      {
        question: "Is IPL right for every skin tone?",
        answer:
          "Candidacy depends on skin tone and history. A consult is required to confirm the safest option.",
      },
    ],
  },
  {
    slug: "laser-hair-removal",
    name: "Laser Hair Removal",
    category: "Aesthetics",
    short: "Reduce unwanted hair with a series-based laser approach.",
    heroTitle: "Laser Hair Removal in Oswego, IL",
    heroSubtitle:
      "A modern, series-based plan designed for smoother skin and reduced regrowth.",
    faqs: [
      {
        question: "How many sessions do I need?",
        answer:
          "Hair grows in cycles; most people need multiple sessions for best reduction.",
      },
      {
        question: "Is it painful?",
        answer:
          "Sensation varies. Many describe it as a quick snap. We’ll review comfort strategies.",
      },
      {
        question: "Can I do it on all skin tones?",
        answer:
          "Candidacy depends on skin tone, hair color, and device settings. We’ll evaluate during consult.",
      },
    ],
  },
  {
    slug: "kybella",
    name: "Kybella",
    category: "Aesthetics",
    short: "Non-surgical support for submental fullness (double chin).",
    heroTitle: "Kybella in Oswego, IL",
    heroSubtitle:
      "A clinician-guided approach to treat submental fullness with an individualized plan.",
    faqs: [
      {
        question: "How many treatments are needed?",
        answer:
          "Some clients need multiple sessions. Exact number depends on goals and anatomy.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Swelling is common after treatment and can last days to weeks. We’ll review what to expect.",
      },
      {
        question: "Who is a candidate?",
        answer:
          "Candidacy depends on anatomy and goals. A consultation is required.",
      },
    ],
  },
  {
    slug: "salmon-dna-glass-facial",
    name: "Salmon DNA Glass Facial",
    category: "Aesthetics",
    short: "A glow-forward facial concept designed for a ‘glass skin’ look.",
    heroTitle: "Salmon DNA Glass Facial in Oswego, IL",
    heroSubtitle:
      "Premium skincare-focused glow support with a luxury experience.",
    faqs: [
      {
        question: "Is this right for sensitive skin?",
        answer:
          "Candidacy varies. We’ll review your skin history and goals to recommend the safest option.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Typically minimal, though sensitivity can vary by individual and protocol.",
      },
      {
        question: "How often should I do it?",
        answer:
          "Frequency depends on goals and response. We’ll recommend a schedule during consult.",
      },
    ],
  },
  {
    slug: "alle-botox-rewards",
    name: "Allē Botox Rewards",
    category: "Programs",
    short: "Learn about Allē rewards and how to use them at your visit.",
    heroTitle: "Allē Botox Rewards in Oswego, IL",
    heroSubtitle:
      "A simple overview of rewards, eligibility, and how to apply benefits.",
    faqs: [
      {
        question: "Do you guarantee rewards coverage?",
        answer:
          "No—rewards are managed by the program provider. We can help explain typical steps and what to bring.",
      },
      {
        question: "How do I prepare?",
        answer:
          "Bring your account details/app and ask us any questions during check-in or consult.",
      },
      {
        question: "Can you enroll me?",
        answer:
          "Enrollment is typically completed by the patient through the program. We can guide you on where to start.",
      },
    ],
  },
  {
    slug: "ez-prf-gel",
    name: "EZ PRF Gel",
    category: "Regenerative",
    short:
      "Regenerative aesthetics support using your body’s own growth factors in a gel format.",
    heroTitle: "EZ PRF Gel in Oswego, IL",
    heroSubtitle:
      "A clinician-guided regenerative option designed for natural-looking rejuvenation.",
    faqs: [
      {
        question: "Is EZ PRF Gel the same as filler?",
        answer:
          "It’s different—PRF is derived from your own blood components. Your provider will explain how it’s used and what to expect.",
      },
      {
        question: "How many sessions are needed?",
        answer:
          "Protocols vary. Many people benefit from a series; we’ll recommend a plan during consult.",
      },
      {
        question: "Is there downtime?",
        answer:
          "Some swelling or bruising is possible. Downtime varies by area and treatment plan.",
      },
    ],
  },
  {
    slug: "prp",
    name: "PRP",
    category: "Regenerative",
    short: "Platelet-rich plasma treatments for targeted regenerative support.",
    heroTitle: "PRP in Oswego, IL",
    heroSubtitle:
      "Harness your body’s own growth factors for skin, hair, or targeted areas.",
    faqs: [
      {
        question: "What areas can PRP treat?",
        answer:
          "Common uses include skin rejuvenation and other targeted protocols depending on your goals and eligibility.",
      },
      {
        question: "How long until results show?",
        answer:
          "Regenerative treatments can take time; improvement is often gradual over weeks to months.",
      },
      {
        question: "Is PRP safe?",
        answer:
          "It uses your own blood-derived components and is generally well-tolerated. We’ll review contraindications and risks.",
      },
    ],
  },
  {
    slug: "prp-facial",
    name: "PRP Facial",
    category: "Regenerative",
    short: "Skin revitalization using PRP to support tone, texture, and glow.",
    heroTitle: "PRP Facial in Oswego, IL",
    heroSubtitle:
      "A regenerative facial approach designed to support brighter, healthier-looking skin.",
    faqs: [
      {
        question: "What’s the downtime?",
        answer:
          "Mild redness is common. Downtime varies depending on the technique used and your skin sensitivity.",
      },
      {
        question: "How many treatments are recommended?",
        answer:
          "Many people do a series for best results, then maintenance. We’ll tailor a plan to your goals.",
      },
      {
        question: "Can PRP be combined with other treatments?",
        answer:
          "Often yes, depending on your plan. We’ll advise on timing and sequencing.",
      },
    ],
  },
  {
    slug: "prp-joint-injections",
    name: "PRP Joint Injections",
    category: "Regenerative",
    short: "PRP-based regenerative support for targeted joint-focused protocols.",
    heroTitle: "PRP Joint Injections in Oswego, IL",
    heroSubtitle:
      "Clinician-led evaluation and education for regenerative joint support options.",
    faqs: [
      {
        question: "Is PRP a medical treatment?",
        answer:
          "Yes—PRP protocols involve medical evaluation. An in-person consult is required to determine appropriateness.",
      },
      {
        question: "Will this diagnose my condition?",
        answer:
          "No—this page is educational. Diagnosis requires clinician evaluation and appropriate workup.",
      },
      {
        question: "What’s the first step?",
        answer:
          "Book a consultation to discuss symptoms, history, and whether PRP is appropriate.",
      },
    ],
  },
  {
    slug: "prf-prp",
    name: "PRF / PRP",
    category: "Regenerative",
    short:
      "Harness your body’s own growth factors for skin and hair rejuvenation.",
    heroTitle: "PRF/PRP Treatments in Oswego, IL",
    heroSubtitle:
      "Regenerative aesthetics for brighter skin, improved texture, and targeted areas.",
    faqs: [
      {
        question: "What’s the difference between PRP and PRF?",
        answer:
          "Both use your own blood components; PRF is often processed differently and may release growth factors over a longer period.",
      },
      {
        question: "How many sessions will I need?",
        answer:
          "Many protocols recommend a series for best outcomes. We’ll create a plan based on your goals.",
      },
      {
        question: "Is it safe?",
        answer:
          "Because it uses your own blood-derived components, it’s generally well-tolerated. We’ll review risks and contraindications.",
      },
    ],
  },
] as const;

export function pageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = new URL(path, SITE.url).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${title} | ${SITE.name}`,
      description,
      siteName: SITE.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
    },
  };
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      ...SITE.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: SITE.serviceAreas.map((name) => ({ "@type": "City", name })),
  };
}

export function faqJsonLd(faqs: ReadonlyArray<FAQ>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

