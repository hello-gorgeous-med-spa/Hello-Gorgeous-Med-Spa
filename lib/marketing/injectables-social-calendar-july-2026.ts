/**
 * Botox & Fillers — injectables social calendar (July 2026).
 *
 *   npx tsx scripts/publish-injectables-social-calendar.ts --week=1
 *   npx tsx scripts/publish-injectables-social-calendar.ts --all --dry-run
 */

export type InjectablesSocialPost = {
  slug: string;
  week: number;
  dayLabel: string;
  label: string;
  channels: Array<"google" | "facebook" | "instagram">;
  message: string;
  link: string;
  imagePath: string;
};

const SITE = "https://www.hellogorgeousmedspa.com";
const INJECTABLES = `${SITE}/services/injectables`;

export const INJECTABLES_SOCIAL_CALENDAR_JULY_2026: InjectablesSocialPost[] = [
  {
    slug: "injectables-flagship-launch",
    week: 1,
    dayLabel: "Mon W1",
    label: "Botox & Fillers flagship page",
    channels: ["google", "facebook", "instagram"],
    message: `Botox & fillers at Hello Gorgeous 💉

✓ Botox $10/unit (first-time)
✓ Lip filler $450
✓ All 5 neurotoxins on one menu
✓ NP-led · free consult

Explore our full injectables menu 👇

#Botox #LipFiller #HelloGorgeous #OswegoIL #MedSpa`,
    link: INJECTABLES,
    imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  },
  {
    slug: "botox-10-unit",
    week: 1,
    dayLabel: "Wed W1",
    label: "Botox $10/unit — first-time",
    channels: ["google", "facebook", "instagram"],
    message: `First-time Botox at Hello Gorgeous — $10/unit ✨

Forehead · crow's feet · frown lines · lip flip · masseter

All 5 brands: Botox · Dysport · Jeuveau · Xeomin · Daxxify

Book free consult 👇`,
    link: `${SITE}/botox-oswego`,
    imagePath: "/images/promo/injection-menu-poster.png",
  },
  {
    slug: "lip-filler-450",
    week: 1,
    dayLabel: "Fri W1",
    label: "Lip filler $450",
    channels: ["google", "facebook", "instagram"],
    message: `Natural lip filler — $450 at Hello Gorgeous 💋

Juvederm & Restylane protocols · Lip Studio AI preview · 2-week touch-up in plan

Oswego · Naperville · Aurora area 👇`,
    link: `${SITE}/lip-filler-oswego`,
    imagePath: "/images/promo/lip-filler-promo-flyer.png",
  },
  {
    slug: "compare-5-neurotoxins",
    week: 2,
    dayLabel: "Mon W2",
    label: "Compare all 5 neurotoxins",
    channels: ["google", "facebook"],
    message: `Botox vs Dysport vs Jeuveau vs Xeomin vs Daxxify — which fits YOU? 🔬

Only Fox Valley med spa with all 5 on one honest menu.

Compare guide + book consult 👇`,
    link: `${SITE}/botox-vs-dysport-vs-jeuveau`,
    imagePath: "/images/skin-layers-injection-depth-reference.png",
  },
  {
    slug: "dermal-fillers-menu",
    week: 2,
    dayLabel: "Wed W2",
    label: "Dermal fillers from $650",
    channels: ["google", "facebook", "instagram"],
    message: `Cheeks · jawline · chin · temples — dermal fillers from $650 💫

Full-face mapping · hyaluronidase on hand · Cherry financing

Hello Gorgeous Med Spa Oswego 👇`,
    link: `${SITE}/dermal-fillers-oswego`,
    imagePath: "/images/homepage-buyer-paths/injectables.png",
  },
  {
    slug: "daxxify-6-month",
    week: 2,
    dayLabel: "Fri W2",
    label: "Daxxify — 6-month neurotoxin",
    channels: ["google", "facebook", "instagram"],
    message: `Want longer-lasting results? Daxxify — up to 6 months 💪

One of only Fox Valley clinics with all 5 neurotoxin brands on site.

Learn more + book 👇`,
    link: `${SITE}/daxxify-oswego-il`,
    imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  },
  {
    slug: "lip-studio-preview",
    week: 3,
    dayLabel: "Mon W3",
    label: "Lip Studio AI preview",
    channels: ["google", "facebook", "instagram"],
    message: `Not sure what lip shape suits you? Try Lip Studio ✨

AI preview before you commit · natural enhancement · NP-led consult

Free Lip Studio consultation 👇`,
    link: `${SITE}/lip-studio`,
    imagePath: "/images/promo/lip-filler-promo-flyer.png",
  },
  {
    slug: "botox-naperville-local",
    week: 3,
    dayLabel: "Wed W3",
    label: "Botox near Naperville",
    channels: ["google", "facebook", "instagram"],
    message: `Fox Valley — Botox ~15 min from Naperville 🏠

Hello Gorgeous Med Spa Oswego:
→ $10/unit first-time Botox
→ All 5 neurotoxins
→ NP on site · free consult

Book 👇`,
    link: `${SITE}/injectables-naperville-il`,
    imagePath: "/images/promo/injection-menu-poster.png",
  },
  {
    slug: "injectables-morpheus8-pair",
    week: 3,
    dayLabel: "Fri W3",
    label: "Injectables + Morpheus8",
    channels: ["google", "facebook"],
    message: `Volume + tightening = complete refresh 🔬

Botox & fillers for lines and volume · Morpheus8 for skin tightening beneath.

InMode Trifecta + injectables at Hello Gorgeous Oswego 👇`,
    link: `${SITE}/services/morpheus8`,
    imagePath: "/images/homepage-buyer-paths/injectables.png",
  },
  {
    slug: "baby-tox-glass-glow",
    week: 4,
    dayLabel: "Mon W4",
    label: "Baby Botox & Glass Glow",
    channels: ["google", "facebook", "instagram"],
    message: `Baby tox + Glass Glow Facial — event-ready skin ✨

HydraFacial + dermaplaning + conservative baby tox — movement preserved.

Explore injectables menu 👇`,
    link: `${INJECTABLES}#neurotoxins`,
    imagePath: "/images/promo/injection-menu-poster.png",
  },
  {
    slug: "fillers-plainfield-local",
    week: 4,
    dayLabel: "Wed W4",
    label: "Fillers near Plainfield",
    channels: ["google", "facebook", "instagram"],
    message: `Dermal fillers ~12 min from Plainfield 💫

Hello Gorgeous Med Spa Oswego — lip filler $450 · dermal from $650 · 2-syringe packages.

Local + full menu 👇`,
    link: `${SITE}/injectables-plainfield-il`,
    imagePath: "/images/promo/lip-filler-promo-flyer.png",
  },
  {
    slug: "injectables-book-reminder",
    week: 4,
    dayLabel: "Fri W4",
    label: "Book injectables consult",
    channels: ["google", "facebook", "instagram"],
    message: `Ready for your consult? 💕

Botox $10/unit · lip filler $450 · all 5 neurotoxins · NP-led

Free consult · Alle rewards · Cherry financing

Book today 👇`,
    link: INJECTABLES,
    imagePath: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
  },
];

export function getInjectablesSocialPosts(filter?: {
  week?: number;
  slug?: string;
}): InjectablesSocialPost[] {
  let posts = INJECTABLES_SOCIAL_CALENDAR_JULY_2026;
  if (filter?.week) posts = posts.filter((p) => p.week === filter.week);
  if (filter?.slug) posts = posts.filter((p) => p.slug === filter.slug);
  return posts;
}

export function listInjectablesSocialSlugs(): string[] {
  return INJECTABLES_SOCIAL_CALENDAR_JULY_2026.map((p) => p.slug);
}
