/**
 * Hello Gorgeous Med Spa Oswego — Marissa-busy SEO specials blast.
 * Valid through end of 2026.
 */

import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { HYDRAFACIAL_PATH, HYDRAFACIAL_MARISSA_SPECIAL } from "@/lib/hydrafacial-marketing";

export const OSWEGO_SPECIALS_PATH = "/oswego-specials" as const;
export const OSWEGO_SPECIALS_VALID_THROUGH = "December 31, 2026" as const;

export const OSWEGO_SPECIALS_BOOK_HREF = `${PRIMARY_BOOKING_CTA.href}${
  PRIMARY_BOOKING_CTA.href.includes("?") ? "&" : "?"
}ref=oswego_specials_2026`;

export const OSWEGO_SPECIALS_NAV = [
  { href: "#hydrafacial", label: "HydraFacial $129" },
  { href: "#lashes", label: "Lashes $89" },
  { href: "#laser", label: "Laser $59" },
  { href: "#ipl", label: "IPL $79" },
  { href: "#faq", label: "FAQ" },
] as const;

/** Full set eyelash extensions — Marissa */
export const LASH_FULL_SET_SPECIAL = {
  id: "lashes-89",
  badge: "Book with Marissa",
  title: "Full Set Eyelash Extensions",
  price: "$89",
  priceNote: "full set special",
  duration: "90–120 min",
  validThrough: OSWEGO_SPECIALS_VALID_THROUGH,
  includes: [
    "Classic or hybrid full set (artist chooses best look for your eye)",
    "Custom mapping · soft, natural glam",
    "Aftercare tips for longer wear",
  ],
  note: "Performed by Marissa Murray, certified lash artist. Mention the $89 full-set special when you book.",
  bookHref: `${PRIMARY_BOOKING_CTA.href}?ref=lash_full_set_89_marissa`,
  detailsHref: `${OSWEGO_SPECIALS_PATH}#lashes`,
} as const;

/** Laser hair — $59 body parts locked through end of year */
export const LASER_59_AREAS = [
  { id: "underarms", label: "Underarms" },
  { id: "bikini", label: "Bikini" },
  { id: "brazilian", label: "Brazilian" },
  { id: "upper-legs", label: "Upper legs" },
  { id: "lower-legs", label: "Lower legs" },
  { id: "face", label: "Chin / neck / face" },
] as const;

export const LASER_59_SPECIAL = {
  id: "laser-59",
  badge: "Locked through 2026",
  title: "Laser Hair Removal — Any Listed Area",
  price: "$59",
  priceNote: "per session · per area",
  validThrough: OSWEGO_SPECIALS_VALID_THROUGH,
  device: "Zemits DuoCratus medical-grade diode + IPL platform",
  includes: LASER_59_AREAS.map((a) => a.label),
  note: `Price locked at $59 per session for each listed area through ${OSWEGO_SPECIALS_VALID_THROUGH}. Series recommended for lasting reduction.`,
  bookHref: `${PRIMARY_BOOKING_CTA.href}?ref=laser_59_year_end`,
  detailsHref: `${OSWEGO_SPECIALS_PATH}#laser`,
} as const;

/**
 * IPL photofacial $79 — Zemits DuoCratis IPL guide as clinical reference
 * (filters / indications; not a medical claim of brand results).
 */
export const IPL_79_SPECIAL = {
  id: "ipl-79",
  badge: "Zemits DuoCratus IPL",
  title: "IPL Photofacial",
  price: "$79",
  priceNote: "photofacial special",
  duration: "30–45 min",
  validThrough: OSWEGO_SPECIALS_VALID_THROUGH,
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
  note: "Skin assessment required. Not all skin types or concerns are candidates for every filter. Ask about a series for pigment and redness goals.",
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
    seoLabel: "HydraFacial + Dermaplaning $129 with Marissa",
  },
  {
    ...LASH_FULL_SET_SPECIAL,
    sectionId: "lashes",
    href: LASH_FULL_SET_SPECIAL.detailsHref,
    seoLabel: "Full set eyelash extensions $89 Oswego",
  },
  {
    ...LASER_59_SPECIAL,
    sectionId: "laser",
    href: LASER_59_SPECIAL.detailsHref,
    seoLabel: "Laser hair removal $59 underarms bikini Brazilian legs face Oswego",
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
    question: "What specials does Hello Gorgeous Med Spa in Oswego have right now?",
    answer: `Through ${OSWEGO_SPECIALS_VALID_THROUGH}: Marissa’s HydraFacial + dermaplaning $129 (O₂ + 2 add-ons), full-set eyelash extensions $89, laser hair removal $59 on listed body areas, and Zemits DuoCratus IPL photofacial $79. Book at hellogorgeousmedspa.com/oswego-specials.`,
  },
  {
    question: "Who is Marissa at Hello Gorgeous Med Spa Oswego?",
    answer:
      "Marissa Murray is a licensed esthetician and certified lash artist. Book her for HydraFacial glow specials and full-set eyelash extensions — she’s the artist we want busy with these offers.",
  },
  {
    question: "What’s included in the $89 full-set lash extensions?",
    answer:
      "A full classic or hybrid lash set with Marissa, customized to your eye shape. Mention the $89 full-set special when you book. Fills are priced separately.",
  },
  {
    question: "Which laser hair areas are $59 through the end of the year?",
    answer:
      "Underarms, bikini, Brazilian, upper legs, lower legs, and chin/neck/face — $59 per session per area, price locked through December 31, 2026 at Hello Gorgeous Med Spa in Oswego.",
  },
  {
    question: "What is the $79 IPL photofacial?",
    answer:
      "An IPL photorejuvenation treatment on our Zemits DuoCratus platform. Filters are chosen from the DuoCratus IPL guide for sun damage, redness, dullness, or congestion support when appropriate. Sapphire cooling helps keep treatment comfortable.",
  },
  {
    question: "Where is Hello Gorgeous Med Spa?",
    answer:
      "74 W Washington St, Oswego, IL 60543. We serve Oswego, Naperville, Aurora, Plainfield, Yorkville, Montgomery, and the Fox Valley.",
  },
] as const;

export const OSWEGO_SPECIALS_SEO = {
  title: "Oswego Med Spa Specials — HydraFacial $129, Lashes $89, Laser $59, IPL $79 | Hello Gorgeous",
  description: `Hello Gorgeous Med Spa Oswego specials through ${OSWEGO_SPECIALS_VALID_THROUGH}: Marissa’s HydraFacial $129, full-set lashes $89, laser hair $59 (underarms, bikini, Brazilian, legs, face), Zemits IPL photofacial $79. Book online.`,
  keywords: [
    "Hello Gorgeous Med Spa Oswego",
    "med spa specials Oswego IL",
    "HydraFacial Oswego $129",
    "eyelash extensions Oswego $89",
    "laser hair removal Oswego $59",
    "Brazilian laser hair removal Oswego",
    "underarm laser hair removal Oswego",
    "IPL photofacial Oswego $79",
    "Zemits DuoCratus IPL Oswego",
    "lash extensions Marissa Oswego",
    "best med spa Oswego specials",
    "Naperville Aurora laser hair special",
  ],
} as const;
