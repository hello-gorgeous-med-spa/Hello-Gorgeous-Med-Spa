/**
 * VI Peel — patient landing. Canonical route: /services/vi-peel
 * Protocol names follow the current VI Peel line. Claims stay consult-first.
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

export const VI_PEEL_PATH = "/services/vi-peel" as const;

export const VI_PEEL_CONTACT = {
  bookHref: PRIMARY_BOOKING_CTA.href,
  phoneTel: `tel:${SITE.phone.replace(/\D/g, "")}`,
  phoneDisplay: SITE.phone,
  textTel: "sms:6302016867",
  textDisplay: "(630) 201-6867",
  careHref: "/pre-post-care/chemical-peel",
  consentHref: "/forms/vi-peel-consent",
  facialsHref: "/services/facials-and-peels",
  neurotoxinHref: "/botox-oswego",
} as const;

/** VI Peel’s name for a peel done before a neurotoxin visit. Not a separate drug. */
export const VI_PEEL_TOXBOOSTER = {
  id: "toxbooster",
  name: "ToxBooster",
  eyebrow: "VI Peel + neurotoxin",
  headline: "Lines, spots, and texture in one plan",
  summary:
    "ToxBooster is VI Peel’s name for doing a VI Peel before a neurotoxin injection. The peel is aimed at pigment, tone, and texture. The injection relaxes the muscles that fold the skin. They are planned together. Neither one is a promise of the other.",
  points: [
    "The peel comes first. Injection timing is set so the skin is ready.",
    "Neurotoxin is the brand already used here: Botox, Dysport, Xeomin, Jeuveau, or Daxxify.",
    "A published study reported more change with the combination than with neurotoxin alone. Those numbers are the study’s, not a Hello Gorgeous guarantee.",
  ],
  study:
    "Journal of Drugs in Dermatology, Vitality Institute and Wendy Roberts, MD. The paper’s comparison uses about 30 days for the combination and about 7 days for neurotoxin alone, which is not the same window. Individual results vary.",
  concerns: ["Fine lines and expression lines", "Dark spots and sun damage", "Uneven tone and texture"],
} as const;

export const VI_PEEL_MARKETING = {
  name: "VI Peel",
  eyebrow: "Hello Gorgeous Med Spa · Oswego, Illinois",
  headline: "A medium-depth peel for tone, texture, and pigment",
  subhead:
    "VI Peel is a professional chemical peel planned for acne, discoloration, and the look of sun-worn skin. Hello Gorgeous matches the formula at a consult. Peeling is expected. Results vary.",
  image: "/images/facials-peels/facial-peel.jpg",
  imageAlt: "Clinical facial peel treatment room at Hello Gorgeous Med Spa in Oswego",
} as const;

export const VI_PEEL_PROTOCOLS = [
  {
    id: "precision",
    name: "Precision + Peptides",
    focus: "Pigment",
    summary:
      "The pigment-focused VI Peel. Considered for melasma, sun damage, and dark marks left after inflammation. Peptides are part of the current Precision formula. Response depends on the cause of the pigment and on sun protection afterward.",
    ideal: ["Melasma and sun damage", "Hyperpigmentation", "Post-inflammatory dark marks"],
  },
  {
    id: "purify-precision",
    name: "Purify with Precision + Peptides",
    focus: "Acne and marks",
    summary:
      "Considered when active breakouts and the discoloration they leave are both a concern. It does not replace prescription acne care when that is the right treatment.",
    ideal: ["Breakouts plus dark marks", "Hormonal acne", "Oily, congested skin"],
  },
  {
    id: "original",
    name: "Original",
    focus: "First peel",
    summary:
      "A starting VI Peel for early texture and tone changes, including clients who have not peeled before. Reactive or easily irritated skin is screened before any formula is chosen.",
    ideal: ["First-time peel", "Early lines and texture", "Dull or rough tone"],
  },
  {
    id: "advanced",
    name: "Advanced",
    focus: "Mature skin",
    summary:
      "A deeper VI Peel option, often discussed for lines, crepey texture, and skin that has not moved with lighter care. It is not the right depth for every skin type.",
    ideal: ["Lines and crepey texture", "Loss of snap", "Skin that needs a deeper peel"],
  },
  {
    id: "purify",
    name: "Purify",
    focus: "Acne-prone skin",
    summary:
      "Aimed at oil, congestion, and acne-prone skin. Candidacy includes how inflamed the skin is that day. A flare, open skin, or infection is a reason to wait.",
    ideal: ["Excess oil", "Congested pores", "Acne-prone skin"],
  },
  {
    id: "body",
    name: "Body",
    focus: "Below the collarbone",
    summary:
      "A body VI Peel for discoloration, keratosis pilaris, body breakouts, and the look of stretch marks. The area is mapped at the visit. It will not remove a scar.",
    ideal: ["Body discoloration", "Keratosis pilaris", "Body breakouts"],
  },
] as const;

export const VI_PEEL_TIMELINE = [
  {
    day: "Day of",
    body: "The peel is applied in the treatment room. Skin can feel warm, tight, or look frosted. You leave with aftercare and sunscreen instructions.",
  },
  {
    day: "Days 2–3",
    body: "Tightness and a darker, drier look are common before the peel lifts. Do not pick, scrub, or speed it up.",
  },
  {
    day: "Days 3–7",
    body: "Visible peeling is the point of the treatment. Most face plans flake for several days. Body areas can take longer. Experiences differ.",
  },
  {
    day: "After",
    body: "Tone keeps settling after the flakes are gone. Daily SPF is required. A series is often planned, with spacing set at your visit.",
  },
] as const;

export const VI_PEEL_PACKAGES = [
  {
    id: "single",
    name: "Single VI Peel",
    price: "Consult",
    detail: "one formula, one area",
    bullets: ["Protocol chosen for your skin", "Aftercare and SPF plan", "Consent before treatment"],
  },
  {
    id: "series",
    name: "Series of 3",
    price: "Consult",
    detail: "spacing set at the visit",
    bullets: ["Often used for pigment or acne plans", "Progress checked between peels", "Not everyone needs three"],
    highlight: true,
  },
  {
    id: "toxbooster",
    name: "ToxBooster",
    price: "Consult",
    detail: "VI Peel + neurotoxin",
    bullets: ["Peel formula chosen first", "Neurotoxin dosed by area", "Not a flat package price"],
    highlight: false,
  },
] as const;

export const VI_PEEL_FAQS = [
  {
    q: "What is a VI Peel?",
    a: "VI Peel is a medium-depth chemical peel used to improve tone, texture, acne, discoloration, and the look of photoaging. It causes controlled peeling. Results vary by skin, the condition being treated, home care, and how closely aftercare is followed.",
  },
  {
    q: "Which VI Peel will I get?",
    a: "Precision + Peptides, Purify with Precision + Peptides, Original, Advanced, Purify, and Body are the current formulas. Hello Gorgeous chooses one after looking at your skin, history, and goals. Not every formula is appropriate for every person.",
  },
  {
    q: "Who performs it?",
    a: "VI Peel at Hello Gorgeous is physician-directed by Dr. Mukesh Arora, MD, Licensed Physician and Surgeon and Medical Director. The peel is performed by our clinical team. A consult comes before treatment.",
  },
  {
    q: "How much peeling should I expect?",
    a: "Plan on visible flaking for several days, often about 3–7 days on the face. Redness, tightness, itching, and a temporary breakout can happen. Picking the skin raises the chance of marks and scars.",
  },
  {
    q: "Can I get a VI Peel if I have melasma or darker skin?",
    a: "Pigment risk is part of the consult, including melanin-rich skin and melasma. The wrong peel, sun, or heat during healing can darken skin. We will say no when a peel is not the right next step.",
  },
  {
    q: "Who should not book a peel right now?",
    a: "Pregnancy, breastfeeding, an active infection, open skin, a flare of eczema or dermatitis, sunburn, a known allergy to peel ingredients, and recent isotretinoin, waxing, or laser in the area are reasons to wait or to get clearance first.",
  },
  {
    q: "What is ToxBooster?",
    a: "ToxBooster means a VI Peel is done before a neurotoxin injection, so lines and discoloration can be treated in one plan. The peel still peels. The injection is dosed separately. Timing, brand, and whether you are a candidate are decided at the consult. A published study reported larger average changes with the combination. That is not a prediction of your result.",
  },
  {
    q: "How much does VI Peel cost?",
    a: "A single VI Peel and a series of 3 are quoted at your consult. Pricing depends on the formula and the area. It is not listed as a flat online special.",
  },
  {
    q: "When will I see a change?",
    a: "The peel itself shows up within the first week. Clearer tone, if it happens, is judged after healing and often after a series. Photos of other people are not a promise of your result.",
  },
] as const;

export const VI_PEEL_SEO = {
  title: "VI Peel Oswego IL | Precision, Purify & Advanced | Hello Gorgeous",
  description:
    "VI Peel in Oswego for pigment, acne, and texture, including ToxBooster (VI Peel before neurotoxin). Precision + Peptides, Purify, Original, Advanced, and Body. Physician-directed at Hello Gorgeous Med Spa. Consult required. Results vary.",
  ogAlt: "VI Peel chemical peel at Hello Gorgeous Med Spa in Oswego, Illinois",
  keywords: [
    "VI Peel Oswego",
    "VI Peel Naperville",
    "chemical peel Aurora IL",
    "melasma peel Plainfield",
    "acne peel Oswego",
    "VI Peel Precision Peptides",
    "Hello Gorgeous Med Spa",
  ],
} as const;
