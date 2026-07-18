import type { InModeTreatmentLandingContent } from "@/lib/inmode-treatment-landing";
import { NEUROTOXIN_AREA_CARDS, NEUROTOXIN_TRUST } from "@/lib/neurotoxin-treatment-areas";

/** LaserAway-style educational Botox landing — Hello Gorgeous, Oswego. */
export const BOTOX_TREATMENT_LANDING: InModeTreatmentLandingContent = {
  slug: "botox-oswego",
  path: "/botox-oswego",
  metaTitle: "Botox in Oswego, IL — from $9/unit",
  metaDescription:
    "Expert Botox in Oswego, IL by our medical injector team. Natural results, honest pricing as low as $9/unit (Allergan & US distributors only). Free consult — Naperville & Aurora.",
  breadcrumbName: "Botox Oswego",
  locality: "Botox Cosmetic in Oswego, Illinois",
  productName: "Botox Cosmetic",
  heroSubhead:
    "Smooth fine lines and wrinkles while keeping your natural expressions — placed by medical injectors in an NP-directed clinic you can trust.",
  heroImage: "/images/hg-botox-face-neck.webp",
  heroImageAlt: "Natural-looking Botox Cosmetic results — Hello Gorgeous Med Spa Oswego IL",
  priceLine: "As low as $9/unit",
  priceNote: "Authentic Allergan Botox · US distributors only · you approve units before we inject",
  trustItems: [...NEUROTOXIN_TRUST],
  whatTitle: "About Botox at Hello Gorgeous",
  whatBody: [
    "Botox® is a trusted, FDA-approved neuromodulator that smooths fine lines by relaxing the facial muscles that cause expression wrinkles. It softens existing lines and helps slow new ones — without changing who you are.",
    "At Hello Gorgeous in Oswego, every treatment is mapped to your face in motion. We use authentic Allergan Botox Cosmetic (and other FDA-approved neurotoxins from US distributors only) — never gray-market product.",
  ],
  treatsIntro: "Botox helps:",
  treats: [
    "Smooth fine lines and wrinkles",
    "Prevent new expression lines",
    "Maintain natural facial movement",
    "Soften forehead, 11s, and crow’s feet",
    "Refine jawline and lip lines when appropriate",
    "Reduce excessive underarm sweating (hyperhidrosis)",
    "Deliver visible results within days",
  ],
  areaCardsTitle: "Areas we treat with Botox",
  areaCardsIntro:
    "Botox is versatile. Every session is customized to your goals — targeting the muscles that create the lines you want softened.",
  areaCards: [
    ...NEUROTOXIN_AREA_CARDS,
    {
      title: "Underarms (hyperhidrosis)",
      blurb: "Reduce excessive sweating with mapped underarm injections.",
      href: "/hyperhidrosis-botox-oswego-il",
    },
  ],
  howTitle: "How Botox works",
  howBody:
    "Botox Cosmetic by Allergan® targets the nerve signals that make facial muscles contract. Once injected, those muscles relax and the skin above them smooths — while your expressions stay yours. Results begin in about 3–5 days, with full effect by day 14, lasting about 3–4 months for most clients.",
  howBullets: [
    "Neuromodulator — not a filler",
    "Mapped to your face in motion",
    "Typical upper face: 20–40 units total",
    "You approve units before we inject",
  ],
  before:
    "Avoid alcohol for 24 hours to reduce bruising. Skip heavy caffeine if you’re bruise-prone. Eat a balanced meal. Arrive with clean skin (minimal makeup). Share medications and cold-sore history so we can plan safely.",
  during:
    "Your visit is usually about 30 minutes; injections themselves take a few minutes. We’ll have you frown, raise brows, and smile so placement matches your goals — typically several precise points per area. Topical numbing available if you prefer.",
  after:
    "Mild redness or tenderness can last a few hours. Stay upright for 4 hours; skip workouts, heavy makeup, and lying flat that day. Written aftercare goes home with you. Complimentary day-14 assessment — touch-ups per policy when clinically appropriate.",
  careGuideHref: "/pre-post-care/botox",
  faqs: [
    {
      q: "How much is Botox in Oswego?",
      a: "As low as $9 per unit. Total depends on areas treated — we quote clearly at your free consult before anything begins. Authentic Allergan Botox from US distributors only.",
    },
    {
      q: "Will Botox make me look frozen?",
      a: "No — we aim for natural, refreshed results that keep your expressions. Dose and placement are tailored to your face and comfort level.",
    },
    {
      q: "Who performs the injections?",
      a: "Our trained medical injector team in a nurse-practitioner-directed medical setting — not a salon.",
    },
    {
      q: "Is your Botox authentic?",
      a: "Yes. Allergan-branded Botox Cosmetic and other FDA-approved neurotoxins from US distributors only — never gray-market product.",
    },
    {
      q: "How long does Botox last?",
      a: "About 3–4 months for most clients. Most settle into roughly three visits a year.",
    },
    {
      q: "What’s the difference between Botox, Dysport, and Jeuveau?",
      a: "All are neuromodulators. Botox is the original Allergan brand. Dysport spreads slightly more; Jeuveau is a newer option. We help you pick what’s right — see our compare guide.",
    },
    {
      q: "Do you offer same-day Botox?",
      a: "Often yes — call before noon at (630) 636-6193 and we’ll check the schedule.",
    },
  ],
  consultTitle: "Ready for your first (or next) Botox visit?",
  consultBody:
    "Book a free consultation in Oswego. We’ll map your goals, quote units clearly, and keep results natural — as low as $9/unit with authentic Allergan product.",
  related: [
    {
      href: "/dysport-oswego",
      eyebrow: "Neurotoxin",
      title: "Dysport",
      blurb: "Faster-onset cousin — $14/unit. Often great for larger forehead zones.",
    },
    {
      href: "/jeuveau-oswego",
      eyebrow: "Neurotoxin",
      title: "Jeuveau",
      blurb: "Modern neuromodulator option at $11/unit.",
    },
    {
      href: "/dermal-fillers-oswego",
      eyebrow: "Volume",
      title: "Dermal fillers",
      blurb: "Restore volume and contour when lines need more than muscle relaxation.",
    },
  ],
  clinicVideos: [
    {
      src: "/videos/botox/botox-clinic-slideshow.mp4",
      label: "Clinic",
      title: "Botox at Hello Gorgeous — clinic slideshow",
      description:
        "Silent HD clinic slideshow of Botox Cosmetic treatments at Hello Gorgeous Med Spa in Oswego, IL — natural placement by our medical injector team.",
      poster: "/videos/botox/botox-clinic-slideshow-poster.jpg",
      aspect: "portrait",
    },
  ],
  clinicPhotos: [
    {
      src: "/images/botox/slideshow/01.jpg",
      alt: "Botox Cosmetic injection in progress at Hello Gorgeous Med Spa Oswego",
      frame: "portrait",
    },
    {
      src: "/images/botox/slideshow/02.jpg",
      alt: "Medical injector placing Botox at Hello Gorgeous Oswego",
      frame: "portrait",
    },
    {
      src: "/images/botox/slideshow/03.jpg",
      alt: "Botox treatment close-up — Hello Gorgeous Med Spa",
      frame: "portrait",
    },
    {
      src: "/images/botox/slideshow/04.jpg",
      alt: "Precision Botox placement at Hello Gorgeous Oswego IL",
      frame: "portrait",
    },
    {
      src: "/images/botox/slideshow/05.jpg",
      alt: "Botox Cosmetic session — NP-directed clinic Oswego",
      frame: "portrait",
    },
    {
      src: "/images/botox/slideshow/06.jpg",
      alt: "Hello Gorgeous Botox clinic care — Oswego IL",
      frame: "portrait",
    },
  ],
};
