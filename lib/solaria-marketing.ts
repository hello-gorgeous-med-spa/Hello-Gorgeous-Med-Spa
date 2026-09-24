/**
 * Solaria CO₂ — flagship Journey marketing (InMode Trifecta).
 * Canonical route: /services/solaria-co2 (peer to Morpheus8 Journey).
 */

import { SOLARIA_FALL_599_CAMPAIGN, SOLARIA_FALL_599_USD } from "@/lib/campaigns/solaria-fall-599-2026";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

export const SOLARIA_CO2_PATH = "/services/solaria-co2" as const;

export const SOLARIA_CONTACT = {
  bookHref: PRIMARY_BOOKING_CTA.href,
  phoneTel: `tel:${SITE.phone.replace(/\D/g, "")}`,
  phoneDisplay: SITE.phone,
  textTel: "sms:6302016867",
  textDisplay: "(630) 201-6867",
  financingHref: "https://withcherry.com/apply",
} as const;

export const SOLARIA_MARKETING = {
  name: "Solaria CO₂",
  product: "InMode Solaria CO₂",
  tagline: "Gold-standard fractional laser resurfacing",
  eyebrow: "InMode Verified Provider · Oswego, IL",
  headline: "Your Solaria Journey",
  subhead:
    "Solaria by InMode is fractional ablative CO₂ resurfacing — the workhorse for fine lines, sun damage, acne scars, and texture — with nurse practitioner oversight at Hello Gorgeous.",
  trustLine:
    "The only Solaria CO₂ in the western Chicago suburbs — paired with Morpheus8 Burst & Quantum RF for the complete InMode Trifecta.",
  phoneDisplay: SOLARIA_CONTACT.phoneDisplay,
  phoneHref: SOLARIA_CONTACT.phoneTel,
  bookHref: SOLARIA_CONTACT.bookHref,
  textTel: SOLARIA_CONTACT.textTel,
  textDisplay: SOLARIA_CONTACT.textDisplay,
  careHref: "/pre-post-care/solaria-co2",
  landerHref: "/solaria-co2-oswego",
  compareMorpheusHref: "/services/morpheus8",
  quantumHref: "/quantum-rf-oswego",
  trifectaHref: "/specials",
  inmodeUrl: "https://www.inmodemd.com/workstation/solaria/",
  /** Clinic marketing hero — Solaria re-edit (speaker outro trimmed) */
  heroVideo: "/videos/solaria/solaria-hero.mp4",
  /** Official InMode treatments social (portrait) */
  treatmentsSocialVideo: "/videos/solaria/solaria-treatments-social.mp4",
  treatmentsSocialPoster: "/images/solaria/solaria-treatments-social-poster.jpg",
  clinicVideo: "/videos/solaria/solaria-co2-clinic-reedit-oswego.mp4",
  images: {
    hero: "/images/solaria/solaria-hero.jpg",
    device: "/images/solaria/solaria-inmode-machine.jpg",
    workstation: "/images/solaria/solaria-workstation.png",
    overview: "/images/solaria/solaria-inmode-manufacturer-overview.jpg",
    introducing: "/images/solaria/solaria-inmode-introducing-best-version.jpg",
    founder: "/images/team/dani-ryan-founders-portrait.png",
    clinicDanielle: "/images/solaria/danielle-solaria-inmode-clinic.png",
    clinicTreatment: "/images/solaria/hg-clinic-solaria-treatment.jpg",
    danielleBa: "/images/solaria/danielle-solaria-co2-before-during-after.png",
    edu1: "/images/solaria/education/solaria-educational-1.png",
    edu2: "/images/solaria/education/solaria-educational-2.png",
    edu3: "/images/solaria/education/solaria-educational-3.png",
    faceBa: "/images/solaria/solaria-co2-full-face-before-after.png",
    acneBa: "/images/solaria/solaria-co2-acne-scars-before-after.png",
    michelleBa: "/images/solaria/michelle-solaria-co2-one-treatment-facial-before-after.jpg",
    pigmentBa: "/images/solaria/solaria-co2-pigmentation-before-after-right.png",
    inmodeResults: "/images/solaria/solaria-inmode-before-after-results.jpg",
  },
} as const;

export const SOLARIA_SEPTEMBER_SPECIAL = {
  badge: SOLARIA_FALL_599_CAMPAIGN.seasonLabel,
  title: "Your skin — renewed",
  priceLabel: `$${SOLARIA_FALL_599_USD}`,
  priceNote: "Complimentary recovery serum included · limited appointments",
  description:
    "Limited-time fall special on InMode Solaria CO₂ fractional resurfacing — one treatment designed to help smoother, brighter, firmer-looking skin. Fine lines, acne scars, sun damage, texture, and mild laxity. Results vary. Consultation required.",
  ctaLabel: "Book your consultation",
  href: SOLARIA_CO2_PATH,
  validThrough: "October 31, 2026",
  validUntilIso: SOLARIA_FALL_599_CAMPAIGN.validUntilIso,
  offers: [
    {
      id: "face-neck-chin",
      name: "InMode Solaria CO₂",
      price: `$${SOLARIA_FALL_599_USD}`,
      was: "$899",
      note: "Fall special · complimentary recovery serum",
    },
    {
      id: "neck-chin-chest",
      name: "Neck, chin & chest",
      price: "Consult",
      was: null,
      note: "Mapped at your consultation",
    },
    {
      id: "under-eyes",
      name: "Under eyes only",
      price: "Consult",
      was: null,
      note: "Periocular plan at consult",
    },
  ],
} as const;

export const SOLARIA_SEPTEMBER_BLOG_PATH = "/blog/solaria-co2-september-sale-oswego-il" as const;

export function solariaSeptemberOfferJsonLd(pagePath: string) {
  const pricedOffers = SOLARIA_SEPTEMBER_SPECIAL.offers.filter((offer) =>
    /\d/.test(offer.price),
  );
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Solaria CO₂ fall special at Hello Gorgeous Med Spa, Oswego IL",
    description: SOLARIA_SEPTEMBER_SPECIAL.description,
    url: `${SITE.url}${pagePath}`,
    numberOfItems: pricedOffers.length,
    itemListElement: pricedOffers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: `Solaria CO₂ ${offer.name}`,
        description: offer.note,
        price: offer.price.replace(/[^0-9.]/g, ""),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        priceValidUntil: SOLARIA_SEPTEMBER_SPECIAL.validUntilIso,
        url: `${SITE.url}${SOLARIA_CO2_PATH}`,
        seller: {
          "@type": "MedicalBusiness",
          name: SITE.name,
          url: SITE.url,
          telephone: SITE.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: SITE.address.streetAddress,
            addressLocality: SITE.address.addressLocality,
            addressRegion: SITE.address.addressRegion,
            postalCode: SITE.address.postalCode,
          },
        },
        itemOffered: {
          "@type": "Service",
          name: `InMode Solaria CO₂ — ${offer.name}`,
          serviceType: "Fractional CO2 laser resurfacing",
          areaServed: ["Oswego IL", "Naperville IL", "Aurora IL", "Plainfield IL", "Fox Valley"],
        },
      },
    })),
  };
}

export const SOLARIA_LAUNCH_SPECIAL = {
  badge: SOLARIA_SEPTEMBER_SPECIAL.badge,
  title: SOLARIA_SEPTEMBER_SPECIAL.title,
  priceLabel: SOLARIA_SEPTEMBER_SPECIAL.priceLabel,
  priceNote: SOLARIA_SEPTEMBER_SPECIAL.priceNote,
  description: SOLARIA_SEPTEMBER_SPECIAL.description,
  ctaLabel: SOLARIA_SEPTEMBER_SPECIAL.ctaLabel,
  href: SOLARIA_SEPTEMBER_SPECIAL.href,
} as const;

/** Alias used by homepage band */
export const SOLARIA_INTRO_SPECIAL = SOLARIA_LAUNCH_SPECIAL;

export const SOLARIA_NAV = [
  { href: "#inmode", label: "InMode" },
  { href: "#why", label: "Why Solaria" },
  { href: "#science", label: "Science" },
  { href: "#treats", label: "Treats" },
  { href: "#results", label: "Results" },
  { href: "#recovery", label: "Recovery" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export const SOLARIA_INMODE_STORY = {
  eyebrow: "Why InMode Solaria",
  title: "The gold standard in",
  titleAccent: "CO₂ resurfacing",
  body: [
    "Solaria by InMode is carbon dioxide fractional ablative resurfacing — all the trusted benefits of traditional CO₂ with the advantages of fractional healing: precise microbeams, faster recovery, and natural-looking results.",
    "RF-excited CO₂ microbeam technology delivers deep ablation while leaving surrounding tissue untreated — so you get dramatic resurfacing with reduced downtime across a wide range of skin tones when performed correctly.",
  ],
  quote:
    "We brought Solaria home because surface texture, sun damage, and scars deserve a true CO₂ workhorse — not a compromise laser.",
  chips: ["Fractional ablative CO₂", "Custom millijoules & patterns", "Face · neck · chest · hands", "NP-directed"],
} as const;

export const SOLARIA_FOUNDER_NOTE = {
  eyebrow: "A Note From Danielle",
  title: "I sat in the chair. I am a believer.",
  paragraphs: [
    "This is my face. Before. During — the real redness, no filter. After. I am finally secure to wear no makeup.",
    "I did not buy Solaria for a brochure. I bought it because I had texture I was tired of covering. I am the founder. I still get in the chair. That is how I know what to tell you about downtime.",
    "Your result will be yours. Mine is mine. I am sharing it because it is personal, and it is real.",
  ],
  signOff: "xoxo, Danielle",
  role: "Founder · Hello Gorgeous Med Spa",
} as const;

export const SOLARIA_WHAT_IT_DOES = [
  {
    id: "resurface",
    title: "Deep resurfacing",
    body: "Fractional CO₂ creates controlled micro-zones — new skin emerges as damaged layers renew.",
    stat: "CO₂",
    statLabel: "fractional",
  },
  {
    id: "healing",
    title: "Faster healing",
    body: "Treated columns with intact bridges mean deep ablation with quicker recovery than old full-field lasers.",
    stat: "5–7",
    statLabel: "day social DT",
  },
  {
    id: "collagen",
    title: "Collagen surge",
    body: "Heat triggers months of remodeling — skin keeps improving long after peeling finishes.",
    stat: "3–6",
    statLabel: "mo. peak",
  },
  {
    id: "custom",
    title: "Fully customized",
    body: "Exact millijoules, scan patterns, and ablation zones — light, moderate, or aggressive depth mapped to you.",
    stat: "360°",
    statLabel: "control",
  },
] as const;

/** Consult + page: why fractional CO₂ is the medical resurfacing tool. Not a guarantee. */
export const SOLARIA_SCIENCE = {
  eyebrow: "The science",
  title: "Why carbon dioxide",
  titleAccent: "is the resurfacing laser",
  dek: "Skin is mostly water. CO₂ light is absorbed by that water, so it can vaporize a precise column of tissue — then the untreated skin beside it heals the gap. That is why this is a medical procedure, not a facial.",
  points: [
    {
      id: "wavelength",
      title: "Water is the target",
      body: "CO₂ light sits at 10,600 nm — a wavelength water grabs hard. Epidermis and dermis are water-rich, so the beam turns a tiny column of tissue into vapor (ablation) instead of just warming it. That is the difference from non-ablative “heat only” lasers.",
    },
    {
      id: "fractional",
      title: "Fractional, not old full-field",
      body: "Classic CO₂ removed the entire surface. Powerful — and slow to heal. Fractional Solaria lays a grid of micro-columns with intact bridges between them. New skin grows from those bridges and from hair follicles and glands. You still get true resurfacing; you do not strip the whole face at once.",
    },
    {
      id: "heat",
      title: "Ablation plus a collar of heat",
      body: "Each column has a vaporized center and a thin coagulated rim. That residual heat is why CO₂ is chosen when you want collagen to tighten and remodel — not only a polish. Texture and lines live in that dermal response over weeks to months, not only in the peel you see at day five.",
    },
    {
      id: "resurfacing",
      title: "Why we pick it for resurfacing",
      body: "Resurfacing means taking off damaged top layers so a new epidermis can form. CO₂ does that in controlled micro-zones: sun-worn cells, etch lines, dull stratum corneum. The medical reason: you cannot get that reset from cream, a hydrafacial, or RF that never opens the surface.",
    },
    {
      id: "texture",
      title: "Why we pick it for texture",
      body: "Texture is peaks and valleys — pores, roughness, acne-scar look. Ablating columns knocks down the peaks; the heat collar signals fibroblasts to lay new collagen in the valleys. That is why the QRG texture row uses more energy than a simple color pass: you are remodeling architecture, not just peppering pigment.",
    },
    {
      id: "medical",
      title: "Why it is a medical procedure",
      body: "You are creating an open wound pattern on purpose. Plume, eyes, infection, pigment change, scarring, and cold-sore flare are real. Candidacy, eye shields, smoke evacuator, aftercare, and a trained operator are the point. If it did not injure the skin in a controlled way, it would not rebuild it.",
    },
  ],
} as const;

export const SOLARIA_STEPS = [
  {
    step: "1",
    title: "Free consult",
    body: "We review skin type, downtime tolerance, and goals — never recommend CO₂ if it is not the right tool.",
  },
  {
    step: "2",
    title: "Numbing (30–60 min)",
    body: "Topical numbing typically 30–45 minutes. Deeper plans may add local comfort measures.",
  },
  {
    step: "3",
    title: "Fractional treatment",
    body: "Mild: ~30–45 min. Deeper coverage can run longer. Total clinic visit often 1.5–3 hours with prep & aftercare.",
  },
  {
    step: "4",
    title: "Peel & reveal",
    body: "Social downtime by depth · ointment & SPF plan · check-in as you heal · results build for months.",
  },
] as const;

export const SOLARIA_TREATS = [
  "Fine lines & wrinkles",
  "Acne scars",
  "Sun damage",
  "Age spots / pigment",
  "Uneven tone & texture",
  "Enlarged pores",
  "Perioral lines",
  "Mild–moderate laxity",
] as const;

export const SOLARIA_TREATMENT_AREAS = [
  "Full face",
  "Face + neck",
  "Eyes / periocular",
  "Perioral",
  "Décolleté / chest",
  "Hands",
  "Neck (add-on)",
  "Scar zones",
] as const;

export const SOLARIA_RECOVERY = [
  {
    level: "Light fractional",
    redness: "2–3 days",
    peeling: "3–5 days",
    healing: "7–10 days",
    makeup: "5–7 days",
  },
  {
    level: "Moderate fractional",
    redness: "3–5 days",
    peeling: "5–7 days",
    healing: "10–14 days",
    makeup: "7–10 days",
  },
  {
    level: "Deeper ablative",
    redness: "5–7 days",
    peeling: "7–14 days",
    healing: "2–3+ weeks",
    makeup: "2+ weeks",
  },
] as const;

export const SOLARIA_PACKAGES = [
  {
    id: "face-neck-chin",
    name: "InMode Solaria CO₂",
    price: `$${SOLARIA_FALL_599_USD}`,
    detail: "Limited-time fall special · complimentary recovery serum",
    bullets: ["Was $899", "Limited appointments", "Consult required"],
    highlight: true,
  },
  {
    id: "neck-chin-chest",
    name: "Neck, chin & chest",
    price: "Consult",
    detail: "Mapped at your consultation",
    bullets: ["Neck + chin + décolleté", "Honest downtime plan", "Quoted at consult"],
    highlight: false,
  },
  {
    id: "under-eyes",
    name: "Under eyes only",
    price: "Consult",
    detail: "Periocular plan at consult",
    bullets: ["Crepey texture & fine lines", "Light–moderate depth", "Consult required"],
    highlight: false,
  },
  {
    id: "trifecta",
    name: "VIP Trifecta",
    price: "Specials →",
    detail: "Solaria + Morpheus8 + Quantum",
    bullets: ["Complete InMode overhaul", "Exclusive bundle", "Priority booking"],
    highlight: false,
    href: "/specials",
  },
] as const;

/** Manufacturer-style depth guide (education) — HG quotes final price at consult. */
export const SOLARIA_DEPTH_GUIDE = [
  {
    area: "Full face",
    light: "Light depth · series available",
    moderate: "Moderate depth · series available",
    note: "Aggressive depth sold as single treatment when indicated",
  },
  {
    area: "Face + neck",
    light: "Light combined plan",
    moderate: "Moderate combined plan",
    note: "Mapped at consult for downtime & goals",
  },
  {
    area: "Add-ons",
    light: "Hands / chest / neck light",
    moderate: "Moderate add-on depth",
    note: "Often paired with full-face launch special",
  },
] as const;

const BA = "/images/solaria/inmode-ba";

export type SolariaResult = {
  src: string;
  alt: string;
  label: string;
  source: "clinic" | "inmode";
};

export const SOLARIA_RESULTS: SolariaResult[] = [
  {
    src: SOLARIA_MARKETING.images.danielleBa,
    alt: "Danielle Alcala-Glazier Solaria CO₂ before, during, and after — Hello Gorgeous founder, Oswego IL",
    label: "Danielle · founder · no makeup",
    source: "clinic",
  },
  {
    src: SOLARIA_MARKETING.images.michelleBa,
    alt: "Solaria CO2 one treatment facial rejuvenation before and after — Hello Gorgeous",
    label: "One treatment · Hello Gorgeous",
    source: "clinic",
  },
  {
    src: SOLARIA_MARKETING.images.faceBa,
    alt: "Solaria CO2 full face before and after — Hello Gorgeous Med Spa",
    label: "Full face · Hello Gorgeous",
    source: "clinic",
  },
  {
    src: SOLARIA_MARKETING.images.acneBa,
    alt: "Solaria CO2 acne scars before and after",
    label: "Acne scars · Hello Gorgeous",
    source: "clinic",
  },
  {
    src: SOLARIA_MARKETING.images.pigmentBa,
    alt: "Solaria CO2 pigmentation before and after",
    label: "Pigmentation · Hello Gorgeous",
    source: "clinic",
  },
  {
    src: `${BA}/face-ls.jpg`,
    alt: "Solaria face before and after left side — InMode clinical result",
    label: "Face profile",
    source: "inmode",
  },
  {
    src: `${BA}/face-rs.jpg`,
    alt: "Solaria face before and after right side — InMode clinical result",
    label: "Face profile",
    source: "inmode",
  },
  {
    src: `${BA}/face-ba0110.jpg`,
    alt: "Solaria before and after clinical result",
    label: "Resurfacing result",
    source: "inmode",
  },
  {
    src: `${BA}/face-front-zoom.jpg`,
    alt: "Solaria face front before and after — InMode clinical result",
    label: "Full face",
    source: "inmode",
  },
];

export const SOLARIA_FAQS = [
  {
    q: "What is Solaria CO₂?",
    a: "Solaria is InMode's fractional ablative CO₂ laser. It places thousands of microscopic treatment columns in the skin so collagen can rebuild, while leaving bridges of untreated skin so you heal faster than old full-field CO₂. It is a medical resurfacing treatment — not a lunchtime facial.",
  },
  {
    q: "What does it treat?",
    a: "Fine lines, sun damage and brown spots, uneven texture, enlarged pores, acne-scar appearance, perioral lines, and mild laxity. Neck and chest can be treated more gently than the face. We map the plan to the photo you dislike — not to a package name.",
  },
  {
    q: "How long is downtime?",
    a: "Light plans: redness about 2–3 days, makeup often around 5–7 days. Moderate: redness 3–5 days, makeup about 7–10 days. Deeper ablative: redness 5–7 days, makeup 2+ weeks, with peeling that can last longer. We will not book a depth your calendar cannot support.",
  },
  {
    q: "When will I see results?",
    a: "The peel and pinkness are week one. Texture and glow keep changing as you heal. Collagen remodeling can continue for about 3–6 months. Results vary. We do not promise a magazine photo.",
  },
  {
    q: "How many treatments do I need?",
    a: "Some people are happy after one well-planned treatment. Deep scarring or heavy sun damage may need a series spaced for healing — often months apart. Number of sessions depends on area size, how you respond, and what downtime you can take. That is decided at consult, not from a flyer.",
  },
  {
    q: "Does it hurt?",
    a: "We numb thoroughly — topical anesthetic is typically 30–45 minutes (not more than about 45–60 minutes). Most people describe heat and mild prickling during, then a sunburn feel after. Sensitive skin gets extra caution. If you react to the numbing, we stop.",
  },
  {
    q: "Solaria vs Morpheus8 — which is right for me?",
    a: "Solaria resets the surface: tone, etch lines, sun, texture. Morpheus8 works under the surface for collagen and tightening. They are different tools. Some people need one. Some need both (our InMode Trifecta). We pick from the photo, not from a trend.",
  },
  {
    q: "How much does Solaria cost?",
    a: "Limited-time fall special: InMode Solaria CO₂ fractional resurfacing is $599 and includes complimentary recovery serum (was $899), through October 31, 2026. Neck, chest, and under-eyes are quoted at consult because those areas are treated more carefully. Results vary. Consultation required.",
  },
  {
    q: "Can I treat my neck or chest?",
    a: "Yes — with gentler settings than the face. Off-face skin (neck and chest) needs reduced parameters. That is safety, not an upsell. Those zones are quoted separately.",
  },
  {
    q: "What about under-eyes?",
    a: "Periocular skin can be treated with a small-area tip and a lighter plan when you are a candidate. Eye shields are used when we treat near the eyes. This is mapped at consult — not a walk-in add-on.",
  },
  {
    q: "When can I wear makeup?",
    a: "After the surface has started to re-heal and we clear you — often about 5–7 days for light, 7–10 for moderate, 2+ weeks for deeper. Do not pack makeup into peeling skin. Mineral makeup only when we say so.",
  },
  {
    q: "When can I work out or sweat?",
    a: "Skip heat, heavy sweat, saunas, and pools until the skin is closed and we say you can. Sweat in open laser columns is an infection and irritation risk. We will give you a date based on your depth.",
  },
  {
    q: "What about sun?",
    a: "No fresh tan, beds, or unprotected sun before treatment. Afterward: broad-spectrum SPF 50+ and a hat for the first weeks. Sun on healing CO₂ is how people stain. If you cannot hide from a beach trip, we wait.",
  },
  {
    q: "I get cold sores. Can I still do this?",
    a: "Tell us. Laser around the mouth can wake HSV. Many people start an antiviral 1–2 days before. Do not hide a history of cold sores — we would rather pretreat than have an outbreak on peeling skin.",
  },
  {
    q: "I am on Accutane / isotretinoin.",
    a: "Recent isotretinoin is a pause. Healing and scarring risk can stay elevated after a course. We screen this at consult and wait until it is appropriate. Do not stop a prescription on your own — talk to the clinician who prescribed it.",
  },
  {
    q: "Is it safe on darker skin?",
    a: "CO₂ can cause pigment change (darker or lighter) on any skin, with higher PIH risk on deeper tones. We type your skin, talk through risk, and may test-spot or choose a different plan. We do not treat everyone the same day with the same depth.",
  },
  {
    q: "I have melasma.",
    a: "Ablative CO₂ is not automatically the first tool for melasma — heat can flare it. We look at your pattern, your sun habits, and whether a different approach is smarter. Honesty here saves you a worse blotch.",
  },
  {
    q: "I still have active acne.",
    a: "Open, infected, or very active breakouts may mean we wait or treat around them. CO₂ is for texture and scars after the fire is out — not a substitute for an acne plan.",
  },
  {
    q: "Can I do this if I am pregnant or breastfeeding?",
    a: "We do not perform Solaria during pregnancy. Breastfeeding is a clinician call at consult. If you are trying to conceive, tell us so we can time numbing, antivirals, and downtime with you.",
  },
  {
    q: "I have fillers / Botox. Do I wait?",
    a: "Tell us dates and areas. Many people keep neuromodulators and wait a period after filler before aggressive laser on that zone. We will not guess — bring your last treatment dates.",
  },
  {
    q: "Will I look scary / peel in sheets?",
    a: "You will be red, then bronzy, then flake. Deeper plans look more dramatic in the mirror. That is expected — not a burn you hide from us. Do not pick. The bronzy layer is part of healing. Ice, ointment, and extra pillows as we show you.",
  },
  {
    q: "Do you do a test spot?",
    a: "When it helps us choose energy and density — especially if your history, skin type, or a setting change calls for it. A tiny test can save a full-face surprise. We watch how you heal before we commit to a deeper pass.",
  },
  {
    q: "Can I be treated the same day as my consult?",
    a: "Only if you are a candidate, you can take the downtime, prep is done (including antiviral if needed), and the schedule allows. Many people consult first and book the laser on a date that matches work and events.",
  },
  {
    q: "How long do results last?",
    a: "You keep aging and the sun keeps working. A strong treatment can change the baseline for years; maintenance and SPF decide how long it looks that way. We do not sell 'permanent.'",
  },
  {
    q: "Who should not have Solaria?",
    a: "Examples we screen: pregnancy, recent isotretinoin, active infection in the area, certain autoimmune or healing problems, unrealistic event timelines, and anyone who cannot do aftercare or sun avoidance. Final yes/no is clinical — not this list alone.",
  },
] as const;

export const SOLARIA_NAV_ACTIVE_PREFIXES = [
  SOLARIA_CO2_PATH,
  "/solaria",
  "/pre-post-care/solaria",
  "/aftercare/solaria",
] as const;

export function isSolariaNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return SOLARIA_NAV_ACTIVE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`) || pathname.startsWith(`${p}-`),
  );
}

export const SOLARIA_SEO = {
  title: "Solaria CO₂ Fall Special | $599 Fractional Resurfacing | Oswego IL",
  description:
    "Limited-time fall special: InMode Solaria CO₂ fractional resurfacing $599 at Hello Gorgeous in Oswego, IL — complimentary recovery serum included. Fine lines, acne scars, sun damage, texture. Consult required.",
  ogAlt: "Solaria CO₂ $599 fall special — Hello Gorgeous Med Spa Oswego",
} as const;
