/**
 * Biostimulators flagship — visual + copy from Danielle's
 * Sculptra-Oswego-Hello-Gorgeous.html and Sculptra-Vs-Radiesse-Hello.html.
 * Canonical: /services/biostimulators
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

export const BIOSTIMULATORS_IMAGES = {
  hero: "",
  radiesseAreas: "/images/biostimulators/radiesse-areas.png",
  sculptraAreas: "/images/biostimulators/sculptra-areas.png",
  science: "/images/biostimulators/science-behind.png",
} as const;

export const BIOSTIMULATORS_SCIENCE = {
  src: BIOSTIMULATORS_IMAGES.science,
  width: 512,
  height: 1024,
  alt: "The science behind a biostimulator — injection, activation, and collagenesis at Hello Gorgeous Med Spa Oswego",
  stages: [
    {
      n: "01",
      title: "Injection",
      body: "PLLA (Sculptra®) or CaHA (Radiesse®) microspheres are placed in the deeper dermis to start your own collagen process.",
    },
    {
      n: "02",
      title: "Activation",
      body: "Your body recognizes the microspheres. Fibroblasts begin building fresh collagen and elastin at the site.",
    },
    {
      n: "03",
      title: "Collagenesis",
      body: "As the microspheres dissolve, a new collagen scaffold can support volume, thickness, and elasticity over time. Results vary.",
    },
  ],
} as const;

export const BIOSTIMULATORS_MAPS = [
  {
    id: "radiesse-map",
    name: "Radiesse® Areas",
    src: BIOSTIMULATORS_IMAGES.radiesseAreas,
    width: 1024,
    height: 983,
    alt: "Radiesse treatment mapping — cheeks, folds, jawline, chin, and hands at Hello Gorgeous Med Spa Oswego",
    sub: "Hello Gorgeous · Treatment Mapping",
    body: "Ideal placement is mapped in person: mid-cheek lift, smile folds, jawline contour, chin, and the backs of the hands. Your injector decides what is appropriate — not a diagram.",
    zones: ["Cheeks & malar", "Nasolabial folds", "Jawline & chin", "Marionette lines", "Hands (consult)"],
  },
  {
    id: "sculptra-map",
    name: "Sculptra® Areas",
    src: BIOSTIMULATORS_IMAGES.sculptraAreas,
    width: 512,
    height: 1024,
    alt: "Sculptra treatment mapping — temples, cheeks, pre-auricular hollows, and global volume at Hello Gorgeous Med Spa Oswego",
    sub: "Hello Gorgeous · Global Restoration",
    body: "Global volumization: temples, lateral cheeks, pre-auricular hollowing, jawline softening. Body requests (hip dips, buttocks, texture) are planned only at consult.",
    zones: ["Temples", "Cheeks & midface", "Pre-auricular hollows", "Folds & chin", "Body (consult)"],
  },
] as const;

export const RADIESSE_LEARN_MORE = {
  href: "https://radiesse.com/",
  label: "Learn more at Radiesse.com",
} as const;

export const SCULPTRA_LEARN_MORE = {
  href: "https://www.sculptrausa.com/",
  label: "Learn more at SculptraUSA.com",
} as const;

export const BIOSTIMULATORS_PAGE_NAV = [
  { href: "#benefits", label: "Benefits" },
  { href: "#science", label: "The science" },
  { href: "#compare", label: "Sculptra vs Radiesse" },
  { href: "#mapping", label: "Treatment maps" },
  { href: "#process", label: "Process" },
  { href: "#treats", label: "What we treat" },
  { href: "#faq", label: "Questions" },
] as const;

export const BIOSTIMULATORS_BENEFITS = [
  {
    sub: "Collagen Stimulation",
    title: "Restores Volume Naturally",
    body: "PLLA (Sculptra) and CaHA (Radiesse) trigger your body to rebuild collagen — restoring cheeks, temples, and jawline without a frozen or overfilled appearance.",
  },
  {
    sub: "2+ Years",
    title: "Long-Lasting Results",
    body: "Unlike HA filler that fades in months, Sculptra results build over 3–6 months and can last 2+ years. Fewer touch-ups, more natural aging. Results vary.",
  },
  {
    sub: "Medical Practice Safety",
    title: "Minimally Invasive & Natural Look",
    body: "Non-surgical, minimal downtime, gradual enhancement. Because we screen you like a medical practice — we are one — you get a safer, personalized plan.",
  },
] as const;

export const BIOSTIMULATORS_STEPS = [
  {
    n: "01",
    title: "Consultation & Medical Screening",
    body: "60-min medical intake, facial analysis, health history, and candidacy check for Sculptra vs Radiesse vs filler. Photos + collagen assessment.",
  },
  {
    n: "02",
    title: "Personalized Treatment Plan",
    body: "Custom map of vials, vectoring, and layering technique. Transparent pricing, pre-care with arnica, and timeline for 2–3 sessions 4–6 weeks apart.",
  },
  {
    n: "03",
    title: "Treatment & Aftercare with Arnica",
    body: "Expert injection with comfort measures. 5-5-5 massage protocol guidance, VIP gift bag with arnica, ice, and 24/7 provider text access.",
  },
] as const;

export const BIOSTIMULATORS_TREATS = [
  { name: "Sunken cheeks", note: "Midface volume loss from aging, weight loss or illness" },
  { name: "Temple hollowing", note: "Hollow temples that age the upper face and eyes" },
  { name: "Nasolabial folds", note: "Deep smile lines from nose to mouth" },
  { name: "Marionette lines", note: "Lines from mouth corners to chin" },
  { name: "Chin wrinkles", note: "Chin creases, dimpling and pre-jowl sulcus" },
  { name: "Buttocks / Hip dips", note: "Sculptra for body — subtle, natural contour without surgery" },
] as const;

export const BIOSTIMULATORS_COMPARE_ROWS = [
  { feature: "Immediate volume", radiesse: "Yes — often some lift the same day", sculptra: "No — builds over 4–12 weeks" },
  { feature: "Collagen stimulation", radiesse: "Types I & III collagen + elastin", sculptra: "Strong long-term Type I collagen" },
  { feature: "Longevity", radiesse: "Often 12–18 months. Results vary.", sculptra: "Often discussed as 2+ years after a series. Results vary." },
  { feature: "Best for", radiesse: "Structure, contour, instant correction, hands", sculptra: "Global volume loss, gradual natural restoration" },
  { feature: "Sessions needed", radiesse: "Usually 1 sculpting session", sculptra: "2–3 sessions, 4–6 weeks apart" },
  { feature: "Downtime", radiesse: "Minimal, possible bruising", sculptra: "Minimal, possible swelling 24–48h" },
] as const;

export const BIOSTIMULATORS_FAQ = [
  {
    question: "Am I a good candidate for Sculptra?",
    answer:
      "A good candidate for Sculptra is typically someone seeking a non-surgical solution to restore facial volume and address signs of aging, such as sunken cheeks or deep wrinkles. Ideal if you want gradual, natural results that rebuild your own collagen — not just fill. At Hello Gorgeous, we screen you medically to confirm Sculptra, Radiesse, or a combination is right for you.",
  },
  {
    question: "How many Sculptra treatments will I need?",
    answer:
      "The number varies based on your goals and severity of volume loss. Typically 2 to 3 sessions, spaced 4–6 weeks apart, for optimal results. Your provider at Hello Gorgeous will create a customized plan during your medical consultation — including whether Radiesse is a better fit for immediate structure.",
  },
  {
    question: "What is the downtime with Sculptra?",
    answer:
      "Minimal downtime — most clients return to normal routines immediately. Temporary swelling, redness, or tenderness at injection sites fades within a few days. We strongly encourage arnica tablets prior to treatment to decrease bruising. We include medical-grade arnica and aftercare in your VIP gift bag.",
  },
  {
    question: "When will I see the results?",
    answer:
      "Results are not immediate — Sculptra gradually stimulates collagen. You'll see enhanced volume, elasticity and texture in a few weeks to months, with optimal results after a series of treatments. Results can last 2+ years. Individual results vary.",
  },
  {
    question: "Sculptra vs Filler vs Radiesse — What's the difference?",
    answer:
      "Traditional fillers (hyaluronic acid) provide immediate volume that lasts 6–12 months. Sculptra (PLLA) is a collagen biostimulator that rebuilds your own collagen over time for natural, long-lasting volume. Radiesse (CaHA) offers both immediate lift + collagen stimulation and is often used for cheeks, jawline, and hands. At Hello Gorgeous we often combine them for the most natural restoration. Learn more at radiesse.com.",
  },
  {
    question: "How much does Sculptra cost in Oswego?",
    answer:
      "Sculptra investment varies by vials needed and areas treated. In the Oswego / Yorkville area, most clients invest in 2–4 vials per session. We provide transparent, medical pricing at consultation — no surprise fees. Financing and VIP membership pricing available. Call 630-636-6193 for current specials.",
  },
] as const;

export const BIOSTIMULATORS_SEO = {
  title: "Sculptra® Injections in Oswego, IL | Hello Gorgeous Medical Spa",
  description:
    "Sculptra® and Radiesse® collagen biostimulators at Hello Gorgeous Medical Spa in Oswego, IL. Restore facial volume and rebuild collagen naturally. Medical screening, VIP aftercare. Serving Aurora, Naperville & Yorkville.",
  ogAlt: "Sculptra and Radiesse at Hello Gorgeous Medical Spa Oswego IL",
  bookHref: PRIMARY_BOOKING_CTA.href,
  phone: SITE.phone,
} as const;
