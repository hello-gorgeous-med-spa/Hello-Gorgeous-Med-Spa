// ============================================================
// API AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// Extracts user from session and enforces permissions
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/lib/hgos/auth';
import { 
  Permission, 
  roleHasPermission, 
  isProtectedOwner,
  canDeleteUser,
  canModifyUserRole 
} from '@/lib/permissions';

// ============================================================
// TYPES
// ============================================================

export interface ApiUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthResult {
  user: ApiUser | null;
  error?: string;
}

export interface PermissionResult {
  authorized: boolean;
  error?: string;
  status?: number;
}

// ============================================================
// SESSION EXTRACTION
// ============================================================

/**
 * Extract user from request session cookie
 */
export function getUserFromRequest(request: NextRequest): ApiUser | null {
  try {
    const sessionCookie = request.cookies.get('hgos_session');
    
    if (!sessionCookie?.value) {
      return null;
    }
    
    const decoded = decodeURIComponent(sessionCookie.value);
    const session = JSON.parse(decoded);
    
    if (!session.userId || !session.role) {
      return null;
    }
    
    return {
      id: session.userId,
      email: session.email || '',
      role: session.role as UserRole,
    };
  } catch {
    return null;
  }
}

/**
 * Require authentication - returns user or error response
 */
export function requireAuth(request: NextRequest): AuthResult {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return { user: null, error: 'Authentication required' };
  }
  
  return { user };
}

// ============================================================
// PERMISSION CHECKS
// ============================================================

/**
 * Check if user has a specific permission
 */
export function checkPermission(
  user: ApiUser | null,
  permission: Permission
): PermissionResult {
  if (!user) {
    return { authorized: false, error: 'Authentication required', status: 401 };
  }
  
  if (!roleHasPermission(user.role, permission)) {
    return { authorized: false, error: `Permission denied: ${permission}`, status: 403 };
  }
  
  return { authorized: true };
}

/**
 * Check if user has any of the given permissions
 */
export function checkAnyPermission(
  user: ApiUser | null,
  permissions: Permission[]
): PermissionResult {
  if (!user) {
    return { authorized: false, error: 'Authentication required', status: 401 };
  }
  
  const hasAny = permissions.some(perm => roleHasPermission(user.role, perm));
  
  if (!hasAny) {
    return { 
      authorized: false, 
      error: `Permission denied: requires one of ${permissions.join(', ')}`, 
      status: 403 
    };
  }
  
  return { authorized: true };
}

/**
 * Check if user has all of the given permissions
 */
export function checkAllPermissions(
  user: ApiUser | null,
  permissions: Permission[]
): PermissionResult {
  if (!user) {
    return { authorized: false, error: 'Authentication required', status: 401 };
  }
  
  for (const perm of permissions) {
    if (!roleHasPermission(user.role, perm)) {
      return { authorized: false, error: `Permission denied: ${perm}`, status: 403 };
    }
  }
  
  return { authorized: true };
}

/**
 * Check if user is owner
 */
export function requireOwner(user: ApiUser | null): PermissionResult {
  if (!user) {
    return { authorized: false, error: 'Authentication required', status: 401 };
  }
  
  if (user.role !== 'owner') {
    return { authorized: false, error: 'Owner access required', status: 403 };
  }
  
  return { authorized: true };
}

// ============================================================
// OWNER PROTECTION CHECKS
// ============================================================

/**
 * Check if a user modification is allowed (protects owner account)
 */
export function checkUserModification(
  actor: ApiUser | null,
  targetEmail: string,
  action: 'delete' | 'role_change'
): PermissionResult {
  if (!actor) {
    return { authorized: false, error: 'Authentication required', status: 401 };
  }
  
  // Check if target is protected owner
  if (isProtectedOwner(targetEmail)) {
    return { 
      authorized: false, 
      error: 'Cannot modify protected Owner account', 
      status: 403 
    };
  }
  
  if (action === 'delete') {
    const result = canDeleteUser(actor, { email: targetEmail, role: 'admin' });
    if (!result.allowed) {
      return { authorized: false, error: result.reason, status: 403 };
    }
  }
  
  if (action === 'role_change') {
    const result = canModifyUserRole(actor, { email: targetEmail, role: 'admin' });
    if (!result.allowed) {
      return { authorized: false, error: result.reason, status: 403 };
    }
  }
  
  return { authorized: true };
}

// ============================================================
// RESPONSE HELPERS
// ============================================================

/**
 * Create unauthorized response
 */
export function unauthorizedResponse(message = 'Authentication required'): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Create forbidden response
 */
export function forbiddenResponse(message = 'Permission denied'): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Create permission error response based on check result
 */
export function permissionErrorResponse(result: PermissionResult): NextResponse {
  return NextResponse.json(
    { error: result.error || 'Permission denied' },
    { status: result.status || 403 }
  );
}

// ============================================================
// COMBINED AUTH + PERMISSION MIDDLEWARE
// ============================================================

/**
 * Middleware that requires authentication and specific permission
 * Returns user if authorized, or error response
 */
export function withPermission(
  request: NextRequest,
  permission: Permission
): { user: ApiUser } | { error: NextResponse } {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return { error: unauthorizedResponse() };
  }
  
  const check = checkPermission(user, permission);
  
  if (!check.authorized) {
    return { error: permissionErrorResponse(check) };
  }
  
  return { user };
}

/**
 * Middleware that requires owner role
 */
export function withOwner(
  request: NextRequest
): { user: ApiUser } | { error: NextResponse } {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return { error: unauthorizedResponse() };
  }
  
  if (user.role !== 'owner') {
    return { error: forbiddenResponse('Owner access required') };
  }
  
  return { user };
}

/**
 * Middleware that requires any of the given permissions
 */
export function withAnyPermission(
  request: NextRequest,
  permissions: Permission[]
): { user: ApiUser } | { error: NextResponse } {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return { error: unauthorizedResponse() };
  }
  
  const check = checkAnyPermission(user, permissions);
  
  if (!check.authorized) {
    return { error: permissionErrorResponse(check) };
  }
  
  return { user };
}
