/**
 * Hello Gorgeous Med Spa + RE GEN — mascot knowledge base (no paid AI).
 * Source of truth for rule-based mascot answers. Extend here as services grow.
 */

import { REGEN_FAQ, REGEN_GOALS, REGEN_HOW_IT_WORKS, REGEN_SITE, REGEN_WHY } from "@/lib/regen-site";
import { SITE } from "@/lib/seo";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

export type RegenMascotId = "peppy" | "slim-t" | "harmony";

export type KnowledgeTopic =
  | "hg"
  | "regen"
  | "weight-loss"
  | "peptides"
  | "hormones"
  | "sexual-health"
  | "hair-skin"
  | "wellness"
  | "labs"
  | "portal"
  | "booking";

export type KnowledgeEntry = {
  id: string;
  keywords: string[];
  topics: KnowledgeTopic[];
  /** If set, only these mascots use this entry first */
  mascots?: RegenMascotId[];
  answer: string;
  /** Higher wins ties */
  priority?: number;
};

const BOOK = `Book in-clinic at ${SITE.url}${PRIMARY_BOOKING_CTA.href} or shop RE GEN at ${SITE.url}/rx`;
const CALL = `Call ${REGEN_SITE.phone}`;
const PORTAL = `Patient portal: ${SITE.url}/portal/rx — magic-link login, no password`;

export const HG_REGEN_CORE = {
  clinicName: "Hello Gorgeous Med Spa",
  regenName: REGEN_SITE.fullName,
  location: `${REGEN_SITE.address.street}, ${REGEN_SITE.address.city}, ${REGEN_SITE.address.state} ${REGEN_SITE.address.zip}`,
  phone: REGEN_SITE.phone,
  np: "Ryan Kent, FNP-BC",
  founders: REGEN_SITE.founders,
  shipping: REGEN_SITE.shipping,
  serviceAreas:
    "Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery, and telehealth across Illinois",
  inClinicServices:
    "Botox/Dysport/Jeuveau, dermal fillers, Morpheus8, microneedling, IV Vitamin Bar, hormone therapy, weight loss, peptides, and more",
} as const;

/** Shared entries — any mascot can answer */
export const SHARED_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "what-is-hg",
    keywords: ["hello gorgeous", "med spa", "who are you", "about you", "about us", "oswego"],
    topics: ["hg"],
    priority: 3,
    answer: `${HG_REGEN_CORE.clinicName} is a nurse-practitioner-directed med spa in downtown Oswego, IL — #1 rated locally on Google. ${HG_REGEN_CORE.founders} lead in-clinic aesthetics and wellness. ${BOOK}. ${CALL}.`,
  },
  {
    id: "what-is-regen",
    keywords: ["re gen", "regen", "what is regen", "online rx", "telehealth rx", "prescription online"],
    topics: ["regen"],
    priority: 4,
    answer: `${HG_REGEN_CORE.regenName} is the telehealth prescription arm of Hello Gorgeous — compounded GLP-1, peptides, hormones, sexual health, hair/skin Rx, and wellness injectables. Pay online → health intake → NP review → flat ${HG_REGEN_CORE.shipping} shipping. Start at ${SITE.url}/rx`,
  },
  {
    id: "how-regen-works",
    keywords: ["how does it work", "how it works", "process", "steps", "what happens", "after i pay", "order flow"],
    topics: ["regen"],
    priority: 5,
    answer: `RE GEN flow: (1) Pay to secure your order on ${SITE.url}/rx (2) Complete post-payment health intake (3) Book telehealth when required (4) ${HG_REGEN_CORE.np} reviews and approves (5) Pharmacy ships — ${HG_REGEN_CORE.shipping} flat. Track in ${PORTAL}.`,
  },
  {
    id: "shipping",
    keywords: ["shipping", "delivery", "ship", "mail", "discreet", "how much shipping"],
    topics: ["regen"],
    priority: 4,
    answer: `Every RE GEN order ships discreetly for a flat ${HG_REGEN_CORE.shipping}. Nothing ships until your NP approves your intake. ${CALL} for help.`,
  },
  {
    id: "provider",
    keywords: ["provider", "np", "ryan", "doctor", "who prescribes", "medical director", "fnp"],
    topics: ["regen", "hg"],
    priority: 4,
    answer: `Every RE GEN protocol is supervised by ${HG_REGEN_CORE.np}, board-certified family nurse practitioner, on site in Oswego — not an anonymous telehealth mill. In-clinic visits available too.`,
  },
  {
    id: "location",
    keywords: ["where", "address", "location", "oswego", "directions", "fox valley", "illinois"],
    topics: ["hg"],
    priority: 4,
    answer: `Hello Gorgeous is at ${HG_REGEN_CORE.location} — downtown Oswego. We serve ${HG_REGEN_CORE.serviceAreas}. ${BOOK}`,
  },
  {
    id: "phone",
    keywords: ["phone", "call", "contact", "number", "reach", "text"],
    topics: ["hg", "regen"],
    priority: 5,
    answer: `${CALL} — our team answers questions about med spa services and RE GEN orders. Online shop: ${SITE.url}/rx`,
  },
  {
    id: "book",
    keywords: ["book", "appointment", "schedule", "consult", "come in", "visit"],
    topics: ["hg", "booking"],
    priority: 5,
    answer: `${BOOK}. For RE GEN prescriptions shipped home, start at ${SITE.url}/rx — most paths are pay-first online.`,
  },
  {
    id: "portal",
    keywords: ["portal", "login", "my rx", "track order", "account", "magic link"],
    topics: ["portal", "regen"],
    priority: 5,
    answer: `${PORTAL}. After your first RE GEN order you'll get a secure email link. Same email as checkout.`,
  },
  {
    id: "pricing-general",
    keywords: ["price", "pricing", "cost", "how much", "expensive", "afford", "fee", "membership fee"],
    topics: ["regen", "hg"],
    priority: 3,
    answer: `RE GEN shows patient pricing on each category page at ${SITE.url}/rx — transparent, no hidden pharmacy runaround. Flat ${HG_REGEN_CORE.shipping} shipping. In-clinic med spa pricing varies by treatment; ${BOOK} for a consult.`,
  },
  {
    id: "fda-compounded",
    keywords: ["fda", "compounded", "legit", "legitimate", "safe", "real medicine", "pharmacy"],
    topics: ["regen"],
    priority: 4,
    answer: REGEN_FAQ.items.find((i) => i.q.includes("FDA"))?.a ??
      "Compounded medications are prepared by licensed US pharmacies for individual patients. Your NP determines if appropriate — never gray-market research chemicals.",
  },
  {
    id: "in-person",
    keywords: ["in person", "in-person", "clinic visit", "come to clinic", "oswego office"],
    topics: ["hg", "regen"],
    priority: 3,
    answer: REGEN_FAQ.items.find((i) => i.q.includes("come in"))?.a ??
      `Most RE GEN starts online. Labs, Vitamin Bar, injectables, and aesthetics are in-clinic at ${HG_REGEN_CORE.location}.`,
  },
  {
    id: "refill",
    keywords: ["refill", "reorder", "renew", "next month", "90 day", "supply"],
    topics: ["regen", "portal"],
    priority: 4,
    answer: `Existing RE GEN patients track refills in ${PORTAL}. GLP-1 legacy refills also use ${SITE.url}/glp1-refill. Reorder from ${SITE.url}/rx or call ${REGEN_SITE.phone}.`,
  },
  {
    id: "app",
    keywords: ["app", "pwa", "install", "home screen", "client app"],
    topics: ["hg", "portal"],
    priority: 3,
    answer: `Install the Hello Gorgeous client app: ${SITE.url}/get-app — deals, memberships, and portal access.`,
  },
  {
    id: "botox",
    keywords: ["botox", "dysport", "jeuveau", "tox", "wrinkle", "injectable"],
    topics: ["hg"],
    priority: 4,
    answer: `In-clinic neuromodulators (Botox, Dysport, Jeuveau) for lines, slimming, and hyperhidrosis — NP-supervised at ${HG_REGEN_CORE.location}. ${BOOK}`,
  },
  {
    id: "fillers",
    keywords: ["filler", "fillers", "lip", "cheek", "jawline", "dermal"],
    topics: ["hg"],
    priority: 4,
    answer: `Dermal fillers for lips, cheeks, jawline, and balance — artistry from our Oswego team. Consult in person: ${SITE.url}/book`,
  },
  {
    id: "morpheus",
    keywords: ["morpheus", "rf microneedling", "microneedling", "solaria", "co2", "skin tightening"],
    topics: ["hg"],
    priority: 4,
    answer: `Hello Gorgeous offers Morpheus8 Burst, Quantum RF, Solaria CO2, and microneedling for skin tightening and texture — flagship in-clinic treatments in Oswego. ${BOOK}`,
  },
  {
    id: "iv-vitamin",
    keywords: ["iv", "vitamin bar", "drip", "nad drip", "b12 shot"],
    topics: ["hg", "wellness"],
    priority: 3,
    answer: `IV Vitamin Bar and injectable wellness (NAD+, B12, glutathione) in-clinic at Oswego. Many wellness Rx also ship via RE GEN at ${SITE.url}/rx/wellness`,
  },
  {
    id: "sexual-health",
    keywords: ["pt-141", "libido", "sexual", "ed", "erectile", "performance"],
    topics: ["sexual-health", "regen"],
    priority: 4,
    answer: `RE GEN sexual wellness includes PT-141 and hormone-supported options — discreet telehealth, NP-reviewed. ${SITE.url}/rx/sexual-health`,
  },
  {
    id: "hair-skin-rx",
    keywords: ["finasteride", "tretinoin", "hair loss", "ghk-cu", "skin rx"],
    topics: ["hair-skin", "regen"],
    priority: 4,
    answer: `Hair + skin Rx: finasteride, tretinoin, GHK-Cu, and regenerative protocols — compounded and shipped after NP approval. ${SITE.url}/rx/hair-skin`,
  },
  {
    id: "categories",
    keywords: ["what do you offer", "services", "treatments", "shop", "categories"],
    topics: ["regen", "hg"],
    priority: 4,
    answer: `RE GEN: weight loss, peptides, hormones, sexual health, hair/skin, wellness, labs. In-clinic Hello Gorgeous: ${HG_REGEN_CORE.inClinicServices}. Browse ${SITE.url}/rx`,
  },
  ...REGEN_FAQ.items.map((item, i) => ({
    id: `regen-faq-${i}`,
    keywords: item.q.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
    topics: ["regen"] as KnowledgeTopic[],
    answer: item.a,
    priority: 2,
  })),
];

export const MASCOT_KNOWLEDGE: Record<RegenMascotId, KnowledgeEntry[]> = {
  "slim-t": [
    {
      id: "semaglutide",
      keywords: ["semaglutide", "ozempic", "wegovy", "glp-1", "glp1"],
      topics: ["weight-loss"],
      mascots: ["slim-t"],
      priority: 5,
      answer: `Compounded semaglutide is a GLP-1 injection for medical weight loss — appetite, gastric emptying, NP-titrated dosing. RE GEN programs from ${REGEN_GOALS.find((g) => g.id === "weight-loss")?.priceNote ?? "shown on site"}. Shop ${SITE.url}/rx/weight-loss`,
    },
    {
      id: "tirzepatide",
      keywords: ["tirzepatide", "mounjaro", "zepbound", "dual", "gip"],
      topics: ["weight-loss"],
      mascots: ["slim-t"],
      priority: 5,
      answer: `Tirzepatide hits GLP-1 + GIP — many patients see strong results. Compounded, NP-supervised, shipped after approval. See pricing on ${SITE.url}/rx/weight-loss`,
    },
    {
      id: "weight-loss-start",
      keywords: ["lose weight", "weight loss", "start", "get started", "begin"],
      topics: ["weight-loss"],
      mascots: ["slim-t"],
      priority: 4,
      answer: `Ready to crush your goals? Shop GLP-1 at ${SITE.url}/rx → pay → complete intake → telehealth if needed → ${HG_REGEN_CORE.np} approves → ships ${HG_REGEN_CORE.shipping}. Most patients need weekly self-injections with gradual dose increases.`,
    },
    {
      id: "side-effects-glp1",
      keywords: ["side effect", "nausea", "sick", "constipation", "throw up"],
      topics: ["weight-loss"],
      mascots: ["slim-t"],
      priority: 4,
      answer: `GLP-1 side effects like nausea or constipation are common early on and often improve as your dose titrates. Your NP monitors you — never change dose without them. Urgent symptoms? ${CALL}.`,
    },
    {
      id: "lipo-b12",
      keywords: ["b12", "lipo", "mino", "mic", "lipotropic"],
      topics: ["weight-loss", "wellness"],
      mascots: ["slim-t"],
      priority: 3,
      answer: `Lipo-Mino (MIC) and B12 injections support metabolism alongside GLP-1 programs. Available through RE GEN wellness and weight-loss categories.`,
    },
  ],
  peppy: [
    {
      id: "bpc-157",
      keywords: ["bpc", "bpc-157", "gut", "recovery", "repair"],
      topics: ["peptides"],
      mascots: ["peppy"],
      priority: 5,
      answer: `BPC-157 is our go-to for tissue repair and gut support — injectable protocol, NP-reviewed. Part of recovery stacks like the Wolverine (BPC + TB-500). Explore ${SITE.url}/rx/peptides`,
    },
    {
      id: "nad",
      keywords: ["nad", "nad+", "longevity", "energy", "mitochondria"],
      topics: ["peptides", "wellness"],
      mascots: ["peppy"],
      priority: 5,
      answer: `NAD+ supports cellular energy and focus — injectable protocols in peptides and daily wellness. Science-backed longevity tool; your NP sets dosing. ${SITE.url}/rx/peptides`,
    },
    {
      id: "sermorelin",
      keywords: ["sermorelin", "gh", "growth hormone", "sleep", "secretagogue"],
      topics: ["peptides"],
      mascots: ["peppy"],
      priority: 4,
      answer: `Sermorelin stimulates your natural GH axis — popular for sleep, recovery, and body composition. GH-axis peptides often need labs (IGF-1). See ${SITE.url}/rx/peptides`,
    },
    {
      id: "wolverine",
      keywords: ["wolverine", "tb-500", "tb500", "stack", "combo"],
      topics: ["peptides"],
      mascots: ["peppy"],
      priority: 5,
      answer: `Wolverine Stack = BPC-157 + TB-500 — our fan-favorite recovery combo. KLOW adds GHK-Cu + KPV for premium repair. All compounded Rx, not research-grade. ${SITE.url}/rx/peptides`,
    },
    {
      id: "peptide-start",
      keywords: ["peptide", "peptides", "start peptide", "which peptide"],
      topics: ["peptides"],
      mascots: ["peppy"],
      priority: 4,
      answer: `Peptides are Rx-only short amino-acid chains for recovery, GH support, longevity, and more. RE GEN has 20+ protocols. Pay → intake → NP review → ship. Start at ${SITE.url}/rx/peptides`,
    },
    {
      id: "what-are-peptides",
      keywords: ["what are peptide", "how do peptide", "peptide therapy"],
      topics: ["peptides"],
      mascots: ["peppy"],
      priority: 4,
      answer: `Peptides signal specific responses — repair, GH, mitochondria, immune support. They're compounded by licensed pharmacies for you, not bought off random websites. Subcutaneous injections are most common.`,
    },
  ],
  harmony: [
    {
      id: "trt",
      keywords: ["trt", "testosterone", "low t", "low t", "men", "male hormone"],
      topics: ["hormones"],
      mascots: ["harmony"],
      priority: 5,
      answer: `TRT (testosterone replacement) can be injections, cream, or fertility-friendly options like clomiphene or HCG. Labs required first. ${HG_REGEN_CORE.np} guides dosing. ${SITE.url}/rx/hormones`,
    },
    {
      id: "hrt-women",
      keywords: ["hrt", "estrogen", "progesterone", "bi-est", "biest", "menopause", "perimenopause", "hot flash"],
      topics: ["hormones"],
      mascots: ["harmony"],
      priority: 5,
      answer: `Women's HRT uses bioidentical estradiol, estriol, Bi-Est, progesterone, and sometimes low-dose testosterone — personalized from your labs. ${SITE.url}/rx/hormones`,
    },
    {
      id: "labs-hormones",
      keywords: ["labs", "bloodwork", "blood work", "test levels", "panel"],
      topics: ["hormones", "labs"],
      mascots: ["harmony"],
      priority: 4,
      answer: `Hormone therapy is lab-guided — baseline panels before starting, rechecks to stay in range. Draw in Oswego or Access Medical Labs. Panels from $199 at ${SITE.url}/rx/labs`,
    },
    {
      id: "hormone-start",
      keywords: ["hormone", "hormones", "balance", "feel like myself"],
      topics: ["hormones"],
      mascots: ["harmony"],
      priority: 4,
      answer: `Hormones are your body's conductors — when they're off, energy, mood, libido, and sleep suffer. RE GEN offers TRT, HRT, DHEA, and more with ${HG_REGEN_CORE.np}. Start at ${SITE.url}/rx/hormones`,
    },
    {
      id: "enclomiphene-hcg",
      keywords: ["enclomiphene", "clomid", "hcg", "fertility", "preserve"],
      topics: ["hormones"],
      mascots: ["harmony"],
      priority: 4,
      answer: `Enclomiphene and HCG stimulate your own testosterone production — options when fertility matters. Your NP picks the right path from labs and goals.`,
    },
  ],
};

export const MASCOT_QUICK_ANSWERS: Record<RegenMascotId, Record<string, string>> = {
  "slim-t": {
    "semaglutide vs tirzepatide?": `Semaglutide is GLP-1 only; tirzepatide adds GIP — many see more weight loss. Your NP helps you choose based on history and goals. Compare at ${SITE.url}/rx/weight-loss`,
    "how fast can i lose weight?": `Most GLP-1 patients see meaningful progress over months, not days — typically 15–25% body weight over 12–18 months with lifestyle support. Your NP sets realistic expectations.`,
    "what are glp-1 side effects?": `Nausea and constipation are common early; dose titration helps. Always report symptoms to your NP — never adjust dose alone.`,
    "how do i get started?": `Shop ${SITE.url}/rx → pick GLP-1 → pay → intake → telehealth → NP approves → ships! ${CALL} if you want help.`,
  },
  peppy: {
    "what's the wolverine stack?": `BPC-157 + TB-500 — our recovery power duo for tissue repair and mobility. Premium option: KLOW (4-in-1). ${SITE.url}/rx/peptides`,
    "best peptide for recovery?": `BPC-157 and Wolverine Stack are top picks for injury recovery. TB-500 pairs well. Your NP tailors protocol to your history.`,
    "what is nad+?": `NAD+ fuels mitochondria — energy, focus, longevity. Injectable protocols on RE GEN; NP determines concentration and schedule.`,
    "how do i get started?": `Browse ${SITE.url}/rx/peptides → add to cart → pay → complete intake → NP review → delivery!`,
  },
  harmony: {
    "what is trt?": `Testosterone replacement therapy restores levels when clinically low — injections, cream, or stimulating meds. Requires labs and ongoing monitoring with ${HG_REGEN_CORE.np}.`,
    "signs of low testosterone?": `Fatigue, low libido, brain fog, muscle loss, mood changes — but only labs confirm. Book labs at ${SITE.url}/rx/labs`,
    "hrt for women explained": `Bioidentical estrogen/progesterone (and sometimes low-dose T) can ease perimenopause/menopause symptoms — always personalized from labs.`,
    "how do i get started?": `Start at ${SITE.url}/rx/hormones — pay, intake, labs as needed, telehealth, then NP-approved Rx shipped to you.`,
  },
};

export const MASCOT_GREETINGS: Record<RegenMascotId, string> = {
  peppy: `Hey! I'm Peppy — your peptide educator for RE GEN by Hello Gorgeous. Ask me about protocols, recovery, NAD+, or how online ordering works!`,
  "slim-t": `Hey! I'm Slim-T — your GLP-1 weight loss coach for RE GEN. Ask about semaglutide, tirzepatide, or how to get started!`,
  harmony: `Hi, I'm Harmony — your hormone balance guide for RE GEN. Ask about TRT, women's HRT, labs, or our Oswego team!`,
};

export const MASCOT_FALLBACK: Record<RegenMascotId, string> = {
  peppy: `Great question! For specifics on dosing or what's right for you, ${HG_REGEN_CORE.np} reviews every order. Browse ${SITE.url}/rx/peptides or ${CALL}.`,
  "slim-t": `I want you to win — but your NP has to sign off on the clinical details. Shop ${SITE.url}/rx/weight-loss or ${CALL}.`,
  harmony: `Hormones are personal — I can explain options, but your plan comes from labs and ${HG_REGEN_CORE.np}. Start at ${SITE.url}/rx/hormones or ${CALL}.`,
};

/** Cross-mascot redirects */
export const MASCOT_HANDOFFS: { keywords: string[]; mascot: RegenMascotId; hint: string }[] = [
  {
    keywords: ["peptide", "bpc", "nad", "sermorelin", "wolverine"],
    mascot: "peppy",
    hint: "Peppy knows peptides best",
  },
  {
    keywords: ["weight", "semaglutide", "tirzepatide", "glp"],
    mascot: "slim-t",
    hint: "Slim-T coaches GLP-1 weight loss",
  },
  {
    keywords: ["testosterone", "trt", "hrt", "estrogen", "progesterone", "hormone"],
    mascot: "harmony",
    hint: "Harmony guides hormones",
  },
];

export const REGEN_CATEGORY_LINKS = Object.fromEntries(
  REGEN_GOALS.map((g) => [g.id, { title: g.title, href: g.href, priceNote: g.priceNote }]),
) as Record<string, { title: string; href: string; priceNote: string }>;

export const REGEN_STEPS_TEXT = REGEN_HOW_IT_WORKS.steps
  .map((s, i) => `${i + 1}. ${s.title}`)
  .join(" → ");

export const REGEN_WHY_TEXT = `${REGEN_WHY.headline} ${REGEN_WHY.intro}`;
