/**
 * Admin portal navigation — two front doors, lean daily strip, everything else collapsed.
 * Front doors: Command Center (ops) · Consult Desk (sales)
 */

export type AdminNavItem = {
  href: string;
  label: string;
  icon: string;
  external?: boolean;
};

export type AdminNavGroup = {
  section: string;
  items: AdminNavItem[];
  /** Starts collapsed in the sidebar */
  collapsed?: boolean;
};

export const ADMIN_PORTAL_TAGLINE = "Command · Consult · close";

/** The two doors — also surfaced in Command Center + Consult hub */
export const ADMIN_FRONT_DOORS = [
  {
    href: "/admin/command-center",
    label: "Command Center",
    desc: "Team hub · checklist · daily ops",
    icon: "🎛️",
  },
  {
    href: "/admin/proposals/consults",
    label: "Consult Desk",
    desc: "Screen · educate · propose · book",
    icon: "🩺",
  },
] as const;

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    section: "Front doors",
    items: [
      { href: "/admin/command-center", label: "Command Center", icon: "🎛️" },
      { href: "/admin/proposals/consults", label: "Consult Desk", icon: "🩺" },
      { href: "/admin", label: "Dashboard", icon: "📊" },
    ],
  },
  {
    section: "Today",
    items: [
      { href: "/admin/clients", label: "Clients", icon: "👥" },
      { href: "/admin/calendar", label: "Calendar", icon: "🗓" },
      { href: "/admin/proposals", label: "Proposals", icon: "📝" },
      { href: "/admin/rx/ops", label: "RX Ops", icon: "🖥️" },
      { href: "/admin/sms", label: "Text Studio", icon: "📱" },
      { href: "/pos", label: "POS", icon: "💳" },
    ],
  },
  {
    section: "RX tools",
    collapsed: true,
    items: [
      { href: "/admin/rx", label: "RX Command", icon: "🎯" },
      { href: "/admin/rx/portal", label: "RE GEN Portal", icon: "💗" },
      { href: "/admin/rx-dispatch", label: "Dispatch", icon: "📤" },
      { href: "/admin/rx/pharmacy-orders", label: "Pharmacy Orders", icon: "🧪" },
      { href: "/admin/rx-invoices", label: "RX Invoices", icon: "💊" },
      { href: "/admin/rx/glp1-pricing", label: "RX Pricing", icon: "💲" },
      { href: "/admin/rx/catalog", label: "RE GEN Catalog", icon: "📋" },
      { href: "/admin/rx-ledger", label: "Payment Ledger", icon: "📒" },
      { href: "/admin/rx-messages", label: "Patient Messages", icon: "💬" },
      { href: "/admin/rx/clinic-sale", label: "Clinic Sale", icon: "🏥" },
      { href: "/admin/rx/clinic-reports", label: "Clinic Reports", icon: "📋" },
      { href: "/admin/rx/go-live", label: "Go-live / Compliance", icon: "✅" },
      { href: "/admin/flowwave", label: "FlowWave", icon: "🌊" },
      { href: "/staff/protocols", label: "Protocols", icon: "🧰" },
    ],
  },
  {
    section: "Schedule & sales",
    collapsed: true,
    items: [
      { href: "/admin/appointments", label: "Appointments", icon: "📅" },
      { href: "/admin/appointments/new", label: "New booking", icon: "➕" },
      { href: "/admin/proposals/new", label: "New proposal", icon: "✨" },
      { href: "/admin/scan", label: "Scan client", icon: "📷" },
    ],
  },
  {
    section: "Money",
    collapsed: true,
    items: [
      { href: "/admin/settings/payments", label: "Square Connect", icon: "🔗" },
      { href: "/admin/sales/payments", label: "Square Payments", icon: "💳" },
      { href: "/admin/sales/daily-summary", label: "Daily Summary", icon: "📈" },
      { href: "/admin/sales", label: "Sales Ledger", icon: "🧾" },
    ],
  },
  {
    section: "Marketing",
    collapsed: true,
    items: [
      { href: "/admin/marketing/post-social", label: "Post to Social", icon: "📲" },
      { href: "/admin/promos/bestie", label: "Bestie $100 Off", icon: "💕" },
      { href: "/admin/email-campaigns", label: "Email Campaigns", icon: "📧" },
    ],
  },
  {
    section: "Documents",
    collapsed: true,
    items: [
      { href: "/admin/consents", label: "Consents", icon: "✅" },
      { href: "/admin/settings/consent-forms", label: "Consent Forms", icon: "📝" },
      { href: "/admin/settings/pretreatment", label: "Pre-Treatment", icon: "📋" },
      { href: "/admin/settings/aftercare", label: "Aftercare", icon: "📄" },
      { href: "/pre-post-care", label: "Pre & Post Care", icon: "💗" },
      { href: "/admin/templates", label: "Message Templates", icon: "💬" },
      { href: "/admin/cheat-sheets", label: "Cheat Sheets", icon: "📑" },
      { href: "/admin/pmu-brows", label: "PMU & Handouts", icon: "💗" },
    ],
  },
  {
    section: "Spa & vendors",
    collapsed: true,
    items: [
      { href: "/admin/vendors", label: "Vendor Portals", icon: "🏢" },
      { href: "/admin/services", label: "Services", icon: "✨" },
      { href: "/admin/memberships", label: "Memberships", icon: "💎" },
      { href: "/admin/gift-cards", label: "Gift Cards", icon: "🎁" },
      { href: "/admin/unit-bank", label: "Unit Bank", icon: "💉" },
      { href: "/admin/charting", label: "Charting", icon: "🩺" },
      { href: "/admin/prescriptions", label: "Prescriptions", icon: "📃" },
      { href: "/admin/tools/brow-mapping", label: "Brow Mapping", icon: "✏️" },
      { href: "/admin/reports", label: "Reports", icon: "📊" },
    ],
  },
  {
    section: "System",
    collapsed: true,
    items: [{ href: "/admin/settings", label: "Settings", icon: "⚙️" }],
  },
];

export const ADMIN_NAV_FLAT: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap((g) => g.items);

export const ADMIN_MOBILE_BOTTOM_NAV = [
  { href: "/admin/command-center", icon: "🎛️", label: "Command" },
  { href: "/admin/proposals/consults", icon: "🩺", label: "Consult" },
  { href: "/admin/rx/ops", icon: "💊", label: "RX" },
  { href: "/admin/clients", icon: "👥", label: "Clients" },
  { href: "/pos", icon: "💳", label: "POS" },
] as const;

export const ADMIN_DASHBOARD_QUICK_LINKS = {
  rx: [
    { href: "/admin/rx/ops", label: "RX Ops Console", desc: "Unified requests, formulary & review" },
    { href: "/admin/rx/portal", label: "RE GEN Portal", desc: "Shoppable catalog for staff-assisted orders" },
    { href: "/staff/protocols", label: "Protocols & Quick Tools", desc: "Guides, social posts & invoice quick-send" },
    { href: "/admin/rx", label: "RX Command", desc: "Intake queue, refills & approvals" },
    { href: "/admin/flowwave", label: "FlowWave", desc: "RX workflow & patient flow" },
    { href: "/admin/rx-dispatch", label: "Dispatch", desc: "Ship GLP-1 & peptides" },
    { href: "/admin/rx/pharmacy-orders", label: "Pharmacy Orders", desc: "BoomRx order sheets" },
    { href: "/admin/rx-invoices", label: "RX Invoices", desc: "Send pay links" },
    { href: "/admin/rx/glp1-pricing", label: "RX Pricing", desc: "GLP-1 & peptide margins" },
    { href: "/admin/rx/catalog", label: "RE GEN Catalog", desc: "All peptides + vendors" },
  ],
  patients: [
    { href: "/admin/clients", label: "Clients", desc: "Profiles & RX history" },
    { href: "/admin/calendar", label: "Calendar", desc: "Today’s schedule" },
    { href: "/admin/appointments/new", label: "New Booking", desc: "Schedule visit" },
    { href: "/admin/proposals/consults/new", label: "New Consult", desc: "Screen · educate · propose" },
    { href: "/admin/proposals/new", label: "New Proposal", desc: "Packages · weight loss · peptides" },
    { href: "/admin/consents", label: "Consents", desc: "Pending signatures" },
  ],
  payments: [
    { href: "/admin/promos/bestie", label: "Bestie $100 Off", desc: "Square checkout code BESTIE100" },
    { href: "/admin/settings/payments", label: "Square Connect", desc: "Link account & download data" },
    { href: "/admin/sales/payments", label: "Square Payments", desc: "Synced transactions" },
    { href: "/admin/sales/daily-summary", label: "Daily Summary", desc: "End-of-day totals" },
    { href: "/admin/rx-ledger", label: "RX Ledger", desc: "Online RX payments" },
    { href: "/pos", label: "Open POS", desc: "In-spa checkout" },
  ],
  marketing: [
    { href: "/admin/sms", label: "Text Studio", desc: "Send-and-go SMS campaigns (Twilio A2P)" },
    { href: "/admin/marketing/post-social", label: "Post to Social", desc: "Instagram, Facebook & more" },
    { href: "/admin/email-campaigns", label: "Email Campaigns", desc: "Newsletter & promos" },
  ],
  resources: [
    { href: "/admin/command-center", label: "Command Center", desc: "Team Hub · checklist · ops board" },
    { href: "/admin/proposals/consults", label: "Consult Desk", desc: "Sales pipeline front door" },
    { href: "/admin/cheat-sheets", label: "Clinical Cheat Sheets", desc: "36 printable treatment & ops PDFs" },
    { href: "/staff/protocols", label: "Protocols & Quick Tools", desc: "Guides, social kit & invoice quick-send" },
    { href: "/admin/vendors", label: "Vendor Portals", desc: "BoomRx, Allergan, Square…" },
    { href: "/admin/settings/aftercare", label: "Aftercare Docs", desc: "Client-facing care guides" },
    { href: "/admin/pmu-brows", label: "Client Handouts", desc: "PMU forms & PDFs" },
    { href: "/admin/templates", label: "Message Templates", desc: "SMS & email copy" },
  ],
} as const;

/** Paths still reachable via URL but omitted from nav to reduce noise */
export const ADMIN_NAV_HIDDEN_PATHS = [
  "/admin/local-dominance-sprint",
  "/admin/campaign-studio",
  "/admin/content-growth-agent",
  "/admin/analytics-intelligence",
  "/admin/nurture-workflows",
  "/admin/procedures/contour-lift",
  "/admin/compliance",
  "/admin/marketing",
  "/admin/ai-concierge",
  "/admin/video-generator",
  "/admin/packages",
  "/admin/flowwave/intake",
  "/admin/rx/e2e-checklist",
];
