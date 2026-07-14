/**
 * Hello Gorgeous RX Provider Portal — nav + role skins (FormuConnect-inspired).
 */

export type RxPortalRoleSkin = "provider" | "staff" | "admin";

export type RxPortalNavItem = {
  id: string;
  label: string;
  href: string;
  badge?: string;
  /** Roles that see this item (owner maps to admin skin). */
  roles: RxPortalRoleSkin[];
};

export const RX_PORTAL_BASE = "/rx-portal" as const;

export const RX_PORTAL_NAV: RxPortalNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: `${RX_PORTAL_BASE}`,
    roles: ["provider", "staff", "admin"],
  },
  {
    id: "place-order",
    label: "Place Order",
    href: `${RX_PORTAL_BASE}/place-order`,
    badge: "NEW",
    roles: ["provider", "staff", "admin"],
  },
  {
    id: "orders",
    label: "Order History",
    href: `${RX_PORTAL_BASE}/orders`,
    roles: ["provider", "staff", "admin"],
  },
  {
    id: "patients",
    label: "My Patients",
    href: `${RX_PORTAL_BASE}/patients`,
    roles: ["provider", "staff", "admin"],
  },
  {
    id: "products",
    label: "Products",
    href: `${RX_PORTAL_BASE}/products`,
    roles: ["provider", "staff", "admin"],
  },
  {
    id: "spend",
    label: "Spend Reports",
    href: `${RX_PORTAL_BASE}/spend`,
    roles: ["admin", "staff"],
  },
  {
    id: "invoices",
    label: "Invoices",
    href: `${RX_PORTAL_BASE}/invoices`,
    roles: ["provider", "staff", "admin"],
  },
  {
    id: "documents",
    label: "Documents",
    href: `${RX_PORTAL_BASE}/documents`,
    roles: ["provider", "staff", "admin"],
  },
  {
    id: "tutorials",
    label: "How To Tutorials",
    href: `${RX_PORTAL_BASE}/tutorials`,
    roles: ["provider", "staff", "admin"],
  },
];

export function hgosRoleToPortalSkin(role: string | null | undefined): RxPortalRoleSkin {
  if (role === "provider") return "provider";
  if (role === "owner" || role === "admin") return "admin";
  return "staff";
}

export function portalNavForSkin(skin: RxPortalRoleSkin): RxPortalNavItem[] {
  return RX_PORTAL_NAV.filter((item) => item.roles.includes(skin));
}

export function portalHomeForSkin(skin: RxPortalRoleSkin): string {
  if (skin === "provider") return `${RX_PORTAL_BASE}/orders`;
  if (skin === "staff") return `${RX_PORTAL_BASE}/place-order`;
  return RX_PORTAL_BASE;
}

/** Formulation / FormuConnect vendor portal (manual Place Order until API live). */
export const RX_PORTAL_PHARMACY_PLACE_ORDER_URL =
  process.env.NEXT_PUBLIC_FORMULATION_PORTAL_URL?.trim() ||
  "https://formulationrx.com";
