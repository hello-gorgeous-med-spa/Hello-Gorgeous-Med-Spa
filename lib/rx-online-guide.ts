import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";
import { PEPTIDE_PHARMACY_SHIPPING_USD } from "@/lib/peptide-retail-pricing";
import { RX_TELEHEALTH_CADENCE_DAYS } from "@/lib/rx-supply-cycle";
import { SITE } from "@/lib/seo";

export const RX_ONLINE_GUIDE_PATH = "/rx/guide" as const;

export const RX_GUIDE_PILLS = [
  { emoji: "📍", label: "Track your order" },
  { emoji: "💬", label: "Message us 24/7" },
  { emoji: "💳", label: "Pay by text or email" },
  { emoji: "📅", label: "Book on Fresha" },
] as const;

export const RX_GUIDE_STEPS = [
  {
    title: "Tell us what you need",
    description: "Submit your refill or new protocol form online",
  },
  {
    title: "Video visit",
    description: `Book Ryan on Fresha ($${PROGRAM_CONSULT_FEE_USD} consult for new protocols)`,
  },
  {
    title: "Pay your invoice",
    description: "Secure link by text or email — pay on your phone",
  },
  {
    title: "Clinical review",
    description: "Ryan approves your protocol for the pharmacy",
  },
  {
    title: "Delivered to you",
    description: "Cold-chain shipping to your door",
  },
] as const;

export const RX_GUIDE_PATHS = [
  {
    id: "new",
    title: "✨ First time with us?",
    items: [
      "Visit our RX home page & pick a program",
      "Complete your intake form",
      "Pay your NP consult when prompted",
      "Book your Fresha telehealth visit",
      "Save your confirmation email — it has your personal status link",
    ],
    highlight: false,
  },
  {
    id: "returning",
    title: "🔄 Already an RX patient?",
    items: [
      "Open your care hub & submit your refill",
      "Choose 90-day supply (most popular) or 30-day",
      "Pay the invoice we text or email you",
      `Book Fresha only if your dose changed or it's been ${RX_TELEHEALTH_CADENCE_DAYS}+ days`,
      "Check your status page anytime for shipping updates",
    ],
    highlight: true,
  },
] as const;

export type RxGuideLink = {
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

export const RX_GUIDE_LINKS: RxGuideLink[] = [
  {
    title: "RX Request Portal",
    description: "Pick your goal, see pricing, and start intake — new patients",
    href: "/rx/request",
  },
  {
    title: "Care hub",
    description: "Refills, add-ons & patient guides — start here every time",
    href: "/rx/care",
  },
  {
    title: "Track my refill",
    description: "See where you are: form → visit → pay → ship",
    href: "/rx/status",
  },
  {
    title: "Message our team",
    description: "Private, secure chat — we reply during business hours",
    href: "/rx/messages",
  },
  {
    title: "Book telehealth",
    description: "Schedule your NP video visit on Fresha",
    href: "/telehealth",
  },
  {
    title: "GLP-1 refill",
    description: "Semaglutide & tirzepatide — existing weight-loss patients",
    href: "/glp1-refill",
  },
  {
    title: "Peptide request",
    description: "New protocol or peptide refill form",
    href: "/peptide-request",
  },
  {
    title: "Explore RX programs",
    description: "Peptides, weight loss & wellness RX overview",
    href: "/rx",
  },
  {
    title: "Hello Gorgeous app",
    description: "RX hub, refills, book & rewards — add to home screen",
    href: "/app?rx=1",
  },
  {
    title: "Start Here (peptides)",
    description: "Step-by-step peptide program picker",
    href: "/hello-gorgeous-rx/start-here",
  },
  {
    title: "My RX portal",
    description: "Logged-in patients — orders, pay links & refills",
    href: "/portal/rx",
  },
];

export const RX_GUIDE_TIPS = [
  {
    strong: "90-day supply",
    text: `is our most popular option — prepay three months and one shipping fee (typically $${PEPTIDE_PHARMACY_SHIPPING_USD}) per cycle.`,
  },
  {
    strong: "Telehealth",
    text: `is usually every ${RX_TELEHEALTH_CADENCE_DAYS} days when your dose is stable — not every month.`,
  },
  {
    strong: "Payment links",
    text: "come by text and/or email. Tap the link and pay securely on your phone.",
  },
  {
    strong: "Your status link",
    text: "in your confirmation email opens your personal tracker — no password needed.",
  },
  {
    strong: "Get the app",
    text: "— scan the QR below for RX refills, booking & messaging on your home screen (no App Store).",
  },
  {
    strong: "Questions?",
    text: "Message us online or call — we're happy to walk you through any step.",
  },
] as const;

export const RX_GUIDE_APP_FEATURES = [
  "RX refills & care hub — GLP-1, peptides & guides in one tap",
  "Track your refill — status, pay & secure messages",
  "Book — Botox, facials, Vitamin Bar & more",
  "HG Rewards — points, deals & memberships",
] as const;

export function rxGuideDisplayUrl(href: string): string {
  if (href.startsWith("http")) return href.replace(/^https:\/\//, "");
  return `${SITE.url.replace(/^https:\/\//, "")}${href}`;
}
