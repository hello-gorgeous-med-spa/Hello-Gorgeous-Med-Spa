/**
 * Hello Gorgeous Owner Portal — canonical config (/admin/owner).
 * Boots-style chrome for the founder/admin control hub.
 */

export const OWNER_PINK = "#E6007E";
export const OWNER_HOT = "#FF2D8E";
export const OWNER_SOFT = "#FFB8DC";
export const OWNER_BG = "#E8ECF4";
export const OWNER_NAV = "#0f172a";

export const OWNER_HOME_PATH = "/admin/owner";

export type OwnerTileId =
  | "overview"
  | "live-state"
  | "manual"
  | "website"
  | "rules"
  | "economics"
  | "inventory"
  | "services"
  | "clinical"
  | "consents"
  | "access"
  | "memberships"
  | "payments"
  | "gift-cards"
  | "data-model"
  | "exports"
  | "audit"
  | "risk"
  | "versions"
  | "automations"
  | "features"
  | "sandbox";

export type OwnerTile = {
  id: OwnerTileId;
  title: string;
  description: string;
  href: string;
  icon: string;
  primary?: boolean;
  category: "system" | "website" | "governance" | "business";
};

export const OWNER_NAV_LINKS = [
  { label: "Desk", href: "/desk", match: (p: string) => false },
  { label: "Home", href: OWNER_HOME_PATH, match: (p: string) => p === "/admin/owner" || p === "/admin/owner/" },
  { label: "Money", href: "/admin/owner/economics", match: (p: string) => p.startsWith("/admin/owner/economics") },
  { label: "Website", href: "/admin/owner/website", match: (p: string) => p.startsWith("/admin/owner/website") },
  { label: "Live", href: "/admin/owner/live-state", match: (p: string) => p.startsWith("/admin/owner/live-state") },
  { label: "Manual", href: "/admin/owner/manual", match: (p: string) => p.startsWith("/admin/owner/manual") },
] as const;

export const OWNER_SWITCHER = [
  { id: "desk", label: "Desk (home)", href: "/desk", icon: "🏠" },
  { id: "admin", label: "Admin Hub", href: "/admin", icon: "⚙️" },
  { id: "sell", label: "Sell — Proposals", href: "/admin/proposals", icon: "📝" },
  { id: "team", label: "Team", href: "/admin/command-center", icon: "🎛️" },
  { id: "regen", label: "RE GEN Shop", href: "/admin/rx/portal", icon: "💗" },
  { id: "staff", label: "Staff Hub", href: "/staff", icon: "📋" },
] as const;

export const OWNER_TILES: OwnerTile[] = [
  // System / Operating tiles (primary)
  {
    id: "live-state",
    title: "Live System State",
    description: "Real-time system health, active sessions, and operational status.",
    href: "/admin/owner/live-state",
    icon: "📡",
    primary: true,
    category: "system",
  },
  {
    id: "manual",
    title: "Owner's Manual",
    description: "Business guides, SOPs, and how the system works.",
    href: "/admin/owner/manual",
    icon: "📖",
    primary: true,
    category: "system",
  },
  {
    id: "economics",
    title: "Revenue & Economics",
    description: "Financial reports, pricing rules, and margin analysis.",
    href: "/admin/owner/economics",
    icon: "💰",
    primary: true,
    category: "business",
  },
  {
    id: "website",
    title: "Website CMS",
    description: "Pages, navigation, promotions, and media library.",
    href: "/admin/owner/website",
    icon: "🌐",
    primary: true,
    category: "website",
  },

  // Business tiles
  {
    id: "services",
    title: "Services & Pricing",
    description: "Edit service menu, pricing tiers, and packages.",
    href: "/admin/owner/services",
    icon: "💎",
    category: "business",
  },
  {
    id: "inventory",
    title: "Inventory",
    description: "Stock levels, reorder alerts, and supplier info.",
    href: "/admin/owner/inventory",
    icon: "📦",
    category: "business",
  },
  {
    id: "memberships",
    title: "Memberships",
    description: "Membership tiers, benefits, and subscriber stats.",
    href: "/admin/owner/memberships",
    icon: "⭐",
    category: "business",
  },
  {
    id: "payments",
    title: "Payments & Billing",
    description: "Transaction history, refunds, and payment settings.",
    href: "/admin/owner/payments",
    icon: "💳",
    category: "business",
  },
  {
    id: "gift-cards",
    title: "Gift Cards",
    description: "Issue, track, and manage gift card balances.",
    href: "/admin/owner/gift-cards",
    icon: "🎁",
    category: "business",
  },

  // System tiles
  {
    id: "rules",
    title: "Rules & Precedence",
    description: "Business rules, booking constraints, and overrides.",
    href: "/admin/owner/rules",
    icon: "⚖️",
    category: "system",
  },
  {
    id: "features",
    title: "Modules & Features",
    description: "Enable/disable features and system modules.",
    href: "/admin/owner/features",
    icon: "🎚️",
    category: "system",
  },
  {
    id: "automations",
    title: "Automations",
    description: "Triggers, workflows, and scheduled jobs.",
    href: "/admin/owner/automations",
    icon: "⚡",
    category: "system",
  },

  // Governance tiles
  {
    id: "clinical",
    title: "Clinical Governance",
    description: "Provider protocols, compliance, and clinical rules.",
    href: "/admin/owner/clinical",
    icon: "🩺",
    category: "governance",
  },
  {
    id: "consents",
    title: "Consents & Legal",
    description: "Consent forms, waivers, and legal documents.",
    href: "/admin/owner/consents",
    icon: "📋",
    category: "governance",
  },
  {
    id: "access",
    title: "Access & Authority",
    description: "User roles, permissions, and access control.",
    href: "/admin/owner/access",
    icon: "🔐",
    category: "governance",
  },
  {
    id: "data-model",
    title: "Data Model Control",
    description: "Schema, fields, and data structure.",
    href: "/admin/owner/data-model",
    icon: "🗃️",
    category: "governance",
  },
  {
    id: "risk",
    title: "Risk & Compliance",
    description: "Risk register, compliance checks, and alerts.",
    href: "/admin/owner/risk",
    icon: "⚠️",
    category: "governance",
  },
  {
    id: "audit",
    title: "Audit & Forensics",
    description: "Activity logs, change history, and forensics.",
    href: "/admin/owner/audit",
    icon: "🔍",
    category: "governance",
  },
  {
    id: "exports",
    title: "Exports & Exit",
    description: "Data exports, backups, and portability.",
    href: "/admin/owner/exports",
    icon: "📤",
    category: "governance",
  },
  {
    id: "versions",
    title: "Versions & Changelog",
    description: "Release history and system updates.",
    href: "/admin/owner/versions",
    icon: "📜",
    category: "system",
  },
  {
    id: "sandbox",
    title: "Sandbox",
    description: "Test features and experimental tools.",
    href: "/admin/owner/sandbox",
    icon: "🧪",
    category: "system",
  },
];

export function tilesByCategory(category: OwnerTile["category"]): OwnerTile[] {
  return OWNER_TILES.filter((t) => t.category === category);
}

export function primaryTiles(): OwnerTile[] {
  return OWNER_TILES.filter((t) => t.primary);
}

export function otherTiles(): OwnerTile[] {
  return OWNER_TILES.filter((t) => !t.primary);
}

export function ownerGreeting(
  firstName: string | null | undefined,
  email: string | null | undefined,
): string {
  if (firstName?.trim()) return firstName.trim();
  if (email?.includes("@")) {
    const local = email.split("@")[0] || "";
    if (local.toLowerCase().includes("danielle") || local.toLowerCase() === "dani") return "Danielle";
    if (local) return local.charAt(0).toUpperCase() + local.slice(1);
  }
  return "Boss";
}
