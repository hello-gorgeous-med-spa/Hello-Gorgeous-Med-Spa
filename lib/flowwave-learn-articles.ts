/**
 * FlowWave Learn — patient education for shockwave therapy (/services/flowwave/learn/*).
 */

import {
  FLOWWAVE_INTRO_PRICE,
  FLOWWAVE_LEARN_PATH,
  FLOWWAVE_PATH,
  FLOWWAVE_START_PATH,
} from "@/lib/flowwave-marketing";

export type FlowwaveLearnTocItem = { id: string; label: string };

export type FlowwaveLearnSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type FlowwaveLearnArticle = {
  slug: string;
  path: string;
  category: string;
  categoryPath: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  updated: string;
  readTime: string;
  reviewedBy: string;
  heroImage: string;
  heroImageAlt: string;
  intro: string[];
  toc: FlowwaveLearnTocItem[];
  sections: FlowwaveLearnSection[];
  keyTakeaways: string[];
  faqs: Array<{ q: string; a: string }>;
  relatedLinks: Array<{ label: string; href: string; description?: string }>;
  cta: {
    title: string;
    body: string;
    href: string;
    label: string;
    secondaryHref?: string;
    secondaryLabel?: string;
  };
};

export const WHAT_IS_SHOCKWAVE_ARTICLE: FlowwaveLearnArticle = {
  slug: "what-is-shockwave-therapy",
  path: `${FLOWWAVE_LEARN_PATH}/what-is-shockwave-therapy`,
  category: "Shockwave Therapy",
  categoryPath: FLOWWAVE_PATH,
  title: "What is shockwave therapy?",
  subtitle:
    "Focused acoustic waves for deep-tissue pain, recovery, and men's wellness — explained in plain language",
  metaTitle: "What Is Shockwave Therapy? | FlowWave FOCUS Oswego IL | Hello Gorgeous",
  metaDescription:
    "Learn what shockwave therapy is, how focused acoustic waves work, what areas can be treated, session length, candidacy screening, and intro pricing at Hello Gorgeous Med Spa in Oswego, IL.",
  keywords: [
    "what is shockwave therapy",
    "shockwave therapy Oswego IL",
    "focused shockwave therapy",
    "FlowWave FOCUS",
    "acoustic wave therapy Illinois",
    "shockwave therapy near me",
    "STEMWAVE shockwave",
  ],
  updated: "2026-07-05",
  readTime: "7 min",
  reviewedBy: "Ryan Kent, FNP-BC",
  heroImage: "/images/flowwave/flowwave-recovery-banner.png",
  heroImageAlt: "FlowWave FOCUS shockwave therapy for pain and recovery — Hello Gorgeous Med Spa Oswego",
  intro: [
    "Shockwave therapy — also called focused extracorporeal shockwave therapy (ESWT) — uses high-energy acoustic pulses delivered through the skin to reach deep muscle, tendon, and joint tissue. At Hello Gorgeous Med Spa in Oswego, Illinois, we offer FlowWave FOCUS, a nurse-practitioner-directed program for musculoskeletal pain, sports recovery, and discreet men's wellness.",
    "This guide explains how shockwave works, what a session feels like, who may be a candidate, and how our intro special fits into a longer treatment plan. It is educational only — not a diagnosis or guarantee of results.",
  ],
  toc: [
    { id: "basics", label: "How shockwave works" },
    { id: "focus", label: "Focused vs radial shockwave" },
    { id: "treats", label: "What we treat" },
    { id: "session", label: "What to expect" },
    { id: "candidates", label: "Who is a candidate" },
    { id: "pricing", label: "Pricing & intro offer" },
    { id: "takeaways", label: "Key takeaways" },
    { id: "faq", label: "FAQ" },
  ],
  sections: [
    {
      id: "basics",
      title: "How does shockwave therapy work?",
      paragraphs: [
        "The device generates focused acoustic waves that travel into tissue up to about 12 cm deep — far beyond what heat, massage, or surface lasers typically reach. The mechanical stimulus may support blood flow and your body's natural repair response in tendons, muscles, and surrounding structures.",
        "Sessions are non-invasive and drug-free. There are no needles and no incision. Most appointments take 3–10 minutes per treatment area after your nurse practitioner maps the zone.",
      ],
    },
    {
      id: "focus",
      title: "FlowWave FOCUS — focused shockwave",
      paragraphs: [
        "Radial shockwave devices spread energy more superficially. FlowWave FOCUS uses focused shockwave technology (sometimes marketed under device names like STEMWAVE™) to concentrate energy at a defined depth — useful when pain originates in deeper tissue such as the hip, shoulder, or pelvic floor region.",
        "Your NP adjusts intensity during the session based on your comfort and clinical goals.",
      ],
    },
    {
      id: "treats",
      title: "Common treatment areas",
      paragraphs: [
        "Clients seek shockwave for persistent joint and soft-tissue complaints, post-workout recovery, and provider-directed men's wellness protocols. Every plan starts with screening — we do not treat through clothing or without a medical review.",
      ],
      bullets: [
        "Knees, shoulders, elbows, hips",
        "Low back and feet/ankles",
        "Hands, wrists, and sports overuse areas",
        "Men's wellness — private, NP-directed track",
      ],
    },
    {
      id: "session",
      title: "What a session feels like",
      paragraphs: [
        "Most people describe a firm tapping or pulsing sensation. It should be tolerable — your provider dials intensity up or down throughout. There is no required downtime; you can return to normal activity immediately afterward.",
        "Many clients follow a short course of weekly sessions. Your NP recommends a plan after your free screening consult.",
      ],
    },
    {
      id: "candidates",
      title: "Who may — and may not — be treated",
      paragraphs: [
        "Shockwave is not appropriate for everyone. Pregnancy, pacemakers, blood-thinning concerns, active infection in the treatment area, or metal implants directly in the path of the waves may mean you are not a candidate. That is why Hello Gorgeous screens every client before the first paid session.",
      ],
    },
    {
      id: "pricing",
      title: "Intro special & packages",
      paragraphs: [
        `New clients can start with our intro special: first session any area ${FLOWWAVE_INTRO_PRICE}, including NP screening. Standard single sessions are $175 per area; multi-session packages reduce the per-session rate for ongoing care.`,
        "Book online or scan the in-spa QR at /services/flowwave/start to claim the intro offer.",
      ],
    },
  ],
  keyTakeaways: [
    "Shockwave uses focused acoustic pulses to reach deep tissue — typically 3–10 minutes per area.",
    "FlowWave FOCUS at Hello Gorgeous is NP-directed with medical screening before treatment.",
    `Intro special: ${FLOWWAVE_INTRO_PRICE} first session any area in Oswego, IL.`,
    "Individual results vary; shockwave supports recovery — it is not a cure-all.",
  ],
  faqs: [
    {
      q: "Is shockwave therapy the same as ultrasound?",
      a: "No. Therapeutic ultrasound uses different energy and depth profiles. Shockwave delivers high-energy acoustic pulses designed for musculoskeletal and select wellness applications.",
    },
    {
      q: "Does shockwave hurt?",
      a: "Most clients find it tolerable — like firm tapping. Your nurse practitioner adjusts intensity throughout the session.",
    },
    {
      q: "How many sessions will I need?",
      a: "It depends on the area and your goals. Many clients complete a short weekly course; your NP outlines a plan at your screening visit.",
    },
    {
      q: "Where is Hello Gorgeous located?",
      a: "74 W. Washington Street, Oswego, IL 60543 — serving Fox Valley including Naperville, Aurora, Plainfield, Yorkville, and Montgomery.",
    },
  ],
  relatedLinks: [
    { label: "FlowWave shockwave therapy", href: FLOWWAVE_PATH, description: "Book & intake" },
    { label: "How FlowWave works", href: `${FLOWWAVE_LEARN_PATH}/how-flowwave-works`, description: "Patient journey" },
    { label: "Shockwave for pain & recovery", href: `${FLOWWAVE_LEARN_PATH}/shockwave-pain-recovery`, description: "Sports & joint focus" },
    { label: "Shockwave therapy Naperville IL", href: "/shockwave-therapy-naperville-il", description: "Local SEO hub" },
  ],
  cta: {
    title: "Try shockwave at Hello Gorgeous",
    body: `Intro special ${FLOWWAVE_INTRO_PRICE} first session · NP screening included · Oswego, IL`,
    href: FLOWWAVE_PATH,
    label: "Book FlowWave",
    secondaryHref: FLOWWAVE_START_PATH,
    secondaryLabel: "In-spa quick start",
  },
};

export const HOW_FLOWWAVE_WORKS_ARTICLE: FlowwaveLearnArticle = {
  slug: "how-flowwave-works",
  path: `${FLOWWAVE_LEARN_PATH}/how-flowwave-works`,
  category: "FlowWave",
  categoryPath: FLOWWAVE_PATH,
  title: "How FlowWave works",
  subtitle: "From free NP screening to your first focused shockwave session in Oswego",
  metaTitle: "How FlowWave Works | Shockwave Therapy Process | Hello Gorgeous Oswego",
  metaDescription:
    "Step-by-step: free consult, candidacy screening, 3–10 minute FlowWave FOCUS sessions, packages, and booking at Hello Gorgeous Med Spa in Oswego, Illinois.",
  keywords: [
    "how FlowWave works",
    "shockwave therapy process",
    "FlowWave FOCUS Oswego",
    "book shockwave therapy Illinois",
  ],
  updated: "2026-07-05",
  readTime: "5 min",
  reviewedBy: "Ryan Kent, FNP-BC",
  heroImage: "/images/flowwave/flowwave-device-banner.png",
  heroImageAlt: "FlowWave FOCUS device — shockwave therapy at Hello Gorgeous Med Spa",
  intro: [
    "FlowWave is Hello Gorgeous Med Spa's nurse-practitioner-directed shockwave program. Unlike walk-in spa gadgets, every client is screened for candidacy before treatment — because we operate as a medical practice.",
  ],
  toc: [
    { id: "step-1", label: "Free screening" },
    { id: "step-2", label: "Map the area" },
    { id: "step-3", label: "Focused session" },
    { id: "step-4", label: "Course & packages" },
    { id: "faq", label: "FAQ" },
  ],
  sections: [
    {
      id: "step-1",
      title: "Step 1 — Free NP screening",
      paragraphs: [
        "Book a consultation online or complete the FlowWave intake on our landing page. Your nurse practitioner reviews health history, medications, and contraindications before your first treatment.",
      ],
    },
    {
      id: "step-2",
      title: "Step 2 — Target the treatment zone",
      paragraphs: [
        "We identify the tissue to treat and set device parameters. For men's wellness protocols, visits are handled with full privacy and discretion.",
      ],
    },
    {
      id: "step-3",
      title: "Step 3 — 3–10 minute session",
      paragraphs: [
        "Focused acoustic waves are delivered to the mapped area. No needles, no downtime — most clients leave the same day and return weekly if a course is recommended.",
      ],
    },
    {
      id: "step-4",
      title: "Step 4 — Packages & follow-up",
      paragraphs: [
        `Start with the ${FLOWWAVE_INTRO_PRICE} intro special (any area), then choose single sessions or 6-, 12-, or 24-session packages for lower per-visit pricing. Your NP adjusts the plan based on response.`,
      ],
    },
  ],
  keyTakeaways: [
    "Medical screening comes first — always.",
    "Sessions are short, non-invasive, and typically weekly during a course.",
    `Intro special ${FLOWWAVE_INTRO_PRICE} · packages available for ongoing care.`,
  ],
  faqs: [
    {
      q: "How do I book?",
      a: "Visit /services/flowwave, /book, or scan the spa QR at /services/flowwave/start.",
    },
    {
      q: "Can I combine areas in one visit?",
      a: "Your NP will advise. Each area is typically billed and timed separately.",
    },
  ],
  relatedLinks: [
    { label: "What is shockwave therapy?", href: `${FLOWWAVE_LEARN_PATH}/what-is-shockwave-therapy` },
    { label: "Book FlowWave", href: FLOWWAVE_PATH },
    { label: "Shockwave Oswego IL", href: "/shockwave-therapy-oswego-il" },
  ],
  cta: {
    title: "Start with a free screening",
    body: "Book FlowWave FOCUS shockwave therapy in Oswego — intro special available for new clients.",
    href: "/book",
    label: "Book free consult",
    secondaryHref: FLOWWAVE_PATH,
    secondaryLabel: "FlowWave landing",
  },
};

export const SHOCKWAVE_PAIN_RECOVERY_ARTICLE: FlowwaveLearnArticle = {
  slug: "shockwave-pain-recovery",
  path: `${FLOWWAVE_LEARN_PATH}/shockwave-pain-recovery`,
  category: "Pain & Recovery",
  categoryPath: FLOWWAVE_PATH,
  title: "Shockwave for pain & sports recovery",
  subtitle: "When deep-tissue acoustic therapy may support joints, tendons, and post-workout recovery",
  metaTitle: "Shockwave for Pain & Recovery | FlowWave Oswego IL | Hello Gorgeous",
  metaDescription:
    "Focused shockwave for knee, shoulder, back, and sports recovery pain near Oswego, Naperville, and Aurora IL — NP-directed FlowWave FOCUS at Hello Gorgeous Med Spa.",
  keywords: [
    "shockwave therapy knee pain",
    "shockwave shoulder pain Oswego",
    "sports recovery shockwave Illinois",
    "deep tissue pain relief Fox Valley",
  ],
  updated: "2026-07-05",
  readTime: "6 min",
  reviewedBy: "Ryan Kent, FNP-BC",
  heroImage: "/images/flowwave/flowwave-zones-banner.png",
  heroImageAlt: "Treatment zones for FlowWave shockwave therapy",
  intro: [
    "Persistent joint or tendon pain can limit training, work, and daily life. FlowWave FOCUS targets tissue up to 12 cm deep — often beyond what massage or surface modalities reach. This article covers common pain and recovery use cases; your NP determines candidacy individually.",
  ],
  toc: [
    { id: "areas", label: "Common pain areas" },
    { id: "recovery", label: "Athletes & recovery" },
    { id: "expect", label: "Realistic expectations" },
    { id: "local", label: "Fox Valley access" },
    { id: "faq", label: "FAQ" },
  ],
  sections: [
    {
      id: "areas",
      title: "Joints & soft tissue we often see",
      paragraphs: [
        "Clients with chronic knee, shoulder, elbow, hip, or foot complaints — when medically appropriate — may discuss shockwave after screening. We do not treat acute fractures, active infections, or unstable joints without specialist clearance.",
      ],
      bullets: ["Plantar fasciitis & heel pain", "Tennis/golfer's elbow patterns", "Rotator cuff region discomfort", "Hip & low-back muscular pain"],
    },
    {
      id: "recovery",
      title: "Recovery & performance",
      paragraphs: [
        "Weekend warriors and competitive athletes use shockwave between training blocks when cleared by their provider. Sessions are short enough to fit a lunch break — no downtime required.",
      ],
    },
    {
      id: "expect",
      title: "What shockwave can — and cannot — do",
      paragraphs: [
        "Shockwave may support your body's repair response; it is not a replacement for surgery, physical therapy, or medical diagnosis. Results vary. Some clients notice changes over a course of weeks; others may need alternative care.",
      ],
    },
    {
      id: "local",
      title: "Convenient for Fox Valley",
      paragraphs: [
        "Hello Gorgeous is in downtown Oswego — a short drive from Naperville, Aurora, Plainfield, Yorkville, and Montgomery. Local city guides: /shockwave-therapy-naperville-il and sibling pages.",
      ],
    },
  ],
  keyTakeaways: [
    "Focused shockwave reaches deeper tissue than most spa modalities.",
    "NP screening required — not everyone is a candidate.",
    `Intro ${FLOWWAVE_INTRO_PRICE} · Oswego clinic · Fox Valley local SEO pages for each city.`,
  ],
  faqs: [
    {
      q: "Should I stop physical therapy?",
      a: "Only if your medical providers agree. Shockwave can complement PT — not automatically replace it.",
    },
    {
      q: "Is this covered by insurance?",
      a: "FlowWave is cash-pay at Hello Gorgeous. HSA/FSA cards are often accepted; confirm with your plan.",
    },
  ],
  relatedLinks: [
    { label: "Shockwave Naperville IL", href: "/shockwave-therapy-naperville-il" },
    { label: "What is shockwave?", href: `${FLOWWAVE_LEARN_PATH}/what-is-shockwave-therapy` },
    { label: "Book intro session", href: FLOWWAVE_PATH },
  ],
  cta: {
    title: "Book pain & recovery screening",
    body: `FlowWave intro ${FLOWWAVE_INTRO_PRICE} · NP-directed · Oswego IL`,
    href: "/book",
    label: "Book now",
  },
};

export const SHOCKWAVE_MENS_WELLNESS_ARTICLE: FlowwaveLearnArticle = {
  slug: "shockwave-mens-wellness",
  path: `${FLOWWAVE_LEARN_PATH}/shockwave-mens-wellness`,
  category: "Men's Wellness",
  categoryPath: FLOWWAVE_PATH,
  title: "Shockwave for men's wellness",
  subtitle: "Private, nurse-practitioner-directed focused shockwave — handled with full discretion",
  metaTitle: "Men's Shockwave Therapy | Private FlowWave Oswego IL | Hello Gorgeous",
  metaDescription:
    "Discreet men's wellness shockwave therapy with NP oversight at Hello Gorgeous Med Spa in Oswego, IL. Private scheduling, medical screening, Fox Valley local care.",
  keywords: [
    "men's shockwave therapy Illinois",
    "private shockwave Oswego",
    "men's wellness acoustic wave",
    "FlowWave men's program",
  ],
  updated: "2026-07-05",
  readTime: "5 min",
  reviewedBy: "Ryan Kent, FNP-BC",
  heroImage: "/images/flowwave/flowwave-mens-banner.png",
  heroImageAlt: "Private men's wellness shockwave — Hello Gorgeous Med Spa",
  intro: [
    "Hello Gorgeous offers a provider-directed men's wellness shockwave track using FlowWave FOCUS technology. Visits are private, medically screened, and scheduled like any other clinical service — not a retail spa add-on.",
    "This page explains the process and confidentiality standards. It does not promise specific sexual health outcomes; candidacy and plans are determined individually after intake.",
  ],
  toc: [
    { id: "approach", label: "Our approach" },
    { id: "privacy", label: "Privacy & discretion" },
    { id: "process", label: "The process" },
    { id: "programs", label: "Programs & pricing" },
    { id: "faq", label: "FAQ" },
  ],
  sections: [
    {
      id: "approach",
      title: "Medical oversight — not a gimmick",
      paragraphs: [
        "Men's wellness shockwave is ordered and supervised by our nurse practitioners after reviewing health history and contraindications. We operate as Hello Gorgeous Med Spa — a real clinic at 74 W. Washington, Oswego.",
      ],
    },
    {
      id: "privacy",
      title: "Discretion built in",
      paragraphs: [
        "Scheduling, checkout, and charting follow the same HIPAA-aware standards as our other medical services. You will not be treated in a public room or without screening.",
      ],
    },
    {
      id: "process",
      title: "What to expect",
      paragraphs: [
        "After approval, focused acoustic pulses are delivered to mapped tissue in short sessions, typically on a multi-week course. Your NP explains frequency, intensity, and follow-up.",
      ],
    },
    {
      id: "programs",
      title: "Men's program pricing",
      paragraphs: [
        "Dedicated 6- and 12-session men's wellness programs are priced separately from musculoskeletal intro offers. Discuss packages privately during your consult — published men's program tiers start at $1,800 for 6 sessions.",
      ],
    },
  ],
  keyTakeaways: [
    "NP-directed, private men's wellness shockwave in Oswego.",
    "Medical screening required; not appropriate for all clients.",
    "Discreet scheduling through Hello Gorgeous — call (630) 636-6193.",
  ],
  faqs: [
    {
      q: "Is men's shockwave confidential?",
      a: "Yes. We treat men's wellness like any clinical service — private rooms, provider oversight, and discreet front-desk handling.",
    },
    {
      q: "Does the $49 intro apply to men's wellness?",
      a: "The intro special applies to musculoskeletal areas. Men's wellness programs use dedicated multi-session pricing — ask during your private consult.",
    },
  ],
  relatedLinks: [
    { label: "Gentlemen's Club", href: "/gentlemens-club", description: "Men's optimization hub" },
    { label: "How FlowWave works", href: `${FLOWWAVE_LEARN_PATH}/how-flowwave-works` },
    { label: "Book consult", href: "/book" },
  ],
  cta: {
    title: "Schedule a private consult",
    body: "Men's wellness shockwave — NP-directed at Hello Gorgeous Med Spa, Oswego IL.",
    href: "/book",
    label: "Book discreet consult",
    secondaryHref: FLOWWAVE_PATH,
    secondaryLabel: "FlowWave overview",
  },
};

export const FLOWWAVE_LEARN_ARTICLES: FlowwaveLearnArticle[] = [
  WHAT_IS_SHOCKWAVE_ARTICLE,
  HOW_FLOWWAVE_WORKS_ARTICLE,
  SHOCKWAVE_PAIN_RECOVERY_ARTICLE,
  SHOCKWAVE_MENS_WELLNESS_ARTICLE,
];

export function getFlowwaveLearnArticle(slug: string): FlowwaveLearnArticle | undefined {
  return FLOWWAVE_LEARN_ARTICLES.find((a) => a.slug === slug);
}
