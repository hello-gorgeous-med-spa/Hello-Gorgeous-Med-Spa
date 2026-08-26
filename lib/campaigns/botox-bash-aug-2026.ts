/**
 * Weekend Botox Bash — Fri Aug 28–Sat Aug 29, 2026
 * Plus public reveal of the new downtown Oswego studio.
 */

export const BOTOX_BASH_PATH = "/botox-bash" as const;

export const BOTOX_BASH_CAMPAIGN = {
  name: "Weekend Botox Bash — Aug 28–29, 2026",
  path: BOTOX_BASH_PATH,
  fridayLabel: "Friday, August 28",
  saturdayLabel: "Saturday, August 29",
  fridayWindow: "5:00 PM – 9:00 PM",
  saturdayWindow: "10:00 AM – 5:00 PM",
  girlsNightTitle: "Girls Night Out",
  phoneDisplay: "(630) 636-6193",
  telHref: "tel:+16306366193",
  addressLine: "74 W. Washington Street, Oswego, IL 60543",
  botoxPrice: "$9/unit + tax",
  lipHalfPrice: "$399 · ½ syringe",
  doubleShotPrice: "$50",
  bookPath: "/book?ref=botox_bash_2026",
  gbpPath:
    "/botox-bash?utm_source=google&utm_medium=gbp_post&utm_campaign=botox_bash_aug2026" as `/${string}`,
  socialPath:
    "/botox-bash?utm_source=social&utm_medium=page_post&utm_campaign=botox_bash_aug2026" as `/${string}`,
  imagePath: "/images/events/botox-bash-2026/weekend-flyer.png" as `/${string}`,
  studioImagePath: "/images/studio/reception.png" as `/${string}`,
  flyerWeekend: "/images/events/botox-bash-2026/weekend-flyer.png" as `/${string}`,
  flyerFriday: "/images/events/botox-bash-2026/friday-girls-night.png" as `/${string}`,
  fridayStartIso: "2026-08-28T17:00:00-05:00",
  fridayEndIso: "2026-08-28T21:00:00-05:00",
  weekendStartIso: "2026-08-28T17:00:00-05:00",
  weekendEndIso: "2026-08-29T17:00:00-05:00",
} as const;

export const STUDIO_PHOTOS = [
  {
    src: "/images/studio/reception.png",
    alt: "Hello Gorgeous Med Spa reception desk — downtown Oswego",
    caption: "Reception",
  },
  {
    src: "/images/studio/retail-wall.png",
    alt: "Hello Gorgeous retail wall with medical-grade skincare and awards",
    caption: "Retail & awards",
  },
  {
    src: "/images/studio/lobby-window.png",
    alt: "Hello Gorgeous lobby with window seating and awards",
    caption: "Lobby",
  },
  {
    src: "/images/studio/lobby-lounge.png",
    alt: "Hello Gorgeous waiting lounge — downtown Oswego medical spa",
    caption: "Lounge",
  },
  {
    src: "/images/studio/waiting-chairs.png",
    alt: "Hello Gorgeous waiting chairs in the new Oswego studio",
    caption: "Waiting room",
  },
] as const;

export const BOTOX_BASH_GBP = `Come see what we’ve been building.

Hello Gorgeous Med Spa — new downtown Oswego studio is ready. Then this weekend:

WEEKEND BOTOX BASH
Fri Aug 28 & Sat Aug 29

• Botox $9/unit + tax
• Lip filler ½ syringe $399 (event)
• Double vitamin shot $50
• Friday 5–9 PM Girls Night Out

74 W Washington St · (630) 636-6193
Medical Director Dr. Mukesh Arora, MD · Ryan Kent, FNP-BC on site

Book below — units mapped at your visit.`;

export const BOTOX_BASH_FACEBOOK = `We’ve been working so hard on this space — and it’s ready for you.

Come walk into the new Hello Gorgeous Med Spa in downtown Oswego… then stay for Weekend Botox Bash.

FRI AUG 28 & SAT AUG 29
Botox $9/unit + tax
½ syringe lip filler $399 (event price)
Double vitamin shot $50
Friday 5–9 PM — Girls Night Out

This is our home on Washington Street: injectables, InMode, facials, lashes, RX — all under Medical Director Dr. Mukesh Arora, MD, with Ryan Kent, FNP-BC on site.

Book your spot: hellogorgeousmedspa.com/botox-bash
(630) 636-6193

Units are mapped at the visit. Event pricing this weekend only.`;

export const NEW_STUDIO_GBP = `The new Hello Gorgeous is open to walk through.

We’ve been pouring everything into this downtown Oswego studio — reception, lounge, medical-grade retail, the whole client experience. Come see it in person.

74 W Washington St · (630) 636-6193
Medical Director Dr. Mukesh Arora, MD · owner Danielle Alcala-Glazier in clinic daily

This weekend: Botox Bash Fri 8/28 & Sat 8/29 — $9/unit + tax. Book below.`;

export const NEW_STUDIO_FACEBOOK = `We’ve been working so hard on this — and you can finally walk through it.

The new Hello Gorgeous Med Spa is ready in downtown Oswego. New reception. New lounge. Medical-grade retail. The whole client experience we promised.

Come see the space. Then stay for Weekend Botox Bash — Fri Aug 28 (Girls Night 5–9 PM) & Sat Aug 29.

Botox $9/unit + tax · event ½ syringe lip filler $399 · double vitamin shot $50

74 W Washington St · (630) 636-6193
hellogorgeousmedspa.com/botox-bash`;

export const BOTOX_BASH_SQUARE = {
  campaignName: "HG Weekend Botox Bash — Aug 28–29",
  subject: "{{first_name}}, the new spa is ready — Botox Bash this weekend",
  previewText: "New downtown studio + $9/unit Botox Fri 8/28 & Sat 8/29",
  sms: `Hello Gorgeous: New spa is ready. Botox Bash Fri 8/28 (Girls Night 5-9) & Sat 8/29. $9/unit + tax. Book: hellogorgeousmedspa.com/botox-bash Reply STOP to opt out.`,
} as const;

export const BOTOX_BASH_FAQS = [
  {
    question: "When is Weekend Botox Bash?",
    answer:
      "Friday, August 28 from 5:00–9:00 PM (Girls Night Out) and Saturday, August 29 during Saturday clinic hours at 74 W. Washington Street, Oswego.",
  },
  {
    question: "What is the event pricing?",
    answer:
      "Authentic Botox Cosmetic at $9 per unit plus tax, event ½ syringe lip filler at $399, and a double vitamin shot at $50. Units are mapped at your visit. Event pricing this weekend only.",
  },
  {
    question: "Can I just walk in to see the new spa?",
    answer:
      "Yes — come see the new downtown studio. Appointments are required for injectables so we can map units and keep the evening on time. Book online or call (630) 636-6193.",
  },
] as const;
