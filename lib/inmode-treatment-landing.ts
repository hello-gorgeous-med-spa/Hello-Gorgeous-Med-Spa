import {
  MORPHEUS8_TREATMENT_VIDEO,
  MORPHEUS8_UNDERARM_TREATMENT_IMAGE,
  QUANTUM_RF_PROCEDURE_IMAGE,
  QUANTUM_RF_RYAN_ACTION_IMAGE,
  SOLARIA_TREATMENT_IMAGE,
} from "@/lib/founder-credentials";
import type { ServiceMenuManufacturerOverview } from "@/lib/service-menu-types";

export type InModeTreatmentFaq = { q: string; a: string };

export type InModeTreatmentRelated = {
  href: string;
  eyebrow: string;
  title: string;
  blurb: string;
};

export type InModeTreatmentLandingContent = {
  slug: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumbName: string;
  /** Locality line above H1 */
  locality: string;
  /** Product name in hero (serif) */
  productName: string;
  /** Accent word(s) in H1, optional */
  productAccent?: string;
  heroSubhead: string;
  heroImage: string;
  heroImageAlt: string;
  /** Soft pricing line under hero CTAs */
  priceLine: string;
  priceNote?: string;
  whatTitle: string;
  whatBody: string[];
  treats: string[];
  treatsIntro?: string;
  howTitle: string;
  howBody: string;
  howBullets: string[];
  before: string;
  during: string;
  after: string;
  careGuideHref?: string;
  faqs: InModeTreatmentFaq[];
  consultTitle: string;
  consultBody: string;
  related: InModeTreatmentRelated[];
  manufacturerOverview?: ServiceMenuManufacturerOverview;
  /** Optional clinic media override when no service-pages-oswego entry */
  clinicVideos?: Array<{
    src: string;
    label: string;
    title: string;
    description: string;
    poster?: string;
    aspect?: "video" | "portrait";
  }>;
  clinicPhotos?: Array<{
    src: string;
    alt: string;
    frame?: "landscape" | "portrait" | "square";
  }>;
};

const SHARED_RELATED = {
  solaria: {
    href: "/solaria-co2-oswego",
    eyebrow: "Resurfacing",
    title: "Solaria CO₂",
    blurb: "Fractional CO₂ for tone, sun damage, scars, and texture — from $899.",
  },
  burst: {
    href: "/morpheus8-burst-oswego",
    eyebrow: "Face & neck",
    title: "Morpheus8 Burst",
    blurb: "RF microneedling for firmness and deep remodeling — from $799.",
  },
  body: {
    href: "/morpheus8-body-oswego",
    eyebrow: "Body tightening",
    title: "Morpheus8 Body",
    blurb: "Abdomen, arms, thighs, stretch marks — body-depth RF remodeling.",
  },
  quantum: {
    href: "/quantum-rf-oswego",
    eyebrow: "Contour",
    title: "Quantum RF",
    blurb: "Subdermal fat + skin tightening without surgery.",
  },
} as const;

export const SOLARIA_TREATMENT_LANDING: InModeTreatmentLandingContent = {
  slug: "solaria-co2-oswego",
  path: "/solaria-co2-oswego",
  metaTitle: "Solaria CO₂ in Oswego, IL — $899 + Half-Off Second Area",
  metaDescription:
    "Solaria CO₂ fractional laser in Oswego, IL — $899 with buy-one-area-get-one-half-off. NP-directed resurfacing. Free consult — Naperville, Aurora & Fox Valley.",
  breadcrumbName: "Solaria CO₂ Oswego",
  locality: "CO₂ Fractional Resurfacing in Oswego, Illinois",
  productName: "Solaria CO₂ Laser",
  heroSubhead:
    "Reveal smoother, brighter, younger-looking skin with advanced fractional CO₂ — without the downtime of traditional full-field lasers.",
  heroImage: SOLARIA_TREATMENT_IMAGE,
  heroImageAlt: "Solaria CO₂ fractional laser treatment at Hello Gorgeous Med Spa in Oswego, IL",
  priceLine: "$899",
  priceNote: "Buy one area, get a second area half off",
  whatTitle: "What is Solaria CO₂ fractional resurfacing?",
  whatBody: [
    "Solaria CO₂ fractional skin resurfacing uses precise, microscopic beams of energy to target damaged or aging skin. These controlled micro-injuries remove dull, uneven surface layers while stimulating deep collagen remodeling — for firmer, smoother, more radiant skin over time.",
    "Because Solaria treats only a fraction of the skin in each session, healing is faster and more predictable than traditional CO₂ lasers. It’s an excellent option when you want powerful results with manageable downtime.",
  ],
  treatsIntro: "It’s an excellent option for those wanting to address:",
  treats: [
    "Fine lines and deeper wrinkles",
    "Acne scars and textural scarring",
    "Sun damage and pigmentation",
    "Enlarged pores",
    "Uneven skin tone",
    "Mild skin laxity",
    "Rough, crepey skin",
    "Overall dullness and texture irregularities",
  ],
  howTitle: "How Solaria works",
  howBody:
    "Solaria delivers controlled, fractionated CO₂ energy into the skin. Over the following weeks, skin becomes smoother, firmer, brighter, and more refined — with continued improvement for up to several months.",
  howBullets: [
    "Removes damaged surface cells",
    "Triggers new collagen and elastin",
    "Tightens skin from within",
    "Encourages fresh, healthy skin to replace uneven layers",
  ],
  before:
    "Pause blood-thinning medications or supplements (Aspirin, Ibuprofen, vitamin E, fish oil) as cleared by your provider. No recent sun or self-tanners for about 3–4 weeks. Stop retinoids and AHAs about a week before. Arrive with clean skin — no makeup, lotion, perfume, powder, or oil on the treatment area.",
  during:
    "We review your history, cleanse, and apply topical numbing for comfort. Protective eyewear is provided. Multiple precise passes create microscopic channels that kick-start healing and collagen production. Most sessions take 20–45 minutes depending on area.",
  after:
    "Expect a flushed, sunburn-like look with mild swelling and peeling for several days. We send you home with a full post-care plan. As you heal, texture and tone improve — with collagen remodeling continuing for weeks to months.",
  careGuideHref: "/pre-post-care/solaria-co2",
  faqs: [
    {
      q: "Is Solaria painful?",
      a: "Most clients tolerate it well with strong topical numbing. It’s often described as a warm, sparkler-like sensation. Discomfort is brief and manageable.",
    },
    {
      q: "What is my downtime?",
      a: "Plan depends on depth. Light/moderate: about 3–5 days of redness. Deeper resurfacing: up to 10–14 days of healing. We’ll set expectations at your consult.",
    },
    {
      q: "How much does Solaria CO₂ cost?",
      a: "Treatments are $899. Buy one area, get a second area half off. Exact areas and depth are confirmed at your free consultation.",
    },
    {
      q: "How many treatments will I need?",
      a: "Many clients see dramatic results after one treatment. Depending on goals and skin condition, 1–3 sessions may be recommended.",
    },
    {
      q: "When will I see results?",
      a: "Early improvements often show within 7–10 days as skin heals. Collagen remodeling continues for 6–12 weeks and can keep improving up to 6 months.",
    },
    {
      q: "Who is not a good candidate?",
      a: "Not suitable during pregnancy. Active infections, recent illness, or certain autoimmune conditions may mean postponing. We confirm fit at consult.",
    },
  ],
  consultTitle: "Is Solaria CO₂ the best treatment for you?",
  consultBody:
    "Start with a free consultation. We’ll discuss your concerns, answer questions, and recommend a plan tailored to your skin, lifestyle, and goals — including whether Morpheus8 Burst or a combination is a better fit.",
  related: [SHARED_RELATED.burst, SHARED_RELATED.body, SHARED_RELATED.quantum],
  manufacturerOverview: {
    title: "Trusted InMode technology",
    description:
      "Solaria by InMode fractional CO₂ is indicated for ablative skin resurfacing — precise microbeam treatments with faster healing than traditional full-field CO₂.",
    imageSrc: "/images/solaria/solaria-inmode-introducing-best-version.jpg",
    imageAlt: "InMode Solaria introducing fractional CO₂ resurfacing education graphic",
    additionalImages: [
      {
        src: "/images/solaria/solaria-inmode-before-after-results.jpg",
        alt: "InMode Solaria fractional skin resurfacing before and after results",
      },
      {
        src: "/images/solaria/solaria-inmode-manufacturer-overview.jpg",
        alt: "InMode Solaria CO₂ workstation overview",
      },
    ],
    learnMoreHref: "https://www.inmodemd.com/workstation/solaria/",
    learnMoreLabel: "Learn more on InMode.com",
  },
};

export const QUANTUM_TREATMENT_LANDING: InModeTreatmentLandingContent = {
  slug: "quantum-rf-oswego",
  path: "/quantum-rf-oswego",
  metaTitle: "Quantum RF Body Contouring in Oswego, IL",
  metaDescription:
    "Quantum RF body contouring in Oswego, IL — non-surgical fat reduction and skin tightening. Neck $2,499 · Abdomen $3,999 with FREE Morpheus8 Burst. Free consult.",
  breadcrumbName: "Quantum RF Oswego",
  locality: "Body Contouring in Oswego, Illinois",
  productName: "Quantum RF",
  heroSubhead:
    "Non-surgical fat reduction and skin tightening in one platform — meaningful contour without liposuction downtime.",
  heroImage: QUANTUM_RF_PROCEDURE_IMAGE,
  heroImageAlt: "Quantum RF body contouring at Hello Gorgeous Med Spa in Oswego, IL",
  priceLine: "Neck $2,499 · Abdomen $3,999",
  priceNote: "Each package includes a complimentary Morpheus8 Burst",
  whatTitle: "What is Quantum RF?",
  whatBody: [
    "Quantum RF is InMode’s advanced radiofrequency body contouring platform — designed to reduce stubborn fat and tighten loose skin in a single non-surgical treatment.",
    "It’s built for clients who want real contour change without surgery, scars, or long recovery. We’re the only practice in the western Chicago suburbs offering it.",
  ],
  treatsIntro: "Ideal for targeting:",
  treats: [
    "Stubborn abdominal fat",
    "Flanks and love handles",
    "Neck and jawline fullness",
    "Mild-to-moderate skin laxity after fat loss",
    "Arms and thighs (when clinically appropriate)",
    "Contour refinement without liposuction",
  ],
  howTitle: "How Quantum RF works",
  howBody:
    "Dual-zone radiofrequency heats subcutaneous fat while stimulating collagen in deeper skin layers. Destroyed fat clears gradually; tightening continues for months.",
  howBullets: [
    "Targets fat cells with controlled RF heat",
    "Tightens skin in the same session",
    "No general anesthesia",
    "Results build over 3–6 months",
  ],
  before:
    "Come hydrated and share your full medical history. We’ll photograph and mark treatment areas. Avoid heavy sunburn or active skin infection in the treatment zone.",
  during:
    "Sessions typically run 30–45 minutes per area. Most clients feel deep warmth — similar to a hot-stone sensation. Local anesthesia protocols are used when appropriate for comfort.",
  after:
    "Little to no downtime for most clients. Mild redness or warmth can linger a few hours. Contour changes usually begin around week 4 and continue for months.",
  careGuideHref: "/pre-post-care/quantum-rf",
  faqs: [
    {
      q: "Is Quantum RF the same as CoolSculpting?",
      a: "No. CoolSculpting freezes fat. Quantum RF heats fat and tightens skin in one treatment — often a more refined contour for clients with mild laxity.",
    },
    {
      q: "How is it different from Morpheus8?",
      a: "Morpheus8 remodels skin with RF microneedling. Quantum RF works deeper in the fat layer for volume reduction plus tightening. Many clients combine both.",
    },
    {
      q: "How much does Quantum RF cost?",
      a: "Launch packages: Neck $2,499 and Abdomen $3,999 — each includes complimentary Morpheus8 Burst. Exact coverage confirmed at consult.",
    },
    {
      q: "Is there downtime?",
      a: "Usually none significant. Most clients return to normal activity the same day.",
    },
  ],
  consultTitle: "Is Quantum RF right for your goals?",
  consultBody:
    "Book a free body contouring consult. We’ll measure areas, set honest expectations, and map whether Quantum RF, Morpheus8 Body, or a combination fits best.",
  related: [SHARED_RELATED.body, SHARED_RELATED.burst, SHARED_RELATED.solaria],
  manufacturerOverview: {
    title: "Trusted InMode technology",
    description:
      "QuantumRF delivers subdermal coagulation for fat disruption and tissue contraction — precision body contouring under medical supervision.",
    imageSrc: "/images/quantum-rf/quantum-rf-inmode-handpieces-ba.jpg",
    imageAlt: "InMode QuantumRF handpieces and before/after education graphic",
    learnMoreHref: "https://www.inmodemd.com/technologies/quantumrf/",
    learnMoreLabel: "Learn more on InMode.com",
  },
};

export const MORPHEUS8_BURST_TREATMENT_LANDING: InModeTreatmentLandingContent = {
  slug: "morpheus8-burst-oswego",
  path: "/morpheus8-burst-oswego",
  metaTitle: "Morpheus8 Burst in Oswego, IL — from $799",
  metaDescription:
    "Morpheus8 Burst RF microneedling in Oswego, IL — tighten skin, smooth texture, boost collagen. From $799. NP-directed. Free consult for face & neck.",
  breadcrumbName: "Morpheus8 Burst Oswego",
  locality: "RF Microneedling in Oswego, Illinois",
  productName: "Morpheus8 Burst",
  heroSubhead:
    "Tighten, smooth, and renew from within — advanced RF microneedling for face and neck with customizable depth.",
  heroImage: MORPHEUS8_UNDERARM_TREATMENT_IMAGE,
  heroImageAlt: "Morpheus8 Burst treatment at Hello Gorgeous Med Spa in Oswego, IL",
  priceLine: "From $799",
  priceNote: "Face sessions · packages available at consult",
  whatTitle: "What is Morpheus8 Burst?",
  whatBody: [
    "Morpheus8 Burst combines microneedling with radiofrequency energy to remodel collagen deep in the skin. Tiny gold-plated needles deliver pulsed RF at controlled depths — firmer, thicker tissue rebuilds over the following months.",
    "It’s ideal when laxity, texture, or acne scarring need more than a surface treatment — without surgery.",
  ],
  treatsIntro: "Commonly used for:",
  treats: [
    "Facial and neck laxity",
    "Jowls and jawline soft tissue",
    "Acne scars and uneven texture",
    "Fine lines and crepey skin",
    "Overall collagen renewal",
    "Combination plans with Solaria CO₂",
  ],
  howTitle: "How Morpheus8 Burst works",
  howBody:
    "Needles create precise channels while RF heats deep tissue. Your body responds with new collagen and elastin for 3–6 months after each session.",
  howBullets: [
    "Microneedling + RF in one pass",
    "Burst delivery for deeper remodeling",
    "Customizable depth for face and neck",
    "Safe for a wide range of skin tones when performed correctly",
  ],
  before:
    "Arrive with clean skin. Pause retinoids as advised. Share history of cold sores, recent procedures, or medications so we can prepare safely.",
  during:
    "Topical numbing for 45–60 minutes, then treatment in sections (typically 30–60 minutes). You’ll feel heat and pressure with each pass — breaks as needed.",
  after:
    "Expect 2–3 days of social downtime with redness and a sunburn look. Pinpoint dots fade quickly. We send full aftercare and schedule series sessions 4–6 weeks apart when needed.",
  careGuideHref: "/pre-post-care/morpheus8-burst",
  faqs: [
    {
      q: "What does Morpheus8 treat?",
      a: "Loose skin, texture, fine lines, and tone on the face and neck by stimulating your own collagen. Your provider confirms the right plan at consult.",
    },
    {
      q: "How much does it cost?",
      a: "Face treatments start at $799. Larger areas and series packages are quoted at your free consultation.",
    },
    {
      q: "How many treatments will I need?",
      a: "Most clients see ideal results from a series of 3 sessions spaced 4–6 weeks apart.",
    },
    {
      q: "How is it different from Solaria CO₂?",
      a: "Morpheus8 remodels deep tissue with RF microneedling. Solaria resurfaces tone, sun damage, and scars with fractional CO₂. Many clients combine both.",
    },
    {
      q: "Do you treat the body with Morpheus8?",
      a: "Yes — see our Morpheus8 Body landing for abdomen, arms, thighs, and stretch marks. Face/neck plans live here on Burst.",
    },
  ],
  consultTitle: "Is Morpheus8 Burst right for you?",
  consultBody:
    "Book a free consult. We’ll assess your skin, be honest if Solaria or Quantum is a better first step, and build a clear series plan with pricing.",
  related: [SHARED_RELATED.body, SHARED_RELATED.solaria, SHARED_RELATED.quantum],
};

export const MORPHEUS8_BODY_TREATMENT_LANDING: InModeTreatmentLandingContent = {
  slug: "morpheus8-body-oswego",
  path: "/morpheus8-body-oswego",
  metaTitle: "Morpheus8 Body in Oswego, IL — Abdomen, Arms & Thighs",
  metaDescription:
    "Morpheus8 Body RF microneedling in Oswego, IL — tighten abdomen, arms, thighs, and stretch marks. NP-directed InMode provider. Free consult.",
  breadcrumbName: "Morpheus8 Body Oswego",
  locality: "Body RF Microneedling in Oswego, Illinois",
  productName: "Morpheus8 Body",
  heroSubhead:
    "Deeper RF remodeling for body skin — abdomen, arms, thighs, knees, and stretch marks — without surgery.",
  heroImage: "/images/morpheus8/morpheus8-burst-deep-abdomen-skin-tightening-before-after.png",
  heroImageAlt: "Morpheus8 Body skin tightening results at Hello Gorgeous Med Spa Oswego",
  priceLine: "Quoted by area",
  priceNote: "Body depths & series packages at free consult · face from $799 on Burst",
  whatTitle: "What is Morpheus8 Body?",
  whatBody: [
    "Morpheus8 Body uses the same RF microneedling platform as Burst — configured for larger body areas and deeper remodeling. It’s how we tighten and refine skin on the abdomen, arms, thighs, and more.",
    "If your goal is facial firmness, start with Morpheus8 Burst. If your goal is body skin quality, texture, or stretch marks — this is the door.",
  ],
  treatsIntro: "Built for body concerns like:",
  treats: [
    "Abdomen laxity and postpartum skin",
    "Upper arms (“bat wings”) texture",
    "Thighs and knee crepey skin",
    "Stretch marks",
    "Underarm and bra-line firmness",
    "Body texture after weight change",
  ],
  howTitle: "How Morpheus8 Body works",
  howBody:
    "Customizable needle depth and Burst RF energy remodel collagen across larger body zones. Results build for months as tissue firms and texture softens.",
  howBullets: [
    "Body-appropriate depths and tips",
    "Collagen remodeling for 3–6 months",
    "Pairs with Quantum RF when fat volume is also a goal",
    "Series plans for meaningful change",
  ],
  before:
    "Wear comfortable clothing for access to treatment areas. Share recent procedures, sun exposure, and medications. We’ll map areas and photograph baselines.",
  during:
    "Numbing, then passes over marked body zones. Session length depends on areas treated. Heat and pressure are expected; we pace for comfort.",
  after:
    "Redness and swelling are common for a few days. Follow aftercare closely — especially sun protection. Series sessions are typically spaced 4–6 weeks apart.",
  careGuideHref: "/pre-post-care/morpheus8-burst",
  faqs: [
    {
      q: "Is Morpheus8 Body different from Burst?",
      a: "Same InMode platform family — Body focuses on larger areas and body-depth protocols. Burst is our face/neck entry. We’ll recommend the right plan at consult.",
    },
    {
      q: "Can I combine with Quantum RF?",
      a: "Yes. Quantum RF addresses fat volume; Morpheus8 Body remodeled skin quality. Packages sometimes include complimentary Morpheus8 with Quantum.",
    },
    {
      q: "How much does Morpheus8 Body cost?",
      a: "Body areas are quoted by zone and series at your free consultation. Face starts at $799 on our Burst page.",
    },
    {
      q: "How many sessions for body?",
      a: "Most body plans use 3–4 sessions spaced 4–6 weeks apart. We’ll tailor to your goals.",
    },
  ],
  consultTitle: "Ready to tighten body skin?",
  consultBody:
    "Book a free consult. We’ll show real body cases, map your areas, and build a Morpheus8 Body (or Quantum + Morpheus) plan with clear pricing.",
  related: [SHARED_RELATED.burst, SHARED_RELATED.quantum, SHARED_RELATED.solaria],
  clinicVideos: [
    {
      src: MORPHEUS8_TREATMENT_VIDEO,
      label: "Treatment",
      title: "Morpheus8 Body / Burst treatment — Hello Gorgeous Oswego, IL",
      description:
        "Watch Morpheus8 RF microneedling at Hello Gorgeous Med Spa in Oswego, IL — face and body protocols available.",
      poster: MORPHEUS8_UNDERARM_TREATMENT_IMAGE,
      aspect: "video",
    },
  ],
  clinicPhotos: [
    {
      src: MORPHEUS8_UNDERARM_TREATMENT_IMAGE,
      alt: "Morpheus8 body-area treatment at Hello Gorgeous Med Spa Oswego",
      frame: "portrait",
    },
    {
      src: QUANTUM_RF_RYAN_ACTION_IMAGE,
      alt: "InMode body contouring care at Hello Gorgeous Med Spa Oswego",
      frame: "landscape",
    },
  ],
};

export const INMODE_TREATMENT_LANDINGS = {
  "solaria-co2-oswego": SOLARIA_TREATMENT_LANDING,
  "quantum-rf-oswego": QUANTUM_TREATMENT_LANDING,
  "morpheus8-burst-oswego": MORPHEUS8_BURST_TREATMENT_LANDING,
  "morpheus8-body-oswego": MORPHEUS8_BODY_TREATMENT_LANDING,
} as const;

export type InModeTreatmentSlug = keyof typeof INMODE_TREATMENT_LANDINGS;

export function getInModeTreatmentLanding(slug: InModeTreatmentSlug) {
  return INMODE_TREATMENT_LANDINGS[slug];
}
