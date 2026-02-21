// ============================================================
// PERMISSION SYSTEM - Full Role-Based Access Control
// Owner is protected - cannot be deleted or downgraded
// ============================================================

import { UserRole, ROLE_PERMISSIONS } from '@/lib/hgos/auth';

// ============================================================
// ROLE HIERARCHY (higher number = more power)
// ============================================================

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  owner: 100,
  admin: 80,
  provider: 60,
  staff: 40,
  client: 20,
};

// ============================================================
// PROTECTED OWNER EMAIL
// ============================================================

export const OWNER_EMAILS = [
  'danielle@hellogorgeousmedspa.com',
  'hellogorgeousskin@yahoo.com',
];

// ============================================================
// PERMISSION DEFINITIONS
// ============================================================

export const PERMISSIONS = {
  // Dashboard
  'dashboard.view': ['owner', 'admin', 'provider', 'staff'],
  
  // Appointments
  'appointments.view': ['owner', 'admin', 'provider', 'staff'],
  'appointments.create': ['owner', 'admin', 'provider', 'staff'],
  'appointments.edit': ['owner', 'admin', 'provider', 'staff'],
  'appointments.delete': ['owner', 'admin'],
  'appointments.cancel': ['owner', 'admin', 'provider', 'staff'],
  'appointments.refund': ['owner', 'admin'],
  
  // Clients
  'clients.view': ['owner', 'admin', 'provider', 'staff'],
  'clients.create': ['owner', 'admin', 'staff'],
  'clients.edit': ['owner', 'admin', 'staff'],
  'clients.delete': ['owner', 'admin'],
  'clients.merge': ['owner', 'admin'],
  'clients.export': ['owner', 'admin'],
  
  // Services
  'services.view': ['owner', 'admin', 'provider', 'staff'],
  'services.create': ['owner', 'admin'],
  'services.edit': ['owner', 'admin'],
  'services.delete': ['owner', 'admin'],
  
  // Providers
  'providers.view': ['owner', 'admin', 'provider', 'staff'],
  'providers.create': ['owner', 'admin'],
  'providers.edit': ['owner', 'admin'],
  'providers.delete': ['owner'],
  
  // Staff/Users
  'users.view': ['owner', 'admin'],
  'users.create': ['owner', 'admin'],
  'users.edit': ['owner', 'admin'],
  'users.delete': ['owner'],
  'users.change_role': ['owner'],
  
  // Waitlist
  'waitlist.view': ['owner', 'admin', 'provider', 'staff'],
  'waitlist.create': ['owner', 'admin', 'staff'],
  'waitlist.edit': ['owner', 'admin', 'staff'],
  'waitlist.delete': ['owner', 'admin'],
  'waitlist.convert': ['owner', 'admin', 'staff'],
  
  // Marketing
  'marketing.view': ['owner', 'admin'],
  'marketing.create': ['owner', 'admin'],
  'marketing.edit': ['owner', 'admin'],
  'marketing.delete': ['owner', 'admin'],
  'marketing.send': ['owner', 'admin'],
  
  // Content/CMS
  'content.view': ['owner', 'admin'],
  'content.edit': ['owner', 'admin'],
  
  // Analytics
  'analytics.view': ['owner', 'admin'],
  'analytics.export': ['owner', 'admin'],
  
  // Audit Logs
  'audit.view': ['owner'],
  
  // Settings
  'settings.view': ['owner', 'admin'],
  'settings.edit': ['owner'],
  'settings.business': ['owner'],
  
  // POS
  'pos.access': ['owner', 'admin', 'provider', 'staff'],
  'pos.refund': ['owner', 'admin'],
  'pos.discount': ['owner', 'admin', 'provider'],
  
  // Charts/Clinical
  'charts.view': ['owner', 'admin', 'provider'],
  'charts.create': ['owner', 'admin', 'provider'],
  'charts.sign': ['owner', 'provider'],
  
  // Inventory
  'inventory.view': ['owner', 'admin', 'provider', 'staff'],
  'inventory.manage': ['owner', 'admin'],
  
  // Reports
  'reports.view': ['owner', 'admin'],
  'reports.export': ['owner', 'admin'],
  'reports.financial': ['owner'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

// ============================================================
// PERMISSION CHECK FUNCTIONS
// ============================================================

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(role: UserRole, permission: Permission): boolean {
  if (role === 'owner') return true; // Owner has all permissions
  
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles?.includes(role) || false;
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: { role: UserRole } | null, permission: Permission): boolean {
  if (!user) return false;
  return roleHasPermission(user.role, permission);
}

/**
 * Check if a user can perform an action on a resource
 */
export function canPerformAction(
  user: { role: UserRole; id?: string } | null,
  action: Permission,
  resource?: { ownerId?: string; createdBy?: string }
): boolean {
  if (!user) return false;
  if (user.role === 'owner') return true;
  
  // Check if user has the permission
  if (!roleHasPermission(user.role, action)) return false;
  
  // For "own" actions, check ownership
  if (action.includes('.own') && resource) {
    return resource.ownerId === user.id || resource.createdBy === user.id;
  }
  
  return true;
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  if (role === 'owner') {
    return Object.keys(PERMISSIONS) as Permission[];
  }
  
  return (Object.entries(PERMISSIONS) as [Permission, UserRole[]][])
    .filter(([, roles]) => roles.includes(role))
    .map(([permission]) => permission);
}

// ============================================================
// OWNER PROTECTION
// ============================================================

/**
 * Check if email belongs to protected owner account
 */
export function isProtectedOwner(email: string): boolean {
  return OWNER_EMAILS.some(e => e.toLowerCase() === email.toLowerCase());
}

/**
 * Check if user can modify another user's role
 */
export function canModifyUserRole(
  actor: { role: UserRole; email?: string } | null,
  targetUser: { role: UserRole; email?: string }
): { allowed: boolean; reason?: string } {
  if (!actor) {
    return { allowed: false, reason: 'Not authenticated' };
  }
  
  // Only owner can change roles
  if (actor.role !== 'owner') {
    return { allowed: false, reason: 'Only the Owner can modify user roles' };
  }
  
  // Cannot modify a protected owner account
  if (targetUser.email && isProtectedOwner(targetUser.email)) {
    return { allowed: false, reason: 'Cannot modify the protected Owner account' };
  }
  
  return { allowed: true };
}

/**
 * Check if user can delete another user
 */
export function canDeleteUser(
  actor: { role: UserRole; email?: string } | null,
  targetUser: { role: UserRole; email?: string; id?: string }
): { allowed: boolean; reason?: string } {
  if (!actor) {
    return { allowed: false, reason: 'Not authenticated' };
  }
  
  // Only owner can delete users
  if (actor.role !== 'owner') {
    return { allowed: false, reason: 'Only the Owner can delete users' };
  }
  
  // Cannot delete a protected owner account
  if (targetUser.email && isProtectedOwner(targetUser.email)) {
    return { allowed: false, reason: 'Cannot delete the protected Owner account' };
  }
  
  // Cannot delete self
  if (actor.email && targetUser.email && actor.email.toLowerCase() === targetUser.email.toLowerCase()) {
    return { allowed: false, reason: 'Cannot delete your own account' };
  }
  
  return { allowed: true };
}

/**
 * Check if a role can be changed to another role
 */
export function canChangeToRole(
  actor: { role: UserRole } | null,
  currentRole: UserRole,
  newRole: UserRole
): { allowed: boolean; reason?: string } {
  if (!actor) {
    return { allowed: false, reason: 'Not authenticated' };
  }
  
  // Only owner can change roles
  if (actor.role !== 'owner') {
    return { allowed: false, reason: 'Only the Owner can change roles' };
  }
  
  // Cannot promote to owner
  if (newRole === 'owner') {
    return { allowed: false, reason: 'Cannot promote a user to Owner role' };
  }
  
  // Cannot demote from owner
  if (currentRole === 'owner') {
    return { allowed: false, reason: 'Cannot change the Owner role' };
  }
  
  return { allowed: true };
}

// ============================================================
// ROUTE PROTECTION
// ============================================================

export const PROTECTED_ROUTES: Record<string, Permission[]> = {
  '/admin': ['dashboard.view'],
  '/admin/clients': ['clients.view'],
  '/admin/clients/new': ['clients.create'],
  '/admin/appointments': ['appointments.view'],
  '/admin/calendar': ['appointments.view'],
  '/admin/services': ['services.view'],
  '/admin/waitlist': ['waitlist.view'],
  '/admin/marketing': ['marketing.view'],
  '/admin/analytics': ['analytics.view'],
  '/admin/audit-logs': ['audit.view'],
  '/admin/content/site': ['content.edit'],
  '/admin/settings': ['settings.view'],
  '/admin/users': ['users.view'],
  '/admin/staff': ['users.view'],
  '/admin/reports': ['reports.view'],
  '/admin/inventory': ['inventory.view'],
  '/pos': ['pos.access'],
};

/**
 * Check if user can access a route
 */
export function canAccessRoute(user: { role: UserRole } | null, path: string): boolean {
  if (!user) return false;
  if (user.role === 'owner') return true;
  
  // Find matching route (exact or parent)
  const matchingRoute = Object.keys(PROTECTED_ROUTES)
    .filter(route => path.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];
  
  if (!matchingRoute) {
    // No specific protection, allow
    return true;
  }
  
  const requiredPermissions = PROTECTED_ROUTES[matchingRoute];
  return requiredPermissions.some(perm => roleHasPermission(user.role, perm));
}

// ============================================================
// API PERMISSION MIDDLEWARE HELPER
// ============================================================

/**
 * Create a permission check for API routes
 */
export function requirePermission(permission: Permission) {
  return (user: { role: UserRole } | null): { authorized: boolean; error?: string } => {
    if (!user) {
      return { authorized: false, error: 'Authentication required' };
    }
    
    if (!roleHasPermission(user.role, permission)) {
      return { authorized: false, error: `Permission denied: ${permission}` };
    }
    
    return { authorized: true };
  };
}

/**
 * Create a permission check requiring any of the given permissions
 */
export function requireAnyPermission(...permissions: Permission[]) {
  return (user: { role: UserRole } | null): { authorized: boolean; error?: string } => {
    if (!user) {
      return { authorized: false, error: 'Authentication required' };
    }
    
    const hasAny = permissions.some(perm => roleHasPermission(user.role, perm));
    
    if (!hasAny) {
      return { authorized: false, error: `Permission denied: requires one of ${permissions.join(', ')}` };
    }
    
    return { authorized: true };
  };
}

/**
 * Create a permission check requiring all of the given permissions
 */
export function requireAllPermissions(...permissions: Permission[]) {
  return (user: { role: UserRole } | null): { authorized: boolean; error?: string } => {
    if (!user) {
      return { authorized: false, error: 'Authentication required' };
    }
    
    const hasAll = permissions.every(perm => roleHasPermission(user.role, perm));
    
    if (!hasAll) {
      const missing = permissions.filter(perm => !roleHasPermission(user.role, perm));
      return { authorized: false, error: `Missing permissions: ${missing.join(', ')}` };
    }
    
    return { authorized: true };
  };
}
