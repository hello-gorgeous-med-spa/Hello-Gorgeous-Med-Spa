/**
 * Biostimulators flagship — Sculptra® (PLLA) + Radiesse® (CaHA).
 * Canonical route: /services/biostimulators
 * Photos: drop files into public/images/biostimulators/ and wire paths here.
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

export const BIOSTIMULATORS_PATH = "/services/biostimulators" as const;

export const BIOSTIMULATORS_NAV = {
  label: "Biostimulators",
  href: BIOSTIMULATORS_PATH,
  sub: "Sculptra® + Radiesse® · collagen, not just fill",
} as const;

export const BIOSTIMULATORS_NAV_ACTIVE_PREFIXES = [
  BIOSTIMULATORS_PATH,
  "/services/sculptra-biostimulator",
  "/sculptra-oswego-il",
] as const;

export function isBiostimulatorsNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return BIOSTIMULATORS_NAV_ACTIVE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/** Empty until Danielle sends photos — page shows labeled slots. */
export const BIOSTIMULATORS_IMAGES = {
  hero: "",
  cheeks: "",
  process: "",
  mapping: "",
  gallery: [] as string[],
} as const;

export const BIOSTIMULATORS_PAGE_NAV = [
  { href: "#why", label: "Why biostimulators" },
  { href: "#compare", label: "Sculptra vs Radiesse" },
  { href: "#benefits", label: "Benefits" },
  { href: "#areas", label: "Areas" },
  { href: "#process", label: "Our process" },
  { href: "#photos", label: "Photos" },
  { href: "#learn", label: "Learn more" },
  { href: "#faq", label: "FAQ" },
] as const;

/** Official manufacturer education — not our claims. */
export const RADIESSE_LEARN_MORE = {
  href: "https://radiesse.com/",
  label: "Learn more at Radiesse.com",
  blurb:
    "Official RADIESSE® site from Merz — how CaHA biostimulation works, face, hands, and décolleté education, and full safety information. Prescription only. Individual results vary.",
} as const;

export const SCULPTRA_LEARN_MORE = {
  href: "https://www.sculptrausa.com/",
  label: "Learn more at SculptraUSA.com",
  blurb:
    "Official Sculptra® site from Galderma — PLLA collagen stimulation education and safety information. Prescription only. Individual results vary.",
} as const;

export const BIOSTIMULATORS_COMPARE_INTRO =
  "Both rebuild collagen. The personality, timeline, and mapping are different — structure you can see sooner (Radiesse®) versus gradual restoration (Sculptra®). We never use one product for every face.";

export const BIOSTIMULATORS_COMPARE_ROWS = [
  {
    feature: "What it is",
    radiesse: "Calcium hydroxylapatite (CaHA) microspheres in a gel",
    sculptra: "Poly-L-lactic acid (PLLA) that signals your own collagen",
  },
  {
    feature: "When you notice change",
    radiesse: "Often some structure the same day, then collagen over time",
    sculptra: "Builds over weeks (often discussed as 4–12 weeks). Not same-day plump.",
  },
  {
    feature: "Collagen story",
    radiesse: "Supports collagen and elastin as the gel integrates",
    sculptra: "Long-term Type I collagen stimulation after a series",
  },
  {
    feature: "How long it is discussed",
    radiesse: "Often 12–18 months; manufacturer education discusses up to 2 years. Results vary.",
    sculptra: "Often discussed in years after a completed series. Results vary.",
  },
  {
    feature: "Often mapped for",
    radiesse: "Jawline, chin, cheeks, folds, and the backs of the hands",
    sculptra: "Global volume — temples, cheeks, pre-auricular hollows, gradual midface",
  },
  {
    feature: "Typical plan",
    radiesse: "Sometimes one sculpting visit; more if your map needs it",
    sculptra: "Often 2–3 sessions, about 4–6 weeks apart",
  },
  {
    feature: "Downtime",
    radiesse: "Usually minimal; bruising or swelling can happen",
    sculptra: "Usually minimal; swelling 24–48 hours is common",
  },
] as const;

export const BIOSTIMULATORS_COMPARE_CARDS = [
  {
    name: "Radiesse®",
    tag: "Structure · CaHA",
    body: "Chosen when you want contour you can see sooner — jawline, chin, cheek support, deeper folds, and hands. Diluted plans for texture are discussed at consult when appropriate.",
    points: ["Same-day structure is possible", "Hands are a common Radiesse map", "Learn the science at Radiesse.com"],
  },
  {
    name: "Sculptra®",
    tag: "Restoration · PLLA",
    body: "Chosen when you want no one to know the product — temples refill, cheeks regain shape, skin can feel thicker over months. It rebuilds; it does not instantly fill.",
    points: ["Gradual so the change reads as you", "Series-based collagen banking", "Priced per vial at consult"],
  },
] as const;

export const BIOSTIMULATORS_BENEFITS = [
  {
    title: "Restores volume naturally",
    body: "Sculptra® (PLLA) and Radiesse® (CaHA) signal your own collagen — cheeks, temples, and jawline without an overfilled look.",
  },
  {
    title: "Long-lasting collagen",
    body: "HA filler is often measured in months. Sculptra results build over weeks to months and are commonly discussed in years. Your provider sets the plan.",
  },
  {
    title: "Medical screening first",
    body: "Full history, mapping, and a personalized vial plan. Same-day treatment only when your provider says it is appropriate.",
  },
] as const;

export const BIOSTIMULATORS_AREAS = [
  { name: "Cheeks & midface", note: "Soft structure where filler can look puffy" },
  { name: "Temples", note: "Hollows that age the upper face" },
  { name: "Jawline & chin", note: "Definition with collagen, not just gel" },
  { name: "Smile & marionette lines", note: "When folds need support, not just fill" },
  { name: "Hands", note: "Radiesse is often chosen here" },
  { name: "Body (consult)", note: "Hip and contour requests are planned in person" },
] as const;

export const BIOSTIMULATORS_STEPS = [
  {
    title: "Consultation & medical screening",
    body: "We review history, medications, and goals. We decide Sculptra, Radiesse, HA filler, or a combination — not a rushed inject.",
  },
  {
    title: "Personalized treatment plan",
    body: "Vial count, areas, and spacing (often 2–3 sessions, 4–6 weeks apart) are set with you before anything is placed.",
  },
  {
    title: "Treatment & aftercare",
    body: "Vectoring / fanning technique, lidocaine and ice as appropriate, mapping photos, and an arnica aftercare bag.",
  },
] as const;

export const BIOSTIMULATORS_FAQ = [
  {
    question: "Am I a good candidate for Sculptra or Radiesse?",
    answer:
      "Usually someone who wants collagen and structure — temples, cheeks, jaw, folds, or hands — not only an instant HA plump. Hello Gorgeous screens medically and maps which product, or a mix, is appropriate. Results vary.",
  },
  {
    question: "Sculptra vs Radiesse — which should I choose?",
    answer:
      "Radiesse® (CaHA) is often chosen for contour you can see sooner and for the backs of the hands. Sculptra® (PLLA) is often chosen for gradual, global volume. Your injector decides after mapping — not from a one-product menu. Read manufacturer education at radiesse.com.",
  },
  {
    question: "How many treatments will I need?",
    answer:
      "Sculptra is often 2–3 sessions, about 4–6 weeks apart. Radiesse is sometimes one sculpting visit. Your provider customizes that after photos and mapping. Results vary.",
  },
  {
    question: "What is the downtime?",
    answer:
      "Most people return to normal routines the same day. Swelling, redness, or tenderness can last a few days. We encourage arnica beforehand and include aftercare in your visit bag.",
  },
  {
    question: "When will I see results?",
    answer:
      "Radiesse can show structure the same day, then collagen over time. Sculptra is not same-day volume — collagen builds over weeks to months. Duration is discussed at consult. Individual results vary. See radiesse.com for official RADIESSE timing and safety.",
  },
  {
    question: "How much does it cost in Oswego?",
    answer:
      "Priced per vial at consult. Most plans use more than one vial. No surprise add-on fees after the quote. Cherry and CareCredit are available. Call (630) 636-6193.",
  },
] as const;

export const BIOSTIMULATORS_SEO = {
  title: "Sculptra & Radiesse Biostimulators | Oswego IL | Hello Gorgeous",
  description:
    "Sculptra® and Radiesse® collagen biostimulators at Hello Gorgeous Med Spa in Oswego, IL. Gradual volume and structure — not just instant filler. Medical screening, mapping, and aftercare. Serving Naperville, Aurora & Yorkville.",
  ogAlt: "Sculptra and Radiesse biostimulators — Hello Gorgeous Med Spa Oswego IL",
  bookHref: PRIMARY_BOOKING_CTA.href,
  phone: SITE.phone,
} as const;
