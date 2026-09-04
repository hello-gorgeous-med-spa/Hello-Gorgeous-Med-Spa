/**
 * REGEN RX Role-Based Permissions
 * 
 * Roles:
 * - owner: Danielle - full access except prescribing
 * - prescriber: Ryan - clinical review, prescriptions, patient care
 * - admin: Damara - operations, payments, support (no Rx)
 * - support: Future support staff - limited view access
 */

export type StaffRole = 'owner' | 'prescriber' | 'admin' | 'support';

export interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  permissions: Permission[];
}

export type Permission =
  // Patient management
  | 'patients:view'
  | 'patients:edit'
  | 'patients:create'
  // Intake management
  | 'intakes:view'
  | 'intakes:review'
  // Prescriptions (clinical)
  | 'prescriptions:view'
  | 'prescriptions:approve'
  | 'prescriptions:sign'
  // Orders
  | 'orders:view'
  | 'orders:create'
  | 'orders:update'
  | 'orders:cancel'
  // Payments
  | 'payments:view'
  | 'payments:create'
  | 'payments:refund'
  // Catalog
  | 'catalog:view'
  | 'catalog:approve'
  // Messages
  | 'messages:view'
  | 'messages:reply'
  // Reports / Financials
  | 'reports:view'
  | 'financials:view'
  // Admin
  | 'staff:manage'
  | 'settings:manage';

/**
 * Default permissions per role
 */
export const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  owner: [
    // Patients
    'patients:view', 'patients:edit', 'patients:create',
    // Intakes
    'intakes:view', 'intakes:review',
    // Prescriptions (view only - cannot sign)
    'prescriptions:view',
    // Orders
    'orders:view', 'orders:create', 'orders:update', 'orders:cancel',
    // Payments
    'payments:view', 'payments:create', 'payments:refund',
    // Catalog
    'catalog:view', 'catalog:approve',
    // Messages
    'messages:view', 'messages:reply',
    // Reports
    'reports:view', 'financials:view',
    // Admin
    'staff:manage', 'settings:manage',
  ],
  
  prescriber: [
    // Patients
    'patients:view', 'patients:edit',
    // Intakes
    'intakes:view', 'intakes:review',
    // Prescriptions (FULL clinical access)
    'prescriptions:view', 'prescriptions:approve', 'prescriptions:sign',
    // Orders (view + create from Rx)
    'orders:view', 'orders:create',
    // Catalog (view only)
    'catalog:view',
    // Messages
    'messages:view', 'messages:reply',
    // Reports (clinical only)
    'reports:view',
  ],
  
  admin: [
    // Patients
    'patients:view', 'patients:edit', 'patients:create',
    // Intakes
    'intakes:view',
    // Prescriptions (view status only)
    'prescriptions:view',
    // Orders
    'orders:view', 'orders:update',
    // Payments
    'payments:view', 'payments:create', 'payments:refund',
    // Catalog
    'catalog:view',
    // Messages
    'messages:view', 'messages:reply',
    // Reports
    'reports:view',
  ],
  
  support: [
    // Patients (view only)
    'patients:view',
    // Messages
    'messages:view', 'messages:reply',
    // Orders (view only)
    'orders:view',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: StaffRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Check if a role has ALL of the specified permissions
 */
export function hasAllPermissions(role: StaffRole, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}

/**
 * Check if a role has ANY of the specified permissions
 */
export function hasAnyPermission(role: StaffRole, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

/**
 * Navigation items visible per role
 */
export interface NavItem {
  href: string;
  label: string;
  icon: string;
  requiredPermissions: Permission[];
}

export const OPS_NAV_ITEMS: NavItem[] = [
  { 
    href: '/regen/ops', 
    label: 'Dashboard', 
    icon: '📊',
    requiredPermissions: [], // Everyone can see dashboard
  },
  { 
    href: '/regen/ops/patients', 
    label: 'Patients', 
    icon: '👥',
    requiredPermissions: ['patients:view'],
  },
  { 
    href: '/regen/ops/intake', 
    label: 'Intake Queue', 
    icon: '📋',
    requiredPermissions: ['intakes:view'],
  },
  { 
    href: '/regen/ops/prescriptions', 
    label: 'Prescriptions', 
    icon: '💊',
    requiredPermissions: ['prescriptions:view'],
  },
  { 
    href: '/regen/ops/orders', 
    label: 'Orders', 
    icon: '📦',
    requiredPermissions: ['orders:view'],
  },
  { 
    href: '/regen/ops/catalog', 
    label: 'Catalog', 
    icon: '🔬',
    requiredPermissions: ['catalog:view'],
  },
  { 
    href: '/regen/ops/messages', 
    label: 'Messages', 
    icon: '💬',
    requiredPermissions: ['messages:view'],
  },
  { 
    href: '/regen/ops/payments', 
    label: 'Payments', 
    icon: '💳',
    requiredPermissions: ['payments:view'],
  },
  { 
    href: '/regen/ops/reports', 
    label: 'Reports', 
    icon: '📈',
    requiredPermissions: ['reports:view'],
  },
];

/**
 * Get visible nav items for a role
 */
export function getNavItemsForRole(role: StaffRole): NavItem[] {
  return OPS_NAV_ITEMS.filter(item => 
    item.requiredPermissions.length === 0 || 
    hasAnyPermission(role, item.requiredPermissions)
  );
}

/**
 * Staff members (will be replaced with Supabase lookup)
 */
export const STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'danielle',
    email: 'provider@hellogorgeousmedspa.com',
    name: 'Danielle Alcala',
    role: 'owner',
    permissions: ROLE_PERMISSIONS.owner,
  },
  {
    id: 'ryan',
    email: 'ryan@hellogorgeousmedspa.com',
    name: 'Ryan Kent, FNP-BC',
    role: 'prescriber',
    permissions: ROLE_PERMISSIONS.prescriber,
  },
  {
    id: 'damara',
    email: 'damara@tryregenrx.com',
    name: 'Damara Lindabald',
    role: 'admin',
    permissions: ROLE_PERMISSIONS.admin,
  },
];

/**
 * Get staff member by email
 */
export function getStaffByEmail(email: string): StaffMember | undefined {
  return STAFF_MEMBERS.find(s => s.email.toLowerCase() === email.toLowerCase());
}
