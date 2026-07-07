export const RX_OPS_NAV = [
  { id: "overview", name: "Overview", icon: "🏠" },
  { id: "requests", name: "Requests", icon: "🩺" },
  { id: "patients", name: "Patients", icon: "👥" },
  { id: "messages", name: "Messages", icon: "💬" },
  { id: "formulary", name: "Formulary", icon: "💊" },
  { id: "refills", name: "Refills", icon: "🔁" },
  { id: "payments", name: "Payments", icon: "💳" },
  { id: "team", name: "Team & Access", icon: "🔐" },
] as const;

export type RxOpsViewId = (typeof RX_OPS_NAV)[number]["id"];

export const RX_OPS_VIEW_TITLES: Record<RxOpsViewId, { title: string; sub: string }> = {
  overview: { title: "Overview", sub: "Prescription operations at a glance" },
  requests: { title: "Requests", sub: "Refill & new-protocol intake pipeline" },
  patients: { title: "Patients", sub: "Charts & demographics (PHI)" },
  messages: { title: "Messages", sub: "Secure patient threads" },
  formulary: { title: "Formulary", sub: "Full RE GEN catalog — pricing & pharmacy routing" },
  refills: { title: "Refills", sub: "30/90-day recurring plans" },
  payments: { title: "Payments", sub: "Square invoices, revenue & payouts" },
  team: { title: "Team & Access", sub: "Roles & permissions" },
};

export const RX_OPS_CAT_META: Record<string, { label: string; color: string }> = {
  peptides: { label: "Peptides", color: "#3b82f6" },
  "weight-loss": { label: "Weight Loss", color: "#FF2D8E" },
  hormones: { label: "Hormones", color: "#7c3aed" },
  wellness: { label: "Wellness", color: "#0d9488" },
  vitamins: { label: "Vitamins", color: "#f59e0b" },
  "hair-skin": { label: "Hair & Skin", color: "#db2777" },
  "sexual-health": { label: "Sexual Health", color: "#e11d48" },
};

export const RX_OPS_PH_COLORS: Record<string, string> = {
  "Formulation Rx": "#7c3aed",
  BoomRx: "#0d9488",
  Olympia: "#b45309",
};
