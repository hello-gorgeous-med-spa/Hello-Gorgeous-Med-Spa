/**
 * Hello Gorgeous Desk — canonical internal front door (/desk).
 * Role-filtered tiles deep-link into existing tools (no rewrite).
 */

import type { UserRole } from "@/lib/hgos/auth";

export const DESK_PINK = "#E6007E";
export const DESK_HOT = "#FF2D8E";
export const DESK_SOFT = "#FFB8DC";
export const DESK_BG = "#E8ECF4";
export const DESK_NAV = "#0f172a";

export const DESK_HOME_PATH = "/desk";

export type DeskTileId =
  | "my-day"
  | "sell"
  | "consult"
  | "regen-shop"
  | "regen-orders"
  | "rx-pipeline"
  | "spa-provider"
  | "team"
  | "laura-desk"
  | "train-academy"
  | "staff-hub"
  | "money-owner"
  | "text-studio"
  | "social"
  | "science"
  | "legacy-hub";

export type DeskTile = {
  id: DeskTileId;
  title: string;
  description: string;
  href: string;
  icon: string;
  /** Highlight as primary action */
  primary?: boolean;
  /** Roles that see this tile (empty = all desk roles) */
  roles: UserRole[];
  /** Extra: show for Laura email skin even if role is staff */
  lauraOnly?: boolean;
  /** Hide for Laura skin */
  hideForLaura?: boolean;
};

/** Capsule nav on Desk chrome */
export const DESK_NAV_LINKS = [
  { label: "Home", href: DESK_HOME_PATH, match: (p: string) => p === "/desk" || p === "/desk/" },
  { label: "Sell", href: "/admin/proposals", match: (p: string) => p.startsWith("/admin/proposals") },
  {
    label: "RE GEN",
    href: "/admin/rx/portal",
    match: (p: string) =>
      p.startsWith("/admin/rx") || p.startsWith("/rx-portal") || p.startsWith("/admin/rx-"),
  },
  {
    label: "Team",
    href: "/admin/command-center",
    match: (p: string) => p.startsWith("/admin/command-center"),
  },
  {
    label: "Train",
    href: "/admin/academy",
    match: (p: string) => p.startsWith("/admin/academy") || p.startsWith("/staff"),
  },
  {
    label: "Money",
    href: "/admin/owner",
    match: (p: string) => p.startsWith("/admin/owner") || p.startsWith("/admin/sales"),
    ownerAdminOnly: true,
  },
] as const;

export const DESK_SWITCHER = [
  { id: "desk", label: "Desk", href: DESK_HOME_PATH, icon: "🏠" },
  { id: "sell", label: "Sell", href: "/admin/proposals", icon: "📝" },
  { id: "regen-shop", label: "RE GEN Shop", href: "/admin/rx/portal", icon: "💗" },
  { id: "regen-orders", label: "RE GEN Orders", href: "/rx-portal", icon: "📦" },
  { id: "spa-provider", label: "Spa Provider", href: "/provider", icon: "🩺" },
  { id: "owner", label: "Owner", href: "/admin/owner", icon: "👑", ownerOnly: true },
  { id: "staff-hub", label: "Staff Hub", href: "/staff", icon: "📋" },
] as const;

export const DESK_TILES: DeskTile[] = [
  {
    id: "my-day",
    title: "My Day",
    description: "Today’s schedule, queue, and admin dashboard.",
    href: "/admin",
    icon: "☀️",
    primary: true,
    roles: ["owner", "admin", "staff", "provider", "readonly"],
  },
  {
    id: "sell",
    title: "Sell — Proposals",
    description: "Pipeline, proposals, and pay links.",
    href: "/admin/proposals",
    icon: "📝",
    primary: true,
    roles: ["owner", "admin", "staff", "provider"],
  },
  {
    id: "consult",
    title: "Consult Desk",
    description: "Screen · educate · propose · book.",
    href: "/admin/proposals/consults",
    icon: "🩺",
    roles: ["owner", "admin", "staff", "provider"],
  },
  {
    id: "regen-shop",
    title: "RE GEN Shop",
    description: "Staff catalog — sell peptides, GLP-1, HRT in clinic.",
    href: "/admin/rx/portal",
    icon: "💗",
    primary: true,
    roles: ["owner", "admin", "staff", "provider"],
  },
  {
    id: "regen-orders",
    title: "RE GEN Orders",
    description: "Place orders, patients, formulary, invoices.",
    href: "/rx-portal",
    icon: "📦",
    roles: ["owner", "admin", "staff", "provider"],
  },
  {
    id: "rx-pipeline",
    title: "RX Pipeline",
    description: "NP requests, refills, messages, team access.",
    href: "/admin/rx/ops",
    icon: "🖥️",
    roles: ["owner", "admin", "staff", "provider"],
  },
  {
    id: "spa-provider",
    title: "Spa Provider",
    description: "Clinical queue, charting, schedule.",
    href: "/provider",
    icon: "💉",
    roles: ["owner", "admin", "provider"],
  },
  {
    id: "team",
    title: "Team",
    description: "Command Center — checklist, tasks, ops board.",
    href: "/admin/command-center",
    icon: "🎛️",
    roles: ["owner", "admin", "staff"],
    hideForLaura: true,
  },
  {
    id: "laura-desk",
    title: "Laura’s Desk",
    description: "Marketing hours, checklist, outreach, invoices.",
    href: "/admin/command-center?view=marketing",
    icon: "📣",
    primary: true,
    roles: ["owner", "admin", "staff"],
    lauraOnly: true,
  },
  {
    id: "text-studio",
    title: "Text Studio",
    description: "SMS campaigns and client texts.",
    href: "/admin/sms",
    icon: "📱",
    roles: ["owner", "admin", "staff"],
    lauraOnly: true,
  },
  {
    id: "social",
    title: "Post to Social",
    description: "Approved social posting workflow.",
    href: "/admin/marketing/post-social",
    icon: "📲",
    roles: ["owner", "admin", "staff"],
    lauraOnly: true,
  },
  {
    id: "train-academy",
    title: "RE GEN Academy",
    description: "Staff courses, lessons, quizzes, tools.",
    href: "/admin/academy",
    icon: "🎓",
    roles: ["owner", "admin", "staff", "provider", "readonly"],
  },
  {
    id: "staff-hub",
    title: "Staff Hub",
    description: "Guides, pharmacy catalog, front desk tools.",
    href: "/staff",
    icon: "📋",
    roles: ["owner", "admin", "staff", "provider", "readonly"],
  },
  {
    id: "science",
    title: "Science Hub",
    description: "What clients read online — Regen Science.",
    href: "/regen-science",
    icon: "🔬",
    roles: ["owner", "admin", "staff", "provider", "readonly"],
  },
  {
    id: "money-owner",
    title: "Money / Owner",
    description: "Founder control, books, live system.",
    href: "/admin/owner",
    icon: "👑",
    roles: ["owner", "admin"],
  },
  {
    id: "legacy-hub",
    title: "Legacy Hub",
    description: "Classic Command Center iframe (optional).",
    href: "/hub/classic?legacy=1",
    icon: "🗂️",
    roles: ["owner", "admin"],
  },
];

/** Detect Laura marketing skin from email */
export function isLauraDeskUser(email: string | null | undefined): boolean {
  if (!email) return false;
  const e = email.toLowerCase();
  return e.includes("laura") || e.startsWith("laura@");
}

export type DeskHomeSkin = "owner" | "admin" | "provider" | "front_desk" | "laura" | "readonly";

export function deskSkinForUser(
  role: UserRole | null | undefined,
  email?: string | null,
): DeskHomeSkin {
  if (isLauraDeskUser(email)) return "laura";
  if (role === "owner") return "owner";
  if (role === "admin") return "admin";
  if (role === "provider") return "provider";
  if (role === "readonly") return "readonly";
  return "front_desk";
}

const SKIN_TILE_IDS: Record<DeskHomeSkin, DeskTileId[]> = {
  owner: [
    "my-day",
    "sell",
    "consult",
    "regen-shop",
    "regen-orders",
    "rx-pipeline",
    "spa-provider",
    "team",
    "train-academy",
    "staff-hub",
    "science",
    "money-owner",
    "legacy-hub",
  ],
  admin: [
    "my-day",
    "sell",
    "consult",
    "regen-shop",
    "regen-orders",
    "rx-pipeline",
    "team",
    "train-academy",
    "staff-hub",
    "science",
    "money-owner",
  ],
  provider: [
    "spa-provider",
    "regen-orders",
    "rx-pipeline",
    "my-day",
    "sell",
    "consult",
    "regen-shop",
    "train-academy",
    "science",
  ],
  front_desk: [
    "sell",
    "consult",
    "regen-shop",
    "staff-hub",
    "train-academy",
    "team",
    "my-day",
    "regen-orders",
    "science",
  ],
  laura: [
    "laura-desk",
    "text-studio",
    "social",
    "staff-hub",
    "train-academy",
    "science",
    "sell",
    "my-day",
  ],
  readonly: ["my-day", "train-academy", "staff-hub", "science"],
};

export function tilesForSkin(skin: DeskHomeSkin): DeskTile[] {
  const ids = SKIN_TILE_IDS[skin];
  const byId = new Map(DESK_TILES.map((t) => [t.id, t]));
  return ids.map((id) => byId.get(id)).filter((t): t is DeskTile => Boolean(t));
}

export function greetingName(
  firstName: string | null | undefined,
  email: string | null | undefined,
): string {
  if (firstName?.trim()) return firstName.trim();
  if (email?.includes("@")) {
    const local = email.split("@")[0] || "";
    if (local.toLowerCase().includes("danielle") || local.toLowerCase() === "dani") return "Danielle";
    if (local) return local.charAt(0).toUpperCase() + local.slice(1);
  }
  return "gorgeous";
}

/** Post-login home for staff roles */
export function portalHomeForDeskRole(role: UserRole | null | undefined): string {
  if (!role || role === "client") return "/portal";
  return DESK_HOME_PATH;
}
