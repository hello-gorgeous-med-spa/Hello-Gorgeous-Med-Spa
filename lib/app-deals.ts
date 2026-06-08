/**
 * APP-EXCLUSIVE DEALS
 * Edit this file to update the Deals tab in the client app.
 * Changes go live on next deploy.
 *
 * accentIndex: 0 = pink, 1 = blue, 2 = orange
 * expires: ISO date string or null (no expiry)
 * cta: button label
 * href: where the button goes (use BOOKING_URL for booking)
 */

import { BOOKING_URL, GLP1_INTAKE_PATH } from "@/lib/flows";

export type AppDeal = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  savings: string;
  expires: string | null;
  cta: string;
  href: string;
  accentIndex: number;
  pinned?: boolean; // pinned deals show first
};

export const APP_DEALS: AppDeal[] = [
  {
    id: "botox-app-special",
    badge: "APP EXCLUSIVE",
    title: "Botox Special",
    subtitle: "$11/unit — App Members Only",
    description: "Show this screen at checkout. Valid for new and existing clients booking through the app.",
    savings: "Save $2+/unit",
    expires: null,
    cta: "Book Now",
    href: BOOKING_URL,
    accentIndex: 0, // pink
    pinned: true,
  },
  {
    id: "vitamin-b12-flash",
    badge: "FLASH DEAL",
    title: "B12 Shot — $15",
    subtitle: "Drive-Thru · This Week Only",
    description: "Pre-pay in the app and pull up anytime Mon–Sat. No appointment needed.",
    savings: "Save $10",
    expires: null,
    cta: "Pre-Pay Now",
    href: "/app?tab=vitamin",
    accentIndex: 1, // blue
    pinned: false,
  },
  {
    id: "morpheus8-package",
    badge: "LIMITED OFFER",
    title: "Morpheus8 Package",
    subtitle: "3 treatments — best price of the year",
    description: "Our most popular body contouring treatment. App-only pricing when you book a 3-pack this month.",
    savings: "Save $300",
    expires: null,
    cta: "Claim Offer",
    href: BOOKING_URL,
    accentIndex: 2, // orange
    pinned: false,
  },
  {
    id: "glp1-consult",
    badge: "FREE",
    title: "Free GLP-1 Consultation",
    subtitle: "Semaglutide & Tirzepatide Programs",
    description: "Start your weight loss journey with a free virtual or in-person consultation. App members only.",
    savings: "$0 consult fee",
    expires: null,
    cta: "Start Screening",
    href: GLP1_INTAKE_PATH,
    accentIndex: 0, // pink
    pinned: false,
  },
];

export function getActiveDeals(): AppDeal[] {
  const now = Date.now();
  return APP_DEALS
    .filter((d) => !d.expires || new Date(d.expires).getTime() > now)
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
}
