/**
 * Site navigation — Hello Gorgeous Labs shop hub.
 */

import { BOOKING_URL, labRequestUrl, LABS_HUB_PATH } from "@/lib/flows";
import { LAB_PANELS } from "@/lib/lab-panel-catalog";

export type LabsNavLink = {
  label: string;
  href: string;
  sub: string;
  badge?: string;
  external?: boolean;
};

export const LABS_NAV = {
  label: "Labs",
  href: LABS_HUB_PATH,
} as const;

export const LABS_NAV_LINKS: LabsNavLink[] = [
  {
    label: "Shop all lab panels",
    href: LABS_HUB_PATH,
    sub: "Hormone, metabolic & wellness · in-house draws Oswego",
    badge: "NEW",
  },
  ...LAB_PANELS.map((panel) => ({
    label: panel.name,
    href: labRequestUrl({ panel: panel.id, draw: "in-office" }),
    sub: `$${panel.retailUsd} · ${panel.markerCount} markers`,
    ...(panel.badge === "POPULAR"
      ? { badge: "POPULAR" as const }
      : panel.badge === "BEST VALUE"
        ? { badge: "VALUE" as const }
        : {}),
  })),
  {
    label: "Book in-house draw",
    href: BOOKING_URL,
    sub: "Fasting morning slots · Hello Gorgeous Oswego",
    external: true,
  },
  {
    label: "Lab guide & biomarkers",
    href: "/blood-work",
    sub: "Education before you order",
  },
  {
    label: "Lab & Body Guide",
    href: "/understand-your-body",
    sub: "Persona-guided education before you book",
  },
];

export function isLabsNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === LABS_HUB_PATH || pathname.startsWith(`${LABS_HUB_PATH}/`)) return true;
  if (pathname === "/lab-request" || pathname.startsWith("/lab-request")) return true;
  if (pathname === "/blood-work" || pathname.startsWith("/blood-work/")) return true;
  if (pathname === "/understand-your-body" || pathname.startsWith("/understand-your-body/")) return true;
  return false;
}

export function labsNavSection(): { label: string; href: string; links: LabsNavLink[] } {
  return {
    label: LABS_NAV.label,
    href: LABS_NAV.href,
    links: LABS_NAV_LINKS,
  };
}
