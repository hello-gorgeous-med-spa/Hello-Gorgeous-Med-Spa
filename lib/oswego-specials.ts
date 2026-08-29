/**
 * Hello Gorgeous Med Spa Oswego — clinic specials (flyer-aligned).
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { HYDRAFACIAL_PATH, HYDRAFACIAL_GLOW_SPECIAL } from "@/lib/hydrafacial-marketing";
import {
  LASER_HAIR_AREAS,
  LASER_HAIR_MENU_BLURB,
  LASER_HAIR_PERFORMERS,
  LASER_HAIR_TIERS,
  laserHairPriceLabel,
} from "@/lib/laser-hair-pricing";

export const OSWEGO_SPECIALS_PATH = "/oswego-specials" as const;
export const OSWEGO_SPECIALS_FLYER_IMAGE = "/images/marketing/marissa-new-services-flyer.jpg" as const;

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
  { href: "#laser", label: "Laser $69+" },
  { href: "#hydrafacial", label: "HydraFacial" },
  { href: "#ipl", label: "IPL $79" },
  { href: "#faq", label: "FAQ" },
] as const;

/** Full set eyelash extensions — begins Aug 1 */
export const LASH_FULL_SET_SPECIAL = {
  id: "lashes-89",
  badge: "Beginning August 1st",
  title: "Full Set Eyelash Extensions",
  price: "$89",
  priceNote: "full set · book online",
  duration: "90–120 min",
  starts: LASH_89_STARTS,
  includes: [
    "Full set of eyelash extensions with our lash artist",
    "Custom mapping · soft, natural glam",
    "Aftercare tips for longer wear",
  ],
  note: `Beginning ${LASH_89_STARTS}. Book ahead — licensed esthetician & certified lash artist.`,
  bookHref: `${PRIMARY_BOOKING_CTA.href}?ref=lash_full_set_89`,
  detailsHref: `${OSWEGO_SPECIALS_PATH}#lashes`,
} as const;

/** Laser hair — current Square menu (small $69 / medium $89 / large $129) */
export const LASER_59_AREAS = LASER_HAIR_AREAS.map((a) => ({
  id: a.id,
  label: a.label,
  price: laserHairPriceLabel(a.price),
}));

export const LASER_59_SPECIAL = {
  id: "laser-menu",
  badge: `Performed by ${LASER_HAIR_PERFORMERS}`,
  title: "Laser Hair Removal",
  price: `${LASER_HAIR_TIERS.small.priceLabel}–${LASER_HAIR_TIERS.large.priceLabel}`,
  priceNote: "per session · by area",
  validThrough: LASER_59_VALID_THROUGH,
  device: `Zemits DuoCratus medical-grade platform · ${LASER_HAIR_PERFORMERS}`,
  includes: LASER_HAIR_AREAS.map((a) => `${a.label} ${laserHairPriceLabel(a.price)}`),
  note: LASER_HAIR_MENU_BLURB,
  bookHref: `${PRIMARY_BOOKING_CTA.href}?ref=laser_hair_menu`,
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
  device: "Zemits DuoCratus IPL / SHR platform · performed by Michelle Colby",
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
    ...HYDRAFACIAL_GLOW_SPECIAL,
    id: "hydrafacial-129",
    sectionId: "hydrafacial",
    href: HYDRAFACIAL_PATH,
    seoLabel: "HydraFacial + Dermaplaning Glow Special Oswego",
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
    seoLabel: "Laser hair removal $69 $89 $129 Oswego",
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
    question: "What Oswego specials does Hello Gorgeous Med Spa offer?",
    answer: `Full-set eyelash extensions $89 beginning ${LASH_89_STARTS}, laser hair ${LASER_HAIR_MENU_BLURB} Plus dermaplaning and Hydra Spa Infusion / HydraFacial. Book at hellogorgeousmedspa.com/oswego-specials.`,
  },
  {
    question: "When does the $89 full-set lash special start?",
    answer: `Beginning ${LASH_89_STARTS}. You can book ahead now.`,
  },
  {
    question: "How much is laser hair removal?",
    answer: LASER_HAIR_MENU_BLURB,
  },
  {
    question: "Do you offer HydraFacial and dermaplaning?",
    answer:
      "Yes — our menu features dermaplaning and Hydra Spa Infusion (HydraFacial), including the $129 glow special with oxygen spray and 2 premium add-ons.",
  },
  {
    question: "Where is Hello Gorgeous Med Spa?",
    answer:
      "74 W Washington St, Oswego, IL 60543. We serve Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery, and the Fox Valley.",
  },
] as const;

export const OSWEGO_SPECIALS_SEO = {
  title: "Oswego Specials — Lashes $89, Laser from $69 | Hello Gorgeous Med Spa",
  description: `Hello Gorgeous Med Spa Oswego: full-set lashes $89 from ${LASH_89_STARTS}, laser hair ${LASER_HAIR_MENU_BLURB} Plus dermaplaning & Hydra Spa Infusion.`,
  keywords: [
    "Hello Gorgeous Oswego specials",
    "eyelash extensions Oswego $89",
    "laser hair removal Oswego $69",
    "Hello Gorgeous Med Spa Oswego",
    "Hydra Spa Infusion Oswego",
    "dermaplaning Oswego",
    "med spa specials Oswego",
  ],
} as const;

/** GBP / social post copy for Oswego specials flyer */
export const OSWEGO_SPECIALS_GBP_MESSAGE = `✨ Oswego Specials — Hello Gorgeous Med Spa, Oswego IL

👁 Full set eyelash extensions — ONLY $89
Beginning August 1st — book ahead now

⚡ Laser hair removal — chin or lip $69 · underarms, upper/lower legs, bikini $89 · Brazilian, back, full legs $129
Performed by Danielle, Ryan, and Michelle

Also featuring dermaplaning & Hydra Spa Infusion

BOOK NOW
74 W Washington St, Oswego
(630) 636-6193` as const;
