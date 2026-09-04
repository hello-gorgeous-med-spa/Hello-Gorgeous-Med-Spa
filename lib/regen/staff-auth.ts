/**
 * REGEN RX Staff Authentication
 * 
 * Uses Supabase auth with role-based permissions.
 * Staff members are pre-registered in the regen_staff table.
 */

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { type StaffRole, ROLE_PERMISSIONS, type Permission } from './permissions';

export interface StaffSession {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  permissions: Permission[];
}

/**
 * Get current staff session from Supabase auth
 */
export async function getStaffSession(): Promise<StaffSession | null> {
  try {
    const supabase = createServerSupabaseClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return null;

    // Look up staff record
    const { data: staff } = await supabase
      .from('regen_staff')
      .select('id, email, name, role, can_approve_rx, can_process_refunds, can_view_financials, can_manage_products')
      .eq('email', user.email.toLowerCase())
      .eq('active', true)
      .single();

    if (!staff) return null;

    return {
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: staff.role as StaffRole,
      permissions: ROLE_PERMISSIONS[staff.role as StaffRole] || [],
    };
  } catch (error) {
    console.error('Staff session error:', error);
    return null;
  }
}

/**
 * Check if current user is authenticated staff
 */
export async function isStaffAuthenticated(): Promise<boolean> {
  const session = await getStaffSession();
  return session !== null;
}

/**
 * Check if current staff has a specific permission
 */
export async function staffHasPermission(permission: Permission): Promise<boolean> {
  const session = await getStaffSession();
  if (!session) return false;
  return session.permissions.includes(permission);
}

/**
 * Verify staff login credentials and return session
 */
export async function verifyStaffLogin(email: string, password: string): Promise<StaffSession | null> {
  try {
    const supabase = createServerSupabaseClient();
    
    // Attempt sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.error('Staff login failed:', error?.message);
      return null;
    }

    // Get staff record
    const { data: staff } = await supabase
      .from('regen_staff')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('active', true)
      .single();

    if (!staff) {
      // User exists in auth but not in staff table
      await supabase.auth.signOut();
      return null;
    }

    // Update last login
    await supabase
      .from('regen_staff')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', staff.id);

    return {
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: staff.role as StaffRole,
      permissions: ROLE_PERMISSIONS[staff.role as StaffRole] || [],
    };
  } catch (error) {
    console.error('Staff verify error:', error);
    return null;
  }
}

/**
 * Sign out staff
 */
export async function signOutStaff(): Promise<void> {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
}
