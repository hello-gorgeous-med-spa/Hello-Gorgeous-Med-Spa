import {
  IV_CUSTOM_BAG_BASE_USD,
  IV_CUSTOM_BAG_LARGE_USD,
  IV_CUSTOM_BAG_TARGET_LABEL,
  IV_DRIP_MENU,
  IV_SIGNATURE_DRIP_FROM_USD,
  IV_THERAPY_SERVICE_PATH,
  formatIvDripPrice,
  ivBagBuilderUrl,
} from "@/lib/iv-drip-menu";
import {
  NAD_PLUS_INJECTION_MEMBER_PRICE,
  NAD_PLUS_INJECTION_PRICE,
  NAD_PLUS_INJECTIONS_PATH,
  NAD_PLUS_IV_FROM_PRICE,
} from "@/lib/nad-plus-injections";
import { VITAMIN_SHOTS } from "@/lib/vitamin-bar";

export const IV_SHOTS_PATH = "/iv-shots" as const;

export const IV_SHOTS_FAQS = [
  {
    question: "What's the difference between IV drips and Vitamin Bar shots?",
    answer:
      "IV drips deliver hydration and nutrients over 30–60+ minutes — best for hangovers, immunity, and high-dose protocols. Vitamin Bar shots are quick intramuscular injections in about 10 minutes at our drive-thru window or in-office.",
  },
  {
    question: "How much does a custom IV bag cost?",
    answer: `Build your bag from ${formatIvDripPrice(IV_CUSTOM_BAG_BASE_USD)} (500 mL) or ${formatIvDripPrice(IV_CUSTOM_BAG_LARGE_USD)} (1 L), then add Olympia-sourced boosters in the Hello Gorgeous app. Most custom bags land ${IV_CUSTOM_BAG_TARGET_LABEL} before you book.`,
  },
  {
    question: "How much is NAD+?",
    answer: `NAD+ injections are ${NAD_PLUS_INJECTION_PRICE} per visit (${NAD_PLUS_INJECTION_MEMBER_PRICE} for members). NAD+ IV infusions start ${NAD_PLUS_IV_FROM_PRICE} for a 2–4 hour protocol. Your provider confirms dose at consult.`,
  },
  {
    question: "Do you have a drive-thru vitamin bar?",
    answer:
      "Yes — pull up to Hello Gorgeous at 74 W Washington St in downtown Oswego. Pre-pay shots in the Hello Gorgeous app or pay at the window. Most visits take about 10 minutes.",
  },
  {
    question: "Who supervises IV therapy and shots?",
    answer:
      "Ryan Kent, FNP-BC is Medical Director with full prescriptive authority and is on site seven days a week. IV and wellness protocols are NP-supervised; Olympia Pharmacy–sourced products.",
  },
] as const;

export const IV_SHOTS_META = {
  title: "IV Therapy & Vitamin Shots in Oswego, IL | Hello Gorgeous Med Spa",
  description:
    "IV drips from $89 build-your-bag · signature drips from $169 · vitamin shots from $25 · drive-thru Vitamin Bar · NAD+ $40 · NP-supervised in downtown Oswego. Naperville, Aurora & Plainfield.",
} as const;

export const IV_SHOTS_HERO = {
  eyebrow: "Drive-thru Vitamin Bar · Downtown Oswego",
  title: "IV Therapy & Vitamin Shots",
  subtitle:
    "Nutrient-dense IV drips and quick wellness shots — build your bag in the app, pull up for a 10-minute shot, or relax in our infusion suite. Ryan Kent, FNP-BC on site.",
} as const;

export const IV_SHOTS_BUILD_BAG = {
  base500: formatIvDripPrice(IV_CUSTOM_BAG_BASE_USD),
  base1000: formatIvDripPrice(IV_CUSTOM_BAG_LARGE_USD),
  targetRange: IV_CUSTOM_BAG_TARGET_LABEL,
  signatureFrom: formatIvDripPrice(IV_SIGNATURE_DRIP_FROM_USD),
  builderUrl: ivBagBuilderUrl({ utmMedium: "iv_shots_page" }),
  appUrl: "/app",
} as const;

export const IV_SHOTS_DRIPS = IV_DRIP_MENU;

export const IV_SHOTS_VITAMIN_SHOTS = VITAMIN_SHOTS.filter((s) => s.category !== "rx");

export const IV_SHOTS_NAD = {
  injection: NAD_PLUS_INJECTION_PRICE,
  injectionMember: NAD_PLUS_INJECTION_MEMBER_PRICE,
  ivFrom: NAD_PLUS_IV_FROM_PRICE,
  detailPath: NAD_PLUS_INJECTIONS_PATH,
  ivPath: IV_THERAPY_SERVICE_PATH,
} as const;
