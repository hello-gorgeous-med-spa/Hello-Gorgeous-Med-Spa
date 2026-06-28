/**
 * Admin portal navigation — RX-first medical portal layout.
 * Primary: prescriptions, patients, payments, marketing (SMS + social).
 * Collapsed: spa ops extras. Hidden from nav: AI experiments, lead sprints, etc.
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

export const ADMIN_PORTAL_TAGLINE = "RX · patients · payments";

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    section: "Home",
    items: [{ href: "/admin", label: "Dashboard", icon: "📊" }],
  },
  {
    section: "Prescriptions & RX",
    items: [
      { href: "/admin/rx", label: "RX Command", icon: "🎯" },
      { href: "/admin/flowwave", label: "FlowWave", icon: "🌊" },
      { href: "/admin/rx-dispatch", label: "Dispatch", icon: "📤" },
      { href: "/admin/rx/pharmacy-orders", label: "Pharmacy Orders", icon: "🧪" },
      { href: "/admin/rx-invoices", label: "RX Invoices", icon: "💊" },
      { href: "/admin/rx/glp1-pricing", label: "RX Pricing", icon: "💲" },
      { href: "/admin/rx/e2e-checklist", label: "E2E Checklist", icon: "✅" },
      { href: "/admin/rx-ledger", label: "Payment Ledger", icon: "📒" },
      { href: "/admin/rx-messages", label: "Patient Messages", icon: "💬" },
      { href: "/admin/rx/clinic-sale", label: "Clinic Sale", icon: "🏥" },
      { href: "/admin/rx/clinic-reports", label: "Clinic Reports", icon: "📋" },
    ],
  },
  {
    section: "Patients & Schedule",
    items: [
      { href: "/admin/clients", label: "Clients", icon: "👥" },
      { href: "/admin/calendar", label: "Calendar", icon: "🗓" },
      { href: "/admin/appointments", label: "Appointments", icon: "📅" },
      { href: "/admin/scan", label: "Scan Client", icon: "📷" },
    ],
  },
  {
    section: "Payments & Square",
    items: [
      { href: "/admin/settings/payments", label: "Square Connect", icon: "🔗" },
      { href: "/admin/sales/payments", label: "Square Payments", icon: "💳" },
      { href: "/admin/sales/daily-summary", label: "Daily Summary", icon: "📈" },
      { href: "/admin/sales", label: "Sales Ledger", icon: "🧾" },
    ],
  },
  {
    section: "Marketing",
    items: [
      { href: "/admin/sms", label: "SMS Marketing", icon: "📱" },
      { href: "/admin/marketing/post-social", label: "Post to Social", icon: "📲" },
      { href: "/admin/email-campaigns", label: "Email Campaigns", icon: "📧" },
    ],
  },
  {
    section: "Forms & Documents",
    items: [
      { href: "/admin/consents", label: "Consents", icon: "✅" },
      { href: "/admin/settings/consent-forms", label: "Consent Forms", icon: "📝" },
      { href: "/admin/settings/pretreatment", label: "Pre-Treatment", icon: "📋" },
      { href: "/admin/settings/aftercare", label: "Aftercare", icon: "📄" },
      { href: "/admin/templates", label: "Message Templates", icon: "💬" },
      { href: "/admin/pmu-brows", label: "PMU & Client Handouts", icon: "💗" },
    ],
  },
  {
    section: "Vendors",
    items: [{ href: "/admin/vendors", label: "Vendor Portals", icon: "🏢" }],
  },
  {
    section: "Spa operations",
    collapsed: true,
    items: [
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
    items: [{ href: "/admin/settings", label: "Settings", icon: "⚙️" }],
  },
];

export const ADMIN_NAV_FLAT: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap((g) => g.items);

export const ADMIN_MOBILE_BOTTOM_NAV = [
  { href: "/admin", icon: "📊", label: "Home" },
  { href: "/admin/rx", icon: "💊", label: "RX" },
  { href: "/admin/flowwave", icon: "🌊", label: "Flow" },
  { href: "/admin/clients", icon: "👥", label: "Clients" },
  { href: "/pos", icon: "💳", label: "POS" },
] as const;

export const ADMIN_DASHBOARD_QUICK_LINKS = {
  rx: [
    { href: "/admin/rx", label: "RX Command", desc: "Intake queue, refills & approvals" },
    { href: "/admin/flowwave", label: "FlowWave", desc: "RX workflow & patient flow" },
    { href: "/admin/rx-dispatch", label: "Dispatch", desc: "Ship GLP-1 & peptides" },
    { href: "/admin/rx/pharmacy-orders", label: "Pharmacy Orders", desc: "BoomRx order sheets" },
    { href: "/admin/rx-invoices", label: "RX Invoices", desc: "Send pay links" },
    { href: "/admin/rx/glp1-pricing", label: "RX Pricing", desc: "Margins & wholesale" },
  ],
  patients: [
    { href: "/admin/clients", label: "Clients", desc: "Profiles & RX history" },
    { href: "/admin/calendar", label: "Calendar", desc: "Today’s schedule" },
    { href: "/admin/appointments/new", label: "New Booking", desc: "Schedule visit" },
    { href: "/admin/consents", label: "Consents", desc: "Pending signatures" },
  ],
  payments: [
    { href: "/admin/settings/payments", label: "Square Connect", desc: "Link account & download data" },
    { href: "/admin/sales/payments", label: "Square Payments", desc: "Synced transactions" },
    { href: "/admin/sales/daily-summary", label: "Daily Summary", desc: "End-of-day totals" },
    { href: "/admin/rx-ledger", label: "RX Ledger", desc: "Online RX payments" },
    { href: "/pos", label: "Open POS", desc: "In-spa checkout" },
  ],
  marketing: [
    { href: "/admin/sms", label: "SMS Marketing", desc: "Text campaigns & blasts" },
    { href: "/admin/marketing/post-social", label: "Post to Social", desc: "Instagram, Facebook & more" },
    { href: "/admin/email-campaigns", label: "Email Campaigns", desc: "Newsletter & promos" },
  ],
  resources: [
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
  "/admin/proposals",
  "/admin/packages",
  "/admin/flowwave/intake",
];
