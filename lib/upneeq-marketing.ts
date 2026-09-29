import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { SITE } from "@/lib/seo";

export const UPNEEQ_PATH = "/upneeq" as const;
export const UPNEEQ_HG_URL = `${SITE.url}${UPNEEQ_PATH}`;
export const UPNEEQ_REGEN_URL = "https://tryregenrx.com/upneeq";
export const UPNEEQ_CAMPAIGN = "upneeq_coming_soon";
export const UPNEEQ_SIMULATOR_URL = "https://virtual-drop-simulator.upneeq.com/";
export const UPNEEQ_PI_URL = "https://upneeq.com";

export const UPNEEQ_NAV = {
  label: "Upneeq",
  href: UPNEEQ_PATH,
  sub: "Coming soon · Rx eyelid drop",
} as const;

export const UPNEEQ_TEAL = "#0E8C7E";
export const UPNEEQ_PINK = "#E8268B";
export const UPNEEQ_BEFORE = "#D88C7A";
export const UPNEEQ_AFTER = "#1E2A8A";

export const UPNEEQ_SEO = {
  title: "Upneeq® Coming Soon | Oswego IL",
  description:
    "Upneeq® (oxymetazoline 0.1%) is coming soon to Hello Gorgeous in Oswego — the FDA-approved prescription eye drop for acquired low-lying lids. Join the waitlist. Results vary. Consultation required.",
  ogAlt: "Upneeq coming soon at Hello Gorgeous Med Spa, Oswego IL",
} as const;

export const UPNEEQ_REGEN_SEO = {
  title: "Upneeq® Coming Soon",
  description:
    "Upneeq® is coming soon through Hello Gorgeous / REGEN RX in Oswego. FDA-approved prescription drop for acquired ptosis. Join the waitlist. A licensed Illinois clinician reviews. Results vary.",
  ogAlt: "Upneeq coming soon at REGEN RX by Hello Gorgeous",
} as const;

export const UPNEEQ_RESULTS = [
  {
    src: "/images/upneeq/ba-1-man.png",
    alt: "Man before and after Upneeq",
    note: "Male client — upper lid lift, more open look",
  },
  {
    src: "/images/upneeq/ba-2-hazel.png",
    alt: "Woman with hazel eyes before and after Upneeq",
    note: "Female — brighter, less tired appearance",
  },
  {
    src: "/images/upneeq/ba-3-female.png",
    alt: "Upneeq before and after female eyes",
    note: "Natural-looking lift in about 10 minutes",
  },
  {
    src: "/images/upneeq/ba-4-closeup.png",
    alt: "Upneeq before and after close up",
    note: "About 1 mm average lift measured in studies",
  },
  {
    src: "/images/upneeq/ba-5-lift.png",
    alt: "Upneeq eye lift result",
    note: "Often lasts 6+ hours · once-daily vial",
  },
  {
    src: "/images/upneeq/ba-6-browser.png",
    alt: "Upneeq before and after",
    note: "Same-day look — no surgery. Results vary.",
  },
] as const;

export const UPNEEQ_STATS = [
  { n: "1", title: "5–15 min onset", body: "Many people notice a lifted-lid look quickly. Results vary." },
  { n: "2", title: "+1 mm average lift", body: "Measured upper eyelid elevation in studies. Not a guarantee." },
  { n: "3", title: "Non-surgical rescue", body: "Sometimes used for Botox-related lid droop while tox settles." },
] as const;

export const UPNEEQ_FOR = [
  { title: "Tired-looking eyes", desc: "When lids look heavy on camera or in photos. Results vary." },
  { title: "Age-related lid laxity", desc: "Low-lying lids from aging — a drop, not surgery, if a clinician says yes." },
  { title: "Botox-induced ptosis", desc: "Rescue option for tox-related lid droop. Ask your injector." },
  { title: "Events & photos", desc: "Weddings, reunions, headshots — one drop when prescribed." },
] as const;

export const UPNEEQ_BENEFITS = [
  "May open the look of the eyes — results vary",
  "Non-surgical, no downtime, no needles",
  "Once-daily convenience, preservative-free vials",
  "Often used for photos, events, and workdays",
  "Prescription only — a licensed Illinois clinician reviews",
  "Sometimes used when mild acquired ptosis looks uneven",
] as const;

export const UPNEEQ_FAQ = [
  {
    question: "Is Upneeq FDA approved? When?",
    answer:
      "Yes. FDA approved July 2020 for acquired blepharoptosis (droopy eyelid) in adults. It is the first and only prescription eye drop approved for this condition.",
  },
  {
    question: "How fast does it work and how long does it last?",
    answer:
      "Many people notice a lift in 5–15 minutes. One drop typically lasts 6+ hours. Once-daily dosing in single-use vials. Individual results vary.",
  },
  {
    question: "What are the common side effects?",
    answer:
      "In trials (1–5%): eye redness, irritation, dry eye, blurred vision, eye pain, headache. Most are mild and short-lived. Not for everyone — requires a consult.",
  },
  {
    question: "Is it used with Botox / Dysport / Xeomin?",
    answer:
      "It is commonly discussed as a rescue for tox-related eyelid ptosis while neurotoxin settles. Your injector at Hello Gorgeous decides if it is appropriate.",
  },
  {
    question: "How much will it cost at Hello Gorgeous?",
    answer:
      "Pricing will be announced at launch. Join the waitlist for first access. A prescription requires a consult with a licensed Illinois clinician. A request is not a guaranteed prescription.",
  },
  {
    question: "Who should not use Upneeq?",
    answer:
      "Not for congenital ptosis or mechanical ptosis. Caution if you have narrow-angle glaucoma, uncontrolled hypertension, or take MAO inhibitors. Full medical history is required.",
  },
] as const;

export const UPNEEQ_OG_IMAGE = "/images/upneeq/ba-1-man.png";

export const UPNEEQ_SAFETY =
  "Upneeq® (oxymetazoline hydrochloride ophthalmic solution 0.1%) is indicated for the treatment of acquired blepharoptosis (low-lying eyelid) in adults. Do not use if you have known hypersensitivity to oxymetazoline or any component. Use caution in patients with cardiovascular disease, orthostatic hypotension, uncontrolled hypertension/hypotension, or taking MAO inhibitors/beta-blockers. Not studied in patients with closed-angle glaucoma. Most common adverse reactions (1–5%): punctate keratitis, conjunctival hyperemia, dry eye, blurred vision, instillation site pain, eye irritation, headache. Upneeq is Rx only and requires a consult with a licensed Illinois clinician at Hello Gorgeous Med Spa. Before/after images are from Upneeq; individual results vary. This page is educational and does not provide medical advice. Please see full Prescribing Information at Upneeq.com.";

export const UPNEEQ_WAITLIST_PERKS = [
  "Licensed Illinois clinician on site",
  "Private consultation — about 10 min screening",
  "Pickup at the med spa — no pharmacy run",
] as const;

export const UPNEEQ_BOOK = PRIMARY_BOOKING_CTA;
export const UPNEEQ_PHONE = SITE.phone;
export const UPNEEQ_PHONE_HREF = `tel:${SITE.phone.replace(/\D/g, "")}`;
