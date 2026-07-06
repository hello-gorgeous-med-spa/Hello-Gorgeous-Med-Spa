/**
 * Morpheus8 + Solaria — InMode Trifecta social calendar (July 2026).
 * npx tsx scripts/publish-inmode-social-calendar.ts --week=1 --product=morpheus8
 */

export type InmodeSocialPost = {
  slug: string;
  product: "morpheus8" | "solaria";
  week: number;
  dayLabel: string;
  label: string;
  channels: Array<"google" | "facebook" | "instagram">;
  message: string;
  link: string;
  imagePath: string;
};

const SITE = "https://www.hellogorgeousmedspa.com";

export const INMODE_SOCIAL_CALENDAR_JULY_2026: InmodeSocialPost[] = [
  {
    slug: "m8-flagship-launch",
    product: "morpheus8",
    week: 1,
    dayLabel: "Mon W1",
    label: "Morpheus8 flagship page",
    channels: ["google", "facebook", "instagram"],
    message: `Morpheus8 Burst + Deep at Hello Gorgeous 💫\n\nDeepest RF microneedling — up to 8mm for face & body tightening, scars & laxity.\n\n✓ From $850/session\n✓ InMode Trifecta on site\n✓ Real before/afters · Oswego IL\n\nBook free consult 👇\n\n#Morpheus8 #RFMicroneedling #HelloGorgeous #OswegoIL #SkinTightening`,
    link: `${SITE}/services/morpheus8`,
    imagePath: "/images/morpheus8/morpheus8-burst-deep-neck-tightening-before-after.png",
  },
  {
    slug: "solaria-launch-899",
    product: "solaria",
    week: 1,
    dayLabel: "Wed W1",
    label: "Solaria CO₂ — $899 launch",
    channels: ["google", "facebook", "instagram"],
    message: `Solaria CO₂ fractional laser — $899 full face launch ✨\n\nWrinkles · acne scars · sun damage · texture\n\nOnly Solaria in the western suburbs — at Hello Gorgeous Oswego.\n\nBook free consult 👇\n\n#CO2Laser #Solaria #HelloGorgeous #SkinResurfacing #OswegoIL`,
    link: `${SITE}/services/solaria-co2`,
    imagePath: "/images/solaria/solaria-co2-full-face-before-after.png",
  },
  {
    slug: "m8-naperville-local",
    product: "morpheus8",
    week: 1,
    dayLabel: "Fri W1",
    label: "Morpheus8 near Naperville",
    channels: ["google", "facebook", "instagram"],
    message: `Fox Valley — Morpheus8 Burst ~15 min from Naperville 🏠\n\nSkin tightening · acne scars · jowls · body\n\nHello Gorgeous Med Spa · Oswego IL 👇`,
    link: `${SITE}/morpheus8-naperville-il`,
    imagePath: "/images/morpheus8/morpheus8-burst-deep-jowls-profile-before-after.png",
  },
  {
    slug: "solaria-trifecta",
    product: "solaria",
    week: 2,
    dayLabel: "Mon W2",
    label: "Solaria + Morpheus8 Trifecta",
    channels: ["google", "facebook"],
    message: `Surface + depth = complete transformation 🔬\n\nSolaria CO₂ resurfaces. Morpheus8 Burst remodels beneath.\n\nVIP Trifecta packages at Hello Gorgeous Oswego 👇`,
    link: `${SITE}/specials`,
    imagePath: "/images/solaria/solaria-device.png",
  },
  {
    slug: "m8-body-results",
    product: "morpheus8",
    week: 2,
    dayLabel: "Wed W2",
    label: "Morpheus8 body before/after",
    channels: ["google", "facebook", "instagram"],
    message: `Arms · abdomen · thighs · knees — Morpheus8 Burst treats body laxity too 💪\n\nReal results at Hello Gorgeous Med Spa Oswego.\n\nExplore + book 👇`,
    link: `${SITE}/services/morpheus8#results`,
    imagePath: "/images/morpheus8/morpheus8-burst-deep-bat-wing-arms-before-after.png",
  },
  {
    slug: "solaria-acne-scars",
    product: "solaria",
    week: 2,
    dayLabel: "Fri W2",
    label: "Solaria acne scar revision",
    channels: ["google", "facebook", "instagram"],
    message: `Acne scars don't have to be forever ✨\n\nSolaria CO₂ fractional laser — dramatic scar revision at Hello Gorgeous Oswego.\n\n$899 full face launch · free consult 👇`,
    link: `${SITE}/services/solaria-co2#results`,
    imagePath: "/images/solaria/solaria-co2-acne-scars-before-after.png",
  },
];

export function getInmodeSocialPosts(filter?: { week?: number; slug?: string; product?: "morpheus8" | "solaria" }) {
  let posts = INMODE_SOCIAL_CALENDAR_JULY_2026;
  if (filter?.week) posts = posts.filter((p) => p.week === filter.week);
  if (filter?.slug) posts = posts.filter((p) => p.slug === filter.slug);
  if (filter?.product) posts = posts.filter((p) => p.product === filter.product);
  return posts;
}

export function listInmodeSocialSlugs() {
  return INMODE_SOCIAL_CALENDAR_JULY_2026.map((p) => p.slug);
}
