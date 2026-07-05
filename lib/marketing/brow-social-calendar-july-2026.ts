/**
 * Your Brow Journey — microblading social calendar (July 2026 SEO + GBP distribution).
 *
 *   npx tsx scripts/publish-brow-social-calendar.ts --week=1
 *   npx tsx scripts/publish-brow-social-calendar.ts --all --dry-run
 */

export type BrowSocialPost = {
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
const BROW = `${SITE}/microblading-brow-pmu-oswego-il`;

export const BROW_SOCIAL_CALENDAR_JULY_2026: BrowSocialPost[] = [
  {
    slug: "brow-journey-launch",
    week: 1,
    dayLabel: "Mon W1",
    label: "Your Brow Journey — launch",
    channels: ["google", "facebook", "instagram"],
    message: `Wake up with brows you love ✨

Your Brow Journey is live at Hello Gorgeous Med Spa — microblading, powder, combo & nano brows by Jen Vokoun in Oswego.

✓ Custom brow mapping
✓ Tina Davies pigments
✓ NP-directed · touch-up included
✓ Meet Jen special available

Book your free consult 👇

#Microblading #BrowPMU #HelloGorgeous #OswegoIL #PermanentMakeup`,
    link: BROW,
    imagePath: "/images/brow-journey/jen-vokoun-2.jpg",
  },
  {
    slug: "brow-meet-jen-special",
    week: 1,
    dayLabel: "Wed W1",
    label: "Meet Jen — intro pricing",
    channels: ["google", "facebook", "instagram"],
    message: `Meet Jen Vokoun — our brow PMU artist 🎨

Limited Meet Jen special:
→ Microblading from $350
→ Combo brows from $400
→ Perfecting touch-up included

Full techniques, healing guide & pricing on Your Brow Journey 👇`,
    link: `${BROW}#pricing`,
    imagePath: "/images/brow-journey/jen-vokoun.jpg",
  },
  {
    slug: "brow-naperville-local",
    week: 1,
    dayLabel: "Fri W1",
    label: "Microblading near Naperville",
    channels: ["google", "facebook", "instagram"],
    message: `Fox Valley — microblading ~15 min from Naperville 🏠

Hello Gorgeous Med Spa in Oswego:
→ Hair-stroke, powder, combo & nano
→ Jen Vokoun · custom mapping
→ NP on site · free consult

Near-me guide 👇`,
    link: `${SITE}/microblading-naperville-il`,
    imagePath: "/images/brow-journey/brow-mapping.png",
  },
  {
    slug: "brow-techniques-guide",
    week: 2,
    dayLabel: "Mon W2",
    label: "Techniques — which brow is right for you?",
    channels: ["google", "facebook", "instagram"],
    message: `Microblading vs powder vs combo vs nano — which is YOU? 📖

Your Brow Journey breaks down every technique, who each suits best, and how Jen maps your face first.

Education before you book 👇`,
    link: `${BROW}#techniques`,
    imagePath: "/images/brow-journey/brow-compare.png",
  },
  {
    slug: "brow-healing-timeline",
    week: 2,
    dayLabel: "Wed W2",
    label: "Healing timeline — day by day",
    channels: ["google", "facebook"],
    message: `Bold → dark → flaky → "gone" → perfect 🌿

Your Brow Journey walks you through every healing stage so you know what to expect — and when your true color shows up.

Read the timeline 👇`,
    link: `${BROW}#healing`,
    imagePath: "/images/brow-journey/pmu-natural.jpg",
  },
  {
    slug: "brow-aurora-local",
    week: 2,
    dayLabel: "Fri W2",
    label: "Microblading near Aurora IL",
    channels: ["google", "facebook", "instagram"],
    message: `Aurora & Fox Valley — brow PMU in Oswego ✨

Jen Vokoun · Tina Davies pigments · NP-directed screening · touch-up included

Local near-me page 👇`,
    link: `${SITE}/microblading-aurora-il`,
    imagePath: "/images/brow-journey/pmu-microblade.jpg",
  },
  {
    slug: "brow-tina-davies-pigments",
    week: 3,
    dayLabel: "Mon W3",
    label: "Tina Davies pigments — shade matching",
    channels: ["google", "facebook", "instagram"],
    message: `Premium pigments matter for healed brows 🎨

Jen uses Tina Davies professional PMU colors — matched to your skin tone and hair so results look like YOU, not a stamp.

See pigments & shapes on Your Brow Journey 👇`,
    link: `${BROW}#pigments`,
    imagePath: "/images/brow-journey/td-chart.webp",
  },
  {
    slug: "brow-plainfield-local",
    week: 3,
    dayLabel: "Wed W3",
    label: "Microblading near Plainfield",
    channels: ["google", "facebook", "instagram"],
    message: `Plainfield & Kendall County — custom brows in Oswego 💕

Microblading · ombré powder · combo · nano
Free consult · Cherry financing available

Near-me guide 👇`,
    link: `${SITE}/microblading-plainfield-il`,
    imagePath: "/images/brow-journey/brow-types.png",
  },
  {
    slug: "brow-np-trust",
    week: 3,
    dayLabel: "Fri W3",
    label: "Real med spa — not a booth",
    channels: ["google", "facebook", "instagram"],
    message: `Your brows deserve a real medical team 🩺

Hello Gorgeous Med Spa — 74 W. Washington, Oswego. NP-directed screening before every brow PMU appointment with Jen Vokoun.

Explore Your Brow Journey 👇`,
    link: BROW,
    imagePath: "/images/brow-journey/founder-dani.png",
  },
  {
    slug: "brow-spa-qr",
    week: 4,
    dayLabel: "Mon W4",
    label: "In-spa QR — scan Your Brow Journey",
    channels: ["google", "facebook"],
    message: `At Hello Gorgeous? Scan & explore brow PMU on your phone 📱

Your Brow Journey — techniques, healing, pricing & book in one place · Oswego IL

Scan or tap 👇`,
    link: `${BROW}?utm_source=spa`,
    imagePath: "/images/brow-journey/cherry-qr.png",
  },
  {
    slug: "brow-yorkville-montgomery",
    week: 4,
    dayLabel: "Wed W4",
    label: "Yorkville & Montgomery near-me",
    channels: ["google", "facebook", "instagram"],
    message: `Kendall County & Fox Valley — microblading near you ✨

Hello Gorgeous Med Spa in Oswego serves Yorkville, Montgomery & surrounding towns.

Local guides + full Brow Journey experience 👇`,
    link: `${SITE}/microblading-yorkville-il`,
    imagePath: "/images/brow-journey/brow-microblade2.png",
  },
  {
    slug: "brow-book-reminder",
    week: 4,
    dayLabel: "Fri W4",
    label: "Book your brow consult",
    channels: ["google", "facebook", "instagram"],
    message: `Ready for brows you love? 💕

Free consult · Jen Vokoun · touch-up included · 0% APR financing with Cherry

Your Brow Journey — book or text us today 👇`,
    link: BROW,
    imagePath: "/images/brow-journey/pmu-shading.jpg",
  },
];

export function getBrowSocialPosts(filter?: {
  week?: number;
  slug?: string;
}): BrowSocialPost[] {
  let posts = BROW_SOCIAL_CALENDAR_JULY_2026;
  if (filter?.week) posts = posts.filter((p) => p.week === filter.week);
  if (filter?.slug) posts = posts.filter((p) => p.slug === filter.slug);
  return posts;
}

export function listBrowSocialSlugs(): string[] {
  return BROW_SOCIAL_CALENDAR_JULY_2026.map((p) => p.slug);
}
