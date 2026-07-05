/**
 * FlowWave-only social calendar — July 2026 SEO + GBP distribution.
 *
 *   npx tsx scripts/publish-flowwave-social-calendar.ts --week=1
 *   npx tsx scripts/publish-flowwave-social-calendar.ts --all --dry-run
 */

export type FlowwaveSocialPost = {
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
const FLOWWAVE = `${SITE}/services/flowwave`;

export const FLOWWAVE_SOCIAL_CALENDAR_JULY_2026: FlowwaveSocialPost[] = [
  {
    slug: "flowwave-launch-intro49",
    week: 1,
    dayLabel: "Mon W1",
    label: "FlowWave launch — $49 intro",
    channels: ["google", "facebook", "instagram"],
    message: `NEW at Hello Gorgeous — FlowWave FOCUS shockwave therapy 💫

Focused acoustic waves for deep-tissue pain, faster recovery & men's wellness.

✓ Intro special: $49 first session (any area)
✓ 3–10 minute sessions · no downtime
✓ NP-directed at our Oswego clinic

Book your screening 👇

#ShockwaveTherapy #FlowWave #HelloGorgeous #OswegoIL #PainRelief`,
    link: FLOWWAVE,
    imagePath: "/images/flowwave/brand/stemwave-shockwave-banner.png",
  },
  {
    slug: "flowwave-learn-shockwave",
    week: 1,
    dayLabel: "Wed W1",
    label: "FlowWave Learn — What is shockwave?",
    channels: ["google", "facebook", "instagram"],
    message: `What is shockwave therapy? 📚

Our FlowWave Learn guide explains focused acoustic waves, who may benefit, session length, and how Hello Gorgeous screens every client in Oswego.

Education first — then book.

Read the guide 👇`,
    link: `${SITE}/services/flowwave/learn/what-is-shockwave-therapy`,
    imagePath: "/images/flowwave/flowwave-recovery-banner.png",
  },
  {
    slug: "flowwave-naperville-local",
    week: 1,
    dayLabel: "Fri W1",
    label: "Shockwave near Naperville — intro $49",
    channels: ["google", "facebook", "instagram"],
    message: `Fox Valley — shockwave therapy 15 min from Naperville 🏠

FlowWave FOCUS at Hello Gorgeous Med Spa in Oswego:
→ Deep-tissue pain & sports recovery
→ Men's wellness (private, NP-directed)
→ Intro $49 first session any area

Book 👇`,
    link: `${SITE}/shockwave-therapy-naperville-il`,
    imagePath: "/images/flowwave/flowwave-zones-banner.png",
  },
  {
    slug: "flowwave-pain-recovery-learn",
    week: 2,
    dayLabel: "Mon W2",
    label: "Learn — shockwave for pain & recovery",
    channels: ["google", "facebook", "instagram"],
    message: `Knee, shoulder, or sports recovery pain? 🏃

FlowWave Learn breaks down when focused shockwave may support joints & tendons — with NP screening before every session.

Start informed 👇`,
    link: `${SITE}/services/flowwave/learn/shockwave-pain-recovery`,
    imagePath: "/images/flowwave/flowwave-recovery-banner.png",
  },
  {
    slug: "flowwave-how-it-works",
    week: 2,
    dayLabel: "Wed W2",
    label: "How FlowWave works",
    channels: ["google", "facebook"],
    message: `From free NP screening to your first session — how FlowWave works 📋

1️⃣ Medical screening
2️⃣ Map the treatment zone
3️⃣ 3–10 min focused session
4️⃣ Weekly course if recommended

Intro $49 · Oswego IL 👇`,
    link: `${SITE}/services/flowwave/learn/how-flowwave-works`,
    imagePath: "/images/flowwave/flowwave-device-banner.png",
  },
  {
    slug: "flowwave-brochure",
    week: 2,
    dayLabel: "Fri W2",
    label: "FlowWave brochure & device",
    channels: ["google", "facebook", "instagram"],
    message: `See FlowWave FOCUS in action 📄

Download our shockwave therapy brochure or explore the interactive version — focused waves up to 12 cm deep.

Intro special $49 first session 👇`,
    link: `${SITE}/services/flowwave/brochure`,
    imagePath: "/images/flowwave/flowwave-device-portrait.png",
  },
  {
    slug: "flowwave-mens-wellness",
    week: 3,
    dayLabel: "Mon W3",
    label: "Men's wellness — private shockwave",
    channels: ["google", "facebook"],
    message: `Men's wellness shockwave — handled with full discretion 🩺

FlowWave FOCUS at Hello Gorgeous Med Spa in Oswego. NP-directed, private scheduling, real clinic — not a retail gimmick.

Learn more 👇`,
    link: `${SITE}/services/flowwave/learn/shockwave-mens-wellness`,
    imagePath: "/images/flowwave/flowwave-mens-banner.png",
  },
  {
    slug: "flowwave-aurora-local",
    week: 3,
    dayLabel: "Wed W3",
    label: "Shockwave near Aurora IL",
    channels: ["google", "facebook", "instagram"],
    message: `Aurora & Fox Valley — focused shockwave in Oswego ⚡

FlowWave FOCUS · NP-directed · intro $49 first session · packages available

Book or read local guide 👇`,
    link: `${SITE}/shockwave-therapy-aurora-il`,
    imagePath: "/images/flowwave/flowwave-provider-hero.png",
  },
  {
    slug: "flowwave-trust-clinic",
    week: 3,
    dayLabel: "Fri W3",
    label: "Real clinic — not a gadget spa",
    channels: ["google", "facebook", "instagram"],
    message: `Your body deserves a real medical team 🩺

FlowWave shockwave at Hello Gorgeous Med Spa — 74 W. Washington, Oswego. Ryan Kent, FNP-BC screens every client.

Intro $49 · (630) 636-6193 👇`,
    link: FLOWWAVE,
    imagePath: "/images/flowwave/flowwave-provider-hero.png",
  },
  {
    slug: "flowwave-spa-qr-start",
    week: 4,
    dayLabel: "Mon W4",
    label: "In-spa QR — scan to book shockwave",
    channels: ["google", "facebook"],
    message: `At Hello Gorgeous? Scan & book FlowWave on your phone 📱

Shockwave therapy · intro $49 · NP-directed · Oswego IL

Scan or tap 👇`,
    link: `${SITE}/services/flowwave/start?utm_source=spa`,
    imagePath: "/images/flowwave/brand/stemwave-shockwave-banner.png",
  },
  {
    slug: "flowwave-learn-hub",
    week: 4,
    dayLabel: "Wed W4",
    label: "FlowWave Learn hub",
    channels: ["google", "facebook", "instagram"],
    message: `Questions before shockwave? 📖

FlowWave Learn — guides on what shockwave is, pain recovery, men's wellness & how our Oswego program works.

Browse guides 👇`,
    link: `${SITE}/services/flowwave/learn`,
    imagePath: "/images/flowwave/flowwave-recovery-banner.png",
  },
  {
    slug: "flowwave-intro49-reminder",
    week: 4,
    dayLabel: "Fri W4",
    label: "Intro $49 — last call July",
    channels: ["google", "facebook", "instagram"],
    message: `Last chance this month — FlowWave intro $49 💫

Any treatment area · includes NP screening · 3–10 min sessions · no downtime

Hello Gorgeous Med Spa · Oswego IL 👇`,
    link: FLOWWAVE,
    imagePath: "/images/flowwave/flowwave-device-banner.png",
  },
];

export function getFlowwaveSocialPosts(filter?: {
  week?: number;
  slug?: string;
}): FlowwaveSocialPost[] {
  let posts = FLOWWAVE_SOCIAL_CALENDAR_JULY_2026;
  if (filter?.week) posts = posts.filter((p) => p.week === filter.week);
  if (filter?.slug) posts = posts.filter((p) => p.slug === filter.slug);
  return posts;
}

export function listFlowwaveSocialSlugs(): string[] {
  return FLOWWAVE_SOCIAL_CALENDAR_JULY_2026.map((p) => p.slug);
}
