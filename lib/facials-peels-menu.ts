/** Nav helpers for Facials & Peels hub — page content lives in facials-peels-marketing.ts */

export const FACIALS_PEELS_MENU_PATH = "/services/facials-and-peels" as const;

export const FACIALS_PEELS_NAV = {
  label: "Facials",
  href: FACIALS_PEELS_MENU_PATH,
} as const;

export function isFacialsPeelsNavActive(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === FACIALS_PEELS_MENU_PATH || pathname.startsWith(`${FACIALS_PEELS_MENU_PATH}/`)) {
    return true;
  }
  return (
    pathname.startsWith("/hydrafacial") ||
    pathname.startsWith("/facials-oswego") ||
    pathname.startsWith("/dermaplaning-oswego") ||
    pathname.startsWith("/chemical-peel-oswego") ||
    pathname.startsWith("/services/ipl-photofacial") ||
    pathname.startsWith("/ipl-photofacial")
  );
}
