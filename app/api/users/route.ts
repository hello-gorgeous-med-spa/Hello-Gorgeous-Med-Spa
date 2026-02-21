// ============================================================
// USERS API - Full CRUD with Owner Protection
// Only Owner can manage roles and delete users
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { 
  getUserFromRequest, 
  withPermission, 
  withOwner,
  forbiddenResponse,
  unauthorizedResponse 
} from '@/lib/api-auth';
import { isProtectedOwner } from '@/lib/permissions';
import { logAuditEvent } from '@/lib/audit/log';

export const maxDuration = 30;

// Default users if DB unavailable
const DEFAULT_USERS = [
  {
    id: 'owner-001',
    email: 'danielle@hellogorgeousmedspa.com',
    first_name: 'Danielle',
    last_name: 'Glazier-Alcala',
    role: 'owner',
    is_protected: true,
    is_active: true,
    phone: '630-636-6193',
    created_at: '2024-01-01',
  },
];

// Helper to ensure tables exist
async function ensureTablesExist(supabase: any) {
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    
    if (error?.code === '42P01') {
      // Table doesn't exist, create it
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            first_name TEXT,
            last_name TEXT,
            role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'admin', 'provider', 'staff', 'client', 'readonly')),
            phone TEXT,
            avatar_url TEXT,
            provider_id UUID,
            is_protected BOOLEAN DEFAULT FALSE,
            is_active BOOLEAN DEFAULT TRUE,
            requires_2fa BOOLEAN DEFAULT FALSE,
            two_factor_enabled BOOLEAN DEFAULT FALSE,
            last_login_at TIMESTAMPTZ,
            login_count INTEGER DEFAULT 0,
            failed_login_attempts INTEGER DEFAULT 0,
            locked_until TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
          CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
          
          ALTER TABLE users ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY IF NOT EXISTS users_all_policy ON users FOR ALL USING (true);
        `,
      });
      
      // Seed owner
      await supabase.from('users').upsert(DEFAULT_USERS[0], { onConflict: 'email' });
    }
  } catch (e) {
    console.error('Error ensuring users table:', e);
  }
}

// ============================================================
// GET - List all users
// ============================================================
export async function GET(request: NextRequest) {
  const auth = withPermission(request, 'users.view');
  if ('error' in auth) return auth.error;
  
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ users: DEFAULT_USERS });
  }
  
  try {
    await ensureTablesExist(supabase);
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const active = searchParams.get('active');
    
    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (role) {
      query = query.eq('role', role);
    }
    
    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ users: DEFAULT_USERS });
    }
    
    return NextResponse.json({ users: data || DEFAULT_USERS });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ users: DEFAULT_USERS });
  }
}

// ============================================================
// POST - Create new user (Owner/Admin only)
// ============================================================
export async function POST(request: NextRequest) {
  const auth = withPermission(request, 'users.create');
  if ('error' in auth) return auth.error;
  
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }
  
  try {
    await ensureTablesExist(supabase);
    
    const body = await request.json();
    const { email, first_name, last_name, role, phone, provider_id } = body;
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // Cannot create owner role
    if (role === 'owner') {
      return forbiddenResponse('Cannot create a user with Owner role');
    }
    
    // Only owner can create admins
    if (role === 'admin' && auth.user.role !== 'owner') {
      return forbiddenResponse('Only Owner can create Admin users');
    }
    
    const newUser = {
      email: email.toLowerCase(),
      first_name,
      last_name,
      role: role || 'staff',
      phone,
      provider_id,
      is_protected: false,
      is_active: true,
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
      console.error('Error creating user:', error);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
    
    // Audit log
    logAuditEvent({
      action: 'user.created',
      userId: auth.user.id,
      targetId: data.id,
      targetType: 'user',
      newValues: { email, role: newUser.role },
      request,
    }).catch(() => {});
    
    return NextResponse.json({ user: data, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// ============================================================
// PUT - Update user
// ============================================================
export async function PUT(request: NextRequest) {
  const auth = withPermission(request, 'users.edit');
  if ('error' in auth) return auth.error;
  
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    const { id, email, first_name, last_name, role, phone, is_active, provider_id } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Get current user data
    const { data: currentUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check protected owner
    if (currentUser.is_protected || isProtectedOwner(currentUser.email)) {
      // Only allow limited updates to protected owner
      if (role && role !== currentUser.role) {
        return forbiddenResponse('Cannot change role of protected Owner');
      }
      if (is_active === false) {
        return forbiddenResponse('Cannot deactivate protected Owner');
      }
    }
    
    // Role change requires owner
    if (role && role !== currentUser.role) {
      if (auth.user.role !== 'owner') {
        return forbiddenResponse('Only Owner can change user roles');
      }
      if (role === 'owner') {
        return forbiddenResponse('Cannot promote user to Owner role');
      }
    }
    
    const updates: any = { updated_at: new Date().toISOString() };
    
    if (first_name !== undefined) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;
    if (phone !== undefined) updates.phone = phone;
    if (provider_id !== undefined) updates.provider_id = provider_id;
    
    // Only owner can change these
    if (auth.user.role === 'owner') {
      if (role !== undefined) updates.role = role;
      if (is_active !== undefined) updates.is_active = is_active;
    }
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
    
    // Audit log
    logAuditEvent({
      action: 'user.updated',
      userId: auth.user.id,
      targetId: id,
      targetType: 'user',
      oldValues: currentUser,
      newValues: updates,
      request,
    }).catch(() => {});
    
    return NextResponse.json({ user: data, success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// ============================================================
// DELETE - Delete user (Owner only, soft delete)
// ============================================================
export async function DELETE(request: NextRequest) {
  const auth = withOwner(request);
  if ('error' in auth) return auth.error;
  
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Get user to check protection
    const { data: targetUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Cannot delete protected owner
    if (targetUser.is_protected || isProtectedOwner(targetUser.email)) {
      return forbiddenResponse('Cannot delete protected Owner account');
    }
    
    // Cannot delete self
    if (targetUser.id === auth.user.id || targetUser.email === auth.user.email) {
      return forbiddenResponse('Cannot delete your own account');
    }
    
    if (permanent) {
      // Hard delete
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
      }
    } else {
      // Soft delete - deactivate
      const { error } = await supabase
        .from('users')
        .update({ 
          is_active: false, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error deactivating user:', error);
        return NextResponse.json({ error: 'Failed to deactivate user' }, { status: 500 });
      }
    }
    
    // Audit log
    logAuditEvent({
      action: permanent ? 'user.deleted' : 'user.deactivated',
      userId: auth.user.id,
      targetId: id,
      targetType: 'user',
      oldValues: targetUser,
      request,
    }).catch(() => {});
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

// ============================================================
// PATCH - Special user actions
// ============================================================
export async function PATCH(request: NextRequest) {
  const user = getUserFromRequest(request);
  
  if (!user) {
    return unauthorizedResponse();
  }
  
  const supabase = createServerSupabaseClient();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  }
  
  try {
    const body = await request.json();
    const { id, action, ...data } = body;
    
    if (!id || !action) {
      return NextResponse.json({ error: 'User ID and action required' }, { status: 400 });
    }
    
    // Get target user
    const { data: targetUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    switch (action) {
      case 'change_role': {
        // Owner only
        if (user.role !== 'owner') {
          return forbiddenResponse('Only Owner can change roles');
        }
        
        if (targetUser.is_protected || isProtectedOwner(targetUser.email)) {
          return forbiddenResponse('Cannot change role of protected Owner');
        }
        
        if (data.role === 'owner') {
          return forbiddenResponse('Cannot promote to Owner role');
        }
        
        const { error } = await supabase
          .from('users')
          .update({ role: data.role, updated_at: new Date().toISOString() })
          .eq('id', id);
        
        if (error) throw error;
        
        logAuditEvent({
          action: 'user.role_changed',
          userId: user.id,
          targetId: id,
          targetType: 'user',
          oldValues: { role: targetUser.role },
          newValues: { role: data.role },
          request,
        }).catch(() => {});
        
        break;
      }
      
      case 'reset_2fa': {
        // Owner only
        if (user.role !== 'owner') {
          return forbiddenResponse('Only Owner can reset 2FA');
        }
        
        const { error } = await supabase
          .from('users')
          .update({ 
            two_factor_enabled: false, 
            two_factor_secret: null,
            updated_at: new Date().toISOString() 
          })
          .eq('id', id);
        
        if (error) throw error;
        
        // Delete recovery codes
        await supabase
          .from('user_2fa_recovery_codes')
          .delete()
          .eq('user_id', id);
        
        logAuditEvent({
          action: 'user.2fa_reset',
          userId: user.id,
          targetId: id,
          targetType: 'user',
          request,
        }).catch(() => {});
        
        break;
      }
      
      case 'unlock': {
        // Owner/Admin
        if (!['owner', 'admin'].includes(user.role)) {
          return forbiddenResponse('Insufficient permissions');
        }
        
        const { error } = await supabase
          .from('users')
          .update({ 
            locked_until: null, 
            failed_login_attempts: 0,
            updated_at: new Date().toISOString() 
          })
          .eq('id', id);
        
        if (error) throw error;
        
        logAuditEvent({
          action: 'user.unlocked',
          userId: user.id,
          targetId: id,
          targetType: 'user',
          request,
        }).catch(() => {});
        
        break;
      }
      
      case 'reactivate': {
        // Owner only
        if (user.role !== 'owner') {
          return forbiddenResponse('Only Owner can reactivate users');
        }
        
        const { error } = await supabase
          .from('users')
          .update({ 
            is_active: true,
            updated_at: new Date().toISOString() 
          })
          .eq('id', id);
        
        if (error) throw error;
        
        logAuditEvent({
          action: 'user.reactivated',
          userId: user.id,
          targetId: id,
          targetType: 'user',
          request,
        }).catch(() => {});
        
        break;
      }
      
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
    
    // Fetch updated user
    const { data: updatedUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    return NextResponse.json({ user: updatedUser, success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
