export const OPS_STAFF = [
  { id: 'danielle', name: 'Danielle Alcala', short: 'Danielle', role: 'Owner', email: 'provider@hellogorgeousmedspa.com', color: 'bg-amber-500' },
  { id: 'ryan', name: 'Ryan Kent, FNP-BC', short: 'Ryan', role: 'Prescriber', email: 'ryan@hellogorgeousmedspa.com', color: 'bg-pink-500' },
  { id: 'damara', name: 'Damara', short: 'Damara', role: 'Operations', email: 'damara@hellogorgeousmedspa.com', color: 'bg-teal-500' },
] as const;

export type OpsStaffId = (typeof OPS_STAFF)[number]['id'];

export function getOpsStaff(id?: string | null) {
  return OPS_STAFF.find((s) => s.id === id) || null;
}

export const OPS_NAV = [
  { href: '/ops', label: 'Today' },
  { href: '/ops/patients', label: 'Patients' },
  { href: '/ops/orders', label: 'Orders' },
  { href: '/ops/labs', label: 'Labs' },
  { href: '/ops/calculator', label: 'Calculator' },
] as const;

export const OPS_NAV_GROUPS = [
  {
    section: 'Queue',
    items: [
      { href: '/ops/analytics', label: 'Dashboard', icon: '▣' },
      { href: '/ops', label: 'Today', icon: '◉' },
      { href: '/ops/patients', label: 'Patients', icon: '◎' },
      { href: '/ops/messages', label: 'Messages', icon: '✉' },
    ],
  },
  {
    section: 'Fulfillment',
    items: [
      { href: '/ops/orders', label: 'Orders', icon: '▣' },
      { href: '/ops/labs', label: 'Labs', icon: '⚗' },
      { href: '/ops/catalog', label: 'Catalog', icon: '☰' },
    ],
  },
  {
    section: 'Money',
    items: [
      { href: '/ops/payments', label: 'Payments', icon: '$' },
      { href: '/ops/reports', label: 'Reports', icon: '▦' },
    ],
  },
  {
    section: 'Tools',
    items: [
      { href: '/ops/calculator', label: 'Calculator', icon: '∑' },
      { href: '/ops/reconstitution', label: 'Reconstitution', icon: '💧' },
    ],
  },
] as const;
