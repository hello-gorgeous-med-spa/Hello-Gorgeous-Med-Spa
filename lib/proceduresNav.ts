/**
 * Routes that belong to the "Procedures" area (devices / signature treatments)
 * for nav highlighting, separate from general "Services" (injectables, facials, etc.).
 */
const PROCEDURE_PATH_TESTERS: ((p: string) => boolean)[] = [
  (p) => p === "/procedures" || p.startsWith("/procedures/"),
  (p) => p === "/patient-documents" || p.startsWith("/patient-documents/"),
  (p) =>
    p.startsWith("/services/quantum-rf") || p.startsWith("/services/morpheus8") || p.startsWith("/services/solaria-co2"),
  (p) => p.startsWith("/morpheus8-burst-oswego-il"),
  (p) => p.startsWith("/solaria-co2-laser-oswego-il"),
  (p) => p.startsWith("/quantum-rf-oswego-il"),
  (p) => p.startsWith("/pre-post-care/morpheus8-burst") || p.startsWith("/pre-post-care/solaria-co2") || p.startsWith("/pre-post-care/quantum-rf"),
  (p) => p.startsWith("/events/vip-device-night"),
];

export function isProcedureRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return PROCEDURE_PATH_TESTERS.some((fn) => fn(pathname));
}

/** "Services" nav — all /services/* except primary procedure service URLs above. */
export function isServiceCatalogRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  if (!pathname.startsWith("/services")) return false;
  return !isProcedureRoute(pathname);
}
