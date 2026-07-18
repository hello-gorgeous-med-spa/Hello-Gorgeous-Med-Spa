/**
 * Ad-style landing page content — Ageless AI–inspired conversion structure
 * for Hello Gorgeous Face Blueprint™ + booking.
 * Route: /see-your-results
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { MEDICAL_TRUST_PROVIDERS } from "@/lib/medical-trust";
import { SITE } from "@/lib/seo";

export const SEE_YOUR_RESULTS_PATH = "/see-your-results";
export const FACE_BLUEPRINT_HREF = "/face-blueprint";

export const SEE_YOUR_RESULTS_META = {
  title: "See Your Results Before You Book | Face Blueprint™ | Hello Gorgeous",
  description:
    "Upload a selfie and preview Botox, lips, jawline & more with HG Face Blueprint™ — then book a free consult at Hello Gorgeous Med Spa in Oswego, IL.",
  path: SEE_YOUR_RESULTS_PATH,
} as const;

export const SEE_YOUR_RESULTS_NAV = [
  { href: "#results", label: "Results" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
] as const;

export const SEE_YOUR_RESULTS_HERO = {
  brand: "Hello Gorgeous",
  locality: "Oswego · Naperville · Aurora · Plainfield",
  headlineLead: "What if you could see your results",
  headlineAccent: "before you book?",
  subhead:
    "HG Face Blueprint™ — AI-assisted visualization that helps you preview treatments on your own face. Then book with our NP-directed team.",
  primaryCta: { label: "Try Face Blueprint™", href: FACE_BLUEPRINT_HREF },
  secondaryCta: { label: PRIMARY_BOOKING_CTA.label, href: PRIMARY_BOOKING_CTA.href },
  proof: `${SITE.freshaReviewRating}★ from ${SITE.freshaReviewCount}+ verified visits · NP on site daily`,
} as const;

export type ResultsShowcaseCase = {
  id: string;
  tab: "Aesthetics" | "Body" | "Skin";
  label: string;
  before: string;
  after: string;
  note: string;
};

export const SEE_YOUR_RESULTS_CASES: ResultsShowcaseCase[] = [
  {
    id: "quantum-chin",
    tab: "Aesthetics",
    label: "Quantum RF — jawline",
    before: "/gallery/quantum-rf-chin-1/before.jpg",
    after: "/gallery/quantum-rf-chin-1/after.jpg",
    note: "Real client result. Individual results vary. Face Blueprint shows a simulation — your consult locks the plan.",
  },
  {
    id: "quantum-body",
    tab: "Body",
    label: "Quantum RF — body",
    before: "/gallery/quantum-rf-body-1/before.jpg",
    after: "/gallery/quantum-rf-body-1/after.jpg",
    note: "Real client result. Individual results vary.",
  },
  {
    id: "solaria-skin",
    tab: "Skin",
    label: "Solaria CO₂",
    before: "/gallery/solaria-client-4/before.jpg",
    after: "/gallery/solaria-client-4/after.jpg",
    note: "Real client result. Individual results vary.",
  },
  {
    id: "solaria-skin-2",
    tab: "Skin",
    label: "Solaria CO₂ — texture",
    before: "/gallery/client-2/before.jpg",
    after: "/gallery/client-2/after.jpg",
    note: "Real client result. Individual results vary.",
  },
];

export const SEE_YOUR_RESULTS_STEPS = [
  {
    n: "01",
    title: "Show yourself",
    body: "Upload a selfie and select treatments — Botox smoothing, lip volume, chin, jawline, under-eye, CO₂ texture. Choose subtle, balanced, or dramatic.",
  },
  {
    n: "02",
    title: "See the plan",
    body: "Get a personalized Face Blueprint™ with suggested order and estimated investment. Clarity before you commit — not someone else’s after photos.",
  },
  {
    n: "03",
    title: "Book with confidence",
    body: "Email your blueprint or book a free consult. Our NP-directed team reviews goals, anatomy, and medical history — then you decide.",
  },
] as const;

export const SEE_YOUR_RESULTS_FEATURES = [
  {
    title: "Treatment visualization",
    body: "Preview photorealistic treatment ideas on your own face — not a stock model. Emotional clarity changes how people say yes.",
  },
  {
    title: "Multi-treatment blueprint",
    body: "Layer Botox, lips, chin, jawline, under-eye, and CO₂ texture into one plan with intensity control.",
  },
  {
    title: "Investment estimate",
    body: "Walk into consult with a suggested order and ballpark investment so the visit is about refinement, not sticker shock.",
  },
  {
    title: "NP-directed care",
    body: "Simulations are educational. Every medical plan is reviewed by our on-site nurse practitioner team before treatment.",
  },
  {
    title: "Book in one tap",
    body: "From blueprint to Square booking — same clinic, same team, downtown Oswego.",
  },
  {
    title: "Privacy-first upload",
    body: "Your photo is used for your session. We don’t store images without consent.",
  },
] as const;

export const SEE_YOUR_RESULTS_PROVIDERS = MEDICAL_TRUST_PROVIDERS;

export const SEE_YOUR_RESULTS_FAQS: { q: string; a: string }[] = [
  {
    q: "Is Face Blueprint™ a guarantee of my results?",
    a: "No. It’s an educational simulation to help you visualize options and talk through goals. Final recommendations depend on anatomy, medical history, product selection, and clinical judgment at your consult.",
  },
  {
    q: "What treatments can I preview?",
    a: "Botox smoothing, lip filler volume, chin projection, jawline contour, under-eye correction, and CO₂ texture smoothing — with subtle, balanced, or dramatic intensity.",
  },
  {
    q: "Do I need an appointment to try it?",
    a: "No. Start online at Face Blueprint™ anytime. When you’re ready, book a free consult — same-day visits are often available.",
  },
  {
    q: "Who oversees treatments?",
    a: "Hello Gorgeous is an NP-directed medical spa in Oswego, IL. Medical plans are reviewed by our nurse practitioner team with full prescriptive authority on site.",
  },
  {
    q: "Is my selfie private?",
    a: "Uploads are for your session. We don’t store your photo without consent. Ask us anytime about how we handle images.",
  },
  {
    q: "What if I already know what I want?",
    a: "Skip straight to booking a free consult. Face Blueprint™ is optional — useful when you want clarity before you commit.",
  },
];

export const SEE_YOUR_RESULTS_CLOSING = {
  headline: "More people say yes when they can see what’s possible.",
  body: "You’re already curious. Give yourself a clear picture — then book with a team that treats you like a person, not a procedure.",
  primaryCta: { label: "Try Face Blueprint™ free", href: FACE_BLUEPRINT_HREF },
  secondaryCta: { label: PRIMARY_BOOKING_CTA.label, href: PRIMARY_BOOKING_CTA.href },
} as const;
