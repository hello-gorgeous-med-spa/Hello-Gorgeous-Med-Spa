/**
 * Hello Gorgeous Med Spa Oswego — Marissa’s new services (flyer-aligned).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { HYDRAFACIAL_PATH, HYDRAFACIAL_MARISSA_SPECIAL } from "@/lib/hydrafacial-marketing";

export const OSWEGO_SPECIALS_PATH = "/oswego-specials" as const;
export const MARISSA_FLYER_IMAGE = "/images/marketing/marissa-new-services-flyer.jpg" as const;

/** Laser $59 promo window per flyer: now through end of this month */
export const LASER_59_VALID_THROUGH = "July 31, 2026" as const;
export const LASER_59_VALID_UNTIL_ISO = "2026-07-31" as const;
/** Full-set lashes special begins per flyer */
export const LASH_89_STARTS = "August 1, 2026" as const;
export const LASH_89_STARTS_ISO = "2026-08-01" as const;
/** @deprecated Prefer LASER_59_VALID_THROUGH / LASH_89_STARTS — kept for schema helpers */
export const OSWEGO_SPECIALS_VALID_THROUGH = LASER_59_VALID_THROUGH;

export const OSWEGO_SPECIALS_BOOK_HREF = `${PRIMARY_BOOKING_CTA.href}${
  PRIMARY_BOOKING_CTA.href.includes("?") ? "&" : "?"
}ref=oswego_specials_2026`;

export const OSWEGO_SPECIALS_NAV = [
  { href: "#flyer", label: "Flyer" },
  { href: "#lashes", label: "Lashes $89" },
  { href: "#laser", label: "Laser $59" },
  { href: "#hydrafacial", label: "HydraFacial" },
  { href: "#ipl", label: "IPL $79" },
  { href: "#faq", label: "FAQ" },
] as const;

/** Full set eyelash extensions — Marissa · begins Aug 1 */
export const LASH_FULL_SET_SPECIAL = {
  id: "lashes-89",
  badge: "Beginning August 1st",
  title: "Full Set Eyelash Extensions",
  price: "$89",
  priceNote: "full set · book with Marissa",
  duration: "90–120 min",
  starts: LASH_89_STARTS,
  includes: [
    "Full set of eyelash extensions with Marissa Murray",
    "Custom mapping · soft, natural glam",
    "Aftercare tips for longer wear",
  ],
  note: `Beginning ${LASH_89_STARTS}. Book ahead with Marissa — licensed esthetician & certified lash artist.`,
  bookHref: `${PRIMARY_BOOKING_CTA.href}?ref=lash_full_set_89_marissa`,
  detailsHref: `${OSWEGO_SPECIALS_PATH}#lashes`,
} as const;

/** Laser hair — $59 any listed area through end of month (flyer) */
export const LASER_59_AREAS = [
  { id: "face", label: "Face" },
  { id: "neck-chin", label: "Neck / chin" },
  { id: "underarms", label: "Underarm" },
  { id: "upper-legs", label: "Upper legs" },
  { id: "lower-legs", label: "Lower legs" },
  { id: "back", label: "Back" },
  { id: "bikini", label: "Bikini" },
  { id: "brazilian", label: "Brazilian" },
] as const;

export const LASER_59_SPECIAL = {
  id: "laser-59",
  badge: "Now through end of the month",
  title: "Laser Hair Removal — Any Area",
  price: "$59",
  priceNote: "per session · listed areas",
  validThrough: LASER_59_VALID_THROUGH,
  device: "Zemits DuoCratus medical-grade platform",
  includes: LASER_59_AREAS.map((a) => a.label),
  note: `Any listed area only $59 through ${LASER_59_VALID_THROUGH}. Book with Marissa at Hello Gorgeous Med Spa, Oswego.`,
  bookHref: `${PRIMARY_BOOKING_CTA.href}?ref=laser_59_marissa`,
  detailsHref: `${OSWEGO_SPECIALS_PATH}#laser`,
} as const;

/**
 * IPL photofacial $79 — Zemits DuoCratus IPL guide as clinical reference
 */
export const IPL_79_SPECIAL = {
  id: "ipl-79",
  badge: "Zemits DuoCratus IPL",
  title: "IPL Photofacial",
  price: "$79",
  priceNote: "photofacial special",
  duration: "30–45 min",
  validThrough: LASER_59_VALID_THROUGH,
  device: "Zemits DuoCratus IPL / SHR platform",
  guideNote:
    "Protocol reference: Zemits DuoCratus IPL filter guide — practitioners select cut-off filters (e.g. ~480–590 nm range for rejuvenation, pigment, and vascular tone) with sapphire contact cooling for comfort.",
  treats: [
    { concern: "Sun damage & uneven tone", filterHint: "Pigment-focused filters (e.g. 480–560 nm range)" },
    { concern: "Redness / broken capillaries look", filterHint: "Vascular-focused filters (e.g. 530–590 nm range)" },
    { concern: "Dull, tired skin", filterHint: "Photorejuvenation filters (e.g. 480–530 nm range)" },
    { concern: "Congestion-prone complexion", filterHint: "Acne-support filters when appropriate (e.g. ~480 nm)" },
  ],
  includes: [
    "Full IPL photofacial on face (as mapped at consult)",
    "Sapphire-cooled tip for comfort",
    "Customized filter selection for your concern",
    "Zero-to-minimal downtime — mild flush possible",
  ],
  note: "Skin assessment required. Not all skin types or concerns are candidates for every filter.",
  bookHref: `${PRIMARY_BOOKING_CTA.href}?ref=ipl_79_zemits`,
  detailsHref: `${OSWEGO_SPECIALS_PATH}#ipl`,
  image: "/images/square-appointments/ipl-photofacial-zemits-530nm.jpg",
} as const;

export const OSWEGO_SPECIALS_FEATURED = [
  {
    ...HYDRAFACIAL_MARISSA_SPECIAL,
    id: "hydrafacial-129",
    sectionId: "hydrafacial",
    href: HYDRAFACIAL_PATH,
    seoLabel: "HydraFacial + Dermaplaning with Marissa Oswego",
  },
  {
    ...LASH_FULL_SET_SPECIAL,
    sectionId: "lashes",
    href: LASH_FULL_SET_SPECIAL.detailsHref,
    seoLabel: "Full set eyelash extensions $89 August Oswego",
  },
  {
    ...LASER_59_SPECIAL,
    sectionId: "laser",
    href: LASER_59_SPECIAL.detailsHref,
    seoLabel: "Laser hair removal $59 any area Oswego July",
  },
  {
    ...IPL_79_SPECIAL,
    sectionId: "ipl",
    href: IPL_79_SPECIAL.detailsHref,
    seoLabel: "IPL photofacial $79 Zemits DuoCratus Oswego",
  },
] as const;

export const OSWEGO_SPECIALS_FAQS = [
  {
    question: "What are Marissa’s new services at Hello Gorgeous Med Spa Oswego?",
    answer: `Marissa Murray (licensed esthetician & certified lash artist) offers full-set eyelash extensions $89 beginning ${LASH_89_STARTS}, laser hair removal any listed area $59 through ${LASER_59_VALID_THROUGH}, plus dermaplaning and Hydra Spa Infusion / HydraFacial. Book at hellogorgeousmedspa.com/oswego-specials.`,
  },
  {
    question: "When does the $89 full-set lash special start?",
    answer: `Beginning ${LASH_89_STARTS}. You can book ahead with Marissa now.`,
  },
  {
    question: "Which laser hair areas are $59?",
    answer: `Face, neck/chin, underarm, upper legs, lower legs, back, bikini, and Brazilian — $59 per session through ${LASER_59_VALID_THROUGH}.`,
  },
  {
    question: "Does Marissa do HydraFacial and dermaplaning?",
    answer:
      "Yes — Marissa’s menu also features dermaplaning and Hydra Spa Infusion (HydraFacial), including the $129 glow special with oxygen spray and 2 premium add-ons.",
  },
  {
    question: "Where is Hello Gorgeous Med Spa?",
    answer:
      "74 W Washington St, Oswego, IL 60543. We serve Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery, and the Fox Valley.",
  },
] as const;

export const OSWEGO_SPECIALS_SEO = {
  title: "Marissa’s New Services — Lashes $89, Laser $59 | Hello Gorgeous Med Spa Oswego",
  description: `Book Marissa Murray at Hello Gorgeous Med Spa Oswego: full-set lashes $89 from ${LASH_89_STARTS}, laser hair any listed area $59 through ${LASER_59_VALID_THROUGH}, plus dermaplaning & Hydra Spa Infusion.`,
  keywords: [
    "Marissa Murray Hello Gorgeous",
    "eyelash extensions Oswego $89",
    "laser hair removal Oswego $59",
    "Hello Gorgeous Med Spa Oswego",
    "Hydra Spa Infusion Oswego",
    "dermaplaning Oswego",
    "book with Marissa Oswego",
  ],
} as const;

/** GBP / social post copy for Marissa flyer */
export const MARISSA_NEW_SERVICES_GBP_MESSAGE = `✨ Marissa’s New Services — Hello Gorgeous Med Spa, Oswego IL

Marissa Murray · Licensed Esthetician · Certified Lash Artist

👁 Full set eyelash extensions — ONLY $89
Beginning August 1st — book ahead with Marissa

⚡ Laser hair removal — ANY listed area ONLY $59
Now through the end of the month
Face · Neck/Chin · Underarm · Upper legs · Lower legs · Back · Bikini · Brazilian

Also featuring dermaplaning & Hydra Spa Infusion

BOOK NOW WITH MARISSA
74 W Washington St, Oswego
(630) 636-6193` as const;
