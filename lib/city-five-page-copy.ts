/**
 * Owner-approved city page copy (Naperville · Aurora · Plainfield · Yorkville · Montgomery).
 * Source: City Page Copy - 5 Cities.pdf — companion to Oswego page copy.
 * Prices filled from live admin: WL $195/mo · Botox as low as $9/unit · Morpheus8 from $799.
 */

export type CityFiveFaq = { question: string; answer: string };

export type CityFivePageCopy = {
  /** Eyebrow / locality line */
  servingLine: string;
  h1: string;
  title: string;
  metaDescription: string;
  intro: string;
  faqs: CityFiveFaq[];
};

const BOTOX_PRICE = "as low as $9";
const WL_PRICE = "$195";
const M8_PRICE = "$799";

/** GBP + Morpheus8 slugs for the five primary Fox Valley cities. */
export const CITY_FIVE_PAGE_COPY: Record<string, CityFivePageCopy> = {
  // ── Naperville ─────────────────────────────────────────────
  "weight-loss-naperville-il": {
    servingLine: "Serving Naperville from our Oswego clinic",
    h1: "Medical Weight Loss for Naperville. Supervised. Personalized.",
    title: "Medical Weight Loss Naperville, IL | NP-Directed Program",
    metaDescription:
      "Provider-supervised medical weight loss for Naperville, IL. Personalized GLP-1 & metabolic plans with real medical screening. Free consult, minutes from Naperville.",
    intro:
      "Naperville, meet weight loss that's actually medical. A short drive away in Oswego, our nurse-practitioner team builds a supervised plan around your body, your labs, and your goals — no fads, no guesswork. We screen you like a medical practice, because we are one. Programs start at $195/month. Hello Gorgeous Med Spa is at 74 W. Washington Street in downtown Oswego — a short drive from Naperville via Route 34. Our NP-directed team customizes every plan, screens medically before treatment, and quotes clearly at a free consult. Serving Naperville, Aurora, Plainfield, Yorkville, Montgomery, and Kendall County with transparent pricing and natural-looking results. Book online or call (630) 636-6193 — same-week appointments are often available, and we are honest if another treatment or timeline would serve you better. Parking is straightforward downtown, and many Fox Valley clients pair their visit with a free consult on the same day.",
    faqs: [
      {
        question: "Do you serve Naperville patients?",
        answer:
          "Yes — many of our weight-loss clients come from Naperville. We're a short drive away in Oswego, and your program is managed by our provider team.",
      },
      {
        question: "Is it medically supervised?",
        answer:
          "Always. You're screened and monitored by our nurse-practitioner team, and any prescription requires provider approval.",
      },
      {
        question: "What does it cost?",
        answer: `Programs start at ${WL_PRICE}/month and are tailored to your plan — we'll review pricing at your free consult.`,
      },
    ],
  },
  "botox-naperville-il": {
    servingLine: "Serving Naperville from our Oswego clinic",
    h1: "Botox for Naperville. Subtle, Skilled, Yours.",
    title: `Botox Naperville, IL from ${BOTOX_PRICE}/unit | Medical Injectors`,
    metaDescription: `Expert Botox for Naperville, IL at Hello Gorgeous in nearby Oswego. Natural results by medical injectors, from ${BOTOX_PRICE}/unit. Book a free consult.`,
    intro: `Naperville clients trust us for Botox that looks effortless. Our medical injectors tailor every unit so you look refreshed, not done — all in a nurse-practitioner-directed medical setting just minutes from you. Botox is ${BOTOX_PRICE}/unit — authentic Allergan product from US distributors only. Hello Gorgeous Med Spa is at 74 W. Washington Street in downtown Oswego — a short drive from Naperville via Route 34. Our NP-directed team customizes every plan, screens medically before treatment, and quotes clearly at a free consult. Serving Naperville, Aurora, Plainfield, Yorkville, Montgomery, and Kendall County with transparent pricing and natural-looking results. Book online or call (630) 636-6193 — same-week appointments are often available, and we are honest if another treatment or timeline would serve you better. Parking is straightforward downtown, and many Fox Valley clients pair their visit with a free consult on the same day.`,
    faqs: [
      {
        question: "How much is Botox for Naperville clients?",
        answer: `From ${BOTOX_PRICE} per unit; your total depends on the areas treated. You'll get a clear quote at your free consult.`,
      },
      {
        question: "Who injects?",
        answer:
          "Our trained medical injector team, in a provider-directed medical clinic — not a salon.",
      },
    ],
  },
  "morpheus8-naperville-il": {
    servingLine: "Serving Naperville from our Oswego clinic",
    h1: "Morpheus8 for Naperville. Firmer Skin, No Surgery.",
    title: `Morpheus8 RF Microneedling Naperville, IL from ${M8_PRICE} | Skin Tightening`,
    metaDescription: `Morpheus8 skin tightening for Naperville, IL from ${M8_PRICE}. RF microneedling to firm, smooth & renew — NP-directed, near Naperville. Book your free consult.`,
    intro: `Firmer, smoother skin without surgery — that's Morpheus8, and Naperville clients love it. We combine microneedling with radiofrequency to rebuild collagen on the face and body, customized to your skin by our provider team. Treatments start at ${M8_PRICE}.`,
    faqs: [
      {
        question: "What can Morpheus8 do for me?",
        answer:
          "Tighten loose skin, smooth texture, and improve tone by stimulating your own collagen. Your provider confirms your plan at the consult.",
      },
      {
        question: "Downtime?",
        answer:
          "Usually mild redness for a day or two — we'll cover exactly what to expect beforehand.",
      },
      {
        question: "How much does Morpheus8 cost near Naperville?",
        answer: `Treatments start at ${M8_PRICE}. Area and series plans are confirmed at your free consultation.`,
      },
    ],
  },

  // ── Aurora ─────────────────────────────────────────────────
  "weight-loss-aurora-il": {
    servingLine: "Serving Aurora from our Oswego clinic",
    h1: "Medical Weight Loss for Aurora. A Real Plan, Real Support.",
    title: "Medical Weight Loss Aurora, IL | NP-Directed GLP-1 Program",
    metaDescription:
      "Medical weight loss for Aurora, IL — provider-supervised GLP-1 & metabolic programs with real screening and support. Free consult nearby in Oswego.",
    intro:
      "If you're in Aurora and tired of programs that don't stick, this is different. Our provider team screens you, builds a medical weight-loss plan for your body, and supports you every step — just up the road in Oswego. Programs start at $195/month. Hello Gorgeous Med Spa is at 74 W. Washington Street in downtown Oswego — a short drive from Naperville via Route 34. Our NP-directed team customizes every plan, screens medically before treatment, and quotes clearly at a free consult. Serving Naperville, Aurora, Plainfield, Yorkville, Montgomery, and Kendall County with transparent pricing and natural-looking results. Book online or call (630) 636-6193 — same-week appointments are often available, and we are honest if another treatment or timeline would serve you better. Parking is straightforward downtown, and many Fox Valley clients pair their visit with a free consult on the same day.",
    faqs: [
      {
        question: "Can Aurora residents join?",
        answer:
          "Absolutely — we serve Aurora from our Oswego clinic, with your plan managed by our provider team.",
      },
      {
        question: "Are the medications safe?",
        answer:
          "They're used within a supervised program and only after provider screening and approval — never one-size-fits-all.",
      },
      {
        question: "Cost?",
        answer: `From ${WL_PRICE}/month, tailored to your plan and reviewed at your free consult.`,
      },
    ],
  },
  "botox-aurora-il": {
    servingLine: "Serving Aurora from our Oswego clinic",
    h1: "Botox for Aurora. Refreshed, Never Frozen.",
    title: `Botox Aurora, IL from ${BOTOX_PRICE}/unit | Expert Injectors`,
    metaDescription: `Natural-looking Botox for Aurora, IL by our medical injector team. Honest pricing from ${BOTOX_PRICE}/unit, free consult — nearby in Oswego.`,
    intro: `Aurora, get Botox that keeps you looking like you. Our medical injectors place every unit with care for smooth, natural results — in a real medical setting minutes away. Botox is ${BOTOX_PRICE}/unit — authentic Allergan product from US distributors only. Hello Gorgeous Med Spa is at 74 W. Washington Street in downtown Oswego — just up the road from Aurora. Our NP-directed team customizes every plan, screens medically before treatment, and quotes clearly at a free consult. Serving Aurora, Naperville, Plainfield, Yorkville, Montgomery, and Kendall County with transparent pricing and natural-looking results. Book online or call (630) 636-6193 — same-week appointments are often available, and we are honest if another treatment or timeline would serve you better. Parking is straightforward downtown, and many Fox Valley clients pair their visit with a free consult on the same day.`,
    faqs: [
      {
        question: "Botox pricing for Aurora?",
        answer: `From ${BOTOX_PRICE} per unit, with a clear quote at your free consult before we begin.`,
      },
      {
        question: "Is it done by a professional?",
        answer: "Yes — our trained medical injectors, in a nurse-practitioner-directed clinic.",
      },
    ],
  },
  "morpheus8-aurora-il": {
    servingLine: "Serving Aurora from our Oswego clinic",
    h1: "Morpheus8 for Aurora. Tighten & Renew.",
    title: `Morpheus8 Aurora, IL from ${M8_PRICE} | RF Microneedling Skin Tightening`,
    metaDescription: `Morpheus8 RF microneedling for Aurora, IL from ${M8_PRICE} — firm, smooth and renew skin without surgery. NP-directed, near Aurora. Free consult.`,
    intro: `Aurora clients choose Morpheus8 to tighten and smooth without going under the knife. Radiofrequency microneedling rebuilds collagen on face and body — customized and medically supervised at our Oswego clinic. Treatments start at ${M8_PRICE}.`,
    faqs: [
      {
        question: "What does it treat?",
        answer:
          "Loose skin, texture, fine lines and tone — by boosting your own collagen. Your provider tailors it to you.",
      },
      {
        question: "Is there recovery time?",
        answer: "Typically a day or two of mild redness; we'll prep you fully at your consult.",
      },
      {
        question: "How much does Morpheus8 cost near Aurora?",
        answer: `Treatments start at ${M8_PRICE}. Exact quote at your free consultation.`,
      },
    ],
  },

  // ── Plainfield ─────────────────────────────────────────────
  "weight-loss-plainfield-il": {
    servingLine: "Serving Plainfield from our Oswego clinic",
    h1: "Medical Weight Loss for Plainfield. Guided by Providers.",
    title: "Medical Weight Loss Plainfield, IL | Provider-Supervised",
    metaDescription:
      "Provider-supervised medical weight loss for Plainfield, IL. Personalized, medically screened GLP-1 & metabolic plans. Free consult close to Plainfield.",
    intro:
      "Plainfield, real weight loss starts with real medicine. Our nurse-practitioner team screens you and builds a plan for your body — not a template — with support the whole way, close to home in Oswego. Programs start at $195/month. Hello Gorgeous Med Spa is at 74 W. Washington Street in downtown Oswego — just up the road from Aurora. Our NP-directed team customizes every plan, screens medically before treatment, and quotes clearly at a free consult. Serving Aurora, Naperville, Plainfield, Yorkville, Montgomery, and Kendall County with transparent pricing and natural-looking results. Book online or call (630) 636-6193 — same-week appointments are often available, and we are honest if another treatment or timeline would serve you better. Parking is straightforward downtown, and many Fox Valley clients pair their visit with a free consult on the same day.",
    faqs: [
      {
        question: "Do you take Plainfield clients?",
        answer: "Yes — we happily serve Plainfield from our nearby Oswego clinic.",
      },
      {
        question: "Supervised by a provider?",
        answer: "Yes — screened and monitored by our NP team; prescriptions require approval.",
      },
      {
        question: "Pricing?",
        answer: `From ${WL_PRICE}/month, personalized and explained at your consult.`,
      },
    ],
  },
  "botox-plainfield-il": {
    servingLine: "Serving Plainfield from our Oswego clinic",
    h1: "Botox for Plainfield. Natural Results, Expert Hands.",
    title: `Botox Plainfield, IL from ${BOTOX_PRICE}/unit | Medical Injectors`,
    metaDescription: `Expert Botox for Plainfield, IL — natural results from our medical injector team, from ${BOTOX_PRICE}/unit. Free consult nearby in Oswego.`,
    intro: `Plainfield, smooth those lines while keeping your expressions. Our medical injectors customize every treatment for a refreshed, natural look — in a trusted medical setting minutes away. Botox is ${BOTOX_PRICE}/unit — authentic Allergan product from US distributors only. Hello Gorgeous Med Spa is at 74 W. Washington Street in downtown Oswego — close to Plainfield. Our NP-directed team customizes every plan, screens medically before treatment, and quotes clearly at a free consult. Serving Plainfield, Naperville, Aurora, Yorkville, Montgomery, and Kendall County with transparent pricing and natural-looking results. Book online or call (630) 636-6193 — same-week appointments are often available, and we are honest if another treatment or timeline would serve you better. Parking is straightforward downtown, and many Fox Valley clients pair their visit with a free consult on the same day.`,
    faqs: [
      {
        question: "How much for Plainfield clients?",
        answer: `From ${BOTOX_PRICE} per unit; you'll get a clear quote at your free consult.`,
      },
      {
        question: "Who performs it?",
        answer: "Our trained medical injectors in a provider-directed clinic.",
      },
    ],
  },
  "morpheus8-plainfield-il": {
    servingLine: "Serving Plainfield from our Oswego clinic",
    h1: "Morpheus8 for Plainfield. Smooth, Firm, Confident.",
    title: `Morpheus8 Plainfield, IL from ${M8_PRICE} | RF Microneedling`,
    metaDescription: `Morpheus8 RF microneedling for Plainfield, IL from ${M8_PRICE} — tighten and smooth skin without surgery. NP-directed, close to Plainfield. Book your free consult.`,
    intro: `Plainfield clients love Morpheus8 for firmer, smoother skin — no surgery required. Our providers use RF microneedling to rebuild collagen on the face and body, tailored to your skin at our Oswego clinic. Treatments start at ${M8_PRICE}.`,
    faqs: [
      {
        question: "What areas can be treated?",
        answer:
          "Face and body — for tightening, texture, and tone. Your provider will map your plan at the consult.",
      },
      {
        question: "Downtime?",
        answer: "Usually a day or two of mild redness; full aftercare covered beforehand.",
      },
      {
        question: "How much does Morpheus8 cost near Plainfield?",
        answer: `Treatments start at ${M8_PRICE}. Exact quote at your free consultation.`,
      },
    ],
  },

  // ── Yorkville ──────────────────────────────────────────────
  "weight-loss-yorkville-il": {
    servingLine: "Serving Yorkville from our Oswego clinic",
    h1: "Medical Weight Loss for Yorkville. Safe, Real, Supported.",
    title: "Medical Weight Loss Yorkville, IL | NP-Directed Program",
    metaDescription:
      "Medical weight loss for Yorkville, IL — supervised GLP-1 & metabolic programs, real screening and support. Free consult just minutes from Yorkville.",
    intro:
      "Yorkville, lose the weight with a medical team behind you. We screen you, personalize your plan, and support you throughout — all just minutes away in Oswego. Programs start at $195/month. Hello Gorgeous Med Spa is at 74 W. Washington Street in downtown Oswego — close to Plainfield. Our NP-directed team customizes every plan, screens medically before treatment, and quotes clearly at a free consult. Serving Plainfield, Naperville, Aurora, Yorkville, Montgomery, and Kendall County with transparent pricing and natural-looking results. Book online or call (630) 636-6193 — same-week appointments are often available, and we are honest if another treatment or timeline would serve you better. Parking is straightforward downtown, and many Fox Valley clients pair their visit with a free consult on the same day.",
    faqs: [
      {
        question: "Do you serve Yorkville?",
        answer: "Yes — Yorkville clients are just a short drive from our Oswego clinic.",
      },
      {
        question: "Is it safe?",
        answer:
          "Yes — NP-directed, medically screened, with all prescriptions requiring provider approval.",
      },
      {
        question: "Cost?",
        answer: `From ${WL_PRICE}/month, tailored and explained at your free consult.`,
      },
    ],
  },
  "botox-yorkville-il": {
    servingLine: "Serving Yorkville from our Oswego clinic",
    h1: "Botox for Yorkville. Look Like You, Refreshed.",
    title: `Botox Yorkville, IL from ${BOTOX_PRICE}/unit | Expert Medical Injectors`,
    metaDescription: `Natural-looking Botox for Yorkville, IL by our medical injectors, from ${BOTOX_PRICE}/unit. Free consult — close to Yorkville in Oswego.`,
    intro: `Yorkville, keep your expressions and lose the lines. Our medical injectors tailor every unit for natural, refreshed results in a real medical setting nearby. Botox is ${BOTOX_PRICE}/unit — authentic Allergan product from US distributors only. Hello Gorgeous Med Spa is at 74 W. Washington Street in downtown Oswego — minutes from Yorkville. Our NP-directed team customizes every plan, screens medically before treatment, and quotes clearly at a free consult. Serving Yorkville, Naperville, Aurora, Plainfield, Montgomery, and Kendall County with transparent pricing and natural-looking results. Book online or call (630) 636-6193 — same-week appointments are often available, and we are honest if another treatment or timeline would serve you better. Parking is straightforward downtown, and many Fox Valley clients pair their visit with a free consult on the same day.`,
    faqs: [
      {
        question: "Pricing for Yorkville?",
        answer: `From ${BOTOX_PRICE} per unit, quoted clearly at your free consult.`,
      },
      {
        question: "Qualified injectors?",
        answer: "Yes — our trained medical team in an NP-directed clinic.",
      },
    ],
  },
  "morpheus8-yorkville-il": {
    servingLine: "Serving Yorkville from our Oswego clinic",
    h1: "Morpheus8 for Yorkville. Renew Without Surgery.",
    title: `Morpheus8 Yorkville, IL from ${M8_PRICE} | RF Microneedling Skin Tightening`,
    metaDescription: `Morpheus8 RF microneedling for Yorkville, IL from ${M8_PRICE} — firm and smooth skin, no surgery. NP-directed, minutes from Yorkville. Free consult.`,
    intro: `Yorkville clients turn to Morpheus8 for firmer, smoother skin without downtime-heavy surgery. Our providers use RF microneedling to boost collagen on face and body, customized to you at our Oswego clinic. Treatments start at ${M8_PRICE}.`,
    faqs: [
      {
        question: "What does Morpheus8 improve?",
        answer:
          "Skin firmness, texture, and tone — by stimulating your own collagen, tailored by your provider.",
      },
      {
        question: "Recovery?",
        answer: "Typically mild redness for a day or two; we prep you fully first.",
      },
      {
        question: "How much does Morpheus8 cost near Yorkville?",
        answer: `Treatments start at ${M8_PRICE}. Exact quote at your free consultation.`,
      },
    ],
  },

  // ── Montgomery ─────────────────────────────────────────────
  "weight-loss-montgomery-il": {
    servingLine: "Serving Montgomery from our Oswego clinic",
    h1: "Medical Weight Loss for Montgomery. Your Plan, Provider-Led.",
    title: "Medical Weight Loss Montgomery, IL | Provider-Supervised",
    metaDescription:
      "Provider-supervised medical weight loss for Montgomery, IL — personalized, medically screened programs. Free consult right next door in Oswego.",
    intro:
      "Montgomery, real results come from real medicine. Our NP team screens you and builds a weight-loss plan around your body and goals, with support all the way — right next door in Oswego. Programs start at $195/month. Hello Gorgeous Med Spa is at 74 W. Washington Street in downtown Oswego — minutes from Yorkville. Our NP-directed team customizes every plan, screens medically before treatment, and quotes clearly at a free consult. Serving Yorkville, Naperville, Aurora, Plainfield, Montgomery, and Kendall County with transparent pricing and natural-looking results. Book online or call (630) 636-6193 — same-week appointments are often available, and we are honest if another treatment or timeline would serve you better. Parking is straightforward downtown, and many Fox Valley clients pair their visit with a free consult on the same day.",
    faqs: [
      {
        question: "Do you serve Montgomery?",
        answer: "Yes — Montgomery is right next to our Oswego clinic, so you're very close.",
      },
      {
        question: "Medically supervised?",
        answer: "Yes — screened and monitored by our provider team; prescriptions need approval.",
      },
      {
        question: "Pricing?",
        answer: `From ${WL_PRICE}/month, personalized and reviewed at your consult.`,
      },
    ],
  },
  "botox-montgomery-il": {
    servingLine: "Serving Montgomery from our Oswego clinic",
    h1: "Botox for Montgomery. Smooth & Natural.",
    title: `Botox Montgomery, IL from ${BOTOX_PRICE}/unit | Medical Injectors`,
    metaDescription: `Expert Botox for Montgomery, IL — natural results by our medical injector team, from ${BOTOX_PRICE}/unit. Free consult right next door in Oswego.`,
    intro: `Montgomery, refresh your look without looking overdone. Our medical injectors customize every treatment for natural results — in a trusted medical clinic right next door. Botox is ${BOTOX_PRICE}/unit — authentic Allergan product from US distributors only. Hello Gorgeous Med Spa is at 74 W. Washington Street in downtown Oswego — right next door to Montgomery. Our NP-directed team customizes every plan, screens medically before treatment, and quotes clearly at a free consult. Serving Montgomery, Oswego, Aurora, Naperville, Plainfield, Yorkville, and Kendall County with transparent pricing and natural-looking results. Book online or call (630) 636-6193 — same-week appointments are often available, and we are honest if another treatment or timeline would serve you better. Parking is straightforward downtown, and many Fox Valley clients pair their visit with a free consult on the same day.`,
    faqs: [
      {
        question: "How much for Montgomery clients?",
        answer: `From ${BOTOX_PRICE} per unit, with a clear quote at your free consult.`,
      },
      {
        question: "Who injects?",
        answer: "Our trained medical injectors, in an NP-directed medical setting.",
      },
    ],
  },
  "morpheus8-montgomery-il": {
    servingLine: "Serving Montgomery from our Oswego clinic",
    h1: "Morpheus8 for Montgomery. Firm, Smooth, Radiant.",
    title: `Morpheus8 Montgomery, IL from ${M8_PRICE} | RF Microneedling`,
    metaDescription: `Morpheus8 RF microneedling for Montgomery, IL from ${M8_PRICE} — tighten, smooth & renew skin without surgery. NP-directed, right next door. Free consult.`,
    intro: `Montgomery clients love Morpheus8 for firmer, smoother, more radiant skin — no surgery needed. Our providers use RF microneedling to rebuild collagen on face and body, customized to you right next door in Oswego. Treatments start at ${M8_PRICE}.`,
    faqs: [
      {
        question: "What can it treat?",
        answer:
          "Skin laxity, texture, and tone on face and body — by boosting your own collagen, tailored by your provider.",
      },
      {
        question: "Any downtime?",
        answer: "Usually a day or two of mild redness; full aftercare reviewed beforehand.",
      },
      {
        question: "How much does Morpheus8 cost near Montgomery?",
        answer: `Treatments start at ${M8_PRICE}. Exact quote at your free consultation.`,
      },
    ],
  },
};

export function getCityFivePageCopy(slug: string): CityFivePageCopy | undefined {
  return CITY_FIVE_PAGE_COPY[slug];
}

/** PDF FAQs first, then shared fallbacks until ≥5 (SEO-002 extractability). */
export function cityFiveFaqsMerged(
  slug: string,
  fallback: CityFiveFaq[],
): CityFiveFaq[] {
  const copy = getCityFivePageCopy(slug);
  if (!copy) return fallback.slice(0, 8);
  const seen = new Set(copy.faqs.map((f) => f.question.toLowerCase()));
  const extras = fallback.filter((f) => !seen.has(f.question.toLowerCase()));
  return [...copy.faqs, ...extras].slice(0, 8);
}
