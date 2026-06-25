/**
 * Admin membership catalog — all Hello Gorgeous plans in one list for staff.
 */

import { AESTHETIC_MEMBERSHIPS_INACTIVE } from "@/lib/aesthetic-memberships";
import { HG_MEMBERSHIPS } from "@/lib/hg-memberships";
import {
  HORMONE_MEMBERSHIP_PLANS,
  PEPTIDE_MEMBERSHIP_PLANS,
  WELLNESS_MEMBERSHIP_CATEGORIES,
  WELLNESS_PROGRAM_PLANS,
  type WellnessMembershipCategoryId,
  type WellnessMembershipPlan,
} from "@/lib/wellness-memberships";
import { VITAMIN_MEMBERSHIPS } from "@/lib/vitamin-bar";

export type AdminMembershipCategoryId =
  | "med-spa"
  | WellnessMembershipCategoryId
  | "aesthetic";

export type AdminMembershipItem = {
  id: string;
  category: AdminMembershipCategoryId;
  group: string;
  name: string;
  summary: string;
  perks: string[];
  pricePerMonth: number;
  priceLabel: string;
  squarePayUrl?: string;
  consultFirst?: boolean;
  bookHref?: string;
  learnMoreHref?: string;
  badge?: string;
  highlight?: boolean;
  inactive?: boolean;
  footnote?: string;
};

function priceLabel(plan: {
  pricePerMonth: number;
  priceLabel?: string;
}): string {
  return plan.priceLabel ?? `$${plan.pricePerMonth}/mo`;
}

function fromWellness(plan: WellnessMembershipPlan): AdminMembershipItem {
  const cat = WELLNESS_MEMBERSHIP_CATEGORIES.find((c) => c.id === plan.category);
  return {
    id: plan.id,
    category: plan.category,
    group: cat?.label ?? plan.category,
    name: plan.name,
    summary: plan.summary,
    perks: plan.perks,
    pricePerMonth: plan.pricePerMonth,
    priceLabel: priceLabel(plan),
    squarePayUrl: plan.squarePayUrl,
    consultFirst: plan.consultFirst,
    bookHref: plan.bookHref,
    learnMoreHref: plan.learnMoreHref,
    badge: plan.badge,
    highlight: plan.highlight,
    footnote: plan.footnote,
  };
}

const MED_SPA: AdminMembershipItem[] = HG_MEMBERSHIPS.map((m) => ({
  id: m.id,
  category: "med-spa" as const,
  group: "Med spa tiers",
  name: m.name,
  summary: m.tagline,
  perks: m.perks,
  pricePerMonth: m.pricePerMonth,
  priceLabel: `$${m.pricePerMonth}/mo`,
  squarePayUrl: m.squarePayUrl,
  badge: m.badge,
  highlight: m.highlight,
  footnote: m.rolloverNote,
}));

const VITAMIN_BAR: AdminMembershipItem[] = VITAMIN_MEMBERSHIPS.filter((m) => !m.category).map(
  (m) => ({
    id: m.id,
    category: "vitamin-bar" as const,
    group: "Vitamin Bar",
    name: m.name,
    summary: m.summary,
    perks: m.perks,
    pricePerMonth: m.pricePerMonth,
    priceLabel: `$${m.pricePerMonth}/mo`,
    squarePayUrl: m.squarePayUrl,
    highlight: m.highlight,
    footnote: m.rolloverNote,
  }),
);

const AESTHETIC: AdminMembershipItem[] = AESTHETIC_MEMBERSHIPS_INACTIVE.map((m) => ({
  id: m.id,
  category: "aesthetic" as const,
  group: "Aesthetic (inactive)",
  name: m.name,
  summary: m.summary,
  perks: m.perks,
  pricePerMonth: m.pricePerMonth,
  priceLabel: `$${m.pricePerMonth}/mo`,
  squarePayUrl: m.squarePayUrl,
  inactive: true,
  highlight: m.highlight,
  footnote: m.rolloverNote,
}));

const ALL: AdminMembershipItem[] = [
  ...MED_SPA,
  ...VITAMIN_BAR,
  ...HORMONE_MEMBERSHIP_PLANS.map(fromWellness),
  ...WELLNESS_PROGRAM_PLANS.map(fromWellness),
  ...PEPTIDE_MEMBERSHIP_PLANS.map(fromWellness),
  ...AESTHETIC,
];

const BY_ID = new Map(ALL.map((m) => [m.id, m]));

export function listAdminMemberships(category?: AdminMembershipCategoryId): AdminMembershipItem[] {
  if (!category) return ALL;
  return ALL.filter((m) => m.category === category);
}

export function getAdminMembership(id: string): AdminMembershipItem | undefined {
  return BY_ID.get(id);
}

export function adminMembershipCategories(): {
  id: AdminMembershipCategoryId | "all";
  label: string;
  count: number;
}[] {
  return [
    { id: "all", label: "All", count: ALL.length },
    { id: "med-spa", label: "Med spa", count: listAdminMemberships("med-spa").length },
    { id: "vitamin-bar", label: "Vitamin Bar", count: listAdminMemberships("vitamin-bar").length },
    { id: "hormones", label: "Hormones", count: listAdminMemberships("hormones").length },
    { id: "wellness", label: "Wellness", count: listAdminMemberships("wellness").length },
    { id: "peptides", label: "Peptides", count: listAdminMemberships("peptides").length },
    { id: "aesthetic", label: "Aesthetic", count: listAdminMemberships("aesthetic").length },
  ];
}

export function membershipCheckoutEligible(item: AdminMembershipItem): boolean {
  if (item.inactive) return false;
  if (item.consultFirst) return false;
  return true;
}
